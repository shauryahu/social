import { spawn } from "node:child_process";
import fs from "node:fs";

async function main() {
  const PORT = 9488;
  const chromeProc = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    "--remote-debugging-port=" + PORT,
    "--disable-extensions",
    "about:blank"
  ]);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let ver = null;
  for (let i = 0; i < 20; i++) {
    await sleep(300);
    try {
      const r = await fetch("http://127.0.0.1:" + PORT + "/json/version");
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
      const p = document.getElementById('pre');
      if (p) p.remove();
      document.body.classList.remove('lock');
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
      const el = document.getElementById('about');
      if (el) el.scrollIntoView({ block: 'start' });
    })()`
  });
  await sleep(1500);
  const shot = await sendS("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync("scripts/current-debug.png", Buffer.from(shot.data, "base64"));
  console.log("Saved scripts/current-debug.png");
  chromeProc.kill();
  process.exit(0);
}

main();
