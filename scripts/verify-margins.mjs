import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-margins-profile-" + Date.now());
const BRAIN_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9223",
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
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9223/json/version");
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {
      await sleep(300);
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
    await sendSession("CSS.enable");

    async function measureAt(w, h, label) {
      await sendSession("Emulation.setDeviceMetricsOverride", {
        width: w,
        height: h,
        deviceScaleFactor: 2,
        mobile: w < 768,
      });

      await sendSession("Page.navigate", { url: "http://localhost:3000" });
      await sleep(2500);

      // Scroll into view
      await sendSession("Runtime.evaluate", {
        expression: `(() => {
          const el = document.querySelector('[data-stat-chart-card]');
          if (el) el.scrollIntoView({ block: 'center' });
        })()`,
      });
      await sleep(1000);

      // Measure layout
      const evalRes = await sendSession("Runtime.evaluate", {
        expression: `(() => {
          const outer = document.querySelector('[data-stat-chart-card]');
          const inner = document.querySelector('[data-peak-chart]');
          if (!outer || !inner) return { error: 'elements not found', outer: !!outer, inner: !!inner };

          const oRect = outer.getBoundingClientRect();
          const iRect = inner.getBoundingClientRect();
          const oStyle = window.getComputedStyle(outer);
          const iStyle = window.getComputedStyle(inner);

          const borderTop = parseFloat(oStyle.borderTopWidth) || 0;
          const borderBottom = parseFloat(oStyle.borderBottomWidth) || 0;
          const borderLeft = parseFloat(oStyle.borderLeftWidth) || 0;
          const borderRight = parseFloat(oStyle.borderRightWidth) || 0;

          // Pure white margin inside the border
          const topWhiteMargin = (iRect.top - (oRect.top + borderTop));
          const bottomWhiteMargin = ((oRect.bottom - borderBottom) - iRect.bottom);
          const leftWhiteMargin = (iRect.left - (oRect.left + borderLeft));
          const rightWhiteMargin = ((oRect.right - borderRight) - iRect.right);

          // Total margin from outer edge
          const totalTop = iRect.top - oRect.top;
          const totalBottom = oRect.bottom - iRect.bottom;
          const totalLeft = iRect.left - oRect.left;
          const totalRight = oRect.right - iRect.right;

          return {
            outerDimensions: { width: oRect.width, height: oRect.height },
            innerDimensions: { width: iRect.width, height: iRect.height },
            cornerRadii: {
              outerBorderRadius: oStyle.borderRadius,
              innerBorderRadius: iStyle.borderRadius,
              outerBorderTopLeftRadius: oStyle.borderTopLeftRadius,
              innerBorderTopLeftRadius: iStyle.borderTopLeftRadius,
            },
            paddingComputed: {
              top: oStyle.paddingTop,
              bottom: oStyle.paddingBottom,
              left: oStyle.paddingLeft,
              right: oStyle.paddingRight,
            },
            whiteMarginsInsideBorder: {
              top: Math.round(topWhiteMargin * 100) / 100,
              bottom: Math.round(bottomWhiteMargin * 100) / 100,
              left: Math.round(leftWhiteMargin * 100) / 100,
              right: Math.round(rightWhiteMargin * 100) / 100,
              isTopBottomEqual: Math.abs(topWhiteMargin - bottomWhiteMargin) < 0.5,
              isLeftRightEqual: Math.abs(leftWhiteMargin - rightWhiteMargin) < 0.5,
              isAllFourEqual: Math.abs(topWhiteMargin - bottomWhiteMargin) < 0.5 &&
                              Math.abs(leftWhiteMargin - rightWhiteMargin) < 0.5 &&
                              Math.abs(topWhiteMargin - leftWhiteMargin) < 0.5
            },
            totalMarginsFromOuterEdge: {
              top: Math.round(totalTop * 100) / 100,
              bottom: Math.round(totalBottom * 100) / 100,
              left: Math.round(totalLeft * 100) / 100,
              right: Math.round(totalRight * 100) / 100,
              isAllFourEqual: Math.abs(totalTop - totalBottom) < 0.5 &&
                              Math.abs(totalLeft - totalRight) < 0.5 &&
                              Math.abs(totalTop - totalLeft) < 0.5
            }
          };
        })()`,
        returnByValue: true,
      });

      console.log(`=== ${label} (${w}x${h}) ===`);
      console.log(JSON.stringify(evalRes.result.value, null, 2));

      // Capture screenshot of the chart card
      const clipRes = await sendSession("Runtime.evaluate", {
        expression: `(() => {
          const el = document.querySelector('[data-stat-chart-card]');
          if (!el) return null;
          const r = el.getBoundingClientRect();
          const pageX = window.scrollX + r.x;
          const pageY = window.scrollY + r.y;
          return { x: Math.max(0, pageX - 24), y: Math.max(0, pageY - 24), width: r.width + 48, height: r.height + 48 };
        })()`,
        returnByValue: true,
      });

      if (clipRes.result.value) {
        const { data } = await sendSession("Page.captureScreenshot", {
          clip: {
            ...clipRes.result.value,
            scale: 2,
          },
        });
        const outPath = path.join(BRAIN_DIR, `chart_alignment_${label.toLowerCase()}.png`);
        fs.writeFileSync(outPath, Buffer.from(data, "base64"));
        console.log(`Saved screenshot to ${outPath}`);
      }
    }

    await measureAt(1440, 900, "Desktop");
    await measureAt(768, 1024, "Tablet");
    await measureAt(390, 844, "Mobile");

    ws.close();
  } catch (err) {
    console.error("Error in margin verification script:", err);
  } finally {
    try {
      chromeProc.kill();
    } catch {}
    try {
      fs.rmSync(USER_DATA, { recursive: true, force: true });
    } catch {}
  }
}

main();
