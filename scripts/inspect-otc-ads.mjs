import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BRAIN_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";
const USER_DATA = path.join(process.cwd(), ".chrome-profile-inspect-otc-ads");

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9295",
    `--user-data-dir=${USER_DATA}`,
    "--window-size=1440,1100",
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

async function getDebuggerUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9295/json/version");
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {
      await sleep(400);
    }
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

    const getSectionMetrics = async () => {
      return await sendSession("Runtime.evaluate", {
        expression: `(() => {
          function toObj(r) {
            if (!r) return null;
            return { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), height: Math.round(r.height) };
          }
          const W = window.innerWidth;

          // OTC Section
          const ex = document.getElementById("exchange");
          const otc = ex ? ex.querySelector("otc-section") : null;
          const otcSr = otc ? otc.shadowRoot : null;
          const otcPage = otcSr ? otcSr.querySelector(".page") : null;
          const otcHeader = otcSr ? otcSr.querySelector("header") : null;
          const otcH1 = otcSr ? otcSr.querySelector("h1") : null;
          const otcSub = otcSr ? otcSr.querySelector(".sub") : null;
          const otcCard = otcSr ? otcSr.querySelector(".card") : null;
          const otcOs = otcSr ? otcSr.querySelector(".os") : null;
          const otcOsRow = otcSr ? otcSr.querySelector(".os-row") : null;
          const otcOsCta = otcSr ? otcSr.querySelector(".os-cta") : null;

          // Advertising Section
          const auto = document.getElementById("automation");
          const autoWrap = auto ? auto.querySelector(".max-w-6xl") : null;
          const autoH2 = document.getElementById("automation-heading");
          const autoSub = auto ? auto.querySelector("p") : null;
          const autoGlobe = auto ? auto.querySelector(".orbiting-globe-stage") : null;
          const autoCards = auto ? auto.querySelector(".flex-col.gap-3.5") : null;

          function insets(el) {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { left: Math.round(r.left), right: Math.round(W - r.right), width: Math.round(r.width) };
          }

          return {
            windowWidth: W,
            otc: {
              page: insets(otcPage),
              h1: insets(otcH1),
              sub: insets(otcSub),
              card: insets(otcCard),
              os: insets(otcOs),
              osRow: insets(otcOsRow),
              osCta: insets(otcOsCta),
            },
            auto: {
              section: insets(auto),
              wrap: insets(autoWrap),
              h2: insets(autoH2),
              sub: insets(autoSub),
              globe: insets(autoGlobe),
              cards: insets(autoCards),
            },
            gapBetweenOtcAndAuto: (auto && ex) ? Math.round(auto.getBoundingClientRect().top - ex.getBoundingClientRect().bottom) : null
          };
        })()`,
        returnByValue: true
      });
    };

    const viewports = [
      { name: "375", width: 375, height: 812, mobile: true },
      { name: "390", width: 390, height: 844, mobile: true },
      { name: "1440", width: 1440, height: 1100, mobile: false },
    ];

    for (const vp of viewports) {
      await sendSession("Emulation.setDeviceMetricsOverride", {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.mobile,
      });

      await sendSession("Page.navigate", { url: "http://localhost:3000" });
      await sleep(2500);

      const metrics = await getSectionMetrics();
      console.log(`METRICS_${vp.name}:`, JSON.stringify(metrics.result.value, null, 2));

      // Scroll to exchange
      await sendSession("Runtime.evaluate", {
        expression: `(() => {
          const el = document.getElementById("exchange");
          if (el) window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - 20);
        })()`,
      });
      await sleep(1000);
      const shotOtc = await sendSession("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(BRAIN_DIR, `current_otc_${vp.name}.png`), Buffer.from(shotOtc.data, "base64"));

      // Scroll to automation
      await sendSession("Runtime.evaluate", {
        expression: `(() => {
          const el = document.getElementById("automation");
          if (el) window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - 20);
        })()`,
      });
      await sleep(1000);
      const shotAuto = await sendSession("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(BRAIN_DIR, `current_auto_${vp.name}.png`), Buffer.from(shotAuto.data, "base64"));
    }

    ws.close();
  } catch (err) {
    console.error("Error during test:", err);
  } finally {
    try {
      chromeProc.kill();
    } catch {}
  }
}

main();
