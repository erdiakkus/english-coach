/* Test helpers: boot the real index.html in jsdom and drive the UI like a learner. */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');

/* Boot the app. `storage` seeds localStorage (key: string or object). Returns helpers bound to the window. */
function boot(opts) {
  opts = opts || {};
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const scripts = [];
  const bare = html.replace(/<script src="([^"]+)"><\/script>/g, function (m, src) { scripts.push(src); return ''; });
  const dom = new JSDOM(bare, {
    url: 'https://ec.test/app/',
    pretendToBeVisual: true,
    runScripts: 'outside-only',
    beforeParse: function (win) {
      Object.keys(opts.storage || {}).forEach(function (k) {
        const v = opts.storage[k];
        win.localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
      });
      if (opts.sw) Object.defineProperty(win.navigator, 'serviceWorker', { value: opts.sw, configurable: true });
      if (opts.navigator) Object.keys(opts.navigator).forEach(function (k) { Object.defineProperty(win.navigator, k, { value: opts.navigator[k], configurable: true }); });
      if (opts.before) opts.before(win);
      win.alerts = [];
      win.alert = function (m) { win.alerts.push(String(m)); };
      win.confirm = function () { return opts.confirm !== undefined ? opts.confirm : true; };
      win.scrollTo = function () {};
      win.HTMLElement.prototype.scrollIntoView = function () {};
      win.URL.createObjectURL = function (blob) { win.lastBlob = blob; return 'blob:test'; };
      win.HTMLAnchorElement.prototype.click = function () { win.lastDownload = this.download; };
      if (opts.tts !== false) {
        win.spoken = [];
        win.SpeechSynthesisUtterance = function (text) { this.text = text; };
        win.speechSynthesis = {
          voices: [{ name: 'Test GB', lang: 'en-GB' }],
          getVoices: function () { return this.voices; },
          speak: function (u) { win.spoken.push(u.text); },
          cancel: function () {},
          addEventListener: function () {}
        };
      }
    }
  });
  const win = dom.window;
  scripts.forEach(function (src) { win.eval(fs.readFileSync(path.join(ROOT, src), 'utf8') + '\n//# sourceURL=' + src); });
  return new Promise(function (resolve) {
    if (win.document.readyState !== 'loading') resolve(driver(win));
    else win.document.addEventListener('DOMContentLoaded', function () { setTimeout(function () { resolve(driver(win)); }, 0); });
  });
}

