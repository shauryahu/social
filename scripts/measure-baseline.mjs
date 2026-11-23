import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-profile-" + Date.now());
const REPORT_PATH = "scripts/baseline-report.json";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getDebuggerUrl(port) {
  for (let i = 0; i < 30; i++) {
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
  throw new Error("Could not connect to Chrome debugging port " + port);
}

async function runTraceProfile() {
  const port = 9270;
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

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
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
    await sendSession("DOM.enable");
    await sendSession("Performance.enable");

    // Navigate to local site
    await sendSession("Page.navigate", { url: "http://localhost:3000" });
    await sleep(3000);

    // Dismiss intro loader
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const pre = document.getElementById("pre");
        if (pre) { pre.style.display = "none"; pre.classList.add("gone"); }
        document.body.classList.remove("lock");
        document.body.classList.add("ready");
      })()`,
    });
    await sleep(1000);

    // Profile interaction: Scroll down the page, switch theme, open/close mobile menu
    const interactionStats = await sendSession("Runtime.evaluate", {
      expression: `(async () => {
        const longTasks = [];
        const po = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            longTasks.push({
              name: entry.name,
              duration: Math.round(entry.duration),
              startTime: Math.round(entry.startTime)
            });
          }
        });
        try { po.observe({ entryTypes: ['longtask'] }); } catch {}

        const layoutShifts = [];
        const poLs = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              layoutShifts.push(entry.value);
            }
          }
        });
        try { poLs.observe({ entryTypes: ['layout-shift'] }); } catch {}

        // Scroll down in increments
        const totalHeight = document.documentElement.scrollHeight;
        const step = 300;
        const scrollStart = performance.now();
        for (let y = 0; y < totalHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 40));
        }
        // Scroll back to top
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 200));
        const scrollEnd = performance.now();

        // Theme switch test
        const themeBtn = document.querySelector('button[data-slot="theme-toggle"]') || document.querySelector('.fixed button');
        const themeStart = performance.now();
        if (themeBtn) {
          themeBtn.click();
          await new Promise(r => setTimeout(r, 400));
          themeBtn.click();
          await new Promise(r => setTimeout(r, 400));
        }
        const themeEnd = performance.now();

        // Mobile menu test
        const burger = document.getElementById('bg');
        const menuStart = performance.now();
        if (burger) {
          burger.click();
          await new Promise(r => setTimeout(r, 300));
          burger.click();
          await new Promise(r => setTimeout(r, 300));
        }
        const menuEnd = performance.now();

        // Resource weights
        const resources = performance.getEntriesByType('resource');
        const byType = { js: { size: 0, count: 0 }, css: { size: 0, count: 0 }, img: { size: 0, count: 0 }, media: { size: 0, count: 0 }, other: { size: 0, count: 0 } };
        const slowestResources = [];

        for (const r of resources) {
          const sz = r.transferSize || r.decodedBodySize || 0;
          const dur = Math.round(r.duration);
          let type = 'other';
          if (r.initiatorType === 'script' || r.name.endsWith('.js')) type = 'js';
          else if (r.initiatorType === 'link' || r.initiatorType === 'css' || r.name.endsWith('.css')) type = 'css';
          else if (r.initiatorType === 'img' || /\\.(png|jpg|jpeg|webp|svg|gif|avif)/i.test(r.name)) type = 'img';
          else if (r.initiatorType === 'video' || /\\.(mp4|webm)/i.test(r.name)) type = 'media';

          byType[type].size += sz;
          byType[type].count += 1;
          slowestResources.push({ name: r.name.split('/').pop().slice(0, 40), type, sizeKB: Math.round(sz / 1024), durationMs: dur });
        }
        slowestResources.sort((a, b) => b.durationMs - a.durationMs);

        // Longest tasks
        longTasks.sort((a, b) => b.duration - a.duration);
        const totalCLS = layoutShifts.reduce((acc, v) => acc + v, 0);

        return {
          longTasksCount: longTasks.length,
          longTasks: longTasks.slice(0, 10),
          totalCLS: Number(totalCLS.toFixed(4)),
          scrollDurationMs: Math.round(scrollEnd - scrollStart),
          themeDurationMs: Math.round(themeEnd - themeStart),
          menuDurationMs: Math.round(menuEnd - menuStart),
          byType,
          slowestResources: slowestResources.slice(0, 10),
        };
      })()`,
      awaitPromise: true,
      returnByValue: true,
    });

    ws.close();
    chromeProc.kill();
    return interactionStats.result?.value;
  } catch (e) {
    chromeProc.kill();
    throw e;
  }
}

async function runLighthouse(preset) {
  const flags = [
    "http://localhost:3000",
    "--output=json",
    "--output-path=stdout",
    "--quiet",
    "--chrome-flags='--headless=new --no-sandbox --disable-gpu-sandbox'",
    preset === "desktop" ? "--preset=desktop" : "--form-factor=mobile --throttling-method=devtools",
  ];

  const cmd = `npx.cmd --yes lighthouse ${flags.join(" ")}`;
  console.log(`Running Lighthouse for ${preset}...`);
  const raw = execSync(cmd, { maxBuffer: 50 * 1024 * 1024, encoding: "utf-8" });
  const data = JSON.parse(raw);

  const audits = data.audits;
  return {
    score: Math.round(data.categories.performance.score * 100),
    fcp: audits["first-contentful-paint"]?.displayValue,
    lcp: audits["largest-contentful-paint"]?.displayValue,
    tbt: audits["total-blocking-time"]?.displayValue,
    cls: audits["cumulative-layout-shift"]?.displayValue,
    si: audits["speed-index"]?.displayValue,
    inp: audits["interaction-to-next-paint"]?.displayValue || "N/A",
  };
}

async function main() {
  console.log("Starting baseline trace profiling...");
  const trace = await runTraceProfile();
  console.log("Trace profile complete:", JSON.stringify(trace, null, 2));

  console.log("Running Desktop Lighthouse...");
  const desktopLH = await runLighthouse("desktop");
  console.log("Desktop LH:", desktopLH);

  console.log("Running Mobile Lighthouse...");
  const mobileLH = await runLighthouse("mobile");
  console.log("Mobile LH:", mobileLH);

  const baseline = {
    timestamp: new Date().toISOString(),
    desktop: desktopLH,
    mobile: mobileLH,
    trace,
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(baseline, null, 2));
  console.log(`Saved baseline report to ${REPORT_PATH}`);
}

main();
