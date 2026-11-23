import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PORT = 9344;
const tmpDir = path.join(os.tmpdir(), "chrome-diag2-" + Date.now());
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

    const report = await sendS("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const bar = document.querySelector(".sa-nav .bar");
        if (!bar) return { error: "No .sa-nav .bar" };

        let curr = bar;
        const chain = [];
        while (curr) {
          const cs = window.getComputedStyle(curr);
          chain.push({
            tag: curr.tagName,
            id: curr.id,
            className: curr.className,
            transform: cs.transform,
            filter: cs.filter,
            backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter,
            perspective: cs.perspective,
            contain: cs.contain,
            willChange: cs.willChange,
            opacity: cs.opacity,
            overflow: cs.overflow,
            position: cs.position,
            zIndex: cs.zIndex
          });
          curr = curr.parentElement;
        }

        // Also check if any element is overlapping or covering bar
        const rect = bar.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const elAtPoint = document.elementFromPoint(centerX, centerY);

        return {
          chain,
          elAtPoint: elAtPoint ? { tag: elAtPoint.tagName, id: elAtPoint.id, class: elAtPoint.className } : null,
          barComputed: {
            background: window.getComputedStyle(bar).background,
            backgroundColor: window.getComputedStyle(bar).backgroundColor,
            backdropFilter: window.getComputedStyle(bar).backdropFilter,
            webkitBackdropFilter: window.getComputedStyle(bar).webkitBackdropFilter
          }
        };
      })()`
    });

    console.log("DOM Chain & Computed Styles:", JSON.stringify(report.result.value, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    proc.kill();
    process.exit(0);
  }
}

main();
