import fs from "node:fs";

const content = fs.readFileSync("src/components/sections/platform-radar-script.ts", "utf8");
const coreIdx = content.indexOf('<button class="core');
console.log("core index:", coreIdx);
if (coreIdx !== -1) {
  console.log(content.slice(coreIdx - 50, coreIdx + 250));
}
