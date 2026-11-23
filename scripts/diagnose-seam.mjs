import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-chrome-seam-" + Date.now());

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9258",
    `--user-data-dir=${USER_DATA}`,
    "--window-size=1440,1200",
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
      const res = await fetch("http://127.0.0.1:9258/json/version");
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
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 1200,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log("Navigating to http://localhost:3000 ...");
    await sendSession("Page.navigate", { url: "http://localhost:3000" });
    await sleep(4500);

    // Switch to dark mode
    console.log("Switching to dark theme ...");
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        localStorage.setItem('socialassist-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        window.dispatchEvent(new Event('socialassist-theme-change'));
      })()`,
    });
    await sleep(1500);

    // Run diagnostic
    console.log("Running seam diagnostic in page ...");
    const evalRes = await sendSession("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const radar = document.querySelector('platform-radar');
        const resto = document.querySelector('restoration-section');
        const rRect = radar ? radar.getBoundingClientRect() : null;
        const reRect = resto ? resto.getBoundingClientRect() : null;

        function getStyles(el) {
          if (!el) return null;
          const cs = getComputedStyle(el);
          return {
            bg: cs.backgroundColor,
            bgImg: cs.backgroundImage,
            borderTop: cs.borderTop,
            borderBottom: cs.borderBottom,
            overflow: cs.overflow,
            overflowX: cs.overflowX,
            overflowY: cs.overflowY,
            boxShadow: cs.boxShadow,
            mask: cs.mask || cs.webkitMask,
            maskImg: cs.maskImage || cs.webkitMaskImage,
            zIndex: cs.zIndex,
            position: cs.position,
            height: cs.height,
            paddingBottom: cs.paddingBottom,
            marginBottom: cs.marginBottom
          };
        }

        let radarShadow = {};
        if (radar && radar.shadowRoot) {
          const host = radar;
          const wrap = radar.shadowRoot.querySelector('.wrap');
          const stagew = radar.shadowRoot.querySelector('.stagew');
          const stage = radar.shadowRoot.querySelector('.stage');
          const seamFade = radar.shadowRoot.querySelector('.seam-fade');
          const orbs = radar.shadowRoot.querySelector('.orbs');
          
          const allApps = Array.from(radar.shadowRoot.querySelectorAll('.app, .tile, .pos')).map(el => {
            const r = el.getBoundingClientRect();
            return {
              tag: el.tagName,
              cls: el.className,
              name: el.getAttribute('data-name') || el.getAttribute('aria-label') || el.getAttribute('data-i'),
              top: r.top,
              bottom: r.bottom,
              height: r.height,
              overflowsRadarBottom: rRect ? (r.bottom > rRect.bottom) : false
            };
          });

          radarShadow = {
            host: getStyles(host),
            wrap: getStyles(wrap),
            stagew: getStyles(stagew),
            stage: getStyles(stage),
            seamFade: getStyles(seamFade),
            orbs: getStyles(orbs),
            radarBottom: rRect ? rRect.bottom : 0,
            allApps
          };
        }

        let restoShadow = {};
        if (resto && resto.shadowRoot) {
          const host = resto;
          const wrap = resto.shadowRoot.querySelector('.wrap');
          const orbs = resto.shadowRoot.querySelector('.orbs');
          restoShadow = {
            host: getStyles(host),
            wrap: getStyles(wrap),
            orbs: getStyles(orbs),
            restoTop: reRect ? reRect.top : 0
          };
        }

        // Parent container
        let radarParent = null;
        if (radar && radar.parentElement) {
          radarParent = {
            tag: radar.parentElement.tagName,
            cls: radar.parentElement.className,
            styles: getStyles(radar.parentElement)
          };
        }

        return {
          radarRect: rRect,
          restoRect: reRect,
          gap: reRect && rRect ? (reRect.top - rRect.bottom) : null,
          radarParent,
          radarShadow,
          restoShadow
        };
      })()`,
    });

    const diagData = evalRes.result ? evalRes.result.value : evalRes.value;
    fs.writeFileSync("scripts/seam-diag.json", JSON.stringify(diagData, null, 2));
    console.log("Saved seam-diag.json");

    // Scroll to seam
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const radar = document.querySelector('platform-radar');
        if (radar) {
          const r = radar.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + r.bottom - 450);
        }
      })()`,
    });
    await sleep(600);

    const shot = await sendSession("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync("public/seam-area-dark.png", Buffer.from(shot.data, "base64"));
    console.log("Screenshot saved to public/seam-area-dark.png");

  } catch (err) {
    console.error("Diagnostic error:", err);
  } finally {
    chromeProc.kill();
    process.exit(0);
  }
}

main();
