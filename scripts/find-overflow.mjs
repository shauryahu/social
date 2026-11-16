import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = os.tmpdir() + "/chrome-overflow-" + Date.now();

const p = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9222",
    "--user-data-dir=" + USER_DATA,
    "--window-size=1440,900",
    "about:blank",
  ],
  { stdio: "ignore" }
);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  await sleep(1000);
  const v = await (await fetch("http://127.0.0.1:9222/json/version")).json();
  const ws = new WebSocket(v.webSocketDebuggerUrl);

  let id = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const cb = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) cb.reject(new Error(msg.error.message));
      else cb.resolve(msg.result);
    }
  };

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
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
  await sendSession("Runtime.enable");
  await sendSession("Page.navigate", { url: "http://localhost:3000" });
  await sleep(4000);

  const res = await sendSession("Runtime.evaluate", {
    expression: `(() => {
      const docWidth = document.documentElement.clientWidth;
      const overflows = [];
      for (const el of document.querySelectorAll('*')) {
        const r = el.getBoundingClientRect();
        if (r.right > docWidth + 2) {
          overflows.push({
            tag: el.tagName,
            id: el.id,
            className: typeof el.className === 'string' ? el.className.slice(0, 80) : '',
            right: Math.round(r.right),
            width: Math.round(r.width),
            parent: el.parentElement ? el.parentElement.tagName + (el.parentElement.id ? '#' + el.parentElement.id : '') : ''
          });
        }
      }
      return { docWidth, scrollWidth: document.documentElement.scrollWidth, overflows: overflows.slice(0, 15) };
    })()`,
    returnByValue: true,
  });

  console.log("Overflow Report:", JSON.stringify(res.result ? res.result.value : res, null, 2));

  p.kill();
  try {
    fs.rmSync(USER_DATA, { recursive: true, force: true });
  } catch {}
}

main().catch((err) => {
  console.error(err);
  p.kill();
});
