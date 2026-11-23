import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-chrome-pixelseams-" + Date.now());

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9292",
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
      const res = await fetch("http://127.0.0.1:9292/json/version");
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {}
    await sleep(250);
  }
  throw new Error("Could not connect to Chrome debugging port");
}

async function runPixelScan(sendSession, viewportWidth, outFilename) {
  await sendSession("Emulation.setDeviceMetricsOverride", {
    width: viewportWidth,
    height: 900,
    deviceScaleFactor: 1,
    mobile: viewportWidth <= 600,
  });
  await sleep(400);

  // Switch to dark theme
  await sendSession("Runtime.evaluate", {
    expression: `(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('socialassist-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      if (typeof window.syncShadowRoots === 'function') window.syncShadowRoots('dark');
      window.dispatchEvent(new Event('socialassist-theme-change'));
    })()`,
  });
  await sleep(1000);

  // Scan in 400px steps
  const results = await sendSession("Runtime.evaluate", {
    returnByValue: true,
    awaitPromise: true,
    expression: `(async () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const step = 400;
      const sharpLines = [];

      // Create an offscreen canvas to capture viewport pixels
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Identify DOM element at Y
      function findElementAtPageY(y) {
        const els = Array.from(document.querySelectorAll('main > *, section, header, footer, .section-contain, platform-radar, restoration-section, services-showcase, verification-section'));
        let best = null;
        for (const el of els) {
          const r = el.getBoundingClientRect();
          const top = r.top + window.scrollY;
          const bottom = r.bottom + window.scrollY;
          if (y >= top && y <= bottom) {
            best = {
              tag: el.tagName.toLowerCase(),
              id: el.id || '',
              cls: el.className || '',
              top: Math.round(top),
              bottom: Math.round(bottom)
            };
          }
        }
        return best;
      }

      // Check border-divider lines and section boundaries
      const dividers = Array.from(document.querySelectorAll('.border-divider, hr, [style*="border-bottom"], [style*="border-top"]')).map(el => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          cls: el.className,
          y: Math.round(r.bottom + window.scrollY),
          color: getComputedStyle(el).borderBottomColor || getComputedStyle(el).borderColor
        };
      });

      return {
        viewportWidth: window.innerWidth,
        scrollHeight,
        dividers
      };
    })()`,
  });

  const scanData = results.result ? results.result.value : results.value;
  fs.writeFileSync(outFilename, JSON.stringify(scanData, null, 2));
  console.log(`Saved ${outFilename}`);
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

    console.log("Navigating to http://localhost:3000 ...");
    await sendSession("Page.navigate", { url: "http://localhost:3000" });
    await sleep(4500);

    await runPixelScan(sendSession, 1440, "scripts/seams-1440.json");
    await runPixelScan(sendSession, 390, "scripts/seams-390.json");

  } catch (err) {
    console.error("Scanner error:", err);
  } finally {
    chromeProc.kill();
    process.exit(0);
  }
}

main();
