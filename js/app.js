/* English Coach: app engine. Vanilla JS, no build step, data stays in the browser (localStorage). */
(function () {
  'use strict';

  var C = window.CONTENT;
  var Store = window.ECStore;
  var BOX_DAYS = [0, 1, 3, 7, 14, 30];

  /* ================= i18n ================= */
  var I18N = {
    tr: {
      home: 'Ana sayfa', path: 'Yol', homework: 'Ödev', exams: 'Sınavlar', progress: 'İlerleme', settings: 'Ayarlar',
      hello: 'Merhaba', today: 'Bugün', words: 'kelime', check: 'Kontrol et', next: 'Devam', finish: 'Bitir', back: 'Geri',
      correct: 'Doğru!', wrong: 'Yanlış.', answerIs: 'Doğru cevap', nearly: 'Neredeyse! Yazımı bir kontrol et.',
      listen: 'Dinle', slow: 'Yavaş', showText: 'Metni göster', noTts: 'Bu cihazda sesli okuma yok. Metni göstererek devam edebilirsin.',
      sayThis: 'Şunu yüksek sesle söyle:', speak: 'Konuş', listening: 'Dinliyorum...', heard: 'Duyduğum', similarity: 'Benzerlik',
      noSpeech: 'Bu tarayıcı konuşma tanımayı desteklemiyor. Kendin söyle ve dürüstçe değerlendir.',
      selfDone: 'Söyledim, iyi oldu', selfNot: 'Tekrar çalışmalıyım',
      micErr: 'Mikrofon çalışmadı. İzin ver veya sayfayı https ya da localhost üzerinden aç. İstersen kendin değerlendir:',
      tryAgain: 'Tekrar dene', retry: 'Yeniden dene', continue: 'Devam et', start: 'Başla', done: 'Tamamlandı', locked: 'Kilitli',
      soon: 'Yakında', score: 'Skor', passed: 'Geçtin!', notPassed: 'Henüz geçmedin. Eksikleri tekrar edip yeniden dene.',
      review: 'Kelime tekrarı', due: 'tekrar bekliyor', noDue: 'Bugün tekrar yok. Harika!', startReview: 'Tekrara başla',
      nextStep: 'Sıradaki', placementTitle: 'Seviye tespit sınavı', placementSub: 'Yaklaşık 10 dakika. Önceki bilgin geri gelirse üniteleri atlayabilirsin.',
      placementCta: 'Seviye tespitine başla', placementDone: 'Seviye tespiti tamamlandı',
      placementNote: 'Konuşma ve yazma için Claude projesinde kısa bir kontrol de yap.',
      streak: 'gün seri', xp: 'puan', unit: 'Ünite', vocab: 'Kelimeler', grammar: 'Dilbilgisi', practice: 'Alıştırmalar',
      listeningStep: 'Dinleme', speakingStep: 'Konuşma', reading: 'Okuma', writing: 'Yazma', test: 'Ünite sınavı',
      understood: 'Anladım', flipShow: 'Anlamı göster', prev: 'Önceki', miniTest: 'Mini testi başlat', cards: 'Kartlar',
      readAloud: 'Metni dinle', glossary: 'Kelimeler', answerQs: 'Soruları cevapla',
      wordCount: 'kelime', saveWriting: 'Kaydet', askClaude: 'Claude\'dan geri bildirim al (kopyala)', copied: 'Kopyalandı. Claude projesinde yapıştır.',
      writingSaved: 'Yazın kaydedildi.', minWordsMsg: 'Biraz daha yaz. Hedef kelime sayısı:', autoChecks: 'Otomatik kontrol', selfCheck: 'Kendi kontrol listen',
      hwTitle: 'Günün ödevi', hwEmpty: 'Önce bir üniteye başla. Ödev, öğrendiklerinden otomatik oluşur.', hwDone: 'Bugünün ödevi tamam. Tebrikler!',
      hwReview: 'Kelime tekrarı', hwMistakes: 'Hata tekrarı', hwListening: 'Dinleme (3 soru)', hwSpeaking: 'Konuşma (3 cümle)', hwWriting: 'Yazma görevi',
      unitTests: 'Ünite sınavları', stageExams: 'Aşama sınavları', placementCard: 'Seviye tespit sınavı',
      stageExamRule: 'Aşamanın tüm üniteleri bittiğinde açılır.', partA: 'Bölüm A: Genel sınav', partB: 'Bölüm B: Konuşma', partC: 'Bölüm C: Yazma',
      examResult: 'Sınav sonucu', examPassed: 'Aşama sınavını geçtin!', examFail: 'Bu sefer olmadı. Eksik alanları tekrar edip yeniden dene.',
      writingToClaude: 'Yazını Claude ile değerlendir', skills: 'Becerilerin', unitsDone: 'Biten üniteler', wordsLearned: 'Öğrenilen kelime',
      daysStudied: 'Çalışılan gün', recent: 'Son sonuçlar', snapshot: 'Progress Snapshot (Claude\'a yapıştır)', copySnap: 'Snapshot\'ı kopyala',
      restore: 'Yedeği yükle', pack: 'İçerik paketi yükle', packOk: 'İçerik paketi yüklendi.', packErr: 'Paket hatası:',
      name: 'Adın', language: 'Arayüz dili', rate: 'Konuşma hızı', voice: 'Ses', testVoice: 'Sesi dene', reset: 'Bu profilin ilerlemesini sil', resetAsk: 'Bu profilin tüm ilerlemesi silinsin mi? Bu geri alınamaz.',
      saved: 'Kaydedildi.', whatHeard: 'Ne duydun?', fixedLater: 'Hata tekrarı', noContent: 'Bu ünitenin içeriği henüz uygulamada yok. Claude projesinde çalış veya içerik paketi yükle.',
      mistakesLeft: 'tekrar edilecek hata', start1: 'Başlamak için', completePrev: 'Önceki üniteyi bitir', needPractice: 'Önce kelimeler, dilbilgisi ve alıştırmaları yap.',
      skillNames: { vocab: 'Kelime', grammar: 'Dilbilgisi', listening: 'Dinleme', speaking: 'Konuşma', reading: 'Okuma' },
      welcomeName: 'Adın ne? (ayarlardan değiştirebilirsin)', ok: 'Tamam', close: 'Kapat', skipped: 'Atlandı', hwDoneBadge: 'Yapıldı',
      selfRatedNote: 'Not: Bazı konuşma maddeleri kendi değerlendirmendi.',
      whoLearning: 'Kim çalışıyor?', profiles: 'Profiller', addProfile: 'Yeni profil', lastUsed: 'Son kullanım', notYet: 'henüz yok',
      editProfile: 'Profili düzenle', newProfile: 'Yeni profil', profileName: 'Profil adı', icon: 'Simge', colour: 'Renk', create: 'Oluştur',
      deleteProfile: 'Profili sil', deleteAsk: 'Bu profilin tüm ilerlemesi kalıcı olarak silinir. Onaylamak için profil adını aynen yaz:',
      deleteGo: 'Kalıcı olarak sil', deleted: 'Profil silindi.', nameNeeded: 'Bir ad yaz.', switchProfile: 'Profil değiştir', edit: 'Düzenle',
      unitsShort: 'ünite', localNote: 'Veriler sadece bu cihazda ve bu tarayıcıda saklanır. Hesap veya şifre yoktur. Tarayıcı verisini silersen ilerleme gider, cihaz değiştirmeden önce yedek al.',
      backupOne: 'Bu profili yedekle (indir)', backupAll: 'Tüm profilleri yedekle (indir)', importFound: 'Dosyadaki profiller:',
      addAsNew: 'Yeni profil olarak ekle', addAllNew: 'Hepsini yeni profil olarak ekle', replaceExisting: 'Mevcut bir profilin yerine koy',
      replaceSame: 'Aynı profilleri güncelle, diğerlerini ekle', replaceWarn: 'Seçilen profilin şu anki ilerlemesi silinir ve yedektekiyle değişir.',
      replaceGo: 'Yerine koy', imported: 'Yedek yüklendi.', cancel: 'Vazgeç',
      errNotJson: 'Bu dosya okunamadı (JSON değil).', errUnknownShape: 'Bu dosya bir English Coach yedeği değil. Ayarlar ekranındaki yedekle düğmesiyle alınmış bir dosya seç.',
      errBadState: 'Yedekteki ilerleme verisi eksik veya bozuk'
    },
    en: {
      home: 'Home', path: 'Path', homework: 'Homework', exams: 'Exams', progress: 'Progress', settings: 'Settings',
      hello: 'Hello', today: 'Today', words: 'words', check: 'Check', next: 'Continue', finish: 'Finish', back: 'Back',
      correct: 'Correct!', wrong: 'Not quite.', answerIs: 'Correct answer', nearly: 'Almost! Check your spelling.',
      listen: 'Listen', slow: 'Slow', showText: 'Show text', noTts: 'No speech on this device. You can show the text and continue.',
      sayThis: 'Say this out loud:', speak: 'Speak', listening: 'Listening...', heard: 'I heard', similarity: 'Match',
      noSpeech: 'This browser does not support speech recognition. Say it yourself and rate honestly.',
      selfDone: 'I said it well', selfNot: 'I need more practice',
      micErr: 'The microphone did not work. Allow it, or open the page over https or localhost. You can rate yourself:',
      tryAgain: 'Try again', retry: 'Retry', continue: 'Continue', start: 'Start', done: 'Done', locked: 'Locked',
      soon: 'Coming soon', score: 'Score', passed: 'You passed!', notPassed: 'Not yet. Review the weak areas and try again.',
      review: 'Word review', due: 'due', noDue: 'No reviews today. Great!', startReview: 'Start review',
      nextStep: 'Next', placementTitle: 'Placement test', placementSub: 'About 10 minutes. If you already know things, you can skip units.',
      placementCta: 'Start placement test', placementDone: 'Placement complete',
      placementNote: 'Also do a short speaking and writing check in the Claude project.',
      streak: 'day streak', xp: 'points', unit: 'Unit', vocab: 'Vocabulary', grammar: 'Grammar', practice: 'Practice',
      listeningStep: 'Listening', speakingStep: 'Speaking', reading: 'Reading', writing: 'Writing', test: 'Unit test',
      understood: 'Got it', flipShow: 'Show meaning', prev: 'Previous', miniTest: 'Start mini test', cards: 'Cards',
      readAloud: 'Listen to text', glossary: 'Words', answerQs: 'Answer the questions',
      wordCount: 'words', saveWriting: 'Save', askClaude: 'Get feedback from Claude (copy)', copied: 'Copied. Paste it in the Claude project.',
      writingSaved: 'Your writing is saved.', minWordsMsg: 'Write a little more. Target word count:', autoChecks: 'Automatic checks', selfCheck: 'Your own checklist',
      hwTitle: 'Today\'s homework', hwEmpty: 'Start a unit first. Homework is built from what you learn.', hwDone: 'Today\'s homework is done. Well done!',
      hwReview: 'Word review', hwMistakes: 'Mistake review', hwListening: 'Listening (3 items)', hwSpeaking: 'Speaking (3 sentences)', hwWriting: 'Writing task',
      unitTests: 'Unit tests', stageExams: 'Stage exams', placementCard: 'Placement test',
      stageExamRule: 'Opens when all units of the stage are finished.', partA: 'Part A: General test', partB: 'Part B: Speaking', partC: 'Part C: Writing',
      examResult: 'Exam result', examPassed: 'You passed the stage exam!', examFail: 'Not this time. Review the weak areas and try again.',
      writingToClaude: 'Review your writing with Claude', skills: 'Your skills', unitsDone: 'Units done', wordsLearned: 'Words learned',
      daysStudied: 'Days studied', recent: 'Recent results', snapshot: 'Progress Snapshot (paste into Claude)', copySnap: 'Copy snapshot',
      restore: 'Restore backup', pack: 'Load content pack', packOk: 'Content pack loaded.', packErr: 'Pack error:',
      name: 'Your name', language: 'Interface language', rate: 'Speech speed', voice: 'Voice', testVoice: 'Test voice', reset: 'Delete this profile\'s progress', resetAsk: 'Delete all progress in this profile? This cannot be undone.',
      saved: 'Saved.', whatHeard: 'What did you hear?', fixedLater: 'Mistake review', noContent: 'This unit is not in the app yet. Study it in the Claude project or load a content pack.',
      mistakesLeft: 'mistakes to review', start1: 'To start', completePrev: 'Finish the previous unit', needPractice: 'Do vocabulary, grammar and practice first.',
      skillNames: { vocab: 'Vocabulary', grammar: 'Grammar', listening: 'Listening', speaking: 'Speaking', reading: 'Reading' },
      welcomeName: 'What is your name? (you can change it in settings)', ok: 'OK', close: 'Close', skipped: 'Skipped', hwDoneBadge: 'Done',
      selfRatedNote: 'Note: some speaking items were self-rated.',
      whoLearning: 'Who is learning?', profiles: 'Profiles', addProfile: 'New profile', lastUsed: 'Last used', notYet: 'not yet',
      editProfile: 'Edit profile', newProfile: 'New profile', profileName: 'Profile name', icon: 'Icon', colour: 'Colour', create: 'Create',
      deleteProfile: 'Delete profile', deleteAsk: 'All progress in this profile will be deleted for good. To confirm, type the profile name exactly:',
      deleteGo: 'Delete permanently', deleted: 'Profile deleted.', nameNeeded: 'Enter a name.', switchProfile: 'Switch profile', edit: 'Edit',
      unitsShort: 'units', localNote: 'Your data is stored only on this device and in this browser. There is no account or password. Clearing browser data deletes your progress, so back up before changing device.',
      backupOne: 'Back up this profile (download)', backupAll: 'Back up all profiles (download)', importFound: 'Profiles in this file:',
      addAsNew: 'Add as new profile', addAllNew: 'Add all as new profiles', replaceExisting: 'Replace an existing profile',
      replaceSame: 'Replace matching profiles, add the rest', replaceWarn: 'The current progress of the chosen profile will be overwritten by the backup.',
      replaceGo: 'Replace', imported: 'Backup restored.', cancel: 'Cancel',
      errNotJson: 'This file could not be read (it is not JSON).', errUnknownShape: 'This file is not an English Coach backup. Choose a file made with the back up button in Settings.',
      errBadState: 'The progress data in this backup is missing or damaged'
    }
  };

  /* ================= state ================= */
  function defaultState() {
    return {
      v: 1, name: '', lang: 'tr', rate: 0.9, voice: '', created: today(), placed: null, units: {}, srs: {},
      mistakes: [], skill: {}, hist: [], xp: 0, days: [], streak: { last: '', n: 0 }, hw: null, writings: [], exams: {}
    };
  }
  var S, PID = null;
  /* localStorage can throw (private mode, blocked site data); fall back to memory so the app still runs. */
  var LS = (function () {
    try { var s = window.localStorage; s.setItem('ec_probe', '1'); s.removeItem('ec_probe'); return s; }
    catch (e) { var m = {}; return { getItem: function (k) { return k in m ? m[k] : null; }, setItem: function (k, v) { m[k] = String(v); }, removeItem: function (k) { delete m[k]; } }; }
  })();
  function openProfile(id) { PID = id; Store.setActive(LS, id); S = Store.loadProfile(LS, id, defaultState()); }
  function save() { if (PID) Store.saveProfile(LS, PID, S); }
  function profileName() { var m = Store.meta(LS, PID); return m ? m.name : ''; }
  function setName(n) { n = n.trim(); S.name = n; if (n) S.name = Store.updateProfile(LS, PID, { name: n }).name; save(); }
  /* The profile name is the source of truth; the state's name field mirrors it. */
  function syncName(id, name) {
    if (id === PID) { S.name = name; save(); return; }
    var st = Store.loadProfile(LS, id, defaultState()); st.name = name; Store.saveProfile(LS, id, st);
  }
  function t(k) {
    var d = I18N[S.lang] || I18N.tr;
    if (d[k] !== undefined) return d[k];
    return I18N.tr[k] !== undefined ? I18N.tr[k] : k;
  }

  /* ================= utils ================= */
  function pad(n) { return String(n).padStart(2, '0'); }
  function fmtDate(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { return fmtDate(new Date()); }
  function addDays(ds, n) { var d = new Date(ds + 'T12:00:00'); d.setDate(d.getDate() + n); return fmtDate(d); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function sample(a, n) { return shuffle(a).slice(0, n); }
  function clear(e) { while (e.firstChild) e.removeChild(e.firstChild); return e; }
  function add(e, c) {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(e, x); }); }
    else if (typeof c === 'string' || typeof c === 'number') { e.appendChild(document.createTextNode(String(c))); }
    else { e.appendChild(c); }
  }
  function h(tag, attrs) {
    var e = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === false || v === null || v === undefined) return;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) add(e, arguments[i]);
    return e;
  }
  function sanitize(html) {
    var tp = document.createElement('template');
    tp.innerHTML = html;
    tp.content.querySelectorAll('script,style,iframe,object,embed,link,meta,form').forEach(function (n) { n.remove(); });
    tp.content.querySelectorAll('*').forEach(function (n) {
      Array.prototype.slice.call(n.attributes).forEach(function (a) {
        if (/^on/i.test(a.name) || /javascript:/i.test(a.value)) n.removeAttribute(a.name);
      });
    });
    return tp.innerHTML;
  }
  function toast(msg) {
    var el = h('div', { class: 'toast' }, msg);
    document.body.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 2600);
  }
  function copyText(text) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) { /* ignore */ }
      document.body.removeChild(ta);
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).catch(fallback); }
      else fallback();
    } catch (e) { fallback(); }
    toast(t('copied'));
  }
  function pct(a, b) { return b ? Math.round(a / b * 100) : 0; }

  /* ================= answer checking ================= */
  var CONTR = {
    "i'm": 'i am', "you're": 'you are', "he's": 'he is', "she's": 'she is', "it's": 'it is', "we're": 'we are', "they're": 'they are',
    "isn't": 'is not', "aren't": 'are not', "don't": 'do not', "doesn't": 'does not', "can't": 'cannot', "what's": 'what is',
    "where's": 'where is', "that's": 'that is', "there's": 'there is', "i've": 'i have', "won't": 'will not', "didn't": 'did not',
    "haven't": 'have not', "hasn't": 'has not', "wasn't": 'was not', "weren't": 'were not', "let's": 'let us', "how's": 'how is', "who's": 'who is'
  };
  function norm(s) { return C.norm(s); }
  function expand(s) {
    return s.split(' ').map(function (w) { return CONTR[w] || w; }).join(' ')
      .replace(/(\w+)'ll\b/g, '$1 will').replace(/(\w+)'ve\b/g, '$1 have').replace(/(\w+)'re\b/g, '$1 are').replace(/\bcan not\b/g, 'cannot');
  }
  function lev(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) { d[i] = [i]; }
    for (j = 1; j <= n; j++) { d[0][j] = j; }
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    return d[m][n];
  }
  function checkAnswer(user, answers) {
    var u = norm(user), close = false;
    if (!u) return 'no';
    for (var i = 0; i < answers.length; i++) {
      var a = norm(answers[i]);
      if (u === a || expand(u) === expand(a)) return 'ok';
      if (a.length >= 4 && lev(u, a) <= 1) close = true;
    }
    return close ? 'close' : 'no';
  }
  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function numWord(n) {
    if (n < 20) return ONES[n];
    if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
    return String(n);
  }
  function speechNorm(s) {
    return expand(norm(s)).replace(/\b\d+\b/g, function (m) { return numWord(parseInt(m, 10)); }).replace(/\s+/g, ' ').trim();
  }
  function similarity(exp, got) {
    var a = speechNorm(exp).split(' '), b = speechNorm(got).split(' ');
    if (!a[0] || !b[0]) return 0;
    var L = [], i, j;
    for (i = 0; i <= a.length; i++) { L[i] = []; for (j = 0; j <= b.length; j++) L[i][j] = 0; }
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++) {
      L[i][j] = a[i - 1] === b[j - 1] ? L[i - 1][j - 1] + 1 : Math.max(L[i - 1][j], L[i][j - 1]);
    }
    return L[a.length][b.length] / Math.max(a.length, b.length);
  }

  /* ================= audio ================= */
  function hasTts() { return 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance !== 'undefined'; }
  function pickVoice() {
    if (!hasTts()) return null;
    var vs = speechSynthesis.getVoices() || [];
    if (!vs.length) return null;
    if (S.voice) { var m = vs.filter(function (v) { return v.name === S.voice; })[0]; if (m) return m; }
    var gb = vs.filter(function (v) { return /^en[-_]GB/i.test(v.lang); });
    if (gb.length) return gb[0];
    var en = vs.filter(function (v) { return /^en/i.test(v.lang); });
    return en[0] || null;
  }
  function say(text, rate) {
    if (!hasTts()) return false;
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-GB';
      var v = pickVoice(); if (v) u.voice = v;
      u.rate = rate || S.rate || 0.9;
      speechSynthesis.speak(u);
    } catch (e) { return false; }
    return true;
  }
  function audioBtns(text) {
    var wrap = h('div', { class: 'row' });
    if (!hasTts()) {
      var reveal = h('p', { class: 'note' }, t('noTts'), ' ', h('b', { hidden: true }, text));
      wrap.appendChild(h('button', { class: 'btn small secondary', onclick: function () { reveal.querySelector('b').hidden = false; } }, t('showText')));
      wrap.appendChild(reveal);
      return wrap;
    }
    wrap.appendChild(h('button', { class: 'btn small', onclick: function () { say(text); } }, '🔊 ' + t('listen')));
    wrap.appendChild(h('button', { class: 'btn small secondary', onclick: function () { say(text, 0.6); } }, '🐢 ' + t('slow')));
    return wrap;
  }
  function getRecognizer() { return window.SpeechRecognition || window.webkitSpeechRecognition || null; }

  /* ================= content access ================= */
  function playable(u) { return !!(u && u.vocab && u.exercises && u.grammar); }
  function unitById(id) { return C.units.filter(function (u) { return u.id === id; })[0]; }
  function US(id) { if (!S.units[id]) S.units[id] = { steps: {} }; if (!S.units[id].steps) S.units[id].steps = {}; return S.units[id]; }
  function isDone(u) { var x = S.units[u.id]; return !!(x && (x.done || x.skipped)); }
  function unlocked(i) {
    var u = C.units[i];
    if (isDone(u)) return true;
    if (i === 0) return true;
    return isDone(C.units[i - 1]);
  }
  function currentUnit() {
    for (var i = 0; i < C.units.length; i++) {
      var u = C.units[i];
      if (!isDone(u)) return playable(u) && unlocked(i) ? u : null;
    }
    return null;
  }
  function allVocab() {
    var out = [];
    C.units.forEach(function (u) { if (playable(u)) u.vocab.forEach(function (x) { out.push({ en: x.en, tr: x.tr, ex: x.ex, exTr: x.exTr, u: u.id }); }); });
    return out;
  }
  function withSkill(q, skill) { var c = Object.assign({}, q); c.skill = skill; return c; }
  function mergePack(pack) {
    var errs = [];
    (pack.units || []).forEach(function (pu) {
      var e = C.validateUnit(pu);
      if (e.length) { errs = errs.concat(e); return; }
      var meta = unitById(pu.id);
      if (meta) { Object.keys(pu).forEach(function (k) { meta[k] = pu[k]; }); }
      else { C.units.push({ id: pu.id, stage: pu.stage || 'A1', title: pu.title || pu.id, titleTR: pu.titleTR || pu.title || pu.id }); Object.keys(pu).forEach(function (k) { C.units[C.units.length - 1][k] = pu[k]; }); }
    });
    return errs;
  }

  /* ================= progress helpers ================= */
  function markDay() {
    var td = today();
    if (S.days.indexOf(td) < 0) S.days.push(td);
    if (S.streak.last !== td) {
      S.streak.n = S.streak.last === addDays(td, -1) ? S.streak.n + 1 : 1;
      S.streak.last = td;
    }
  }
  function pushHist(o) { S.hist.push(o); if (S.hist.length > 80) S.hist = S.hist.slice(-80); }
  function qKey(q) { return [q.type, q.q || '', q.say || '', (q.words || []).join(' ')].join('|'); }
  function recordMistake(q) {
    if (q.type === 'speak') return;
    var k = qKey(q);
    var f = S.mistakes.filter(function (m) { return m.k === k; })[0];
    if (f) { f.n++; }
    else { S.mistakes.push({ k: k, q: q, n: 1, d: today() }); if (S.mistakes.length > 60) S.mistakes.shift(); }
  }
  function clearMistake(q) { var k = qKey(q); S.mistakes = S.mistakes.filter(function (m) { return m.k !== k; }); }
  function srsUpdate(key, ok) {
    var it = S.srs[key]; if (!it) return;
    it.seen = (it.seen || 0) + 1;
    if (ok) { it.box = Math.min(5, (it.box || 1) + 1); }
    else { it.box = Math.max(1, (it.box || 1) - 1); it.wrong = (it.wrong || 0) + 1; }
    it.due = addDays(today(), BOX_DAYS[it.box]);
  }
  function addToSrs(u) {
    u.vocab.forEach(function (x) {
      var k = u.id + ':' + x.en;
      if (!S.srs[k]) S.srs[k] = { en: x.en, tr: x.tr, ex: x.ex, exTr: x.exTr, u: u.id, box: 1, due: addDays(today(), 1), seen: 0, wrong: 0, added: today() };
    });
  }
  function dueItems() {
    var td = today();
    return Object.keys(S.srs).map(function (k) { var o = Object.assign({ key: k }, S.srs[k]); return o; })
      .filter(function (x) { return x.due <= td; }).sort(function (a, b) { return a.due < b.due ? -1 : 1; });
  }

  /* ================= vocabulary questions ================= */
  var PAD_EN = ['book', 'water', 'bus', 'house', 'school', 'shop', 'tea', 'bread'];
  var PAD_TR = ['kitap', 'su', 'otobüs', 'ev', 'okul', 'dükkân', 'çay', 'ekmek'];
  function distract(it, field, pool) {
    var cand = pool.filter(function (p) { return p[field] !== it[field]; }).map(function (p) { return p[field]; });
    var uniq = cand.filter(function (x, i) { return cand.indexOf(x) === i; });
    var out = sample(uniq, 3);
    var pad = shuffle(field === 'en' ? PAD_EN : PAD_TR);
    for (var i = 0; out.length < 3 && i < pad.length; i++) { if (pad[i] !== it[field] && out.indexOf(pad[i]) < 0) out.push(pad[i]); }
    return out;
  }
  function vocabQuestion(it, kind, pool) {
    var key = it.key || (it.u + ':' + it.en);
    var ex = it.ex ? ('Örnek: ' + it.ex + (it.exTr ? ' = ' + it.exTr : '')) : '';
    if (kind === 'en2tr') return { type: 'mc', q: '"' + it.en + '" ' + (S.lang === 'tr' ? 'Türkçede ne demek?' : 'means what in Turkish?'), options: [it.tr].concat(distract(it, 'tr', pool)), answer: it.tr, skill: 'vocab', vkey: key, explain: ex };
    if (kind === 'tr2en') return { type: 'mc', q: '"' + it.tr + '" ' + (S.lang === 'tr' ? 'İngilizcede nedir?' : 'in English?'), options: [it.en].concat(distract(it, 'en', pool)), answer: it.en, skill: 'vocab', vkey: key, explain: ex };
    if (kind === 'listen') return { type: 'listenmc', say: it.en, q: t('whatHeard'), options: [it.en].concat(distract(it, 'en', pool)), answer: it.en, skill: 'listening', vkey: key, explain: ex };
    return { type: 'typed', q: (S.lang === 'tr' ? 'Türkçesi: ' : 'Turkish: ') + it.tr + (S.lang === 'tr' ? '. İngilizcesini yaz:' : '. Write it in English:'), answers: [it.en], skill: 'vocab', vkey: key, explain: ex };
  }
  function vocabQuestions(items, kinds) {
    var pool = allVocab();
    return items.map(function (it, i) { return vocabQuestion(it, (kinds || ['en2tr', 'tr2en', 'listen', 'spell'])[i % (kinds ? kinds.length : 4)], pool); });
  }
  function srsQuestions(n) {
    var items = sample(dueItems(), n);
    var kinds = ['en2tr', 'listen', 'tr2en', 'spell'];
    var pool = allVocab();
    return items.map(function (it) { return vocabQuestion(it, kinds[Math.floor(Math.random() * kinds.length)], pool); });
  }
  function unitPool(u) {
    var a = [];
    (u.exercises || []).forEach(function (q) { a.push(q); });
    (u.listening || []).forEach(function (q) { a.push(q); });
    ((u.reading && u.reading.questions) || []).forEach(function (q) { a.push(withSkill(q, 'reading')); });
    var items = sample(u.vocab.map(function (x) { return { en: x.en, tr: x.tr, ex: x.ex, exTr: x.exTr, u: u.id }; }), 4);
    return a.concat(vocabQuestions(items));
  }

  /* ================= quiz engine ================= */
  var R = {};
  function qLabel(q) { return q.q || q.say || (q.words ? q.words.join(' ') : '') || ''; }

  function runQuiz(o) {
    var qs = o.questions, i = 0;
    var res = { correct: 0, total: qs.length, wrong: [], selfRated: 0 };
    function exit() { if (o.onExit) o.onExit(); else go('home'); }
    function step() { if (i >= qs.length) return finish(); renderQ(qs[i]); }

    function renderQ(q) {
      var root = clear($app());
      var answered = false;
      var body = h('div', { class: 'qbody' });
      var fb = h('div', { class: 'fb', hidden: true });
      var nudge = h('p', { class: 'nudge' });
      var actions = h('div', { class: 'actions' });
      root.appendChild(h('div', { class: 'qhead' },
        h('button', { class: 'ghost', 'aria-label': 'close', onclick: exit }, '✕'),
        h('div', { class: 'bar' }, h('i', { style: 'width:' + Math.round(i / qs.length * 100) + '%' })),
        h('span', { class: 'count' }, (i + 1) + '/' + qs.length)));
      root.appendChild(h('div', { class: 'qwrap' }, body, nudge, fb));
      root.appendChild(actions);

      var api = {
        setCheck: function (fn) { clear(actions); actions.appendChild(h('button', { class: 'btn', onclick: fn }, t('check'))); },
        nudge: function (m) { nudge.textContent = m; },
        result: function (ok, user, correct, extra) {
          if (answered) return;
          answered = true; nudge.textContent = '';
          body.classList.add('locked');
          var sk = q.skill || (q.type === 'speak' ? 'speaking' : 'grammar');
          if (!S.skill[sk]) S.skill[sk] = { c: 0, t: 0 };
          var selfRated = !!(extra && extra.self);
          if (!selfRated) { S.skill[sk].t++; if (ok) S.skill[sk].c++; } else { res.selfRated++; }
          if (ok) { res.correct++; S.xp += 10; if (o.fromMistakes) clearMistake(q); }
          else { res.wrong.push({ label: qLabel(q), correct: correct }); recordMistake(q); }
          if (q.vkey) srsUpdate(q.vkey, ok);
          markDay(); save();
          fb.hidden = false;
          fb.className = 'fb ' + (ok ? 'ok' : 'bad');
          clear(fb);
          fb.appendChild(h('b', {}, ok ? t('correct') : t('wrong')));
          if (!ok && correct) fb.appendChild(h('div', {}, t('answerIs') + ': ' + correct));
          if (extra && extra.msg) fb.appendChild(h('div', {}, extra.msg));
          if (q.explain) fb.appendChild(h('div', { class: 'exp' }, q.explain));
          clear(actions);
          var cont = h('button', { class: 'btn', onclick: function () { i++; step(); } }, t('next'));
          actions.appendChild(cont);
          setTimeout(function () { try { cont.focus(); } catch (e) { /* ignore */ } }, 30);
        }
      };
      if (window.EC) window.EC.cur = q;
      (R[q.type] || R.mc)(q, body, api);
    }

    function finish() {
      var p = res.total ? res.correct / res.total : 0;
      res.pct = p; res.pass = o.pass ? p >= o.pass : true;
      if (o.kind) pushHist({ d: today(), t: o.kind, id: o.id || '', title: o.title || '', score: Math.round(p * 100), pass: res.pass });
      save();
      if (o.onDone) o.onDone(res);
      if (o.silent) { if (o.next) o.next(res); return; }
      var root = clear($app());
      var wrongList = res.wrong.slice(0, 8).map(function (w) { return h('li', {}, w.label + (w.correct ? '  →  ' + w.correct : '')); });
      root.appendChild(h('div', { class: 'main' },
        h('div', { class: 'card' },
          h('h2', {}, o.title || t('score')),
          h('div', { class: 'big' }, Math.round(p * 100) + '%'),
          h('p', { class: 'muted' }, res.correct + ' / ' + res.total),
          o.pass ? h('p', { class: 'flash' }, res.pass ? t('passed') : t('notPassed')) : null,
          res.selfRated ? h('p', { class: 'small muted' }, t('selfRatedNote')) : null,
          wrongList.length ? h('ul', {}, wrongList) : null),
        (o.retry && !res.pass) ? h('button', { class: 'btn secondary', onclick: o.retry }, t('retry')) : null,
        h('button', { class: 'btn', onclick: function () { if (o.next) o.next(res); else go('home'); } }, t('continue'))));
    }
    step();
  }

  /* ---------- question renderers ---------- */
  function mcRender(q, body, api, withAudio) {
    var correct = typeof q.answer === 'number' ? q.options[q.answer] : q.answer;
    if (withAudio) body.appendChild(audioBtns(q.say));
    if (q.q) body.appendChild(h('p', { class: 'prompt' }, q.q));
    var list = h('div', { class: 'opts' });
    shuffle(q.options).forEach(function (opt) {
      var b = h('button', {
        class: 'opt', onclick: function () {
          Array.prototype.forEach.call(list.querySelectorAll('button'), function (x) { x.disabled = true; if (x.textContent === correct) x.classList.add('good'); });
          if (opt !== correct) b.classList.add('bad');
          api.result(opt === correct, opt, correct);
        }
      }, opt);
      list.appendChild(b);
    });
    body.appendChild(list);
    if (withAudio) setTimeout(function () { say(q.say); }, 250);
  }
  R.mc = function (q, body, api) { mcRender(q, body, api, false); };
  R.listenmc = function (q, body, api) { mcRender(q, body, api, true); };

  function typedCheck(q, inp, api, answers, shown) {
    var r = checkAnswer(inp.value, answers);
    if (r === 'ok') return api.result(true, inp.value, shown);
    if (r === 'close' && !inp._tried) { inp._tried = true; api.nudge(t('nearly')); return; }
    api.result(false, inp.value, shown);
  }
  R.fill = function (q, body, api) {
    var parts = q.q.split('___');
    var inp = h('input', { class: 'fillin', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' });
    body.appendChild(h('p', { class: 'prompt fill' }, parts[0], inp, parts.slice(1).join('___')));
    var go1 = function () { typedCheck(q, inp, api, q.answers, q.answers[0]); };
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') go1(); });
    api.setCheck(go1);
    setTimeout(function () { try { inp.focus(); } catch (e) { /* ignore */ } }, 50);
  };
  R.typed = function (q, body, api) {
    body.appendChild(h('p', { class: 'prompt' }, q.q));
    var inp = h('input', { class: 'typedin', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' });
    body.appendChild(inp);
    var go1 = function () { typedCheck(q, inp, api, q.answers, q.answers[0]); };
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') go1(); });
    api.setCheck(go1);
    setTimeout(function () { try { inp.focus(); } catch (e) { /* ignore */ } }, 50);
  };
  R.dictation = function (q, body, api) {
    body.appendChild(audioBtns(q.say));
    body.appendChild(h('p', { class: 'prompt' }, q.q || t('whatHeard')));
    var inp = h('input', { class: 'typedin', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' });
    body.appendChild(inp);
    var answers = q.answers && q.answers.length ? q.answers : [q.say];
    var go1 = function () { typedCheck(q, inp, api, answers, q.say); };
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') go1(); });
    api.setCheck(go1);
    setTimeout(function () { say(q.say); }, 250);
  };
  R.order = function (q, body, api) {
    body.appendChild(h('p', { class: 'prompt' }, q.q || ''));
    var pool = shuffle(q.words.map(function (w, idx) { return { w: w, i: idx }; }));
    var built = [];
    var built$ = h('div', { class: 'tiles' }), pool$ = h('div', { class: 'tiles' });
    body.appendChild(built$); body.appendChild(pool$);
    function draw() {
      clear(built$); clear(pool$);
      built.forEach(function (x) { built$.appendChild(h('button', { class: 'tile', onclick: function () { built = built.filter(function (y) { return y !== x; }); pool.push(x); draw(); } }, x.w)); });
      pool.forEach(function (x) { pool$.appendChild(h('button', { class: 'tile', onclick: function () { pool = pool.filter(function (y) { return y !== x; }); built.push(x); draw(); } }, x.w)); });
    }
    draw();
    api.setCheck(function () {
      var user = built.map(function (x) { return x.w; }).join(' ');
      var ok = built.length > 0 && q.answers.some(function (a) { var A = norm(a), U = norm(user); return A === U || expand(A) === expand(U); });
      api.result(ok, user, q.answers[0]);
    });
  };
  R.match = function (q, body, api) {
    body.appendChild(h('p', { class: 'prompt' }, q.q || ''));
    var left = shuffle(q.pairs.map(function (p) { return p[0]; })), right = shuffle(q.pairs.map(function (p) { return p[1]; }));
    var sel = null, mistakes = 0, remaining = q.pairs.length;
    var grid = h('div', { class: 'pair' });
    var lb = [], rb = [];
    function pairOf(l) { return q.pairs.filter(function (p) { return p[0] === l; })[0][1]; }
    left.forEach(function (l) {
      var b = h('button', { class: 'opt', onclick: function () { lb.forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); sel = { l: l, b: b }; } }, l);
      lb.push(b);
    });
    right.forEach(function (r) {
      var b = h('button', {
        class: 'opt', onclick: function () {
          if (!sel) return;
          if (pairOf(sel.l) === r) { sel.b.classList.add('gone'); b.classList.add('gone'); sel = null; remaining--; if (remaining === 0) api.result(mistakes <= 2, '', q.pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('; '), { msg: mistakes ? (mistakes + ' hata') : '' }); }
          else { mistakes++; b.classList.add('bad'); setTimeout(function () { b.classList.remove('bad'); }, 400); }
        }
      }, r);
      rb.push(b);
    });
    for (var k = 0; k < q.pairs.length; k++) { grid.appendChild(lb[k]); grid.appendChild(rb[k]); }
    body.appendChild(grid);
  };
  R.speak = function (q, body, api) {
    body.appendChild(h('p', { class: 'prompt' }, t('sayThis')));
    body.appendChild(h('div', { class: 'say' }, q.say));
    if (q.hint) body.appendChild(h('p', { class: 'hint' }, q.hint));
    body.appendChild(audioBtns(q.say));
    var info = h('p', { class: 'hint' });
    var selfBox = h('div', { hidden: true });
    function selfButtons(msg) {
      selfBox.hidden = false; clear(selfBox);
      selfBox.appendChild(h('p', { class: 'note' }, msg));
      selfBox.appendChild(h('button', { class: 'btn', onclick: function () { api.result(true, '(self)', q.say, { self: true }); } }, t('selfDone')));
      selfBox.appendChild(h('button', { class: 'btn secondary', onclick: function () { api.result(false, '(self)', q.say, { self: true }); } }, t('selfNot')));
    }
    var SR = getRecognizer();
    if (!SR) { body.appendChild(selfBox); selfButtons(t('noSpeech')); return; }
    var mic = h('button', { class: 'mic', 'aria-label': t('speak') }, '🎤');
    var busy = false;
    mic.addEventListener('click', function () {
      if (busy) return; busy = true;
      var rec = new SR();
      rec.lang = 'en-GB'; rec.interimResults = false; rec.maxAlternatives = 3; rec.continuous = false;
      mic.classList.add('on'); info.textContent = t('listening');
      var gotResult = false;
      rec.onresult = function (ev) {
        gotResult = true;
        var best = 0, bestTxt = '';
        var r0 = ev.results[0];
        for (var a = 0; a < r0.length; a++) { var sc = similarity(q.say, r0[a].transcript); if (sc >= best) { best = sc; bestTxt = r0[a].transcript; } }
        mic.classList.remove('on'); busy = false;
        var ok = best >= 0.75;
        if (!ok && !mic._retried) { mic._retried = true; info.textContent = t('heard') + ': "' + bestTxt + '" (' + t('similarity') + ' ' + Math.round(best * 100) + '%). ' + t('tryAgain'); return; }
        api.result(ok, bestTxt, q.say, { msg: t('heard') + ': "' + bestTxt + '" (' + Math.round(best * 100) + '%)' });
      };
      rec.onerror = function () { mic.classList.remove('on'); busy = false; info.textContent = ''; selfButtons(t('micErr')); };
      rec.onend = function () { mic.classList.remove('on'); busy = false; if (!gotResult && info.textContent === t('listening')) { info.textContent = t('tryAgain'); } };
      try { rec.start(); } catch (e) { busy = false; mic.classList.remove('on'); selfButtons(t('micErr')); }
    });
    body.appendChild(mic); body.appendChild(info); body.appendChild(selfBox);
    body.appendChild(h('button', { class: 'btn small secondary', onclick: function () { selfButtons(t('noSpeech')); } }, '...'));
  };

  /* ================= layout and routing ================= */
  var view = { name: 'home', p: {} };
  function $app() { return document.getElementById('app'); }
  function go(name, p) { view = { name: name, p: p || {} }; render(); }
  function topbar() {
    var due = dueItems().length;
    var me = Store.meta(LS, PID) || {};
    return h('div', { class: 'topbar' },
      h('div', { class: 'row' },
        h('button', { class: 'me', style: 'background:' + me.color, 'aria-label': t('switchProfile') + ': ' + me.name, title: me.name, onclick: function () { go('profiles'); } }, me.emoji),
        h('div', { class: 'brand' }, 'English Coach')),
      h('div', { class: 'chips' },
        h('span', { class: 'chip amber' }, '🔥 ' + S.streak.n + ' ' + t('streak')),
        h('span', { class: 'chip' }, '⭐ ' + S.xp),
        h('button', { class: 'ghost', 'aria-label': t('settings'), onclick: function () { go('settings'); } }, '⚙')),
      due ? null : null);
  }
  function nav(active) {
    var items = [['home', '🏠', t('home')], ['path', '🗺', t('path')], ['homework', '📋', t('homework')], ['exams', '🏆', t('exams')], ['progress', '📊', t('progress')]];
    return h('nav', { class: 'nav' }, h('div', { class: 'in' }, items.map(function (it) {
      return h('button', { class: it[0] === active ? 'on' : '', onclick: function () { go(it[0]); } }, h('span', { class: 'i' }, it[1]), it[2]);
    })));
  }
  function layout(active) {
    var root = clear($app());
    root.appendChild(topbar());
    var main = h('div', { class: 'main' });
    for (var i = 1; i < arguments.length; i++) add(main, arguments[i]);
    root.appendChild(main);
    root.appendChild(nav(active));
    window.scrollTo(0, 0);
  }
  function render() {
    var f = VIEWS[view.name] || VIEWS.home;
    f(view.p);
  }

  /* ================= views ================= */
  var VIEWS = {};

  VIEWS.home = function () {
    var cu = currentUnit(), due = dueItems().length, cards = [];
    if (!S.name) {
      var inp = h('input', { class: 'typedin', type: 'text', placeholder: t('name') });
      cards.push(h('div', { class: 'card' }, h('p', {}, t('welcomeName')), inp,
        h('button', { class: 'btn small', onclick: function () { setName(inp.value); render(); } }, t('ok'))));
    }
    if (!S.placed && !Object.keys(S.units).length) {
      cards.push(h('div', { class: 'card accent' }, h('h2', {}, t('placementTitle')), h('p', {}, t('placementSub')),
        h('button', { class: 'btn', onclick: startPlacement }, t('placementCta'))));
    }
    var plan = h('div', { class: 'card' }, h('h2', {}, t('today')));
    plan.appendChild(h('div', { class: 'row sp' }, h('div', {}, '🗂 ' + t('review')), h('span', { class: 'badge' }, due ? due + ' ' + t('due') : t('noDue'))));
    if (due) plan.appendChild(h('button', { class: 'btn', onclick: startReview }, t('startReview')));
    if (cu) {
      plan.appendChild(h('div', { class: 'row sp' }, h('div', {}, '📘 ' + t('unit') + ' ' + cu.id + ': ' + (S.lang === 'tr' ? cu.titleTR : cu.title)), h('span', { class: 'badge' }, nextStepLabel(cu))));
      plan.appendChild(h('button', { class: 'btn' + (due ? ' secondary' : ''), onclick: function () { go('unit', { id: cu.id }); } }, t('continue')));
    }
    plan.appendChild(h('button', { class: 'btn secondary', onclick: function () { go('homework'); } }, '📋 ' + t('homework')));
    cards.push(plan);
    layout('home', h('h1', {}, t('hello') + (S.name ? ', ' + S.name : '')), cards);
  };

  var STEPS = [['vocab', '🗂', 'vocab'], ['grammar', '📘', 'grammar'], ['practice', '✏️', 'practice'], ['listening', '🎧', 'listeningStep'], ['speaking', '🎤', 'speakingStep'], ['reading', '📖', 'reading'], ['writing', '📝', 'writing'], ['test', '✅', 'test']];
  function stepDone(u, s) { var x = S.units[u.id]; return !!(x && x.steps && x.steps[s] && x.steps[s].done); }
  function nextStepLabel(u) {
    for (var i = 0; i < STEPS.length; i++) { if (!stepDone(u, STEPS[i][0])) return t(STEPS[i][2]); }
    return t('done');
  }

  VIEWS.path = function () {
    var out = [], lastStage = '';
    var cu = currentUnit();
    C.units.forEach(function (u, i) {
      if (u.stage !== lastStage) { lastStage = u.stage; out.push(h('div', { class: 'stage' }, C.stageNames[u.stage] || u.stage)); }
      var isD = !!(S.units[u.id] && S.units[u.id].done), isSk = !!(S.units[u.id] && S.units[u.id].skipped);
      var avail = playable(u), open = unlocked(i) && avail;
      var badge = isD ? h('span', { class: 'badge done' }, '✓ ' + t('done')) : isSk ? h('span', { class: 'badge done' }, t('skipped')) : !avail ? h('span', { class: 'badge soon' }, t('soon')) : !open ? h('span', { class: 'badge soon' }, '🔒') : h('span', { class: 'badge' }, nextStepLabel(u));
      out.push(h('button', { class: 'unit' + (open ? '' : ' locked') + (cu && cu.id === u.id ? ' cur' : ''), onclick: function () { if (!avail) { toast(t('noContent')); } else if (!open) { toast(t('completePrev')); } else go('unit', { id: u.id }); } },
        h('span', { class: 'num' }, u.id), h('span', { class: 'grow' }, S.lang === 'tr' ? u.titleTR : u.title), badge));
    });
    layout('path', h('h1', {}, t('path')), out);
  };

  VIEWS.unit = function (p) {
    var u = unitById(p.id);
    if (!playable(u)) { go('path'); return; }
    var prereq = stepDone(u, 'vocab') && stepDone(u, 'grammar') && stepDone(u, 'practice');
    var list = STEPS.map(function (st) {
      var done = stepDone(u, st[0]);
      var off = st[0] === 'test' && !prereq;
      return h('button', { class: 'step' + (done ? ' done' : '') + (off ? ' off' : ''), onclick: function () { if (off) { toast(t('needPractice')); } else runStep(u, st[0]); } },
        h('span', { class: 'ic' }, st[1]), h('span', { class: 'grow' }, t(st[2])), done ? h('span', { class: 'badge done' }, '✓') : null);
    });
    layout('path', h('div', { class: 'row' }, h('button', { class: 'ghost', onclick: function () { go('path'); } }, '←'), h('h1', {}, u.id + ' ' + (S.lang === 'tr' ? u.titleTR : u.title))),
      h('div', { class: 'card accent' }, h('p', { class: 'small' }, u.can)), list);
  };

  function runStep(u, s) {
    var back = function () { go('unit', { id: u.id }); };
    function mark(step, score) { var x = US(u.id); x.steps[step] = { done: true, score: score === undefined ? null : score, d: today() }; markDay(); save(); }
    if (s === 'vocab') return stepVocab(u, back, mark);
    if (s === 'grammar') return stepGrammar(u, back, mark);
    if (s === 'practice') return runQuiz({ title: t('practice'), kind: 'practice', id: u.id, questions: shuffle(u.exercises), onDone: function (r) { mark('practice', Math.round(r.pct * 100)); }, next: back, onExit: back });
    if (s === 'listening') return runQuiz({ title: t('listeningStep'), kind: 'listening', id: u.id, questions: u.listening.slice(), onDone: function (r) { mark('listening', Math.round(r.pct * 100)); }, next: back, onExit: back });
    if (s === 'speaking') return runQuiz({ title: t('speakingStep'), kind: 'speaking', id: u.id, questions: u.speaking.slice(), onDone: function (r) { mark('speaking', Math.round(r.pct * 100)); }, next: back, onExit: back });
    if (s === 'reading') return stepReading(u, back, mark);
    if (s === 'writing') return writingEditor({ unit: u, w: u.writing, back: back, onSaved: function () { mark('writing', null); } });
    if (s === 'test') return startUnitTest(u, back, mark);
  }

  function stepVocab(u, back, mark) {
    var i = 0, shown = false;
    function draw() {
      var x = u.vocab[i];
      layout('path',
        h('div', { class: 'row' }, h('button', { class: 'ghost', onclick: back }, '←'), h('h2', {}, t('cards') + ' ' + (i + 1) + '/' + u.vocab.length)),
        h('div', { class: 'card' },
          h('div', { class: 'say' }, x.en), audioBtns(x.en),
          shown ? h('div', {}, h('p', { class: 'prompt' }, x.tr), x.ex ? h('p', {}, '“' + x.ex + '”') : null, x.ex ? audioBtns(x.ex) : null, x.exTr ? h('p', { class: 'hint' }, x.exTr) : null)
            : h('button', { class: 'btn secondary', onclick: function () { shown = true; draw(); } }, t('flipShow'))),
        h('div', { class: 'row' },
          h('button', { class: 'btn secondary', disabled: i === 0, onclick: function () { i--; shown = false; draw(); } }, t('prev')),
          i < u.vocab.length - 1 ? h('button', { class: 'btn', onclick: function () { i++; shown = false; draw(); } }, t('next'))
            : h('button', { class: 'btn', onclick: function () { addToSrs(u); save(); startMini(); } }, t('miniTest'))));
    }
    function startMini() {
      var items = u.vocab.map(function (x) { return { en: x.en, tr: x.tr, ex: x.ex, exTr: x.exTr, u: u.id }; });
      runQuiz({ title: t('vocab'), kind: 'vocab', id: u.id, questions: vocabQuestions(sample(items, Math.min(8, items.length)), ['en2tr', 'tr2en', 'listen', 'spell']), onDone: function (r) { mark('vocab', Math.round(r.pct * 100)); }, next: back, onExit: back });
    }
    draw();
  }

  function stepGrammar(u, back, mark) {
    var g = u.grammar;
    layout('path',
      h('div', { class: 'row' }, h('button', { class: 'ghost', onclick: back }, '←'), h('h2', {}, g.title)),
      h('div', { class: 'card gram', html: sanitize(g.html) }),
      (g.examples && g.examples.length) ? h('div', { class: 'card' }, g.examples.map(function (ex) { return h('div', { class: 'row sp' }, h('span', {}, ex), h('button', { class: 'btn small secondary', onclick: function () { say(ex); } }, '🔊')); })) : null,
      h('button', { class: 'btn', onclick: function () { mark('grammar'); back(); } }, t('understood')));
  }

  function stepReading(u, back, mark) {
    var r = u.reading;
    layout('path',
      h('div', { class: 'row' }, h('button', { class: 'ghost', onclick: back }, '←'), h('h2', {}, t('reading'))),
      h('div', { class: 'card' }, r.text.split('\n').map(function (l) { return h('p', {}, l); }),
        hasTts() ? h('button', { class: 'btn small secondary', onclick: function () { say(r.text.replace(/\n/g, ' '), 0.85); } }, '🔊 ' + t('readAloud')) : null),
      (r.glossary && r.glossary.length) ? h('div', { class: 'card small' }, h('b', {}, t('glossary') + ': '), r.glossary.map(function (g) { return g[0] + ' = ' + g[1]; }).join(' · ')) : null,
      h('button', { class: 'btn', onclick: function () { runQuiz({ title: t('reading'), kind: 'reading', id: u.id, questions: r.questions.map(function (q) { return withSkill(q, 'reading'); }), onDone: function (res) { mark('reading', Math.round(res.pct * 100)); }, next: back, onExit: back }); } }, t('answerQs')));
  }

  function startUnitTest(u, back, mark) {
    var pool = unitPool(u).filter(function (q) { return q.type !== 'speak'; });
    var go2 = function () {
      runQuiz({
        title: t('test') + ' ' + u.id, kind: 'unit-test', id: u.id, pass: 0.8, questions: sample(pool, Math.min(10, pool.length)),
        onDone: function (r) { var x = US(u.id); x.test = { score: Math.round(r.pct * 100), pass: r.pass, d: today() }; if (r.pass) { x.done = true; mark('test', Math.round(r.pct * 100)); } save(); },
        retry: go2, next: back, onExit: back
      });
    };
    go2();
  }

  /* ---------- writing editor ---------- */
  function autoChecks(text) {
    var words = (text.trim().match(/\S+/g) || []).length;
    var out = [];
    var sentences = text.split(/[.!?]+\s+/).filter(function (x) { return x.trim(); });
    var badStart = sentences.filter(function (x) { return /^[a-z]/.test(x.trim()); }).length;
    out.push({ ok: badStart === 0, msg: S.lang === 'tr' ? 'Her cümle büyük harfle başlıyor' : 'Every sentence starts with a capital letter' });
    out.push({ ok: !/(^|\s)i(\s|$|')/.test(text), msg: S.lang === 'tr' ? '"I" her zaman büyük harf' : '"I" is always a capital letter' });
    out.push({ ok: /[.!?]\s*$/.test(text.trim()) || !text.trim(), msg: S.lang === 'tr' ? 'Metin noktalama ile bitiyor' : 'The text ends with punctuation' });
    out.push({ ok: !/ {2,}/.test(text), msg: S.lang === 'tr' ? 'Fazladan boşluk yok' : 'No extra spaces' });
    return { words: words, items: out };
  }
  function writingEditor(o) {
    var w = o.w;
    var ta = h('textarea', { placeholder: 'Write here...', spellcheck: 'false' });
    var count = h('p', { class: 'muted small' });
    var checks = h('div', {});
    var ownList = h('div', {});
    (w.checklist || []).forEach(function (c) { ownList.appendChild(h('label', { class: 'check' }, h('input', { type: 'checkbox' }), h('span', {}, c))); });
    function upd() {
      var r = autoChecks(ta.value);
      count.textContent = r.words + ' / ' + w.minWords + ' ' + t('wordCount');
      clear(checks);
      r.items.forEach(function (it) { checks.appendChild(h('div', { class: 'small' }, (it.ok ? '✓ ' : '✗ ') + it.msg)); });
    }
    ta.addEventListener('input', upd);
    var unitLabel = o.unit ? ('unit ' + o.unit.id + ' (' + o.unit.title + ')') : (o.stage ? ('stage exam ' + o.stage) : '');
    function prompt() {
      return 'Please check my English writing. Learner level: beginner (' + (o.unit ? o.unit.stage : (o.stage || 'A1')) + '), ' + unitLabel + '.\nTask: ' + w.prompt +
        '\nGive 2 or 3 corrections only, explain in simple Turkish where needed, then ask me to rewrite it.\n\nMy text:\n' + ta.value;
    }
    function saveIt() {
      var r = autoChecks(ta.value);
      if (r.words < Math.ceil(w.minWords * 0.8)) { toast(t('minWordsMsg') + ' ' + w.minWords); return false; }
      S.writings.push({ d: today(), unit: o.unit ? o.unit.id : '', stage: o.stage || '', text: ta.value, words: r.words });
      if (S.writings.length > 40) S.writings.shift();
      S.xp += 20; markDay(); save();
      if (o.onSaved) o.onSaved();
      toast(t('writingSaved'));
      return true;
    }
    var root = clear($app());
    root.appendChild(h('div', { class: 'qhead' }, h('button', { class: 'ghost', onclick: o.back }, '✕'), h('div', { class: 'grow' }), h('span', { class: 'count' }, t('writing'))));
    root.appendChild(h('div', { class: 'qwrap' },
      h('p', { class: 'prompt' }, w.prompt), w.promptTR ? h('p', { class: 'hint' }, w.promptTR) : null,
      ta, count, h('h3', {}, t('autoChecks')), checks, h('h3', {}, t('selfCheck')), ownList,
      h('button', { class: 'btn', onclick: function () { if (saveIt()) o.back(); } }, t('saveWriting')),
      h('button', { class: 'btn secondary', onclick: function () { if (ta.value.trim()) { copyText(prompt()); } else toast(t('minWordsMsg') + ' ' + w.minWords); } }, '📋 ' + t('askClaude'))));
    upd();
  }

  /* ---------- review ---------- */
  function startReview(back) {
    var qs = srsQuestions(12);
    if (!qs.length) { toast(t('noDue')); return; }
    var b = typeof back === 'function' ? back : function () { go('home'); };
    runQuiz({ title: t('review'), kind: 'review', questions: qs, onExit: b, next: b });
  }

  /* ---------- homework ---------- */
  function buildHw() {
    var cu = currentUnit() || (function () { var last = null; C.units.forEach(function (u) { if (playable(u) && isDone(u)) last = u; }); return last; })();
    var tasks = [];
    if (Object.keys(S.srs).length) tasks.push({ id: 'review', title: t('hwReview') });
    if (S.mistakes.length) tasks.push({ id: 'mistakes', title: t('hwMistakes') });
    if (cu) {
      tasks.push({ id: 'listening', title: t('hwListening'), unit: cu.id });
      tasks.push({ id: 'speaking', title: t('hwSpeaking'), unit: cu.id });
      tasks.push({ id: 'writing', title: t('hwWriting'), unit: cu.id });
    }
    return { date: today(), tasks: tasks };
  }
  VIEWS.homework = function () {
    if (!S.hw || S.hw.date !== today()) { S.hw = buildHw(); save(); }
    var hw = S.hw, back = function () { go('homework'); };
    var allDone = hw.tasks.length && hw.tasks.every(function (x) { return x.done; });
    var list = hw.tasks.map(function (task) {
      return h('button', { class: 'step' + (task.done ? ' done' : ''), onclick: function () { runHw(task, back); } },
        h('span', { class: 'ic' }, { review: '🗂', mistakes: '🔁', listening: '🎧', speaking: '🎤', writing: '📝' }[task.id]),
        h('span', { class: 'grow' }, task.title + (task.id === 'mistakes' ? ' (' + S.mistakes.length + ')' : '')), task.done ? h('span', { class: 'badge done' }, t('hwDoneBadge')) : null);
    });
    layout('homework', h('h1', {}, t('hwTitle')), hw.tasks.length ? list : h('div', { class: 'card' }, t('hwEmpty')), allDone ? h('div', { class: 'card accent' }, h('b', {}, t('hwDone'))) : null);
  };
  function runHw(task, back) {
    function fin() { task.done = true; save(); }
    var u = task.unit ? unitById(task.unit) : null;
    if (task.id === 'review') {
      var qs = srsQuestions(10);
      if (!qs.length) { var items = sample(Object.keys(S.srs).map(function (k) { return Object.assign({ key: k }, S.srs[k]); }), 8); qs = items.map(function (it) { return vocabQuestion(it, 'en2tr', allVocab()); }); }
      return runQuiz({ title: task.title, kind: 'homework', questions: qs, onDone: fin, next: back, onExit: back });
    }
    if (task.id === 'mistakes') {
      var ms = sample(S.mistakes.map(function (m) { return m.q; }), 8);
      if (!ms.length) { fin(); return back(); }
      return runQuiz({ title: task.title, kind: 'homework', questions: ms, fromMistakes: true, onDone: fin, next: back, onExit: back });
    }
    if (!u) return back();
    if (task.id === 'listening') return runQuiz({ title: task.title, kind: 'homework', questions: sample(u.listening, 3), onDone: fin, next: back, onExit: back });
    if (task.id === 'speaking') return runQuiz({ title: task.title, kind: 'homework', questions: sample(u.speaking, 3), onDone: fin, next: back, onExit: back });
    if (task.id === 'writing') return writingEditor({ unit: u, w: u.writing, back: back, onSaved: fin });
  }

  /* ---------- exams ---------- */
  var BAND_START = { '-1': '0.1', '0': '1.1', '1': '2.1', '2': '2.7', '3': '3.1' };
  function startPlacement() {
    var band = 0;
    function runBand() {
      runQuiz({
        title: t('placementTitle') + ' ' + (band + 1) + '/4', kind: null, silent: true, questions: C.placement[band].slice(),
        onExit: function () { go('home'); },
        next: function (res) {
          var passBand = res.correct >= 4;
          if (passBand && band < C.placement.length - 1) { band++; runBand(); }
          else finishPlacement(passBand ? band : band - 1);
        }
      });
    }
    runBand();
  }
  function finishPlacement(bandPassed) {
    var startId = BAND_START[String(bandPassed)];
    var startIdx = 0;
    C.units.forEach(function (u, i) { if (u.id === startId) startIdx = i; });
    C.units.forEach(function (u, i) {
      var x = S.units[u.id];
      if (i < startIdx) { if (!x || !x.done) { S.units[u.id] = Object.assign(x || { steps: {} }, { skipped: true }); } }
      else if (x && x.skipped) { delete x.skipped; }
    });
    S.placed = { band: bandPassed, start: startId, d: today() };
    pushHist({ d: today(), t: 'placement', id: '', title: t('placementCard'), score: (bandPassed + 1) * 25, pass: true });
    markDay(); save();
    var avail = playable(unitById(startId));
    layout('exams', h('h1', {}, t('placementDone')),
      h('div', { class: 'card accent' }, h('p', {}, (S.lang === 'tr' ? 'Başlangıç noktası: ünite ' : 'Starting point: unit ') + startId + '.'),
        avail ? null : h('p', { class: 'note' }, t('noContent')), h('p', { class: 'small muted' }, t('placementNote'))),
      h('button', { class: 'btn', onclick: function () { go('path'); } }, t('path')));
  }
  function groupOf(u) { return u.stage.split('.')[0]; }
  function groupUnits(g) { return C.units.filter(function (u) { return groupOf(u) === g; }); }
  function stageEligible(g) { var us = groupUnits(g); return us.length && us.every(function (u) { return playable(u) && isDone(u); }); }

  VIEWS.exams = function () {
    var cards = [];
    cards.push(h('div', { class: 'card' }, h('h2', {}, t('placementCard')), h('p', { class: 'small muted' }, S.placed ? ((S.lang === 'tr' ? 'Son sonuç: ünite ' : 'Last result: unit ') + S.placed.start + ' (' + S.placed.d + ')') : t('placementSub')),
      h('button', { class: 'btn' + (S.placed ? ' secondary' : ''), onclick: startPlacement }, S.placed ? t('retry') : t('placementCta'))));
    var stageCards = ['S0', 'A1', 'A2', 'B1'].map(function (g) {
      var ok = stageEligible(g), rec = S.exams[g];
      return h('div', { class: 'card' }, h('div', { class: 'row sp' }, h('h3', {}, (g === 'S0' ? 'Stage 0' : g)), rec ? h('span', { class: 'badge ' + (rec.passed ? 'done' : '') }, rec.passed ? '✓ ' + rec.a + '%' : rec.a + '%') : null),
        ok ? h('button', { class: 'btn', onclick: function () { startStageExam(g); } }, t('start')) : h('p', { class: 'small muted' }, t('stageExamRule')));
    });
    var unitTests = C.units.filter(playable).map(function (u) {
      var tst = S.units[u.id] && S.units[u.id].test;
      return h('button', { class: 'unit', onclick: function () { go('unit', { id: u.id }); } }, h('span', { class: 'num' }, u.id), h('span', { class: 'grow' }, S.lang === 'tr' ? u.titleTR : u.title),
        tst ? h('span', { class: 'badge ' + (tst.pass ? 'done' : '') }, tst.score + '%') : h('span', { class: 'badge soon' }, '-'));
    });
    layout('exams', h('h1', {}, t('exams')), cards, h('div', { class: 'stage' }, t('stageExams')), stageCards, h('div', { class: 'stage' }, t('unitTests')), unitTests);
  };

  function startStageExam(g) {
    var us = groupUnits(g).filter(playable), data = C.stages[g] || { speak: [], writing: null };
    var pool = [];
    us.forEach(function (u) { pool = pool.concat(unitPool(u).filter(function (q) { return q.type !== 'speak'; })); });
    var result = { a: 0, speak: 0, speakN: 0, writing: false };
    function partA() {
      runQuiz({ title: t('partA'), kind: 'stage-exam', id: g, pass: 0.8, silent: true, questions: sample(pool, Math.min(20, pool.length)), onExit: function () { go('exams'); },
        next: function (r) { result.a = Math.round(r.pct * 100); partB(); } });
    }
    function partB() {
      if (!data.speak.length) return partC();
      runQuiz({ title: t('partB'), silent: true, questions: data.speak.slice(), onExit: function () { go('exams'); },
        next: function (r) { result.speak = r.correct; result.speakN = r.total; partC(); } });
    }
    function partC() {
      if (!data.writing) return fin();
      writingEditor({ stage: g, w: data.writing, back: function () { fin(); }, onSaved: function () { result.writing = true; } });
    }
    function fin() {
      var passed = result.a >= 80 && (result.speakN === 0 || result.speak >= Math.ceil(result.speakN * 0.66));
      S.exams[g] = { d: today(), a: result.a, speak: result.speak, speakN: result.speakN, writing: result.writing, passed: passed };
      pushHist({ d: today(), t: 'stage-exam', id: g, title: g, score: result.a, pass: passed }); save();
      layout('exams', h('h1', {}, t('examResult')),
        h('div', { class: 'card ' + (passed ? 'accent' : '') }, h('p', {}, t('partA') + ': ' + result.a + '%'), h('p', {}, t('partB') + ': ' + result.speak + '/' + result.speakN),
          h('p', {}, t('partC') + ': ' + (result.writing ? '✓' : '-')), h('p', { class: 'flash' }, passed ? t('examPassed') : t('examFail'))),
        data.writing ? h('button', { class: 'btn secondary', onclick: function () {
          var last = S.writings.filter(function (x) { return x.stage === g; }).slice(-1)[0];
          copyText('Please check my English writing for the ' + g + ' stage exam.\nTask: ' + data.writing.prompt + '\nGive 2 or 3 corrections only and a level estimate.\n\nMy text:\n' + (last ? last.text : '')); } }, '📋 ' + t('writingToClaude')) : null,
        h('button', { class: 'btn', onclick: function () { go('exams'); } }, t('continue')));
    }
    partA();
  }

  /* ---------- progress ---------- */
  function snapshotText() {
    var cu = currentUnit(), td = today();
    var todayHist = S.hist.filter(function (x) { return x.d === td; });
    var newWords = Object.keys(S.srs).map(function (k) { return S.srs[k]; }).filter(function (x) { return x.added === td; }).slice(0, 10).map(function (x) { return x.en + ' (' + td + ')'; });
    var review = Object.keys(S.srs).map(function (k) { return S.srs[k]; }).filter(function (x) { return x.box <= 2; }).sort(function (a, b) { return a.due < b.due ? -1 : 1; }).slice(0, 10).map(function (x) { return x.en + ' (' + x.due + ')'; });
    var gram = [];
    C.units.forEach(function (u) {
      var x = S.units[u.id]; if (!x || x.skipped) return;
      if (x.done) gram.push(u.id + ' ' + u.title + ': secure');
      else if (x.test && !x.test.pass) gram.push(u.id + ' ' + u.title + ': shaky');
      else if (x.steps && x.steps.grammar && x.steps.grammar.done) gram.push(u.id + ' ' + u.title + ': new');
    });
    var tags = {};
    S.mistakes.forEach(function (m) { var tg = m.q.tag || 'other'; tags[tg] = (tags[tg] || 0) + m.n; });
    var topTags = Object.keys(tags).sort(function (a, b) { return tags[b] - tags[a]; }).slice(0, 4).map(function (k) { return k + ' (x' + tags[k] + ')'; });
    return ['PROGRESS SNAPSHOT (from the English Coach app)',
      'Date: ' + td,
      'Learner: ' + (profileName() || S.name || 'unnamed'),
      'Stage and unit: ' + (cu ? cu.stage + ', unit ' + cu.id + ' ' + cu.title : (S.placed ? 'placement start ' + S.placed.start : 'not started')),
      'Sessions completed: ' + S.days.length + ' days studied, streak ' + S.streak.n,
      "Today's goal and result: " + (todayHist.length ? todayHist.map(function (x) { return x.t + (x.id ? ' ' + x.id : '') + ' ' + x.score + '%'; }).join('; ') : 'no activity yet'),
      'New words (max 10, with date): ' + (newWords.join(', ') || 'none today'),
      'Words to review (with next review date): ' + (review.join(', ') || 'none'),
      'Grammar status (new / shaky / secure): ' + (gram.slice(-6).join('; ') || 'none yet'),
      'Recurring errors: ' + (topTags.join(', ') || 'none recorded'),
      'Next session plan: ' + (cu ? 'continue unit ' + cu.id + ', next step: ' + nextStepLabel(cu) : 'choose next unit'),
      'Skills accuracy: ' + Object.keys(S.skill).map(function (k) { return k + ' ' + pct(S.skill[k].c, S.skill[k].t) + '%'; }).join(', ')].join('\n');
  }
  VIEWS.progress = function () {
    var us = C.units.filter(playable), done = us.filter(function (u) { return S.units[u.id] && S.units[u.id].done; }).length;
    var bars = ['vocab', 'grammar', 'listening', 'speaking', 'reading'].map(function (k) {
      var s = S.skill[k] || { c: 0, t: 0 }, p = pct(s.c, s.t);
      return h('div', {}, h('div', { class: 'row sp small' }, h('span', {}, t('skillNames')[k]), h('span', { class: 'muted' }, s.t ? p + '% (' + s.t + ')' : '-')), h('div', { class: 'meter' }, h('i', { style: 'width:' + p + '%' })));
    });
    var recent = S.hist.slice(-8).reverse().map(function (x) { return h('tr', {}, h('td', {}, x.d), h('td', {}, x.t + (x.id ? ' ' + x.id : '')), h('td', {}, x.score + '%')); });
    var snap = snapshotText();
    layout('progress', h('h1', {}, t('progress')),
      h('div', { class: 'card' }, h('div', { class: 'row sp' }, h('span', {}, t('unitsDone')), h('b', {}, done + ' / ' + us.length)), h('div', { class: 'row sp' }, h('span', {}, t('wordsLearned')), h('b', {}, Object.keys(S.srs).length)),
        h('div', { class: 'row sp' }, h('span', {}, t('daysStudied')), h('b', {}, S.days.length)), h('div', { class: 'row sp' }, h('span', {}, t('mistakesLeft')), h('b', {}, S.mistakes.length))),
      h('div', { class: 'card' }, h('h3', {}, t('skills')), bars, h('div', { class: 'row sp small' }, h('span', {}, t('writing')), h('span', { class: 'muted' }, S.writings.length))),
      h('div', { class: 'card' }, h('h3', {}, t('recent')), recent.length ? h('table', { class: 't' }, recent) : h('p', { class: 'muted small' }, '-')),
      h('div', { class: 'card' }, h('h3', {}, t('snapshot')), h('pre', { class: 'snap' }, snap), h('button', { class: 'btn', onclick: function () { copyText(snap); } }, '📋 ' + t('copySnap'))));
  };

  /* ---------- profiles ---------- */
  function fmtWhen(iso) { return iso ? fmtDate(new Date(iso)) : t('notYet'); }
  function profileStats(id) {
    var st = id === PID ? S : Store.loadProfile(LS, id, defaultState());
    var us = C.units.filter(playable);
    return { done: us.filter(function (u) { return st.units[u.id] && st.units[u.id].done; }).length, total: us.length, streak: st.streak.n };
  }
  function avatar(m, size) { return h('span', { class: 'avatar' + (size ? ' ' + size : ''), style: 'background:' + m.color, 'aria-hidden': 'true' }, m.emoji); }
  function switchTo(id) { save(); openProfile(id); go('home'); }
  /* Used at boot and after a deletion: the picker when 2 or more profiles exist, otherwise open the only one. */
  function enterApp() {
    var idx = Store.index(LS);
    if (!idx.profiles.length) { Store.createProfile(LS, { name: 'Profile 1' }, defaultState()); idx = Store.index(LS); }
    var last = Store.meta(LS, idx.active) ? idx.active : idx.profiles[0].id;
    if (idx.profiles.length > 1) { PID = null; S = Store.loadProfile(LS, last, defaultState()); go('profiles'); }
    else { openProfile(last); go('home'); }
  }
  function bare() { var root = clear($app()); var main = h('div', { class: 'main' }); root.appendChild(main); window.scrollTo(0, 0); return main; }
  function backRow(title, onBack) {
    return h('div', { class: 'row' }, onBack ? h('button', { class: 'ghost', 'aria-label': t('back'), onclick: onBack }, '←') : null, h('h1', {}, title));
  }

  VIEWS.profiles = function () {
    var cards = Store.index(LS).profiles.map(function (m) {
      var st = profileStats(m.id);
      return h('div', { class: 'pcard' + (m.id === PID ? ' cur' : '') },
        h('button', { class: 'pmain', 'data-pid': m.id, onclick: function () { switchTo(m.id); } },
          avatar(m, 'lg'), h('span', { class: 'pname' }, m.name),
          h('span', { class: 'small muted' }, '📘 ' + st.done + '/' + st.total + ' ' + t('unitsShort') + '   🔥 ' + st.streak),
          h('span', { class: 'small muted' }, t('lastUsed') + ': ' + fmtWhen(m.lastUsed))),
        h('button', { class: 'pedit', 'aria-label': t('edit') + ': ' + m.name, onclick: function () { go('profileEdit', { id: m.id }); } }, '✎'));
    });
    cards.push(h('button', { class: 'pcard padd', onclick: function () { go('profileEdit', {}); } }, h('span', { class: 'avatar lg' }, '+'), h('span', { class: 'pname' }, t('addProfile'))));
    bare().appendChild(h('div', {}, backRow(t('whoLearning'), PID ? function () { go('home'); } : null), h('div', { class: 'pgrid' }, cards)));
  };

  VIEWS.profileEdit = function (p) {
    var m = p.id ? Store.meta(LS, p.id) : null, n = Store.index(LS).profiles.length;
    var pick = { emoji: m ? m.emoji : Store.EMOJIS[n % Store.EMOJIS.length], color: m ? m.color : Store.COLORS[n % Store.COLORS.length] };
    var nameIn = h('input', { class: 'typedin', type: 'text', maxlength: '30', value: m ? m.name : '', autocomplete: 'off', 'aria-label': t('profileName') });
    var preview = h('div', { class: 'center' }), emojis = h('div', { class: 'swatches' }), colours = h('div', { class: 'swatches' });
    function draw() {
      clear(preview); preview.appendChild(avatar(pick, 'xl'));
      clear(emojis); Store.EMOJIS.forEach(function (e) { emojis.appendChild(h('button', { class: 'sw' + (e === pick.emoji ? ' on' : ''), 'aria-pressed': String(e === pick.emoji), onclick: function () { pick.emoji = e; draw(); } }, e)); });
      clear(colours); Store.COLORS.forEach(function (c) { colours.appendChild(h('button', { class: 'sw' + (c === pick.color ? ' on' : ''), style: 'background:' + c, 'aria-label': c, 'aria-pressed': String(c === pick.color), onclick: function () { pick.color = c; draw(); } })); });
    }
    function submit() {
      var name = nameIn.value.trim();
      if (!name) { toast(t('nameNeeded')); return; }
      if (m) { syncName(m.id, Store.updateProfile(LS, m.id, { name: name, emoji: pick.emoji, color: pick.color }).name); go('profiles'); return; }
      var np = Store.createProfile(LS, { name: name, emoji: pick.emoji, color: pick.color }, defaultState());
      save(); openProfile(np.id); S.name = np.name; save(); go('home');
    }
    nameIn.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
    draw();
    bare().appendChild(h('div', {}, backRow(m ? t('editProfile') : t('newProfile'), function () { go('profiles'); }),
      h('div', { class: 'card' }, preview, h('label', { class: 'fld' }, t('profileName')), nameIn, h('label', { class: 'fld' }, t('icon')), emojis,
        h('label', { class: 'fld' }, t('colour')), colours, h('button', { class: 'btn', onclick: submit }, m ? t('saveWriting') : t('create'))),
      m ? h('button', { class: 'btn secondary danger', onclick: function () { go('profileDelete', { id: m.id }); } }, '🗑 ' + t('deleteProfile')) : null));
  };

  VIEWS.profileDelete = function (p) {
    var m = Store.meta(LS, p.id);
    if (!m) { go('profiles'); return; }
    var inp = h('input', { class: 'typedin', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': t('profileName') });
    var del = h('button', {
      class: 'btn danger', disabled: true, onclick: function () {
        if (inp.value.trim() !== m.name) return;
        Store.deleteProfile(LS, m.id); toast(t('deleted'));
        if (m.id === PID) { PID = null; enterApp(); } else go('profiles');
      }
    }, t('deleteGo'));
    inp.addEventListener('input', function () { del.disabled = inp.value.trim() !== m.name; });
    bare().appendChild(h('div', {}, backRow(t('deleteProfile'), function () { go('profileEdit', { id: m.id }); }),
      h('div', { class: 'card' }, h('div', { class: 'row' }, avatar(m), h('b', {}, m.name)), h('p', {}, t('deleteAsk')), inp, del)));
  };

  /* ---------- settings ---------- */
  /* ---------- backup ---------- */
  function download(name, obj) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(obj, null, 1)], { type: 'application/json' }));
    a.download = name; a.click();
  }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'profile'; }
  var pendingImport = null;
  function importError(e) {
    var msg = { notJson: t('errNotJson'), badState: t('errBadState') }[e.code] || t('errUnknownShape');
    return msg + (e.code === 'badState' && e.detail ? ' (' + e.detail + ')' : '');
  }
  function finishImport(ids) {
    pendingImport.packs.forEach(function (p) { try { mergePack(p); } catch (e) { /* ignore */ } });
    pendingImport = null;
    if (PID && ids.indexOf(PID) >= 0) S = Store.loadProfile(LS, PID, defaultState());
    toast(t('imported'));
    go('profiles');
  }
  VIEWS.importBackup = function () {
    var P = pendingImport;
    if (!P) { go('settings'); return; }
    var many = P.kind === 'all';
    var targets = Store.index(LS).profiles;
    var sel = h('select', { 'aria-label': t('replaceExisting') }, targets.map(function (m) { return h('option', { value: m.id }, m.emoji + ' ' + m.name); }));
    if (PID) sel.value = PID;
    var replaceBox = many ? null : h('div', { class: 'card' }, h('label', { class: 'fld' }, t('replaceExisting')), sel, h('p', { class: 'note' }, t('replaceWarn')),
      h('button', { class: 'btn secondary danger', onclick: function () { finishImport(Store.importBackup(LS, P, 'replace', sel.value)); } }, t('replaceGo')));
    bare().appendChild(h('div', {}, backRow(t('restore'), function () { pendingImport = null; go('settings'); }),
      h('div', { class: 'card' }, h('p', {}, t('importFound')), h('ul', {}, P.items.map(function (it) { return h('li', {}, (it.profile.emoji || '') + ' ' + it.profile.name); })),
        h('button', { class: 'btn', onclick: function () { finishImport(Store.importBackup(LS, P, 'new')); } }, many ? t('addAllNew') : t('addAsNew')),
        many ? h('button', { class: 'btn secondary danger', onclick: function () { finishImport(Store.importBackup(LS, P, 'replace')); } }, t('replaceSame')) : null),
      replaceBox,
      h('button', { class: 'btn secondary', onclick: function () { pendingImport = null; go('settings'); } }, t('cancel'))));
  };

  VIEWS.settings = function (p) {
    var nameIn = h('input', { class: 'typedin', type: 'text', value: S.name });
    var langSel = h('select', {}, h('option', { value: 'tr' }, 'Türkçe'), h('option', { value: 'en' }, 'English'));
    langSel.value = S.lang;
    var rate = h('input', { type: 'range', min: '0.6', max: '1.1', step: '0.05', value: String(S.rate) });
    var voiceSel = h('select', {}, h('option', { value: '' }, 'Auto (en-GB)'));
    if (hasTts()) { (speechSynthesis.getVoices() || []).filter(function (v) { return /^en/i.test(v.lang); }).forEach(function (v) { voiceSel.appendChild(h('option', { value: v.name }, v.name + ' (' + v.lang + ')')); }); voiceSel.value = S.voice; }
    var fileIn = h('input', { type: 'file', accept: 'application/json,.json', hidden: true, 'data-role': 'restore' });
    var packIn = h('input', { type: 'file', accept: 'application/json,.json', hidden: true, 'data-role': 'pack' });
    fileIn.addEventListener('change', function () {
      var f = fileIn.files[0]; if (!f) return; var fr = new FileReader();
      fr.onload = function () {
        try { pendingImport = Store.parseBackup(String(fr.result)); } catch (e) { go('settings', { err: importError(e) }); return; }
        go('importBackup');
      };
      fr.readAsText(f);
    });
    packIn.addEventListener('change', function () {
      var f = packIn.files[0]; if (!f) return; var fr = new FileReader();
      fr.onload = function () {
        try {
          var pack = JSON.parse(fr.result), errs = mergePack(pack);
          if (errs.length) { alert(t('packErr') + '\n' + errs.slice(0, 8).join('\n')); return; }
          Store.addPacks(LS, [pack]); toast(t('packOk')); go('path');
        } catch (e) { alert(t('packErr') + ' ' + e.message); }
      };
      fr.readAsText(f);
    });
    layout('home', h('h1', {}, t('settings')),
      p && p.err ? h('p', { class: 'fb bad', role: 'alert' }, p.err) : null,
      h('p', { class: 'note' }, '🔒 ' + t('localNote')),
      h('button', { class: 'btn secondary', onclick: function () { go('profiles'); } }, '👥 ' + t('profiles')),
      h('div', { class: 'card' },
        h('label', { class: 'fld' }, t('name')), nameIn,
        h('label', { class: 'fld' }, t('language')), langSel,
        h('label', { class: 'fld' }, t('rate')), rate,
        h('label', { class: 'fld' }, t('voice')), voiceSel,
        h('button', { class: 'btn secondary', onclick: function () { say('Hello! This is your English voice.', parseFloat(rate.value)); } }, '🔊 ' + t('testVoice')),
        h('button', { class: 'btn', onclick: function () { setName(nameIn.value); S.lang = langSel.value; S.rate = parseFloat(rate.value); S.voice = voiceSel.value; save(); toast(t('saved')); go('home'); } }, t('saveWriting'))),
      h('div', { class: 'card' },
        h('button', { class: 'btn secondary', onclick: function () { save(); download('english-coach-' + slug(profileName()) + '-' + today() + '.json', Store.exportProfile(LS, PID)); } }, '⬇ ' + t('backupOne')),
        h('button', { class: 'btn secondary', onclick: function () { save(); download('english-coach-all-profiles-' + today() + '.json', Store.exportAll(LS)); } }, '⬇ ' + t('backupAll')),
        h('button', { class: 'btn secondary', onclick: function () { fileIn.click(); } }, '⬆ ' + t('restore')), fileIn,
        h('button', { class: 'btn secondary', onclick: function () { packIn.click(); } }, '➕ ' + t('pack')), packIn,
        h('button', { class: 'btn secondary', onclick: function () { if (confirm(t('resetAsk'))) { var keep = { name: profileName(), lang: S.lang, rate: S.rate, voice: S.voice }; S = Object.assign(defaultState(), keep); save(); go('home'); } } }, '🗑 ' + t('reset'))));
  };

  /* ================= boot ================= */
  function boot() {
    Store.migrateV1(LS);
    Store.packs(LS).forEach(function (p) { try { mergePack(p); } catch (e) { /* ignore */ } });
    if (hasTts() && speechSynthesis.addEventListener) { try { speechSynthesis.addEventListener('voiceschanged', function () { /* voices ready */ }); } catch (e) { /* ignore */ } }
    enterApp();
  }
  window.EC = { mergePack: mergePack, state: function () { return S; }, go: go, snapshot: snapshotText, check: checkAnswer, similarity: similarity, norm: norm, t: t, store: Store, ls: LS, profileId: function () { return PID; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
