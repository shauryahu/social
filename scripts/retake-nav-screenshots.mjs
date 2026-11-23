import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const ARTIFACT_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-chrome-retake-" + Date.now());

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9298",
    `--user-data-dir=${USER_DATA}`,
    "--window-size=1440,900",
    "--hide-scrollbars",
    "--disable-gpu-sandbox",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ],
  { stdio: "ignore" }
);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getDebuggerUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9298/json/version");
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {}
    await sleep(250);
  }
  throw new Error("Could not connect to Chrome debugging port");
}

async function main() {
  try {
    const wsUrl = await getDebuggerUrl();
    const ws = new WebSocket(wsUrl);

    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const cb = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) cb.reject(new Error(msg.error.message));
        else cb.resolve(msg.result);
      }
    };

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        callbacks.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });

    function sendSession(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        callbacks.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
      });
    }

    await sendSession("Page.enable");
    await sendSession("DOM.enable");
    await sendSession("Page.navigate", { url: "http://localhost:3000" });
    await sleep(5500);

    // Ensure loader is gone
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const pre = document.getElementById('pre');
        if (pre) pre.remove();
        document.body.classList.remove('lock');
        document.body.classList.add('ready');
      })()`,
    });
    await sleep(500);

    // Function to set theme
    async function setTheme(theme) {
      await sendSession("Runtime.evaluate", {
        expression: `(() => {
          document.documentElement.setAttribute('data-theme', '${theme}');
          if ('${theme}' === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
          }
          localStorage.setItem('socialassist-theme', '${theme}');
          localStorage.setItem('theme', '${theme}');
          if (typeof window.syncShadowRoots === 'function') window.syncShadowRoots('${theme}');
          window.dispatchEvent(new Event('socialassist-theme-change'));
        })()`,
      });
      await sleep(600);
    }

    async function captureScreenshot(filepath, clip = null) {
      const params = { format: "png" };
      if (clip) params.clip = clip;
      const res = await sendSession("Page.captureScreenshot", params);
      fs.writeFileSync(filepath, Buffer.from(res.data, "base64"));
      console.log(`Saved screenshot: ${filepath} (${res.data.length} bytes base64)`);
    }

    const viewports = [390, 600, 768, 820, 1024, 1180, 1440];
    const themes = ["light", "dark"];

    for (const theme of themes) {
      await setTheme(theme);

      for (const w of viewports) {
        await sendSession("Emulation.setDeviceMetricsOverride", {
          width: w,
          height: 900,
          deviceScaleFactor: 2,
          mobile: w <= 600,
        });
        await sleep(350);

        // Capture nav top area
        const closedClip = { x: 0, y: 0, width: w, height: 120, scale: 1 };
        const filenameClosed = path.join(ARTIFACT_DIR, `nav_${theme}_${w}_closed.png`);
        await captureScreenshot(filenameClosed, closedClip);

        // If mobile, capture open state
        if (w <= 600) {
          await sendSession("Runtime.evaluate", {
            expression: `(() => {
              const btn = document.querySelector('.sa-nav .mob .btn-toggle');
              if (btn) btn.click();
            })()`,
          });
          await sleep(500);

          const openClip = { x: 0, y: 0, width: w, height: 500, scale: 1 };
          const filenameOpen = path.join(ARTIFACT_DIR, `nav_${theme}_${w}_open.png`);
          await captureScreenshot(filenameOpen, openClip);

          // Close it again
          await sendSession("Runtime.evaluate", {
            expression: `(() => {
              const btn = document.querySelector('.sa-nav .mob .btn-toggle');
              if (btn) btn.click();
            })()`,
          });
          await sleep(350);
        }
      }
    }

    console.log("All screenshots retaken successfully.");

  } catch (err) {
    console.error("Retake error:", err);
  } finally {
    chromeProc.kill();
    process.exit(0);
  }
}

main();
