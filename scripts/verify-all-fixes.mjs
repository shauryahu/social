import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-chrome-verify-" + Date.now());

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9277",
    `--user-data-dir=${USER_DATA}`,
    "--window-size=1440,1200",
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
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9277/json/version");
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {}
    await sleep(250);
  }
  throw new Error("Could not connect to Chrome debugging port");
}

async function main() {
  try {
    const wsUrl = await getDebuggerUrl();
    const ws = new WebSocket(wsUrl);

    let id = 1;
    const callbacks = new Map();
    let screencastHandler = null;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === "Page.screencastFrame" && screencastHandler) {
        screencastHandler(msg.params);
      }
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

    // ── 1. TEST LOADER IN DARK & LIGHT MODES ──
    console.log("Navigating to inspect loader in dark mode...");
    // Pre-seed localStorage to dark before navigation
    await sendSession("Page.addScriptToEvaluateOnNewDocument", {
      source: `
        try {
          localStorage.setItem('socialassist-theme', 'dark');
          localStorage.setItem('theme', 'dark');
        } catch(e) {}
      `,
    });

    await sendSession("Page.navigate", { url: "http://localhost:3000" });
    // Capture loader within first 1.5s
    await sleep(1400);

    const darkLoaderShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync("public/loader-dark.png", Buffer.from(darkLoaderShot.data, "base64"));
    console.log("Saved public/loader-dark.png");

    // Wait for intro to finish and page to be ready
    await sleep(3500);

    // ── 2. TEST RADAR SEAM & DISCORD ICON IN DARK MODE ──
    console.log("Scrolling to platform radar seam in dark mode...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const radar = document.querySelector('platform-radar');
        if (radar) {
          const r = radar.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + r.bottom - 450);
        }
      })()`,
    });
    await sleep(1000);

    // Position Discord at the exact bottom (angle = 180deg) to verify clearance
    const seamMeasure = await sendSession("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const radar = document.querySelector('platform-radar');
        const resto = document.querySelector('restoration-section');
        if (!radar || !radar.shadowRoot) return "no radar shadow root";

        const seamFade = radar.shadowRoot.querySelector('.seam-fade');
        const sfDisplay = seamFade ? getComputedStyle(seamFade).display : 'none';
        const radarOverflow = getComputedStyle(radar).overflow;
        const stagew = radar.shadowRoot.querySelector('.stagew');
        const stagewOverflow = stagew ? getComputedStyle(stagew).overflow : '';

        // Find Discord icon
        const tiles = Array.from(radar.shadowRoot.querySelectorAll('.tile'));
        const dcTile = tiles.find(t => (t.getAttribute('aria-label') || '').includes('Discord') || t.innerHTML.includes('Discord'));
        const dcApp = dcTile ? dcTile.closest('.app') : null;

        // Bounding rects
        const rRect = radar.getBoundingClientRect();
        const reRect = resto ? resto.getBoundingClientRect() : null;
        const dcRect = dcTile ? dcTile.getBoundingClientRect() : null;

        return {
          seamFadeDisplay: sfDisplay,
          radarOverflow,
          stagewOverflow,
          radarBottom: rRect.bottom,
          restoTop: reRect ? reRect.top : 0,
          discordBottom: dcRect ? dcRect.bottom : 0,
          isDiscordClipped: dcRect && rRect ? (dcRect.bottom > rRect.bottom && radarOverflow === 'hidden') : false
        };
      })()`,
    });

    console.log("Dark Mode Seam Measure:", seamMeasure.result ? seamMeasure.result.value : seamMeasure.value);

    const darkSeamShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync("public/seam-area-dark-fixed.png", Buffer.from(darkSeamShot.data, "base64"));
    console.log("Saved public/seam-area-dark-fixed.png");

    // ── 3. TEST LIGHT MODE SEAM (CONFIRM PIXEL-IDENTICAL TO ORIGINAL) ──
    console.log("Switching to light mode to confirm light mode seam...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('socialassist-theme', 'light');
        localStorage.setItem('theme', 'light');
        window.dispatchEvent(new Event('socialassist-theme-change'));
      })()`,
    });
    await sleep(1000);

    const lightSeamShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync("public/seam-area-light-confirm.png", Buffer.from(lightSeamShot.data, "base64"));
    console.log("Saved public/seam-area-light-confirm.png");

    // ── 4. RECORD TELEGRAM-STYLE WAVE SWITCH ON DESKTOP (1440x900) ──
    console.log("Recording desktop wave switch (light -> dark -> light)...");
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    // Scroll back to hero/top to show clean desktop switch
    await sendSession("Runtime.evaluate", { expression: `window.scrollTo(0, 0);` });
    await sleep(600);

    const desktopFramesL2D = [];
    const desktopFramesD2L = [];

    // Setup screencast recording helper
    async function recordScreencast(framesArray, actionFn, durationMs = 1200) {
      screencastHandler = async (params) => {
        framesArray.push(params.data);
        await sendSession("Page.screencastFrameAck", { sessionId: params.sessionId });
      };
      await sendSession("Page.startScreencast", { format: "jpeg", quality: 85, everyNthFrame: 1 });
      await actionFn();
      await sleep(durationMs);
      await sendSession("Page.stopScreencast");
      screencastHandler = null;
    }

    // Trigger Light -> Dark switch via button click
    console.log("Triggering Light -> Dark wave switch...");
    await recordScreencast(desktopFramesL2D, async () => {
      await sendSession("Runtime.evaluate", {
        expression: `(() => {
          const btn = document.querySelector('button[data-slot="theme-toggle"]');
          if (btn) btn.click();
        })()`,
      });
    }, 1200);
    console.log(`Captured ${desktopFramesL2D.length} frames for desktop Light -> Dark`);

    await sleep(500);

    // Trigger Dark -> Light switch via button click
    console.log("Triggering Dark -> Light wave switch...");
    await recordScreencast(desktopFramesD2L, async () => {
      await sendSession("Runtime.evaluate", {
        expression: `(() => {
          const btn = document.querySelector('button[data-slot="theme-toggle"]');
          if (btn) btn.click();
        })()`,
      });
    }, 1200);
    console.log(`Captured ${desktopFramesD2L.length} frames for desktop Dark -> Light`);

    // ── 5. RECORD MOBILE SWITCH WITH CPU 4x SLOWDOWN (390x844) ──
    console.log("Configuring mobile viewport (390x844) and 4x CPU slowdown...");
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await sendSession("Emulation.setCPUThrottlingRate", { rate: 4 });
    await sleep(600);

    const mobileFramesL2D = [];
    const mobileFramesD2L = [];

    console.log("Triggering Mobile Light -> Dark wave switch (4x CPU slowdown)...");
    await recordScreencast(mobileFramesL2D, async () => {
      await sendSession("Runtime.evaluate", {
        expression: `(() => {
          const btn = document.querySelector('button[data-slot="theme-toggle"]');
          if (btn) btn.click();
        })()`,
      });
    }, 1400);
    console.log(`Captured ${mobileFramesL2D.length} frames for mobile Light -> Dark`);

    await sleep(500);

    console.log("Triggering Mobile Dark -> Light wave switch (4x CPU slowdown)...");
    await recordScreencast(mobileFramesD2L, async () => {
      await sendSession("Runtime.evaluate", {
        expression: `(() => {
          const btn = document.querySelector('button[data-slot="theme-toggle"]');
          if (btn) btn.click();
        })()`,
      });
    }, 1400);
    console.log(`Captured ${mobileFramesD2L.length} frames for mobile Dark -> Light`);

    // Reset CPU throttling
    await sendSession("Emulation.setCPUThrottlingRate", { rate: 1 });

    // Save frames to disk
    function saveFrames(dir, frames) {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      frames.forEach((f, idx) => {
        const p = path.join(dir, `frame_${String(idx).padStart(3, "0")}.jpg`);
        fs.writeFileSync(p, Buffer.from(f, "base64"));
      });
    }

    saveFrames("scripts/screencast/desktop_l2d", desktopFramesL2D);
    saveFrames("scripts/screencast/desktop_d2l", desktopFramesD2L);
    saveFrames("scripts/screencast/mobile_l2d", mobileFramesL2D);
    saveFrames("scripts/screencast/mobile_d2l", mobileFramesD2L);
    console.log("All screencast frame sets saved to disk.");

    // ── 6. CAPTURE LIGHT MODE LOADER ──
    console.log("Navigating to capture light mode loader...");
    await sendSession("Page.addScriptToEvaluateOnNewDocument", {
      source: `
        try {
          localStorage.setItem('socialassist-theme', 'light');
          localStorage.setItem('theme', 'light');
        } catch(e) {}
      `,
    });
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sendSession("Page.navigate", { url: "http://localhost:3000" });
    await sleep(1400);
    const lightLoaderShot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync("public/loader-light.png", Buffer.from(lightLoaderShot.data, "base64"));
    console.log("Saved public/loader-light.png");

  } catch (err) {
    console.error("Verification error:", err);
  } finally {
    chromeProc.kill();
    process.exit(0);
  }
}

main();
