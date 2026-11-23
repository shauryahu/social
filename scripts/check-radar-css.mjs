import fs from "node:fs";

const content = fs.readFileSync("src/components/sections/platform-radar-script.ts", "utf8");

function showCssFor(selector) {
  const idx = content.indexOf(selector);
  if (idx !== -1) {
    console.log(`=== CSS FOR ${selector} ===`);
    console.log(content.slice(idx, idx + 400));
  } else {
    console.log(`=== SELECTOR ${selector} NOT FOUND ===`);
  }
}

showCssFor(".orbit{");
showCssFor(".pos{");
showCssFor(".cnt{");
showCssFor(".app{");
showCssFor(".tile{");
showCssFor(".wrap.in");
