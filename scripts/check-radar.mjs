import fs from "node:fs";

const content = fs.readFileSync("src/components/sections/platform-radar-script.ts", "utf8");
const innerHtmlIdx = content.indexOf("stage.innerHTML = h;");
console.log("--- AFTER stage.innerHTML = h (1500 chars) ---");
console.log(content.slice(innerHtmlIdx, innerHtmlIdx + 2000));
