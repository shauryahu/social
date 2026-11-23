import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-chrome-navperf-" + Date.now());

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9295",
    `--user-data-dir=${USER_DATA}`,
    "--window-size=1440,900",
    "--hide-scrollbars",
    "--disable-gpu-sandbox",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ],
  { stdio: "ignore" }
);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getDebuggerUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9295/json/version");
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {}
    await sleep(250);
  }
  throw new Error("Could not connect to Chrome debugging port");
}

async function main() {
  try {
    const wsUrl = await getDebuggerUrl();
    const ws = new WebSocket(wsUrl);

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
    await sendSession("DOM.enable");
    await sendSession("Page.navigate", { url: "http://localhost:3000" });
    await sleep(4500);

    // Switch to dark theme
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        localStorage.setItem('socialassist-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (typeof window.syncShadowRoots === 'function') window.syncShadowRoots('dark');
        window.dispatchEvent(new Event('socialassist-theme-change'));
      })()`,
    });
    await sleep(1000);

    // Set 4x CPU slowdown
    console.log("Setting 4x CPU slowdown...");
    await sendSession("Emulation.setCPUThrottlingRate", { rate: 4 });

    // Measure frame durations while clicking nav items
    const perfData = await sendSession("Runtime.evaluate", {
      returnByValue: true,
      awaitPromise: true,
      expression: `(async () => {
        const frameTimes = [];
        let lastTime = performance.now();
        let recording = true;

        function recordFrame() {
          if (!recording) return;
          const now = performance.now();
          frameTimes.push(now - lastTime);
          lastTime = now;
          requestAnimationFrame(recordFrame);
        }
        requestAnimationFrame(recordFrame);

        // Click 4 items in sequence
        const links = Array.from(document.querySelectorAll('.sa-nav .desk .it'));
        for (let idx of [1, 2, 3, 4, 1]) {
          if (links[idx]) {
            links[idx].click();
            await new Promise(r => setTimeout(r, 400));
          }
        }

        await new Promise(r => setTimeout(r, 200));
        recording = false;

        const longFrames = frameTimes.filter(t => t > 16.6);
        const maxFrame = Math.max(...frameTimes);
        const avgFrame = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;

        return {
          totalFrames: frameTimes.length,
          longFramesCount: longFrames.length,
          longFramesPct: ((longFrames.length / frameTimes.length) * 100).toFixed(1) + '%',
          maxFrameMs: maxFrame.toFixed(2),
          avgFrameMs: avgFrame.toFixed(2),
          sampleLongFrames: longFrames.slice(0, 10).map(t => t.toFixed(2))
        };
      })()`,
    });

    console.log("Nav Performance Baseline (CPU 4x):", perfData.result ? perfData.result.value : perfData.value);
    fs.writeFileSync("scripts/nav-perf-baseline.json", JSON.stringify(perfData.result ? perfData.result.value : perfData.value, null, 2));

  } catch (err) {
    console.error("Perf diagnosis error:", err);
  } finally {
    chromeProc.kill();
    process.exit(0);
  }
}

main();
