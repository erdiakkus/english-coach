/* Backup export and import, shared content packs, and the snapshot Learner line. */
const test = require('node:test');
const assert = require('node:assert');
const { boot, doUnit, readPack } = require('./helpers');

const INDEX = 'ec_index_v2';
const tick = function (ms) { return new Promise(function (r) { setTimeout(r, ms || 20); }); };

function readBlob(d, blob) {
  return new Promise(function (resolve) { const fr = new d.win.FileReader(); fr.onload = function () { resolve(JSON.parse(fr.result)); }; fr.readAsText(blob); });
}
async function exportVia(d, key) {
  d.EC.go('settings');
  d.click(new RegExp(d.t(key).replace(/[()]/g, '.') + '$'));
  return readBlob(d, d.win.lastBlob);
}
async function upload(d, role, text) {
  d.EC.go('settings');
  const inp = d.doc.querySelector('input[data-role="' + role + '"]');
  Object.defineProperty(inp, 'files', { value: [new d.win.File([text], 'f.json', { type: 'application/json' })] });
  inp.dispatchEvent(new d.win.Event('change'));
  await tick();
}
function names(d) { return d.json(INDEX).profiles.map(function (p) { return p.name; }); }

test('export active profile and export all', async function () {
  const d = await boot();
  doUnit(d, '0.1');
  const one = await exportVia(d, 'backupOne');
  assert.equal(one.app, 'english-coach'); assert.equal(one.kind, 'profile'); assert.equal(one.version, 2);
  assert.equal(one.profile.name, 'Profile 1');
  assert.ok(one.state.units['0.1'].done);
  assert.ok(!('packs' in one.state));
  assert.match(d.win.lastDownload, /^english-coach-profile-1-\d{4}-\d{2}-\d{2}\.json$/);
  d.EC.go('profileEdit', {}); d.doc.querySelector('input.typedin').value = 'Mert'; d.click(d.t('create'));
  const all = await exportVia(d, 'backupAll');
  assert.equal(all.kind, 'all');
  assert.deepEqual(all.profiles.map(function (x) { return x.profile.name; }), ['Profile 1', 'Mert']);
});

test('import a profile backup as a new profile', async function () {
  const src = await boot();
  doUnit(src, '0.1');
  const file = JSON.stringify(await exportVia(src, 'backupOne'));
  const d = await boot();
  await upload(d, 'restore', file);
  assert.ok(d.text().indexOf('Profile 1') >= 0, 'summary lists the profile');
  d.click(d.t('addAsNew'));
  assert.deepEqual(names(d), ['Profile 1', 'Profile 1 (2)']);
  const added = d.json(INDEX).profiles[1].id;
  assert.ok(d.json('ec_profile_' + added).units['0.1'].done);
  assert.match(d.text(), new RegExp(d.t('whoLearning')));
});

test('import a profile backup replacing an existing profile', async function () {
  const src = await boot();
  doUnit(src, '0.1');
  src.EC.go('profileEdit', { id: src.EC.profileId() }); src.doc.querySelector('input.typedin').value = 'Ayla'; src.click(src.t('saveWriting'));
  const file = JSON.stringify(await exportVia(src, 'backupOne'));
  const d = await boot();
  const keep = d.EC.profileId();
  d.EC.go('profileEdit', {}); d.doc.querySelector('input.typedin').value = 'Mert'; d.click(d.t('create'));
  const mert = d.EC.profileId();
  await upload(d, 'restore', file);
  d.doc.querySelector('select').value = mert;
  d.click(d.t('replaceGo'));
  const idx = d.json(INDEX);
  assert.equal(idx.profiles.length, 2);
  assert.deepEqual(names(d), ['Profile 1', 'Ayla'], 'replaced profile takes the backup name');
  assert.equal(idx.profiles[1].id, mert, 'id kept');
  assert.ok(d.EC.state().units['0.1'].done, 'active profile state reloaded');
  assert.deepEqual(d.json('ec_profile_' + keep).units, {}, 'other profile untouched');
});

