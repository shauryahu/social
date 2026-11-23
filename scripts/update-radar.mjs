import fs from "node:fs";

let c = fs.readFileSync("src/components/sections/platform-radar-script.ts", "utf8");

const before1 = ".cnt{position:absolute;left:0;top:0;width:0;height:0;opacity:0;";
const after1 = ".cnt{position:absolute;left:0;top:0;width:0;height:0;opacity:1;";
if (!c.includes(before1)) {
  console.error("before1 not found");
  process.exit(1);
}
c = c.replace(before1, after1);

const before2 = "io.observe(wrap);";
const after2 = "io.observe(host);\\n        io.observe(wrap);\\n      setTimeout(start, 500);";
if (!c.includes(before2)) {
  console.error("before2 not found");
  process.exit(1);
}
c = c.replace(before2, after2);

fs.writeFileSync("src/components/sections/platform-radar-script.ts", c, "utf8");
console.log("REPLACED RADAR SCRIPT OK");
