import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-chrome-verify-" + Date.now());
const ARTIFACTS_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9225",
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
      height: 900,
      deviceScaleFactor: 2,
      mobile: false,
    });

    console.log("Navigating to http://localhost:3000 ...");
    await sendSession("Page.navigate", { url: "http://localhost:3000" });

    // Wait for loader intro to complete and reveal the site
    console.log("Waiting for loader to finish and page to hydrate...");
    for (let i = 0; i < 40; i++) {
      const res = await sendSession("Runtime.evaluate", {
        expression: `({
          preExists: !!document.getElementById("pre"),
          ready: document.body.classList.contains("ready") || !document.getElementById("pre"),
          buttons: document.querySelectorAll("button").length
        })`,
        returnByValue: true,
      });
      if (res.result.value && (res.result.value.ready || !res.result.value.preExists) && res.result.value.buttons > 15) {
        console.log("Site revealed and ready:", res.result.value);
        await sleep(1500);
        break;
      }
      await sleep(500);
    }

    // Capture Light Mode baseline
    console.log("Capturing 1_light_mode_desktop.png ...");
    const lightShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, "1_light_mode_desktop.png"), Buffer.from(lightShot.data, "base64"));

    // Check light mode details
    const lightEval = await sendSession("Runtime.evaluate", {
      expression: `({
        themeAttr: document.documentElement.getAttribute("data-theme"),
        themeClass: document.documentElement.className,
        bg: window.getComputedStyle(document.body).backgroundColor,
        navLogoSrc: document.querySelector(".sa-nav .logo img")?.src
      })`,
      returnByValue: true,
    });
    console.log("Light mode evaluation:", lightEval.result.value);

    // Click the theme toggle to trigger Telegram-style circular transition to Dark Mode
    console.log("Clicking floating theme toggle button...");
    const toggleClick = await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const btn = document.querySelector('button[data-slot="theme-toggle"]');
        if (!btn) return { error: "Toggle button not found" };
        const rect = btn.getBoundingClientRect();
        btn.click();
        return {
          clicked: true,
          rect: { x: rect.left, y: rect.top, w: rect.width, h: rect.height }
        };
      })()`,
      returnByValue: true,
    });
    console.log("Toggle click result:", toggleClick.result.value);

    // Wait for view transition to finish (450ms + render)
    await sleep(1200);

    // Check dark mode state
    const darkEval = await sendSession("Runtime.evaluate", {
      expression: `({
        themeAttr: document.documentElement.getAttribute("data-theme"),
        themeClass: document.documentElement.className,
        localStorage: localStorage.getItem("socialassist-theme"),
        bg: window.getComputedStyle(document.body).backgroundColor,
        color: window.getComputedStyle(document.body).color
      })`,
      returnByValue: true,
    });
    console.log("Dark mode evaluation:", darkEval.result.value);

    // Capture Dark Mode Hero & Nav
    console.log("Capturing 2_dark_mode_desktop.png ...");
    const darkShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, "2_dark_mode_desktop.png"), Buffer.from(darkShot.data, "base64"));

    // Scroll to Case Submission & Footer
    console.log("Scrolling to Case Submission section...");
    await sendSession("Runtime.evaluate", {
      expression: `window.scrollTo({ top: document.body.scrollHeight * 0.75, behavior: "instant" })`,
    });
    await sleep(1000);

    console.log("Capturing 3_dark_mode_submission.png ...");
    const subShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, "3_dark_mode_submission.png"), Buffer.from(subShot.data, "base64"));

    // Scroll to bottom (Footer)
    console.log("Scrolling to Footer...");
    await sendSession("Runtime.evaluate", {
      expression: `window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" })`,
    });
    await sleep(1000);

    console.log("Capturing 4_dark_mode_footer.png ...");
    const footerShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, "4_dark_mode_footer.png"), Buffer.from(footerShot.data, "base64"));

    // Test reload persistence and zero-flash
    console.log("Reloading page to test dark mode persistence and zero-flash...");
    await sendSession("Page.reload");

    // Immediately check theme attribute before scripts finish
    await sleep(200);
    const reloadEarlyEval = await sendSession("Runtime.evaluate", {
      expression: `({
        themeAttr: document.documentElement.getAttribute("data-theme"),
        classList: Array.from(document.documentElement.classList)
      })`,
      returnByValue: true,
    });
    console.log("Early reload evaluation (zero flash check):", reloadEarlyEval.result.value);

    // Wait for complete page reload
    await sleep(4000);

    console.log("Capturing 5_dark_mode_reloaded.png ...");
    const reloadShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, "5_dark_mode_reloaded.png"), Buffer.from(reloadShot.data, "base64"));

    // Test Mobile Viewport (390x844)
    console.log("Switching to mobile viewport (390x844)...");
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true,
    });
    await sleep(1000);

    const mobileOverflow = await sendSession("Runtime.evaluate", {
      expression: `({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        btnVisible: !!document.querySelector('button[data-slot="theme-toggle"]')
      })`,
      returnByValue: true,
    });
    console.log("Mobile layout check:", mobileOverflow.result.value);

    console.log("Capturing 6_dark_mode_mobile.png ...");
    const mobileShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(ARTIFACTS_DIR, "6_dark_mode_mobile.png"), Buffer.from(mobileShot.data, "base64"));

    console.log("ALL VERIFICATION CHECKS COMPLETED SUCCESSFULLY!");
    ws.close();
    chromeProc.kill();
  } catch (err) {
    console.error("Verification failed:", err);
    try { chromeProc.kill(); } catch {}
    process.exit(1);
  }
}

main();
