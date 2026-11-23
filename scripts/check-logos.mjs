import fs from "node:fs";

const content = fs.readFileSync("src/components/sections/platform-radar-script.ts", "utf8");
const sIdx = content.indexOf("LOGO_S");
console.log("LOGO_S index:", sIdx);
if (sIdx !== -1) {
  console.log(content.slice(sIdx - 50, sIdx + 150));
}
