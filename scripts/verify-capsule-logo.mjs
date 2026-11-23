import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BRAIN_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";
const USER_DATA = path.join(process.cwd(), ".chrome-profile-capsule-logo");

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9298",
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
      const res = await fetch("http://127.0.0.1:9298/json/version");
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {
      await sleep(300);
    }
  }
  throw new Error("Debugger URL not reachable");
}

async function main() {
  try {
    const wsUrl = await getDebuggerUrl();
    const ws = new globalThis.WebSocket(wsUrl);

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
    await sendSession("Runtime.enable");

    console.log("Navigating to http://localhost:3000/ ...");
    await sendSession("Page.navigate", { url: "http://localhost:3000/" });
    await sleep(2500);

    // Scroll to services showcase and reveal window
    const evalRes = await sendSession("Runtime.evaluate", {
      expression: `(function() {
        const el = document.querySelector('services-showcase');
        if (!el) return { error: 'services-showcase not found' };
        const sr = el.shadowRoot;
        if (!sr) return { error: 'shadowRoot not attached' };
        
        // Make sure everything is revealed
        const groups = sr.querySelectorAll('.g, .winwrap, .win');
        groups.forEach(g => {
          g.classList.add('in');
          g.style.opacity = '1';
          g.style.filter = 'none';
        });
        const win = sr.querySelector('.win');
        if (win) {
          win.style.opacity = '1';
          win.style.transform = 'none';
          win.style.filter = 'none';
        }

        const handle = sr.querySelector('.handle');
        if (!handle) return { error: '.handle not found' };
        const badge = handle.querySelector('b');
        const img = badge ? badge.querySelector('img') : null;

        // Position window comfortably in viewport (accounting for fixed header ~100px)
        const winRect = win ? win.getBoundingClientRect() : el.getBoundingClientRect();
        window.scrollTo(0, window.scrollY + winRect.top - 220);

        return {
          handleText: handle.textContent.trim(),
          hasImg: !!img,
          imgSrc: img ? img.src : null,
          imgLoaded: img ? (img.complete && img.naturalWidth > 0) : false,
          naturalWidth: img ? img.naturalWidth : 0,
          naturalHeight: img ? img.naturalHeight : 0,
          scrollY: window.scrollY
        };
      })()`,
      returnByValue: true
    });

    console.log("Inspection details:", JSON.stringify(evalRes.result.value, null, 2));
    await sleep(1500);

    // Take full viewport screenshot
    const fullShot = await sendSession("Page.captureScreenshot", { format: "png" });
    const fullPath = path.join(BRAIN_DIR, "services_showcase_viewport.png");
    fs.writeFileSync(fullPath, Buffer.from(fullShot.data, "base64"));
    console.log("Saved viewport screenshot to:", fullPath);

    // Get live handle bounding rect after scroll
    const rectRes = await sendSession("Runtime.evaluate", {
      expression: `(function() {
        const el = document.querySelector('services-showcase');
        const sr = el.shadowRoot;
        const handle = sr.querySelector('.handle');
        const r = handle.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      })()`,
      returnByValue: true
    });
    console.log("Handle viewport rect:", rectRes.result.value);
    const hr = rectRes.result.value;
    if (hr) {
      const pad = 20;
      const zoomShot = await sendSession("Page.captureScreenshot", {
        clip: {
          x: Math.max(0, hr.x - pad),
          y: Math.max(0, hr.y - pad),
          width: hr.width + pad * 2,
          height: hr.height + pad * 2,
          scale: 2
        },
        format: "png"
      });
      const zoomPath = path.join(BRAIN_DIR, "capsule_logo_live_zoom.png");
      fs.writeFileSync(zoomPath, Buffer.from(zoomShot.data, "base64"));
      console.log("Saved live zoom screenshot to:", zoomPath);
    }

    ws.close();
  } catch (err) {
    console.error("Error in verification:", err);
  } finally {
    try {
      chromeProc.kill();
    } catch {}
    process.exit(0);
  }
}

main();
