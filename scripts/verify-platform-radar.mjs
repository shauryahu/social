import { spawn } from "child_process";
import http from "http";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";
const PORT = 9265;
const USER_DATA = path.join(process.cwd(), ".chrome-profile-radar");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

async function main() {
  if (fs.existsSync(USER_DATA)) {
    try {
      fs.rmSync(USER_DATA, { recursive: true, force: true });
    } catch {}
  }

  const chromeProc = spawn(
    CHROME_PATH,
    [
      "--headless=new",
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${USER_DATA}`,
      "--window-size=1280,900",
      "--hide-scrollbars",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  try {
    let version = null;
    for (let i = 0; i < 30; i++) {
      await sleep(300);
      try {
        version = await getJson(`http://127.0.0.1:${PORT}/json/version`);
        if (version && version.webSocketDebuggerUrl) break;
      } catch {}
    }

    if (!version || !version.webSocketDebuggerUrl) {
      throw new Error("Failed to connect to Chrome debugging port");
    }

    const ws = new globalThis.WebSocket(version.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let id = 1;
    const callbacks = new Map();
    const consoleLogs = [];

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.id && callbacks.has(msg.id)) {
          const { resolve, reject } = callbacks.get(msg.id);
          callbacks.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
        if (msg.method === "Runtime.consoleAPICalled") {
          consoleLogs.push({
            type: msg.params.type,
            args: msg.params.args.map((a) => a.value || a.description),
          });
        }
      } catch {}
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

    const target = await send("Target.createTarget", { url: "about:blank" });
    const targetId = target.targetId;

    const session = await send("Target.attachToTarget", { targetId, flatten: true });
    const sessionId = session.sessionId;

    function sendSession(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        callbacks.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
      });
    }

    await sendSession("Page.enable");
    await sendSession("DOM.enable");
    await sendSession("Runtime.enable");

    const results = {};
    const viewports = [
      { name: "390", width: 390, height: 844, mobile: true },
      { name: "820", width: 820, height: 1180, mobile: false },
      { name: "1280", width: 1280, height: 900, mobile: false },
    ];

    for (const vp of viewports) {
      await sendSession("Emulation.setDeviceMetricsOverride", {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.mobile,
      });

      await sendSession("Page.navigate", { url: "http://localhost:3000" });
      await sleep(3500);

      // Scroll platform-radar into view
      await sendSession("Runtime.evaluate", {
        expression: `document.querySelector("platform-radar")?.scrollIntoView({ behavior: "instant", block: "center" })`,
      });
      await sleep(2200);

      const metrics = await sendSession("Runtime.evaluate", {
        expression: `(() => {
          const W = window.innerWidth;
          const pr = document.querySelector("platform-radar");
          if (!pr) return { error: "platform-radar not found in DOM" };

          const sr = pr.shadowRoot;
          if (!sr) return { error: "platform-radar shadowRoot not found" };

          function b(el) {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return {
              left: Math.round(r.left),
              right: Math.round(W - r.right),
              width: Math.round(r.width),
              top: Math.round(r.top),
              bottom: Math.round(r.bottom),
              height: Math.round(r.height)
            };
          }

          const wrap = sr.querySelector(".wrap");
          const stage = sr.querySelector(".stage");
          const stagew = sr.querySelector(".stagew");
          const core = sr.querySelector(".core");
          const cap = sr.querySelector(".cap");
          const pill = sr.querySelector(".pill");
          const nm = sr.querySelector("#nm");
          const sb = sr.querySelector("#sb");
          const prStyle = window.getComputedStyle(pr);

          const appElements = Array.from(sr.querySelectorAll(".app"));
          const tileElements = Array.from(sr.querySelectorAll(".tile"));

          return {
            viewportWidth: W,
            hostPadding: {
              top: prStyle.paddingTop,
              left: prStyle.paddingLeft,
              right: prStyle.paddingRight,
              bottom: prStyle.paddingBottom
            },
            elements: {
              pr: b(pr),
              wrap: b(wrap),
              stagew: b(stagew),
              stage: b(stage),
              core: b(core),
              cap: b(cap),
              pill: b(pill)
            },
            appsCount: appElements.length,
            tilesCount: tileElements.length,
            currentActiveName: nm?.textContent || null,
            currentActiveSub: sb?.textContent || null,
            hasHorizontalScroll: document.documentElement.scrollWidth > W
          };
        })()`,
        returnByValue: true,
      });

      results[vp.name] = metrics.result.value;

      // Capture screenshot
      const shot = await sendSession("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(
        path.join(ARTIFACT_DIR, `verified_platform_radar_${vp.name}.png`),
        Buffer.from(shot.data, "base64")
      );
    }

    // Interactive Core Scan Click Test on desktop
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 1280,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false,
    });
    await sleep(500);

    const scanTest = await sendSession("Runtime.evaluate", {
      expression: `(async () => {
        const pr = document.querySelector("platform-radar");
        const sr = pr.shadowRoot;
        const core = sr.querySelector(".core");

        // Click the core to initiate scan
        core.click();
        await new Promise(r => setTimeout(r, 400));

        const scanEl = sr.querySelector(".scan");
        const beamEl = sr.querySelector(".scanbeam");
        const svgCount = scanEl ? scanEl.querySelectorAll("svg").length : 0;
        const blipCount = sr.querySelectorAll(".app.blip, .tile:hover").length;

        // Wait for scan to progress
        await new Promise(r => setTimeout(r, 1200));
        const midBlipCount = sr.querySelectorAll(".app.blip").length;

        // Wait for scan to complete and clean up
        await new Promise(r => setTimeout(r, 1800));
        const scanElAfter = sr.querySelector(".scan");

        return {
          scanTriggered: !!scanEl,
          beamCreated: !!beamEl,
          scanSvgRings: svgCount,
          activeBlipsDuringScan: blipCount > 0 || midBlipCount > 0,
          scanCleanedUpAfterFinish: !scanElAfter
        };
      })()`,
      awaitPromise: true,
      returnByValue: true,
    });
    results.scanTest = scanTest.result.value;

    // Interactive Tile Hover/Click Test
    const tileTest = await sendSession("Runtime.evaluate", {
      expression: `(async () => {
        const pr = document.querySelector("platform-radar");
        const sr = pr.shadowRoot;
        const tiles = sr.querySelectorAll(".tile");

        // Click WhatsApp (index 2)
        tiles[2].click();
        await new Promise(r => setTimeout(r, 350));
        const nameAfterClick = sr.querySelector("#nm")?.textContent;
        const subAfterClick = sr.querySelector("#sb")?.textContent;
        const isHot = sr.querySelector(".app[data-i='2']")?.classList.contains("hot");

        // Click TikTok (index 3)
        tiles[3].click();
        await new Promise(r => setTimeout(r, 350));
        const nameAfterTikTok = sr.querySelector("#nm")?.textContent;

        return {
          nameAfterClick,
          subAfterClick,
          isHot,
          nameAfterTikTok
        };
      })()`,
      awaitPromise: true,
      returnByValue: true,
    });
    results.tileTest = tileTest.result.value;

    // Verify script tags in DOM
    const scriptCheck = await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const allScripts = Array.from(document.querySelectorAll("script")).filter(s => s.textContent.includes("PlatformRadar"));
        const actualExecScripts = allScripts.filter(s => !s.textContent.includes("__next_f"));
        return {
          totalMatchingScripts: allScripts.length,
          actualExecScriptsCount: actualExecScripts.length,
          parentOfExecScript: actualExecScripts[0]?.parentElement?.tagName || null
        };
      })()`,
      returnByValue: true,
    });
    results.scriptCheck = scriptCheck.result.value;
    results.consoleLogs = consoleLogs;

    console.log("PLATFORM_RADAR_RESULTS:" + JSON.stringify(results, null, 2));

    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    try {
      chromeProc.kill();
    } catch {}
  }
}

main();
