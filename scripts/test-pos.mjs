import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PORT = 9499;
const tmpDir = path.join(os.tmpdir(), "chrome-test-pos-" + Date.now());
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
        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";
        window.scrollTo(0, 300);
      })()`
    });
    await sleep(500);

    // Test:
    // Box 1: testGlass at top: 16px (same as bar)
    // Box 2: move actual .sa-nav .bar to top: 100px (same as testGlass before)
    await sendS("Runtime.evaluate", {
      expression: `(() => {
        const testGlass = document.createElement("div");
        testGlass.id = "test-glass-top16";
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

        const bar = document.querySelector(".sa-nav .bar");
        bar.style.top = "120px";
      })()`
    });
    await sleep(500);

    const shotPos = await sendS("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(
      "C:\\Users\\USER\\.gemini\\antigravity/brain/da496d37-3ff2-4b7f-9011-fb4d0e692a91/glass_pos_test.png",
      Buffer.from(shotPos.data, "base64")
    );
    console.log("Captured glass_pos_test.png");

  } catch (err) {
    console.error(err);
  } finally {
    proc.kill();
    process.exit(0);
  }
}

main();
