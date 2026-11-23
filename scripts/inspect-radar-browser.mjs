import { spawn } from "node:child_process";

const chromeProc = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new",
  "--remote-debugging-port=9285",
  "--disable-extensions",
  "--disable-default-apps",
  "--disable-sync",
  "--disable-background-networking",
  "about:blank",
], { stdio: "ignore" });

async function run() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9285/json/version");
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

        // Scroll into view
        await sendS("Runtime.evaluate", {
          expression: 'document.getElementById("platforms")?.scrollIntoView()',
        });
        await new Promise((r) => setTimeout(r, 1500));

        const result = await sendS("Runtime.evaluate", {
          returnByValue: true,
          expression: `(() => {
            const radar = document.querySelector("platform-radar");
            if (!radar) return "no radar";
            const sr = radar.shadowRoot;
            if (!sr) return "no shadowRoot";
            const wrap = sr.querySelector(".wrap");
            const apps = Array.from(sr.querySelectorAll(".app"));
            const tiles = Array.from(sr.querySelectorAll(".tile"));
            const imgs = Array.from(sr.querySelectorAll(".tile img"));
            const svgs = Array.from(sr.querySelectorAll(".tile svg"));

            return {
              radarRect: radar.getBoundingClientRect(),
              wrapClass: wrap ? wrap.className : "no wrap",
              appsLen: apps.length,
              tilesLen: tiles.length,
              imgsLen: imgs.length,
              svgsLen: svgs.length,
              firstAppOpacity: apps[0] ? window.getComputedStyle(apps[0]).opacity : null,
              firstAppVisibility: apps[0] ? window.getComputedStyle(apps[0]).visibility : null,
              firstCntOpacity: apps[0] && apps[0].parentElement ? window.getComputedStyle(apps[0].parentElement).opacity : null,
              firstCntTransform: apps[0] && apps[0].parentElement ? window.getComputedStyle(apps[0].parentElement).transform : null,
              firstAppRect: apps[0] ? apps[0].getBoundingClientRect() : null,
              firstImgRect: imgs[0] ? imgs[0].getBoundingClientRect() : null,
              firstImgNaturalWidth: imgs[0] ? imgs[0].naturalWidth : null,
              firstImgSrc: imgs[0] ? imgs[0].src.slice(0, 60) : null
            };
          })()`,
        });

        console.log("LIVE RADAR STATUS:", JSON.stringify(result.result ? result.result.value : result.value, null, 2));
        chromeProc.kill();
        process.exit(0);
      }
    } catch (err) {}
    await new Promise((r) => setTimeout(r, 200));
  }
}
run();
