/* English Coach: content. Units 0.1 to 1.4, placement test, stage exam data, validator. */
(function () {
  'use strict';

  /* ---------- builders ---------- */
  function v(en, tr, ex, exTr) { return { en: en, tr: tr, ex: ex || '', exTr: exTr || '' }; }
  function mc(q, options, answer, tag, explain) { return { type: 'mc', q: q, options: options, answer: answer, tag: tag || '', explain: explain || '' }; }
  function fill(q, answers, tag, explain) { return { type: 'fill', q: q, answers: answers, tag: tag || '', explain: explain || '' }; }
  function typed(q, answers, tag, explain) { return { type: 'typed', q: q, answers: answers, tag: tag || '', explain: explain || '' }; }
  function order(words, answers, tag, explain, q) { return { type: 'order', q: q || 'Cümleyi sırala:', words: words, answers: answers, tag: tag || '', explain: explain || '' }; }
  function match(pairs, tag) { return { type: 'match', q: 'Eşleştir:', pairs: pairs, tag: tag || '', skill: 'vocab' }; }
  function lmc(say, options, answer, tag, explain) { return { type: 'listenmc', say: say, q: 'Ne duydun?', options: options, answer: answer, tag: tag || '', skill: 'listening', explain: explain || '' }; }
  function dict(say, answers, tag) { return { type: 'dictation', say: say, q: 'Duyduğunu yaz:', answers: answers || [say], tag: tag || '', skill: 'listening' }; }
  function speak(say, hint) { return { type: 'speak', say: say, hint: hint || '', skill: 'speaking' }; }
  function rq(q, options, answer) { var o = mc(q, options, answer, 'reading'); o.skill = 'reading'; return o; }

  /* ---------- curriculum meta (all 36 units) ---------- */
  var UNITS = [
    ['0.1', 'S0', 'Sounds, letters and numbers', 'Sesler, harfler ve sayılar'],
    ['0.2', 'S0', 'To be and personal information', '"to be" ve kişisel bilgiler'],
    ['1.1', 'A1', 'About me and others', 'Ben ve diğerleri'],
    ['1.2', 'A1', 'Numbers, time and dates', 'Sayılar, saat ve tarihler'],
    ['1.3', 'A1', 'Family and people', 'Aile ve insanlar'],
    ['1.4', 'A1', 'Home and things', 'Ev ve eşyalar'],
    ['1.5', 'A1', 'Daily routine', 'Günlük rutin'],
    ['1.6', 'A1', 'Food and shopping', 'Yiyecek ve alışveriş'],
    ['1.7', 'A1', 'Town and getting around', 'Şehir ve ulaşım'],
    ['1.8', 'A1', 'Likes and abilities', 'Sevdiklerim ve yapabildiklerim'],
    ['1.9', 'A1', 'Now and around us', 'Şimdi ve çevremiz'],
    ['1.10', 'A1', 'A1 consolidation', 'A1 pekiştirme'],
    ['2.1', 'A2.1', 'Yesterday', 'Dün'],
    ['2.2', 'A2.1', 'What happened?', 'Ne oldu?'],
    ['2.3', 'A2.1', 'Health and the GP', 'Sağlık ve GP'],
    ['2.4', 'A2.1', 'Plans and invitations', 'Planlar ve davetler'],
    ['2.5', 'A2.1', 'Comparing', 'Karşılaştırma'],
    ['2.6', 'A2.1', 'Shopping and services', 'Alışveriş ve hizmetler'],
    ['2.7', 'A2.2', 'Rules and obligations', 'Kurallar ve zorunluluklar'],
    ['2.8', 'A2.2', 'Experiences', 'Deneyimler'],
    ['2.9', 'A2.2', 'Work and jobs', 'İş ve meslekler'],
    ['2.10', 'A2.2', 'School and children', 'Okul ve çocuklar'],
    ['2.11', 'A2.2', 'Messages and phone calls', 'Mesajlar ve telefon'],
    ['2.12', 'A2.2', 'Future and advice', 'Gelecek ve tavsiye'],
    ['3.1', 'B1.1', 'Telling stories', 'Hikâye anlatma'],
    ['3.2', 'B1.1', 'Life update', 'Hayat güncellemesi'],
    ['3.3', 'B1.1', 'Future and hypotheticals', 'Gelecek ve varsayımlar'],
    ['3.4', 'B1.1', 'Possibility and advice', 'Olasılık ve tavsiye'],
    ['3.5', 'B1.1', 'Describing precisely', 'Ayrıntılı betimleme'],
    ['3.6', 'B1.1', 'Opinions and discussion', 'Görüşler ve tartışma'],
    ['3.7', 'B1.2', 'Reported speech', 'Dolaylı anlatım'],
    ['3.8', 'B1.2', 'Passive voice', 'Edilgen çatı'],
    ['3.9', 'B1.2', 'Phrasal verbs and idioms', 'Phrasal verbs ve deyimler'],
    ['3.10', 'B1.2', 'Formal writing', 'Resmi yazışma'],
    ['3.11', 'B1.2', 'Understanding natural speech', 'Doğal konuşmayı anlama'],
    ['3.12', 'B1.2', 'B1 consolidation', 'B1 pekiştirme']
  ].map(function (a) { return { id: a[0], stage: a[1], title: a[2], titleTR: a[3] }; });

  var STAGE_NAMES = {
    'S0': 'Stage 0: Yeniden ısınma', 'A1': 'A1', 'A2.1': 'A2.1', 'A2.2': 'A2.2', 'B1.1': 'B1.1', 'B1.2': 'B1.2'
  };

  function def(id, data) {
    for (var i = 0; i < UNITS.length; i++) {
      if (UNITS[i].id === id) { for (var k in data) UNITS[i][k] = data[k]; return; }
    }
    throw new Error('Unknown unit ' + id);
  }

  /* ---------- Unit 0.1 ---------- */
  def('0.1', {
    can: 'Harfleri okuyabilir, 0-20 arası sayıları söyleyebilir ve selamlaşabilirim.',
    vocab: [
      v('hello', 'merhaba', 'Hello! How are you?', 'Merhaba! Nasılsın?'),
      v('goodbye', 'hoşça kal', 'Goodbye! See you tomorrow.', 'Hoşça kal! Yarın görüşürüz.'),
      v('please', 'lütfen', 'Water, please.', 'Su, lütfen.'),
      v('thank you', 'teşekkür ederim', 'Thank you very much.', 'Çok teşekkür ederim.'),
      v('sorry', 'özür dilerim', 'Sorry, I am late.', 'Özür dilerim, geç kaldım.'),
      v('excuse me', 'affedersiniz', 'Excuse me, where is the bus stop?', 'Affedersiniz, otobüs durağı nerede?'),
      v('yes', 'evet', 'Yes, please.', 'Evet, lütfen.'),
      v('no', 'hayır', 'No, thank you.', 'Hayır, teşekkürler.'),
      v('good morning', 'günaydın', 'Good morning!', 'Günaydın!'),
      v('good night', 'iyi geceler', 'Good night!', 'İyi geceler!'),
      v('How are you?', 'Nasılsın?', 'Hello! How are you?', 'Merhaba! Nasılsın?'),
      v('Nice to meet you.', 'Tanıştığımıza memnun oldum.', 'Nice to meet you.', 'Tanıştığımıza memnun oldum.')
    ],
    grammar: {
      title: 'Harfler, sayılar ve nazik sözler',
      html: '<p><b>Alfabe (British English).</b> Harflerin okunuşu Türkçeden farklıdır. Önce şunlara dikkat et:</p>' +
        '<ul><li><b>A</b> = ey, <b>E</b> = i, <b>I</b> = ay, <b>O</b> = ou, <b>U</b> = yu</li>' +
        '<li><b>G</b> = ci, <b>J</b> = cey, <b>R</b> = aa (uzun), <b>W</b> = dabıl-yu, <b>Y</b> = vay, <b>Z</b> = zed</li></ul>' +
        '<p><b>Sayılar 0-20:</b> zero, one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty.</p>' +
        '<p><b>Dikkat:</b> -teen ve -ty sayıları sık karışır. <b>fif-TEEN</b> (15): vurgu sonda ve "iin" uzun. <b>FIF-ti</b> (50): vurgu başta.</p>' +
        '<p><b>Nazik sözler:</b> İngilizlerde please, thank you, sorry ve excuse me çok sık kullanılır. Markette, otobüste, kapıda: hep kullan.</p>',
      examples: ['fifteen', 'fifty', 'Thank you very much.', 'Excuse me, please.']
    },
    exercises: [
      mc('Hangisi 15 sayısıdır?', ['fifteen', 'fifty', 'fourteen', 'fifth'], 'fifteen', 'numbers', 'fifteen = 15, fifty = 50. Vurguya dikkat: fifTEEN ve FIFty.'),
      mc('Sabah selamlaşması hangisi?', ['Good morning', 'Good night', 'Goodbye', 'Sorry'], 'Good morning', 'greetings', 'Good morning sabah, good night yatmadan önce söylenir.'),
      typed('12 sayısını İngilizce yaz:', ['twelve'], 'numbers'),
      typed('20 sayısını İngilizce yaz:', ['twenty'], 'numbers'),
      mc("'Lütfen' hangisi?", ['please', 'sorry', 'yes', 'no'], 'please', 'polite words'),
      fill('Thank ___!', ['you'], 'polite words'),
      fill('___ me, where is the bus stop?', ['Excuse'], 'polite words'),
      order(['Nice', 'to', 'meet', 'you'], ['Nice to meet you'], 'greetings'),
      match([['hello', 'merhaba'], ['goodbye', 'hoşça kal'], ['sorry', 'özür dilerim'], ['yes', 'evet']], 'vocab'),
      mc('Hangi harf "ey" diye okunur?', ['A', 'E', 'I', 'O'], 'A', 'alphabet'),
      mc('Hangi harf "ay" diye okunur?', ['A', 'E', 'I', 'Y'], 'I', 'alphabet')
    ],
    listening: [
      lmc('fifteen', ['fifteen', 'fifty', 'fourteen', 'five'], 'fifteen', 'numbers'),
      lmc('fifty', ['fifteen', 'fifty', 'fifth', 'fourteen'], 'fifty', 'numbers'),
      dict('Thank you'),
      dict('Good morning'),
      dict('seven eight nine', ['789', 'seven eight nine'], 'numbers')
    ],
    speaking: [
      speak('Hello! How are you?', 'Merhaba! Nasılsın?'),
      speak('Nice to meet you.', 'Tanıştığımıza memnun oldum.'),
      speak('Thank you very much.', 'Çok teşekkür ederim.'),
      speak('Excuse me, please.', 'Affedersiniz, lütfen.')
    ],
    reading: {
      text: 'At the shop door: OPEN or CLOSED.\nOn the door: PUSH or PULL.\nNear the stairs: EXIT.\nNext to the cafe: TOILETS.',
      glossary: [['open', 'açık'], ['closed', 'kapalı'], ['push', 'itin'], ['pull', 'çekin'], ['exit', 'çıkış'], ['toilets', 'tuvaletler']],
      questions: [
        rq('Dükkânın kapısında CLOSED yazıyor. Ne demek?', ['The shop is open', 'The shop is closed', 'The shop is cheap', 'The shop is big'], 'The shop is closed'),
        rq('Binadan çıkmak istiyorsun. Hangi tabelayı izlersin?', ['EXIT', 'OPEN', 'PUSH', 'TOILETS'], 'EXIT'),
        rq('Kapıda PULL yazıyor. Ne yaparsın?', ['Push it', 'Pull it', 'Run', 'Wait'], 'Pull it')
      ]
    },
    writing: {
      prompt: 'Write a short note to a neighbour. Say hello, say your name and say thank you. (10 to 20 words)',
      promptTR: 'Komşuna kısa bir not yaz: merhaba de, adını söyle ve teşekkür et. (10-20 kelime)',
      minWords: 10,
      checklist: ['Hello yazdım', 'Adımı büyük harfle yazdım', 'Thank you yazdım', 'Her cümleyi nokta ile bitirdim']
    }
  });

  /* ---------- Unit 0.2 ---------- */
  def('0.2', {
    can: '"I am..." ile kendimi tanıtabilir, kim olduğumu ve nereli olduğumu söyleyebilirim.',
    vocab: [
      v('name', 'isim, ad', 'My name is Elif.', 'Benim adım Elif.'),
      v('from', '-den, -dan (nereli)', 'I am from Turkey.', 'Ben Türkiyeliyim.'),
      v('live', 'yaşamak', 'I live in Leeds.', 'Ben Leeds\'te yaşıyorum.'),
      v('Turkey', 'Türkiye', 'I am from Turkey.', 'Ben Türkiyeliyim.'),
      v('England', 'İngiltere', 'We live in England.', 'Biz İngiltere\'de yaşıyoruz.'),
      v('Turkish', 'Türk, Türkçe', 'I am Turkish.', 'Ben Türküm.'),
      v('English', 'İngiliz, İngilizce', 'She is English.', 'O İngiliz.'),
      v('teacher', 'öğretmen', 'She is a teacher.', 'O bir öğretmen.'),
      v('student', 'öğrenci', 'I am a student.', 'Ben bir öğrenciyim.'),
      v('doctor', 'doktor', 'He is a doctor.', 'O bir doktor.'),
      v('happy', 'mutlu', 'We are happy.', 'Biz mutluyuz.'),
      v('tired', 'yorgun', 'I am tired.', 'Ben yorgunum.')
    ],
    grammar: {
      title: '"to be": I am, you are, he/she/it is',
      html: '<p>Türkçede "Ben öğretmenim" derken ayrı bir kelime yok. İngilizcede <b>her cümlede be fiili</b> gerekir.</p>' +
        '<ul><li>I <b>am</b> = ben ...yım/im (kısa: I\'m)</li><li>you <b>are</b> = sen/siz (you\'re)</li><li>he / she / it <b>is</b> = o (he\'s, she\'s, it\'s)</li><li>we / they <b>are</b> = biz / onlar</li></ul>' +
        '<p><b>Olumsuz:</b> I am <b>not</b>, she is <b>not</b> (isn\'t), they are <b>not</b> (aren\'t).</p>' +
        '<p><b>Soru:</b> fiil öne geçer: <b>Are</b> you a student? <b>Is</b> she tired?</p>' +
        '<p><b>Dikkat 1:</b> Türkçede "o" hem erkek hem kadın içindir. İngilizcede erkek için <b>he</b>, kadın için <b>she</b>, nesne için <b>it</b>.</p>' +
        '<p><b>Dikkat 2:</b> Meslekte <b>a</b> kullanılır: I am <b>a</b> teacher.</p>',
      examples: ['I am from Turkey.', 'She is a teacher.', 'They are tired.', 'Are you a student?']
    },
    exercises: [
      fill('I ___ from Turkey.', ['am'], 'to be'),
      fill('She ___ a teacher.', ['is'], 'to be'),
      fill('They ___ tired.', ['are'], 'to be'),
      mc('He ___ happy.', ['is', 'am', 'are', 'be'], 'is', 'to be'),
      order(['I', 'am', 'not', 'hungry'], ['I am not hungry', "I'm not hungry"], 'to be'),
      order(['Are', 'you', 'a', 'student'], ['Are you a student'], 'to be'),
      typed('Çevir: Ben bir öğretmenim.', ['I am a teacher', "I'm a teacher"], 'to be', 'Türkçede olmayan "am" ve "a" burada gerekli.'),
      typed('Çevir: O (kadın) yorgun değil.', ['She is not tired', "She isn't tired", "She's not tired"], 'to be'),
      mc('Where ___ you from?', ['are', 'is', 'am'], 'are', 'to be'),
      fill('___ you a student?', ['Are'], 'to be'),
      mc('Elif is my sister. ___ is a nurse.', ['She', 'He', 'It'], 'She', 'he/she', 'Kadın için she, erkek için he.'),
      mc('Ahmet is my brother. ___ is a doctor.', ['He', 'She', 'It'], 'He', 'he/she')
    ],
    listening: [
      lmc('I am from Turkey.', ['I am from Turkey.', 'I am from Turkish.', 'He is from Turkey.', 'She is from Turkey.'], 'I am from Turkey.', 'to be'),
      dict('She is a doctor.', ['She is a doctor', "She's a doctor"], 'to be'),
      lmc('They are tired.', ['They are tired.', 'They are happy.', 'We are tired.', 'He is tired.'], 'They are tired.', 'to be'),
      dict('I am not hungry.', ['I am not hungry', "I'm not hungry"], 'to be')
    ],
    speaking: [
      speak('I am from Turkey.', 'Ben Türkiyeliyim.'),
      speak('I live in England.', 'Ben İngiltere\'de yaşıyorum.'),
      speak('I am a student.', 'Ben öğrenciyim.'),
      speak('Are you tired?', 'Yorgun musun?')
    ],
    reading: {
      text: 'Hello! I am Elif. I am from Turkey. I live in Leeds. I am a teacher. My husband is Ahmet. He is a doctor. We are happy in England.',
      glossary: [['husband', 'koca, eş'], ['we', 'biz'], ['in', '-de, -da']],
      questions: [
        rq('Elif nereli?', ['Turkey', 'England', 'Leeds', 'Scotland'], 'Turkey'),
        rq('Elif\'in mesleği ne?', ['teacher', 'doctor', 'student', 'nurse'], 'teacher'),
        rq('Ahmet kim?', ['Her husband', 'Her brother', 'Her son', 'Her teacher'], 'Her husband'),
        rq('Elif nerede yaşıyor?', ['In Leeds', 'In Turkey', 'In London', 'In Chester'], 'In Leeds')
      ]
    },
    writing: {
      prompt: 'Write 5 sentences about yourself: I am..., I am from..., I live in..., I am a..., I am (happy / tired).',
      promptTR: 'Kendin hakkında 5 cümle yaz: I am..., I am from..., I live in..., I am a..., I am (happy / tired).',
      minWords: 15,
      checklist: ['5 cümle yazdım', 'Her cümlede am / is / are var', 'Her cümle büyük harfle başlıyor', 'Meslekten önce a kullandım']
    }
  });

  /* ---------- Unit 1.1 ---------- */
  def('1.1', {
    can: 'Kendimi ve bir başkasını tanıtabilir, ad, ülke ve yaş sorabilir ve cevaplayabilirim.',
    vocab: [
      v('neighbour', 'komşu', 'She is my neighbour.', 'O benim komşum.'),
      v('friend', 'arkadaş', 'This is my friend.', 'Bu benim arkadaşım.'),
      v('country', 'ülke', 'Turkey is my country.', 'Türkiye benim ülkem.'),
      v('city', 'şehir', 'Leeds is a big city.', 'Leeds büyük bir şehir.'),
      v('job', 'iş, meslek', 'What is your job?', 'Mesleğin ne?'),
      v('engineer', 'mühendis', 'He is an engineer.', 'O bir mühendis.'),
      v('driver', 'şoför', 'She is a driver.', 'O bir şoför.'),
      v('cook', 'aşçı', 'He is a cook.', 'O bir aşçı.'),
      v('welcome', 'hoş geldin', 'Welcome to England!', 'İngiltere\'ye hoş geldin!'),
      v('Mr', 'Bay', 'Mr Brown is my neighbour.', 'Bay Brown benim komşum.'),
      v('Ms', 'Bayan (evlilik durumu belirtmeden)', 'Ms Taylor is a teacher.', 'Bayan Taylor bir öğretmen.'),
      v('How old are you?', 'Kaç yaşındasın?', 'How old are you? I am thirty.', 'Kaç yaşındasın? Otuz yaşındayım.')
    ],
    grammar: {
      title: 'Soru kelimeleri ve tanışma cümleleri',
      html: '<p><b>Temel sorular (be ile):</b></p>' +
        '<ul><li><b>What</b> is your name? = Adın ne? (What\'s your name?)</li><li><b>Where</b> are you from? = Nerelisin?</li><li><b>How old</b> are you? = Kaç yaşındasın?</li><li><b>Who</b> is she? = O kim?</li></ul>' +
        '<p><b>Yaş:</b> Türkçede "30 yaşındayım" dersin. İngilizcede de <b>I am 30</b> denir. "I have 30" <b>yanlıştır</b>.</p>' +
        '<p><b>Başkasını tanıtmak:</b> <b>This is</b> my friend. <b>She is</b> from Turkey. <b>He is</b> an engineer.</p>' +
        '<p><b>a / an:</b> Sesli harf sesiyle başlayan kelimede <b>an</b>: <b>an</b> engineer, <b>an</b> English teacher.</p>' +
        '<p><b>UK notu:</b> Tanışınca "Nice to meet you." de. "How are you?" bir selam gibidir, kısa cevap ver: "Fine, thanks. And you?"</p>',
      examples: ['What is your name?', 'Where are you from?', 'How old are you?', 'This is my friend.']
    },
    exercises: [
      fill('What ___ your name?', ['is'], 'question words'),
      fill('Where ___ you from?', ['are'], 'question words'),
      mc('How old are you? En doğru cevap hangisi?', ['I am thirty.', 'I have thirty.', 'I am thirty years.', 'My age thirty.'], 'I am thirty.', 'age', 'İngilizcede yaş için be fiili kullanılır: I am 30.'),
      order(['This', 'is', 'my', 'neighbour'], ['This is my neighbour'], 'introductions'),
      order(['Where', 'is', 'she', 'from'], ['Where is she from'], 'question order'),
      mc('Ahmet is my friend. ___ is from Turkey.', ['He', 'She', 'It'], 'He', 'he/she'),
      typed('Çevir: Bu benim arkadaşım.', ['This is my friend'], 'introductions'),
      typed('Çevir: Adın ne?', ['What is your name', "What's your name"], 'question words'),
      fill('I ___ 35.', ['am'], 'age'),
      mc('___ you from Spain? No, I am not.', ['Are', 'Is', 'Am'], 'Are', 'to be'),
      mc('He is ___ engineer.', ['an', 'a', 'the'], 'an', 'articles', 'engineer sesli harfle (e) başlar, bu yüzden an.'),
      mc('She is ___ driver.', ['a', 'an', 'the'], 'a', 'articles')
    ],
    listening: [
      dict('What is your name?', ['What is your name', "What's your name"], 'question words'),
      lmc('Where are you from?', ['Where are you from?', 'Where is he from?', 'Who are you?', 'Where are you?'], 'Where are you from?', 'question words'),
      dict('This is my friend.'),
      lmc('How old are you?', ['How old are you?', 'How are you?', 'Who are you?', 'Where are you?'], 'How old are you?', 'question words', 'How old = kaç yaşında, How are you = nasılsın.')
    ],
    speaking: [
      speak('What is your name?', 'Adın ne?'),
      speak('I am from Turkey. And you?', 'Ben Türkiyeliyim. Ya sen?'),
      speak('Nice to meet you.', 'Tanıştığımıza memnun oldum.'),
      speak('This is my friend.', 'Bu benim arkadaşım.')
    ],
    reading: {
      text: 'A: Hello. I am Sam.\nB: Hello, Sam. I am Elif. Nice to meet you.\nA: Nice to meet you, Elif. Where are you from?\nB: I am from Turkey. And you?\nA: I am from Scotland.\nB: How old are you?\nA: I am 28.',
      glossary: [['and you?', 'ya sen?'], ['Scotland', 'İskoçya']],
      questions: [
        rq('Sam nereli?', ['Scotland', 'Turkey', 'England', 'Spain'], 'Scotland'),
        rq('Elif nereli?', ['Turkey', 'Scotland', 'England', 'Spain'], 'Turkey'),
        rq('Sam kaç yaşında?', ['28', '18', '38', '82'], '28')
      ]
    },
    writing: {
      prompt: 'Write a short chat with a new neighbour. Say hello, ask their name, ask where they are from, say your name and country, and say nice to meet you. (20 to 30 words)',
      promptTR: 'Yeni bir komşuyla kısa bir sohbet yaz: selam ver, adını sor, nereli olduğunu sor, kendi adını ve ülkeni söyle, memnun oldum de. (20-30 kelime)',
      minWords: 20,
      checklist: ['Hello yazdım', 'What is your name? ve Where are you from? sorularını yazdım', 'Kendi adımı ve ülkemi yazdım', 'Nice to meet you yazdım']
    }
  });

  /* ---------- Unit 1.2 ---------- */
  def('1.2', {
    can: 'Sayıları 100\'e kadar, saati, günleri ve tarihleri söyleyip anlayabilir, randevu için gün ve saat verebilirim.',
    vocab: [
      v("o'clock", 'tam saat', "It is three o'clock.", 'Saat tam üç.'),
      v('half past', 'buçuk', 'It is half past three.', 'Saat üç buçuk.'),
      v('quarter past', 'çeyrek geçiyor', 'It is quarter past four.', 'Saat dördü çeyrek geçiyor.'),
      v('birthday', 'doğum günü', 'My birthday is in June.', 'Benim doğum günüm Haziran\'da.'),
      v('today', 'bugün', 'Today is Monday.', 'Bugün pazartesi.'),
      v('tomorrow', 'yarın', 'See you tomorrow.', 'Yarın görüşürüz.'),
      v('morning', 'sabah', 'Good morning!', 'Günaydın!'),
      v('afternoon', 'öğleden sonra', 'I am free in the afternoon.', 'Öğleden sonra müsaitim.'),
      v('evening', 'akşam', 'Good evening!', 'İyi akşamlar!'),
      v('appointment', 'randevu', 'I have an appointment on Friday.', 'Cuma günü randevum var.'),
      v('week', 'hafta', 'The class is once a week.', 'Ders haftada bir.'),
      v('month', 'ay', 'There are twelve months in a year.', 'Bir yılda on iki ay var.')
    ],
    grammar: {
      title: 'Sayılar, saat, günler ve tarihler',
      html: '<p><b>Onlar:</b> twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety, one hundred. Arası tire ile: twenty-one, forty-seven.</p>' +
        '<p><b>Saat:</b> three <b>o\'clock</b> (3:00), <b>half past</b> three (3:30), <b>quarter past</b> three (3:15), <b>quarter to</b> four (3:45).</p>' +
        '<p><b>at / on / in:</b> <b>at</b> 5 o\'clock (saat), <b>on</b> Monday (gün), <b>in</b> June (ay, yıl).</p>' +
        '<p><b>Günler:</b> Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday. Hep büyük harfle yazılır.</p>' +
        '<p><b>UK tarih formatı: gün / ay / yıl.</b> 05/03/2027 = 5 Mart 2027 (ABD\'de bu 3 Mayıs olur). Randevu kartlarında dikkat et.</p>' +
        '<p><b>Sıra sayıları:</b> 1st first, 2nd second, 3rd third, 4th fourth, 5th fifth.</p>',
      examples: ["It is half past three.", 'My appointment is on Monday.', "The lesson is at five o'clock.", 'My birthday is in June.']
    },
    exercises: [
      mc('Saat 3:30. İngilizce nasıl söylenir?', ['half past three', 'half to three', "three o'clock", 'quarter past three'], 'half past three', 'time'),
      mc('Saat 4:15. İngilizce nasıl söylenir?', ['quarter past four', 'half past four', "four o'clock", 'quarter to four'], 'quarter past four', 'time'),
      fill('My appointment is ___ Monday.', ['on'], 'prepositions of time'),
      fill("The lesson is ___ 5 o'clock.", ['at'], 'prepositions of time'),
      fill('My birthday is ___ June.', ['in'], 'prepositions of time'),
      typed('47 sayısını İngilizce yaz:', ['forty-seven', 'forty seven'], 'numbers'),
      typed('90 sayısını İngilizce yaz:', ['ninety'], 'numbers'),
      mc('UK formatında 05/03/2027 hangi tarihtir?', ['5 March 2027', '3 May 2027', '5 May 2027', '3 March 2027'], '5 March 2027', 'dates', 'UK: gün / ay / yıl.'),
      order(['My', 'appointment', 'is', 'at', 'ten', "o'clock"], ["My appointment is at ten o'clock"], 'time'),
      mc('Salıdan sonra hangi gün gelir?', ['Wednesday', 'Monday', 'Thursday', 'Friday'], 'Wednesday', 'days'),
      mc('"Yarın" hangisi?', ['tomorrow', 'today', 'morning', 'week'], 'tomorrow', 'vocab')
    ],
    listening: [
      lmc("It is half past six.", ["It is half past six.", "It is half past seven.", "It is quarter past six.", "It is six o'clock."], "It is half past six.", 'time'),
      dict('My appointment is on Friday.', ['My appointment is on Friday'], 'days'),
      lmc('It costs fifty pounds.', ['fifteen pounds', 'fifty pounds', 'five pounds', 'fifty-five pounds'], 'fifty pounds', 'numbers', 'fifteen (15) ve fifty (50) ayrımı çok önemli.'),
      dict('My birthday is in March.')
    ],
    speaking: [
      speak('What time is it?', 'Saat kaç?'),
      speak('It is half past three.', 'Saat üç buçuk.'),
      speak('My appointment is on Monday.', 'Randevum pazartesi.'),
      speak('My birthday is in June.', 'Doğum günüm Haziran\'da.')
    ],
    reading: {
      text: 'APPOINTMENT CARD\nName: Ayla Demir\nDate: 12/11/2026\nTime: 10:30\nPlace: Health Centre, Room 4',
      glossary: [['place', 'yer'], ['room', 'oda'], ['date', 'tarih']],
      questions: [
        rq('Randevu saat kaçta?', ['half past ten', "ten o'clock", 'half past eleven', 'quarter past ten'], 'half past ten'),
        rq('Tarih UK formatında 12/11/2026. Hangi ay?', ['November', 'December', 'January', 'October'], 'November'),
        rq('Randevu hangi odada?', ['Room 4', 'Room 10', 'Room 14', 'Room 40'], 'Room 4')
      ]
    },
    writing: {
      prompt: 'Write a message to make an appointment. Say the day and time you want. Use please and thank you. (15 to 25 words)',
      promptTR: 'Randevu almak için bir mesaj yaz: istediğin günü ve saati belirt, please ve thank you kullan. (15-25 kelime)',
      minWords: 15,
      checklist: ['Hello veya Good morning yazdım', 'Gün (on ...) ve saat (at ...) yazdım', 'Please yazdım', 'Thank you yazdım']
    }
  });

  /* ---------- Unit 1.3 ---------- */
  def('1.3', {
    can: 'Ailemi ve insanları tanıtabilir, sahiplik bildirebilir ve çoğul isimleri doğru kullanabilirim.',
    vocab: [
      v('mother', 'anne', 'My mother is a nurse.', 'Annem hemşire.'),
      v('father', 'baba', 'My father is tall.', 'Babam uzun boylu.'),
      v('brother', 'erkek kardeş, ağabey', 'I have got one brother.', 'Bir erkek kardeşim var.'),
      v('sister', 'kız kardeş, abla', 'My sister is a teacher.', 'Kız kardeşim öğretmen.'),
      v('husband', 'koca, eş', 'Her husband is a doctor.', 'Kocası doktor.'),
      v('wife', 'karı, eş', 'His wife is kind.', 'Karısı nazik biri.'),
      v('son', 'oğul', 'Our son is seven.', 'Oğlumuz yedi yaşında.'),
      v('daughter', 'kız evlat', 'Our daughter is four.', 'Kızımız dört yaşında.'),
      v('parents', 'anne baba', 'These are my parents.', 'Bunlar benim anne babam.'),
      v('children', 'çocuklar', 'We have two children.', 'İki çocuğumuz var.'),
      v('tall', 'uzun boylu', 'My husband is tall.', 'Kocam uzun boylu.'),
      v('kind', 'nazik, iyi kalpli', 'My neighbour is kind.', 'Komşum çok nazik.')
    ],
    grammar: {
      title: 'my / your / his / her, possessive \'s, have got, çoğul isimler',
      html: '<p><b>Sahiplik sıfatları:</b> my (benim), your (senin), <b>his</b> (onun, erkek), <b>her</b> (onun, kadın), our (bizim), their (onların).</p>' +
        '<p><b>Dikkat:</b> Türkçede "onun" cinsiyet belirtmez. İngilizcede: Ahmet\'s wife = <b>his</b> wife. Elif\'s husband = <b>her</b> husband.</p>' +
        '<p><b>\'s ile sahiplik:</b> my <b>mother\'s</b> house = annemin evi. Türkçedeki -in/-ın eki gibi düşün.</p>' +
        '<p><b>have got:</b> I <b>have got</b> two sisters. She <b>has got</b> a brother. (Kısa: I\'ve got, she\'s got.)</p>' +
        '<p><b>Çoğul:</b> çoğu isim -s alır: sister, sisters. <b>Düzensizler:</b> child, <b>children</b>; man, <b>men</b>; woman, <b>women</b>; person, <b>people</b>.</p>' +
        '<p><b>Dikkat:</b> Türkçede sayıdan sonra isim çoğul olmaz (iki kitap). İngilizcede <b>two books</b>.</p>',
      examples: ['This is my sister. Her name is Elif.', 'I have got two sisters.', 'He has got two sons.', 'My mother\'s house is big.']
    },
    exercises: [
      fill('This is my sister. ___ name is Elif.', ['Her'], 'his/her'),
      fill('Ahmet is my brother. ___ wife is a nurse.', ['His'], 'his/her'),
      mc('We have two ___.', ['children', 'child', 'childs', 'childrens'], 'children', 'plurals'),
      fill('I ___ got two sisters.', ['have', "'ve"], 'have got'),
      fill('She ___ got a brother.', ['has'], 'have got'),
      mc('This is my ___ house. (annemin evi)', ["mother's", 'mothers', "mothers'", 'mother'], "mother's", 'possessive s'),
      order(['He', 'has', 'got', 'two', 'sons'], ['He has got two sons', "He's got two sons"], 'have got'),
      typed('Çevir: Benim iki kızım var.', ['I have got two daughters', 'I have two daughters', "I've got two daughters"], 'have got'),
      typed('one woman, two ___', ['women'], 'plurals'),
      typed('one man, two ___', ['men'], 'plurals'),
      mc('"Her" mı "his" mi? Elif\'s husband = ___ husband', ['her', 'his', 'their', 'our'], 'her', 'his/her'),
      mc('two ___', ['books', 'book', 'bookes', 'bookies'], 'books', 'plurals', 'Türkçede iki kitap denir, İngilizcede sayıdan sonra çoğul gerekir.')
    ],
    listening: [
      dict('My mother has got three children.', ['My mother has got three children', "My mother's got three children"], 'have got'),
      lmc('Her husband is a doctor.', ['Her husband is a doctor.', 'His husband is a doctor.', 'Her wife is a doctor.', 'Her brother is a doctor.'], 'Her husband is a doctor.', 'his/her'),
      dict('These are my parents.'),
      lmc('We have two sons.', ['We have two sons.', 'We have two sisters.', 'We have two daughters.', 'We have one son.'], 'We have two sons.', 'plurals')
    ],
    speaking: [
      speak('This is my family.', 'Bu benim ailem.'),
      speak('I have got two children.', 'İki çocuğum var.'),
      speak('My husband is tall.', 'Kocam uzun boylu.'),
      speak('Her name is Elif.', 'Onun adı Elif.')
    ],
    reading: {
      text: 'Elif has got a small family. Her husband is Ahmet. He is a doctor. They have got two children, a son and a daughter. Their son is seven. Their daughter is four. Elif is a teacher.',
      glossary: [['small', 'küçük'], ['their', 'onların']],
      questions: [
        rq('Elif\'in kaç çocuğu var?', ['two', 'one', 'three', 'four'], 'two'),
        rq('Ahmet\'in mesleği ne?', ['doctor', 'teacher', 'nurse', 'engineer'], 'doctor'),
        rq('Oğulları kaç yaşında?', ['seven', 'four', 'six', 'eight'], 'seven'),
        rq('Kızları kaç yaşında?', ['four', 'seven', 'five', 'three'], 'four')
      ]
    },
    writing: {
      prompt: 'Describe your family (or an imaginary family) in 5 sentences. Use: have got, my / her / his, names and ages. (25 to 40 words)',
      promptTR: 'Aileni (ya da hayali bir aileyi) 5 cümleyle anlat. Şunları kullan: have got, my / her / his, isimler ve yaşlar. (25-40 kelime)',
      minWords: 25,
      checklist: ['have got / has got kullandım', 'his ve her doğru', 'Çoğul isimleri -s ile yazdım', 'Her cümle büyük harfle başlıyor ve nokta ile bitiyor']
    }
  });

  /* ---------- Unit 1.4 ---------- */
  def('1.4', {
    can: 'Evimi ve odaları anlatabilir, eşyaların yerini söyleyebilir, there is / there are kullanabilirim.',
    vocab: [
      v('kitchen', 'mutfak', 'There is a fridge in the kitchen.', 'Mutfakta bir buzdolabı var.'),
      v('bedroom', 'yatak odası', 'My bedroom is small.', 'Yatak odam küçük.'),
      v('bathroom', 'banyo', 'The bathroom is next to the bedroom.', 'Banyo yatak odasının yanında.'),
      v('living room', 'oturma odası', 'There is a sofa in the living room.', 'Oturma odasında bir kanepe var.'),
      v('table', 'masa', 'The keys are on the table.', 'Anahtarlar masanın üstünde.'),
      v('chair', 'sandalye', 'There are four chairs.', 'Dört sandalye var.'),
      v('sofa', 'kanepe', 'The sofa is blue.', 'Kanepe mavi.'),
      v('bed', 'yatak', 'The bed is big.', 'Yatak büyük.'),
      v('window', 'pencere', 'There are two windows.', 'İki pencere var.'),
      v('fridge', 'buzdolabı', 'The milk is in the fridge.', 'Süt buzdolabında.'),
      v('flat', 'daire (UK)', 'We live in a small flat.', 'Küçük bir dairede yaşıyoruz.'),
      v('garden', 'bahçe', 'There is a small garden.', 'Küçük bir bahçe var.')
    ],
    grammar: {
      title: 'a / an / the, this / that, there is / there are, yer edatları',
      html: '<p><b>a / an / the:</b> Türkçede yok, İngilizcede gerekli. <b>a</b> = bir (ünsüz sesi): a table. <b>an</b> = bir (ünlü sesi): an apple. <b>the</b> = belli olan: the kitchen.</p>' +
        '<p><b>this / that:</b> <b>this</b> = bu (yakın), <b>that</b> = şu/o (uzak). Çoğul: <b>these</b> (bunlar), <b>those</b> (şunlar).</p>' +
        '<p><b>there is / there are:</b> Türkçedeki "var" gibi. Tek için <b>There is</b> a sofa. Çoğul için <b>There are</b> two chairs. Soru: <b>Is there</b> a garden? Olumsuz: There <b>isn\'t</b> a garden.</p>' +
        '<p><b>Yer edatları:</b> <b>in</b> (içinde), <b>on</b> (üstünde), <b>under</b> (altında), <b>next to</b> (yanında), <b>behind</b> (arkasında).</p>' +
        '<p><b>Dikkat:</b> "In my house have three rooms" <b>yanlıştır</b>. Doğrusu: <b>There are</b> three rooms in my house.</p>',
      examples: ['There is a sofa in the living room.', 'There are two chairs.', 'The keys are on the table.', 'The cat is under the chair.']
    },
    exercises: [
      mc('___ apple', ['an', 'a', 'the'], 'an', 'articles', 'apple ünlü sesle başlar, bu yüzden an.'),
      fill('There ___ a sofa in the living room.', ['is'], 'there is/are'),
      fill('There ___ two chairs.', ['are'], 'there is/are'),
      mc('(Elinde tutuyorsun) ___ is my phone.', ['This', 'That', 'These', 'Those'], 'This', 'this/that'),
      mc('(Uzaktaki anahtarlar) ___ are my keys.', ['Those', 'That', 'This', 'It'], 'Those', 'this/that'),
      fill('The book is ___ the table.', ['on'], 'prepositions of place'),
      fill('The cat is ___ the chair.', ['under'], 'prepositions of place'),
      order(['There', 'is', 'a', 'lamp', 'next', 'to', 'the', 'sofa'], ['There is a lamp next to the sofa'], 'there is/are'),
      typed('Çevir: Mutfakta bir buzdolabı var.', ['There is a fridge in the kitchen', "There's a fridge in the kitchen"], 'there is/are'),
      mc('Hangisi doğru?', ['There are three rooms in my house.', 'In my house have three rooms.', 'There is three rooms in my house.', 'My house there are three rooms.'], 'There are three rooms in my house.', 'there is/are'),
      mc('"Banyo" hangisi?', ['bathroom', 'bedroom', 'kitchen', 'garden'], 'bathroom', 'vocab')
    ],
    listening: [
      lmc('The keys are on the table.', ['The keys are on the table.', 'The keys are under the table.', 'The keys are behind the table.', 'The keys are next to the table.'], 'The keys are on the table.', 'prepositions of place'),
      dict('There is a sofa in the living room.', ['There is a sofa in the living room', "There's a sofa in the living room"], 'there is/are'),
      dict('There are two windows.'),
      lmc('This is my bedroom.', ['This is my bedroom.', 'That is my bedroom.', 'This is my bathroom.', 'These are my bedrooms.'], 'This is my bedroom.', 'this/that')
    ],
    speaking: [
      speak('There is a table in my kitchen.', 'Mutfağımda bir masa var.'),
      speak('The lamp is next to the sofa.', 'Lamba kanepenin yanında.'),
      speak('There are two chairs.', 'İki sandalye var.'),
      speak('This is my flat.', 'Bu benim dairem.')
    ],
    reading: {
      text: 'TO RENT\nA small flat in Leeds.\nThere is one bedroom, a bathroom, a kitchen and a living room.\nThere is a small garden.\nThere is a fridge in the kitchen.\nRent: £750 a month.',
      glossary: [['to rent', 'kiralık'], ['rent', 'kira'], ['a month', 'ayda']],
      questions: [
        rq('Kaç yatak odası var?', ['one', 'two', 'three', 'none'], 'one'),
        rq('Mutfakta ne var?', ['a fridge', 'a sofa', 'a bed', 'a garden'], 'a fridge'),
        rq('Kira ne kadar?', ['£750 a month', '£570 a month', '£75 a month', '£750 a week'], '£750 a month')
      ]
    },
    writing: {
      prompt: 'Describe your living room. Use There is / There are and in, on, next to, under. (25 to 40 words)',
      promptTR: 'Oturma odanı anlat. There is / There are ve in, on, next to, under kullan. (25-40 kelime)',
      minWords: 25,
      checklist: ['There is ve There are kullandım', 'En az 2 yer edatı kullandım (in, on, next to, under)', 'a / an / the kullandım', 'Her cümle büyük harfle başlıyor ve nokta ile bitiyor']
    }
  });

  /* ---------- Placement test (4 bands x 5 items) ---------- */
  var PLACEMENT = [
    [
      mc("'Adın ne?' İngilizce nasıl sorulur?", ['What is your name?', 'Where are you?', 'How old are you?', 'Who is you?'], 'What is your name?', 'placement'),
      typed('15 sayısını İngilizce yaz:', ['fifteen'], 'placement'),
      typed('40 sayısını İngilizce yaz:', ['forty'], 'placement'),
      fill('I ___ from Turkey.', ['am'], 'placement'),
      typed("Çevir: Ben Türkiye'denim.", ['I am from Turkey', "I'm from Turkey"], 'placement')
    ],
    [
      typed('She ___ (work) in a shop. Doğru biçimi yaz:', ['works'], 'placement'),
      mc('There ___ two bananas on the table.', ['are', 'is', 'am', 'be'], 'are', 'placement'),
      mc('How ___ is the milk? It is 95p.', ['much', 'many', 'old', 'long'], 'much', 'placement'),
      order(['I', 'get', 'up', 'at', 'seven'], ['I get up at seven'], 'placement'),
      mc('Tom gets up at 7. He has breakfast at 8. He goes to work at 9. What time does Tom have breakfast?', ['At 8', 'At 7', 'At 9', 'At 6'], 'At 8', 'placement')
    ],
    [
      fill('Yesterday I ___ to the shop. (go)', ['went'], 'placement'),
      fill('I am ___ to visit my friend next week.', ['going'], 'placement'),
      fill('Tom is ___ than Ben. (tall)', ['taller'], 'placement'),
      mc('You ___ see a doctor. You look ill.', ['should', 'can', 'are', 'does'], 'should', 'placement'),
      mc('Hangi cümle doğru?', ['I saw him yesterday.', 'I have seen him yesterday.', 'I seen him yesterday.', 'I have saw him yesterday.'], 'I saw him yesterday.', 'placement')
    ],
    [
      fill('I ___ here since 2022. (live)', ['have lived'], 'placement'),
      fill('If it rains tomorrow, we ___ at home. (stay)', ['will stay', "'ll stay"], 'placement'),
      fill('When I arrived, they ___ dinner. (have)', ['were having'], 'placement'),
      mc('The woman ___ lives next door is a teacher.', ['who', 'which', 'whose', 'where'], 'who', 'placement'),
      mc('If I ___ more time, I would learn Spanish.', ['had', 'have', 'will have', 'would have'], 'had', 'placement')
    ]
  ];

  /* ---------- Stage exam data (speaking and writing parts) ---------- */
  var STAGES = {
    'S0': {
      speak: [speak('Hello! How are you?', 'Merhaba! Nasılsın?'), speak('I am from Turkey.', 'Ben Türkiyeliyim.'), speak('Thank you very much.', 'Çok teşekkür ederim.')],
      writing: {
        prompt: 'Write 4 sentences about yourself: your name, your country, your job or study, how you feel.',
        promptTR: 'Kendin hakkında 4 cümle yaz: adın, ülken, mesleğin veya okulun, nasıl hissettiğin.',
        minWords: 12,
        checklist: ['Adımı yazdım', 'Ülkemi yazdım', 'am / is / are doğru kullandım', 'Cümleler büyük harfle başlıyor']
      }
    },
    'A1': {
      speak: [speak('This is my family.', 'Bu benim ailem.'), speak('What time is it?', 'Saat kaç?'), speak('There is a table in my kitchen.', 'Mutfağımda bir masa var.')],
      writing: {
        prompt: 'Write about you and your family in 6 to 8 sentences. Say where you are from, where you live, and describe your home. (50 words)',
        promptTR: 'Kendini ve ailenı 6-8 cümleyle anlat: nereli olduğun, nerede yaşadığın ve evin. (50 kelime)',
        minWords: 40,
        checklist: ['to be doğru', 'have got doğru', 'There is / There are doğru', 'his / her doğru', 'Büyük harf ve noktalama']
      }
    },
    'A2': {
      speak: [speak('Yesterday I went to the shop.', 'Dün markete gittim.'), speak('I would like an appointment, please.', 'Randevu almak istiyorum, lütfen.'), speak('I am going to visit my friend.', 'Arkadaşımı ziyaret edeceğim.')],
      writing: { prompt: 'Write an email of 60 to 80 words to a friend about your weekend.', promptTR: 'Bir arkadaşına hafta sonunu anlatan 60-80 kelimelik bir e-posta yaz.', minWords: 55, checklist: ['Geçmiş zaman doğru', 'Selamlama ve kapanış var', 'Bağlaçlar (and, but, because)'] }
    },
    'B1': {
      speak: [speak('I have lived here for two years.', 'İki yıldır burada yaşıyorum.'), speak('If I had more time, I would learn another language.', 'Daha çok vaktim olsaydı başka bir dil öğrenirdim.'), speak('I think it is a good idea because it saves time.', 'Bence iyi bir fikir çünkü zaman kazandırıyor.')],
      writing: { prompt: 'Write a formal email of 120 to 150 words to complain about a service.', promptTR: 'Bir hizmetle ilgili şikâyet için 120-150 kelimelik resmi bir e-posta yaz.', minWords: 100, checklist: ['Resmi selamlama ve kapanış', 'Sorunun açık anlatımı', 'Ne istediği belli'] }
    }
  };

  /* ---------- validator (shared by the app and tools/validate.js) ---------- */
  function norm(s) {
    return String(s).toLowerCase().replace(/[’‘]/g, "'").replace(/-/g, ' ').replace(/[.,!?;:"()]/g, '').replace(/\s+/g, ' ').trim();
  }
  var QTYPES = ['mc', 'fill', 'typed', 'order', 'match', 'listenmc', 'dictation', 'speak'];
  function validateQuestion(q, where) {
    var e = [];
    if (!q || typeof q !== 'object') return [where + ': not an object'];
    if (QTYPES.indexOf(q.type) < 0) return [where + ': unknown type ' + q.type];
    if (q.type === 'mc' || q.type === 'listenmc') {
      if (!Array.isArray(q.options) || q.options.length < 2) e.push(where + ': needs 2+ options');
      else {
        var ans = typeof q.answer === 'number' ? q.options[q.answer] : q.answer;
        if (q.options.indexOf(ans) < 0) e.push(where + ': answer not in options (' + q.answer + ')');
        if (new Set(q.options).size !== q.options.length) e.push(where + ': duplicate options');
      }
      if (q.type === 'listenmc' && !q.say) e.push(where + ': missing say');
      if (q.type === 'mc' && !q.q) e.push(where + ': missing q');
    }
    if (q.type === 'fill') {
      if (!q.q || q.q.indexOf('___') < 0) e.push(where + ': fill needs ___ in q');
      if (!Array.isArray(q.answers) || !q.answers.length) e.push(where + ': fill needs answers');
    }
    if (q.type === 'typed') {
      if (!q.q) e.push(where + ': typed needs q');
      if (!Array.isArray(q.answers) || !q.answers.length) e.push(where + ': typed needs answers');
    }
    if (q.type === 'dictation') {
      if (!q.say) e.push(where + ': dictation needs say');
    }
    if (q.type === 'order') {
      if (!Array.isArray(q.words) || q.words.length < 2) e.push(where + ': order needs words');
      else if (!Array.isArray(q.answers) || !q.answers.length) e.push(where + ': order needs answers');
      else {
        var joined = norm(q.words.join(' '));
        var okOrder = q.answers.some(function (a) { return norm(a) === joined; });
        if (!okOrder) e.push(where + ': order words do not form any answer (' + joined + ')');
      }
    }
    if (q.type === 'match') {
      if (!Array.isArray(q.pairs) || q.pairs.length < 3) e.push(where + ': match needs 3+ pairs');
    }
    if (q.type === 'speak' && !q.say) e.push(where + ': speak needs say');
    return e;
  }
  function validateUnit(u) {
    var e = [];
    if (!u || !u.id) return ['unit has no id'];
    var p = 'Unit ' + u.id;
    if (!Array.isArray(u.vocab) || u.vocab.length < 6) e.push(p + ': vocab needs 6+ items');
    else u.vocab.forEach(function (x, i) { if (!x.en || !x.tr) e.push(p + ': vocab[' + i + '] needs en and tr'); });
    if (!u.grammar || !u.grammar.title || !u.grammar.html) e.push(p + ': grammar needs title and html');
    if (!Array.isArray(u.exercises) || u.exercises.length < 6) e.push(p + ': exercises needs 6+');
    else u.exercises.forEach(function (q, i) { e = e.concat(validateQuestion(q, p + ' exercises[' + i + ']')); });
    if (!Array.isArray(u.listening) || u.listening.length < 3) e.push(p + ': listening needs 3+');
    else u.listening.forEach(function (q, i) {
      if (q.type !== 'listenmc' && q.type !== 'dictation') e.push(p + ' listening[' + i + ']: must be listenmc or dictation');
      e = e.concat(validateQuestion(q, p + ' listening[' + i + ']'));
    });
    if (!Array.isArray(u.speaking) || u.speaking.length < 3) e.push(p + ': speaking needs 3+');
    else u.speaking.forEach(function (q, i) { e = e.concat(validateQuestion(q, p + ' speaking[' + i + ']')); });
    if (!u.reading || !u.reading.text || !Array.isArray(u.reading.questions) || u.reading.questions.length < 2) e.push(p + ': reading needs text and 2+ questions');
    else u.reading.questions.forEach(function (q, i) { e = e.concat(validateQuestion(q, p + ' reading[' + i + ']')); });
    if (!u.writing || !u.writing.prompt || !u.writing.minWords) e.push(p + ': writing needs prompt and minWords');
    return e;
  }

  var api = { units: UNITS, stageNames: STAGE_NAMES, placement: PLACEMENT, stages: STAGES, validateUnit: validateUnit, validateQuestion: validateQuestion, norm: norm };
  if (typeof window !== 'undefined') window.CONTENT = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
