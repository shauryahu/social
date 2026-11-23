import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";

const chromeProc = spawn(
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  [
    "--headless=new",
    "--remote-debugging-port=9294",
    "--user-data-dir=" + path.join(os.tmpdir(), "chrome-radar-diag-" + Date.now()),
    "--window-size=1440,900",
    "about:blank",
  ],
  { stdio: "ignore" }
);

async function run() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9294/json/version");
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

        // Scroll to platform radar section
        await sendS("Runtime.evaluate", {
          expression: 'document.getElementById("platforms")?.scrollIntoView()',
        });
        await new Promise((r) => setTimeout(r, 1200));

        const radarData = await sendS("Runtime.evaluate", {
          returnByValue: true,
          expression: `(() => {
            const radar = document.querySelector("platform-radar");
            if (!radar) return { error: "no platform-radar" };
            const sr = radar.shadowRoot;
            if (!sr) return { error: "no shadowRoot" };
            const stage = sr.querySelector(".stage");
            const orbit = sr.querySelector(".orbit");
            const apps = Array.from(sr.querySelectorAll(".app"));
            const imgs = Array.from(sr.querySelectorAll(".app img"));
            const appInfo = apps.map((a, idx) => {
              const img = a.querySelector("img");
              const r = a.getBoundingClientRect();
              const s = window.getComputedStyle(a);
              const imgS = img ? window.getComputedStyle(img) : null;
              return {
                idx,
                tag: a.tagName,
                cls: a.className,
                rect: { w: r.width, h: r.height, top: r.top, left: r.left },
                display: s.display,
                visibility: s.visibility,
                opacity: s.opacity,
                transform: s.transform,
                imgSrc: img ? (img.src ? img.src.slice(0, 50) + "..." : "NO_SRC") : "NO_IMG",
                imgDisplay: imgS ? imgS.display : null,
                imgVisibility: imgS ? imgS.visibility : null,
                imgOpacity: imgS ? imgS.opacity : null,
                imgNaturalWidth: img ? img.naturalWidth : null,
                imgComplete: img ? img.complete : null
              };
            });
            return {
              radarHostStyles: {
                display: window.getComputedStyle(radar).display,
                height: window.getComputedStyle(radar).height,
              },
              stageStyles: stage ? {
                display: window.getComputedStyle(stage).display,
                transform: window.getComputedStyle(stage).transform,
              } : null,
              orbitStyles: orbit ? {
                display: window.getComputedStyle(orbit).display,
                opacity: window.getComputedStyle(orbit).opacity,
                visibility: window.getComputedStyle(orbit).visibility,
              } : null,
              appsCount: apps.length,
              imgsCount: imgs.length,
              sample: appInfo
            };
          })()`,
        });
        console.log("RADAR AUDIT RESULT:", JSON.stringify(radarData.result ? radarData.result.value : radarData.value, null, 2));

        // Take a screenshot of the radar section
        const clip = await sendS("Runtime.evaluate", {
          returnByValue: true,
          expression: `(() => {
            const el = document.getElementById("platforms");
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { x: 0, y: r.top + window.scrollY, width: window.innerWidth, height: r.height };
          })()`,
        });
        const clipData = clip.result ? clip.result.value : clip.value;
        if (clipData) {
          const ss = await sendS("Page.captureScreenshot", {
            format: "png",
            clip: { ...clipData, scale: 1 },
          });
          const fs = await import("node:fs");
          fs.writeFileSync("scripts/radar-current.png", Buffer.from(ss.data, "base64"));
          console.log("Saved scripts/radar-current.png");
        }

        chromeProc.kill();
        process.exit(0);
      }
    } catch (err) {}
    await new Promise((r) => setTimeout(r, 200));
  }
}
run();
