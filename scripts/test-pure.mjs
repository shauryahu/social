import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PORT = 9466;
const tmpDir = path.join(os.tmpdir(), "chrome-test-pure-" + Date.now());
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

    // Remove view-transition-name from header and check
    const res = await sendS("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const hdr = document.querySelector(".sa-nav");
        hdr.style.viewTransitionName = "none";
        
        // Also let's check .bar
        const bar = document.querySelector(".sa-nav .bar");
        bar.style.viewTransitionName = "none";
        
        // Apply the exact user requested styles
        bar.style.background = "rgba(255, 255, 255, 0.58)";
        bar.style.backdropFilter = "blur(28px) saturate(180%)";
        bar.style.webkitBackdropFilter = "blur(28px) saturate(180%)";
        bar.style.border = "1px solid rgba(255, 255, 255, 0.45)";
        bar.style.boxShadow = "0 8px 32px rgba(40, 20, 90, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.6)";

        // Also remove pseudo before if needed
        const st = document.createElement("style");
        st.id = "override-st";
        st.textContent = \`
          header, .sa-nav, .sa-nav * {
            view-transition-name: none !important;
          }
          .sa-nav .bar::before {
            display: none !important;
          }
        \`;
        document.head.appendChild(st);

        return {
          hdrVT: window.getComputedStyle(hdr).viewTransitionName,
          barVT: window.getComputedStyle(bar).viewTransitionName,
          barBF: window.getComputedStyle(bar).backdropFilter,
          barBG: window.getComputedStyle(bar).backgroundColor
        };
      })()`
    });
    console.log("Check res:", res.result.value);
    await sleep(500);

    const shot = await sendS("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(
      "C:\\Users\\USER\\.gemini\\antigravity/brain/da496d37-3ff2-4b7f-9011-fb4d0e692a91/glass_clean_test.png",
      Buffer.from(shot.data, "base64")
    );
    console.log("Captured glass_clean_test.png");

  } catch (err) {
    console.error(err);
  } finally {
    proc.kill();
    process.exit(0);
  }
}

main();
