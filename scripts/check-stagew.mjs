import fs from "node:fs";

const content = fs.readFileSync("src/components/sections/platform-radar-script.ts", "utf8");

const stagewIdx = content.indexOf(".stagew");
console.log("=== .stagew CSS ===");
console.log(content.slice(stagewIdx, stagewIdx + 300));