test('import an all-profiles backup: add all, or replace matching ids', async function () {
  const d = await boot();
  d.EC.go('profileEdit', {}); d.doc.querySelector('input.typedin').value = 'Mert'; d.click(d.t('create'));
  const all = await exportVia(d, 'backupAll');
  all.profiles[1].state.xp = 999;
  await upload(d, 'restore', JSON.stringify(all));
  d.click(d.t('replaceSame'));
  assert.deepEqual(names(d), ['Profile 1', 'Mert']);
  assert.equal(d.json('ec_profile_' + all.profiles[1].profile.id).xp, 999);
  await upload(d, 'restore', JSON.stringify(all));
  d.click(d.t('addAllNew'));
  assert.deepEqual(names(d), ['Profile 1', 'Mert', 'Profile 1 (2)', 'Mert (2)']);
});

test('a v1 backup file (old app) imports as a profile', async function () {
  const old = { v: 1, name: 'Elif', lang: 'tr', units: { '0.1': { done: true, steps: {} } }, srs: {}, hist: [], xp: 40, days: [], streak: { last: '', n: 0 }, mistakes: [], skill: {}, writings: [], exams: {}, packs: [readPack()] };
  const d = await boot();
  await upload(d, 'restore', JSON.stringify(old));
  d.click(d.t('addAsNew'));
  assert.deepEqual(names(d), ['Profile 1', 'Elif']);
  assert.equal(d.json('ec_packs_v2').length, 1, 'packs from the backup become shared');
});

test('unknown or damaged files are rejected with a clear message and change nothing', async function () {
  const d = await boot();
  const before = JSON.stringify(d.storage());
  const cases = [
    ['{nope', 'errNotJson'],
    ['{"foo":1}', 'errUnknownShape'],
    ['[1,2,3]', 'errUnknownShape'],
    [JSON.stringify(readPack()), 'errUnknownShape'],
    [JSON.stringify({ app: 'english-coach', kind: 'profile', version: 2, profile: { name: 'X' }, state: { units: [], srs: {}, hist: [], xp: 0 } }), 'errBadState'],
    [JSON.stringify({ app: 'english-coach', kind: 'all', version: 3, profiles: [] }), 'errUnknownShape']
  ];
  for (const c of cases) {
    await upload(d, 'restore', c[0]);
    const msg = d.doc.querySelector('.fb.bad');
    assert.ok(msg && msg.textContent.indexOf(d.t(c[1])) === 0, c[1] + ' for ' + c[0].slice(0, 30) + ' got ' + (msg && msg.textContent));
    if (c[1] === 'errBadState') assert.match(msg.textContent, /units/, 'damaged state names the bad field');
  }
  assert.equal(JSON.stringify(d.storage()), before);
});

test('content packs are shared by all profiles and survive a reload', async function () {
  const d = await boot();
  await upload(d, 'pack', JSON.stringify(readPack()));
  assert.equal(d.json('ec_packs_v2').length, 1);
  d.EC.go('profileEdit', {}); d.doc.querySelector('input.typedin').value = 'Mert'; d.click(d.t('create'));
  assert.ok(!('packs' in d.json('ec_profile_' + d.EC.profileId())));
  const d2 = await boot({ storage: d.storage() });
  d2.doc.querySelector('.pmain').click();
  d2.EC.go('path');
  const row = Array.prototype.slice.call(d2.doc.querySelectorAll('.unit')).filter(function (b) { return b.textContent.indexOf('4.1') === 0; })[0];
  assert.ok(row.textContent.indexOf(d2.t('soon')) < 0);
});

test('snapshot has a Learner line after Date and keeps the rest of the format', async function () {
  const d = await boot();
  d.EC.go('profileEdit', { id: d.EC.profileId() }); d.doc.querySelector('input.typedin').value = 'Ayla'; d.click(d.t('saveWriting'));
  d.doc.querySelector('[data-pid]').click();
  const lines = d.EC.snapshot().split('\n');
  assert.equal(lines[0], 'PROGRESS SNAPSHOT (from the English Coach app)');
  assert.match(lines[1], /^Date: /);
  assert.equal(lines[2], 'Learner: Ayla');
  assert.match(lines[3], /^Stage and unit: /);
  assert.equal(lines.length, 12);
  d.EC.go('progress');
  assert.ok(d.doc.querySelector('pre.snap').textContent.indexOf('Learner: Ayla') > 0);
});
