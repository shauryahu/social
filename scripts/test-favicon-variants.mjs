import { spawn } from "node:child_process";
import fs from "node:fs";

async function testVariants() {
  const PORT = 9561;
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

  // Load the transparent 1024x1024 logo
  const b64 = fs.readFileSync("D:/social-main/public/images/socialassist-logo.png").toString("base64");

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        margin: 0;
        padding: 40px;
        background: #111;
        font-family: system-ui, -apple-system, sans-serif;
        color: #fff;
      }
      .row {
        display: flex;
        gap: 30px;
        margin-bottom: 30px;
      }
      .tab-preview {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: 8px 8px 0 0;
        font-size: 13px;
        font-weight: 500;
      }
      .tab-dark {
        background: #202124;
        color: #e8eaed;
        border: 1px solid #3c4043;
      }
      .tab-light {
        background: #dee1e6;
        color: #1f1f1f;
        border: 1px solid #c1c4c8;
      }
      .section-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #9aa0a6;
      }
    </style>
  </head>
  <body>
    <div id="container"></div>

    <script>
      const img = new Image();
      img.onload = () => {
        // Crop logo tightly to its bounding box
        // Bounding box: x=273, y=183, w=479, h=625
        const cropC = document.createElement('canvas');
        cropC.width = 479;
        cropC.height = 625;
        const cropCtx = cropC.getContext('2d');
        cropCtx.drawImage(img, 273, 183, 479, 625, 0, 0, 479, 625);

        // Helper to generate a 32x32 favicon variant
        function makeVariant(type) {
          const size = 32;
          const c = document.createElement('canvas');
          c.width = size;
          c.height = size;
          const ctx = c.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          if (type === 'white-circle') {
            // White circular disc with transparent corners (matching reference 1 & navbar badge)
            ctx.beginPath();
            ctx.arc(size/2, size/2, size/2 - 1, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            // Draw logo scaled inside circle (~65% diameter)
            const targetH = size * 0.62;
            const targetW = targetH * (479 / 625);
            const x = (size - targetW) / 2;
            const y = (size - targetH) / 2;
            ctx.drawImage(cropC, x, y, targetW, targetH);
          } else if (type === 'transparent-black') {
            // Pure transparent background, black logo
            const targetH = size * 0.88;
            const targetW = targetH * (479 / 625);
            const x = (size - targetW) / 2;
            const y = (size - targetH) / 2;
            ctx.drawImage(cropC, x, y, targetW, targetH);
          } else if (type === 'white-glyph') {
            // Pure transparent background, white logo
            const targetH = size * 0.88;
            const targetW = targetH * (479 / 625);
            const x = (size - targetW) / 2;
            const y = (size - targetH) / 2;
            // Draw in offscreen, tint white
            const off = document.createElement('canvas');
            off.width = size;
            off.height = size;
            const octx = off.getContext('2d');
            octx.drawImage(cropC, x, y, targetW, targetH);
            octx.globalCompositeOperation = 'source-in';
            octx.fillStyle = '#ffffff';
            octx.fillRect(0, 0, size, size);
            ctx.drawImage(off, 0, 0);
          } else if (type === 'adaptive-halo') {
            // Black logo with subtle 1px white outline so visible on both light and dark
            const targetH = size * 0.82;
            const targetW = targetH * (479 / 625);
            const x = (size - targetW) / 2;
            const y = (size - targetH) / 2;
            
            // Draw subtle halo
            const off = document.createElement('canvas');
            off.width = size;
            off.height = size;
            const octx = off.getContext('2d');
            octx.drawImage(cropC, x, y, targetW, targetH);
            octx.globalCompositeOperation = 'source-in';
            octx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            octx.fillRect(0, 0, size, size);
            
            // Draw halo in 8 directions
            for (let dx = -1; dx <= 1; dx++) {
              for (let dy = -1; dy <= 1; dy++) {
                if (dx !== 0 || dy !== 0) ctx.drawImage(off, dx, dy);
              }
            }
            // Draw black logo over top
            ctx.drawImage(cropC, x, y, targetW, targetH);
          }
          return c.toDataURL('image/png');
        }

        const variants = [
          { id: 'white-circle', label: 'Variant 1: White Circular Badge (Exact Match to Ref 1 & Site Navbar)' },
          { id: 'transparent-black', label: 'Variant 2: Transparent Background (Pure Black Logo)' },
          { id: 'adaptive-halo', label: 'Variant 3: Transparent Background (Black with Crisp White Halo)' },
          { id: 'white-glyph', label: 'Variant 4: Transparent Background (Pure White Logo)' }
        ];

        const cont = document.getElementById('container');
        variants.forEach(v => {
          const url = makeVariant(v.id);
          const block = document.createElement('div');
          block.innerHTML = \`
            <div class="section-title">\${v.label}</div>
            <div class="row">
              <div class="tab-preview tab-dark">
                <img src="\${url}" width="16" height="16" />
                <span>SocialAssist — We Resolve. We Protect.</span>
                <span style="opacity: 0.6; margin-left: 8px;">✕</span>
              </div>
              <div class="tab-preview tab-light">
                <img src="\${url}" width="16" height="16" />
                <span>SocialAssist — We Resolve. We Protect.</span>
                <span style="opacity: 0.6; margin-left: 8px;">✕</span>
              </div>
            </div>
          \`;
          cont.appendChild(block);
        });
      };
      img.src = "data:image/png;base64,${b64}";
    </script>
  </body>
  </html>
  `;

  await sendS("Page.enable");
  await sendS("Page.setDocumentContent", { frameId: targetId, html });
  await sleep(1500);

  const shot = await sendS("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync("scripts/favicon-variants-comparison.png", Buffer.from(shot.data, "base64"));
  console.log("Comparison saved to scripts/favicon-variants-comparison.png");

  ws.close();
  chrome.kill();
}

testVariants().catch(console.error);
