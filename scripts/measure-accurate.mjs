import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(process.cwd(), ".chrome-profile-inspect2");

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9296",
    `--user-data-dir=${USER_DATA}`,
    "--window-size=390,844",
    "--hide-scrollbars",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ],
  { stdio: "ignore" }
);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  try {
    let wsUrl = null;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch("http://127.0.0.1:9296/json/version");
        if (res.ok) {
          const data = await res.json();
          wsUrl = data.webSocketDebuggerUrl;
          break;
        }
      } catch {}
      await sleep(400);
    }
    if (!wsUrl) throw new Error("Could not connect");

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
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

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
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    await sendSession("Page.navigate", { url: "http://localhost:3000" });
    await sleep(3500);

    const res = await sendSession("Runtime.evaluate", {
      expression: `(() => {
        try {
          const W = window.innerWidth;
          function b(el) {
            if (!el) return "NULL";
            const r = el.getBoundingClientRect();
            return { l: Math.round(r.left), r: Math.round(W - r.right), w: Math.round(r.width), t: Math.round(r.top), b: Math.round(r.bottom) };
          }
          const ex = document.getElementById("exchange");
          const otc = ex ? ex.querySelector("otc-section") : null;
          const otcSr = otc ? otc.shadowRoot : null;
          const auto = document.getElementById("automation");

          return {
            windowWidth: W,
            otc_section: b(ex),
            otc_customEl: b(otc),
            otc_page: b(otcSr ? otcSr.querySelector(".page") : null),
            otc_header: b(otcSr ? otcSr.querySelector("header") : null),
            otc_h1: b(otcSr ? otcSr.querySelector("h1") : null),
            otc_card: b(otcSr ? otcSr.querySelector(".card") : null),
            otc_os: b(otcSr ? otcSr.querySelector(".os") : null),
            otc_os_row: b(otcSr ? otcSr.querySelector(".os-row") : null),
            otc_os_cta: b(otcSr ? otcSr.querySelector(".os-cta") : null),

            auto_section: b(auto),
            auto_wrap: b(auto ? auto.querySelector(".max-w-6xl") : null),
            auto_h2: b(document.getElementById("automation-heading")),
            auto_sub: b(auto ? auto.querySelector("p") : null),
            auto_globeStage: b(auto ? auto.querySelector(".orbiting-globe-stage") : null),
            auto_cardsWrap: b(auto ? auto.querySelector(".flex-col.gap-3\\\\.5") : null),
            auto_firstCard: b(auto ? auto.querySelector(".flex-col.gap-3\\\\.5 > div") : null),
            
            gap_otc_to_auto: (auto && ex) ? Math.round(auto.getBoundingClientRect().top - ex.getBoundingClientRect().bottom) : null
          };
        } catch(e) {
          return { error: e.message, stack: e.stack };
        }
      })()`,
      returnByValue: true
    });

    console.log("ACCURATE METRICS 390:", JSON.stringify(res.result.value, null, 2));

    ws.close();
  } catch(e) {
    console.error(e);
  } finally {
    try { chromeProc.kill(); } catch {}
  }
}
main();
