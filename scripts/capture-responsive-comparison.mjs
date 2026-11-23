import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ARTIFACTS_DIR = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const VIEWPORTS = [
  { name: "desktop_1440", width: 1440, height: 900 },
  { name: "tablet_960", width: 960, height: 900 },
  { name: "mobile_390", width: 390, height: 844 },
];

const SECTIONS = [
  { id: "hero", label: "Hero & Navbar", selector: "#home" },
  { id: "services", label: "Services Showcase", selector: "services-showcase" },
  { id: "radar", label: "Platform Radar", selector: "platform-radar" },
  { id: "why", label: "Why SocialAssist Carousel", selector: ".clc-root" },
  { id: "restoration", label: "Restoration Section", selector: "restoration-section" },
  { id: "verification", label: "Verification Section", selector: "verification-section" },
  { id: "brand", label: "Brand Defense", selector: "brand-defense" },
  { id: "otc", label: "Crypto Exchange (OTC)", selector: "otc-section" },
  { id: "finalcta", label: "Telegram Desk & Final CTA", selector: "#contact" },
  { id: "footer", label: "Footer", selector: "footer" },
];

async function capture() {
  const chromeProc = spawn(CHROME_PATH, [
    "--headless=new",
    "--remote-debugging-port=9266",
    "--window-size=1440,900",
    "about:blank",
  ]);

  await new Promise((r) => setTimeout(r, 1200));

  try {
    const v = await fetch("http://127.0.0.1:9266/json/version").then((r) => r.json());
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
    await sendS("DOM.enable");
    await sendS("CSS.enable");

    for (const theme of ["light", "dark"]) {
      console.log(`\n=================== CAPTURING THEME: ${theme.toUpperCase()} ===================`);

      for (const vp of VIEWPORTS) {
        console.log(`\n--- Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);

        await sendS("Emulation.setDeviceMetricsOverride", {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.width < 600,
        });

        await sendS("Page.navigate", { url: "http://localhost:3000" });
        await new Promise((r) => setTimeout(r, 3500));

        // Set theme
        await sendS("Runtime.evaluate", {
          expression: `(() => {
            document.documentElement.setAttribute("data-theme", "${theme}");
            if ("${theme}" === "dark") {
              document.documentElement.classList.remove("light");
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
              document.documentElement.classList.add("light");
            }
            localStorage.setItem("socialassist-theme", "${theme}");
            window.dispatchEvent(new Event("socialassist-theme-change"));
            window.dispatchEvent(new Event("storage"));
            
            // Remove loader to reveal content immediately
            const pre = document.getElementById("pre");
            if (pre) pre.classList.add("gone");
            document.body.classList.remove("lock");
          })()`,
        });

        await new Promise((r) => setTimeout(r, 1000));

        // Capture each section by scrolling to it
        for (const sec of SECTIONS) {
          const scrolled = await sendS("Runtime.evaluate", {
            expression: `(() => {
              const el = document.querySelector("${sec.selector}");
              if (!el) return false;
              el.scrollIntoView({ block: "center", behavior: "instant" });
              return true;
            })()`,
            returnByValue: true,
          });

          if (scrolled.result?.value) {
            await new Promise((r) => setTimeout(r, 350));
            const shot = await sendS("Page.captureScreenshot", { format: "png" });
            const secPath = path.join(ARTIFACTS_DIR, `sec_${sec.id}_${theme}_${vp.name}.png`);
            fs.writeFileSync(secPath, Buffer.from(shot.data, "base64"));
            console.log(`Saved [${sec.label}]: ${secPath}`);
          }
        }

        // Test mobile navbar burger menu at 390px
        if (vp.name === "mobile_390") {
          await sendS("Runtime.evaluate", {
            expression: `(() => {
              window.scrollTo(0, 0);
              const burger = document.querySelector(".sa-nav .burger");
              if (burger) burger.click();
            })()`,
          });
          await new Promise((r) => setTimeout(r, 450));
          const navShot = await sendS("Page.captureScreenshot", { format: "png" });
          const navPath = path.join(ARTIFACTS_DIR, `navbar_open_${theme}_mobile_390.png`);
          fs.writeFileSync(navPath, Buffer.from(navShot.data, "base64"));
          console.log(`Saved [Mobile Nav Open]: ${navPath}`);
        }
      }
    }

    ws.close();
    chromeProc.kill();
    console.log("\nALL RESPONSIVE COMPARISON SCREENSHOTS CAPTURED SUCCESSFULLY!");
    process.exit(0);
  } catch (err) {
    console.error("Capture failed:", err);
    chromeProc.kill();
    process.exit(1);
  }
}

capture();
