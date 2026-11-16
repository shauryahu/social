import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(os.tmpdir(), "socialassist-audit-" + Date.now());
const AUDIT_DIR = path.join(process.cwd(), "public", "audit");

if (!fs.existsSync(AUDIT_DIR)) {
  fs.mkdirSync(AUDIT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// 1. Static Analysis of Section IDs and Targets
console.log("=== 1. STATIC ID AUDIT ===");
const sectionFiles = fs.readdirSync(path.join(process.cwd(), "src", "components", "sections"));
const idMap = new Map();

for (const file of sectionFiles) {
  const code = fs.readFileSync(path.join(process.cwd(), "src", "components", "sections", file), "utf8");
  const idMatches = code.match(/id=["']([a-zA-Z0-9_-]+)["']/g) || [];
  idMap.set(file, idMatches.map((m) => m.replace(/id=["']/, "").replace(/["']/, "")));
}

for (const [file, ids] of idMap.entries()) {
  console.log(`- ${file}: ${ids.join(", ") || "(no IDs)"}`);
}

// Check navigation targets
const navCode = fs.readFileSync(path.join(process.cwd(), "src", "components", "Navigation.tsx"), "utf8");
const hrefMatches = (navCode.match(/href:\s*["'](#[a-zA-Z0-9_-]+)["']/g) || []).map((m) =>
  m.replace(/href:\s*["']#/, "").replace(/["']/, "")
);
console.log("\nNavigation Targets:", hrefMatches);

const allIds = Array.from(idMap.values()).flat();
for (const target of hrefMatches) {
  if (allIds.includes(target)) {
    console.log(`  [OK] #${target} exists`);
  } else {
    console.error(`  [BROKEN LINK] #${target} does NOT exist in any section file!`);
  }
}

// 2. Headless Chrome Runtime Audit
console.log("\n=== 2. RUNTIME BROWSER AUDIT ===");

const chromeProc = spawn(
  CHROME_PATH,
  [
    "--headless=new",
    "--remote-debugging-port=9222",
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

async function getDebuggerUrl() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch("http://127.0.0.1:9222/json/version");
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {
      await sleep(300);
    }
  }
  throw new Error("Could not connect to Chrome debugging port");
}

async function main() {
  const consoleMessages = [];
  const runtimeErrors = [];
  const failedRequests = [];

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

    // Attach listeners for events
    ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === "Runtime.consoleAPICalled") {
        consoleMessages.push({
          type: msg.params.type,
          text: msg.params.args.map((a) => a.value || JSON.stringify(a)).join(" "),
        });
      }
      if (msg.method === "Runtime.exceptionThrown") {
        runtimeErrors.push(msg.params.exceptionDetails);
      }
      if (msg.method === "Network.responseReceived") {
        const { status, url } = msg.params.response;
        if (status >= 400) {
          failedRequests.push({ status, url });
        }
      }
    });

    await sendSession("Page.enable");
    await sendSession("DOM.enable");
    await sendSession("Runtime.enable");
    await sendSession("Network.enable");
    await sendSession("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false,
    });

    console.log("Navigating to http://localhost:3000 ...");
    await sendSession("Page.navigate", { url: "http://localhost:3000" });

    // Wait for initial render and loading screen
    await sleep(4000);

    // Evaluate DOM health
    const domHealth = await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const brokenImages = Array.from(document.querySelectorAll('img'))
          .filter(img => !img.complete || img.naturalWidth === 0)
          .map(img => img.src);

        const brokenVideos = Array.from(document.querySelectorAll('video'))
          .filter(v => v.error)
          .map(v => ({ src: v.src, error: v.error.message }));

        const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;
        const totalHeight = document.documentElement.scrollHeight;

        const sectionsFound = ['home', 'services', 'platforms', 'exchange', 'automation', 'about', 'contact', 'verification'].map(id => ({
          id,
          found: !!document.getElementById(id),
          top: document.getElementById(id)?.offsetTop
        }));

        return {
          brokenImages,
          brokenVideos,
          hasHorizontalOverflow,
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          totalHeight,
          sectionsFound
        };
      })()`,
      returnByValue: true,
    });

    console.log("\n--- DOM HEALTH AUDIT ---");
    console.log(JSON.stringify(domHealth.result.value, null, 2));

    // Test Laptop Controls interaction
    console.log("\n--- TESTING 3D LAPTOP INTERACTIVE CONTROLS ---");
    const laptopTest = await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const buttons = Array.from(document.querySelectorAll('#home button, div[class*=\"max-w-5xl\"] button'));
        const labels = buttons.map(b => b.innerText.trim()).filter(Boolean);
        
        // Find Pause/Play button
        const pauseBtn = buttons.find(b => /pause|play/i.test(b.innerText));
        // Find Mute/Unmute button
        const muteBtn = buttons.find(b => /unmute|mute/i.test(b.innerText));
        // Find Re-Open button
        const reopenBtn = buttons.find(b => /re-open/i.test(b.innerText));

        let actions = [];
        if (pauseBtn) { pauseBtn.click(); actions.push("clicked pause/play"); }
        if (muteBtn) { muteBtn.click(); actions.push("clicked mute/unmute"); }
        if (reopenBtn) { reopenBtn.click(); actions.push("clicked re-open"); }

        return { labels, actions };
      })()`,
      returnByValue: true,
    });
    console.log("Laptop controls test:", laptopTest.result.value);

    // Test Verification Tier switcher
    console.log("\n--- TESTING VERIFICATION TIER SWITCHER ---");
    const verifTest = await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const tierButtons = Array.from(document.querySelectorAll('#verification button')).filter(b => 
          /brand|creator|executive/i.test(b.innerText)
        );
        let clicked = [];
        for (const btn of tierButtons) {
          btn.click();
          clicked.push(btn.innerText.trim());
        }
        return { tierButtonsCount: tierButtons.length, clicked };
      })()`,
      returnByValue: true,
    });
    console.log("Verification tier switcher test:", verifTest.result.value);

    // Section-by-section screenshot captures
    console.log("\n--- CAPTURING SECTION PREVIEWS ---");

    const sectionsToCapture = [
      { name: "1_hero", y: 0 },
      { name: "2_laptop_open", y: 880 },
      { name: "3_services", y: 1750 },
      { name: "4_platforms", y: 3200 },
      { name: "5_verification", y: 4900 },
      { name: "6_crypto_automation", y: 7400 },
      { name: "7_final_cta_inquiry", y: 10900 },
    ];

    for (const sec of sectionsToCapture) {
      await sendSession("Runtime.evaluate", { expression: `window.scrollTo(0, ${sec.y})` });
      await sleep(1200);
      const shot = await sendSession("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(AUDIT_DIR, `${sec.name}.png`), Buffer.from(shot.data, "base64"));
      console.log(`Saved public/audit/${sec.name}.png at Y=${sec.y}`);
    }

    console.log("\n=== AUDIT SUMMARY ===");
    console.log(`- Console Messages: ${consoleMessages.length}`);
    const errorsOnly = consoleMessages.filter((m) => m.type === "error");
    if (errorsOnly.length) {
      console.log("  Errors found:", errorsOnly);
    } else {
      console.log("  [OK] Zero console errors!");
    }

    console.log(`- Runtime Exceptions: ${runtimeErrors.length}`);
    if (runtimeErrors.length) console.log("  Runtime errors:", runtimeErrors);

    console.log(`- Failed HTTP Requests (>=400): ${failedRequests.length}`);
    if (failedRequests.length) console.log("  Failed requests:", failedRequests);

    ws.close();
  } finally {
    chromeProc.kill();
    try {
      fs.rmSync(USER_DATA, { recursive: true, force: true });
    } catch {}
  }
}

main().catch((err) => {
  console.error("Audit script failed:", err);
  process.exit(1);
});
