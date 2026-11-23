import fs from "node:fs";

const content = fs.readFileSync("src/components/sections/platform-radar-script.ts", "utf8");

// Look for image/icon styles inside TEMPLATE
const imgStyleIdx = content.indexOf(".tile img");
if (imgStyleIdx !== -1) {
  console.log("=== TILE IMG CSS ===");
  console.log(content.slice(imgStyleIdx - 50, imgStyleIdx + 300));
}

// Check how SVG is defined
const svgDefIdx = content.indexOf("function svg(");
if (svgDefIdx !== -1) {
  console.log("=== SVG & IMG FUNCS ===");
  console.log(content.slice(svgDefIdx - 50, svgDefIdx + 300));
}

// Check what happens in build/init
const buildIdx = content.indexOf("/* ---------- build ---------- */");
if (buildIdx !== -1) {
  console.log("=== BUILD BLOCK ===");
  console.log(content.slice(buildIdx, buildIdx + 1200));
}
