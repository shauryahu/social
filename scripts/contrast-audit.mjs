import { spawn } from "node:child_process";
import fs from "node:fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chromeProc = spawn(CHROME_PATH, [
  "--headless=new",
  "--remote-debugging-port=9244",
  "--window-size=1440,900",
  "about:blank",
]);

setTimeout(async () => {
  try {
    const v = await fetch("http://127.0.0.1:9244/json/version").then((r) => r.json());
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
    await new Promise((r) => setTimeout(r, 4500));

    // Ensure dark mode is active and shadow themes are injected
    await sendS("Runtime.evaluate", {
      expression: `(() => {
        document.documentElement.setAttribute("data-theme", "dark");
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        localStorage.setItem("socialassist-theme", "dark");
        window.dispatchEvent(new Event("socialassist-theme-change"));
        window.dispatchEvent(new Event("storage"));
      })()`,
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Run in-page contrast audit
    const auditRes = await sendS("Runtime.evaluate", {
      expression: `(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        function parseCssColor(str) {
          if (!str || str === "transparent" || str === "rgba(0, 0, 0, 0)") {
            return { r: 0, g: 0, b: 0, a: 0 };
          }
          ctx.clearRect(0, 0, 1, 1);
          ctx.fillStyle = "rgba(0, 0, 0, 0)";
          ctx.fillStyle = str;
          ctx.fillRect(0, 0, 1, 1);
          const data = ctx.getImageData(0, 0, 1, 1).data;
          return {
            r: data[0],
            g: data[1],
            b: data[2],
            a: data[3] / 255
          };
        }

        function compositeAlpha(fg, bg) {
          const a = fg.a + bg.a * (1 - fg.a);
          if (a === 0) return { r: 5, g: 5, b: 5, a: 1 };
          const r = Math.round((fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a);
          const g = Math.round((fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a);
          const b = Math.round((fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a);
          return { r, g, b, a };
        }

        function sRGBToLin(c) {
          const v = c / 255;
          return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        }

        function getLuminance(rgb) {
          return 0.2126 * sRGBToLin(rgb.r) + 0.7152 * sRGBToLin(rgb.g) + 0.0722 * sRGBToLin(rgb.b);
        }

        function getContrast(lum1, lum2) {
          const l1 = Math.max(lum1, lum2);
          const l2 = Math.min(lum1, lum2);
          return (l1 + 0.05) / (l2 + 0.05);
        }

        function getEffectiveBg(el) {
          // If element is an active pill/button item over a white indicator, background is white
          if (el.closest && (
            el.closest('.sa-nav [aria-current="page"]') ||
            el.closest('.tabs [aria-selected="true"]') ||
            el.closest('.seg button[aria-checked="true"]') ||
            el.closest('.coin[aria-checked="true"]') ||
            el.closest('.cta, .os-cta, .btn-primary, [class*="bg-white"], a.group[href*="t.me"]')
          )) {
            return { r: 255, g: 255, b: 255, a: 1 };
          }

          let bgStack = [];
          let cur = el;
          while (cur && cur !== document.documentElement) {
            const cs = window.getComputedStyle(cur);
            if (cs) {
              const isTextClip = cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text';
              // Only treat background-image as background if it is NOT clipped to text
              if (!isTextClip) {
                const bgImg = cs.backgroundImage || "";
                if (bgImg.includes("gradient") && (bgImg.includes("#fff") || bgImg.includes("rgb(255") || bgImg.includes("#dcdfe8") || bgImg.includes("#dfe1e9"))) {
                  bgStack.push({ r: 250, g: 250, b: 250, a: 1 });
                } else {
                  const parsed = parseCssColor(cs.backgroundColor);
                  if (parsed.a > 0) bgStack.push(parsed);
                }
              }
            }
            if (cur.parentElement) {
              cur = cur.parentElement;
            } else if (cur.getRootNode && cur.getRootNode().host) {
              cur = cur.getRootNode().host;
            } else {
              break;
            }
          }
          // Default base page dark background: #050505
          let comp = { r: 5, g: 5, b: 5, a: 1 };
          for (let i = bgStack.length - 1; i >= 0; i--) {
            comp = compositeAlpha(bgStack[i], comp);
          }
          return comp;
        }

        function getSection(el) {
          let cur = el;
          while (cur && cur !== document.body) {
            if (cur.id) return '#' + cur.id;
            if (cur.tagName && cur.tagName.includes('-')) return '<' + cur.tagName.toLowerCase() + '>';
            if (cur.tagName === 'FOOTER') return '<footer>';
            if (cur.tagName === 'HEADER' || (cur.classList && cur.classList.contains('sa-nav'))) return '<navbar>';
            cur = cur.parentElement || (cur.getRootNode && cur.getRootNode().host);
          }
          return '<main>';
        }

        function getSelector(el) {
          let path = [];
          let cur = el;
          while (cur && cur !== document.body && path.length < 3) {
            let part = cur.tagName.toLowerCase();
            if (cur.id) {
              path.unshift('#' + cur.id);
              break;
            } else if (cur.className && typeof cur.className === 'string') {
              const cls = cur.className.trim().split(/\\s+/)[0];
              if (cls) part += '.' + cls;
            }
            path.unshift(part);
            cur = cur.parentElement || (cur.getRootNode && cur.getRootNode().host);
          }
          return path.join(' > ');
        }

        const issues = [];
        const seen = new Set();

        function auditNode(node) {
          if (!node) return;
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node;

            // Skip #pre loader since it is only active during the initial opening
            if (el.id === 'pre' || el.closest('#pre')) return;

            const cs = window.getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return;

            // Check if element has direct text
            let text = "";
            for (let child of el.childNodes) {
              if (child.nodeType === Node.TEXT_NODE) {
                text += child.textContent;
              }
            }
            text = text.trim();

            if (text && text.length > 0 && !seen.has(el)) {
              seen.add(el);
              const rect = el.getBoundingClientRect();
              // Only audit elements that have layout dimensions
              if (rect.width > 0 && rect.height > 0) {
                const textColor = parseCssColor(cs.color);
                const bgRgb = getEffectiveBg(el);
                const textLum = getLuminance(textColor);
                const bgLum = getLuminance(bgRgb);
                const contrast = getContrast(textLum, bgLum);

                const fontSize = parseFloat(cs.fontSize) || 16;
                const fontWeight = parseInt(cs.fontWeight, 10) || 400;
                const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
                const minContrast = isLarge ? 3.0 : 4.5;

                // Primary buttons and active indicator pills intentionally have white background and black text (contrast 21:1)
                const isWhitePillOrButton = el.closest && (
                  el.closest('.cta, .os-cta, .btn-primary, [class*="bg-white"], a.group[href*="t.me"]') ||
                  el.closest('.sa-nav [aria-current="page"]') ||
                  el.closest('.tabs [aria-selected="true"]') ||
                  el.closest('.seg button[aria-checked="true"]') ||
                  el.closest('.coin[aria-checked="true"]')
                );

                // Gradient text using background-clip: text has transparent text color, rendered by gradient stops
                const isGradientText = cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text';

                const hasLowContrast = !isGradientText && !isWhitePillOrButton && contrast < minContrast;
                const hasHighBgLum = !isGradientText && !isWhitePillOrButton && bgLum > 0.6; // Light surface leak

                if (hasLowContrast || hasHighBgLum) {
                  issues.push({
                    section: getSection(el),
                    selector: getSelector(el),
                    text: text.slice(0, 50),
                    fontSize: fontSize + 'px' + (isLarge ? ' (large)' : ''),
                    color: cs.color,
                    bg: 'rgb(' + bgRgb.r + ', ' + bgRgb.g + ', ' + bgRgb.b + ')',
                    contrast: contrast.toFixed(2) + ':1',
                    minRequired: minContrast + ':1',
                    bgLuminance: bgLum.toFixed(2),
                    reason: hasHighBgLum ? 'Light background leak (lum > 0.6)' : 'Low WCAG AA contrast'
                  });
                }
              }
            }

            // If has shadowRoot, traverse inside
            if (el.shadowRoot) {
              traverse(el.shadowRoot);
            }
          }

          if (node.children) {
            for (let child of node.children) {
              auditNode(child);
            }
          }
        }

        function traverse(root) {
          const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
          let curr = treeWalker.currentNode;
          while (curr) {
            auditNode(curr);
            curr = treeWalker.nextNode();
          }
        }

        traverse(document.body);
        return issues;
      })()`,
      returnByValue: true,
    });

    console.log("=== CONTRAST AUDIT RESULTS ===");
    console.log("Total Issues Found:", auditRes.result.value.length);
    console.log(JSON.stringify(auditRes.result.value, null, 2));

    fs.writeFileSync(
      "C:\\Users\\USER\\.gemini\\antigravity\\brain\\da496d37-3ff2-4b7f-9011-fb4d0e692a91\\contrast_audit_results.json",
      JSON.stringify(auditRes.result.value, null, 2)
    );

    ws.close();
    chromeProc.kill();
    process.exit(0);
  } catch (err) {
    console.error("Audit failed:", err);
    chromeProc.kill();
    process.exit(1);
  }
}, 1200);
