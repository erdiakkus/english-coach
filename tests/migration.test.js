/* v1 to v2 migration: the old single-state key becomes the first profile and is never removed. */
const test = require('node:test');
const assert = require('node:assert');
const { boot, readPack } = require('./helpers');

const V1 = 'english_coach_v1', INDEX = 'ec_index_v2', PACKS = 'ec_packs_v2';

function v1State(extra) {
  return Object.assign({
    v: 1, name: 'Ayla', lang: 'en', rate: 0.8, voice: '', created: '2026-03-01', placed: { band: 0, start: '1.1', d: '2026-03-01' },
    units: { '0.1': { skipped: true, steps: {} }, '1.1': { steps: { vocab: { done: true, score: 90, d: '2026-03-02' } } } },
    srs: { '1.1:hello': { en: 'hello', tr: 'merhaba', u: '1.1', box: 3, due: '2026-04-01', seen: 4, wrong: 0, added: '2026-03-02' } },
    mistakes: [], skill: { vocab: { c: 9, t: 10 } }, hist: [{ d: '2026-03-02', t: 'vocab', id: '1.1', title: '', score: 90, pass: true }],
    xp: 120, days: ['2026-03-01', '2026-03-02'], streak: { last: '2026-03-02', n: 2 }, hw: null,
    writings: [{ d: '2026-03-02', unit: '1.1', stage: '', text: 'Hello.', words: 1 }], exams: {}, packs: [readPack()]
  }, extra || {});
}

test('v1 progress becomes the first profile and the old key stays untouched', async function () {
  const raw = JSON.stringify(v1State());
  const d = await boot({ storage: { [V1]: raw } });
  const idx = d.json(INDEX);
  assert.equal(idx.profiles.length, 1);
  assert.equal(idx.profiles[0].name, 'Ayla');
  assert.equal(idx.active, idx.profiles[0].id);
  const prof = d.json('ec_profile_' + idx.profiles[0].id);
  assert.equal(prof.xp, 120);
  assert.equal(prof.srs['1.1:hello'].box, 3);
  assert.equal(prof.streak.n, 2);
  assert.equal(prof.writings.length, 1);
  assert.ok(!('packs' in prof), 'packs moved out of the profile');
  assert.equal(d.json(PACKS).length, 1);
  assert.equal(d.win.localStorage.getItem(V1), raw, 'v1 key is byte-identical');
  assert.equal(d.EC.state().lang, 'en', 'per-profile UI language kept');
  assert.match(d.text(), /Hello, Ayla/);
  d.EC.go('path');
  const row = Array.prototype.slice.call(d.doc.querySelectorAll('.unit')).filter(function (b) { return b.textContent.indexOf('4.1') === 0; })[0];
  assert.ok(row.textContent.indexOf('Coming soon') < 0, 'shared pack merged on boot');
});

test('v1 state without a name becomes "Profile 1"', async function () {
  const d = await boot({ storage: { [V1]: v1State({ name: '' }) } });
  assert.equal(d.json(INDEX).profiles[0].name, 'Profile 1');
});

test('migration runs once: a second boot does not duplicate the profile', async function () {
  const d1 = await boot({ storage: { [V1]: v1State() } });
  d1.EC.state().xp = 500;
  d1.EC.store.saveProfile(d1.EC.ls, d1.EC.profileId(), d1.EC.state());
  const d2 = await boot({ storage: d1.storage() });
  assert.equal(d2.json(INDEX).profiles.length, 1);
  assert.equal(d2.EC.state().xp, 500, 'v2 data wins over the old v1 key');
  assert.ok(d2.win.localStorage.getItem(V1));
});

test('corrupt v1 data is left alone and a fresh profile is created', async function () {
  const d = await boot({ storage: { [V1]: '{not json' } });
  assert.equal(d.json(INDEX).profiles.length, 1);
  assert.equal(d.EC.state().xp, 0);
  assert.equal(d.win.localStorage.getItem(V1), '{not json');
});

test('fresh install creates one profile and never writes the v1 key', async function () {
  const d = await boot();
  assert.equal(d.json(INDEX).profiles.length, 1);
  assert.equal(d.win.localStorage.getItem(V1), null);
  d.click(d.t('placementCta'));
  d.finishQuiz(false);
  assert.equal(d.win.localStorage.getItem(V1), null);
  assert.equal(d.json('ec_profile_' + d.EC.profileId()).placed.start, '0.1');
});
