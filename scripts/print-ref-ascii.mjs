import { spawn } from "node:child_process";
import fs from "node:fs";

async function printAscii() {
  const PORT = 9558;
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

  const b64 = fs.readFileSync("C:/Users/USER/.gemini/antigravity/brain/da496d37-3ff2-4b7f-9011-fb4d0e692a91/.user_uploaded/media_1795410598721_55b7c27e.png").toString("base64");
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
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let out = [];
        for (let y = 0; y < canvas.height; y += 2) {
          let line = '';
          for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            const r = data[idx], g = data[idx+1], b = data[idx+2];
            const brightness = (r + g + b) / 3;
            line += brightness > 200 ? '#' : (brightness > 100 ? '+' : (brightness > 40 ? '.' : ' '));
          }
          out.push(line);
        }
        resolve(out.join('\\n'));
      };
      img.src = "data:image/png;base64,${b64}";
    })`,
    awaitPromise: true
  });

  console.log(res.result.value);
  ws.close();
  chrome.kill();
}
printAscii().catch(console.error);
