import { spawn } from "node:child_process";
import fs from "node:fs";

const PORT = 9520;
const chromeProc = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new",
  "--remote-debugging-port=" + PORT,
  "--disable-extensions",
  "about:blank"
]);

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
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

  const viewports = [
    { name: "1440_light", width: 1440, height: 900, dark: false },
    { name: "1440_dark", width: 1440, height: 900, dark: true },
    { name: "1024_light", width: 1024, height: 768, dark: false },
    { name: "820_light", width: 820, height: 1180, dark: false },
    { name: "768_light", width: 768, height: 1024, dark: false },
    { name: "390_light", width: 390, height: 844, dark: false }
  ];

  const results = [];

  for (const vp of viewports) {
    await sendS("Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.width < 768
    });
    await sendS("Page.navigate", { url: "http://localhost:3000" });
    await sleep(3500);

    const data = await sendS("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const p = document.getElementById('pre');
        if (p) p.remove();
        document.body.classList.remove('lock');
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        if (${vp.dark}) {
          document.documentElement.removeAttribute('data-theme');
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        }

        // Scroll to Journey / About section
        const el = document.getElementById('about');
        if (el) el.scrollIntoView({ block: 'start' });
        window.scrollBy(0, 150);

        const bar = document.querySelector('.sa-nav .bar');
        const header = document.querySelector('.sa-nav');
        const barRect = bar ? bar.getBoundingClientRect() : null;
        const winWidth = window.innerWidth;

        return {
          winWidth,
          barWidth: barRect ? barRect.width : 0,
          barRatio: barRect ? (barRect.width / winWidth) : 0,
          barStyles: bar ? {
            background: window.getComputedStyle(bar).background,
            backdropFilter: window.getComputedStyle(bar).backdropFilter || window.getComputedStyle(bar).webkitBackdropFilter,
            width: window.getComputedStyle(bar).width,
            position: window.getComputedStyle(bar).position,
            justifyContent: window.getComputedStyle(bar).justifyContent
          } : null
        };
      })()`
    });

    await sleep(600);
    const shot = await sendS("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(`scripts/nav-${vp.name}.png`, Buffer.from(shot.data, "base64"));
    results.push({ ...vp, ...data.result.value });
  }

  console.log("Viewport audit results:", JSON.stringify(results, null, 2));
  chromeProc.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  chromeProc.kill();
  process.exit(1);
});
