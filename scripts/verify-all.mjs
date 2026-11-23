import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const ARTIFACT_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-chrome-verifyall-" + Date.now());

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9299",
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
      const res = await fetch("http://127.0.0.1:9299/json/version");
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch { }
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
    await sleep(5000);

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

    // Function to capture clip or full
    async function captureScreenshot(filepath, clip = null) {
      const params = { format: "png" };
      if (clip) params.clip = clip;
      const res = await sendSession("Page.captureScreenshot", params);
      fs.writeFileSync(filepath, Buffer.from(res.data, "base64"));
      console.log(`Saved screenshot: ${filepath}`);
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
        await sleep(400);

        // Capture nav top area (height 160 or 400 if open)
        const closedClip = { x: 0, y: 0, width: w, height: 140, scale: 1 };
        const filenameClosed = path.join(ARTIFACT_DIR, `nav_${theme}_${w}_closed.png`);
        await captureScreenshot(filenameClosed, closedClip);

        // If mobile, capture open state
        if (w <= 600) {
          // Click hamburger button
          await sendSession("Runtime.evaluate", {
            expression: `(() => {
              const btn = document.querySelector('.sa-nav .mob .btn-toggle');
              if (btn) btn.click();
            })()`,
          });
          await sleep(500);

          const openClip = { x: 0, y: 0, width: w, height: 480, scale: 1 };
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

    // Measure nav performance under 4x CPU slowdown in dark mode
    console.log("Measuring nav performance with 4x CPU slowdown...");
    await setTheme("dark");
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sendSession("Emulation.setCPUThrottlingRate", { rate: 4 });
    await sleep(500);

    const perfData = await sendSession("Runtime.evaluate", {
      returnByValue: true,
      awaitPromise: true,
      expression: `(async () => {
        const frameTimes = [];
        let lastTime = performance.now();
        let recording = true;

        function recordFrame() {
          if (!recording) return;
          const now = performance.now();
          frameTimes.push(now - lastTime);
          lastTime = now;
          requestAnimationFrame(recordFrame);
        }
        requestAnimationFrame(recordFrame);

        // Click nav items
        const links = Array.from(document.querySelectorAll('.sa-nav .desk .it'));
        for (let idx of [1, 2, 3, 4, 1]) {
          if (links[idx]) {
            links[idx].click();
            await new Promise(r => setTimeout(r, 400));
          }
        }

        await new Promise(r => setTimeout(r, 200));
        recording = false;

        const longFrames = frameTimes.filter(t => t > 16.6);
        const maxFrame = Math.max(...frameTimes);
        const avgFrame = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;

        return {
          totalFrames: frameTimes.length,
          longFramesCount: longFrames.length,
          longFramesPct: ((longFrames.length / frameTimes.length) * 100).toFixed(1) + '%',
          maxFrameMs: maxFrame.toFixed(2),
          avgFrameMs: avgFrame.toFixed(2),
          sampleLongFrames: longFrames.slice(0, 10).map(t => t.toFixed(2))
        };
      })()`,
    });

    await sendSession("Emulation.setCPUThrottlingRate", { rate: 1 });
    const perfRes = perfData.result ? perfData.result.value : perfData.value;
    fs.writeFileSync("scripts/nav-perf-fixed.json", JSON.stringify(perfRes, null, 2));
    console.log("Nav Performance Fixed (CPU 4x):", perfRes);

    // Verify logo in dark mode vs light mode
    const logoAudit = await sendSession("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const darkLogo = document.querySelector('.sa-nav .logo img');
        const darkLogoStyle = window.getComputedStyle(darkLogo);
        const navBar = document.querySelector('.sa-nav .bar');
        const navBarStyle = window.getComputedStyle(navBar);
        return {
          logoSrc: darkLogo ? darkLogo.src : null,
          logoContent: darkLogoStyle.content,
          navBarBg: navBarStyle.backgroundColor,
          navBarBackdropFilter: navBarStyle.backdropFilter
        };
      })()`,
    });
    console.log("Dark Nav Logo & Bar Audit:", logoAudit.result ? logoAudit.result.value : logoAudit.value);

  } catch (err) {
    console.error("Verification error:", err);
  } finally {
    chromeProc.kill();
    process.exit(0);
  }
}

main();
