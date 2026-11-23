import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const ARTIFACT_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";
const PORT = 9277;
const tmpDir = path.join(os.tmpdir(), "chrome-audit-" + Date.now());

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
    const consoleErrors = [];

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
      if (msg.method === "Runtime.exceptionThrown") {
        consoleErrors.push(msg.params);
      }
      if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
        consoleErrors.push(msg.params.args);
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

    const auditSummary = [];

    for (const theme of ["light", "dark"]) {
      for (const vp of viewports) {
        await sendS("Emulation.setDeviceMetricsOverride", {
          width: vp.w,
          height: vp.h,
          deviceScaleFactor: 2,
          mobile: !!vp.mobile,
        });

        await sendS("Page.navigate", { url: "http://localhost:3000" });
        await sleep(3000);

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
        await sleep(500);

        // Audit Fix 1 (Nav sizing)
        const navEval = await sendS("Runtime.evaluate", {
          returnByValue: true,
          expression: `(() => {
            const bar = document.querySelector(".sa-nav .bar");
            const pill = document.querySelector(".sa-nav .pill");
            const ind = document.querySelector(".sa-nav .ind");
            const activeItem = document.querySelector('.sa-nav .it[aria-current="page"]');
            const W = window.innerWidth;
            if (!bar) return { error: "No bar" };
            const br = bar.getBoundingClientRect();
            const ir = ind ? ind.getBoundingClientRect() : null;
            const ar = activeItem ? activeItem.getBoundingClientRect() : null;
            return {
              barWidth: br.width,
              barLeft: br.left,
              barRight: br.right,
              viewportW: W,
              fitsInViewport: br.left >= 0 && br.right <= W + 1,
              indicatorAligned: ir && ar ? Math.abs(ir.left - ar.left) < 6 : null
            };
          })()`,
        });

        // Audit Fix 2 (Logo in dark mode)
        const logoEval = await sendS("Runtime.evaluate", {
          returnByValue: true,
          expression: `(() => {
            const logo = document.querySelector(".sa-nav .logo");
            const img = document.querySelector(".sa-nav .logo img");
            if (!logo) return null;
            const s = window.getComputedStyle(logo);
            const is = img ? window.getComputedStyle(img) : null;
            return {
              bg: s.backgroundImage || s.backgroundColor,
              boxShadow: s.boxShadow,
              imgSrc: img ? img.getAttribute("src") : null,
              imgContent: is ? is.content : null
            };
          })()`,
        });

        // Audit Fix 3 (Section seams)
        const seamEval = await sendS("Runtime.evaluate", {
          returnByValue: true,
          expression: `(() => {
            const dividers = Array.from(document.querySelectorAll(".border-divider"));
            return dividers.map(d => {
              const s = window.getComputedStyle(d);
              return {
                borderTop: s.borderTopWidth,
                borderBottom: s.borderBottomWidth
              };
            });
          })()`,
        });

        // Audit Fix 4 (Mobile Menu collision & frosted glass)
        let mobileEval = null;
        if (vp.w <= 700) {
          // Open burger
          await sendS("Runtime.evaluate", {
            expression: `document.querySelector(".sa-nav .burger")?.click()`,
          });
          await sleep(500);

          mobileEval = await sendS("Runtime.evaluate", {
            returnByValue: true,
            expression: `(() => {
              const bar = document.querySelector(".sa-nav .bar");
              const panel = document.querySelector(".sa-nav .panel");
              if (!bar || !panel) return null;
              const br = bar.getBoundingClientRect();
              const pr = panel.getBoundingClientRect();
              const ps = window.getComputedStyle(panel);
              const bs = window.getComputedStyle(bar);
              return {
                barBottom: br.bottom,
                panelTop: pr.top,
                gap: pr.top - br.bottom,
                noOverlap: pr.top >= br.bottom,
                panelBg: ps.backgroundColor,
                panelFilter: ps.backdropFilter || ps.webkitBackdropFilter,
                barFilter: bs.backdropFilter || bs.webkitBackdropFilter,
                panelMaxHeight: ps.maxHeight,
                panelOverflowY: ps.overflowY,
                zIndexBar: bs.zIndex,
                zIndexPanel: ps.zIndex
              };
            })()`,
          });

          // Capture mobile open screenshot
          const shot = await sendS("Page.captureScreenshot", { format: "png" });
          fs.writeFileSync(
            path.join(ARTIFACT_DIR, `verify_nav_${theme}_${vp.name}_open.png`),
            Buffer.from(shot.data, "base64")
          );

          // Close burger
          await sendS("Runtime.evaluate", {
            expression: `document.querySelector(".sa-nav .burger")?.click()`,
          });
          await sleep(300);
        } else {
          // Capture closed nav screenshot
          const shot = await sendS("Page.captureScreenshot", { format: "png" });
          fs.writeFileSync(
            path.join(ARTIFACT_DIR, `verify_nav_${theme}_${vp.name}.png`),
            Buffer.from(shot.data, "base64")
          );
        }

        // Audit Fix 5 (Platform Radar Icons)
        await sendS("Runtime.evaluate", {
          expression: `document.querySelector("platform-radar")?.scrollIntoView({ behavior: "instant", block: "center" })`,
        });
        await sleep(1500);

        const radarEval = await sendS("Runtime.evaluate", {
          returnByValue: true,
          expression: `(() => {
            const pr = document.querySelector("platform-radar");
            if (!pr || !pr.shadowRoot) return { error: "No platform-radar" };
            const sr = pr.shadowRoot;
            const tiles = Array.from(sr.querySelectorAll(".tile"));
            return {
              count: tiles.length,
              tiles: tiles.map(t => {
                const r = t.getBoundingClientRect();
                const s = window.getComputedStyle(t);
                const img = t.querySelector("img, svg");
                return {
                  label: t.getAttribute("aria-label"),
                  w: Math.round(r.width),
                  h: Math.round(r.height),
                  display: s.display,
                  opacity: s.opacity,
                  hasImage: !!img,
                  tag: img ? img.tagName : null
                };
              })
            };
          })()`,
        });

        // Screenshot radar
        const radarShot = await sendS("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(
          path.join(ARTIFACT_DIR, `verify_radar_${theme}_${vp.name}.png`),
          Buffer.from(radarShot.data, "base64")
        );

        auditSummary.push({
          theme,
          viewport: vp.name,
          nav: navEval.result.value,
          logo: logoEval.result.value,
          seams: seamEval.result.value,
          mobileMenu: mobileEval ? mobileEval.result.value : "N/A",
          radar: radarEval.result.value,
        });
      }
    }

    console.log("=== AUDIT COMPLETED ===");
    console.log("Console Errors:", consoleErrors.length);
    console.log(JSON.stringify(auditSummary, null, 2));
    fs.writeFileSync(
      path.join(ARTIFACT_DIR, "audit-summary.json"),
      JSON.stringify({ auditSummary, consoleErrors }, null, 2)
    );
  } catch (err) {
    console.error("Audit error:", err);
  } finally {
    chromeProc.kill();
    process.exit(0);
  }
}

run();
