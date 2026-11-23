import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PORT = 9555;
const tmpDir = path.join(os.tmpdir(), "chrome-unlock-" + Date.now());
const proc = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${tmpDir}`,
  "--disable-extensions",
  "--hide-scrollbars",
  "about:blank"
]);

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  try {
    let ver = null;
    for (let i = 0; i < 20; i++) {
      await sleep(300);
      try {
        const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
        ver = await r.json();
        if (ver?.webSocketDebuggerUrl) break;
      } catch {}
    }
    const ws = new WebSocket(ver.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);
    let id = 1;
    const cbs = new Map();
    ws.onmessage = e => {
      const m = JSON.parse(e.data);
      if (m.id && cbs.has(m.id)) {
        const { resolve } = cbs.get(m.id);
        cbs.delete(m.id);
        resolve(m.result);
      }
    };
    const send = (m, p = {}) => new Promise(resolve => {
      const mid = id++;
      cbs.set(mid, { resolve });
      ws.send(JSON.stringify({ id: mid, method: m, params: p }));
    });
    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
    const sendS = (m, p = {}) => new Promise(resolve => {
      const mid = id++;
      cbs.set(mid, { resolve });
      ws.send(JSON.stringify({ id: mid, sessionId, method: m, params: p }));
    });
    await sendS("Page.enable");
    await sendS("Runtime.enable");
    await sendS("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
    await sendS("Page.navigate", { url: "http://localhost:3000" });
    await sleep(4000);

    // Properly dismiss loader and unlock
    await sendS("Runtime.evaluate", {
      expression: `(() => {
        const p = document.getElementById("pre");
        if (p) {
          p.classList.add("gone", "out");
          p.remove();
        }
        document.body.classList.remove("lock");
      })()`
    });
    await sleep(300);

    // Apply the exact styles we want
    await sendS("Runtime.evaluate", {
      expression: `(() => {
        const style = document.createElement("style");
        style.id = "test-unlock-style";
        style.textContent = \`
          header, .sa-nav {
            display: contents !important;
            view-transition-name: none !important;
          }
          .sa-nav .bar {
            position: fixed !important;
            top: max(16px, env(safe-area-inset-top, 16px)) !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: fit-content !important;
            max-width: min(92vw, 1100px) !important;
            box-sizing: border-box !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 10px !important;
            padding: 6px !important;
            border-radius: 999px !important;
            z-index: 1000 !important;
            pointer-events: auto !important;
            isolation: auto !important;
            background: rgba(255, 255, 255, 0.58) !important;
            border: 1px solid rgba(255, 255, 255, 0.45) !important;
            -webkit-backdrop-filter: blur(28px) saturate(180%) !important;
            backdrop-filter: blur(28px) saturate(180%) !important;
            box-shadow: 0 8px 32px rgba(40, 20, 90, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
          }
          .sa-nav .bar::before,
          .sa-nav .panel::before {
            display: none !important;
          }
          .sa-nav .pill {
            isolation: auto !important;
          }
          .sa-nav .ind {
            background: rgba(255, 255, 255, 0.75) !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
        \`;
        document.head.appendChild(style);
      })()`
    });
    await sleep(200);

    // Scroll to #about exactly like user screenshot
    const scrollRes = await sendS("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const ab = document.getElementById("about");
        if (ab) {
          ab.scrollIntoView();
          window.scrollBy(0, 320);
        }
        return {
          scrollY: window.scrollY,
          bodyLocked: document.body.classList.contains("lock"),
          bodyOverflow: window.getComputedStyle(document.body).overflow
        };
      })()`
    });
    console.log("Scroll res:", scrollRes.result.value);
    await sleep(800);

    const shot = await sendS("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(
      "C:\\Users\\USER\\.gemini\\antigravity/brain/da496d37-3ff2-4b7f-9011-fb4d0e692a91/real_about_scrolled.png",
      Buffer.from(shot.data, "base64")
    );
    console.log("Captured real_about_scrolled.png");

  } catch (err) {
    console.error(err);
  } finally {
    proc.kill();
    process.exit(0);
  }
}

main();
