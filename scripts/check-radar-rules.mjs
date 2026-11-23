import fs from "node:fs";

const content = fs.readFileSync("src/components/sections/platform-radar-script.ts", "utf8");

// Extract the entire <style> block from TEMPLATE
const styleStart = content.indexOf("<style>");
const styleEnd = content.indexOf("</style>");
const style = content.slice(styleStart + 7, styleEnd);

console.log("Full radar style length:", style.length);

// Let's search for every rule mentioning .app, .tile, .cnt, .pos, or img
const rules = style.split("}");
for (const r of rules) {
  if (r.includes(".app") || r.includes(".tile") || r.includes(".pos") || r.includes(".cnt") || r.includes("img") || r.includes("svg")) {
    console.log("RULE:", r.trim() + "}");
  }
}
