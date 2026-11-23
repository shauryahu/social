import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(process.cwd(), ".chrome-profile-verify-vs2");
const ARTIFACT_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9294",
    `--user-data-dir=${USER_DATA}`,
    "--window-size=1440,900",
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
        const res = await fetch("http://127.0.0.1:9294/json/version");
        if (res.ok) {
          const data = await res.json();
          wsUrl = data.webSocketDebuggerUrl;
          break;
        }
      } catch {}
      await sleep(400);
    }
    if (!wsUrl) throw new Error("Could not connect to port 9294");

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
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
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
    await sendSession("Runtime.enable");

    const viewports = [
      { name: "375", width: 375, height: 812, mobile: true },
      { name: "390", width: 390, height: 844, mobile: true },
      { name: "430", width: 430, height: 932, mobile: true },
      { name: "820", width: 820, height: 1180, mobile: true },
      { name: "1280", width: 1280, height: 900, mobile: false },
      { name: "1440", width: 1440, height: 900, mobile: false },
    ];

    const results = {};

    for (const vp of viewports) {
      await sendSession("Emulation.setDeviceMetricsOverride", {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.mobile,
      });

      await sendSession("Page.navigate", { url: "http://localhost:3000" });
      await sleep(3000);

      // Scroll verification-section into view
      await sendSession("Runtime.evaluate", {
        expression: `document.querySelector("verification-section")?.scrollIntoView({ behavior: "instant", block: "center" })`,
      });
      await sleep(800);

      const metrics = await sendSession("Runtime.evaluate", {
        expression: `(() => {
          const W = window.innerWidth;
          const vs = document.querySelector("verification-section");
          if (!vs) return { error: "verification-section element not found" };

          const sr = vs.shadowRoot;
          if (!sr) return { error: "verification-section shadowRoot not found" };

          function b(el) {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return {
              left: Math.round(r.left),
              right: Math.round(W - r.right),
              width: Math.round(r.width),
              top: Math.round(r.top),
              bottom: Math.round(r.bottom),
              height: Math.round(r.height)
            };
          }

          const wrap = sr.querySelector(".wrap");
          const h1 = sr.querySelector("h1");
          const lead = sr.querySelector(".lead");
          const feats = sr.querySelector(".feats");
          const firstFeat = sr.querySelector(".feat");
          const cta = sr.querySelector(".cta");
          const card = sr.querySelector(".card");
          const wrapStyle = wrap ? window.getComputedStyle(wrap) : null;

          const prevEl = vs.previousElementSibling;
          const nextEl = vs.nextElementSibling;

          return {
            viewportWidth: W,
            wrapPadding: wrapStyle ? {
              top: wrapStyle.paddingTop,
              left: wrapStyle.paddingLeft,
              right: wrapStyle.paddingRight,
              bottom: wrapStyle.paddingBottom
            } : null,
            elements: {
              vs: b(vs),
              wrap: b(wrap),
              h1: b(h1),
              lead: b(lead),
              featsGrid: b(feats),
              firstFeat: b(firstFeat),
              cta: b(cta),
              card: b(card),
            },
            hasHorizontalScroll: document.documentElement.scrollWidth > W,
            gapToPrev: prevEl ? Math.round(vs.getBoundingClientRect().top - prevEl.getBoundingClientRect().bottom) : null,
            gapToNext: nextEl ? Math.round(nextEl.getBoundingClientRect().top - vs.getBoundingClientRect().bottom) : null,
          };
        })()`,
        returnByValue: true,
      });

      results[vp.name] = metrics.result.value;

      // Capture screenshot
      const shot = await sendSession("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(
        path.join(ARTIFACT_DIR, `verified_brand_verification_${vp.name}.png`),
        Buffer.from(shot.data, "base64")
      );
    }

    console.log("ACCURATE_VERIFICATION_RESULTS:" + JSON.stringify(results, null, 2));

    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    try {
      chromeProc.kill();
    } catch {}
  }
}

main();
