#!/usr/bin/env node
/* Real-browser check (not part of npm test, needs a browser):
     npm i --no-save playwright-core
     node tests/e2e/browser-check.js            (uses installed Edge; set EC_BROWSER=chrome for Chrome)
   Serves a scratch copy of the app under a subpath, then:
   screenshots at 390x780 and 768x1024 (tests/screenshots), no horizontal scroll at 360px,
   focused input stays visible when the viewport shrinks, PWA installability, offline reload,
   and a clean update after a version bump. Prints PASS/FAIL per check and exits 1 on any failure. */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright-core');

const ROOT = path.join(__dirname, '..', '..');
const SHOTS = path.join(ROOT, 'tests', 'screenshots');
const PORT = 8765, BASE = '/ec/', URL = 'http://localhost:' + PORT + BASE;
const results = [];
function check(name, ok, info) { results.push({ name: name, ok: !!ok }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (info ? '  (' + info + ')' : '')); }

function copyApp() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ec-e2e-'));
  ['index.html', 'manifest.webmanifest', 'sw.js', 'favicon.ico', 'js', 'packs', 'icons', 'tools'].forEach(function (p) {
    fs.cpSync(path.join(ROOT, p), path.join(dir, p), { recursive: true });
  });
  return dir;
}
function serve(dir) {
  return new Promise(function (resolve) {
    const p = spawn(process.execPath, [path.join(dir, 'tools', 'serve.js'), String(PORT), '--base=' + BASE], { stdio: ['ignore', 'pipe', 'inherit'] });
    p.stdout.once('data', function () { resolve(p); });
  });
}

/* Seed two profiles with some progress, then reload so the picker shows. */
async function seed(page) {
  await page.goto(URL);
  await page.evaluate(function () {
    const EC = window.EC, st = EC.store, ls = EC.ls;
    st.updateProfile(ls, EC.profileId(), { name: 'Ayla', emoji: '🌻', color: '#0f766e' });
    const S = EC.state();
    S.name = 'Ayla'; S.xp = 340; S.streak = { last: new Date().toISOString().slice(0, 10), n: 4 }; S.days = ['2026-10-25', '2026-10-26', '2026-10-27', '2026-10-28'];
    S.units['0.1'] = { done: true, steps: { vocab: { done: true }, grammar: { done: true }, practice: { done: true }, listening: { done: true }, speaking: { done: true }, reading: { done: true }, writing: { done: true }, test: { done: true } }, test: { score: 90, pass: true } };
    S.units['0.2'] = { steps: { vocab: { done: true }, grammar: { done: true } } };
    S.skill = { vocab: { c: 18, t: 20 }, grammar: { c: 7, t: 10 }, listening: { c: 5, t: 8 }, speaking: { c: 3, t: 3 }, reading: { c: 4, t: 5 } };
    S.hist = [{ d: '2026-10-27', t: 'unit-test', id: '0.1', score: 90, pass: true }, { d: '2026-10-28', t: 'practice', id: '0.2', score: 75, pass: true }];
    st.saveProfile(ls, EC.profileId(), S);
    st.createProfile(ls, { name: 'Mert', emoji: '🚀', color: '#2563eb' }, Object.assign({}, S, { name: 'Mert', xp: 20, units: {}, streak: { last: '', n: 0 }, hist: [], skill: {} }));
  });
  await page.reload();
}
async function noHScroll(page) { return page.evaluate(function () { return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }; }); }
async function openFirst(page) { await page.locator('.pmain').first().click(); }

