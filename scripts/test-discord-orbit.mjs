import { spawn } from "node:child_process";
import fs from "node:fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chromeProc = spawn(CHROME_PATH, [
  "--headless=new",
  "--remote-debugging-port=9261",
  "--window-size=1440,1200",
  "about:blank",
]);

setTimeout(async () => {
  try {
    const v = await fetch("http://127.0.0.1:9261/json/version").then((r) => r.json());
    const ws = new WebSocket(v.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));
    let id = 1;
    const send = (m, p = {}) =>
      new Promise((res) => {
        const cur = id++;
        const h = (e) => {
          const d = JSON.parse(e.data);
          if (d.id === cur) {
            ws.removeEventListener("message", h);
            res(d.result);
          }
        };
        ws.addEventListener("message", h);
        ws.send(JSON.stringify({ id: cur, method: m, params: p }));
      });
    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
    const sendS = (m, p = {}) =>
      new Promise((res) => {
        const cur = id++;
        const h = (e) => {
          const d = JSON.parse(e.data);
          if (d.id === cur) {
            ws.removeEventListener("message", h);
            res(d.result);
          }
        };
        ws.addEventListener("message", h);
        ws.send(JSON.stringify({ id: cur, sessionId, method: m, params: p }));
      });

    await sendS("Page.enable");
    await sendS("Page.navigate", { url: "http://localhost:3000" });
    await new Promise((r) => setTimeout(r, 4000));

    // Force theme to dark
    await sendS("Runtime.evaluate", {
      expression: `
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.add('dark');
      `,
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Inspect Discord icon position through rotation
    const res = await sendS("Runtime.evaluate", {
      returnByValue: true,
      expression: `
        (() => {
          const radar = document.querySelector('platform-radar');
          if (!radar || !radar.shadowRoot) return "no radar";
          const rRect = radar.getBoundingClientRect();
          const orbit2 = radar.shadowRoot.querySelectorAll('.orbit')[2];
          const discordTile = Array.from(radar.shadowRoot.querySelectorAll('.tile')).find(t => (t.getAttribute('aria-label') || '').includes('Discord') || t.innerHTML.includes('Discord'));
          const discordApp = discordTile ? discordTile.closest('.app') : null;
          const stagew = radar.shadowRoot.querySelector('.stagew');
          const stage = radar.shadowRoot.querySelector('.stage');
          const pill = radar.shadowRoot.querySelector('#pill');
          const cap = radar.shadowRoot.querySelector('#cap');
          const resto = document.querySelector('restoration-section');
          const restoRect = resto ? resto.getBoundingClientRect() : null;

          // Check if Discord intersects with pill, cap, seamFade, or resto
          const discRect = discordTile ? discordTile.getBoundingClientRect() : null;
          const stagewRect = stagew ? stagew.getBoundingClientRect() : null;
          const capRect = cap ? cap.getBoundingClientRect() : null;

          return {
            radarRect: { top: rRect.top, bottom: rRect.bottom, height: rRect.height },
            restoRect: restoRect ? { top: restoRect.top, bottom: restoRect.bottom } : null,
            stagewRect: stagewRect ? { top: stagewRect.top, bottom: stagewRect.bottom, height: stagewRect.height } : null,
            capRect: capRect ? { top: capRect.top, bottom: capRect.bottom } : null,
            discRect,
            overflow: getComputedStyle(radar).overflow,
            orbit2Animation: orbit2 ? getComputedStyle(orbit2).animation : null
          };
        })()
      `,
    });

    console.log("Discord & Orbit measurements:", JSON.stringify(res.result.value, null, 2));

  } catch (e) {
    console.error(e);
  } finally {
    chromeProc.kill();
    process.exit(0);
  }
}, 1000);
