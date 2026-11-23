import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const ARTIFACT_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";
const PORT = 9324;
const tmpDir = path.join(os.tmpdir(), "chrome-test-blur3-" + Date.now());

const chromeProc = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${tmpDir}`,
  "--disable-extensions",
  "--disable-default-apps",
  "--no-first-run",
  "--hide-scrollbars",
  "about:blank",
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  try {
    let version = null;
    for (let i = 0; i < 20; i++) {
      await sleep(300);
      try {
        const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
        version = await r.json();
        if (version && version.webSocketDebuggerUrl) break;
      } catch {}
    }
    const ws = new WebSocket(version.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));

    let msgId = 1;
    const callbacks = new Map();
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };

    const send = (m, p = {}) =>
      new Promise((resolve, reject) => {
        const id = msgId++;
        callbacks.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method: m, params: p }));
      });

    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });

    const sendS = (m, p = {}) =>
      new Promise((resolve, reject) => {
        const id = msgId++;
        callbacks.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, sessionId, method: m, params: p }));
      });

    await sendS("Page.enable");
    await sendS("Runtime.enable");

    // Test with and without ::before
    const html = `<!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 40px; font-family: sans-serif; background: #e5e5f0; }
        .bg-card { background: white; border: 1px solid #ccc; padding: 15px; border-radius: 12px; margin-bottom: 10px; width: 400px; }
        .bg-text { font-size: 16px; font-weight: bold; color: #111; line-height: 1.6; }
        .panel {
          position: fixed;
          top: 60px;
          left: 40px;
          width: 320px;
          max-height: 300px;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 12px;
          border-radius: 24px;
          isolation: isolate;
          background: rgba(255, 255, 255, 0.58);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          backdrop-filter: blur(28px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.45);
          box-shadow: 0 8px 32px rgba(40, 20, 90, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }
        .panel::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          border-radius: inherit;
          pointer-events: none;
          background: radial-gradient(130% 90% at 18% 0%, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0) 55%), linear-gradient(180deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0) 40%);
        }
        .item { padding: 12px; font-size: 15px; font-weight: 500; color: #333; }
        .active { background: rgba(255, 255, 255, 0.75); border-radius: 999px; }
      </style>
    </head>
    <body>
      <div class="bg-card">
        <div class="bg-text">Cases Resolved: 500+ High-priority recoveries</div>
        <div class="bg-text">Specialized social media assistance and verification support</div>
      </div>
      <div class="bg-card">
        <div class="bg-text">Success Rate: Tier-1 internal escalation channels</div>
        <div class="bg-text">Secure Network: Strict confidentiality protocol</div>
      </div>
      <div class="panel">
        <div class="item active">Home</div>
        <div class="item">Services</div>
        <div class="item">Platforms</div>
      </div>
    </body>
    </html>`;

    await sendS("Page.setDocumentContent", { frameId: (await sendS("Page.getFrameTree")).frameTree.frame.id, html });
    await sleep(500);

    const shot = await sendS("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(ARTIFACT_DIR, "test-blur-with-before.png"), Buffer.from(shot.data, "base64"));
    console.log("Captured test-blur-with-before.png");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    chromeProc.kill();
    process.exit(0);
  }
}

run();
