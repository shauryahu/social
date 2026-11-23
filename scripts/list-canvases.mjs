import { spawn } from "node:child_process";

const chromeProc = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new",
  "--remote-debugging-port=9231",
  "about:blank",
]);

setTimeout(async () => {
  try {
    const v = await fetch("http://127.0.0.1:9231/json/version").then((r) => r.json());
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
    await new Promise((r) => setTimeout(r, 4500));
    const res = await sendS("Runtime.evaluate", {
      expression: `Array.from(document.querySelectorAll("canvas")).map((c, i) => ({
        i,
        className: c.className,
        parent: c.parentElement?.className,
        width: c.width,
        height: c.height,
        offsetTop: c.offsetTop,
        rect: { top: c.getBoundingClientRect().top, height: c.getBoundingClientRect().height }
      }))`,
      returnByValue: true,
    });
    console.log("Canvases on page:", JSON.stringify(res.result.value, null, 2));
    ws.close();
    chromeProc.kill();
    process.exit(0);
  } catch (err) {
    console.error(err);
    chromeProc.kill();
    process.exit(1);
  }
}, 1000);
