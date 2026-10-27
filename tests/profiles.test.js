/* Profiles: picker, create, switch, rename, delete, and per-profile data isolation. */
const test = require('node:test');
const assert = require('node:assert');
const { boot, doUnit } = require('./helpers');

const INDEX = 'ec_index_v2';

/* Create a profile through the UI and land on its home screen. */
function createViaUi(d, name, emojiIdx, colourIdx) {
  d.EC.go('profiles');
  d.click(new RegExp(d.t('addProfile') + '$'));
  d.doc.querySelector('input.typedin').value = name;
  const sw = d.doc.querySelectorAll('.swatches');
  if (emojiIdx !== undefined) sw[0].querySelectorAll('.sw')[emojiIdx].click();
  if (colourIdx !== undefined) d.doc.querySelectorAll('.swatches')[1].querySelectorAll('.sw')[colourIdx].click();
  d.click(d.t('create'));
}
function pick(d, name) {
  d.EC.go('profiles');
  const id = d.json(INDEX).profiles.filter(function (p) { return p.name === name; })[0].id;
  d.doc.querySelector('[data-pid="' + id + '"]').click();
  return id;
}

test('single profile opens directly; two profiles show the picker on launch', async function () {
  const d = await boot();
  assert.ok(d.doc.querySelector('.nav'), 'home with nav');
  createViaUi(d, 'Mert', 3, 2);
  const idx = d.json(INDEX);
  assert.equal(idx.profiles.length, 2);
  const mert = idx.profiles[1];
  assert.deepEqual([mert.name, mert.emoji, mert.color], ['Mert', d.EC.store.EMOJIS[3], d.EC.store.COLORS[2]]);
  assert.equal(d.EC.profileId(), mert.id, 'new profile becomes active');
  assert.match(d.text(), /Merhaba, Mert/);
  const me = d.doc.querySelector('.topbar .me');
  assert.equal(me.textContent, d.EC.store.EMOJIS[3]);

  const d2 = await boot({ storage: d.storage() });
  assert.match(d2.text(), new RegExp(d2.t('whoLearning')));
  assert.equal(d2.doc.querySelectorAll('.pmain').length, 2);
  assert.ok(!d2.doc.querySelector('.nav'), 'picker has no bottom nav');
  assert.match(d2.doc.querySelector('[data-pid="' + mert.id + '"]').textContent, /Mert.*0\/\d+/);
});

test('topbar avatar opens the picker and switching changes the active profile', async function () {
  const d = await boot();
  const first = d.EC.profileId();
  createViaUi(d, 'Mert');
  d.doc.querySelector('.topbar .me').click();
  assert.match(d.text(), new RegExp(d.t('whoLearning')));
  d.doc.querySelector('[data-pid="' + first + '"]').click();
  assert.equal(d.EC.profileId(), first);
  assert.equal(d.json(INDEX).active, first);
});

test('rename and change emoji/colour; state name follows the profile name', async function () {
  const d = await boot();
  const id = d.EC.profileId();
  d.EC.go('profileEdit', { id: id });
  d.doc.querySelector('input.typedin').value = 'Ayla';
  d.doc.querySelectorAll('.swatches')[0].querySelectorAll('.sw')[5].click();
  d.doc.querySelectorAll('.swatches')[1].querySelectorAll('.sw')[4].click();
  d.click(d.t('saveWriting'));
  const m = d.json(INDEX).profiles[0];
  assert.deepEqual([m.name, m.emoji, m.color], ['Ayla', d.EC.store.EMOJIS[5], d.EC.store.COLORS[4]]);
  assert.equal(d.EC.state().name, 'Ayla');
  assert.equal(d.json('ec_profile_' + id).name, 'Ayla');
  d.EC.go('profileEdit', { id: id });
  d.doc.querySelector('input.typedin').value = '   ';
  d.click(d.t('saveWriting'));
  assert.equal(d.json(INDEX).profiles[0].name, 'Ayla', 'blank name rejected');
});

test('duplicate names get a suffix', async function () {
  const d = await boot();
  d.EC.go('profileEdit', { id: d.EC.profileId() });
  d.doc.querySelector('input.typedin').value = 'Ayla';
  d.click(d.t('saveWriting'));
  createViaUi(d, 'ayla');
  assert.equal(d.json(INDEX).profiles[1].name, 'ayla (2)');
});

