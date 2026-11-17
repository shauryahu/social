import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-why-chrome-" + Date.now());
const PREVIEWS_DIR = path.join(process.cwd(), "public", "previews");
const BRAIN_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";

if (!fs.existsSync(PREVIEWS_DIR)) {
  fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
}

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9232",
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
      const res = await fetch("http://127.0.0.1:9232/json/version");
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

    console.log("Navigating to http://localhost:3000/ ...");
    await sendSession("Page.navigate", { url: "http://localhost:3000" });
    await sleep(4000);

    // Scroll to Why SocialAssist carousel
    console.log("Scrolling to Why SocialAssist section...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const carousel = document.querySelector(".clc-root");
        if (carousel) {
          const rect = carousel.getBoundingClientRect();
          window.scrollTo({
            top: window.scrollY + rect.top - 120,
            behavior: "instant"
          });
        }
      })()`,
    });
    await sleep(2500);

    console.log("Capturing desktop light mode (Established Experience)...");
    const desktopLight = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "why_carousel_established_light.png"), Buffer.from(desktopLight.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "why_carousel_established_light.png"), Buffer.from(desktopLight.data, "base64"));
    console.log("Saved why_carousel_established_light.png!");

    // Navigate to next slide: Multi-Platform
    console.log("Clicking Next slide (Multi-Platform)...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const nextBtn = document.querySelector('button[aria-label="Next slide"]');
        if (nextBtn) nextBtn.click();
      })()`,
    });
    await sleep(1500);

    const multiPlatformLight = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "why_carousel_multi_platform_light.png"), Buffer.from(multiPlatformLight.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "why_carousel_multi_platform_light.png"), Buffer.from(multiPlatformLight.data, "base64"));
    console.log("Saved why_carousel_multi_platform_light.png!");

    // Navigate backwards to Slide 5: Direct Communication
    console.log("Clicking Previous slide twice to go to Direct Communication...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const prevBtn = document.querySelector('button[aria-label="Previous slide"]');
        if (prevBtn) {
          prevBtn.click();
          setTimeout(() => prevBtn.click(), 400);
        }
      })()`,
    });
    await sleep(1800);

    const directCommLight = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "why_carousel_direct_comm_light.png"), Buffer.from(directCommLight.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "why_carousel_direct_comm_light.png"), Buffer.from(directCommLight.data, "base64"));
    console.log("Saved why_carousel_direct_comm_light.png!");

    // Return to Established Experience
    console.log("Clicking Next to return to Established Experience...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const nextBtn = document.querySelector('button[aria-label="Next slide"]');
        if (nextBtn) nextBtn.click();
      })()`,
    });
    await sleep(1200);

    // Switch to Dark Mode for Established Experience
    console.log("Toggling Dark Mode via localStorage & event...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        localStorage.setItem("socialassist-theme", "dark");
        window.dispatchEvent(new Event("socialassist-theme-change"));
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      })()`,
    });
    await sleep(2000);

    console.log("Capturing desktop dark mode (Established Experience)...");
    const establishedDark = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "why_carousel_established_dark.png"), Buffer.from(establishedDark.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "why_carousel_established_dark.png"), Buffer.from(establishedDark.data, "base64"));
    console.log("Saved why_carousel_established_dark.png!");

    // Switch to Mobile Viewport
    console.log("Switching to Mobile Viewport (390x844)...");
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sleep(1000);

    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const carousel = document.querySelector(".clc-root");
        if (carousel) {
          const rect = carousel.getBoundingClientRect();
          window.scrollTo({
            top: window.scrollY + rect.top - 60,
            behavior: "instant"
          });
        }
      })()`,
    });
    await sleep(1500);

    console.log("Capturing mobile Established Experience carousel...");
    const mobileShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "why_carousel_established_mobile.png"), Buffer.from(mobileShot.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "why_carousel_established_mobile.png"), Buffer.from(mobileShot.data, "base64"));
    console.log("Saved why_carousel_established_mobile.png!");

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
