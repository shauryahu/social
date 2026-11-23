import fs from "node:fs";

const content = fs.readFileSync("src/components/sections/platform-radar-script.ts", "utf8");

const wrapIdx = content.indexOf('class="wrap');
console.log("wrap HTML index:", wrapIdx);
if (wrapIdx !== -1) {
  console.log(content.slice(wrapIdx - 50, wrapIdx + 300));
}

const inCssIdx = content.indexOf(".in .cnt");
console.log(".in .cnt index:", inCssIdx);
if (inCssIdx !== -1) {
  console.log(content.slice(inCssIdx - 100, inCssIdx + 200));
}
