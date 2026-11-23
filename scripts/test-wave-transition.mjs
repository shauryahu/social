import { spawn } from "node:child_process";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chromeProc = spawn(CHROME_PATH, [
  "--headless=new",
  "--remote-debugging-port=9263",
  "--window-size=1440,900",
  "about:blank",
]);

setTimeout(async () => {
  try {
    const v = await fetch("http://127.0.0.1:9263/json/version").then((r) => r.json());
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

    // Test startViewTransition with @property mask
    const result = await sendS("Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression: `
        new Promise((resolve) => {
          try {
            // Register @property if not registered
            try {
              CSS.registerProperty({
                name: '--r',
                syntax: '<length>',
                inherits: false,
                initialValue: '0px'
              });
            } catch(e) {}

            const x = 1400;
            const y = 850;
            const endRadius = Math.hypot(x, y);

            const t = document.startViewTransition(() => {
              document.documentElement.setAttribute('data-theme', 'dark');
            });

            t.ready.then(() => {
              try {
                // Try mask animation
                const anim = document.documentElement.animate(
                  {
                    '--r': ['0px', (endRadius + 80) + 'px']
                  },
                  {
                    duration: 700,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    fill: 'forwards',
                    pseudoElement: '::view-transition-new(root)'
                  }
                );
                anim.finished.then(() => {
                  resolve({ success: true, mode: 'mask' });
                }).catch(err => {
                  resolve({ success: false, error: err.message });
                });
              } catch(err) {
                resolve({ success: false, error: err.message });
              }
            });
          } catch(err) {
            resolve({ success: false, error: err.message });
          }
        })
      `,
    });

    console.log("Wave transition test result:", result.result ? result.result.value : result);

  } catch (e) {
    console.error(e);
  } finally {
    chromeProc.kill();
    process.exit(0);
  }
}, 1000);
