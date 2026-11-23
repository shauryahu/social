import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PORT = 9388;
const tmpDir = path.join(os.tmpdir(), "chrome-test-z-" + Date.now());
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

    await sendS("Runtime.evaluate", {
      expression: `(() => {
        const p = document.getElementById("pre");
        if (p) p.remove();
        document.body.classList.remove("lock");
        window.scrollTo(0, 800);
      })()`
    });
    await sleep(500);

    const zEval = await sendS("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const elementsUnderBar = [];
        const bar = document.querySelector(".sa-nav .bar");
        const rect = bar.getBoundingClientRect();
        
        // Sample points across the bar
        for (let x = rect.left + 50; x < rect.right; x += 150) {
          const y = rect.top + rect.height / 2;
          const el = document.elementFromPoint(x, y);
          if (el) {
            elementsUnderBar.push({
              x, y,
              tag: el.tagName,
              id: el.id,
              class: el.className,
              zIndex: window.getComputedStyle(el).zIndex
            });
          }
        }

        // Hide bar temporarily to see what's directly underneath
        bar.style.display = "none";
        const trueUnderneath = [];
        for (let x = rect.left + 50; x < rect.right; x += 150) {
          const y = rect.top + rect.height / 2;
          const el = document.elementFromPoint(x, y);
          if (el) {
            let parentChain = [];
            let p = el;
            while (p && p !== document.body) {
              const cs = window.getComputedStyle(p);
              if (cs.zIndex !== "auto" || cs.position !== "static" || cs.transform !== "none" || cs.filter !== "none" || cs.opacity !== "1") {
                parentChain.push({ tag: p.tagName, id: p.id, class: p.className, pos: cs.position, z: cs.zIndex, tf: cs.transform, filt: cs.filter, op: cs.opacity });
              }
              p = p.parentElement;
            }
            trueUnderneath.push({
              x, y,
              tag: el.tagName,
              id: el.id,
              class: el.className,
              text: el.innerText ? el.innerText.slice(0, 30) : "",
              parentChain
            });
          }
        }
        bar.style.display = "";

        return { elementsUnderBar, trueUnderneath };
      })()`
    });

    console.log("Elements under bar analysis:", JSON.stringify(zEval.result.value, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    proc.kill();
    process.exit(0);
  }
}

main();
