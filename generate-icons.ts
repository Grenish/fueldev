import fs from "fs";
import path from "path";

const iconsDir = path.resolve("public/icons");
const indexFile = path.join(iconsDir, "index.ts");

function capitalizeFirstLetter(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function generateExports() {
  const files = fs
    .readdirSync(iconsDir)
    .filter((file) => file.endsWith(".svg"));

  const exports = files
    .map((file) => {
      const rawName = path.basename(file, ".svg");
      const name = capitalizeFirstLetter(rawName);
      return `export { default as ${name} } from "./${file}";`;
    })
    .join("\n");

  fs.writeFileSync(indexFile, exports + "\n");
  console.log(
    `✅ Generated ${files.length} icon exports in src/icons/index.ts`,
  );
}

generateExports();