function driver(win) {
  const doc = win.document;
  const d = {
    win: win, doc: doc, EC: win.EC,
    text: function () { return doc.getElementById('app').textContent; },
    buttons: function () { return Array.prototype.slice.call(doc.querySelectorAll('#app button')); },
    /* Click the first button whose trimmed text equals (string) or matches (RegExp) `label`. */
    click: function (label) {
      const b = d.buttons().filter(function (x) {
        const tx = x.textContent.trim();
        return label instanceof RegExp ? label.test(tx) : tx === label;
      })[0];
      if (!b) throw new Error('No button "' + label + '". Buttons: ' + d.buttons().map(function (x) { return x.textContent.trim(); }).join(' | '));
      b.click();
      return b;
    },
    has: function (label) {
      return d.buttons().some(function (x) { const tx = x.textContent.trim(); return label instanceof RegExp ? label.test(tx) : tx === label; });
    },
    inQuiz: function () { return !!doc.querySelector('#app .qhead .bar'); },
    /* Answer the question on screen (correctly unless ok === false), then press the continue button. */
    answer: function (ok) {
      ok = ok !== false;
      const q = win.EC.cur;
      const body = doc.querySelector('.qbody');
      const btns = function (sel) { return Array.prototype.slice.call(body.querySelectorAll(sel)); };
      const check = function () { doc.querySelector('.actions .btn').click(); };
      if (q.type === 'mc' || q.type === 'listenmc') {
        const correct = typeof q.answer === 'number' ? q.options[q.answer] : q.answer;
        const opt = btns('.opt').filter(function (b) { return ok ? b.textContent === correct : b.textContent !== correct; })[0];
        opt.click();
      } else if (q.type === 'fill' || q.type === 'typed' || q.type === 'dictation') {
        const inp = body.querySelector('input');
        inp.value = ok ? ((q.answers && q.answers[0]) || q.say) : 'zzzz qqqq';
        check();
        if (!ok && !doc.querySelector('.fb:not([hidden])')) check();
      } else if (q.type === 'order') {
        const words = ok ? q.words : q.words.slice().reverse();
        words.forEach(function (w) {
          const pool = body.querySelectorAll('.tiles')[1];
          Array.prototype.slice.call(pool.querySelectorAll('.tile')).filter(function (b) { return b.textContent === w; })[0].click();
        });
        check();
      } else if (q.type === 'match') {
        const cells = btns('.pair .opt');
        const left = cells.filter(function (b, i) { return i % 2 === 0; }), right = cells.filter(function (b, i) { return i % 2 === 1; });
        q.pairs.forEach(function (p, k) {
          const l = left.filter(function (b) { return b.textContent === p[0] && !b.classList.contains('gone'); })[0];
          l.click();
          if (!ok) { for (let n = 0; n < 3; n++) { right.filter(function (b) { return b.textContent !== p[1] && !b.classList.contains('gone'); })[0].click(); } }
          right.filter(function (b) { return b.textContent === p[1] && !b.classList.contains('gone'); })[0].click();
        });
      } else if (q.type === 'speak') {
        const selfBtn = btns('.btn').filter(function (b) { return b.textContent === (ok ? d.t('selfDone') : d.t('selfNot')); })[0];
        if (!selfBtn) throw new Error('No self-rating button on speak question');
        selfBtn.click();
      } else {
        throw new Error('Unknown question type ' + q.type);
      }
      const fb = doc.querySelector('.fb');
      if (!fb || fb.hidden) throw new Error('Question was not marked (' + q.type + ')');
      doc.querySelector('.actions .btn').click();
    },
    /* Answer questions until the quiz ends. Returns the number answered. */
    finishQuiz: function (ok, max) {
      let n = 0;
      while (d.inQuiz() && n < (max || 200)) { d.answer(typeof ok === 'function' ? ok(n) : ok); n++; }
      return n;
    },
    t: function (k) { return win.EC.t ? win.EC.t(k) : k; },
    storage: function () {
      const out = {};
      for (let i = 0; i < win.localStorage.length; i++) { const k = win.localStorage.key(i); out[k] = win.localStorage.getItem(k); }
      return out;
    },
    json: function (k) { const v = win.localStorage.getItem(k); return v ? JSON.parse(v) : null; }
  };
  return d;
}

/* Learner flows shared by several test files. */
const WRITING = 'Hello. My name is Ayla. Thank you very much for the help today. I am happy here and I like it. I have lived in this town for three years and I have made many friends. Last week I went to the shop and I bought some bread and some milk. If it rains tomorrow I will stay at home and I will read a book. I think it is a good idea to practise every day because it helps me to learn. Although it is sometimes difficult I do not give up. The teacher who helps me is very kind and she said that I am making progress.';

function writeAndSave(d) {
  const ta = d.doc.querySelector('textarea');
  ta.value = WRITING;
  ta.dispatchEvent(new d.win.Event('input'));
  d.click(d.t('saveWriting'));
}

function doUnit(d, id) {
  d.EC.go('unit', { id: id });
  d.click(new RegExp(d.t('vocab') + '$'));
  while (!d.has(d.t('miniTest'))) d.click(d.t('next'));
  d.click(d.t('miniTest'));
  d.finishQuiz(true); d.click(d.t('continue'));
  d.click(new RegExp(d.t('grammar') + '$')); d.click(d.t('understood'));
  ['practice', 'listeningStep', 'speakingStep'].forEach(function (k) {
    d.click(new RegExp(d.t(k) + '$')); d.finishQuiz(true); d.click(d.t('continue'));
  });
  d.click(new RegExp(d.t('reading') + '$')); d.click(d.t('answerQs')); d.finishQuiz(true); d.click(d.t('continue'));
  d.click(new RegExp(d.t('writing') + '$')); writeAndSave(d);
  d.click(new RegExp(d.t('test') + '$')); d.finishQuiz(true); d.click(d.t('continue'));
}

/* The reference pack relabelled as unit 4.1 (a unit the app does not have), so tests can prove that packs load. */
function readPack() {
  const p = JSON.parse(fs.readFileSync(path.join(ROOT, 'packs', 'unit-1.5-daily-routine.json'), 'utf8'));
  Object.assign(p.units[0], { id: '4.1', stage: 'B1.2', title: 'Extra unit', titleTR: 'Ek ünite' });
  return p;
}

module.exports = { boot: boot, ROOT: ROOT, readPack: readPack, writeAndSave: writeAndSave, doUnit: doUnit, WRITING: WRITING };
