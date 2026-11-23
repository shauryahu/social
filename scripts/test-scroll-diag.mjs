import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PORT = 9566;
const tmpDir = path.join(os.tmpdir(), "chrome-sc-test-" + Date.now());
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

    const diag = await sendS("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        return {
          windowScrollY: window.scrollY,
          htmlOverflow: window.getComputedStyle(document.documentElement).overflow,
          bodyOverflow: window.getComputedStyle(document.body).overflow,
          bodyHeight: document.body.scrollHeight,
          htmlHeight: document.documentElement.scrollHeight,
          scrollingElement: document.scrollingElement.tagName,
          pre: !!document.getElementById("pre")
        };
      })()`
    });
    console.log("Scroll diag before:", diag.result.value);

    // Let the natural loader finish! Wait 6 seconds!
    await sleep(6000);

    // Apply the exact CSS fix
    await sendS("Runtime.evaluate", {
      expression: `(() => {
        const style = document.createElement("style");
        style.id = "glass-fix";
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

    const diag2 = await sendS("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo({ top: 2500, behavior: "instant" });
        return {
          windowScrollY: window.scrollY,
          deScrollTop: document.documentElement.scrollTop,
          preClass: document.getElementById("pre")?.className,
          bodyClass: document.body.className
        };
      })()`
    });
    console.log("Scroll diag after instant scroll:", diag2.result.value);
    await sleep(500);

    // Switch to dark mode
    await sendS("Runtime.evaluate", {
      expression: `(() => {
        const de = document.documentElement;
        de.setAttribute("data-theme", "dark");
        de.classList.remove("light");
        de.classList.add("dark");
        if (typeof syncShadowRoots === "function") syncShadowRoots("dark");
      })()`
    });
    await sleep(400);

    const shotDark = await sendS("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(
      "C:\\Users\\USER\\.gemini\\antigravity/brain/da496d37-3ff2-4b7f-9011-fb4d0e692a91/real_scroll_dark_with_fix.png",
      Buffer.from(shotDark.data, "base64")
    );
    console.log("Captured real_scroll_dark_with_fix.png");





  } catch (err) {
    console.error(err);
  } finally {
    proc.kill();
    process.exit(0);
  }
}

main();
