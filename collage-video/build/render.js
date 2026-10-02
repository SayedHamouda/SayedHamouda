// Usage: node build/render.js stills 1.0 2.5 ...   |   node build/render.js video out.mp4 [fps]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
(async () => {
  const [mode, ...args] = process.argv.slice(2);
  const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-lcd-text'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGEERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await page.goto('http://127.0.0.1:8767/index.html?render');
  await page.evaluate(() => window.ready);
  await page.waitForTimeout(300);
  if (mode === 'stills') {
    for (const t of args) {
      await page.evaluate(t => window.seek(+t), t);
      await page.screenshot({ path: `build/frames/still_${t}.jpg`, type: 'jpeg', quality: 85 });
    }
  } else {
    const out = args[0], fps = +(args[1] || 30), DUR = await page.evaluate(() => window.DUR);
    const ff = spawn(FFMPEG, ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const N = Math.round(DUR * fps);
    for (let i = 0; i < N; i++) {
      await page.evaluate(t => window.seek(t), i / fps);
      const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 90 === 0) console.log(`frame ${i}/${N}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
