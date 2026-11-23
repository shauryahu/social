import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function createIco(images) {
  // images: array of { width, height, buffer }
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(images.length, 4); // number of images

  let offset = 6 + images.length * 16;
  const entries = [];
  const dataBuffers = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color palette count (0 for 32-bit PNG)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset of image data

    entries.push(entry);
    dataBuffers.push(img.buffer);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...dataBuffers]);
}

async function main() {
  const PORT = 9565;
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

  // Read the source logo (1024x1024 transparent PNG)
  const sourceB64 = fs.readFileSync("D:/social-main/public/images/socialassist-logo.png").toString("base64");

  // Generate renders in Chrome
  const sizes = [16, 32, 48, 180, 192, 512];
  const rendered = await sendS("Runtime.evaluate", {
    returnByValue: true,
    expression: `new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        // Source bounding box: minX: 273, minY: 183, w: 479, h: 625
        const cropC = document.createElement('canvas');
        cropC.width = 479;
        cropC.height = 625;
        const cropCtx = cropC.getContext('2d');
        cropCtx.drawImage(img, 273, 183, 479, 625, 0, 0, 479, 625);

        const results = {};
        const targetSizes = [16, 32, 48, 180, 192, 512];

        targetSizes.forEach(size => {
          const c = document.createElement('canvas');
          c.width = size;
          c.height = size;
          const ctx = c.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Circular white disc (matching Apple tab icon in Reference 1 & navbar badge)
          ctx.beginPath();
          // Leave 0.5px margin on smaller icons for subpixel anti-aliasing against dark tabs
          const radius = size <= 32 ? (size / 2) - 0.5 : (size / 2) - 1.5;
          ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          // Subtle ultra-fine border for clean contrast on white/light tabs
          if (size >= 32) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.lineWidth = size <= 48 ? 1 : 2;
            ctx.stroke();
          }

          // Scale and center the black logo inside the circular disc
          // Logo aspect ratio is 479 / 625 (~0.766)
          // Make logo height 65% of badge size so it sits comfortably inside the circle with breathing room
          const targetH = Math.round(size * 0.65);
          const targetW = Math.round(targetH * (479 / 625));
          const x = Math.round((size - targetW) / 2);
          const y = Math.round((size - targetH) / 2);

          ctx.drawImage(cropC, x, y, targetW, targetH);
          results[size] = c.toDataURL('image/png').split(',')[1];
        });

        // Also generate 512x512 standalone cropped logo (transparent background)
        const cStand = document.createElement('canvas');
        cStand.width = 512;
        cStand.height = 512;
        const sCtx = cStand.getContext('2d');
        sCtx.imageSmoothingEnabled = true;
        sCtx.imageSmoothingQuality = 'high';
        const sH = Math.round(512 * 0.88);
        const sW = Math.round(sH * (479 / 625));
        sCtx.drawImage(cropC, Math.round((512 - sW) / 2), Math.round((512 - sH) / 2), sW, sH);
        results['transparent_512'] = cStand.toDataURL('image/png').split(',')[1];

        resolve(results);
      };
      img.src = "data:image/png;base64,${sourceB64}";
    })`,
    awaitPromise: true
  });

  const imgData = rendered.result.value;

  // Convert base64 to buffers
  const buf16 = Buffer.from(imgData[16], "base64");
  const buf32 = Buffer.from(imgData[32], "base64");
  const buf48 = Buffer.from(imgData[48], "base64");
  const buf180 = Buffer.from(imgData[180], "base64");
  const buf192 = Buffer.from(imgData[192], "base64");
  const buf512 = Buffer.from(imgData[512], "base64");

  // 1. Write favicon-16x16.png
  fs.writeFileSync("public/favicon-16x16.png", buf16);
  console.log("Wrote public/favicon-16x16.png (" + buf16.length + " bytes)");

  // 2. Write favicon-32x32.png
  fs.writeFileSync("public/favicon-32x32.png", buf32);
  console.log("Wrote public/favicon-32x32.png (" + buf32.length + " bytes)");

  // 3. Write apple-touch-icon.png
  fs.writeFileSync("public/apple-touch-icon.png", buf180);
  console.log("Wrote public/apple-touch-icon.png (" + buf180.length + " bytes)");

  // 4. Write icon.png (512x512) and 192x192
  fs.writeFileSync("public/icon.png", buf512);
  fs.writeFileSync("src/app/icon.png", buf512);
  console.log("Wrote public/icon.png and src/app/icon.png (512x512)");

  // 5. Build and write multi-size favicon.ico (16, 32, 48)
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: buf16 },
    { width: 32, height: 32, buffer: buf32 },
    { width: 48, height: 48, buffer: buf48 }
  ]);
  fs.writeFileSync("public/favicon.ico", icoBuffer);
  fs.writeFileSync("src/app/favicon.ico", icoBuffer);
  console.log("Wrote public/favicon.ico and src/app/favicon.ico (" + icoBuffer.length + " bytes)");

  // 6. Generate favicon.svg (SVG vector with circular badge and crisp embedded high-res logo)
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <circle cx="256" cy="256" r="250" fill="#ffffff" stroke="rgba(0,0,0,0.06)" stroke-width="4" />
  <image x="128" y="89" width="256" height="334" href="data:image/png;base64,${imgData['transparent_512']}" />
</svg>
`;
  fs.writeFileSync("public/favicon.svg", svgContent);
  console.log("Wrote public/favicon.svg (" + svgContent.length + " bytes)");

  // 7. Update toplogo1.png (referenced in layout.tsx)
  fs.writeFileSync("public/images/toplogo1.png", buf512);
  console.log("Updated public/images/toplogo1.png with crisp 512x512 SocialAssist badge");

  ws.close();
  chrome.kill();
  console.log("All favicon assets generated successfully!");
}

main().catch(console.error);
