import { execSync } from "node:child_process";

const bakDir = "C:/Users/USER/.gemini/antigravity/brain/da496d37-3ff2-4b7f-9011-fb4d0e692a91/scratch/backup-pre-5fixes";
for (const [bakFile, curFile] of [
  [bakDir + "/Navbar.tsx", "src/components/Navbar.tsx"],
  [bakDir + "/globals.css", "src/app/globals.css"],
  [bakDir + "/theme-dark.css", "public/theme-dark.css"]
]) {
  console.log("==================================================");
  console.log("DIFF FOR " + curFile);
  console.log("==================================================");
  try {
    const diff = execSync(`git diff --no-index "${bakFile}" "${curFile}"`, { encoding: "utf8" });
    console.log(diff || "No differences");
  } catch (err) {
    console.log(err.stdout || err.message);
  }
}
