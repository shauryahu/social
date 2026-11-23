import { spawn } from "node:child_process";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-console-" + Date.now());

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getDebuggerUrl(port) {
  for (let i = 0; i < 25; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {
      await sleep(300);
    }
  }
  throw new Error("Could not connect to Chrome port " + port);
}

async function main() {
  const port = 9280;
  const chromeProc = spawn(
    CHROME_PATH,
    [
      "--headless=new",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${USER_DATA}`,
      "--window-size=1440,900",
      "--hide-scrollbars",
      "--disable-gpu-sandbox",
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  try {
    const wsUrl = await getDebuggerUrl(port);
    const ws = new WebSocket(wsUrl);

    let id = 1;
    const callbacks = new Map();
    const consoleLogs = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === "Runtime.consoleAPICalled") {
        consoleLogs.push({
          type: msg.params.type,
          args: msg.params.args?.map((a) => a.value || a.description || ""),
        });
      } else if (msg.method === "Log.entryAdded") {
        consoleLogs.push({
          type: msg.params.entry.level,
          text: msg.params.entry.text,
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
    await sendSession("Log.enable");
    await sendSession("Runtime.enable");

    await sendSession("Page.navigate", { url: "http://localhost:3000" });
    await sleep(2500);

    const widths = [1440, 1024, 820, 768, 390];
    const results = {};

    for (const w of widths) {
      await sendSession("Emulation.setDeviceMetricsOverride", {
        width: w,
        height: 800,
        deviceScaleFactor: 2,
        mobile: w < 768,
      });

      for (const theme of ["light", "dark"]) {
        await sendSession("Runtime.evaluate", {
          expression: `(() => {
            document.documentElement.setAttribute("data-theme", "${theme}");
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add("${theme}");
            window.dispatchEvent(new Event("resize"));
          })()`,
        });
        await sleep(300);

        // Check horizontal overflow
        const overflow = await sendSession("Runtime.evaluate", {
          expression: `(() => {
            const docW = document.documentElement.clientWidth;
            const scrollW = document.documentElement.scrollWidth;
            return { docW, scrollW, hasOverflow: scrollW > docW };
          })()`,
          returnByValue: true,
        });

        results[`${w}_${theme}`] = {
          overflow: overflow.result?.value,
          logs: [...consoleLogs],
        };
      }
    }

    console.log("Console Audit Results:", JSON.stringify(results, null, 2));

    ws.close();
    chromeProc.kill();
  } catch (err) {
    chromeProc.kill();
    console.error(err);
  }
}

main();
