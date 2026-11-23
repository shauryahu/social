import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PORT = 9299;
const tmpDir = path.join(os.tmpdir(), "chrome-bar-" + Date.now());

const chromeProc = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${tmpDir}`,
  "--disable-extensions",
  "--disable-default-apps",
  "--no-first-run",
  "--hide-scrollbars",
  "about:blank",
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  try {
    let version = null;
    for (let i = 0; i < 20; i++) {
      await sleep(300);
      try {
        const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
        version = await r.json();
        if (version && version.webSocketDebuggerUrl) break;
      } catch {}
    }
    const ws = new WebSocket(version.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));

    let msgId = 1;
    const callbacks = new Map();
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };

    const send = (m, p = {}) =>
      new Promise((resolve, reject) => {
        const id = msgId++;
        callbacks.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method: m, params: p }));
      });

    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });

    const sendS = (m, p = {}) =>
      new Promise((resolve, reject) => {
        const id = msgId++;
        callbacks.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, sessionId, method: m, params: p }));
      });

    await sendS("Page.enable");
    await sendS("Runtime.enable");

    await sendS("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false,
    });

    await sendS("Page.navigate", { url: "http://localhost:3000" });
    await sleep(6500);

    const res = await sendS("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const bar = document.querySelector(".sa-nav .bar");
        const pill = document.querySelector(".sa-nav .pill");
        const bs = window.getComputedStyle(bar);
        const ps = window.getComputedStyle(pill);
        const br = bar.getBoundingClientRect();
        const topEl = document.elementFromPoint(br.left + br.width / 2, br.top + br.height / 2);
        return {
          barBg: bs.backgroundColor,
          barBgi: bs.backgroundImage,
          barFilter: bs.backdropFilter,
          barZIndex: bs.zIndex,
          barBorderRadius: bs.borderRadius,
          pillBg: ps.backgroundColor,
          pillBgi: ps.backgroundImage,
          pillFilter: ps.backdropFilter,
          topElement: topEl ? (topEl.tagName + "." + topEl.className) : null,
          preDisplay: document.getElementById("pre") ? window.getComputedStyle(document.getElementById("pre")).display : null,
          preZIndex: document.getElementById("pre") ? window.getComputedStyle(document.getElementById("pre")).zIndex : null,
          preClasses: document.getElementById("pre") ? document.getElementById("pre").className : null
        };
      })()`
    });

    console.log("RESULT LIGHT:", JSON.stringify(res.result.value, null, 2));

    await sendS("Runtime.evaluate", {
      expression: `document.documentElement.setAttribute("data-theme", "dark"); document.documentElement.classList.add("dark");`
    });
    await sleep(500);

    const resDark = await sendS("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const bar = document.querySelector(".sa-nav .bar");
        const pill = document.querySelector(".sa-nav .pill");
        const bs = window.getComputedStyle(bar);
        const ps = window.getComputedStyle(pill);
        return {
          barBg: bs.backgroundColor,
          barBgi: bs.backgroundImage,
          barFilter: bs.backdropFilter,
          barZIndex: bs.zIndex,
          pillBg: ps.backgroundColor,
          pillBgi: ps.backgroundImage,
          pillFilter: ps.backdropFilter,
        };
      })()`
    });

    console.log("RESULT DARK:", JSON.stringify(resDark.result.value, null, 2));

  } catch (err) {
    console.error("Error:", err);
  } finally {
    chromeProc.kill();
    process.exit(0);
  }
}

run();
