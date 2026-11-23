import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PORT = 9355;
const tmpDir = path.join(os.tmpdir(), "chrome-test-iso-" + Date.now());
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

    // Remove #pre
    await sendS("Runtime.evaluate", {
      expression: `(() => {
        const p = document.getElementById("pre");
        if (p) p.remove();
        document.body.classList.remove("lock");
      })()`
    });

    // Scroll to 800
    await sendS("Runtime.evaluate", {
      expression: `window.scrollTo({ top: 800, behavior: "instant" })`
    });
    await sleep(500);

    // Screenshot BEFORE removing isolation
    const shotWithIso = await sendS("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(
      "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91\\shot_with_isolation.png",
      Buffer.from(shotWithIso.data, "base64")
    );

    // Remove isolation: isolate and check ::before
    await sendS("Runtime.evaluate", {
      expression: `(() => {
        const b = document.querySelector(".sa-nav .bar");
        if (b) {
          b.style.isolation = "auto";
          // Also check CSS applied
          b.style.backdropFilter = "blur(28px) saturate(180%)";
          b.style.webkitBackdropFilter = "blur(28px) saturate(180%)";
          b.style.background = "rgba(255, 255, 255, 0.58)";
        }
      })()`
    });
    await sleep(300);

    const shotNoIso = await sendS("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(
      "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91\\shot_no_isolation.png",
      Buffer.from(shotNoIso.data, "base64")
    );

    // Also try removing ::before if it was interfering
    await sendS("Runtime.evaluate", {
      expression: `(() => {
        const style = document.createElement("style");
        style.textContent = ".sa-nav .bar::before { display: none !important; }";
        document.head.appendChild(style);
      })()`
    });
    await sleep(300);

    const shotNoBefore = await sendS("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(
      "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91\\shot_no_before.png",
      Buffer.from(shotNoBefore.data, "base64")
    );

    console.log("Done test-iso");
  } catch (err) {
    console.error(err);
  } finally {
    proc.kill();
    process.exit(0);
  }
}

main();
