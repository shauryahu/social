import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-chrome-seams-" + Date.now());

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9288",
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
      const res = await fetch("http://127.0.0.1:9288/json/version");
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {}
    await sleep(250);
  }
  throw new Error("Could not connect to Chrome debugging port");
}

async function scanPage(sendSession, viewportWidth, viewportHeight) {
  await sendSession("Emulation.setDeviceMetricsOverride", {
    width: viewportWidth,
    height: viewportHeight,
    deviceScaleFactor: 1,
    mobile: viewportWidth <= 600,
  });
  await sleep(500);

  // Switch to dark mode
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

  // Scan in page using Canvas context to sample horizontal rows directly
  const scanResult = await sendSession("Runtime.evaluate", {
    returnByValue: true,
    awaitPromise: true,
    expression: `(async () => {
      const totalHeight = document.documentElement.scrollHeight;
      const step = 400;
      const issues = [];
      const sections = Array.from(document.querySelectorAll('main > *, section, header, footer, [id]'));

      function getElementAtY(y) {
        for (const s of sections) {
          const r = s.getBoundingClientRect();
          const pageTop = r.top + window.scrollY;
          const pageBottom = r.bottom + window.scrollY;
          if (y >= pageTop && y <= pageBottom) {
            return {
              id: s.id || null,
              tag: s.tagName.toLowerCase(),
              className: s.className || '',
              top: Math.round(pageTop),
              bottom: Math.round(pageBottom)
            };
          }
        }
        return null;
      }

      // Check all section boundaries and potential dividing lines
      const boundaries = [];
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const yTop = Math.round(r.top + window.scrollY);
        const yBottom = Math.round(r.bottom + window.scrollY);
        
        // Check for border-bottom / border-top
        if (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopColor.includes('rgb')) {
          boundaries.push({ type: 'border-top', y: yTop, el: el.tagName + (el.className ? '.' + el.className.split(' ').join('.') : ''), color: cs.borderTopColor, width: cs.borderTopWidth });
        }
        if (parseFloat(cs.borderBottomWidth) > 0 && cs.borderBottomColor.includes('rgb')) {
          boundaries.push({ type: 'border-bottom', y: yBottom, el: el.tagName + (el.className ? '.' + el.className.split(' ').join('.') : ''), color: cs.borderBottomColor, width: cs.borderBottomWidth });
        }
        // Check background colors khác transparent
        if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') {
          boundaries.push({ type: 'background', yTop, yBottom, el: el.tagName + (el.className ? '.' + el.className.split(' ').join('.') : ''), bg: cs.backgroundColor });
        }
      });

      return {
        totalHeight,
        viewportWidth: window.innerWidth,
        boundaries: boundaries.filter(b => b.yTop > 0 || b.y > 0)
      };
    })()`,
  });

  return scanResult.result ? scanResult.result.value : scanResult.value;
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

    console.log("Scanning seams at 1440px ...");
    const scan1440 = await scanPage(sendSession, 1440, 900);
    fs.writeFileSync("scripts/seam-scan-1440.json", JSON.stringify(scan1440, null, 2));

    console.log("Scanning seams at 390px ...");
    const scan390 = await scanPage(sendSession, 390, 844);
    fs.writeFileSync("scripts/seam-scan-390.json", JSON.stringify(scan390, null, 2));

    console.log("Seam scans complete!");

  } catch (err) {
    console.error("Scan error:", err);
  } finally {
    chromeProc.kill();
    process.exit(0);
  }
}

main();
