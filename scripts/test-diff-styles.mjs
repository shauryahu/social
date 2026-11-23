import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PORT = 9511;
const tmpDir = path.join(os.tmpdir(), "chrome-diff-styles-" + Date.now());
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

    // Remove pre and unlock body
    await sendS("Runtime.evaluate", {
      expression: `(() => {
        const p = document.getElementById("pre");
        if (p) p.remove();
        document.body.classList.remove("lock");
        window.scrollTo(0, 300);
      })()`
    });
    await sleep(500);

    // Create red glass box that works
    await sendS("Runtime.evaluate", {
      expression: `(() => {
        const testGlass = document.createElement("div");
        testGlass.id = "test-glass";
        testGlass.style.cssText = \`
          position: fixed;
          top: 16px;
          left: 50px;
          width: 300px;
          height: 80px;
          border-radius: 40px;
          background: rgba(255, 0, 0, 0.4);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          backdrop-filter: blur(28px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.45);
          z-index: 10000;
        \`;
        document.body.appendChild(testGlass);
      })()`
    });

    const diff = await sendS("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const tg = document.getElementById("test-glass");
        const bar = document.querySelector(".sa-nav .bar");
        const cs1 = window.getComputedStyle(tg);
        const cs2 = window.getComputedStyle(bar);
        
        const props = [
          "backdropFilter", "webkitBackdropFilter", "filter", "transform",
          "isolation", "contain", "willChange", "perspective", "clipPath",
          "mask", "webkitMask", "overflow", "opacity", "zIndex", "mixBlendMode",
          "display", "position"
        ];
        
        const res = {};
        for (const p of props) {
          res[p] = { testGlass: cs1[p], bar: cs2[p] };
        }
        return res;
      })()`
    });

    console.log("Property comparison:", JSON.stringify(diff.result.value, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    proc.kill();
    process.exit(0);
  }
}

main();
