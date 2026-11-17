import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-blur-chrome-" + Date.now());
const BRAIN_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9244",
    `--user-data-dir=${USER_DATA}`,
    "--window-size=1440,1000",
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
      const res = await fetch("http://127.0.0.1:9244/json/version");
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
      height: 1000,
      deviceScaleFactor: 2,
      mobile: false,
    });

    console.log("Navigating to http://localhost:3000/ ...");
    await sendSession("Page.navigate", { url: "http://localhost:3000" });
    await sleep(4000);

    // Scroll slightly so content passes under the bottom blur
    await sendSession("Runtime.evaluate", {
      expression: `window.scrollTo({ top: 600, behavior: "instant" })`,
    });
    await sleep(1500);

    console.log("Capturing downside blur light mode...");
    const lightShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(BRAIN_DIR, "progressive_blur_downside_light.png"), Buffer.from(lightShot.data, "base64"));
    console.log("Saved progressive_blur_downside_light.png!");

    // Switch to dark mode
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        localStorage.setItem("socialassist-theme", "dark");
        window.dispatchEvent(new Event("socialassist-theme-change"));
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      })()`,
    });
    await sleep(1500);

    console.log("Capturing downside blur dark mode...");
    const darkShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(BRAIN_DIR, "progressive_blur_downside_dark.png"), Buffer.from(darkShot.data, "base64"));
    console.log("Saved progressive_blur_downside_dark.png!");

    ws.close();
  } catch (err) {
    console.error("Capture error:", err);
  } finally {
    try {
      chromeProc.kill("SIGKILL");
    } catch {}
    try {
      fs.rmSync(USER_DATA, { recursive: true, force: true });
    } catch {}
  }
}

main();
