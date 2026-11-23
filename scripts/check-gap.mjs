import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";

const chromeProc = spawn(
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  [
    "--headless=new",
    "--remote-debugging-port=9291",
    "--user-data-dir=" + path.join(os.tmpdir(), "chrome-gap-" + Date.now()),
    "--window-size=390,900",
    "about:blank",
  ],
  { stdio: "ignore" }
);

async function run() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9291/json/version");
      if (res.ok) {
        const { webSocketDebuggerUrl } = await res.json();
        const ws = new WebSocket(webSocketDebuggerUrl);
        await new Promise((r) => (ws.onopen = r));
        let id = 1;
        const send = (m, p = {}) =>
          new Promise((r) => {
            const mid = id++;
            const handler = (e) => {
              const d = JSON.parse(e.data);
              if (d.id === mid) {
                ws.removeEventListener("message", handler);
                r(d.result);
              }
            };
            ws.addEventListener("message", handler);
            ws.send(JSON.stringify({ id: mid, method: m, params: p }));
          });
        const { targetId } = await send("Target.createTarget", { url: "about:blank" });
        const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
        const sendS = (m, p = {}) => send(m, { ...p, sessionId });
        await sendS("Page.enable");
        await sendS("Page.navigate", { url: "http://localhost:3000" });
        await new Promise((r) => setTimeout(r, 4500));
        await sendS("Emulation.setDeviceMetricsOverride", {
          width: 390,
          height: 900,
          deviceScaleFactor: 2,
          mobile: true,
        });
        const gap = await sendS("Runtime.evaluate", {
          returnByValue: true,
          awaitPromise: true,
          expression: `(async () => {
            const btn = document.querySelector(".sa-nav .mob .btn-toggle");
            btn.click();
            await new Promise(r => setTimeout(r, 400));
            const bar = document.querySelector(".sa-nav .bar").getBoundingClientRect();
            const panel = document.querySelector(".sa-nav .panel").getBoundingClientRect();
            return {
              barTop: Math.round(bar.top),
              barBottom: Math.round(bar.bottom),
              panelTop: Math.round(panel.top),
              gap: Math.round(panel.top - bar.bottom),
              panelHeight: Math.round(panel.height)
            };
          })()`,
        });
        console.log("MEASURED OPEN GAP:", gap.result ? gap.result.value : gap.value);
        chromeProc.kill();
        process.exit(0);
      }
    } catch (err) {}
    await new Promise((r) => setTimeout(r, 200));
  }
}
run();
