import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-chrome-laptop-" + Date.now());
const ARTIFACTS_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9227",
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
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9227/json/version");
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {
      await sleep(300);
    }
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
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false,
    });

    console.log("Navigating to http://localhost:3000 ...");
    await sendSession("Page.navigate", { url: "http://localhost:3000" });
    await sleep(4500);

    // Scroll to laptop position in Light Mode
    console.log("Scrolling to laptop position in Light Mode...");
    await sendSession("Runtime.evaluate", {
      expression: `window.scrollTo({ top: 380, behavior: "instant" })`,
    });
    await sleep(2000);

    const lightLaptopShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, "laptop_light_mode.png"), Buffer.from(lightLaptopShot.data, "base64"));

    // Switch to Dark Mode
    console.log("Switching to Dark Mode...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const btn = document.querySelector('button[data-slot="theme-toggle"]');
        if (btn) btn.click();
      })()`,
    });
    await sleep(2000);

    const darkLaptopShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, "laptop_dark_mode.png"), Buffer.from(darkLaptopShot.data, "base64"));

    // Inspect video element, canvas, and Three.js state
    const diag = await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const vids = Array.from(document.querySelectorAll("video"));
        const canvases = Array.from(document.querySelectorAll("canvas"));
        const canvas = canvases[0];
        const ctx = canvas ? window.getComputedStyle(canvas) : null;
        return {
          videoCount: vids.length,
          canvasStyle: ctx ? {
            opacity: ctx.opacity,
            mixBlendMode: ctx.mixBlendMode,
            filter: ctx.filter,
            visibility: ctx.visibility,
            display: ctx.display
          } : null,
          videoDetails: vids.map(v => ({
            src: v.src,
            paused: v.paused,
            readyState: v.readyState,
            currentTime: v.currentTime,
            duration: v.duration,
            videoWidth: v.videoWidth,
            videoHeight: v.videoHeight
          }))
        };
      })()`,
      returnByValue: true,
    });
    console.log("Laptop Diagnostics:", JSON.stringify(diag.result.value, null, 2));

    ws.close();
    chromeProc.kill();
  } catch (err) {
    console.error("Laptop test failed:", err);
    try { chromeProc.kill(); } catch {}
  }
}

main();
