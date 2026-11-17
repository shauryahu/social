import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-inquiry-chrome-" + Date.now());
const PREVIEWS_DIR = path.join(process.cwd(), "public", "previews");
const BRAIN_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";

if (!fs.existsSync(PREVIEWS_DIR)) {
  fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
}

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9225",
    `--user-data-dir=${USER_DATA}`,
    "--window-size=1440,1100",
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
      const res = await fetch("http://127.0.0.1:9225/json/version");
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
      height: 1100,
      deviceScaleFactor: 2,
      mobile: false,
    });

    console.log("Navigating to http://localhost:3000 ...");
    await sendSession("Page.navigate", { url: "http://localhost:3000" });
    await sleep(3500);

    // Scroll to inquiry section
    console.log("Scrolling to inquiry form...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const el = document.getElementById("inquiry");
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + rect.top - 40);
        }
      })()`,
    });
    await sleep(1500);

    // Desktop screenshot
    console.log("Capturing desktop inquiry form...");
    const desktopShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "inquiry_form_desktop.png"), Buffer.from(desktopShot.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "inquiry_form_desktop.png"), Buffer.from(desktopShot.data, "base64"));
    console.log("Saved inquiry_form_desktop.png!");

    // Switch to Mobile
    console.log("Switching to mobile viewport (390x1500)...");
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 1500,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sleep(1000);

    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const el = document.getElementById("inquiry");
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + rect.top - 20);
        }
      })()`,
    });
    await sleep(1500);

    console.log("Capturing mobile inquiry form...");
    const mobileShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "inquiry_form_mobile.png"), Buffer.from(mobileShot.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "inquiry_form_mobile.png"), Buffer.from(mobileShot.data, "base64"));
    console.log("Saved inquiry_form_mobile.png!");

    // Switch to Dark Mode Desktop
    console.log("Switching to Dark Mode...");
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 1100,
      deviceScaleFactor: 2,
      mobile: false,
    });
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        localStorage.setItem("socialassist_theme", "dark");
        document.documentElement.classList.add("dark");
      })()`,
    });
    await sendSession("Page.reload");
    await sleep(3500);

    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const el = document.getElementById("inquiry");
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + rect.top - 40);
        }
      })()`,
    });
    await sleep(1500);

    console.log("Capturing dark mode inquiry form...");
    const darkShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "inquiry_form_dark.png"), Buffer.from(darkShot.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "inquiry_form_dark.png"), Buffer.from(darkShot.data, "base64"));
    console.log("Saved inquiry_form_dark.png!");

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
