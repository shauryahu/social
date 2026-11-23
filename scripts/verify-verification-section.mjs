import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(process.cwd(), ".chrome-profile-verify-vs");
const ARTIFACT_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9298",
    `--user-data-dir=${USER_DATA}`,
    "--window-size=1280,900",
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
        const res = await fetch("http://127.0.0.1:9298/json/version");
        if (res.ok) {
          const data = await res.json();
          wsUrl = data.webSocketDebuggerUrl;
          break;
        }
      } catch {}
      await sleep(400);
    }
    if (!wsUrl) throw new Error("Could not connect to Chrome debugging port");

    const ws = new WebSocket(wsUrl);
    let id = 1;
    const callbacks = new Map();
    const consoleLogs = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === "Runtime.consoleAPICalled") {
        consoleLogs.push({
          type: msg.params.type,
          args: msg.params.args.map((a) => a.value),
        });
      }
      if (msg.method === "Runtime.exceptionThrown") {
        consoleLogs.push({
          type: "exception",
          error: msg.params.exceptionDetails.text,
        });
      }
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
      { name: "390", width: 390, height: 844, mobile: true },
      { name: "820", width: 820, height: 1180, mobile: true },
      { name: "1280", width: 1280, height: 900, mobile: false },
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
      await sleep(3500);

      // Scroll verification-section into view
      await sendSession("Runtime.evaluate", {
        expression: `document.querySelector("verification-section")?.scrollIntoView({ behavior: "instant", block: "center" })`,
      });
      await sleep(1000);

      const metrics = await sendSession("Runtime.evaluate", {
        expression: `(() => {
          const W = window.innerWidth;
          const vs = document.querySelector("verification-section");
          if (!vs) return { error: "verification-section element not found in DOM" };

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
          const card = sr.querySelector(".card");
          const tabs = Array.from(sr.querySelectorAll(".tab")).map(t => ({
            text: t.textContent,
            selected: t.getAttribute("aria-selected")
          }));
          const dds = Array.from(sr.querySelectorAll(".info dd")).map(d => d.textContent);
          const cta = sr.querySelector(".cta");

          // Check previous and next sections
          const prevEl = vs.previousElementSibling;
          const nextEl = vs.nextElementSibling;

          return {
            viewportWidth: W,
            hasShadowRoot: !!sr,
            isInViewAnimated: wrap ? wrap.classList.contains("in") : false,
            vsRect: b(vs),
            wrapRect: b(wrap),
            h1Rect: b(h1),
            cardRect: b(card),
            ctaRect: b(cta),
            tabs,
            dds,
            hasHorizontalScroll: document.documentElement.scrollWidth > W,
            prevElement: prevEl ? prevEl.tagName : null,
            nextElement: nextEl ? nextEl.tagName : null,
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
        path.join(ARTIFACT_DIR, `verified_verification_${vp.name}.png`),
        Buffer.from(shot.data, "base64")
      );
    }

    // Now test Tab switching on 1280px
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 1280,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false,
    });
    await sleep(500);

    const tabTest = await sendSession("Runtime.evaluate", {
      expression: `(async () => {
        const vs = document.querySelector("verification-section");
        const sr = vs.shadowRoot;
        const tabs = sr.querySelectorAll(".tab");

        // Click Creator (index 1)
        tabs[1].click();
        await new Promise(r => setTimeout(r, 600));
        const creatorVals = Array.from(sr.querySelectorAll(".info dd")).map(d => d.textContent);

        // Click Executive (index 2)
        tabs[2].click();
        await new Promise(r => setTimeout(r, 600));
        const execVals = Array.from(sr.querySelectorAll(".info dd")).map(d => d.textContent);

        // Click Brand (index 0)
        tabs[0].click();
        await new Promise(r => setTimeout(r, 600));
        const brandVals = Array.from(sr.querySelectorAll(".info dd")).map(d => d.textContent);

        return { creatorVals, execVals, brandVals };
      })()`,
      awaitPromise: true,
      returnByValue: true,
    });

    results.tabSwitching = tabTest.result.value;

    // Check how many times the script appears in HTML
    const scriptCheck = await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const scripts = Array.from(document.querySelectorAll("script")).filter(s => s.textContent.includes("VerificationSection"));
        return {
          count: scripts.length,
          locatedBeforeBodyEnd: scripts.length === 1 && scripts[0].parentElement === document.body
        };
      })()`,
      returnByValue: true,
    });
    results.scriptCheck = scriptCheck.result.value;
    results.consoleLogs = consoleLogs;

    console.log("TEST_RESULTS:" + JSON.stringify(results, null, 2));

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
