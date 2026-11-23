import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PORT = 9333;
const tmpDir = path.join(os.tmpdir(), "chrome-live-" + Date.now());
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
    await sendS("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await sendS("Page.navigate", { url: "http://localhost:3000" });
    await sleep(2500);

    await sendS("Runtime.evaluate", {
      expression: `(() => {
        const p = document.getElementById("pre");
        if (p) p.style.display = "none";
        document.body.classList.remove("lock");
      })()`
    });

    const info = await sendS("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const b = document.querySelector(".sa-nav .bar");
        if (!b) return { found: false };
        const cs = window.getComputedStyle(b);
        const rect = b.getBoundingClientRect();
        return {
          found: true,
          rect: { left: rect.left, right: rect.right, top: rect.top, width: rect.width, height: rect.height },
          position: cs.position,
          backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter,
          backgroundColor: cs.backgroundColor,
          maxWidth: cs.maxWidth,
          width: cs.width
        };
      })()`
    });
    console.log("Live nav info:", JSON.stringify(info.result.value, null, 2));

    await sendS("Runtime.evaluate", { expression: "window.scrollTo(0, 1100)" });
    await sleep(600);
    const shot = await sendS("Page.captureScreenshot");
    fs.writeFileSync(
      "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91\\current-site-1440.png",
      Buffer.from(shot.data, "base64")
    );
    console.log("Saved current-site-1440.png");
  } catch (err) {
    console.error(err);
  } finally {
    proc.kill();
    process.exit(0);
  }
}

main();
