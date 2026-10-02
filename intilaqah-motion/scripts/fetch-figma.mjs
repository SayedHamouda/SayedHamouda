// Exports the Asset Manifest frames from Figma into /public using the REST API.
// Usage: FIGMA_TOKEN=xxxx node scripts/fetch-figma.mjs
// (Personal access token: Figma → Settings → Security → Personal access tokens, scope "File content: read")
import {mkdirSync, writeFileSync} from 'node:fs';

const FILE = 'UAwhvxrMQRytR7ZpQG9vCq';
const token = process.env.FIGMA_TOKEN;
if (!token) throw new Error('Set FIGMA_TOKEN');

// [path under /public, node id, scale]
const ASSETS = [
  ['screens/m-login.png', '8024:5156', 2],
  ['screens/m-whatsapp.png', '8024:5343', 2],
  ['screens/d-login.png', '8375:60380', 1],
  ['screens/m-path.png', '7830:280080', 2],
  ['screens/d-path.png', '7830:3195', 1],
  ['screens/m-trial.png', '8944:69644', 2],
  ['screens/d-trial.png', '8944:69301', 1],
  ['screens/m-lesson-video.png', '8186:11301', 2],
  ['screens/m-lesson-card.png', '8186:11363', 2],
  ['screens/m-lesson-quiz.png', '8186:11448', 2],
  ['screens/d-lesson-quiz.png', '8841:49560', 1],
  ['screens/m-challenge-intro.png', '7686:10519', 2],
  ['screens/m-challenge-q.png', '8226:12579', 2],
  ['screens/m-100.png', '8916:50544', 2],
  ['screens/d-100.png', '8923:56750', 1],
  ['screens/m-leaderboard.png', '8209:134064', 2],
  ['screens/m-sharecard.png', '8209:133968', 2],
  ['screens/d-store.png', '8929:62209', 1],
  ['screens/m-pay.png', '8954:359651', 2],
  ['screens/d-pay-visa.png', '8965:70536', 1],
];

const api = (p) => fetch(`https://api.figma.com/v1/${p}`, {headers: {'X-Figma-Token': token}}).then((r) => r.json());

for (const scale of [1, 2]) {
  const group = ASSETS.filter((a) => a[2] === scale);
  const ids = group.map((a) => a[1]).join(',');
  const res = await api(`images/${FILE}?ids=${encodeURIComponent(ids)}&format=png&scale=${scale}`);
  if (res.err) throw new Error(res.err);
  for (const [path, id] of group) {
    const url = res.images[id];
    if (!url) {
      console.warn('no render for', id, path);
      continue;
    }
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    mkdirSync(new URL(`../public/${path.split('/')[0]}`, import.meta.url), {recursive: true});
    writeFileSync(new URL(`../public/${path}`, import.meta.url), buf);
    console.log('✓', path, `${Math.round(buf.length / 1024)} KB`);
  }
}
console.log('Done. Mascot/logo/DS boards: export manually into public/brand and public/ds (see README).');
