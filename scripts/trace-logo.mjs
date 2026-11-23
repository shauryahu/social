import { spawn } from "node:child_process";
import fs from "node:fs";

async function traceLogo() {
  const PORT = 9560;
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

  // Load the 1024x1024 transparent logo
  const b64 = fs.readFileSync("D:/social-main/public/images/socialassist-logo.png").toString("base64");

  const info = await sendS("Runtime.evaluate", {
    returnByValue: true,
    expression: `new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, c.width, c.height);
        const d = imgData.data;

        // Find exact bounding box of non-transparent pixels
        let minX = c.width, minY = c.height, maxX = 0, maxY = 0;
        for (let y = 0; y < c.height; y++) {
          for (let x = 0; x < c.width; x++) {
            const alpha = d[(y * c.width + x) * 4 + 3];
            if (alpha > 10) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        resolve({
          width: c.width,
          height: c.height,
          bbox: { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 }
        });
      };
      img.src = "data:image/png;base64,${b64}";
    })`,
    awaitPromise: true
  });

  console.log("Logo info:", JSON.stringify(info.result.value, null, 2));
  ws.close();
  chrome.kill();
}

traceLogo().catch(console.error);
