import { spawn } from "node:child_process";
import fs from "node:fs";

async function tracePath() {
  const PORT = 9562;
  const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    "--remote-debugging-port=" + PORT,
    "about:blank"
  ]);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let ver = null;
  for (let i = 0; i < 20; i++) {
    await sleep(200);
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
  const send = (m, p = {}) => new Promise(r => {
    const mid = id++;
    cbs.set(mid, { resolve: r });
    ws.send(JSON.stringify({ id: mid, method: m, params: p }));
  });
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const sendS = (m, p = {}) => new Promise(r => {
    const mid = id++;
    cbs.set(mid, { resolve: r });
    ws.send(JSON.stringify({ id: mid, sessionId, method: m, params: p }));
  });
  await sendS("Runtime.enable");

  const b64 = fs.readFileSync("D:/social-main/public/images/socialassist-logo.png").toString("base64");

  const res = await sendS("Runtime.evaluate", {
    returnByValue: true,
    expression: `new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, c.width, c.height).data;
        
        // Find outer boundary vertices of the hexagon:
        // Top vertex, top-right, bottom-right, bottom vertex, bottom-left, top-left
        resolve({
          width: c.width,
          height: c.height
        });
      };
      img.src = "data:image/png;base64,${b64}";
    })`,
    awaitPromise: true
  });

  console.log("Trace result:", res.result.value);
  ws.close();
  chrome.kill();
}

tracePath().catch(console.error);
