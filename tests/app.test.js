/* Core learning flows: these pin the behaviour that existed before profiles and must keep working. */
const test = require('node:test');
const assert = require('node:assert');
const { boot, readPack } = require('./helpers');

const { writeAndSave, doUnit } = require('./helpers');

test('boot renders home in Turkish with placement card', async function () {
  const d = await boot();
  assert.match(d.text(), /Merhaba/);
  assert.ok(d.has(d.t('placementCta')));
  assert.equal(d.EC.state().lang, 'tr');
});

test('placement: all correct starts at unit 3.1 and skips earlier units', async function () {
  const d = await boot();
  d.click(d.t('placementCta'));
  const n = d.finishQuiz(true);
  assert.equal(n, 20);
  const S = d.EC.state();
  assert.equal(S.placed.start, '3.1');
  assert.ok(S.units['1.4'].skipped);
  assert.match(d.text(), new RegExp(d.t('placementDone')));
});

test('placement: all wrong starts at unit 0.1', async function () {
  const d = await boot();
  d.click(d.t('placementCta'));
  assert.equal(d.finishQuiz(false), 5);
  assert.equal(d.EC.state().placed.start, '0.1');
});

test('full unit flow completes unit 0.1 and unlocks 0.2', async function () {
  const d = await boot();
  doUnit(d, '0.1');
  const S = d.EC.state();
  assert.ok(S.units['0.1'].done, 'unit done');
  ['vocab', 'grammar', 'practice', 'listening', 'speaking', 'reading', 'writing', 'test'].forEach(function (s) { assert.ok(S.units['0.1'].steps[s].done, s); });
  assert.ok(Object.keys(S.srs).length >= 6);
  assert.equal(S.writings.length, 1);
  assert.ok(S.xp > 0 && S.streak.n === 1);
  d.EC.go('path');
  assert.ok(d.doc.querySelector('.unit.cur').textContent.indexOf('0.2') === 0);
});

test('SRS review moves due words up a box', async function () {
  const d = await boot();
  doUnit(d, '0.1');
  const S = d.EC.state();
  Object.keys(S.srs).forEach(function (k) { S.srs[k].due = '2000-01-01'; S.srs[k].box = 1; });
  d.EC.go('home');
  d.click(d.t('startReview'));
  const n = d.finishQuiz(true);
  assert.ok(n > 0);
  const moved = Object.keys(S.srs).filter(function (k) { return S.srs[k].box === 2; }).length;
  assert.equal(moved, n);
});

test('homework: every task can be completed', async function () {
  const d = await boot();
  doUnit(d, '0.1');
  d.EC.state().mistakes.push({ k: 'x', q: { type: 'mc', q: 'Pick a', options: ['a', 'b'], answer: 'a' }, n: 1, d: '2026-01-01' });
  d.EC.go('homework');
  const S = d.EC.state();
  assert.ok(S.hw.tasks.length >= 4);
  S.hw.tasks.forEach(function (task) {
    d.click(new RegExp('^\\S+' + task.title.replace(/[()]/g, '.')));
    if (d.doc.querySelector('textarea')) writeAndSave(d);
    else { d.finishQuiz(true); d.click(d.t('continue')); }
  });
  assert.ok(S.hw.tasks.every(function (x) { return x.done; }));
  assert.match(d.text(), new RegExp(d.t('hwDone')));
});

test('stage exam S0 can be taken and passed after both units', async function () {
  const d = await boot();
  doUnit(d, '0.1');
  doUnit(d, '0.2');
  d.EC.go('exams');
  d.click(d.t('start'));
  d.finishQuiz(true);
  d.finishQuiz(true);
  writeAndSave(d);
  const rec = d.EC.state().exams.S0;
  assert.ok(rec && rec.passed, JSON.stringify(rec));
  assert.match(d.text(), new RegExp(d.t('examPassed')));
});

test('content pack merges and makes unit 1.5 playable', async function () {
  const d = await boot();
  assert.deepEqual(d.EC.mergePack(readPack()), []);
  d.EC.go('path');
  const row = Array.prototype.slice.call(d.doc.querySelectorAll('.unit')).filter(function (b) { return b.textContent.indexOf('1.5') === 0; })[0];
  assert.ok(row.textContent.indexOf(d.t('soon')) < 0);
});

test('snapshot keeps the Claude project format', async function () {
  const d = await boot();
  const lines = d.EC.snapshot().split('\n');
  assert.equal(lines[0], 'PROGRESS SNAPSHOT (from the English Coach app)');
  assert.match(lines[1], /^Date: \d{4}-\d{2}-\d{2}$/);
  ['Stage and unit:', 'Sessions completed:', "Today's goal and result:", 'New words', 'Words to review', 'Grammar status', 'Recurring errors:', 'Next session plan:', 'Skills accuracy:']
    .forEach(function (p) { assert.ok(lines.some(function (l) { return l.indexOf(p) === 0; }), p); });
});
