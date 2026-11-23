import { spawn } from "node:child_process";
import fs from "node:fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chromeProc = spawn(CHROME_PATH, [
  "--headless=new",
  "--remote-debugging-port=9229",
  "--window-size=1440,900",
  "about:blank",
]);

setTimeout(async () => {
  try {
    const v = await fetch("http://127.0.0.1:9229/json/version").then((r) => r.json());
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

    // Scroll so the 3D laptop canvas (index 2) is centered
    await sendS("Runtime.evaluate", {
      expression: 'document.querySelectorAll("canvas")[2].scrollIntoView({ block: "center" })',
    });
    await new Promise((r) => setTimeout(r, 2500));

    const shot1 = await sendS("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(
      "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91\\laptop_canvas_centered_light.png",
      Buffer.from(shot1.data, "base64")
    );

    // Toggle theme to dark mode
    await sendS("Runtime.evaluate", {
      expression: 'document.querySelector(\'button[data-slot="theme-toggle"]\').click()',
    });
    await new Promise((r) => setTimeout(r, 2000));

    const shot2 = await sendS("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(
      "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91\\laptop_canvas_centered_dark.png",
      Buffer.from(shot2.data, "base64")
    );

    console.log("Saved laptop centered shots!");
    ws.close();
    chromeProc.kill();
    process.exit(0);
  } catch (e) {
    console.error(e);
    chromeProc.kill();
    process.exit(1);
  }
}, 1000);
