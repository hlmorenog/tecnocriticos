// Uso: node cuadros.js archivo.html salida [t1,t2,... | auto]
const { chromium } = require('playwright'); const fs = require('fs');
const [archivo, salida, muestras] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const err = []; p.on('pageerror', (e) => err.push(e.message));
  await p.goto('file://' + process.cwd() + '/' + archivo); await p.waitForTimeout(2500);
  const dur = await p.evaluate(() => window.DURACION);
  if (muestras) {
    for (const [i, t] of muestras.split(',').map(Number).entries()) { await p.evaluate((t) => window.render(t), t); await p.screenshot({ path: `${salida}-m${String(i).padStart(2, '0')}.png` }); }
  } else {
    fs.rmSync(`c-${salida}`, { recursive: true, force: true }); fs.mkdirSync(`c-${salida}`);
    for (let i = 0; i < Math.ceil(dur * 30); i++) { await p.evaluate((t) => window.render(t), i / 30); await p.screenshot({ path: `c-${salida}/c${String(i).padStart(5, '0')}.png` }); }
  }
  console.log('duración', dur, 'errores', err); await b.close();
})();
