import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-journey-chrome-" + Date.now());
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
      height: 1100,
      deviceScaleFactor: 2,
      mobile: false,
    });

    console.log("Navigating to http://localhost:3000 ...");
    await sendSession("Page.navigate", { url: "http://localhost:3000" });
    await sleep(3500);

    // Scroll directly to the About / Timeline section
    console.log("Scrolling to Journey Timeline...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const el = document.getElementById("about");
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + rect.top - 60);
        }
      })()`,
    });
    await sleep(1500);

    // 1. Capture Settled Milestone 01 (Screenshot 2 equivalent)
    console.log("Capturing Settled Milestone 01 (2021 Foundation)...");
    const shot01 = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "journey_timeline_01.png"), Buffer.from(shot01.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "journey_timeline_01.png"), Buffer.from(shot01.data, "base64"));
    console.log("Saved journey_timeline_01.png!");

    // 2. Simulate Mid-Transition state (wheel scroll delta dispatch inside container)
    console.log("Simulating real-time wheel scroll mid-transition...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const container = document.querySelector('[data-testid="journey-scroll-timeline-container"]');
        if (container) {
          container.dispatchEvent(new WheelEvent("wheel", { deltaY: 140, bubbles: true, cancelable: true }));
        }
      })()`,
    });
    await sleep(60); // catch frame during active transition
    const shotTransition = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "journey_timeline_transition.png"), Buffer.from(shotTransition.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "journey_timeline_transition.png"), Buffer.from(shotTransition.data, "base64"));
    console.log("Saved journey_timeline_transition.png!");

    await sleep(800); // let it settle on Milestone 02

    // 3. Capture Settled Milestone 02
    console.log("Capturing Settled Milestone 02 (2022 Expansion)...");
    const shot02 = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "journey_timeline_02.png"), Buffer.from(shot02.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "journey_timeline_02.png"), Buffer.from(shot02.data, "base64"));
    console.log("Saved journey_timeline_02.png!");

    // 4. Click Milestone 03
    console.log("Navigating to Milestone 03...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const buttons = Array.from(document.querySelectorAll('[data-testid="journey-scroll-timeline-container"] button'));
        const btn = buttons.find(b => b.innerText.includes("03") || b.innerText.includes("Evolution"));
        if (btn) btn.click();
      })()`,
    });
    await sleep(900);
    const shot03 = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "journey_timeline_03.png"), Buffer.from(shot03.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "journey_timeline_03.png"), Buffer.from(shot03.data, "base64"));
    console.log("Saved journey_timeline_03.png!");

    // 5. Click Milestone 04
    console.log("Navigating to Milestone 04...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const buttons = Array.from(document.querySelectorAll('[data-testid="journey-scroll-timeline-container"] button'));
        const btn = buttons.find(b => b.innerText.includes("04") || b.innerText.includes("Network"));
        if (btn) btn.click();
      })()`,
    });
    await sleep(900);
    const shot04 = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "journey_timeline_04.png"), Buffer.from(shot04.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "journey_timeline_04.png"), Buffer.from(shot04.data, "base64"));
    console.log("Saved journey_timeline_04.png!");

    // 6. Switch to Dark Mode Desktop
    console.log("Switching to Dark Mode...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        localStorage.setItem("socialassist-theme", "dark");
        document.documentElement.setAttribute("data-theme", "dark");
        document.documentElement.classList.add("dark");
        window.dispatchEvent(new Event("socialassist-theme-change"));
      })()`,
    });
    await sleep(1000);
    const shotDark = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "journey_timeline_dark.png"), Buffer.from(shotDark.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "journey_timeline_dark.png"), Buffer.from(shotDark.data, "base64"));
    console.log("Saved journey_timeline_dark.png!");

    // 7. Mobile Viewport (390x1000)
    console.log("Switching to mobile viewport (390x1000)...");
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 1000,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sleep(1000);
    const shotMobile = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "journey_timeline_mobile.png"), Buffer.from(shotMobile.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "journey_timeline_mobile.png"), Buffer.from(shotMobile.data, "base64"));
    console.log("Saved journey_timeline_mobile.png!");

    ws.close();
    chromeProc.kill();
    console.log("All journey timeline captures completed successfully!");
  } catch (err) {
    console.error("Capture failed:", err);
    chromeProc.kill();
    process.exit(1);
  }
}

main();
