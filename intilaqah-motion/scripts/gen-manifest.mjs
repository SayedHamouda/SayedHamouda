// Lists the exported Figma assets that exist in /public so scenes can fall back
// to drawn placeholders for anything not exported yet.
import {readdirSync, writeFileSync, existsSync} from 'node:fs';

const dirs = ["screens", "brand", "ds", "audio"];
const files = [];
for (const d of dirs) {
  const p = new URL(`../public/${d}`, import.meta.url);
  if (!existsSync(p)) continue;
  for (const f of readdirSync(p)) if (!f.startsWith('.')) files.push(`${d}/${f}`);
}
writeFileSync(new URL('../src/manifest.json', import.meta.url), JSON.stringify(files.sort(), null, 2) + '\n');
console.log(`manifest: ${files.length} files`);
