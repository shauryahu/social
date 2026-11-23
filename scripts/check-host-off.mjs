import fs from "node:fs";

const content = fs.readFileSync("src/components/sections/platform-radar-script.ts", "utf8");

const offIdx = content.indexOf(":host(.off)");
console.log(":host(.off) index:", offIdx);
if (offIdx !== -1) {
  console.log(content.slice(offIdx, offIdx + 300));
}

const hostIdx = content.indexOf(":host");
console.log(":host rules:");
let idx = 0;
while ((idx = content.indexOf(":host", idx + 1)) !== -1) {
  console.log(content.slice(idx, idx + 120));
}
