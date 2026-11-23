import fs from 'node:fs';

const radarScript = fs.readFileSync('src/components/sections/platform-radar-script.ts', 'utf8');
const restoScript = fs.readFileSync('src/components/sections/restoration-script.ts', 'utf8');

function extractStyles(src, name) {
  const match = src.match(/<style>([\s\S]*?)<\/style>/);
  if (match) {
    fs.writeFileSync(`scripts/${name}.css`, match[1]);
    console.log(`Extracted ${name}.css (${match[1].length} chars)`);
  } else {
    console.log(`No style tag found in ${name}`);
  }
}

extractStyles(radarScript, 'radar-extracted');
extractStyles(restoScript, 'restoration-extracted');
