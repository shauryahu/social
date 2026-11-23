import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BRAIN_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";
const USER_DATA = path.join(process.cwd(), ".chrome-profile-orbit");

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9264",
    `--user-data-dir=${USER_DATA}`,
    "--window-size=1440,1100",
    "--hide-scrollbars",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ],
  { stdio: "inherit" }
);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getDebuggerUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9264/json/version");
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {
      await sleep(400);
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

    // 1. Desktop Light Mode
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 1100,
      deviceScaleFactor: 2,
      mobile: false,
    });

    console.log("Navigating to http://localhost:3000 ...");
    await sendSession("Page.navigate", { url: "http://localhost:3000" });
    await sleep(4000);

    console.log("Setting Light Theme and scrolling to #automation...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        localStorage.setItem("socialassist-theme", "light");
        window.dispatchEvent(new Event("socialassist-theme-change"));
        document.documentElement.setAttribute("data-theme", "light");
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        const el = document.getElementById("automation");
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + rect.top - 60);
        }
      })()`,
    });
    await sleep(2500);

    const shotLight = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(BRAIN_DIR, "orbit_all_logos_desktop_light.png"), Buffer.from(shotLight.data, "base64"));
    console.log("Saved orbit_all_logos_desktop_light.png!");

    // 2. Desktop Dark Mode
    console.log("Setting Dark Theme...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        localStorage.setItem("socialassist-theme", "dark");
        window.dispatchEvent(new Event("socialassist-theme-change"));
        document.documentElement.setAttribute("data-theme", "dark");
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
      })()`,
    });
    await sleep(2000);

    const shotDark = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(BRAIN_DIR, "orbit_all_logos_desktop_dark.png"), Buffer.from(shotDark.data, "base64"));
    console.log("Saved orbit_all_logos_desktop_dark.png!");

    // 3. Mobile Viewport (390 x 844)
    console.log("Setting Mobile Viewport...");
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const el = document.getElementById("automation");
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + rect.top - 50);
        }
      })()`,
    });
    await sleep(2000);

    const shotMobile = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(BRAIN_DIR, "orbit_all_logos_mobile.png"), Buffer.from(shotMobile.data, "base64"));
    console.log("Saved orbit_all_logos_mobile.png!");

    ws.close();
  } catch (err) {
    console.error("Error during capture:", err);
  } finally {
    try {
      chromeProc.kill();
    } catch {}
  }
}

main();
