import { spawn } from "node:child_process";
import fs from "node:fs";

async function test() {
  const PORT = 9555;
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

  const files = [
    "C:/Users/USER/.gemini/antigravity/brain/da496d37-3ff2-4b7f-9011-fb4d0e692a91/.user_uploaded/media_1795410606480_95cf747d.jpg",
    "D:/social-main/public/images/socialassist-logo.png",
    "D:/social-main/public/images/toplogo1.png",
    "D:/social-main/src/app/icon.png"
  ];

  for (const f of files) {
    const b64 = fs.readFileSync(f).toString("base64");
    const mime = f.endsWith(".jpg") ? "image/jpeg" : "image/png";
    const res = await sendS("Runtime.evaluate", {
      returnByValue: true,
      expression: `new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const data = ctx.getImageData(0, 0, Math.min(10, canvas.width), Math.min(10, canvas.height)).data;
          // sample top-left pixel
          const corner = [data[0], data[1], data[2], data[3]];
          resolve({ width: img.naturalWidth, height: img.naturalHeight, cornerPixel: corner });
        };
        img.onerror = () => resolve({ error: true });
        img.src = "data:${mime};base64,${b64}";
      })`,
      awaitPromise: true
    });
    console.log(f.split("/").pop(), res.result.value);
  }

  ws.close();
  chrome.kill();
}
test().catch(console.error);
