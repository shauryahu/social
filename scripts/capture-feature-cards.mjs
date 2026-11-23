import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PREVIEWS_DIR = path.join(process.cwd(), "public", "previews");
const BRAIN_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";
const USER_DATA = path.join(process.cwd(), ".chrome-profile-cards");

if (!fs.existsSync(PREVIEWS_DIR)) {
  fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
}

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9266",
    `--user-data-dir=${USER_DATA}`,
    "--window-size=1440,1100",
    "--hide-scrollbars",
    "--disable-gpu",
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
      const res = await fetch("http://127.0.0.1:9266/json/version");
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

    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 1100,
      deviceScaleFactor: 2,
      mobile: false,
    });

    console.log("Navigating to http://localhost:3000/#automation ...");
    await sendSession("Page.navigate", { url: "http://localhost:3000" });
    await sleep(3500);

    // 1. Light Mode - Idle state
    console.log("Setting Light Mode & scrolling to section...");
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
          window.scrollTo(0, window.scrollY + rect.top - 70);
        }
      })()`,
    });
    await sleep(1500);

    const shot01 = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "feature_cards_light_idle.png"), Buffer.from(shot01.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "feature_cards_light_idle.png"), Buffer.from(shot01.data, "base64"));
    console.log("Saved feature_cards_light_idle.png");

    // 2. Light Mode - Hover on Card 01 (Expansion)
    console.log("Hovering over Card 01...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const cards = document.querySelectorAll('#automation [role=\"button\"]');
        if (cards[0]) {
          cards[0].dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
          cards[0].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        }
      })()`,
    });
    await sleep(900); // allow 500ms expansion animation to complete

    const shot02 = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "feature_cards_light_expanded.png"), Buffer.from(shot02.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "feature_cards_light_expanded.png"), Buffer.from(shot02.data, "base64"));
    console.log("Saved feature_cards_light_expanded.png");

    // 3. Switch Hover to Card 02 (Seamless transition between cards)
    console.log("Switching hover to Card 02...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const cards = document.querySelectorAll('#automation [role=\"button\"]');
        if (cards[0]) cards[0].dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        if (cards[1]) {
          cards[1].dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
          cards[1].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        }
      })()`,
    });
    await sleep(900);

    const shot02b = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "feature_cards_light_expanded_02.png"), Buffer.from(shot02b.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "feature_cards_light_expanded_02.png"), Buffer.from(shot02b.data, "base64"));
    console.log("Saved feature_cards_light_expanded_02.png");

    // 4. Dark Mode View with Card 03 Hovered/Expanded
    console.log("Setting Dark Mode & hovering Card 03...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        localStorage.setItem("socialassist-theme", "dark");
        window.dispatchEvent(new Event("socialassist-theme-change"));
        document.documentElement.setAttribute("data-theme", "dark");
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        const cards = document.querySelectorAll('#automation [role=\"button\"]');
        if (cards[1]) cards[1].dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        if (cards[2]) {
          cards[2].dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
          cards[2].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        }
      })()`,
    });
    await sleep(900);

    const shot03 = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "feature_cards_dark_expanded.png"), Buffer.from(shot03.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "feature_cards_dark_expanded.png"), Buffer.from(shot03.data, "base64"));
    console.log("Saved feature_cards_dark_expanded.png");

    // 5. Mobile Viewport (Tap to expand)
    console.log("Switching to Mobile Viewport...");
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sleep(600);

    // Scroll to the cards on mobile
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const cards = document.querySelectorAll('#automation [role=\"button\"]');
        if (cards[0]) {
          const rect = cards[0].getBoundingClientRect();
          window.scrollTo(0, window.scrollY + rect.top - 40);
        }
      })()`,
    });
    await sleep(600);

    // Tap Card 01 on mobile
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const cards = document.querySelectorAll('#automation [role=\"button\"]');
        if (cards[0]) cards[0].click();
      })()`,
    });
    await sleep(800);

    const shot04 = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "feature_cards_mobile_expanded.png"), Buffer.from(shot04.data, "base64"));
    fs.writeFileSync(path.join(BRAIN_DIR, "feature_cards_mobile_expanded.png"), Buffer.from(shot04.data, "base64"));
    console.log("Saved feature_cards_mobile_expanded.png");

    ws.close();
  } catch (err) {
    console.error("Capture Error:", err);
  } finally {
    try {
      chromeProc.kill();
    } catch {}
  }
}

main();
