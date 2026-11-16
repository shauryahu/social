import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-chrome-profile-" + Date.now());
const PREVIEWS_DIR = path.join(process.cwd(), "public", "previews");
const BRAIN_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";

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

    console.log("Waiting for page load ...");
    await sleep(4000);

    // 1. Capture Hero Section with Top Compact Waterline Capsule
    console.log("Capturing 1_hero.png ...");
    const heroShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "1_hero.png"), Buffer.from(heroShot.data, "base64"));

    // 2. Click a navigation tab to trigger Waterline liquid stretch & ripple
    console.log("Clicking 'Platforms' navigation tab to test Waterline liquid motion ...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const buttons = Array.from(document.querySelectorAll("nav button"));
        const platBtn = buttons.find(b => b.textContent.includes("Platforms"));
        if (platBtn) {
          platBtn.click();
          return "clicked Platforms";
        }
        return "not found";
      })()`,
    });
    await sleep(1500);

    // 3. Capture Waterline dynamic bar with active item on Platforms
    console.log("Capturing 5_dynamic_glass_navigation.png ...");
    const navShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "5_dynamic_glass_navigation.png"), Buffer.from(navShot.data, "base64"));

    // 4. Scroll to Laptop Section
    console.log("Scrolling to 3D Laptop ...");
    await sendSession("Runtime.evaluate", {
      expression: `window.scrollTo(0, 950)`,
    });
    await sleep(2500);
    console.log("Capturing 2_laptop_3d.png ...");
    const laptopShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "2_laptop_3d.png"), Buffer.from(laptopShot.data, "base64"));

    // 5. Scroll to Official Verification Section
    console.log("Scrolling to Official Verification Section ...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const el = document.getElementById("verification");
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + rect.top - 40);
        }
      })()`,
    });
    await sleep(2000);
    console.log("Capturing 3_official_verification.png ...");
    const verifShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "3_official_verification.png"), Buffer.from(verifShot.data, "base64"));

    // 6. Scroll to Platforms Ecosystem
    console.log("Scrolling to Platforms Section ...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const el = document.getElementById("platforms");
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + rect.top - 40);
        }
      })()`,
    });
    await sleep(2000);
    console.log("Capturing 4_platforms_services.png ...");
    const platShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "4_platforms_services.png"), Buffer.from(platShot.data, "base64"));

    // 6b. Scroll to Account Assistance
    console.log("Scrolling to Account Assistance ...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const el = document.querySelector(".dark-console-box");
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + rect.top - 80);
        }
      })()`,
    });
    await sleep(1500);
    const accShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "6_account_assistance.png"), Buffer.from(accShot.data, "base64"));

    // 6c. Scroll to Crypto Exchange
    console.log("Scrolling to Crypto Exchange ...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const el = document.getElementById("exchange");
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + rect.top - 60);
        }
      })()`,
    });
    await sleep(1500);
    const cryptoShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "8_crypto_exchange.png"), Buffer.from(cryptoShot.data, "base64"));

    // 6d. Scroll to Automated Ads
    console.log("Scrolling to Automated Ads ...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const el = document.getElementById("automation");
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + rect.top - 60);
        }
      })()`,
    });
    await sleep(1500);
    const adsShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "9_automated_ads.png"), Buffer.from(adsShot.data, "base64"));

    // 6e. Scroll to About Section
    console.log("Scrolling to About Section ...");
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
    const aboutShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "10_about_section.png"), Buffer.from(aboutShot.data, "base64"));

    // 6f. Scroll to Footer Section
    console.log("Scrolling to Footer Section ...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const el = document.querySelector("footer");
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + rect.top - 60);
        }
      })()`,
    });
    await sleep(1500);
    const footerShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "11_footer_section.png"), Buffer.from(footerShot.data, "base64"));

    // 7. Expand Dynamic Glass Navigation Bar
    console.log("Expanding Dynamic Navigation Bar ...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        window.scrollTo(0, 0);
        const btn = document.querySelector("button[aria-expanded]") || document.querySelector("button[title*='Menu']");
        if (btn) btn.click();
      })()`,
    });
    await sleep(1000);

    console.log("Capturing expanded_dynamic_bar.png ...");
    const expShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(PREVIEWS_DIR, "expanded_dynamic_bar.png"), Buffer.from(expShot.data, "base64"));

    // Copy captured files to Brain artifact directory
    const filesToCopy = [
      "1_hero.png",
      "2_laptop_3d.png",
      "3_official_verification.png",
      "4_platforms_services.png",
      "5_dynamic_glass_navigation.png",
      "6_account_assistance.png",
      "8_crypto_exchange.png",
      "9_automated_ads.png",
      "10_about_section.png",
      "11_footer_section.png",
      "expanded_dynamic_bar.png"
    ];

    for (const f of filesToCopy) {
      const src = path.join(PREVIEWS_DIR, f);
      const dst = path.join(BRAIN_DIR, f);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dst);
        console.log(`Copied ${f} to Brain artifact directory`);
      }
    }

    console.log("\nAll screenshots captured and saved successfully!");
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
