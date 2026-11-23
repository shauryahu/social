import { spawn } from "node:child_process";
import fs from "node:fs";

async function compare() {
  const PORT = 9556;
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

  const files = {
    userLogo: "C:/Users/USER/.gemini/antigravity/brain/da496d37-3ff2-4b7f-9011-fb4d0e692a91/.user_uploaded/media_1795410606480_95cf747d.jpg",
    socialassistLogo: "D:/social-main/public/images/socialassist-logo.png",
    toplogo1: "D:/social-main/public/images/toplogo1.png",
    srcIcon: "D:/social-main/src/app/icon.png"
  };

  const results = {};
  for (const [name, path] of Object.entries(files)) {
    const b64 = fs.readFileSync(path).toString("base64");
    const mime = path.endsWith(".jpg") ? "image/jpeg" : "image/png";
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
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const d = imgData.data;
          
          let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
          let nonWhiteOrNonTransparent = 0;
          let sampleColors = [];
          
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const idx = (y * canvas.width + x) * 4;
              const r = d[idx], g = d[idx+1], b = d[idx+2], a = d[idx+3];
              // Check if not white and not transparent
              const isDark = a > 50 && (r < 240 || g < 240 || b < 240);
              if (isDark) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
                nonWhiteOrNonTransparent++;
                if (sampleColors.length < 5) {
                  sampleColors.push({ r, g, b, a });
                }
              }
            }
          }
          resolve({
            width: canvas.width,
            height: canvas.height,
            darkPixelsCount: nonWhiteOrNonTransparent,
            bbox: { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY },
            sampleColors
          });
        };
        img.src = "data:${mime};base64,${b64}";
      })`,
      awaitPromise: true
    });
    results[name] = res.result.value;
  }

  console.log(JSON.stringify(results, null, 2));
  ws.close();
  chrome.kill();
}

compare().catch(console.error);
