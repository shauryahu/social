import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BRAIN_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";
const USER_DATA = path.join(process.cwd(), ".chrome-profile-bp3");

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9290",
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
      const res = await fetch("http://127.0.0.1:9290/json/version");
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

    const getMetrics = async () => {
      return await sendSession("Runtime.evaluate", {
        expression: `(() => {
          function toObj(r) {
            if (!r) return null;
            return { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), height: Math.round(r.height) };
          }
          const bp = document.getElementById("brand-protection");
          const bd = bp ? bp.querySelector("brand-defense") : null;
          const sr = bd ? bd.shadowRoot : null;
          const wrap = sr ? sr.querySelector(".wrap") : null;
          const list = sr ? sr.querySelector(".list") : null;
          const h1 = sr ? sr.querySelector("h1") : null;
          const cta = sr ? sr.querySelector(".cta") : null;
          const ex = document.getElementById("exchange");
          const exOtc = ex ? ex.querySelector("otc-section") : null;
          const exSr = exOtc ? exOtc.shadowRoot : null;
          const exEyebrow = exSr ? exSr.querySelector(".eyebrow") : null;

          const wrapR = wrap ? wrap.getBoundingClientRect() : null;
          const listR = list ? list.getBoundingClientRect() : null;
          const ctaR = cta ? cta.getBoundingClientRect() : null;
          const h1R = h1 ? h1.getBoundingClientRect() : null;
          const exR = ex ? ex.getBoundingClientRect() : null;
          const exEyebrowR = exEyebrow ? exEyebrow.getBoundingClientRect() : null;

          return {
            windowWidth: window.innerWidth,
            wrap: toObj(wrapR),
            list: toObj(listR),
            h1: toObj(h1R),
            cta: toObj(ctaR),
            // Insets from screen edges
            leftMarginList: listR ? Math.round(listR.left) : null,
            rightMarginList: listR ? Math.round(window.innerWidth - listR.right) : null,
            leftMarginH1: h1R ? Math.round(h1R.left) : null,
            leftMarginCTA: ctaR ? Math.round(ctaR.left) : null,
            gapFromListToNextSection: (exR && listR) ? Math.round(exR.top - listR.bottom) : null,
            gapFromListToExEyebrow: (exEyebrowR && listR) ? Math.round(exEyebrowR.top - listR.bottom) : null,
          };
        })()`,
        returnByValue: true
      });
    };

    const viewports = [
      { name: "375", width: 375, height: 812, mobile: true },
      { name: "390", width: 390, height: 844, mobile: true },
      { name: "430", width: 430, height: 932, mobile: true },
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

      // Scroll to brand protection
      await sendSession("Runtime.evaluate", {
        expression: `(() => {
          const el = document.getElementById("brand-protection");
          if (el) {
            const rect = el.getBoundingClientRect();
            window.scrollTo(0, window.scrollY + rect.top - 20);
          }
        })()`,
      });
      await sleep(1000);

      const metrics = await getMetrics();
      console.log(`Metrics for ${vp.name}px:`, JSON.stringify(metrics.result.value, null, 2));

      const shot = await sendSession("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(BRAIN_DIR, `brand_defense_${vp.name}.png`), Buffer.from(shot.data, "base64"));
      console.log(`Saved brand_defense_${vp.name}.png!`);
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
