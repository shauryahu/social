import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-chrome-geom-" + Date.now());

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9296",
    `--user-data-dir=${USER_DATA}`,
    "--window-size=1440,900",
    "--hide-scrollbars",
    "--disable-gpu-sandbox",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ],
  { stdio: "ignore" }
);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getDebuggerUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9296/json/version");
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {}
    await sleep(250);
  }
  throw new Error("Could not connect to Chrome debugging port");
}

async function main() {
  try {
    const wsUrl = await getDebuggerUrl();
    const ws = new WebSocket(wsUrl);

    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const cb = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) cb.reject(new Error(msg.error.message));
        else cb.resolve(msg.result);
      }
    };

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        callbacks.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });

    function sendSession(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        callbacks.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
      });
    }

    await sendSession("Page.enable");
    await sendSession("DOM.enable");
    await sendSession("Page.navigate", { url: "http://localhost:3000" });
    await sleep(4000);

    const widths = [390, 600, 768, 820, 1024, 1180, 1440];
    const geomReport = [];

    for (const w of widths) {
      await sendSession("Emulation.setDeviceMetricsOverride", {
        width: w,
        height: 900,
        deviceScaleFactor: 1,
        mobile: w <= 600,
      });
      await sleep(300);

      const data = await sendSession("Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const wrap = document.querySelector('.sa-nav-wrap');
          const bar = document.querySelector('.sa-nav .bar');
          const desk = document.querySelector('.sa-nav .desk');
          const mob = document.querySelector('.sa-nav .mob');
          const wrapRect = wrap ? wrap.getBoundingClientRect() : null;
          const barRect = bar ? bar.getBoundingClientRect() : null;
          const bodyOverflow = document.body.scrollWidth > window.innerWidth;
          
          let panelData = null;
          if (${w} <= 600) {
            const toggle = document.querySelector('.sa-nav .mob .btn-toggle');
            if (toggle) toggle.click();
            const panel = document.querySelector('.sa-nav .panel');
            if (panel) {
              const pr = panel.getBoundingClientRect();
              panelData = {
                panelTop: Math.round(pr.top),
                barBottom: Math.round(barRect.bottom),
                gap: Math.round(pr.top - barRect.bottom),
                panelHeight: Math.round(pr.height),
                panelWidth: Math.round(pr.width),
                overflowY: window.getComputedStyle(panel).overflowY,
                backdropFilter: window.getComputedStyle(panel).backdropFilter
              };
            }
            if (toggle) toggle.click();
          }

          return {
            viewportWidth: ${w},
            hasHorizontalScroll: bodyOverflow,
            bodyScrollWidth: document.body.scrollWidth,
            wrapWidth: wrapRect ? Math.round(wrapRect.width) : null,
            barWidth: barRect ? Math.round(barRect.width) : null,
            barHeight: barRect ? Math.round(barRect.height) : null,
            deskVisible: desk ? window.getComputedStyle(desk).display !== 'none' : false,
            mobVisible: mob ? window.getComputedStyle(mob).display !== 'none' : false,
            panel: panelData
          };
        })()`,
      });

      geomReport.push(data.result ? data.result.value : data.value);
    }

    console.log("Geometry Report Across Viewports:", JSON.stringify(geomReport, null, 2));

  } catch (err) {
    console.error("Geom error:", err);
  } finally {
    chromeProc.kill();
    process.exit(0);
  }
}

main();
