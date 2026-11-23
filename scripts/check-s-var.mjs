import fs from "node:fs";

const content = fs.readFileSync("src/components/sections/platform-radar-script.ts", "utf8");

const sMatches = [];
let idx = 0;
while ((idx = content.indexOf("--s", idx + 1)) !== -1) {
  sMatches.push(idx);
}
console.log("--s matches:", sMatches.length);
for (const i of sMatches) {
  console.log(content.slice(Math.max(0, i - 30), Math.min(content.length, i + 60)));
}
