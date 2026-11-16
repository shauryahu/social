import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-chrome-profile-" + Date.now());
const PREVIEWS_DIR = path.join(process.cwd(), "public", "previews");

if (!fs.existsSync(PREVIEWS_DIR)) {
  fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
}

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9222",
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
      const res = await fetch("http://127.0.0.1:9222/json/version");
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

    console.log("Waiting for loading screen & animations ...");
    await sleep(4000);

    // 1. Capture Hero Section
    console.log("Capturing 1_hero.png ...");
    const heroShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "1_hero.png"), Buffer.from(heroShot.data, "base64"));

    // 2. Scroll to Laptop Section
    console.log("Scrolling to 3D Laptop ...");
    await sendSession("Runtime.evaluate", {
      expression: `window.scrollTo(0, 900)`,
    });
    await sleep(3500);

    console.log("Capturing 2_laptop_3d.png ...");
    const laptopShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "2_laptop_3d.png"), Buffer.from(laptopShot.data, "base64"));

    // 3. Scroll to Verification Section
    console.log("Scrolling to Verification Section ...");
    const verifY = await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const el = document.getElementById("verification");
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + rect.top - 40);
          return window.scrollY;
        }
        return -1;
      })()`,
      returnByValue: true,
    });
    console.log("Verification scrolled to Y:", verifY?.result?.value);
    await sleep(2000);

    console.log("Capturing 3_official_verification.png ...");
    const verifShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "3_official_verification.png"), Buffer.from(verifShot.data, "base64"));

    // 4. Scroll to Platforms Ecosystem
    console.log("Scrolling to Platforms Section ...");
    const platY = await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const el = document.getElementById("platforms") || document.getElementById("services");
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + rect.top - 40);
          return window.scrollY;
        }
        return -1;
      })()`,
      returnByValue: true,
    });
    console.log("Platforms scrolled to Y:", platY?.result?.value);
    await sleep(2000);

    console.log("Capturing 4_platforms_services.png ...");
    const platShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "4_platforms_services.png"), Buffer.from(platShot.data, "base64"));

    // 5. Expand Dynamic Glass Navigation Bar
    console.log("Expanding Dynamic Navigation Bar ...");
    const clickResult = await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const btn = document.querySelector("button[aria-expanded]") || document.querySelector("button[title*='Menu']");
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      })()`,
      returnByValue: true,
    });
    console.log("Menu clicked:", clickResult?.result?.value);
    await sleep(1000);

    console.log("Capturing 5_dynamic_glass_navigation.png ...");
    const navShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "5_dynamic_glass_navigation.png"), Buffer.from(navShot.data, "base64"));

    console.log("All screenshots captured successfully!");
    ws.close();
  } finally {
    chromeProc.kill();
    try {
      fs.rmSync(USER_DATA, { recursive: true, force: true });
    } catch {}
  }
}

main().catch((err) => {
  console.error("Error in capture script:", err);
  process.exit(1);
});
