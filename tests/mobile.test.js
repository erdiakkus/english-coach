/* Mobile behaviour: audio only after a gesture, late voices, speech recognition fallbacks, keyboard, CSS rules. */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { boot, ROOT } = require('./helpers');

const tick = function (ms) { return new Promise(function (r) { setTimeout(r, ms || 20); }); };
function words(d) { return d.win.spoken.filter(function (x) { return x.trim(); }); }
function openSpeaking(d) { d.EC.go('unit', { id: '0.1' }); d.click(new RegExp(d.t('speakingStep') + '$')); }

test('no audio plays before the first user gesture', async function () {
  const d = await boot();
  d.EC.autoSay('hello');
  assert.deepEqual(d.win.spoken, [], 'nothing spoken, not even the unlock');
  d.doc.body.dispatchEvent(new d.win.Event('pointerdown', { bubbles: true }));
  assert.deepEqual(d.win.spoken, [' '], 'first tap speaks the silent unlock utterance');
  d.EC.autoSay('hello');
  assert.deepEqual(words(d), ['hello']);
});

test('a listening question autoplays once the learner has tapped', async function () {
  const d = await boot();
  d.EC.go('unit', { id: '0.1' });
  d.click(new RegExp(d.t('listeningStep') + '$'));
  await tick(300);
  assert.equal(words(d).length, 1, 'the question was read out');
});

test('voices that load late fill the Settings list and keep the saved choice', async function () {
  let handler = null;
  const synth = { voices: [], getVoices: function () { return this.voices; }, speak: function () {}, cancel: function () {}, addEventListener: function (t, f) { if (t === 'voiceschanged') handler = f; } };
  const d = await boot({ tts: false, before: function (win) { win.SpeechSynthesisUtterance = function (x) { this.text = x; }; win.speechSynthesis = synth; } });
  d.EC.state().voice = 'Daniel';
  d.EC.go('settings');
  const sel = function () { return d.doc.querySelectorAll('select')[1]; };
  assert.equal(sel().options.length, 1, 'only Auto before voices load');
  synth.voices = [{ name: 'Samantha', lang: 'en-US' }, { name: 'Daniel', lang: 'en-GB' }, { name: 'Yelda', lang: 'tr-TR' }];
  assert.ok(handler, 'voiceschanged listener registered');
  handler();
  assert.deepEqual(Array.prototype.map.call(sel().options, function (o) { return o.value; }), ['', 'Samantha', 'Daniel']);
  assert.equal(sel().value, 'Daniel');
});

test('without speech recognition the self-rating fallback explains why', async function () {
  const d = await boot();
  openSpeaking(d);
  assert.ok(d.text().indexOf(d.t('noSpeech')) >= 0);
  assert.ok(d.has(d.t('selfDone')) && d.has(d.t('selfNot')));
});

test('iOS home screen app without recognition gets the iPhone explanation', async function () {
  const d = await boot({ navigator: { standalone: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15' } });
  openSpeaking(d);
  assert.ok(d.text().indexOf(d.t('srStandalone')) >= 0);
});

function fakeRecognition(win, outcome) {
  win.webkitSpeechRecognition = function () {
    const rec = this;
    rec.start = function () {
      setTimeout(function () {
        if (outcome.error) rec.onerror({ error: outcome.error });
        else rec.onresult({ results: [[{ transcript: outcome.text }]] });
        if (rec.onend) rec.onend();
      }, 0);
    };
  };
}

test('offline: speech recognition is skipped with a one-line reason', async function () {
  const d = await boot({ navigator: { onLine: false }, before: function (win) { fakeRecognition(win, { text: 'x' }); } });
  openSpeaking(d);
  assert.ok(d.text().indexOf(d.t('srOffline')) >= 0);
  assert.equal(d.doc.querySelector('.mic'), null);
});

test('recognition errors map to the right message', async function () {
  for (const c of [['network', 'srOffline'], ['not-allowed', 'micErr'], ['no-speech', 'srNoSound']]) {
    const d = await boot({ before: function (win) { fakeRecognition(win, { error: c[0] }); } });
    openSpeaking(d);
    d.doc.querySelector('.mic').click();
    await tick();
    assert.ok(d.text().indexOf(d.t(c[1])) >= 0, c[0] + ' -> ' + c[1]);
  }
});

test('a correct spoken answer is accepted', async function () {
  const outcome = { text: '' };
  const d = await boot({ before: function (win) { fakeRecognition(win, outcome); } });
  openSpeaking(d);
  outcome.text = d.EC.cur.say.toLowerCase().replace(/[.!?]/g, '');
  d.doc.querySelector('.mic').click();
  await tick();
  assert.match(d.doc.querySelector('.fb').textContent, new RegExp(d.t('correct')));
});

test('focusing a text field hides the bottom nav and scrolls it into view', async function () {
  const d = await boot();
  let scrolled = 0;
  d.win.HTMLElement.prototype.scrollIntoView = function () { scrolled++; };
  const inp = d.doc.querySelector('input.typedin');
  inp.focus();
  assert.ok(d.doc.body.classList.contains('typing'));
  await tick(350);
  assert.equal(scrolled, 1);
  inp.blur();
  await tick(80);
  assert.ok(!d.doc.body.classList.contains('typing'));
});

test('stylesheet carries the mobile rules', function () {
  const css = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.ok(/min-height:100vh;min-height:100dvh/.test(css), 'dvh with vh fallback');
  assert.ok(css.indexOf('100vh') === css.lastIndexOf('100vh'), 'no other vh use');
  ['safe-area-inset-top', 'safe-area-inset-bottom', 'safe-area-inset-left', 'safe-area-inset-right', 'touch-action:manipulation', 'prefers-reduced-motion', 'orientation:landscape', 'font-size:max(16px,1em)', 'viewport-fit=cover']
    .forEach(function (k) { assert.ok(css.indexOf(k) >= 0, k); });
  ['.ghost', '.btn.small', '.tile', '.me', '.pedit', '.sw', '.check'].forEach(function (sel) {
    const rule = css.split('\n').filter(function (l) { return l.indexOf(sel + '{') === 0; })[0] || '';
    assert.ok(/(min-)?height:(4[4-9]|5\d)px/.test(rule), sel + ' is at least 44px: ' + rule);
  });
  ['apple-mobile-web-app-capable', 'apple-mobile-web-app-status-bar-style', 'apple-mobile-web-app-title', 'apple-touch-icon'].forEach(function (k) { assert.ok(css.indexOf(k) >= 0, k); });
});
