import fs from "node:fs";

const content = fs.readFileSync("src/components/sections/platform-radar-script.ts", "utf8");

// Search for HTML inside TEMPLATE
const styleEnd = content.indexOf("</style>");
const templateEnd = content.indexOf("`;\n\nfunction init");
console.log("=== HTML INSIDE TEMPLATE ===");
console.log(content.slice(styleEnd + 8, templateEnd));
