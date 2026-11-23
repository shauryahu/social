import fs from "node:fs";

const content = fs.readFileSync("src/components/sections/platform-radar-script.ts", "utf8");

const imgStart = content.indexOf('var IMG = {');
const imgEnd = content.indexOf('};\n\n/* Telegram, Discord');
const imgJsonStr = content.slice(imgStart + 10, imgEnd + 1);

const IMG = JSON.parse(imgJsonStr);
console.log("Keys in IMG:", Object.keys(IMG));
for (const [k, v] of Object.entries(IMG)) {
  console.log(k, "starts with data:image?", v.startsWith("data:image/"), "length:", v.length);
  const base64Part = v.split(",")[1];
  const buf = Buffer.from(base64Part, "base64");
  console.log("  buffer size:", buf.length, "header:", buf.slice(0, 12).toString("utf8"));
}
