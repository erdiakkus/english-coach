/* PWA: manifest, icons, service worker precache list, relative URLs and the update banner. */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { boot, ROOT } = require('./helpers');

function swAssets() {
  const ctx = { self: { addEventListener: function () {} } };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8'), ctx);
  return { assets: ctx.ASSETS, version: ctx.VERSION };
}
function list(dir, re) { return fs.readdirSync(path.join(ROOT, dir)).filter(function (f) { return re.test(f); }).map(function (f) { return dir + '/' + f; }); }
function pngSize(file) { const b = fs.readFileSync(path.join(ROOT, file)); assert.equal(b.toString('ascii', 1, 4), 'PNG'); return b.readUInt32BE(16) + 'x' + b.readUInt32BE(20); }

test('service worker precaches every app file and nothing that is missing', function () {
  const sw = swAssets();
  assert.match(sw.version, /^\d+\.\d+\.\d+$/);
  const app = ['index.html', 'manifest.webmanifest', 'favicon.ico'].concat(list('js', /\.js$/), list('packs', /\.json$/), list('icons', /\.png$/));
  app.forEach(function (f) { assert.ok(sw.assets.indexOf(f) >= 0, f + ' missing from sw.js ASSETS'); });
  assert.ok(sw.assets.indexOf('./') >= 0);
  sw.assets.filter(function (a) { return a !== './'; }).forEach(function (a) { assert.ok(fs.existsSync(path.join(ROOT, a)), a + ' listed but not on disk'); });
});

test('manifest is complete and its icons have the declared sizes', function () {
  const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.webmanifest'), 'utf8'));
  assert.equal(m.short_name, 'English Coach');
  assert.equal(m.display, 'standalone');
  assert.equal(m.start_url, './'); assert.equal(m.scope, './');
  const css = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.ok(css.indexOf('--bg:' + m.background_color) >= 0, 'background matches CSS --bg');
  assert.ok(css.indexOf('--accent:' + m.theme_color) >= 0, 'theme matches CSS --accent');
  m.icons.forEach(function (i) { assert.equal(pngSize(i.src), i.sizes, i.src); });
  assert.ok(m.icons.some(function (i) { return i.purpose === 'maskable' && i.sizes === '512x512'; }));
  assert.equal(pngSize('icons/apple-touch-icon.png'), '180x180');
  assert.equal(fs.readFileSync(path.join(ROOT, 'favicon.ico')).readUInt16LE(2), 1, 'favicon.ico is an icon file');
});

test('all URLs are relative so the app works in a subpath', function () {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const refs = []; html.replace(/(?:href|src)="([^"]+)"/g, function (m, u) { refs.push(u); });
  assert.ok(refs.length >= 6);
  refs.forEach(function (u) { assert.ok(!/^(\/|https?:)/.test(u), 'absolute URL in index.html: ' + u); assert.ok(fs.existsSync(path.join(ROOT, u)), u + ' exists'); });
  swAssets().assets.forEach(function (a) { assert.ok(!/^(\/|https?:)/.test(a), 'absolute URL in sw.js: ' + a); });
  const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.webmanifest'), 'utf8'));
  [m.start_url, m.scope].concat(m.icons.map(function (i) { return i.src; })).forEach(function (u) { assert.ok(!/^(\/|https?:)/.test(u), u); });
  assert.ok(fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8').indexOf("register('sw.js')") >= 0);
});

function fakeSw(hasController) {
  const posted = [], listeners = {};
  const reg = { waiting: { postMessage: function (m) { posted.push(m); } }, addEventListener: function () {}, update: function () { return Promise.resolve(); } };
  return {
    posted: posted, listeners: listeners,
    sw: { controller: hasController ? {} : null, register: function (u) { this.url = u; return Promise.resolve(reg); }, addEventListener: function (t, f) { listeners[t] = f; } }
  };
}

test('a waiting service worker shows the reload banner, which activates it', async function () {
  const f = fakeSw(true);
  const d = await boot({ sw: f.sw });
  await new Promise(function (r) { setTimeout(r, 10); });
  assert.equal(f.sw.url, 'sw.js');
  const bar = d.doc.querySelector('.update');
  assert.ok(bar, 'banner shown');
  assert.match(bar.textContent, /Yeni sürüm/);
  bar.querySelector('button').click();
  assert.deepEqual(f.posted, [{ type: 'SKIP_WAITING' }]);
  d.EC.go('path');
  assert.ok(d.doc.querySelector('.update'), 'banner survives re-render');
});

test('first install (no controller yet) shows no banner', async function () {
  const f = fakeSw(false);
  const d = await boot({ sw: f.sw });
  await new Promise(function (r) { setTimeout(r, 10); });
  assert.equal(d.doc.querySelector('.update'), null);
});
