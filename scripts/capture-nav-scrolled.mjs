import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const ARTIFACT_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";
const PORT = 9311;
const tmpDir = path.join(os.tmpdir(), "chrome-scrolled-" + Date.now());

const chromeProc = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${tmpDir}`,
  "--disable-extensions",
  "--disable-default-apps",
  "--no-first-run",
  "--hide-scrollbars",
  "about:blank",
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  try {
    let version = null;
    for (let i = 0; i < 20; i++) {
      await sleep(300);
      try {
        const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
        version = await r.json();
        if (version && version.webSocketDebuggerUrl) break;
      } catch {}
    }
    if (!version) throw new Error("Chrome CDP not reachable");

    const ws = new WebSocket(version.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));

    let msgId = 1;
    const callbacks = new Map();
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };

    const send = (m, p = {}) =>
      new Promise((resolve, reject) => {
        const id = msgId++;
        callbacks.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method: m, params: p }));
      });

    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });

    const sendS = (m, p = {}) =>
      new Promise((resolve, reject) => {
        const id = msgId++;
        callbacks.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, sessionId, method: m, params: p }));
      });

    await sendS("Page.enable");
    await sendS("Runtime.enable");

    const viewports = [
      { w: 1440, h: 900, name: "1440" },
      { w: 1024, h: 768, name: "1024" },
      { w: 820, h: 1180, name: "820" },
      { w: 768, h: 1024, name: "768" },
      { w: 390, h: 844, name: "390", mobile: true },
    ];

    for (const theme of ["light", "dark"]) {
      for (const vp of viewports) {
        await sendS("Emulation.setDeviceMetricsOverride", {
          width: vp.w,
          height: vp.h,
          deviceScaleFactor: 2,
          mobile: !!vp.mobile,
        });

        await sendS("Page.navigate", { url: "http://localhost:3000" });

        // Wait until #pre is gone (up to 8s)
        for (let t = 0; t < 16; t++) {
          await sleep(500);
          const chk = await sendS("Runtime.evaluate", {
            returnByValue: true,
            expression: `(() => {
              const p = document.getElementById("pre");
              return !p || p.classList.contains("gone") || window.getComputedStyle(p).display === "none";
            })()`
          });
          if (chk.result.value) break;
        }

        // Just in case, force display none on #pre
        await sendS("Runtime.evaluate", {
          expression: `(() => {
            const p = document.getElementById("pre");
            if (p) p.style.display = "none";
            document.body.classList.remove("lock");
          })()`
        });

        // Apply theme
        await sendS("Runtime.evaluate", {
          expression: `(() => {
            const de = document.documentElement;
            de.setAttribute("data-theme", "${theme}");
            if ("${theme}" === "dark") {
              de.classList.remove("light");
              de.classList.add("dark");
            } else {
              de.classList.remove("dark");
              de.classList.add("light");
            }
            if (typeof syncShadowRoots === "function") syncShadowRoots("${theme}");
          })()`,
        });
        await sleep(400);

        // Scroll down to 800px so busy text/cards are behind the sticky floating nav
        await sendS("Runtime.evaluate", {
          expression: `window.scrollTo({ top: 800, behavior: "instant" })`
        });
        await sleep(500);

        if (vp.w <= 700) {
          // Closed state
          const shotClosed = await sendS("Page.captureScreenshot", {
            clip: { x: 0, y: 0, width: vp.w, height: 350, scale: 2 }
          });
          fs.writeFileSync(
            path.join(ARTIFACT_DIR, `scrolled_nav_${theme}_${vp.name}_closed.png`),
            Buffer.from(shotClosed.data, "base64")
          );

          // Open burger
          await sendS("Runtime.evaluate", {
            expression: `document.querySelector(".sa-nav .burger")?.click()`,
          });
          await sleep(600);

          const shotOpen = await sendS("Page.captureScreenshot", {
            clip: { x: 0, y: 0, width: vp.w, height: 500, scale: 2 }
          });
          fs.writeFileSync(
            path.join(ARTIFACT_DIR, `scrolled_nav_${theme}_${vp.name}_open.png`),
            Buffer.from(shotOpen.data, "base64")
          );

          // Close burger
          await sendS("Runtime.evaluate", {
            expression: `document.querySelector(".sa-nav .burger")?.click()`,
          });
          await sleep(300);
        } else {
          const shot = await sendS("Page.captureScreenshot", {
            clip: { x: 0, y: 0, width: vp.w, height: 200, scale: 2 }
          });
          fs.writeFileSync(
            path.join(ARTIFACT_DIR, `scrolled_nav_${theme}_${vp.name}.png`),
            Buffer.from(shot.data, "base64")
          );
        }

        console.log(`Scrolled captured ${theme} ${vp.name}`);
      }
    }

    console.log("ALL SCROLLED NAV SCREENSHOTS CAPTURED!");
  } catch (err) {
    console.error("Capture error:", err);
  } finally {
    chromeProc.kill();
    process.exit(0);
  }
}

run();
