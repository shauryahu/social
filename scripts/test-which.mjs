import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PORT = 9377;
const tmpDir = path.join(os.tmpdir(), "chrome-test-which-" + Date.now());
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

    // Let's test modifying .sa-nav and .sa-nav .bar systematically
    // Step 1: Remove ::before from .bar
    // Step 2: Remove isolation from .bar
    // Step 3: Remove transform from .bar (use left: 0, right: 0, margin: auto)
    // Step 4: Remove pointer-events: none from header.sa-nav
    // Step 5: Check if children of .bar have backgrounds that mask it
    
    // Test A: Apply red box styles directly to .bar
    await sendS("Runtime.evaluate", {
      expression: `(() => {
        const bar = document.querySelector(".sa-nav .bar");
        bar.style.backgroundColor = "rgba(255, 0, 0, 0.3)";
        bar.style.backdropFilter = "blur(28px) saturate(180%)";
        bar.style.webkitBackdropFilter = "blur(28px) saturate(180%)";
      })()`
    });
    await sleep(300);
    let shot = await sendS("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync("C:/Users/USER/.gemini/antigravity/brain/da496d37-3ff2-4b7f-9011-fb4d0e692a91/stepA_red_bar.png", Buffer.from(shot.data, "base64"));

    // Test B: Remove isolation and ::before
    await sendS("Runtime.evaluate", {
      expression: `(() => {
        const bar = document.querySelector(".sa-nav .bar");
        bar.style.isolation = "auto";
        const style = document.createElement("style");
        style.textContent = ".sa-nav .bar::before { display: none !important; }";
        document.head.appendChild(style);
      })()`
    });
    await sleep(300);
    shot = await sendS("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync("C:/Users/USER/.gemini/antigravity/brain/da496d37-3ff2-4b7f-9011-fb4d0e692a91/stepB_no_iso_no_before.png", Buffer.from(shot.data, "base64"));

    // Test C: Remove pointer-events from header.sa-nav
    await sendS("Runtime.evaluate", {
      expression: `(() => {
        const hdr = document.querySelector(".sa-nav");
        hdr.style.pointerEvents = "auto";
      })()`
    });
    await sleep(300);
    shot = await sendS("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync("C:/Users/USER/.gemini/antigravity/brain/da496d37-3ff2-4b7f-9011-fb4d0e692a91/stepC_hdr_pointer.png", Buffer.from(shot.data, "base64"));

    // Test D: Remove transform from .bar (center via left: 0, right: 0, margin: auto)
    await sendS("Runtime.evaluate", {
      expression: `(() => {
        const bar = document.querySelector(".sa-nav .bar");
        bar.style.left = "0";
        bar.style.right = "0";
        bar.style.margin = "0 auto";
        bar.style.transform = "none";
      })()`
    });
    await sleep(300);
    shot = await sendS("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync("C:/Users/USER/.gemini/antigravity/brain/da496d37-3ff2-4b7f-9011-fb4d0e692a91/stepD_no_transform.png", Buffer.from(shot.data, "base64"));

    // Test E: Move .bar directly to document.body outside header
    await sendS("Runtime.evaluate", {
      expression: `(() => {
        const bar = document.querySelector(".sa-nav .bar");
        document.body.appendChild(bar);
      })()`
    });
    await sleep(300);
    shot = await sendS("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync("C:/Users/USER/.gemini/antigravity/brain/da496d37-3ff2-4b7f-9011-fb4d0e692a91/stepE_bar_in_body.png", Buffer.from(shot.data, "base64"));

    // Test F: What if header.sa-nav is position: relative or has no position: fixed?
    console.log("All steps captured");

  } catch (err) {
    console.error(err);
  } finally {
    proc.kill();
    process.exit(0);
  }
}

main();
