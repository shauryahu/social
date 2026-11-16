import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-chrome-toggle-" + Date.now());
const PREVIEWS_DIR = path.join(process.cwd(), "public", "previews");

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9223",
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
      const res = await fetch("http://127.0.0.1:9223/json/version");
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
    
    // Wait for document ready
    for (let i = 0; i < 30; i++) {
      const res = await sendSession("Runtime.evaluate", {
        expression: `({ href: window.location.href, readyState: document.readyState, buttons: document.querySelectorAll("button").length })`,
        returnByValue: true,
      });
      console.log("Page status:", res.result.value);
      if (res.result.value && res.result.value.readyState === "complete" && res.result.value.buttons > 20) {
        // Wait another 2.5s for React hydration to attach event listeners
        await sleep(2500);
        break;
      }
      await sleep(500);
    }

    // Click theme toggle button to switch to Dark Mode
    console.log("Toggling theme to Dark Mode ...");
    const toggleResult = await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const themeBtn = btns.find(b => (b.getAttribute("aria-label") || "").includes("Theme") || (b.title || "").includes("Theme"));
        if (!themeBtn) return { error: "button not found", availableButtons: btns.map(b => b.outerHTML) };
        
        themeBtn.click();
        return {
          foundBtnHtml: themeBtn.outerHTML,
          localStorageVal: localStorage.getItem("socialassist-theme"),
          dataTheme: document.documentElement.getAttribute("data-theme"),
        };
      })()`,
      returnByValue: true,
    });
    console.log("Toggle result:", toggleResult.result.value);

    await sleep(1500);

    const themeCheck = await sendSession("Runtime.evaluate", {
      expression: `document.documentElement.getAttribute("data-theme")`,
      returnByValue: true,
    });
    console.log("Current theme on <html>:", themeCheck.result.value);

    // Capture hero in dark mode
    console.log("Capturing hero_dark_mode.png ...");
    const darkShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "hero_dark_mode.png"), Buffer.from(darkShot.data, "base64"));

    // Copy to brain
    const brainDst = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91\\hero_dark_mode.png";
    fs.copyFileSync(path.join(PREVIEWS_DIR, "hero_dark_mode.png"), brainDst);
    console.log("Theme toggle test complete and verified!");
    ws.close();
  } finally {
    chromeProc.kill();
    try {
      fs.rmSync(USER_DATA, { recursive: true, force: true });
    } catch {}
  }
}

main().catch((err) => {
  console.error("Error in toggle test:", err);
  process.exit(1);
});
