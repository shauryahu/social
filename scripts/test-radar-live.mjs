import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";

const chromeProc = spawn(
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  [
    "--headless=new",
    "--remote-debugging-port=9280",
    "--user-data-dir=" + path.join(os.tmpdir(), "chrome-live-radar-" + Date.now()),
    "--window-size=1440,900",
    "about:blank",
  ],
  { stdio: "ignore" }
);

async function run() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9280/json/version");
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

        // Scroll to platforms
        await sendS("Runtime.evaluate", {
          expression: `(() => {
            const el = document.getElementById("platforms");
            if (el) el.scrollIntoView();
          })()`,
        });
        await new Promise((r) => setTimeout(r, 2000));

        const inspection = await sendS("Runtime.evaluate", {
          returnByValue: true,
          expression: `(() => {
            const radar = document.querySelector("platform-radar");
            if (!radar) return { err: "no platform-radar element found" };
            const root = radar.shadowRoot;
            if (!root) return { err: "no shadowRoot on platform-radar" };
            const wrap = root.querySelector(".wrap");
            const stage = root.querySelector(".stage");
            const apps = Array.from(root.querySelectorAll(".app"));
            const tiles = Array.from(root.querySelectorAll(".tile"));
            const core = root.querySelector(".core");
            const orbits = Array.from(root.querySelectorAll(".orbit"));

            return {
              hostClasses: radar.className,
              wrapClasses: wrap ? wrap.className : null,
              stageHtmlLength: stage ? stage.innerHTML.length : 0,
              orbitsCount: orbits.length,
              appsCount: apps.length,
              tilesCount: tiles.length,
              coreHtml: core ? core.outerHTML.slice(0, 200) : null,
              firstApp: apps[0] ? {
                classes: apps[0].className,
                rect: apps[0].getBoundingClientRect(),
                style: {
                  opacity: window.getComputedStyle(apps[0]).opacity,
                  transform: window.getComputedStyle(apps[0]).transform,
                  display: window.getComputedStyle(apps[0]).display,
                  visibility: window.getComputedStyle(apps[0]).visibility,
                  width: window.getComputedStyle(apps[0]).width,
                  height: window.getComputedStyle(apps[0]).height
                },
                cntParent: apps[0].parentElement ? {
                  classes: apps[0].parentElement.className,
                  opacity: window.getComputedStyle(apps[0].parentElement).opacity,
                  transform: window.getComputedStyle(apps[0].parentElement).transform,
                } : null,
                innerTile: apps[0].querySelector(".tile") ? {
                  html: apps[0].querySelector(".tile").innerHTML.slice(0, 150),
                  rect: apps[0].querySelector(".tile").getBoundingClientRect()
                } : null
              } : null,
              tileImages: Array.from(root.querySelectorAll(".tile img, .tile svg")).map(im => ({
                tag: im.tagName,
                srcPreview: im.src ? im.src.slice(0, 40) + "..." : "SVG",
                width: im.getBoundingClientRect().width,
                height: im.getBoundingClientRect().height,
                display: window.getComputedStyle(im).display
              }))
            };
          })()`,
        });

        console.log("LIVE RADAR INSPECTION:", JSON.stringify(inspection.result ? inspection.result.value : inspection.value, null, 2));

        chromeProc.kill();
        process.exit(0);
      }
    } catch (err) {}
    await new Promise((r) => setTimeout(r, 200));
  }
}
run();