test('delete needs the exact profile name typed, then removes the data', async function () {
  const d = await boot();
  createViaUi(d, 'Mert');
  const mert = d.EC.profileId();
  assert.ok(d.json('ec_profile_' + mert));
  d.EC.go('profileDelete', { id: mert });
  const del = d.buttons().filter(function (b) { return b.textContent === d.t('deleteGo'); })[0];
  const inp = d.doc.querySelector('input.typedin');
  assert.ok(del.disabled);
  inp.value = 'mert'; inp.dispatchEvent(new d.win.Event('input'));
  assert.ok(del.disabled, 'case must match');
  inp.value = 'Mert'; inp.dispatchEvent(new d.win.Event('input'));
  assert.ok(!del.disabled);
  del.click();
  assert.equal(d.json('ec_profile_' + mert), null);
  assert.equal(d.json(INDEX).profiles.length, 1);
  assert.notEqual(d.EC.profileId(), mert, 'switched to the remaining profile');
  assert.ok(d.doc.querySelector('.nav'), 'only one left, so it opens directly');
});

test('deleting the last profile starts a fresh one', async function () {
  const d = await boot();
  const id = d.EC.profileId();
  d.EC.state().xp = 77; d.EC.store.saveProfile(d.EC.ls, id, d.EC.state());
  d.EC.go('profileDelete', { id: id });
  const inp = d.doc.querySelector('input.typedin');
  inp.value = 'Profile 1'; inp.dispatchEvent(new d.win.Event('input'));
  d.click(d.t('deleteGo'));
  assert.equal(d.json(INDEX).profiles.length, 1);
  assert.notEqual(d.EC.profileId(), id);
  assert.equal(d.EC.state().xp, 0);
});

test('two profiles keep separate progress, streak, SRS, homework, exams and writings', async function () {
  const d = await boot();
  const a = d.EC.profileId();
  doUnit(d, '0.1');
  d.EC.go('homework');
  d.EC.state().exams.S0 = { d: '2026-10-01', a: 90, speak: 3, speakN: 3, writing: true, passed: true };
  d.EC.go('home');
  const snapA = JSON.stringify(d.EC.state());
  const before = JSON.parse(snapA);
  assert.ok(before.units['0.1'].done && before.streak.n === 1 && Object.keys(before.srs).length && before.hw && before.writings.length);

  createViaUi(d, 'Mert');
  const S = d.EC.state();
  assert.deepEqual([S.units, S.srs, S.exams, S.writings, S.hist, S.xp, S.streak.n, S.hw], [{}, {}, {}, [], [], 0, 0, null]);
  d.click(d.t('placementCta'));
  d.finishQuiz(false);
  d.EC.go('homework');
  assert.equal(d.EC.state().placed.start, '0.1');

  const b = d.EC.profileId();
  pick(d, 'Profile 1');
  assert.equal(d.EC.profileId(), a);
  const A = d.EC.state();
  assert.equal(A.placed, null, 'B placement did not leak into A');
  assert.equal(JSON.stringify(A), snapA, 'A unchanged');
  assert.deepEqual(d.json('ec_profile_' + b).hist.map(function (x) { return x.t; }), ['placement']);
  assert.ok(!A.hist.some(function (x) { return x.t === 'placement'; }));
  assert.equal(d.json('ec_profile_' + b).writings.length, 0);
  const hwB = d.json('ec_profile_' + b).hw.tasks.map(function (x) { return x.id; });
  assert.ok(hwB.indexOf('review') < 0, 'B has no SRS words, so no review task: ' + hwB);
  assert.ok(hwB.indexOf('mistakes') >= 0, 'B homework comes from its own placement mistakes');
  assert.ok(!A.mistakes.length, 'B mistakes did not leak into A');
});

test('per-profile settings: language, rate and voice', async function () {
  const d = await boot();
  d.EC.go('settings');
  const sel = d.doc.querySelectorAll('select');
  sel[0].value = 'en';
  d.doc.querySelector('input[type=range]').value = '0.7';
  d.click(d.t('saveWriting'));
  assert.equal(d.EC.state().lang, 'en');
  createViaUi(d, 'Mert');
  assert.equal(d.EC.state().lang, 'tr', 'new profile uses the Turkish default');
  assert.match(d.text(), /Merhaba/);
  pick(d, 'Profile 1');
  assert.equal(d.EC.state().rate, 0.7);
  assert.match(d.text(), /Hello/);
});

test('settings shows the local data note', async function () {
  const d = await boot();
  d.EC.go('settings');
  assert.ok(d.text().indexOf(d.t('localNote')) >= 0);
});