(async function () {
  const dir = copyApp();
  const server = await serve(dir);
  const browser = await chromium.launch({ channel: process.env.EC_BROWSER || 'msedge', headless: true });
  fs.mkdirSync(SHOTS, { recursive: true });
  try {
    /* ---------- screenshots ---------- */
    for (const vp of [{ w: 390, h: 780, tag: 'phone' }, { w: 768, h: 1024, tag: 'tablet' }]) {
      const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 2, isMobile: vp.w < 500, hasTouch: true });
      const page = await ctx.newPage();
      const errors = []; page.on('pageerror', function (e) { errors.push(e.message); });
      await seed(page);
      const shot = async function (name) { await page.waitForTimeout(150); await page.screenshot({ path: path.join(SHOTS, vp.tag + '-' + name + '.png') }); };
      await shot('1-picker');
      await openFirst(page); await shot('2-home');
      await page.evaluate(function () { window.EC.go('unit', { id: '0.2' }); }); await shot('3-unit');
      await page.locator('.step').nth(2).click(); await shot('4-quiz');
      await page.evaluate(function () { window.EC.go('progress'); }); await shot('5-progress');
      check(vp.tag + ': no page errors', errors.length === 0, errors.join('; '));
      await ctx.close();
    }

    /* ---------- 360px: no horizontal scroll on any screen ---------- */
    {
      const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      await seed(page);
      const views = [['picker', null]];
      const wide = [];
      let m = await noHScroll(page); if (m.sw > m.cw) wide.push('picker ' + m.sw);
      await openFirst(page);
      for (const v of ['home', 'path', 'homework', 'exams', 'progress', 'settings']) {
        await page.evaluate(function (n) { window.EC.go(n); }, v);
        m = await noHScroll(page); views.push(v); if (m.sw > m.cw) wide.push(v + ' ' + m.sw);
      }
      await page.evaluate(function () { window.EC.go('profileEdit', { id: window.EC.profileId() }); });
      m = await noHScroll(page); views.push('profileEdit'); if (m.sw > m.cw) wide.push('profileEdit ' + m.sw);
      /* every question of the 0.1 practice, listening, speaking and reading sets, plus the writing editor */
      for (const step of [2, 3, 4]) {
        await page.evaluate(function () { window.EC.go('unit', { id: '0.1' }); });
        await page.locator('.step').nth(step).click();
        for (let i = 0; i < 20 && await page.locator('.qhead .bar').count(); i++) {
          m = await noHScroll(page); const ty = await page.evaluate(function () { return window.EC.cur.type; });
          views.push(ty); if (m.sw > m.cw) wide.push('step' + step + ' q' + i + ' ' + ty + ' ' + m.sw);
          const btn = page.locator('.qbody .opt:not([disabled])').first();
          if (await btn.count() && ty !== 'match') await btn.click();
          else if (await page.getByText(/Söyledim|I said it/).count()) await page.getByText(/Söyledim|I said it/).first().click();
          else { const inp = page.locator('.qbody input'); if (await inp.count()) await inp.fill('x'); if (await page.locator('.actions .btn').count()) await page.locator('.actions .btn').click(); if (await page.locator('.actions .btn').count()) await page.locator('.actions .btn').click(); }
          const fb = await page.locator('.fb:not([hidden])').count();
          if (!fb) break;
          await page.locator('.actions .btn').click();
        }
      }
      await page.evaluate(function () { window.EC.go('unit', { id: '0.1' }); });
      await page.locator('.step').nth(6).click();
      m = await noHScroll(page); views.push('writing'); if (m.sw > m.cw) wide.push('writing ' + m.sw);
      check('360px: no horizontal scroll on ' + views.length + ' screens', wide.length === 0, wide.join(', ') || [...new Set(views)].join(' '));

      /* ---------- keyboard: shrink the viewport as a keyboard would, the focused field must stay visible ---------- */
      await page.evaluate(function () { window.EC.go('unit', { id: '0.1' }); });
      await page.locator('.step').nth(6).click();
      const ta = page.locator('textarea');
      await ta.focus();
      await page.setViewportSize({ width: 360, height: 360 });
      await page.waitForTimeout(500);
      const vis = await page.evaluate(function () {
        const r = document.activeElement.getBoundingClientRect(), vh = (window.visualViewport || window).height || window.innerHeight;
        const nav = document.querySelector('.nav');
        return { top: r.top, bottom: r.bottom, vh: vh, typing: document.body.classList.contains('typing'), navShown: !!nav && getComputedStyle(nav).display !== 'none' };
      });
      check('keyboard: focused field visible after the viewport shrinks', vis.top >= 0 && vis.top < vis.vh && vis.typing && !vis.navShown, JSON.stringify(vis));
      await page.setViewportSize({ width: 360, height: 740 });
      await page.evaluate(function () { window.EC.go('profiles'); });
      await page.locator('.pmain').nth(1).click();
      const who = await page.evaluate(function () { return window.EC.snapshot().split('\n')[2]; });
      check('profile switch in the browser updates the snapshot Learner line', who === 'Learner: Mert', who);
      await ctx.close();
    }

    /* ---------- landscape phone ---------- */
    {
      const ctx = await browser.newContext({ viewport: { width: 780, height: 360 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      await seed(page); await openFirst(page);
      await page.screenshot({ path: path.join(SHOTS, 'landscape-home.png') });
      await page.evaluate(function () { window.EC.go('unit', { id: '0.2' }); }); await page.locator('.step').nth(4).click();
      await page.screenshot({ path: path.join(SHOTS, 'landscape-speaking.png') });
      const m = await noHScroll(page);
      const actionsVisible = await page.evaluate(function () { const b = document.querySelector('.qbody .btn'); return !!b; });
      check('landscape 780x360: usable, no horizontal scroll', m.sw <= m.cw && actionsVisible, m.sw + '/' + m.cw);
      await ctx.close();
    }

    /* ---------- PWA: installable (needs a normal, non-incognito profile) ---------- */
    {
      const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ec-e2e-profile-'));
      const ctx = await chromium.launchPersistentContext(profileDir, { channel: process.env.EC_BROWSER || 'msedge', headless: true });
      const page = ctx.pages()[0] || await ctx.newPage();
      await page.goto(URL);
      await page.evaluate(function () { return navigator.serviceWorker.ready; });
      const cdp = await ctx.newCDPSession(page);
      const inst = await cdp.send('Page.getInstallabilityErrors');
      const man = await cdp.send('Page.getAppManifest');
      check('installable (Chromium reports no installability or manifest errors)', inst.installabilityErrors.length === 0 && man.errors.length === 0, JSON.stringify(inst.installabilityErrors.concat(man.errors)) + ' manifest ' + man.url.replace(URL, BASE));
      await ctx.close();
      fs.rmSync(profileDir, { recursive: true, force: true });
    }

    /* ---------- PWA: offline after first visit, clean update ---------- */
    {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 780 } });
      const page = await ctx.newPage();
      await page.goto(URL);
      await page.evaluate(function () { return navigator.serviceWorker.ready; });
      await page.reload();
      const controlled = await page.evaluate(function () { return !!navigator.serviceWorker.controller; });
      check('service worker controls the page under the ' + BASE + ' subpath', controlled);
      await page.evaluate(function () { window.EC.store.updateProfile(window.EC.ls, window.EC.profileId(), { name: 'Offline test' }); });

      await ctx.setOffline(true);
      await page.reload();
      const off = await page.evaluate(function () { return { ec: !!window.EC, text: document.body.textContent, chip: (document.querySelector('.net') || {}).textContent }; });
      check('offline reload works (app shell from cache)', off.ec && /Merhaba/.test(off.text), off.chip);
      check('offline indicator shows Çevrimdışı', /Çevrimdışı/.test(off.chip || ''));
      const page2 = await ctx.newPage();
      await page2.goto(URL + 'index.html');
      await page2.evaluate(function () { window.EC.go('unit', { id: '0.1' }); });
      const off2 = await page2.evaluate(function () { return document.querySelectorAll('.step').length; });
      check('offline: a new tab opens and a unit renders', off2 === 8);
      await page2.close();
      await ctx.setOffline(false);
      await page.reload();

      const swFile = path.join(dir, 'sw.js');
      const before = fs.readFileSync(swFile, 'utf8').match(/VERSION = '([^']+)'/)[1];
      fs.writeFileSync(swFile, fs.readFileSync(swFile, 'utf8').replace(/VERSION = '[^']+'/, "VERSION = '9.9.9'"));
      fs.writeFileSync(path.join(dir, 'js', 'app.js'), fs.readFileSync(path.join(dir, 'js', 'app.js'), 'utf8').replace("window.EC = {", "window.EC_BUILD = 'bumped'; window.EC = {"));
      await page.evaluate(function () { return navigator.serviceWorker.getRegistration().then(function (r) { return r.update(); }); });
      await page.waitForSelector('.update', { timeout: 15000 });
      check('version bump shows the "new version" banner', true);
      const stillOld = await page.evaluate(function () { return window.EC_BUILD === undefined; });
      check('old version keeps running until the learner taps reload', stillOld);
      await Promise.all([page.waitForEvent('load', { timeout: 15000 }), page.locator('.update button').click()]);
      const after = await page.evaluate(function () { return caches.keys().then(function (k) { return { keys: k, build: window.EC_BUILD, name: window.EC.store.meta(window.EC.ls, window.EC.profileId()).name }; }); });
      check('after reload: new code runs, only the new cache remains, data kept', after.build === 'bumped' && after.keys.join() === 'ec-9.9.9' && after.name === 'Offline test', JSON.stringify(after) + ' (was ' + before + ')');
      await ctx.close();
    }
  } catch (e) {
    check('script error: ' + e.message, false);
  } finally {
    await browser.close();
    server.kill();
    fs.rmSync(dir, { recursive: true, force: true });
  }
  const failed = results.filter(function (r) { return !r.ok; }).length;
  console.log('\n' + (results.length - failed) + '/' + results.length + ' checks passed. Screenshots: ' + path.relative(ROOT, SHOTS));
  process.exit(failed ? 1 : 0);
})();
