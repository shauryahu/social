import { spawn } from "node:child_process";

const chromeProc = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new",
  "--remote-debugging-port=9262",
  "--window-size=1440,1200",
  "about:blank",
]);

setTimeout(async () => {
  try {
    const v = await fetch("http://127.0.0.1:9262/json/version").then((r) => r.json());
    const ws = new WebSocket(v.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));
    let id = 1;
    const send = (m, p = {}) =>
      new Promise((res) => {
        const cur = id++;
        const h = (e) => {
          const d = JSON.parse(e.data);
          if (d.id === cur) {
            ws.removeEventListener("message", h);
            res(d.result);
          }
        };
        ws.addEventListener("message", h);
        ws.send(JSON.stringify({ id: cur, method: m, params: p }));
      });
    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
    const sendS = (m, p = {}) =>
      new Promise((res) => {
        const cur = id++;
        const h = (e) => {
          const d = JSON.parse(e.data);
          if (d.id === cur) {
            ws.removeEventListener("message", h);
            res(d.result);
          }
        };
        ws.addEventListener("message", h);
        ws.send(JSON.stringify({ id: cur, sessionId, method: m, params: p }));
      });

    await sendS("Page.enable");
    await sendS("Page.navigate", { url: "http://localhost:3000" });
    await new Promise((r) => setTimeout(r, 4000));

    // Scroll into view
    await sendS("Runtime.evaluate", {
      expression: 'document.querySelector("platform-radar")?.scrollIntoView({ behavior: "instant", block: "center" })',
    });
    await new Promise((r) => setTimeout(r, 1500));

    const res = await sendS("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const radar = document.querySelector("platform-radar");
        if (!radar || !radar.shadowRoot) return "no radar";
        const sr = radar.shadowRoot;
        const tiles = Array.from(sr.querySelectorAll(".tile"));
        return tiles.map(t => {
          const r = t.getBoundingClientRect();
          const s = window.getComputedStyle(t);
          const p = t.parentElement;
          const ps = p ? window.getComputedStyle(p) : null;
          const cnt = t.closest(".cnt");
          const cntS = cnt ? window.getComputedStyle(cnt) : null;
          const pos = t.closest(".pos");
          const posS = pos ? window.getComputedStyle(pos) : null;
          const orbit = t.closest(".orbit");
          const orbitS = orbit ? window.getComputedStyle(orbit) : null;
          const img = t.querySelector("img, svg");
          return {
            label: t.getAttribute("aria-label"),
            tileW: r.width,
            tileH: r.height,
            tileDisplay: s.display,
            tileVisibility: s.visibility,
            tileOpacity: s.opacity,
            cntOpacity: cntS ? cntS.opacity : null,
            cntTransform: cntS ? cntS.transform : null,
            posTransform: posS ? posS.transform : null,
            orbitAnimation: orbitS ? orbitS.animation : null,
            imgTag: img ? img.tagName : null,
            imgW: img ? img.getBoundingClientRect().width : null,
            imgH: img ? img.getBoundingClientRect().height : null
          };
        });
      })()`,
    });

    console.log("TILES AUDIT:", JSON.stringify(res.result.value, null, 2));

  } catch (e) {
    console.error(e);
  } finally {
    chromeProc.kill();
    process.exit(0);
  }
}, 1000);
