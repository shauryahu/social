import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-lang-chrome-" + Date.now());
const PREVIEWS_DIR = path.join(process.cwd(), "public", "previews");
const BRAIN_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";

if (!fs.existsSync(PREVIEWS_DIR)) {
  fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
}

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9228",
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
      const res = await fetch("http://127.0.0.1:9228/json/version");
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

    console.log("Waiting for LoadingScreen to complete...");
    await sleep(4500);

    const checkBtn = await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const btn = document.getElementById("language-selector-trigger");
        if (!btn) return "NO_BUTTON";
        const r = btn.getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
      })()`,
      returnByValue: true,
    });
    console.log("Language button rect:", checkBtn.result?.value);
    const bRect = checkBtn.result?.value;

    // 1. Capture Closed State at Bottom-Left
    console.log("Capturing closed language selector at bottom-left...");
    const closedShot = await sendSession("Page.captureScreenshot", {
      clip: {
        x: Math.max(0, (bRect?.x || 24) - 15),
        y: Math.max(0, (bRect?.y || 850) - 20),
        width: 260,
        height: 70,
        scale: 1,
      },
    });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "language_selector_closed.png"), Buffer.from(closedShot.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "language_selector_closed.png"), Buffer.from(closedShot.data, "base64"));
    console.log("Saved language_selector_closed.png!");

    // 2. Click button to Open Dropdown
    console.log("Clicking language dropdown button...");
    const clickEval = await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const btn = document.getElementById("language-selector-trigger");
        if (!btn) return "NOT_FOUND";
        btn.click();
        return "CLICKED";
      })()`,
      returnByValue: true,
    });
    console.log("Click result:", clickEval.result?.value);
    await sleep(800);

    const checkMenu = await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const m = document.querySelector("#language-selector-trigger ~ div[role='listbox']");
        if (!m) return "NO_MENU";
        const r = m.getBoundingClientRect();
        return { count: m.children.length, x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
      })()`,
      returnByValue: true,
    });
    console.log("Menu state after click:", checkMenu.result?.value);
    const mRect = checkMenu.result?.value;

    // Capture Open Menu State
    console.log("Capturing open dropdown menu...");
    const openShot = await sendSession("Page.captureScreenshot", {
      clip: {
        x: Math.max(0, (bRect?.x || 24) - 15),
        y: Math.max(0, (mRect?.y || 540) - 20),
        width: 320,
        height: Math.min(500, (bRect?.y || 860) - (mRect?.y || 540) + 70),
        scale: 1,
      },
    });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "language_selector_open.png"), Buffer.from(openShot.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "language_selector_open.png"), Buffer.from(openShot.data, "base64"));
    console.log("Saved language_selector_open.png!");

    // 3. Full Page with Bottom-Left Button
    console.log("Capturing full viewport...");
    const fullShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "language_selector_hero.png"), Buffer.from(fullShot.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "language_selector_hero.png"), Buffer.from(fullShot.data, "base64"));
    console.log("Saved language_selector_hero.png!");

    // 4. Test Light Mode
    console.log("Testing Light Mode...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        localStorage.setItem("socialassist_theme", "light");
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        document.documentElement.setAttribute("data-theme", "light");
      })()`,
    });
    await sleep(600);

    const openShotLight = await sendSession("Page.captureScreenshot", {
      clip: {
        x: Math.max(0, (bRect?.x || 24) - 15),
        y: Math.max(0, (mRect?.y || 540) - 20),
        width: 320,
        height: Math.min(500, (bRect?.y || 860) - (mRect?.y || 540) + 70),
        scale: 1,
      },
    });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "language_selector_light.png"), Buffer.from(openShotLight.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "language_selector_light.png"), Buffer.from(openShotLight.data, "base64"));
    console.log("Saved language_selector_light.png!");

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
