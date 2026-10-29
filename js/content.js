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

  /* Unit 1.5 is identical to packs/unit-1.5-daily-routine.json (kept as the reference pack). */
  def('1.5', {
    "can": "Günlük rutinimi saatlerle anlatabilir, sıklık zarflarını kullanabilir ve present simple ile soru sorabilirim.",
    "vocab": [
      {
        "en": "get up",
        "tr": "kalkmak",
        "ex": "I get up at seven o'clock.",
        "exTr": "Saat yedide kalkarım."
      },
      {
        "en": "have breakfast",
        "tr": "kahvaltı yapmak",
        "ex": "She has breakfast at eight.",
        "exTr": "O saat sekizde kahvaltı yapar."
      },
      {
        "en": "go to work",
        "tr": "işe gitmek",
        "ex": "He goes to work by bus.",
        "exTr": "O işe otobüsle gider."
      },
      {
        "en": "have lunch",
        "tr": "öğle yemeği yemek",
        "ex": "We have lunch at one o'clock.",
        "exTr": "Saat birde öğle yemeği yeriz."
      },
      {
        "en": "cook dinner",
        "tr": "akşam yemeği pişirmek",
        "ex": "I cook dinner in the evening.",
        "exTr": "Akşam yemek pişiririm."
      },
      {
        "en": "go to bed",
        "tr": "yatmaya gitmek",
        "ex": "The children go to bed at nine.",
        "exTr": "Çocuklar dokuzda yatar."
      },
      {
        "en": "always",
        "tr": "her zaman",
        "ex": "I always say thank you.",
        "exTr": "Her zaman teşekkür ederim."
      },
      {
        "en": "usually",
        "tr": "genellikle",
        "ex": "I usually drink tea in the morning.",
        "exTr": "Sabahları genellikle çay içerim."
      },
      {
        "en": "sometimes",
        "tr": "bazen",
        "ex": "Sometimes we walk to the park.",
        "exTr": "Bazen parka yürüyerek gideriz."
      },
      {
        "en": "never",
        "tr": "asla, hiç",
        "ex": "She never drinks coffee.",
        "exTr": "O hiç kahve içmez."
      },
      {
        "en": "early",
        "tr": "erken",
        "ex": "I get up early.",
        "exTr": "Erken kalkarım."
      },
      {
        "en": "late",
        "tr": "geç",
        "ex": "He is late for work.",
        "exTr": "O işe geç kaldı."
      }
    ],
    "grammar": {
      "title": "Present simple: günlük rutin ve alışkanlıklar",
      "html": "<p><b>Kullanım:</b> Alışkanlıklar, rutinler ve her zaman doğru olan şeyler için.</p><ul><li>I / you / we / they + <b>fiil</b>: I <b>get</b> up. They <b>have</b> lunch.</li><li>he / she / it + <b>fiil + s</b>: He <b>gets</b> up. She <b>has</b> lunch.</li></ul><p><b>Düzensizler:</b> have → <b>has</b>, go → <b>goes</b>, do → <b>does</b>. -ch, -sh, -s ile biten fiillere -es: watch → <b>watches</b>.</p><p><b>Olumsuz:</b> I <b>don't</b> like coffee. She <b>doesn't</b> like coffee. (doesn't sonrası fiil yalın: she doesn't <b>like</b>, ✗ likes)</p><p><b>Soru:</b> <b>Do</b> you get up early? <b>Does</b> she go to school? Türkçede \"mi\" ekini kullanırsın, İngilizcede <b>do / does</b> başa gelir.</p><p><b>Sıklık zarfları:</b> always, usually, sometimes, never. Ana fiilden <b>önce</b>: I <b>always</b> get up early. \"to be\"den <b>sonra</b>: She is <b>never</b> late.</p><p><b>Dikkat:</b> \"She work\" ve \"I am work\" yanlıştır. Doğrusu: She works. I work.</p>",
      "examples": [
        "I get up at seven o'clock.",
        "She has breakfast at eight.",
        "Do you get up early?",
        "She never drinks coffee."
      ]
    },
    "exercises": [
      {
        "type": "fill",
        "q": "I ___ up at seven o'clock.",
        "answers": [
          "get"
        ],
        "tag": "present simple"
      },
      {
        "type": "fill",
        "q": "She ___ breakfast at eight.",
        "answers": [
          "has"
        ],
        "tag": "third person -s",
        "explain": "he / she / it ile have → has olur."
      },
      {
        "type": "fill",
        "q": "He ___ to work by bus.",
        "answers": [
          "goes"
        ],
        "tag": "third person -s"
      },
      {
        "type": "mc",
        "q": "They ___ lunch at one o'clock.",
        "options": [
          "have",
          "has",
          "haves",
          "having"
        ],
        "answer": "have",
        "tag": "present simple"
      },
      {
        "type": "fill",
        "q": "I ___ like coffee. (olumsuz)",
        "answers": [
          "don't",
          "do not"
        ],
        "tag": "negatives"
      },
      {
        "type": "fill",
        "q": "She ___ like tea. (olumsuz)",
        "answers": [
          "doesn't",
          "does not"
        ],
        "tag": "negatives"
      },
      {
        "type": "order",
        "q": "Cümleyi sırala:",
        "words": [
          "Do",
          "you",
          "get",
          "up",
          "early"
        ],
        "answers": [
          "Do you get up early"
        ],
        "tag": "questions"
      },
      {
        "type": "order",
        "q": "Cümleyi sırala:",
        "words": [
          "She",
          "never",
          "drinks",
          "coffee"
        ],
        "answers": [
          "She never drinks coffee"
        ],
        "tag": "adverbs of frequency"
      },
      {
        "type": "mc",
        "q": "Hangisi doğru?",
        "options": [
          "He works in a shop.",
          "He work in a shop.",
          "He is works in a shop.",
          "He working in a shop."
        ],
        "answer": "He works in a shop.",
        "tag": "third person -s"
      },
      {
        "type": "typed",
        "q": "Çevir: Ben genellikle çay içerim.",
        "answers": [
          "I usually drink tea"
        ],
        "tag": "adverbs of frequency"
      },
      {
        "type": "mc",
        "q": "___ she go to school? (soru)",
        "options": [
          "Does",
          "Do",
          "Is",
          "Are"
        ],
        "answer": "Does",
        "tag": "questions"
      },
      {
        "type": "mc",
        "q": "I ___ say thank you. (her zaman)",
        "options": [
          "always",
          "never",
          "sometimes",
          "usually"
        ],
        "answer": "always",
        "tag": "adverbs of frequency"
      }
    ],
    "listening": [
      {
        "type": "dictation",
        "say": "He goes to work by bus.",
        "q": "Duyduğunu yaz:",
        "answers": [
          "He goes to work by bus"
        ],
        "skill": "listening",
        "tag": "third person -s"
      },
      {
        "type": "listenmc",
        "say": "She has breakfast at eight.",
        "q": "Ne duydun?",
        "options": [
          "She has breakfast at eight.",
          "She has breakfast at eighty.",
          "She has lunch at eight.",
          "He has breakfast at eight."
        ],
        "answer": "She has breakfast at eight.",
        "skill": "listening",
        "tag": "present simple"
      },
      {
        "type": "dictation",
        "say": "I never drink coffee.",
        "q": "Duyduğunu yaz:",
        "answers": [
          "I never drink coffee"
        ],
        "skill": "listening",
        "tag": "adverbs of frequency"
      },
      {
        "type": "listenmc",
        "say": "Do you get up early?",
        "q": "Ne duydun?",
        "options": [
          "Do you get up early?",
          "Does she get up early?",
          "Do you go up early?",
          "Do you get up late?"
        ],
        "answer": "Do you get up early?",
        "skill": "listening",
        "tag": "questions"
      }
    ],
    "speaking": [
      {
        "type": "speak",
        "say": "I get up at seven o'clock.",
        "hint": "Saat yedide kalkarım.",
        "skill": "speaking"
      },
      {
        "type": "speak",
        "say": "She goes to work by bus.",
        "hint": "O işe otobüsle gider.",
        "skill": "speaking"
      },
      {
        "type": "speak",
        "say": "I usually drink tea.",
        "hint": "Genellikle çay içerim.",
        "skill": "speaking"
      },
      {
        "type": "speak",
        "say": "Do you get up early?",
        "hint": "Erken kalkar mısın?",
        "skill": "speaking"
      }
    ],
    "reading": {
      "text": "Sam gets up at six o'clock. He has breakfast at seven. He goes to work by bus. He has lunch at one o'clock. In the evening, he cooks dinner. He goes to bed at ten o'clock. Sam never drinks coffee.",
      "glossary": [
        [
          "in the evening",
          "akşamları"
        ],
        [
          "by bus",
          "otobüsle"
        ]
      ],
      "questions": [
        {
          "type": "mc",
          "q": "Sam saat kaçta kalkıyor?",
          "options": [
            "At six",
            "At seven",
            "At ten",
            "At one"
          ],
          "answer": "At six",
          "tag": "reading",
          "skill": "reading"
        },
        {
          "type": "mc",
          "q": "Sam işe nasıl gidiyor?",
          "options": [
            "By bus",
            "By car",
            "On foot",
            "By train"
          ],
          "answer": "By bus",
          "tag": "reading",
          "skill": "reading"
        },
        {
          "type": "mc",
          "q": "Sam ne içmez?",
          "options": [
            "Coffee",
            "Tea",
            "Water",
            "Milk"
          ],
          "answer": "Coffee",
          "tag": "reading",
          "skill": "reading"
        }
      ]
    },
    "writing": {
      "prompt": "Describe your typical day in 8 sentences. Use times and always, usually, sometimes or never. (35 to 50 words)",
      "promptTR": "Tipik bir gününü 8 cümleyle anlat. Saatler ve always, usually, sometimes, never kullan. (35-50 kelime)",
      "minWords": 35,
      "checklist": [
        "En az 5 saat yazdım (at seven ...)",
        "he / she ile fiile -s koydum (ya da I ile koymadım)",
        "En az 2 sıklık zarfı kullandım",
        "Her cümle büyük harfle başlıyor ve nokta ile bitiyor"
      ]
    }
  });

  def('1.6', {
    can: 'Kafede sipariş verebilir, markette ürün sorabilir, fiyatları anlayabilir, some / any ve how much / how many kullanabilirim.',
    vocab: [
      v('bread', 'ekmek', 'Can I have some bread, please?', 'Biraz ekmek alabilir miyim, lütfen?'),
      v('milk', 'süt', 'Is there any milk in the fridge?', 'Buzdolabında hiç süt var mı?'),
      v('egg', 'yumurta', 'I need six eggs.', 'Altı yumurtaya ihtiyacım var.'),
      v('apple', 'elma', 'How much are the apples?', 'Elmalar kaç para?'),
      v('cheese', 'peynir', "We haven't got any cheese.", 'Hiç peynirimiz yok.'),
      v('a bottle of', 'bir şişe', 'A bottle of water, please.', 'Bir şişe su, lütfen.'),
      v('a packet of', 'bir paket', "I'd like a packet of rice.", 'Bir paket pirinç istiyorum.'),
      v('a tin of', 'bir kutu (konserve)', 'A tin of tomatoes, please.', 'Bir kutu domates konservesi, lütfen.'),
      v('pound', 'sterlin (£)', "It's two pounds fifty.", 'İki sterlin elli peni.'),
      v('receipt', 'fiş', 'Would you like a receipt?', 'Fiş ister misiniz?'),
      v('bag', 'poşet, çanta', 'Do you need a bag?', 'Poşet ister misiniz?'),
      v('take away', 'paket (dışarıda yemek için)', 'Eat in or take away?', 'Burada mı yiyeceksiniz, paket mi?')
    ],
    grammar: {
      title: 'Sayılabilen ve sayılamayan isimler, some / any, how much / how many, I\'d like',
      html: '<p><b>Sayılabilen</b> isimler tekil ve çoğul olur: an apple, two apples. <b>Sayılamayan</b> isimler çoğul olmaz ve a / an almaz: milk, water, bread, rice, cheese. "a bread" veya "two breads" değil, <b>some bread</b>.</p>' +
        '<p><b>some / any:</b> Olumlu cümlede <b>some</b> (biraz, birkaç): I\'ve got some eggs. Soru ve olumsuz cümlede <b>any</b>: Is there any milk? There isn\'t any milk. Rica ederken de some: Can I have some water?</p>' +
        '<p><b>how much / how many:</b> Sayılamayan için <b>how much</b> (How much milk?), sayılabilen çoğul için <b>how many</b> (How many eggs?). Fiyat sorarken hep <b>How much</b>: How much is this? How much are the apples?</p>' +
        '<p><b>Kaplar:</b> a bottle of water, a packet of rice, a tin of tomatoes, a cup of tea, a carton of milk.</p>' +
        '<p><b>Kibar istek:</b> <b>I\'d like</b> (= I would like) a coffee, please. <b>Can I have</b> a tea, please? "I want" kaba durabilir.</p>' +
        '<p><b>Fiyatlar:</b> £3.40 = three pounds forty (kısaca: three forty). 80p = eighty pence (kısaca: eighty p).</p>' +
        '<p><b>Tonlama:</b> Evet / hayır sorularında ses sonda yükselir: Do you need a bag? ↗ Soru kelimeli sorularda genelde düşer: How much is it? ↘</p>',
      examples: ["I'd like a coffee, please.", 'Is there any milk?', 'How many eggs do you need?', 'How much is this?']
    },
    exercises: [
      mc('I need ___ milk.', ['some', 'any', 'a', 'many'], 'some', 'some/any', 'Olumlu cümlede some. milk sayılamaz, a almaz.'),
      fill('Is there ___ bread?', ['any'], 'some/any', 'Soru cümlesinde any.'),
      fill("We haven't got ___ eggs.", ['any'], 'some/any', 'Olumsuz cümlede any.'),
      mc('How ___ eggs do you need?', ['many', 'much', 'old', 'long'], 'many', 'how much/many', 'eggs sayılabilir ve çoğul: how many.'),
      mc('How ___ is the cheese?', ['much', 'many', 'old', 'far'], 'much', 'how much/many', 'Fiyat sorusu: How much.'),
      mc('Hangisi doğru?', ['I need some bread.', 'I need a bread.', 'I need two breads.', 'I need breads.'], 'I need some bread.', 'uncountable', 'bread sayılamaz: some bread.'),
      fill("I'd ___ a tea, please.", ['like'], 'would like'),
      order(['Can', 'I', 'have', 'a', 'coffee', 'please'], ['Can I have a coffee, please'], 'polite requests'),
      order(['How', 'much', 'are', 'the', 'apples'], ['How much are the apples'], 'how much/many'),
      match([['a bottle of', 'bir şişe'], ['a packet of', 'bir paket'], ['a tin of', 'bir kutu (konserve)'], ['a cup of', 'bir fincan']], 'containers'),
      typed('Çevir: Bir şişe su, lütfen.', ['A bottle of water, please', 'Can I have a bottle of water, please', "I'd like a bottle of water, please", 'I would like a bottle of water, please'], 'containers'),
      mc('"£3.40" nasıl okunur?', ['three pounds forty', 'three forty pounds', 'three pound forty', 'thirty-four pounds'], 'three pounds forty', 'prices')
    ],
    listening: [
      lmc("That's three pounds forty, please.", ['£3.40', '£3.14', '£13.40', '£30.40'], '£3.40', 'prices'),
      lmc('It costs fifty pence.', ['50p', '15p', '£50', '5p'], '50p', 'prices', 'fifty (50) ve fifteen (15): fifteen sonunda uzun ve vurgulu "TEEN".'),
      dict('Two teas, please.', ['Two teas, please', '2 teas, please'], 'plurals'),
      dict('Do you need a bag?')
    ],
    speaking: [
      speak('Can I have a tea, please?', 'Bir çay alabilir miyim, lütfen?'),
      speak("I'd like a coffee, please.", 'Bir kahve istiyorum, lütfen.'),
      speak('Excuse me, where is the milk?', 'Afedersiniz, süt nerede?'),
      speak('How much is this?', 'Bu kaç para?')
    ],
    reading: {
      text: 'CORNER CAFE\nTea £1.80\nCoffee £2.40\nHot chocolate £2.60\nCheese sandwich £3.50\nCake £2.20\nEat in or take away. Free water.',
      glossary: [['hot chocolate', 'sıcak çikolata'], ['sandwich', 'sandviç'], ['free', 'ücretsiz']],
      questions: [
        rq('Kahve ne kadar?', ['£2.40', '£1.80', '£2.60', '£3.50'], '£2.40'),
        rq('Bir çay ve bir kek toplam kaç para?', ['£4.00', '£3.60', '£4.20', '£5.30'], '£4.00'),
        rq('Hangisi ücretsiz?', ['water', 'tea', 'cake', 'coffee'], 'water')
      ]
    },
    writing: {
      prompt: "Write a shopping list and a short cafe order. Use some, a bottle of or a packet of, and I'd like. (25 to 40 words)",
      promptTR: "Bir alışveriş listesi ve kısa bir kafe siparişi yaz. some, a bottle of veya a packet of ve I'd like kullan. (25-40 kelime)",
      minWords: 25,
      checklist: ['some kullandım', 'En az 2 kap ifadesi kullandım (a bottle of, a packet of...)', "I'd like veya Can I have ile kibarca istedim", 'Sayılamayan isimlere a / an koymadım (a milk değil)']
    }
  });

  def('1.7', {
    can: 'Yol sorabilir ve tarif edebilir, otobüs ve tren bileti alabilir, can / can\'t ile rica edip izin isteyebilirim.',
    vocab: [
      v('station', 'istasyon', 'The station is near the park.', 'İstasyon parkın yakınında.'),
      v('bus stop', 'otobüs durağı', 'The bus stop is opposite the bank.', 'Otobüs durağı bankanın karşısında.'),
      v('bank', 'banka', 'Is there a bank near here?', 'Yakınlarda bir banka var mı?'),
      v('post office', 'postane', 'The post office is next to the bank.', 'Postane bankanın yanında.'),
      v('pharmacy', 'eczane', 'The pharmacy is on the left.', 'Eczane solda.'),
      v('turn left', 'sola dön', 'Turn left at the traffic lights.', 'Trafik ışıklarında sola dön.'),
      v('turn right', 'sağa dön', 'Turn right after the bank.', 'Bankadan sonra sağa dön.'),
      v('go straight on', 'düz git', 'Go straight on for two minutes.', 'İki dakika düz git.'),
      v('opposite', 'karşısında', 'The cafe is opposite the station.', 'Kafe istasyonun karşısında.'),
      v('single', 'tek yön (bilet)', 'A single to the town centre, please.', 'Şehir merkezine tek yön, lütfen.'),
      v('return', 'gidiş dönüş (bilet)', 'A return to Manchester, please.', 'Manchester için gidiş dönüş, lütfen.'),
      v('platform', 'peron', 'The train leaves from platform 2.', 'Tren 2. perondan kalkıyor.')
    ],
    grammar: {
      title: 'Emir cümleleri, yön ifadeleri, can / can\'t (rica ve izin)',
      html: '<p><b>Emir (yol tarifi):</b> Fiille başla, özne yok: <b>Turn</b> left. <b>Go</b> straight on. <b>Take</b> the second right. Olumsuz: <b>Don\'t</b> turn here.</p>' +
        '<p><b>Yön ve yer:</b> <b>along</b> the road (yol boyunca), <b>past</b> the bank (bankayı geçip), <b>across</b> the road (karşıya), <b>at</b> the traffic lights (ışıklarda), <b>on the left / on the right</b> (solda / sağda), <b>opposite</b> (karşısında), <b>near</b> (yakınında).</p>' +
        '<p><b>can / can\'t (rica ve izin):</b> <b>Can I</b> pay by card? (Kartla ödeyebilir miyim?) <b>Can you</b> help me, please? You <b>can\'t</b> park here. (Buraya park edemezsin.) can\'den sonra fiil yalın: can <b>pay</b>, "can to pay" değil.</p>' +
        '<p><b>Yer sorma:</b> Where is the station? Is there a bank near here? How do I get to the station? Does this bus go <b>to</b> the hospital? ("go hospital" değil, <b>to</b> gerekli.)</p>' +
        '<p><b>Vurgu:</b> İki heceli isimlerde vurgu çoğunlukla ilk hecede: STA-tion, TI-cket, PLAT-form, CHE-mist.</p>',
      examples: ['Turn left at the traffic lights.', 'Go straight on and the bank is on the right.', 'Can I pay by card?', 'A return to Leeds, please.']
    },
    exercises: [
      mc('Yol tarifi: "___ left at the traffic lights."', ['Turn', 'Turns', 'Turning', 'To turn'], 'Turn', 'imperatives', 'Emir cümlesi fiilin yalın hâliyle başlar.'),
      fill('Go straight ___ for two minutes.', ['on'], 'directions'),
      fill('The bank is ___ the left.', ['on'], 'prepositions', 'on the left = solda.'),
      mc('The bus stop is ___ the bank. (karşısında)', ['opposite', 'under', 'in', 'on'], 'opposite', 'prepositions'),
      mc('Hangisi doğru?', ['Can I pay by card?', 'Can I to pay by card?', 'I can pay by card?', 'Can I paying by card?'], 'Can I pay by card?', 'can', "can'den sonra fiil yalın gelir."),
      fill("You ___ park here. It's for buses. (yapamazsın)", ["can't", 'cannot'], 'can'),
      order(['Does', 'this', 'bus', 'go', 'to', 'the', 'hospital'], ['Does this bus go to the hospital'], 'questions'),
      order(['Can', 'you', 'help', 'me', 'please'], ['Can you help me, please'], 'can'),
      match([['single', 'tek yön'], ['return', 'gidiş dönüş'], ['platform', 'peron'], ['bus stop', 'otobüs durağı']], 'transport'),
      typed('Çevir: Sola dön.', ['Turn left'], 'imperatives'),
      typed('Çevir: Eczane nerede?', ['Where is the pharmacy', "Where's the pharmacy", 'Where is the chemist', "Where's the chemist"], 'questions'),
      mc('"Yakınlarda bir banka var mı?"', ['Is there a bank near here?', 'There is a bank near here?', 'Is a bank there near here?', 'Have a bank near here?'], 'Is there a bank near here?', 'there is/are', 'Türkçedeki "var mı" = Is there...?')
    ],
    listening: [
      lmc('Turn right at the traffic lights.', ['Turn right at the traffic lights.', 'Turn left at the traffic lights.', 'Turn right at the bank.', 'Go straight on at the traffic lights.'], 'Turn right at the traffic lights.', 'directions'),
      lmc('A return to Leeds, please.', ['A return to Leeds, please.', 'A single to Leeds, please.', 'Two returns to Leeds, please.', 'A return to Leicester, please.'], 'A return to Leeds, please.', 'transport'),
      dict('The train leaves from platform 4.', ['The train leaves from platform 4', 'The train leaves from platform four'], 'numbers'),
      dict('Go straight on.')
    ],
    speaking: [
      speak('Excuse me, where is the station?', 'Afedersiniz, istasyon nerede?'),
      speak('A single to the town centre, please.', 'Şehir merkezine tek yön bilet, lütfen.'),
      speak('Turn left and go straight on.', 'Sola dön ve düz git.'),
      speak('Can I pay by card?', 'Kartla ödeyebilir miyim?')
    ],
    reading: {
      text: 'Hi Elif,\nCome to my house on Saturday!\nTake the number 12 bus to Park Road. Get off at the library.\nWalk along Park Road and turn left at the traffic lights.\nMy house is number 8, opposite the pharmacy.\nSee you soon,\nKate',
      glossary: [['get off', '(otobüsten) inmek'], ['walk along', 'boyunca yürümek'], ['traffic lights', 'trafik ışıkları'], ['See you soon', 'Görüşürüz']],
      questions: [
        rq('Elif hangi otobüse binecek?', ['12', '2', '20', '8'], '12'),
        rq('Elif otobüsten nerede inecek?', ['at the library', 'at the pharmacy', 'at the station', 'at the traffic lights'], 'at the library'),
        rq("Kate'in evi nerede?", ['opposite the pharmacy', 'next to the library', 'behind the station', 'on the right after the bank'], 'opposite the pharmacy')
      ]
    },
    writing: {
      prompt: 'Give directions from your home to a shop or a bus stop. Use turn left or turn right, go straight on, and on the left or on the right. (25 to 40 words)',
      promptTR: 'Evinden bir dükkâna veya otobüs durağına yol tarifi yaz. turn left / turn right, go straight on ve on the left / on the right kullan. (25-40 kelime)',
      minWords: 25,
      checklist: ['Emir cümleleri fiille başlıyor (Turn, Go, Walk)', 'En az 2 yön ifadesi kullandım', 'on the left veya on the right kullandım', 'Her cümle büyük harfle başlıyor ve nokta ile bitiyor']
    }
  });

  def('1.8', {
    can: 'Hobilerimi ve sevdiğim şeyleri anlatabilir, like / love / hate + -ing kullanabilir, neyi yapıp neyi yapamadığımı söyleyebilirim.',
    vocab: [
      v('cook', 'yemek yapmak', 'I love cooking for my family.', 'Ailem için yemek yapmayı çok severim.'),
      v('swim', 'yüzmek', 'I can swim, but not very well.', 'Yüzebilirim ama çok iyi değil.'),
      v('read', 'okumak', 'She enjoys reading in the evening.', 'O akşamları okumaktan keyif alır.'),
      v('walk', 'yürümek', 'We like walking in the park.', 'Parkta yürümeyi severiz.'),
      v('music', 'müzik', 'I listen to music every day.', 'Her gün müzik dinlerim.'),
      v('football', 'futbol', 'My son plays football on Saturdays.', 'Oğlum cumartesileri futbol oynar.'),
      v('sing', 'şarkı söylemek', "I can't sing!", 'Şarkı söyleyemem!'),
      v('drive', 'araba sürmek', 'Can you drive?', 'Araba sürebilir misin?'),
      v('watch TV', 'televizyon izlemek', 'He hates watching TV.', 'O televizyon izlemekten nefret eder.'),
      v('hobby', 'hobi', 'What are your hobbies?', 'Hobilerin neler?'),
      v('well', 'iyi (bir şekilde)', 'She speaks English well.', 'O iyi İngilizce konuşur.'),
      v('slowly', 'yavaşça', 'Can you speak slowly, please?', 'Yavaş konuşabilir misiniz, lütfen?')
    ],
    grammar: {
      title: 'like / love / hate / enjoy + -ing, can / can\'t (yetenek), well ve slowly',
      html: '<p><b>Sevdiklerin:</b> love (çok sevmek), like (sevmek), don\'t like (sevmemek), hate (nefret etmek). Arkasından fiil gelirse <b>-ing</b> ekle: I like <b>cooking</b>. She loves <b>reading</b>. enjoy\'dan sonra hep -ing: I enjoy <b>walking</b>.</p>' +
        '<p><b>-ing yazımı:</b> swim → swi<b>mm</b>ing, run → ru<b>nn</b>ing, dance → danc<b>ing</b> (sondaki e düşer), cook → cook<b>ing</b>.</p>' +
        '<p><b>3. tekil:</b> She <b>likes</b>, he <b>doesn\'t like</b>. Soru: <b>Do</b> you like...? <b>Does</b> she like...?</p>' +
        '<p><b>can / can\'t (yetenek):</b> I <b>can</b> swim. He <b>can\'t</b> drive. <b>Can</b> you cook? Yes, I can. / No, I can\'t. Her kişide aynı: she can ("she cans" değil).</p>' +
        '<p><b>Nasıl?</b> Fiili anlatan kelime fiilden sonra gelir: She sings <b>well</b>. Please speak <b>slowly</b>. Fiil için good değil <b>well</b>: He cooks well.</p>' +
        '<p><b>Söyleyiş:</b> Cümle içinde can kısa ve hafif okunur: I can SWIM. can\'t ise uzun ve vurgulu: I CAN\'T swim. -ing sonunda ayrı bir g sesi yok: COOK-ing.</p>',
      examples: ['I love cooking.', "She doesn't like watching TV.", "I can swim, but I can't drive.", 'He speaks English well.']
    },
    exercises: [
      mc('I like ___ in the park.', ['walking', 'walk', 'to walking', 'walks'], 'walking', 'like + -ing'),
      fill('She enjoys ___ books. (read)', ['reading'], 'like + -ing'),
      fill('My husband loves ___ on Sundays. (cook)', ['cooking'], 'like + -ing'),
      mc('swim fiilinin -ing hâli:', ['swimming', 'swiming', 'swimeing', 'swimmeing'], 'swimming', 'spelling'),
      mc('Hangisi doğru?', ['She can drive.', 'She cans drive.', 'She can to drive.', 'She can drives.'], 'She can drive.', 'can', 'can her kişide aynıdır, arkasından fiil yalın gelir.'),
      fill('Sorry, I ___ sing. (yapamam)', ["can't", 'cannot'], 'can'),
      mc('He ___ like football.', ["doesn't", "don't", "isn't", 'not'], "doesn't", 'negatives', "he / she ile doesn't."),
      mc('She sings ___.', ['well', 'good', 'nice', 'beautiful'], 'well', 'adverbs', 'Fiili anlatırken good değil well.'),
      order(['Can', 'you', 'speak', 'slowly', 'please'], ['Can you speak slowly, please'], 'adverbs'),
      order(['What', 'are', 'your', 'hobbies'], ['What are your hobbies'], 'questions'),
      typed('Çevir: Yemek yapmayı severim.', ['I like cooking', 'I like to cook'], 'like + -ing'),
      typed('Çevir: Araba süremem.', ["I can't drive", 'I cannot drive'], 'can'),
      match([['swim', 'yüzmek'], ['drive', 'araba sürmek'], ['sing', 'şarkı söylemek'], ['cook', 'yemek yapmak']], 'vocab')
    ],
    listening: [
      lmc("I can't swim.", ["I can't swim.", 'I can swim.', "I can't sing.", 'I can sing.'], "I can't swim.", 'can', "can't uzun ve vurgulu, can kısa okunur."),
      lmc('She loves reading.', ['She loves reading.', 'She likes reading.', 'She loves riding.', 'She hates reading.'], 'She loves reading.', 'like + -ing'),
      dict('Do you like football?'),
      dict('He cooks very well.')
    ],
    speaking: [
      speak('I love cooking.', 'Yemek yapmayı çok severim.'),
      speak("I can swim, but I can't drive.", 'Yüzebilirim ama araba süremem.'),
      speak('What are your hobbies?', 'Hobilerin neler?'),
      speak('Can you speak slowly, please?', 'Yavaş konuşabilir misiniz, lütfen?')
    ],
    reading: {
      text: "Hi! I'm Dilek. I live in Bristol.\nI love walking by the river. I usually walk on Sunday mornings.\nI like cooking, but I don't like washing up!\nI can swim, but I can't drive.\nMy friend Sarah can drive. She takes me to the swimming pool on Fridays.",
      glossary: [['by the river', 'nehir kenarında'], ['washing up', 'bulaşık yıkamak'], ['swimming pool', 'yüzme havuzu'], ['takes me', 'beni götürür']],
      questions: [
        rq('Dilek ne yapmayı sevmiyor?', ['washing up', 'cooking', 'walking', 'swimming'], 'washing up'),
        rq('Dilek ne yapamıyor?', ['drive', 'swim', 'cook', 'walk'], 'drive'),
        rq('Dilek yüzme havuzuna ne zaman gidiyor?', ['on Fridays', 'on Sundays', 'on Saturdays', 'every day'], 'on Fridays')
      ]
    },
    writing: {
      prompt: "Write about your hobbies. Say what you love, like and don't like doing, and what you can and can't do. (30 to 50 words)",
      promptTR: 'Hobilerini anlat: neyi yapmayı çok sevdiğini, sevdiğini ve sevmediğini, neyi yapabildiğini ve yapamadığını yaz. (30-50 kelime)',
      minWords: 30,
      checklist: ['like / love / hate sonrasında -ing kullandım', "can ve can't kullandım", "can'den sonra fiil yalın (can swim)", 'well veya slowly gibi bir kelime kullandım']
    }
  });

  def('1.9', {
    can: 'Şu anda olanları anlatabilir, havadan söz edebilir, giysileri ve renkleri söyleyebilir, present simple ile present continuous\'u ayırt edebilirim.',
    vocab: [
      v('rain', 'yağmur, yağmur yağmak', "It's raining again.", 'Yine yağmur yağıyor.'),
      v('sunny', 'güneşli', "It's sunny today.", 'Bugün hava güneşli.'),
      v('cold', 'soğuk', "It's cold, so wear a coat.", 'Hava soğuk, mont giy.'),
      v('windy', 'rüzgârlı', "It's very windy by the sea.", 'Deniz kenarında çok rüzgâr var.'),
      v('cloudy', 'bulutlu', "It's cloudy, but it isn't raining.", 'Hava bulutlu ama yağmur yağmıyor.'),
      v('coat', 'mont, palto', "I'm wearing a black coat.", 'Siyah bir mont giyiyorum.'),
      v('umbrella', 'şemsiye', 'Take an umbrella!', 'Şemsiye al!'),
      v('jumper', 'kazak (UK)', "She's wearing a red jumper.", 'O kırmızı bir kazak giyiyor.'),
      v('shoes', 'ayakkabı', 'My shoes are wet.', 'Ayakkabılarım ıslak.'),
      v('winter', 'kış', 'It sometimes snows in winter.', 'Kışın bazen kar yağar.'),
      v('summer', 'yaz', 'In summer it is warm and sunny.', 'Yazın hava ılık ve güneşli.'),
      v('colour', 'renk', 'What colour is your coat?', 'Montun ne renk?')
    ],
    grammar: {
      title: 'Present continuous (şimdiki zaman) ve present simple ile farkı',
      html: '<p><b>Şu anda olan:</b> am / is / are + fiil<b>-ing</b>. I <b>am</b> cook<b>ing</b>. She <b>is</b> wear<b>ing</b> a coat. They <b>are</b> wait<b>ing</b> for the bus. Türkçedeki <b>-iyor</b> ekine benzer.</p>' +
        '<p><b>Olumsuz ve soru:</b> I\'m not working today. <b>Is</b> it raining? Yes, it is. What <b>are</b> you doing?</p>' +
        '<p><b>Hava:</b> Özne olarak <b>it</b> şart: <b>It\'s</b> raining. <b>It\'s</b> cold. "Is raining" yanlış. Türkçede özne düşer, İngilizcede düşmez.</p>' +
        '<p><b>Fark:</b> Her zaman veya genelde olan → present simple: I <b>work</b> on Mondays. Şu an olan → present continuous: I<b>\'m working</b> now. İpucu kelimeler: every day, usually, often (simple); now, at the moment, today, Look! (continuous).</p>' +
        '<p><b>Telefonda:</b> I\'m on the bus. I\'m coming! I\'m waiting outside.</p>' +
        '<p><b>Söyleyiş:</b> It\'s RAI-ning. Vurgu ana kelimede, it\'s kısa ve hafif okunur.</p>',
      examples: ["It's raining.", "She's wearing a blue coat.", "I'm on the bus. I'm coming!", "I usually walk, but today I'm taking the bus."]
    },
    exercises: [
      fill('Look! It ___ raining.', ['is'], 'present continuous'),
      mc('She ___ a red jumper today.', ['is wearing', 'wears', 'wear', 'wearing'], 'is wearing', 'present continuous', 'today ve şu an: is wearing.'),
      mc('Hangisi doğru?', ["It's cold today.", 'Is cold today.', 'It cold today.', 'Cold is today.'], "It's cold today.", 'subject', "İngilizcede özne düşmez: It's cold."),
      mc('I usually ___ to work by bus.', ['go', 'am going', 'goes', 'going'], 'go', 'simple vs continuous', 'usually = genelde: present simple.'),
      mc('She ___ at a school. It is her job.', ['works', 'is working', 'work', 'working'], 'works', 'simple vs continuous', 'Her zaman olan bir durum: present simple.'),
      mc('What ___ you doing?', ['are', 'do', 'is', 'does'], 'are', 'present continuous'),
      fill("I'm not ___ today. I'm at home. (work)", ['working'], 'present continuous'),
      fill('___ it raining? (soru)', ['Is'], 'present continuous'),
      order(['I', 'am', 'waiting', 'for', 'the', 'bus'], ['I am waiting for the bus', "I'm waiting for the bus"], 'present continuous'),
      order(['What', 'colour', 'is', 'your', 'coat'], ['What colour is your coat'], 'questions'),
      match([['sunny', 'güneşli'], ['windy', 'rüzgârlı'], ['cloudy', 'bulutlu'], ['cold', 'soğuk']], 'weather'),
      typed('Çevir: Yağmur yağıyor.', ["It's raining", 'It is raining'], 'subject'),
      typed('Çevir: Otobüsteyim.', ["I'm on the bus", 'I am on the bus'], 'prepositions')
    ],
    listening: [
      lmc("It's windy today.", ["It's windy today.", "It's sunny today.", "It's Wednesday today.", "It's rainy today."], "It's windy today.", 'weather', 'windy (WIN-di) ve Wednesday (WENZ-dey) birbirine benzer.'),
      lmc("She's wearing a black coat.", ["She's wearing a black coat.", "She's wearing a blue coat.", "She's wearing a black hat.", 'She wears a black coat.'], "She's wearing a black coat.", 'present continuous'),
      dict("I'm on the bus.", ["I'm on the bus", 'I am on the bus'], 'present continuous'),
      dict('Take an umbrella.')
    ],
    speaking: [
      speak("It's raining again.", 'Yine yağmur yağıyor.'),
      speak("I'm waiting for the bus.", 'Otobüsü bekliyorum.'),
      speak("She's wearing a blue jumper.", 'O mavi bir kazak giyiyor.'),
      speak('Lovely weather today!', 'Bugün hava çok güzel!')
    ],
    reading: {
      text: "Text message from Emre:\nHi! I'm on the train to Leeds.\nIt's raining here and it's very windy.\nI'm wearing my new jumper, but I haven't got an umbrella!\nThe train is late. I'm reading a book.\nSee you at 6.",
      glossary: [['text message', 'kısa mesaj'], ['new', 'yeni'], ['late', 'geç, rötarlı']],
      questions: [
        rq('Emre şu anda nerede?', ['on the train', 'on the bus', 'at home', 'in a cafe'], 'on the train'),
        rq('Hava nasıl?', ['rainy and windy', 'sunny and warm', 'cold and sunny', 'cloudy and warm'], 'rainy and windy'),
        rq('Emre şu anda ne yapıyor?', ['reading a book', 'sleeping', 'eating', 'phoning a friend'], 'reading a book'),
        rq('Emre\'nin neyi yok?', ['an umbrella', 'a jumper', 'a book', 'a ticket'], 'an umbrella')
      ]
    },
    writing: {
      prompt: 'Look out of the window or think of a busy street. Write what people are doing, what they are wearing and what the weather is like. (30 to 50 words)',
      promptTR: 'Pencereden bak ya da kalabalık bir sokak düşün. İnsanların ne yaptığını, ne giydiğini ve havanın nasıl olduğunu yaz. (30-50 kelime)',
      minWords: 30,
      checklist: ['am / is / are + -ing kullandım', "Hava için It's ... yazdım", 'En az 2 giysi veya renk kullandım', 'Her cümlede özne var (I, she, it, they...)']
    }
  });

  def('1.10', {
    can: 'Soru kelimeleriyle doğru soru kurabilir, kendimi 2 dakika tanıtabilir ve A1 konularını birlikte kullanabilirim.',
    vocab: [
      v('what', 'ne', 'What is your name?', 'Adın ne?'),
      v('where', 'nerede, nereye', 'Where do you live?', 'Nerede yaşıyorsun?'),
      v('when', 'ne zaman', 'When is your birthday?', 'Doğum günün ne zaman?'),
      v('who', 'kim', 'Who is that man?', 'O adam kim?'),
      v('why', 'neden', 'Why are you learning English?', 'Neden İngilizce öğreniyorsun?'),
      v('because', 'çünkü', 'Because I live in the UK.', "Çünkü Birleşik Krallık'ta yaşıyorum."),
      v('how', 'nasıl', 'How are you?', 'Nasılsın?'),
      v('how often', 'ne sıklıkla', 'How often do you go shopping?', 'Ne sıklıkla alışverişe gidersin?'),
      v('which', 'hangi', 'Which bus goes to the station?', 'Hangi otobüs istasyona gider?'),
      v('what time', 'saat kaçta', 'What time does the shop open?', 'Dükkân saat kaçta açılıyor?'),
      v('how old', 'kaç yaşında', 'How old is your son?', 'Oğlun kaç yaşında?')
    ],
    grammar: {
      title: 'Soru kelimeleri ve A1 tekrarı',
      html: '<p><b>Soru kelimeleri:</b> what (ne), where (nerede), when (ne zaman), who (kim), why (neden), how (nasıl), which (hangi), what time (saat kaçta), how often (ne sıklıkla), how much / how many (ne kadar / kaç tane).</p>' +
        '<p><b>Sıra 1, be ile:</b> soru kelimesi + am / is / are + özne: Where <b>is</b> the station? Who <b>is</b> she? ("Where the station is?" değil.)</p>' +
        '<p><b>Sıra 2, diğer fiillerle:</b> soru kelimesi + do / does + özne + fiil: Where <b>do</b> you live? What time <b>does</b> the shop open? ("Where you live?" değil.)</p>' +
        '<p><b>Sıra 3, can ve şimdiki zaman:</b> What <b>can</b> I do? What <b>are</b> you doing?</p>' +
        '<p><b>why sorusuna cevap:</b> <b>because</b> ile: Why are you tired? Because I work at night.</p>' +
        '<p><b>A1 kontrol listesi:</b> am / is / are, a / an, çoğul -s, he / she, 3. tekil -s, do / does, there is / there are, some / any, can, -ing.</p>',
      examples: ['Where do you live?', 'What time does the bus leave?', 'Why are you learning English? Because I live in the UK.', 'Who is your teacher?']
    },
    exercises: [
      mc('___ do you live? In Chester.', ['Where', 'What', 'Who', 'When'], 'Where', 'question words'),
      mc('___ is your birthday? On 3 May.', ['When', 'Where', 'Who', 'Which'], 'When', 'question words'),
      mc('Hangisi doğru?', ['Where do you work?', 'Where you work?', 'Where you do work?', 'Where does you work?'], 'Where do you work?', 'questions', 'do / does olmadan soru olmaz: Where do you work?'),
      mc('Hangisi doğru?', ['Where is the bank?', 'Where the bank is?', 'Where bank is?', 'Where is bank the?'], 'Where is the bank?', 'question order'),
      fill('What time ___ the shop open?', ['does'], 'do/does', 'the shop = it, bu yüzden does.'),
      fill('___ are you learning English? Because I live in the UK.', ['Why'], 'question words'),
      mc('She ___ in a hospital.', ['works', 'work', 'is work', 'working'], 'works', 'third person -s'),
      mc('I have got two ___.', ['children', 'child', 'childs', 'childrens'], 'children', 'plurals', 'child çoğulu düzensiz: children.'),
      mc('Is there ___ milk?', ['any', 'some', 'a', 'many'], 'any', 'some/any'),
      order(['How', 'often', 'do', 'you', 'go', 'shopping'], ['How often do you go shopping'], 'questions'),
      order(['Who', 'is', 'that', 'woman'], ['Who is that woman'], 'questions'),
      typed('Çevir: O bir öğretmen. (kadın)', ['She is a teacher', "She's a teacher"], 'he/she'),
      typed('Çevir: Nerede yaşıyorsun?', ['Where do you live'], 'questions'),
      match([['who', 'kim'], ['where', 'nerede'], ['when', 'ne zaman'], ['why', 'neden'], ['which', 'hangi']], 'question words')
    ],
    listening: [
      lmc('Where do you live?', ['Where do you live?', 'Where do you leave?', 'When do you live?', 'Where did you live?'], 'Where do you live?', 'question words', 'live (kısa i) ve leave (uzun ii) farklıdır.'),
      lmc('What time does the shop open?', ['What time does the shop open?', 'What time does the shop close?', 'What time is the shop open?', 'When does the shop open?'], 'What time does the shop open?', 'questions'),
      dict('Who is your teacher?'),
      dict('How old are you?')
    ],
    speaking: [
      speak("I'm from Turkey and I live in the UK.", "Türkiyeliyim ve Birleşik Krallık'ta yaşıyorum."),
      speak('Where do you live?', 'Nerede yaşıyorsun?'),
      speak('Why are you learning English?', 'Neden İngilizce öğreniyorsun?'),
      speak("I like cooking, but I can't swim.", 'Yemek yapmayı severim ama yüzemem.')
    ],
    reading: {
      text: 'NEW MEMBERS\nHello, everyone! Please welcome Zeynep to our English club.\nZeynep is from Izmir. She lives in Chester with her husband and two children.\nShe works in a bakery. She likes walking and she can cook very well.\nThe club meets every Tuesday at 7 pm in the library.',
      glossary: [['member', 'üye'], ['welcome', 'hoş geldin demek'], ['bakery', 'fırın, pastane'], ['meets', 'toplanır']],
      questions: [
        rq('Zeynep nerede yaşıyor?', ['in Chester', 'in Izmir', 'in the library', 'in a bakery'], 'in Chester'),
        rq('Zeynep nerede çalışıyor?', ['in a bakery', 'in a library', 'in a school', 'in a cafe'], 'in a bakery'),
        rq('Kulüp ne zaman toplanıyor?', ['every Tuesday at 7 pm', 'every Thursday at 7 pm', 'every Tuesday at 7 am', 'every day at 7 pm'], 'every Tuesday at 7 pm'),
        rq('Zeynep ne yapabiliyor?', ['cook very well', 'drive', 'swim very well', 'sing'], 'cook very well')
      ]
    },
    writing: {
      prompt: 'Write a self-introduction for a new English class: your name, where you are from, where you live, your family, your job or your day, your hobbies and why you are learning English. (60 to 80 words)',
      promptTR: 'Yeni bir İngilizce sınıfı için kendini tanıt: adın, nereli olduğun, nerede yaşadığın, ailen, işin veya günün, hobilerin ve neden İngilizce öğrendiğin. (60-80 kelime)',
      minWords: 60,
      checklist: ['Adım, ülkem ve şehrim var', 'Ailem ve günlük hayatım var', 'Hobilerim var (like + -ing, can)', 'Neden İngilizce öğrendiğimi because ile yazdım', 'Büyük harf ve noktalama doğru']
    }
  });

  def('2.1', {
    can: 'Geçen hafta sonunu ve geçmişte olanları was / were ve düzenli geçmiş zamanla anlatabilirim.',
    vocab: [
      v('yesterday', 'dün', 'Yesterday I was at home.', 'Dün evdeydim.'),
      v('last week', 'geçen hafta', 'Last week we visited my friend.', 'Geçen hafta arkadaşımı ziyaret ettik.'),
      v('ago', '... önce', 'I came here two years ago.', 'Buraya iki yıl önce geldim.'),
      v('weekend', 'hafta sonu', 'How was your weekend?', 'Hafta sonun nasıldı?'),
      v('visit', 'ziyaret etmek', 'We visited my aunt on Sunday.', 'Pazar günü teyzemi ziyaret ettik.'),
      v('clean', 'temizlemek', 'I cleaned the kitchen.', 'Mutfağı temizledim.'),
      v('watch', 'izlemek', 'We watched a film.', 'Bir film izledik.'),
      v('cook', 'yemek pişirmek', 'She cooked dinner for us.', 'Bize akşam yemeği pişirdi.'),
      v('walk', 'yürümek', 'They walked to the park.', 'Parka yürüdüler.'),
      v('stay', 'kalmak', 'I stayed at home.', 'Evde kaldım.'),
      v('wait', 'beklemek', 'We waited for the bus.', 'Otobüsü bekledik.'),
      v('study', 'çalışmak, ders çalışmak', 'He studied English.', 'İngilizce çalıştı.')
    ],
    grammar: {
      title: 'was / were ve düzenli geçmiş zaman (-ed)',
      html: '<p><b>was / were</b> = "be" fiilinin geçmişi. I / he / she / it <b>was</b>. You / we / they <b>were</b>. Olumsuz: wasn\'t, weren\'t. Soru: Were you at home? Yes, I was.</p>' +
        '<p><b>Düzenli fiiller:</b> fiile <b>-ed</b> ekle: walk → walk<b>ed</b>, clean → clean<b>ed</b>. -e ile biterse sadece -d: live → live<b>d</b>. Ünsüz + y: study → stud<b>ied</b>. Tek heceli, ünlü + ünsüz: stop → stop<b>ped</b>.</p>' +
        '<p><b>Tüm kişilerde aynı:</b> I walked, she walked, they walked. (Present simple\'daki -s yok.)</p>' +
        '<p><b>Zaman kelimeleri:</b> yesterday, last week, last night, two days <b>ago</b>, in 2020. "I have visited yesterday" yanlıştır. Doğrusu: I <b>visited</b> yesterday.</p>' +
        '<p><b>Söyleyiş:</b> -ed üç farklı okunur: worked /t/, played /d/, wanted /ɪd/. Ses çıkaran harften sonra /d/, çıkarmayandan sonra /t/, t ve d\'den sonra /ɪd/.</p>',
      examples: ['I was at home yesterday.', 'We visited my friend last week.', 'She cooked dinner.', 'They were not tired.']
    },
    exercises: [
      mc('I ___ at home yesterday.', ['was', 'were', 'am', 'is'], 'was', 'was/were'),
      mc('They ___ tired after work.', ['were', 'was', 'are', 'be'], 'were', 'was/were'),
      fill('We ___ (visit) my aunt last Sunday.', ['visited'], 'past simple -ed'),
      fill('She ___ (study) English last night.', ['studied'], 'past simple -ed', 'Ünsüz + y: y düşer, -ied gelir.'),
      mc('Hangisi doğru?', ['I watched TV yesterday.', 'I watch TV yesterday.', 'I have watched TV yesterday.', 'I watching TV yesterday.'], 'I watched TV yesterday.', 'past simple', 'yesterday ile geçmiş zaman kullanılır.'),
      mc('I came to the UK two years ___.', ['ago', 'before', 'last', 'yesterday'], 'ago', 'time words'),
      mc('___ you at the party on Saturday?', ['Were', 'Was', 'Did', 'Are'], 'Were', 'was/were'),
      order(['We', 'walked', 'to', 'the', 'park', 'yesterday'], ['We walked to the park yesterday'], 'past simple'),
      order(['She', 'was', 'not', 'at', 'home'], ['She was not at home', "She wasn't at home"], 'was/were'),
      typed('Çevir: Dün evde kaldım.', ['I stayed at home yesterday', 'Yesterday I stayed at home'], 'past simple'),
      typed('Çevir: Hafta sonu nasıldı?', ['How was your weekend', 'How was the weekend'], 'was/were'),
      match([['yesterday', 'dün'], ['last week', 'geçen hafta'], ['ago', '... önce'], ['weekend', 'hafta sonu']], 'time words')
    ],
    listening: [
      lmc('We visited my aunt on Sunday.', ['We visited my aunt on Sunday.', 'We visit my aunt on Sunday.', 'We visited my uncle on Sunday.', 'We visited my aunt on Monday.'], 'We visited my aunt on Sunday.', 'past simple'),
      lmc('They were at school.', ['They were at school.', 'They are at school.', 'There was a school.', 'They went to school.'], 'They were at school.', 'was/were'),
      dict('I cleaned the kitchen yesterday.'),
      dict('How was your weekend?')
    ],
    speaking: [
      speak('I was at home yesterday.', 'Dün evdeydim.'),
      speak('We watched a film on Saturday.', 'Cumartesi bir film izledik.'),
      speak('How was your weekend?', 'Hafta sonun nasıldı?'),
      speak('I cleaned the house and cooked dinner.', 'Evi temizledim ve akşam yemeği pişirdim.')
    ],
    reading: {
      text: 'Hi Kate,\nHow was your weekend? Mine was nice.\nOn Saturday I cleaned the flat and cooked a big lunch.\nOn Sunday we visited my cousin in Leeds. We walked in the park and watched a football match.\nWe were tired but happy.\nLove, Ayse',
      glossary: [['cousin', 'kuzen'], ['match', 'maç'], ['Love', '(mektup sonu) sevgiler']],
      questions: [
        rq('What did Ayse do on Saturday?', ['She cleaned the flat and cooked lunch.', 'She visited her cousin.', 'She watched a match.', 'She stayed in bed.'], 'She cleaned the flat and cooked lunch.'),
        rq('Where did they go on Sunday?', ['to Leeds', 'to the shop', 'to school', 'to the station'], 'to Leeds'),
        rq('How were they in the evening?', ['tired but happy', 'sad', 'angry', 'hungry'], 'tired but happy')
      ]
    },
    writing: {
      prompt: 'Write about your last weekend. Use was or were and at least four past simple verbs. (50 to 70 words)',
      promptTR: 'Geçen hafta sonunu anlat. was veya were ve en az dört geçmiş zaman fiili kullan. (50-70 kelime)',
      minWords: 40,
      checklist: ['was / were doğru kullandım', 'En az 4 fiile -ed ekledim', 'yesterday, last week veya ago gibi bir zaman kelimesi var', 'Her cümle büyük harfle başlıyor ve nokta ile bitiyor']
    }
  });

  def('2.2', {
    can: 'Düzensiz geçmiş zaman fiillerini kullanabilir, did ile soru ve olumsuz cümle kurabilir, kısa bir olayı anlatabilirim.',
    vocab: [
      v('go / went', 'gitmek', 'I went to the shop.', 'Dükkâna gittim.'),
      v('have / had', 'sahip olmak, yemek', 'We had lunch at one.', 'Saat birde öğle yemeği yedik.'),
      v('see / saw', 'görmek', 'I saw my neighbour.', 'Komşumu gördüm.'),
      v('buy / bought', 'satın almak', 'She bought a new coat.', 'Yeni bir mont aldı.'),
      v('take / took', 'almak, götürmek', 'He took the bus.', 'Otobüse bindi.'),
      v('make / made', 'yapmak', 'I made a cake.', 'Bir kek yaptım.'),
      v('get / got', 'almak, olmak', 'I got a letter.', 'Bir mektup aldım.'),
      v('lose / lost', 'kaybetmek', 'I lost my keys.', 'Anahtarlarımı kaybettim.'),
      v('arrive', 'varmak', 'The parcel did not arrive.', 'Paket gelmedi.'),
      v('late', 'geç, rötarlı', 'The bus was late.', 'Otobüs gecikti.'),
      v('problem', 'sorun', 'There was a problem with my order.', 'Siparişimle ilgili bir sorun vardı.'),
      v('parcel', 'paket, koli', 'My parcel is late.', 'Paketim gecikti.')
    ],
    grammar: {
      title: 'Düzensiz geçmiş fiiller ve did ile soru / olumsuz',
      html: '<p><b>Düzensiz fiiller</b> -ed almaz, ezberlenir: go → <b>went</b>, have → <b>had</b>, see → <b>saw</b>, buy → <b>bought</b>, take → <b>took</b>, make → <b>made</b>, get → <b>got</b>, lose → <b>lost</b>, eat → <b>ate</b>, come → <b>came</b>, give → <b>gave</b>, say → <b>said</b>.</p>' +
        '<p><b>Soru:</b> <b>Did</b> + özne + fiil (yalın): <b>Did</b> you <b>go</b> to the shop? Yes, I did. / No, I didn\'t. Soru kelimesiyle: What <b>did</b> you <b>buy</b>?</p>' +
        '<p><b>Olumsuz:</b> özne + <b>didn\'t</b> + fiil (yalın): I <b>didn\'t go</b>. "I didn\'t went" yanlıştır. did geçmişi zaten taşır, fiil yalın kalır.</p>' +
        '<p><b>Dikkat:</b> was / were ile did kullanılmaz: Were you late? (Did you were... değil).</p>' +
        '<p><b>Kısa hikâye sırası:</b> First, Then, After that, Finally.</p>',
      examples: ['I went to the shop and bought some milk.', 'Did you see the doctor?', "She didn't take the bus.", 'What did you do yesterday?']
    },
    exercises: [
      fill('I ___ (go) to the shop yesterday.', ['went'], 'irregular past'),
      fill('She ___ (buy) a new coat last week.', ['bought'], 'irregular past'),
      mc('We ___ lunch at one o\'clock.', ['had', 'have', 'haved', 'has'], 'had', 'irregular past'),
      mc('___ you see the doctor?', ['Did', 'Do', 'Were', 'Have'], 'Did', 'did questions'),
      mc('Hangisi doğru?', ["I didn't go to work.", "I didn't went to work.", "I don't went to work.", 'I no went to work.'], "I didn't go to work.", 'did negatives', 'didn\'t + yalın fiil.'),
      fill('Where ___ you go on Sunday?', ['did'], 'did questions'),
      mc('The parcel ___ arrive on Monday. (gelmedi)', ["didn't", "don't", "wasn't", "doesn't"], "didn't", 'did negatives'),
      order(['What', 'did', 'you', 'buy', 'at', 'the', 'shop'], ['What did you buy at the shop'], 'did questions'),
      order(['I', 'lost', 'my', 'keys', 'yesterday'], ['I lost my keys yesterday', 'Yesterday I lost my keys'], 'irregular past'),
      typed('Çevir: Dün bir mektup aldım.', ['I got a letter yesterday', 'Yesterday I got a letter', 'I received a letter yesterday'], 'irregular past'),
      typed('Çevir: Otobüse bindin mi?', ['Did you take the bus', 'Did you get the bus'], 'did questions'),
      match([['went', 'gitti'], ['saw', 'gördü'], ['bought', 'satın aldı'], ['lost', 'kaybetti']], 'irregular past')
    ],
    listening: [
      lmc('I lost my keys on Monday.', ['I lost my keys on Monday.', 'I left my keys on Monday.', 'I lost my keys on Sunday.', 'I looked for my keys on Monday.'], 'I lost my keys on Monday.', 'irregular past'),
      lmc("She didn't go to school.", ["She didn't go to school.", 'She went to school.', "She doesn't go to school.", "She didn't go to work."], "She didn't go to school.", 'did negatives'),
      dict('What did you buy?'),
      dict('We had lunch at one.')
    ],
    speaking: [
      speak('I went to the shop and bought some bread.', 'Dükkâna gittim ve biraz ekmek aldım.'),
      speak('I lost my keys yesterday.', 'Dün anahtarlarımı kaybettim.'),
      speak('Did you see the doctor?', 'Doktora gittin mi?'),
      speak("The parcel didn't arrive.", 'Paket gelmedi.')
    ],
    reading: {
      text: 'My parcel problem\nI ordered a coat on 2 March. The shop said it was in the post.\nThe parcel did not arrive on Friday. I waited at home all day.\nOn Monday I phoned the shop. They said sorry and sent a new coat.\nThe new parcel arrived on Wednesday. I was happy.',
      glossary: [['ordered', 'sipariş verdi'], ['in the post', 'postada'], ['sent', 'gönderdi']],
      questions: [
        rq('What did the writer order?', ['a coat', 'a bag', 'shoes', 'a book'], 'a coat'),
        rq('What happened on Friday?', ['The parcel did not arrive.', 'The coat arrived.', 'The shop closed.', 'She went to Leeds.'], 'The parcel did not arrive.'),
        rq('When did the new parcel arrive?', ['on Wednesday', 'on Friday', 'on Monday', 'on Sunday'], 'on Wednesday')
      ]
    },
    writing: {
      prompt: 'Tell a short story about a problem you had (a late bus, a lost thing, a late parcel). Use First, Then, After that and Finally. (60 to 80 words)',
      promptTR: 'Yaşadığın bir sorunu anlat (geç kalan otobüs, kayıp eşya, geç gelen paket). First, Then, After that, Finally kullan. (60-80 kelime)',
      minWords: 45,
      checklist: ['En az 4 düzensiz geçmiş fiil kullandım (went, had, saw...)', "didn't + yalın fiil kullandım", 'First, Then, After that, Finally kullandım', 'Hepsi geçmiş zamanda']
    }
  });

  def('2.3', {
    can: 'Doktordan veya eczaneden randevu isteyebilir, belirtilerimi anlatabilir ve should ile tavsiye verebilirim (sadece dil çalışması).',
    vocab: [
      v('headache', 'baş ağrısı', 'I have a headache.', 'Başım ağrıyor.'),
      v('sore throat', 'boğaz ağrısı', 'I have a sore throat.', 'Boğazım ağrıyor.'),
      v('cough', 'öksürük', "I've had a cough for three days.", 'Üç gündür öksürüyorum.'),
      v('fever', 'ateş', 'She has a fever.', 'Ateşi var.'),
      v('stomach ache', 'karın ağrısı', 'He has a stomach ache.', 'Karnı ağrıyor.'),
      v('appointment', 'randevu', "I'd like to make an appointment.", 'Randevu almak istiyorum.'),
      v('GP', 'aile hekimi', 'I am registered with a GP.', 'Bir aile hekimine kayıtlıyım.'),
      v('pharmacy', 'eczane', 'The pharmacy is open until six.', 'Eczane altıya kadar açık.'),
      v('medicine', 'ilaç', 'Take this medicine twice a day.', 'Bu ilacı günde iki kez al.'),
      v('rest', 'dinlenmek', 'You should rest.', 'Dinlenmelisin.'),
      v('allergic', 'alerjisi olan', 'I am allergic to nuts.', 'Fıstığa alerjim var.'),
      v('ill', 'hasta', 'My son is ill today.', 'Oğlum bugün hasta.')
    ],
    grammar: {
      title: 'should / shouldn\'t, have + hastalık, randevu cümleleri',
      html: '<p><b>should</b> = -meli, -malı (tavsiye). You <b>should</b> rest. You <b>shouldn\'t</b> go to work. Soru: <b>Should</b> I take it with food? Fiil yalın: should <b>rest</b>, "should to rest" değil.</p>' +
        '<p><b>Hastalık:</b> I <b>have</b> a headache. / I\'ve <b>got</b> a cough. Boğazım ağrıyor = I have a sore throat. "My head hurts" da doğrudur.</p>' +
        '<p><b>Randevu:</b> I\'d like to make an appointment, please. Is there anything today? Can I see the doctor on Friday? Süre: I\'ve had a cough <b>for</b> three days.</p>' +
        '<p><b>Eczane:</b> Do you have anything for a sore throat? How often should I take it? Twice a day = günde iki kez.</p>' +
        '<p><b>Not:</b> Bu çalışma yalnızca dil içindir. Gerçek sağlık sorunlarında doktorunuza, eczaneye veya 111\'e başvurun. Acil durumda 999.</p>',
      examples: ["I'd like to make an appointment, please.", "I've had a cough for three days.", 'You should rest and drink water.', "You shouldn't go to work."]
    },
    exercises: [
      mc('You ___ rest. You look tired.', ['should', 'shoulds', 'should to', 'must to'], 'should', 'should'),
      fill("You ___ drink cold water with a sore throat. (-meli)", ["shouldn't"], 'should', 'Burada tavsiye olumsuz: shouldn\'t.'),
      mc('I ___ a headache.', ['have', 'am', 'does', 'make'], 'have', 'have + illness'),
      mc('I\'ve had a cough ___ three days.', ['for', 'since', 'in', 'at'], 'for', 'for/since'),
      mc('Hangisi doğru?', ["I'd like to make an appointment.", 'I want make appointment.', 'I like make an appointment.', 'I would like make appointment.'], "I'd like to make an appointment.", 'appointments'),
      fill('How often ___ I take this medicine?', ['should'], 'should'),
      mc('"Karnım ağrıyor" hangisi?', ['I have a stomach ache.', 'I am stomach ache.', 'My stomach has ache.', 'I have stomach pain a.'], 'I have a stomach ache.', 'have + illness'),
      order(['Do', 'you', 'have', 'anything', 'for', 'a', 'sore', 'throat'], ['Do you have anything for a sore throat'], 'pharmacy'),
      order(['Is', 'there', 'an', 'appointment', 'today'], ['Is there an appointment today'], 'appointments'),
      typed('Çevir: Dinlenmelisin.', ['You should rest'], 'should'),
      typed('Çevir: Randevu almak istiyorum.', ["I'd like to make an appointment", 'I would like to make an appointment', 'I want to make an appointment'], 'appointments'),
      match([['headache', 'baş ağrısı'], ['cough', 'öksürük'], ['fever', 'ateş'], ['medicine', 'ilaç']], 'vocab')
    ],
    listening: [
      lmc("I'd like to make an appointment, please.", ["I'd like to make an appointment, please.", "I'd like to cancel an appointment, please.", 'I like to make an appointment, please.', "I'd like to make a payment, please."], "I'd like to make an appointment, please.", 'appointments'),
      lmc('You should rest and drink water.', ['You should rest and drink water.', "You shouldn't rest and drink water.", 'You should rest and eat bread.', 'You should work and drink water.'], 'You should rest and drink water.', 'should'),
      dict("I've had a cough for three days.", ["I've had a cough for three days", 'I have had a cough for three days'], 'have + illness'),
      dict('Take it twice a day.')
    ],
    speaking: [
      speak("I'd like to make an appointment, please.", 'Randevu almak istiyorum, lütfen.'),
      speak("I've had a cough for three days.", 'Üç gündür öksürüyorum.'),
      speak('Do you have anything for a sore throat?', 'Boğaz ağrısı için bir şeyiniz var mı?'),
      speak('How often should I take it?', 'Bunu ne sıklıkla almalıyım?')
    ],
    reading: {
      text: 'Phone call to the surgery (practice)\nReceptionist: Good morning, Park Surgery.\nPatient: Hello. I\'d like to make an appointment, please.\nReceptionist: What is the problem?\nPatient: I have a bad cough and a sore throat.\nReceptionist: Is Thursday at 10 o\'clock OK?\nPatient: Yes, thank you.',
      glossary: [['surgery', 'muayenehane (UK)'], ['receptionist', 'resepsiyonist'], ['bad', 'kötü, şiddetli']],
      questions: [
        rq('Why does the patient phone?', ['to make an appointment', 'to cancel a visit', 'to buy medicine', 'to ask the way'], 'to make an appointment'),
        rq('What is the patient\'s problem?', ['a cough and a sore throat', 'a broken arm', 'a headache', 'a stomach ache'], 'a cough and a sore throat'),
        rq('When is the appointment?', ['Thursday at 10 o\'clock', 'Tuesday at 10 o\'clock', 'Thursday at 2 o\'clock', 'Friday at 10 o\'clock'], 'Thursday at 10 o\'clock')
      ]
    },
    writing: {
      prompt: 'Write a short message to a surgery to ask for an appointment. Say your name, your problem, how long you have had it and which day you can come. (40 to 60 words)',
      promptTR: 'Muayenehaneye randevu isteyen kısa bir mesaj yaz: adın, sorunun, ne zamandır olduğu ve hangi gün gelebileceğin. (40-60 kelime)',
      minWords: 35,
      checklist: ["I'd like to make an appointment yazdım", 'Sorunumu (I have a ...) anlattım', 'for + süre kullandım', 'Please ve thank you yazdım']
    }
  });

  def('2.4', {
    can: 'Arkadaşımla plan yapabilir, going to ve present continuous ile planlarımı anlatabilir, daveti kibarca kabul edip reddedebilirim.',
    vocab: [
      v('invite', 'davet etmek', 'I invited Sam to dinner.', 'Sam\'i akşam yemeğine davet ettim.'),
      v('free', 'müsait, boş', 'Are you free on Saturday?', 'Cumartesi müsait misin?'),
      v('busy', 'meşgul', "Sorry, I can't. I'm busy.", 'Üzgünüm, gelemem. Meşgulüm.'),
      v('meet', 'buluşmak', 'Shall we meet at two?', 'Saat ikide buluşalım mı?'),
      v('party', 'parti, davet', 'There is a party on Friday.', 'Cuma günü bir parti var.'),
      v('plan', 'plan', 'What are your plans?', 'Planların neler?'),
      v('next week', 'gelecek hafta', "I'm going to visit Leeds next week.", 'Gelecek hafta Leeds\'i ziyaret edeceğim.'),
      v('tomorrow', 'yarın', "I'm meeting Anna tomorrow.", 'Yarın Anna ile buluşuyorum.'),
      v('this evening', 'bu akşam', "What are you doing this evening?", 'Bu akşam ne yapıyorsun?'),
      v('great idea', 'harika fikir', 'That sounds like a great idea!', 'Bu harika bir fikir!'),
      v('maybe', 'belki', 'Maybe we can go on Sunday.', 'Belki Pazar günü gidebiliriz.'),
      v('invitation', 'davetiye, davet', 'Thank you for the invitation.', 'Davet için teşekkürler.')
    ],
    grammar: {
      title: 'going to, present continuous (plan), would like to, Shall we...?',
      html: '<p><b>going to</b> = niyet, plan. I <b>am going to</b> visit my aunt. She <b>is going to</b> start a course. Soru: <b>Are you going to</b> come? Olumsuz: I\'m <b>not going to</b> work.</p>' +
        '<p><b>Present continuous (kesinleşmiş plan):</b> I\'m <b>meeting</b> Anna tomorrow. (Randevu, saat, kişi belli.) What are you <b>doing</b> on Saturday?</p>' +
        '<p><b>Kibar davet ve istek:</b> Would you <b>like to</b> come? I\'d <b>like to</b> see that film. <b>Shall we</b> meet at two? <b>Let\'s</b> go to the cinema.</p>' +
        '<p><b>Kabul:</b> Yes, I\'d love to! That sounds great. <b>Reddetme (kibar):</b> I\'m sorry, I can\'t. I\'m busy on Saturday. Maybe another day?</p>' +
        '<p><b>Söyleyiş:</b> Konuşmada going to çoğu zaman "gonna" duyulur: I\'m gonna visit. Yazarken going to kullan.</p>',
      examples: ["I'm going to visit my aunt next week.", "I'm meeting Anna at six.", 'Shall we meet at two o\'clock?', "I'm sorry, I can't. I'm busy."]
    },
    exercises: [
      fill('I ___ going to visit my aunt next week.', ['am', "'m"], 'going to'),
      mc('She ___ going to start a new course.', ['is', 'are', 'am', 'does'], 'is', 'going to'),
      mc('What ___ you doing on Saturday?', ['are', 'do', 'is', 'will'], 'are', 'present continuous'),
      mc('___ we meet at two o\'clock?', ['Shall', 'Do', 'Will', 'Are'], 'Shall', 'suggestions'),
      mc('Hangisi doğru?', ["I'm going to visit Leeds.", 'I going to visit Leeds.', "I'm go to visit Leeds.", 'I am going visit Leeds.'], "I'm going to visit Leeds.", 'going to'),
      mc('Would you ___ to come to my party?', ['like', 'likes', 'liking', 'want'], 'like', 'would like'),
      fill("I'm sorry, I ___ come. I'm busy.", ["can't", 'cannot'], 'declining'),
      order(['Are', 'you', 'free', 'on', 'Saturday'], ['Are you free on Saturday'], 'invitations'),
      order(['Let\'s', 'go', 'to', 'the', 'cinema'], ["Let's go to the cinema", 'Lets go to the cinema'], 'suggestions'),
      typed('Çevir: Yarın Anna ile buluşuyorum.', ["I'm meeting Anna tomorrow", 'I am meeting Anna tomorrow', 'Tomorrow I am meeting Anna', "Tomorrow I'm meeting Anna"], 'present continuous'),
      typed('Çevir: Cumartesi müsait misin?', ['Are you free on Saturday', 'Are you free this Saturday'], 'invitations'),
      match([['busy', 'meşgul'], ['free', 'müsait'], ['maybe', 'belki'], ['invite', 'davet etmek']], 'vocab')
    ],
    listening: [
      lmc('Are you free on Saturday?', ['Are you free on Saturday?', 'Are you free on Sunday?', 'Were you free on Saturday?', 'Are you busy on Saturday?'], 'Are you free on Saturday?', 'invitations'),
      lmc("I'm going to visit my sister.", ["I'm going to visit my sister.", "I'm going to visit my mother.", 'I went to visit my sister.', "I'm visiting my sister now."], "I'm going to visit my sister.", 'going to'),
      dict('Shall we meet at two o\'clock?', ["Shall we meet at two o'clock", 'Shall we meet at 2 oclock', 'Shall we meet at two'], 'suggestions'),
      dict("Sorry, I can't. I'm busy.", ["Sorry I can't I'm busy", 'Sorry I cannot I am busy'], 'declining')
    ],
    speaking: [
      speak('Are you free on Saturday?', 'Cumartesi müsait misin?'),
      speak("I'm going to visit my sister next week.", 'Gelecek hafta kız kardeşimi ziyaret edeceğim.'),
      speak("I'm sorry, I can't. I'm busy.", 'Üzgünüm, gelemem. Meşgulüm.'),
      speak('That sounds like a great idea!', 'Bu harika bir fikir!')
    ],
    reading: {
      text: 'Messages\nSam: Hi Elif! Are you free on Saturday? I\'m going to have a small party.\nElif: Hi Sam! Thank you for the invitation. What time?\nSam: At 7. We\'re going to eat pizza and watch a film.\nElif: Sounds great! I\'d love to come. Shall I bring a cake?\nSam: Yes, please!',
      glossary: [['bring', 'getirmek'], ['small', 'küçük']],
      questions: [
        rq('What is Sam going to have?', ['a small party', 'a meeting', 'a lesson', 'a holiday'], 'a small party'),
        rq('What time is the party?', ['at 7', 'at 6', 'at 9', 'at 8'], 'at 7'),
        rq('What is Elif going to bring?', ['a cake', 'pizza', 'a film', 'juice'], 'a cake')
      ]
    },
    writing: {
      prompt: 'Write a short message to a friend. Invite them to do something. Say what, where and when. Then write your friend\'s answer. Use going to and Shall we. (50 to 70 words)',
      promptTR: 'Bir arkadaşını bir şeye davet eden kısa bir mesaj yaz: ne, nerede, ne zaman. Sonra arkadaşının cevabını yaz. going to ve Shall we kullan. (50-70 kelime)',
      minWords: 40,
      checklist: ['Are you free...? veya Would you like to...? yazdım', 'going to kullandım', 'Saat ve gün yazdım', 'Kibarca kabul veya ret yazdım']
    }
  });

  def('2.5', {
    can: 'İki şeyi karşılaştırabilir, comparative ve superlative kullanabilir, too ve enough ile fikrimi söyleyip bir seçenek önerebilirim.',
    vocab: [
      v('cheap', 'ucuz', 'This phone is cheaper.', 'Bu telefon daha ucuz.'),
      v('expensive', 'pahalı', 'It is too expensive.', 'Bu çok pahalı.'),
      v('big', 'büyük', 'This room is bigger.', 'Bu oda daha büyük.'),
      v('small', 'küçük', 'My flat is smaller than yours.', 'Benim dairem seninkinden küçük.'),
      v('good', 'iyi', 'This is the best shop.', 'Bu en iyi dükkân.'),
      v('bad', 'kötü', 'The weather is worse today.', 'Hava bugün daha kötü.'),
      v('fast', 'hızlı', 'The train is faster than the bus.', 'Tren otobüsten hızlı.'),
      v('comfortable', 'rahat', 'This chair is more comfortable.', 'Bu sandalye daha rahat.'),
      v('popular', 'popüler', 'It is the most popular phone.', 'En popüler telefon bu.'),
      v('deal', 'kampanya, anlaşma', 'This phone deal is cheap.', 'Bu telefon kampanyası ucuz.'),
      v('quality', 'kalite', 'The quality is good.', 'Kalitesi iyi.'),
      v('recommend', 'tavsiye etmek', 'I recommend this one.', 'Bunu tavsiye ederim.')
    ],
    grammar: {
      title: 'Comparative, superlative, as ... as, too ve enough',
      html: '<p><b>Kısa sıfat + -er than:</b> cheap → cheap<b>er than</b>, small → small<b>er than</b>. -e ile biterse -r: large → large<b>r</b>. Ünsüz + y: easy → eas<b>ier</b>. Tek ünlü + ünsüz çift olur: big → bi<b>gger</b>.</p>' +
        '<p><b>Uzun sıfat: more ... than:</b> <b>more</b> expensive than, <b>more</b> comfortable than.</p>' +
        '<p><b>Düzensiz:</b> good → <b>better</b>, bad → <b>worse</b>.</p>' +
        '<p><b>En (superlative):</b> the cheap<b>est</b>, the bigg<b>est</b>, <b>the most</b> popular, <b>the best</b>, <b>the worst</b>.</p>' +
        '<p><b>as ... as:</b> This phone is <b>as</b> good <b>as</b> that one. (aynı). Olumsuz: not <b>as</b> big <b>as</b>.</p>' +
        '<p><b>too / enough:</b> too = fazla, istenmeyecek kadar: It is <b>too</b> expensive. enough = yeterli, sıfattan sonra: It is big <b>enough</b>.</p>' +
        '<p><b>Söyleyiş:</b> than ve as konuşmada zayıf okunur: cheaper /ðən/ the other.</p>',
      examples: ['This phone is cheaper than that one.', 'It is the best deal.', 'The red bag is not as big as the blue bag.', 'It is too expensive.']
    },
    exercises: [
      fill('This phone is ___ than that one. (cheap)', ['cheaper'], 'comparatives'),
      fill('My flat is ___ than yours. (big)', ['bigger'], 'comparatives', 'big → bigger: ünsüz çift olur.'),
      mc('This chair is ___ than that one.', ['more comfortable', 'comfortabler', 'most comfortable', 'comfortable'], 'more comfortable', 'comparatives'),
      mc('This is the ___ shop in town.', ['best', 'better', 'good', 'goodest'], 'best', 'superlatives'),
      mc('The weather is ___ today. (daha kötü)', ['worse', 'badder', 'more bad', 'worst'], 'worse', 'comparatives'),
      mc('It is ___ expensive. I can\'t buy it.', ['too', 'enough', 'very much', 'so much'], 'too', 'too/enough'),
      mc('The flat is big ___ for four people.', ['enough', 'too', 'very', 'much'], 'enough', 'too/enough', 'enough sıfattan sonra gelir.'),
      mc('The train is not ___ fast as the plane.', ['as', 'than', 'more', 'so than'], 'as', 'as...as'),
      order(['This', 'phone', 'is', 'cheaper', 'than', 'that', 'one'], ['This phone is cheaper than that one'], 'comparatives'),
      order(['It', 'is', 'the', 'most', 'popular', 'phone'], ['It is the most popular phone', "It's the most popular phone"], 'superlatives'),
      typed('Çevir: Bu daha ucuz.', ['This is cheaper', "It's cheaper", 'It is cheaper', 'This one is cheaper'], 'comparatives'),
      typed('Çevir: Bu çok pahalı.', ['It is too expensive', "It's too expensive", 'This is too expensive'], 'too/enough'),
      match([['cheap', 'ucuz'], ['expensive', 'pahalı'], ['comfortable', 'rahat'], ['recommend', 'tavsiye etmek']], 'vocab')
    ],
    listening: [
      lmc('This one is cheaper than that one.', ['This one is cheaper than that one.', 'This one is cheaper than the other one.', 'This one is more expensive than that one.', 'This one is as cheap as that one.'], 'This one is cheaper than that one.', 'comparatives'),
      lmc('It is the best deal.', ['It is the best deal.', 'It is the best meal.', 'It is a better deal.', 'It is the worst deal.'], 'It is the best deal.', 'superlatives'),
      dict('The train is faster than the bus.'),
      dict('It is too expensive.', ['It is too expensive', "It's too expensive"], 'too/enough')
    ],
    speaking: [
      speak('This phone is cheaper than that one.', 'Bu telefon şundan daha ucuz.'),
      speak('It is the best deal.', 'Bu en iyi kampanya.'),
      speak('It is too expensive for me.', 'Benim için çok pahalı.'),
      speak('I recommend the blue one.', 'Mavi olanı tavsiye ederim.')
    ],
    reading: {
      text: 'Phone deals\nDeal A: £12 a month, 10 GB data, 12 months.\nDeal B: £18 a month, 50 GB data, 24 months.\nDeal C: £8 a month, 2 GB data, 12 months.\nDeal C is the cheapest, but 2 GB is not enough for a family. Deal B is the most expensive, but it has the most data. Deal A is better value for most people.',
      glossary: [['data', 'internet kotası'], ['value', 'değer, fiyat/performans'], ['month', 'ay']],
      questions: [
        rq('Which deal is the cheapest?', ['Deal C', 'Deal A', 'Deal B', 'None'], 'Deal C'),
        rq('Which deal has the most data?', ['Deal B', 'Deal A', 'Deal C', 'All the same'], 'Deal B'),
        rq('Which deal is the best for most people?', ['Deal A', 'Deal B', 'Deal C', 'No deal'], 'Deal A')
      ]
    },
    writing: {
      prompt: 'Compare two things you can buy (two phones, two shops, two buses). Say which one is better and why. Use cheaper, more ... than and too or enough. (50 to 70 words)',
      promptTR: 'Satın alabileceğin iki şeyi karşılaştır (iki telefon, iki dükkân, iki otobüs). Hangisinin daha iyi olduğunu ve nedenini yaz. cheaper, more ... than ve too veya enough kullan. (50-70 kelime)',
      minWords: 40,
      checklist: ['En az 2 comparative kullandım', 'the best veya the most gibi bir superlative kullandım', 'too veya enough kullandım', 'Birini tavsiye ettim ve nedenini yazdım']
    }
  });

  def('2.6', {
    can: 'Dükkânda ve postanede kibarca rica edebilir, bir ürünü iade edebilir, a lot of / a few / a little ve Would you like...? kullanabilirim.',
    vocab: [
      v('return', 'iade etmek', "I'd like to return this.", 'Bunu iade etmek istiyorum.'),
      v('exchange', 'değiştirmek', 'Can I exchange it for a bigger size?', 'Bunu daha büyük bedenle değiştirebilir miyim?'),
      v('receipt', 'fiş', 'Have you got the receipt?', 'Fişiniz var mı?'),
      v('size', 'beden, numara', 'What size are you?', 'Kaç bedensiniz?'),
      v('fit', 'uymak (beden)', "It doesn't fit.", 'Üzerime olmadı.'),
      v('try on', 'denemek (giysi)', 'Can I try this on?', 'Bunu deneyebilir miyim?'),
      v('refund', 'para iadesi', 'Can I have a refund?', 'Para iadesi alabilir miyim?'),
      v('parcel', 'paket, koli', "I'd like to send this parcel to Turkey.", 'Bu paketi Türkiye\'ye göndermek istiyorum.'),
      v('stamp', 'pul', 'A first class stamp, please.', 'Birinci sınıf bir pul, lütfen.'),
      v('first class', 'birinci sınıf (hızlı posta)', 'First class or second class?', 'Birinci sınıf mı, ikinci sınıf mı?'),
      v('fitting room', 'deneme kabini', 'The fitting rooms are over there.', 'Deneme kabinleri şurada.'),
      v('a few', 'birkaç (sayılabilen)', 'I need a few stamps.', 'Birkaç pula ihtiyacım var.')
    ],
    grammar: {
      title: 'Kibar rica: Can I / Could I, a lot of / a few / a little, Would you like...?',
      html: '<p><b>Can I ...? / Could I ...?</b> kibar rica. <b>Could</b> daha kibar. Could I try this on? Can I pay by card? Cevap: Of course. / Sure. / Sorry, you can\'t.</p>' +
        '<p><b>Would you like ...?</b> teklif. Would you like a bag? Would you like a receipt? Cevap: Yes, please. / No, thank you.</p>' +
        '<p><b>Miktar:</b> <b>a lot of</b> (çok, hem sayılabilen hem sayılamayan): a lot of people, a lot of money. <b>a few</b> (birkaç, sayılabilen çoğul): a few stamps. <b>a little</b> (biraz, sayılamayan): a little milk.</p>' +
        '<p><b>İade cümleleri:</b> I\'d like to return this. It doesn\'t fit. It\'s too small. It\'s broken. I\'ve got the receipt. / I haven\'t got the receipt, can I exchange it?</p>' +
        '<p><b>Postane:</b> I\'d like to send this parcel to Turkey. How long will it take? How much is it? First class or second class?</p>' +
        '<p><b>Tonlama:</b> Kibar rica sonda hafif yükselir: Could I try this on? ↗ Please ve thank you tonu yumuşatır.</p>',
      examples: ['Could I try this on, please?', "I'd like to return this. It doesn't fit.", 'Would you like a receipt?', 'How long will it take?']
    },
    exercises: [
      mc('___ I try this on, please?', ['Could', 'Do', 'Am', 'Would'], 'Could', 'polite requests'),
      mc('___ you like a bag?', ['Would', 'Do', 'Could', 'Are'], 'Would', 'offers'),
      fill('I need ___ few stamps.', ['a'], 'a few/a little'),
      mc('I need a ___ milk for my tea.', ['little', 'few', 'many', 'lot'], 'little', 'a few/a little', 'milk sayılamaz: a little.'),
      mc('There are a ___ people in the shop.', ['lot of', 'lots', 'much', 'little'], 'lot of', 'a lot of'),
      mc('Hangisi doğru?', ["I'd like to return this.", 'I like return this.', 'I want return this.', 'I would returning this.'], "I'd like to return this.", 'returns'),
      fill("The coat is too small. It ___ fit me.", ["doesn't", 'does not'], 'returns'),
      order(['Have', 'you', 'got', 'the', 'receipt'], ['Have you got the receipt'], 'returns'),
      order(['Can', 'I', 'exchange', 'it', 'please'], ['Can I exchange it, please', 'Can I exchange it please'], 'returns'),
      typed('Çevir: Bunu deneyebilir miyim?', ['Can I try this on', 'Could I try this on'], 'polite requests'),
      typed('Çevir: Bu paketi Türkiye\'ye göndermek istiyorum.', ["I'd like to send this parcel to Turkey", 'I would like to send this parcel to Turkey'], 'post office'),
      match([['receipt', 'fiş'], ['refund', 'para iadesi'], ['parcel', 'paket'], ['stamp', 'pul']], 'vocab')
    ],
    listening: [
      lmc('Have you got the receipt?', ['Have you got the receipt?', 'Have you got the recipe?', 'Do you have a receipt?', 'Have you lost the receipt?'], 'Have you got the receipt?', 'returns', 'receipt (ri-SEET) ve recipe (RE-si-pi) farklıdır.'),
      lmc('First class or second class?', ['First class or second class?', 'First class or first class?', 'Fast class or second class?', 'First or second price?'], 'First class or second class?', 'post office'),
      dict('Could I try this on, please?'),
      dict("It doesn't fit.", ["It doesn't fit", 'It does not fit'], 'returns')
    ],
    speaking: [
      speak("I'd like to return this, please.", 'Bunu iade etmek istiyorum, lütfen.'),
      speak("It doesn't fit.", 'Üzerime olmadı.'),
      speak('Can I exchange it for a bigger size?', 'Bunu daha büyük bedenle değiştirebilir miyim?'),
      speak("I'd like to send this parcel to Turkey.", 'Bu paketi Türkiye\'ye göndermek istiyorum.')
    ],
    reading: {
      text: 'Shop notice\nReturns: You can return items in 28 days with a receipt.\nNo receipt? You can exchange the item, but you cannot have a refund.\nItems must be new, with labels.\nThe fitting rooms are open until 5.30 pm.',
      glossary: [['notice', 'duyuru'], ['label', 'etiket'], ['item', 'ürün']],
      questions: [
        rq('How many days can you return an item in?', ['28 days', '14 days', '7 days', '30 days'], '28 days'),
        rq('What can you do with no receipt?', ['exchange the item', 'get a refund', 'return it for money', 'nothing'], 'exchange the item'),
        rq('When do the fitting rooms close?', ['at 5.30 pm', 'at 5 pm', 'at 6.30 pm', 'at 5.30 am'], 'at 5.30 pm')
      ]
    },
    writing: {
      prompt: 'Write a role-play: you return a jacket that does not fit. Write 6 short lines between you and the shop assistant. Use Could I, I\'d like to and Would you like. (50 to 70 words)',
      promptTR: 'Bir rol yap: üzerine olmayan bir ceketi iade ediyorsun. Sen ve satıcı arasında 6 kısa satır yaz. Could I, I\'d like to ve Would you like kullan. (50-70 kelime)',
      minWords: 40,
      checklist: ["I'd like to return... yazdım", 'Sorunu söyledim (It doesn\'t fit / too small)', 'Kibar rica (Could I / Can I) kullandım', 'Please ve thank you var']
    }
  });

  def('2.7', {
    can: 'Tabelaları ve kuralları okuyup anlayabilir, must / mustn\'t / have to / don\'t have to ile 5 kuralı anlatabilirim.',
    vocab: [
      v('rule', 'kural', 'There is a rule about noise.', 'Gürültü hakkında bir kural var.'),
      v('sign', 'tabela, işaret', 'Read the sign.', 'Tabelayı oku.'),
      v('allowed', 'izinli', 'Dogs are not allowed here.', 'Buraya köpek alınmaz.'),
      v('forbidden', 'yasak', 'Smoking is forbidden.', 'Sigara içmek yasak.'),
      v('landlord', 'ev sahibi', 'The landlord lives next door.', 'Ev sahibi yan evde oturuyor.'),
      v('tenant', 'kiracı', 'Tenants must pay the rent on the 1st.', 'Kiracılar kirayı ayın 1\'inde ödemelidir.'),
      v('rent', 'kira', 'The rent is due on Friday.', 'Kira cuma günü ödenecek.'),
      v('fine', 'ceza (para)', 'You pay a fine if you are late.', 'Geç kalırsan ceza ödersin.'),
      v('park', 'park etmek', "You can't park here.", 'Buraya park edemezsin.'),
      v('quiet', 'sessiz', 'Please be quiet after 10 pm.', 'Lütfen saat 22\'den sonra sessiz ol.'),
      v('uniform', 'üniforma', 'Workers have to wear a uniform.', 'Çalışanlar üniforma giymek zorundadır.'),
      v('safety', 'güvenlik', 'Safety is very important.', 'Güvenlik çok önemli.')
    ],
    grammar: {
      title: 'must, mustn\'t, have to, don\'t have to, can\'t',
      html: '<p><b>must</b> = -meli (güçlü kural). You <b>must</b> wear a seat belt. <b>mustn\'t</b> = yapmamalısın (yasak): You <b>mustn\'t</b> smoke here.</p>' +
        '<p><b>have to</b> = zorunda (dış kural, iş, yasa). I <b>have to</b> wear a uniform at work. She <b>has to</b> pay the rent. Soru: <b>Do</b> I <b>have to</b> sign? Olumsuz: I <b>don\'t have to</b> come on Sunday.</p>' +
        '<p><b>Dikkat, çok önemli fark:</b> <b>mustn\'t</b> = yasak. <b>don\'t have to</b> = gerekli değil, zorunda değilsin. You mustn\'t park here (yasak). You don\'t have to park here (istersen başka yerde de park edebilirsin).</p>' +
        '<p><b>can / can\'t (izin):</b> You can park here after 6. You can\'t park here at 8 am.</p>' +
        '<p><b>Tabelalar:</b> No parking. No smoking. Staff only. Keep off the grass. Please queue here.</p>' +
        '<p><b>Söyleyiş:</b> have to konuşmada /hæf tə/ gibi duyulur: I "hafta" go.</p>',
      examples: ["You mustn't park here.", 'I have to wear a uniform.', "You don't have to pay today.", 'Do I have to sign?']
    },
    exercises: [
      mc('You ___ park here. It is for buses only.', ["mustn't", "don't have to", 'must', 'have to'], "mustn't", 'must/mustn\'t'),
      mc("You ___ come on Sunday. It's a free day.", ["don't have to", "mustn't", 'must', "can't"], "don't have to", 'have to'),
      fill('She ___ to wear a uniform at work.', ['has'], 'have to'),
      mc('___ I have to sign this form?', ['Do', 'Must', 'Am', 'Does to'], 'Do', 'have to'),
      mc('"No smoking" means:', ["You mustn't smoke here.", "You don't have to smoke here.", 'You have to smoke here.', 'You can smoke here.'], "You mustn't smoke here.", 'signs'),
      mc('Hangisi doğru?', ['You must pay the rent on the 1st.', 'You must to pay the rent.', 'You musts pay the rent.', 'You must paying the rent.'], 'You must pay the rent on the 1st.', 'must', 'must + yalın fiil.'),
      fill("The shop is open. You ___ queue, but you can wait.", ["don't have to"], 'have to'),
      order(['You', 'must', 'be', 'quiet', 'after', 'ten', 'pm'], ['You must be quiet after ten pm', 'You must be quiet after 10 pm'], 'must'),
      order(['Tenants', 'have', 'to', 'pay', 'the', 'rent'], ['Tenants have to pay the rent'], 'have to'),
      typed('Çevir: Buraya park edemezsin.', ["You can't park here", 'You cannot park here', "You mustn't park here"], 'can\'t'),
      typed('Çevir: Üniforma giymek zorundayım.', ['I have to wear a uniform', 'I must wear a uniform'], 'have to'),
      match([['landlord', 'ev sahibi'], ['tenant', 'kiracı'], ['fine', 'ceza'], ['rule', 'kural']], 'vocab')
    ],
    listening: [
      lmc("You mustn't smoke in the building.", ["You mustn't smoke in the building.", "You don't have to smoke in the building.", 'You must smoke in the building.', "You can't smoke outside."], "You mustn't smoke in the building.", "must/mustn't"),
      lmc("I don't have to work on Sunday.", ["I don't have to work on Sunday.", 'I have to work on Sunday.', "I mustn't work on Sunday.", "I don't have to work on Saturday."], "I don't have to work on Sunday.", 'have to'),
      dict('Dogs are not allowed here.'),
      dict('You have to pay the rent on Friday.')
    ],
    speaking: [
      speak("You mustn't park here.", 'Buraya park etmemelisin.'),
      speak('I have to wear a uniform at work.', 'İşte üniforma giymek zorundayım.'),
      speak("You don't have to pay today.", 'Bugün ödemek zorunda değilsin.'),
      speak('Do I have to sign this form?', 'Bu formu imzalamak zorunda mıyım?')
    ],
    reading: {
      text: 'House rules\n1. Tenants must pay the rent on the 1st of the month.\n2. You mustn\'t make noise after 10 pm.\n3. You have to put the rubbish in the bin on Thursday.\n4. You don\'t have to clean the stairs. The landlord does it.\n5. Visitors can\'t park in front of the house.',
      glossary: [['rubbish', 'çöp'], ['bin', 'çöp kutusu'], ['stairs', 'merdiven'], ['visitor', 'misafir']],
      questions: [
        rq('When must tenants pay the rent?', ['on the 1st of the month', 'on Thursday', 'after 10 pm', 'every week'], 'on the 1st of the month'),
        rq('Who cleans the stairs?', ['the landlord', 'the tenants', 'the visitors', 'nobody'], 'the landlord'),
        rq('What can\'t visitors do?', ['park in front of the house', 'use the bin', 'pay the rent', 'visit on Thursday'], 'park in front of the house')
      ]
    },
    writing: {
      prompt: 'Write five rules for a flat, a school or a workplace. Use must, mustn\'t, have to and don\'t have to. (50 to 70 words)',
      promptTR: 'Bir daire, okul veya işyeri için beş kural yaz. must, mustn\'t, have to ve don\'t have to kullan. (50-70 kelime)',
      minWords: 40,
      checklist: ['5 kural yazdım', 'must veya mustn\'t kullandım', 'have to ve don\'t have to kullandım', 'mustn\'t ve don\'t have to farkını doğru kullandım']
    }
  });

  def('2.8', {
    can: 'Yaşam deneyimlerimi present perfect ile anlatabilir, Have you ever...? sorabilir, just / already / yet kullanabilirim.',
    vocab: [
      v('ever', 'hiç (soruda)', 'Have you ever been to London?', 'Hiç Londra\'ya gittin mi?'),
      v('never', 'hiç (olumsuz)', 'I have never eaten sushi.', 'Hiç suşi yemedim.'),
      v('travel', 'seyahat etmek', 'I have travelled to many cities.', 'Birçok şehre seyahat ettim.'),
      v('been', 'gitmiş olmak (dönmüş)', 'I have been to Scotland.', 'İskoçya\'ya gittim (dönmüş).'),
      v('try', 'denemek', 'I have tried fish and chips.', 'Fish and chips denedim.'),
      v('meet', 'tanışmak', 'I have met her sister.', 'Onun kız kardeşiyle tanıştım.'),
      v('just', 'az önce', 'I have just arrived.', 'Az önce geldim.'),
      v('already', 'çoktan', 'I have already eaten.', 'Çoktan yedim.'),
      v('yet', 'henüz', "I haven't finished yet.", 'Henüz bitirmedim.'),
      v('abroad', 'yurt dışı', 'She has lived abroad.', 'O yurt dışında yaşadı.'),
      v('beach', 'plaj', 'We have been to the beach.', 'Plaja gittik.'),
      v('museum', 'müze', 'Have you ever visited a museum here?', 'Burada hiç müzeye gittin mi?')
    ],
    grammar: {
      title: 'Present perfect: have / has + 3. hâl (past participle)',
      html: '<p><b>Biçim:</b> have / has + <b>past participle</b>. I <b>have been</b> to London. She <b>has visited</b> Leeds. Düzenli fiillerde -ed: visited. Düzensiz: go → gone / <b>been</b>, see → <b>seen</b>, eat → <b>eaten</b>, do → <b>done</b>, make → <b>made</b>, have → <b>had</b>.</p>' +
        '<p><b>Ne zaman?</b> Zamanı belli olmayan deneyim: <b>Have you ever</b> been to Scotland? Yes, I <b>have</b>. / No, I <b>haven\'t</b>. Belli bir zaman söylenirse past simple: I <b>went</b> to Scotland <b>in 2022</b>.</p>' +
        '<p><b>been ve gone:</b> She <b>has been</b> to Paris (gitti ve döndü). She <b>has gone</b> to Paris (şu an orada).</p>' +
        '<p><b>just, already, yet:</b> I have <b>just</b> arrived (az önce). I have <b>already</b> eaten (çoktan). Have you finished <b>yet</b>? No, not <b>yet</b>. (soru ve olumsuzda yet.)</p>' +
        '<p><b>Dikkat:</b> "I have seen him yesterday" yanlış. Doğrusu: I <b>saw</b> him yesterday.</p>' +
        '<p><b>Kısaltmalar:</b> I\'ve, you\'ve, she\'s, we\'ve, haven\'t, hasn\'t. Hızlı okunur: I\'ve been = "ayv bin".</p>',
      examples: ["I've been to London.", 'Have you ever eaten haggis?', "She's just arrived.", "I haven't finished yet."]
    },
    exercises: [
      mc('Have you ever ___ to Scotland?', ['been', 'be', 'was', 'being'], 'been', 'present perfect'),
      fill('I ___ never eaten sushi.', ['have', "'ve"], 'present perfect'),
      fill('She ___ visited Leeds three times. (has / have)', ['has'], 'present perfect'),
      mc('I ___ him yesterday. (gördüm)', ['saw', 'have seen', 'seen', 'see'], 'saw', 'past vs perfect', 'yesterday varsa past simple.'),
      mc('Hangisi doğru?', ["I've just arrived.", 'I just have arrived.', 'I have arrive just.', 'I am just arrived.'], "I've just arrived.", 'just/already/yet'),
      mc('Have you finished ___?', ['yet', 'already', 'just', 'ago'], 'yet', 'just/already/yet'),
      mc('"She has gone to Paris" means:', ['She is in Paris now.', 'She came back from Paris.', 'She will go to Paris.', 'She never goes.'], 'She is in Paris now.', 'been/gone'),
      order(['Have', 'you', 'ever', 'tried', 'fish', 'and', 'chips'], ['Have you ever tried fish and chips'], 'present perfect'),
      order(['I', 'have', 'already', 'eaten', 'lunch'], ['I have already eaten lunch', "I've already eaten lunch"], 'just/already/yet'),
      typed('Çevir: Hiç Londra\'ya gittin mi?', ['Have you ever been to London'], 'present perfect'),
      typed('Çevir: Henüz bitirmedim.', ["I haven't finished yet", 'I have not finished yet'], 'just/already/yet'),
      match([['ever', 'hiç (soru)'], ['never', 'hiç (olumsuz)'], ['already', 'çoktan'], ['just', 'az önce']], 'vocab')
    ],
    listening: [
      lmc("I've been to London twice.", ["I've been to London twice.", "I've been to London once.", 'I went to London twice.', "I've gone to London twice."], "I've been to London twice.", 'present perfect'),
      lmc('Have you ever eaten fish and chips?', ['Have you ever eaten fish and chips?', 'Did you ever eat fish and chips?', 'Have you ever made fish and chips?', 'Do you eat fish and chips?'], 'Have you ever eaten fish and chips?', 'present perfect'),
      dict("She's just arrived.", ["She's just arrived", 'She has just arrived'], 'just/already/yet'),
      dict("I haven't finished yet.", ["I haven't finished yet", 'I have not finished yet'], 'just/already/yet')
    ],
    speaking: [
      speak("I've been to London twice.", 'Londra\'ya iki kez gittim.'),
      speak('Have you ever eaten fish and chips?', 'Hiç fish and chips yedin mi?'),
      speak("I've never been to Scotland.", 'Hiç İskoçya\'ya gitmedim.'),
      speak("I haven't finished yet.", 'Henüz bitirmedim.')
    ],
    reading: {
      text: 'Hi Sam,\nI have lived in the UK for one year. I have already done many things!\nI have visited London and Edinburgh. I have tried fish and chips, but I have never eaten haggis.\nI have met a lot of nice people. I haven\'t been to Wales yet.\nHave you ever been to Turkey? You must come!\nZeynep',
      glossary: [['haggis', 'İskoç yemeği'], ['already', 'çoktan'], ['Wales', 'Galler']],
      questions: [
        rq('Which city has Zeynep visited?', ['Edinburgh', 'Cardiff', 'Dublin', 'Paris'], 'Edinburgh'),
        rq('What has Zeynep never eaten?', ['haggis', 'fish and chips', 'bread', 'pizza'], 'haggis'),
        rq('Where hasn\'t she been yet?', ['Wales', 'London', 'Edinburgh', 'Turkey'], 'Wales')
      ]
    },
    writing: {
      prompt: 'Write about five experiences in your life (in Turkey, in the UK, or on holiday). Use I have ..., I have never ... and Have you ever ...? (60 to 80 words)',
      promptTR: 'Hayatındaki beş deneyimi yaz (Türkiye\'de, Birleşik Krallık\'ta veya tatilde). I have ..., I have never ... ve Have you ever ...? kullan. (60-80 kelime)',
      minWords: 45,
      checklist: ['have / has + past participle kullandım', 'I have never kullandım', 'Have you ever ...? sorusu yazdım', 'Belli zamanlı cümlelerde (2022\'de) past simple kullandım']
    }
  });

  def('2.9', {
    can: 'İşimi ve becerilerimi anlatabilir, for ve since ile süre söyleyebilir, 50 kelimelik kısa bir CV özeti yazabilirim.',
    vocab: [
      v('job', 'iş', 'I have had this job for two years.', 'Bu işte iki yıldır çalışıyorum.'),
      v('experience', 'deneyim', 'I have experience in customer service.', 'Müşteri hizmetlerinde deneyimim var.'),
      v('skill', 'beceri', 'I have good computer skills.', 'Bilgisayar becerilerim iyi.'),
      v('teamwork', 'takım çalışması', 'I enjoy teamwork.', 'Takım çalışmasından hoşlanırım.'),
      v('reliable', 'güvenilir', 'I am a reliable person.', 'Güvenilir bir insanım.'),
      v('work as', '... olarak çalışmak', 'I work as a cashier.', 'Kasiyer olarak çalışıyorum.'),
      v('apply for', 'başvurmak', 'I want to apply for this job.', 'Bu işe başvurmak istiyorum.'),
      v('CV', 'özgeçmiş', 'Please send your CV.', 'Lütfen özgeçmişinizi gönderin.'),
      v('part time', 'yarı zamanlı', 'I am looking for a part time job.', 'Yarı zamanlı iş arıyorum.'),
      v('full time', 'tam zamanlı', 'She has a full time job.', 'Tam zamanlı bir işi var.'),
      v('manager', 'yönetici, müdür', 'My manager is very kind.', 'Müdürüm çok kibar.'),
      v('train', 'eğitim almak, eğitmek', 'I trained as a nurse.', 'Hemşire olarak eğitim aldım.')
    ],
    grammar: {
      title: 'Present perfect ile for ve since, How long ...?',
      html: '<p><b>for</b> = süre: for two years, for three months, for a long time. <b>since</b> = başlangıç noktası: since 2022, since Monday, since March.</p>' +
        '<p><b>Şimdiye kadar süren durum:</b> I <b>have worked</b> here <b>for</b> two years. (Hâlâ çalışıyorum.) I <b>have lived</b> in Leeds <b>since</b> 2023.</p>' +
        '<p><b>Soru:</b> <b>How long have you</b> worked here? <b>How long has she</b> lived in the UK?</p>' +
        '<p><b>Dikkat:</b> "I work here since two years" yanlış. Doğrusu: I <b>have worked</b> here <b>for</b> two years. Türkçedeki "-dır" fikri present perfect ister.</p>' +
        '<p><b>İş ifadeleri:</b> I work as a ... I have experience in ... I am good at ... I am looking for a ... job. I am reliable and friendly.</p>' +
        '<p><b>CV özeti örneği:</b> "Friendly cashier with two years of experience. Good at customer service and teamwork. Looking for a part time job."</p>',
      examples: ['I have worked here for two years.', 'She has lived in Leeds since 2023.', 'How long have you worked here?', 'I am good at customer service.']
    },
    exercises: [
      fill('I have lived here ___ three years.', ['for'], 'for/since'),
      fill('She has worked here ___ 2022.', ['since'], 'for/since'),
      mc('How long ___ you worked here?', ['have', 'did', 'do', 'are'], 'have', 'present perfect'),
      mc('Hangisi doğru?', ['I have worked here for two years.', 'I work here since two years.', 'I am work here two years.', 'I worked here since two years.'], 'I have worked here for two years.', 'for/since'),
      mc('I have known her ___ Monday.', ['since', 'for', 'ago', 'in'], 'since', 'for/since'),
      mc('"I am good at teamwork" means:', ['Takım çalışmasında iyiyim.', 'Takım çalışmasından nefret ederim.', 'Takımda çalışmıyorum.', 'Takım çalışmasını bilmiyorum.'], 'Takım çalışmasında iyiyim.', 'CV phrases'),
      mc('I work ___ a cashier.', ['as', 'like', 'for', 'at'], 'as', 'CV phrases'),
      order(['How', 'long', 'have', 'you', 'lived', 'in', 'the', 'UK'], ['How long have you lived in the UK'], 'present perfect'),
      order(['I', 'am', 'looking', 'for', 'a', 'part', 'time', 'job'], ['I am looking for a part time job', "I'm looking for a part time job"], 'CV phrases'),
      typed('Çevir: Burada iki yıldır çalışıyorum.', ['I have worked here for two years', "I've worked here for two years"], 'for/since'),
      typed('Çevir: 2023\'ten beri Leeds\'te yaşıyorum.', ['I have lived in Leeds since 2023', "I've lived in Leeds since 2023"], 'for/since'),
      match([['experience', 'deneyim'], ['skill', 'beceri'], ['reliable', 'güvenilir'], ['apply for', 'başvurmak']], 'vocab')
    ],
    listening: [
      lmc("I've worked here for two years.", ["I've worked here for two years.", "I've worked here since two years.", "I worked here for two years.", "I've worked there for two years."], "I've worked here for two years.", 'for/since'),
      lmc('She has lived in Leeds since 2023.', ['She has lived in Leeds since 2023.', 'She has lived in Leeds for 2023.', 'She lived in Leeds in 2023.', 'She has lived in Leicester since 2023.'], 'She has lived in Leeds since 2023.', 'for/since'),
      dict('How long have you worked here?'),
      dict('I am looking for a part time job.', ['I am looking for a part time job', "I'm looking for a part time job", 'I am looking for a part-time job'], 'CV phrases')
    ],
    speaking: [
      speak('I have worked here for two years.', 'Burada iki yıldır çalışıyorum.'),
      speak('How long have you lived in the UK?', 'Birleşik Krallık\'ta ne kadardır yaşıyorsun?'),
      speak('I am good at customer service.', 'Müşteri hizmetlerinde iyiyim.'),
      speak('I am looking for a part time job.', 'Yarı zamanlı bir iş arıyorum.')
    ],
    reading: {
      text: 'CV profile\nName: Ayse Demir\nFriendly shop assistant with two years of experience in a supermarket. Good at customer service and teamwork. I have worked in the same shop since 2023. I am reliable and I learn quickly. I am looking for a part time job near Chester.',
      glossary: [['profile', 'özet bilgi'], ['learn quickly', 'çabuk öğrenmek'], ['same', 'aynı']],
      questions: [
        rq('What is Ayse\'s job?', ['shop assistant', 'teacher', 'nurse', 'manager'], 'shop assistant'),
        rq('How long has she worked in the shop?', ['since 2023', 'for 2023', 'since two years ago', 'for last year'], 'since 2023'),
        rq('What job is she looking for?', ['a part time job', 'a full time job', 'a night job', 'no job'], 'a part time job')
      ]
    },
    writing: {
      prompt: 'Write a CV profile of about 50 words. Say your job or skills, how long you have done it (use for or since), and what job you are looking for. (45 to 60 words)',
      promptTR: 'Yaklaşık 50 kelimelik bir CV özeti yaz. İşini veya becerilerini, bunu ne kadardır yaptığını (for veya since) ve nasıl bir iş aradığını yaz. (45-60 kelime)',
      minWords: 40,
      checklist: ['I have + past participle kullandım', 'for veya since kullandım', 'En az 2 beceri yazdım', 'Aradığım işi yazdım']
    }
  });

  def('2.10', {
    can: 'Okul sistemini anlatabilir, öğretmenle konuşabilir, soru kalıplarını ve zaman edatlarını kullanabilir, kısa bir devamsızlık notu yazabilirim.',
    vocab: [
      v('nursery', 'anaokulu (küçük)', 'My daughter goes to nursery.', 'Kızım anaokuluna gidiyor.'),
      v('primary school', 'ilkokul', 'He is at primary school.', 'O ilkokulda.'),
      v('secondary school', 'ortaokul / lise', 'She starts secondary school in September.', 'Eylülde ortaokula başlıyor.'),
      v('teacher', 'öğretmen', 'Can I speak to the teacher?', 'Öğretmenle konuşabilir miyim?'),
      v('term', 'dönem', 'The term starts on 4 September.', 'Dönem 4 Eylül\'de başlıyor.'),
      v('holiday', 'tatil', 'The school holiday is in August.', 'Okul tatili Ağustos\'ta.'),
      v('parents\' evening', 'veli toplantısı', 'There is a parents\' evening on Thursday.', 'Perşembe veli toplantısı var.'),
      v('absence', 'devamsızlık', 'Please write an absence note.', 'Lütfen devamsızlık notu yaz.'),
      v('homework', 'ödev', 'He has a lot of homework.', 'Çok ödevi var.'),
      v('lesson', 'ders', 'The first lesson starts at nine.', 'İlk ders dokuzda başlıyor.'),
      v('uniform', 'okul kıyafeti', 'The school has a uniform.', 'Okulun bir kıyafeti var.'),
      v('pick up', 'almak (çocuğu)', 'I pick up my son at three.', 'Oğlumu saat üçte alıyorum.')
    ],
    grammar: {
      title: 'Soru kalıpları ve zaman edatları (at, on, in, for, from ... to)',
      html: '<p><b>Soru sırası:</b> Soru kelimesi + yardımcı fiil + özne + fiil. <b>What time does</b> school <b>start</b>? <b>When is</b> the parents\' evening? <b>Who is</b> his teacher? <b>How</b> many lessons <b>do</b> they <b>have</b>?</p>' +
        '<p><b>Zaman edatları:</b> <b>at</b> + saat: at 9 o\'clock. <b>on</b> + gün ve tarih: on Monday, on 4 September. <b>in</b> + ay, mevsim, yıl: in September, in winter, in 2026. <b>from ... to</b> = ... den ... e: from 9 to 3. <b>for</b> + süre: for two weeks. <b>until</b> = ... e kadar.</p>' +
        '<p><b>Okul konuşması:</b> My child is ill today. What time does school finish? Could I speak to the teacher? I did not get the letter. Is there homework today?</p>' +
        '<p><b>Kısa not (devamsızlık):</b> Dear Mrs Smith, Ali was absent on Monday because he was ill. Thank you. Yours sincerely, Ayse Yilmaz.</p>' +
        '<p><b>Not:</b> Çocuğunuz yoksa topluluk veya gönüllülük bağlamını kullanabilirsiniz: What time does the class start? Can I join the group?</p>',
      examples: ['What time does school finish?', 'The term starts on 4 September.', 'My son is ill today.', 'Could I speak to the teacher?']
    },
    exercises: [
      mc('School starts ___ nine o\'clock.', ['at', 'on', 'in', 'to'], 'at', 'time prepositions'),
      mc('The parents\' evening is ___ Thursday.', ['on', 'at', 'in', 'from'], 'on', 'time prepositions'),
      mc('The school holiday is ___ August.', ['in', 'on', 'at', 'for'], 'in', 'time prepositions'),
      fill('The lessons are ___ 9 to 3.', ['from'], 'time prepositions'),
      mc('What time ___ school finish?', ['does', 'do', 'is', 'did'], 'does', 'questions'),
      mc('Hangisi doğru?', ['What time does school finish?', 'What time school finish?', 'What time does school finishes?', 'What time is school finish?'], 'What time does school finish?', 'questions'),
      mc('"Absence note" means:', ['devamsızlık notu', 'ödev notu', 'sınav notu', 'okul listesi'], 'devamsızlık notu', 'vocab'),
      order(['Could', 'I', 'speak', 'to', 'the', 'teacher', 'please'], ['Could I speak to the teacher, please', 'Could I speak to the teacher please'], 'polite requests'),
      order(['My', 'son', 'is', 'ill', 'today'], ['My son is ill today'], 'be'),
      typed('Çevir: Okul saat kaçta bitiyor?', ['What time does school finish', 'What time does the school finish', 'What time does school end'], 'questions'),
      typed('Çevir: Oğlum bugün hasta.', ['My son is ill today', 'My son is sick today'], 'be'),
      match([['nursery', 'anaokulu'], ['term', 'dönem'], ['homework', 'ödev'], ['lesson', 'ders']], 'vocab')
    ],
    listening: [
      lmc('School finishes at three fifteen.', ['School finishes at three fifteen.', 'School finishes at three fifty.', 'School starts at three fifteen.', 'School finishes at half past three.'], 'School finishes at three fifteen.', 'time', 'fifteen (TEEN, sonda vurgu) ve fifty (FIF-ti).'),
      lmc('The term starts on the fourth of September.', ['The term starts on the fourth of September.', 'The term ends on the fourth of September.', 'The term starts on the fourth of December.', 'The term starts in the fourth of September.'], 'The term starts on the fourth of September.', 'time prepositions'),
      dict('My daughter is ill today.'),
      dict('What time does school start?')
    ],
    speaking: [
      speak('My son is ill today.', 'Oğlum bugün hasta.'),
      speak('What time does school finish?', 'Okul saat kaçta bitiyor?'),
      speak('Could I speak to the teacher, please?', 'Öğretmenle konuşabilir miyim, lütfen?'),
      speak('When is the parents evening?', 'Veli toplantısı ne zaman?')
    ],
    reading: {
      text: 'Letter from school\nDear Parents,\nThe term starts on Monday 4 September. School begins at 8.50 am and finishes at 3.15 pm.\nThere is a parents\' evening on Thursday 14 September at 6 pm.\nPlease send a note if your child is absent.\nThank you,\nMrs Brown, Head Teacher',
      glossary: [['head teacher', 'okul müdürü'], ['absent', 'devamsız'], ['begins', 'başlar']],
      questions: [
        rq('When does the term start?', ['on Monday 4 September', 'on Thursday 14 September', 'on Monday 14 September', 'in October'], 'on Monday 4 September'),
        rq('What time does school finish?', ['at 3.15 pm', 'at 8.50 am', 'at 6 pm', 'at 4 pm'], 'at 3.15 pm'),
        rq('What must parents send if a child is absent?', ['a note', 'money', 'a photo', 'homework'], 'a note')
      ]
    },
    writing: {
      prompt: 'Write an absence note to a teacher. Say who was absent, which day, and why. Use Dear ..., because and Yours sincerely. (35 to 50 words)',
      promptTR: 'Bir öğretmene devamsızlık notu yaz. Kimin hangi gün ve neden gelmediğini yaz. Dear ..., because ve Yours sincerely kullan. (35-50 kelime)',
      minWords: 30,
      checklist: ['Dear ... ile başladım', 'Kim, hangi gün ve neden yazdım', 'because kullandım', 'Yours sincerely ve adımla bitirdim']
    }
  });

  def('2.11', {
    can: 'Telefonda kibarca bilgi isteyebilir, dolaylı soru kurabilir, harf ve sayıları telefonda harflendirebilir, kısa mesajlar yazabilirim.',
    vocab: [
      v('call', 'aramak', "I'm calling about my bill.", 'Faturam hakkında arıyorum.'),
      v('message', 'mesaj', 'Can I leave a message?', 'Mesaj bırakabilir miyim?'),
      v('reference number', 'referans numarası', 'Can I have a reference number?', 'Referans numarası alabilir miyim?'),
      v('spell', 'harflemek', 'Could you spell that, please?', 'Harflerini söyler misiniz, lütfen?'),
      v('hold', 'beklemek (telefonda)', 'Please hold the line.', 'Lütfen hatta kalın.'),
      v('bill', 'fatura', 'I have a question about my bill.', 'Faturamla ilgili bir sorum var.'),
      v('account', 'hesap', 'What is your account number?', 'Hesap numaranız nedir?'),
      v('repeat', 'tekrarlamak', 'Could you repeat that, please?', 'Tekrar eder misiniz, lütfen?'),
      v('slowly', 'yavaşça', 'Could you speak more slowly?', 'Daha yavaş konuşabilir misiniz?'),
      v('email', 'e-posta', 'I sent you an email.', 'Sana bir e-posta gönderdim.'),
      v('text', 'kısa mesaj (SMS)', 'I will text you.', 'Sana mesaj atacağım.'),
      v('call back', 'geri aramak', 'Could you call me back?', 'Beni geri arar mısınız?')
    ],
    grammar: {
      title: 'Dolaylı kibar sorular ve telefon kalıpları',
      html: '<p><b>Dolaylı soru:</b> Kibar durmak için başına <b>Could you tell me ...?</b> ekle. Soru sırası <b>cümle sırasına</b> döner (do / does yok): Where is the office? → Could you tell me <b>where the office is</b>? What time does it open? → Do you know <b>what time it opens</b>?</p>' +
        '<p><b>Yanlış:</b> Could you tell me where is the office? Doğru: Could you tell me where <b>the office is</b>?</p>' +
        '<p><b>Rica:</b> Could you ...? Could you repeat that? Could you speak more slowly? Could you spell that? Could you call me back? Can I leave a message?</p>' +
        '<p><b>Telefon kalıpları:</b> Hello, this is Ayse Demir. I\'m calling about my bill. Sorry, I didn\'t understand. Could you say that again? Thank you for your help. Goodbye.</p>' +
        '<p><b>Harflendirme:</b> A (ey), B (bii), C (sii), D (dii), E (ii), G (ci), J (cey), R (aa), W (dabılyu). Sayılar: 0 = oh (telefonda), 07 = oh seven. 77 = double seven.</p>' +
        '<p><b>Kısa mesajlar:</b> Resmi: Dear Mr Jones, I am writing to ask about ... Thank you. Kind regards, Ayse. Gayriresmi: Hi Sam, running late! See you at 6. Ayse x</p>',
      examples: ['Could you tell me where the office is?', 'Do you know what time it opens?', 'Could you spell that, please?', 'Could you speak more slowly?']
    },
    exercises: [
      mc('Could you tell me where ___?', ['the office is', 'is the office', 'does the office is', 'the office does'], 'the office is', 'indirect questions', 'Dolaylı soruda cümle sırası: the office is.'),
      mc('Do you know what time ___?', ['it opens', 'does it open', 'opens it', 'it does open'], 'it opens', 'indirect questions'),
      mc('Hangisi doğru?', ['Could you tell me how much it costs?', 'Could you tell me how much does it cost?', 'Could you tell me how much cost?', 'Could you tell me how does it cost much?'], 'Could you tell me how much it costs?', 'indirect questions'),
      mc('Telefonda bir şeyi tekrar istemek için:', ['Could you repeat that, please?', 'Repeat it!', 'You say again.', 'What?'], 'Could you repeat that, please?', 'phone phrases'),
      fill('Could you ___ that, please? (harflerini söyle)', ['spell'], 'phone phrases'),
      fill('Could you speak more ___?', ['slowly'], 'phone phrases'),
      mc('07 telefonda nasıl okunur?', ['oh seven', 'zero seven', 'o seven', 'seven oh'], 'oh seven', 'numbers', 'Telefonda 0 çoğunlukla "oh" okunur (zero de olur).'),
      order(['Could', 'you', 'tell', 'me', 'where', 'the', 'station', 'is'], ['Could you tell me where the station is'], 'indirect questions'),
      order(['Can', 'I', 'leave', 'a', 'message'], ['Can I leave a message'], 'phone phrases'),
      typed('Çevir: Sizi geri arayabilir miyim?', ['Can I call you back', 'Could I call you back'], 'phone phrases'),
      typed('Çevir: Faturam hakkında arıyorum.', ["I'm calling about my bill", 'I am calling about my bill'], 'phone phrases'),
      match([['hold', 'beklemek (hatta)'], ['spell', 'harflemek'], ['repeat', 'tekrarlamak'], ['call back', 'geri aramak']], 'vocab')
    ],
    listening: [
      lmc('Could you spell your surname, please?', ['Could you spell your surname, please?', 'Could you say your surname, please?', 'Could you write your surname, please?', 'Can I spell your surname, please?'], 'Could you spell your surname, please?', 'phone phrases'),
      lmc('My number is oh seven seven double three one.', ['My number is oh seven seven double three one.', 'My number is oh seven seven three three one.', 'My number is oh seven seven double two one.', 'My number is oh eight seven double three one.'], 'My number is oh seven seven double three one.', 'numbers'),
      dict('Could you speak more slowly, please?'),
      dict('Please hold the line.')
    ],
    speaking: [
      speak("Hello, I'm calling about my bill.", 'Merhaba, faturam hakkında arıyorum.'),
      speak('Could you repeat that, please?', 'Tekrar eder misiniz, lütfen?'),
      speak('Could you tell me where the office is?', 'Ofisin nerede olduğunu söyler misiniz?'),
      speak('Could you spell that, please?', 'Harflerini söyler misiniz, lütfen?')
    ],
    reading: {
      text: 'Phone call to the energy company (practice)\nAgent: Good morning, Bright Energy. How can I help?\nCaller: Hello, I\'m calling about my bill.\nAgent: Could you give me your account number, please?\nCaller: Of course. It\'s 4 5 2 9 1.\nAgent: And could you spell your surname?\nCaller: D-E-M-I-R.\nAgent: Thank you. Please hold the line.',
      glossary: [['agent', 'görevli'], ['surname', 'soyadı'], ['hold the line', 'hatta kalın']],
      questions: [
        rq('Why does the caller phone?', ['about a bill', 'about a job', 'about a flat', 'about a school'], 'about a bill'),
        rq('What does the agent ask first?', ['the account number', 'the address', 'the age', 'the job'], 'the account number'),
        rq('What does the caller spell?', ['her surname', 'her first name', 'her street', 'her email'], 'her surname')
      ]
    },
    writing: {
      prompt: 'Write a short phone conversation (6 lines) with a company. Ask for information and ask the person to spell or repeat something. Use Could you ... (50 to 70 words)',
      promptTR: 'Bir şirketle 6 satırlık kısa bir telefon konuşması yaz. Bilgi iste ve bir şeyi harflemesini veya tekrarlamasını rica et. Could you ... kullan. (50-70 kelime)',
      minWords: 40,
      checklist: ['Could you ... ile rica ettim', 'Dolaylı soru (Could you tell me where ...) kullandım', 'Harf veya sayı söyledim', 'Thank you ile bitirdim']
    }
  });

  def('2.12', {
    can: 'will ile karar ve tahmin söyleyebilir, first conditional kurabilir, should ile tavsiye verip söz verebilirim. A2 tekrarı.',
    vocab: [
      v('promise', 'söz vermek', "I promise I'll call you.", 'Söz veriyorum seni arayacağım.'),
      v('advice', 'tavsiye', 'Can I give you some advice?', 'Sana bir tavsiye verebilir miyim?'),
      v('decide', 'karar vermek', "I've decided to learn English.", 'İngilizce öğrenmeye karar verdim.'),
      v('probably', 'muhtemelen', "It'll probably rain tomorrow.", 'Yarın muhtemelen yağmur yağar.'),
      v('maybe', 'belki', "Maybe I'll go to the gym.", 'Belki spor salonuna giderim.'),
      v('if', 'eğer', "If it rains, we'll stay at home.", 'Yağmur yağarsa evde kalırız.'),
      v('next year', 'gelecek yıl', 'Next year I will start a course.', 'Gelecek yıl bir kursa başlayacağım.'),
      v('soon', 'yakında', 'I will see you soon.', 'Yakında görüşürüz.'),
      v('invite', 'davet etmek', "I'll invite my neighbour.", 'Komşumu davet edeceğim.'),
      v('forget', 'unutmak', "Don't forget your keys.", 'Anahtarlarını unutma.'),
      v('easy', 'kolay', 'English will get easier.', 'İngilizce kolaylaşacak.'),
      v('practise', 'pratik yapmak (UK)', 'You should practise every day.', 'Her gün pratik yapmalısın.')
    ],
    grammar: {
      title: 'will, first conditional, should (tavsiye)',
      html: '<p><b>will + fiil</b> = o anda verilen karar, söz, tahmin. I <b>will</b> help you. (Karar.) I <b>will</b> call you tomorrow. (Söz.) It <b>will</b> rain tomorrow. (Tahmin.) Kısa: I\'<b>ll</b>, you\'<b>ll</b>, she\'<b>ll</b>. Olumsuz: <b>won\'t</b> (will not): I won\'t forget.</p>' +
        '<p><b>First conditional:</b> If + present simple, will + fiil. <b>If</b> it <b>rains</b>, we <b>will stay</b> at home. If you <b>study</b>, you <b>will pass</b>. "If it will rain" yanlıştır. If cümlesinde will kullanılmaz.</p>' +
        '<p><b>should (tavsiye):</b> You <b>should</b> practise every day. You <b>shouldn\'t</b> worry. Soru: What should I do? Yumuşak tavsiye: <b>Why don\'t you</b> ...? / <b>I think you should</b> ...</p>' +
        '<p><b>Söz vermek:</b> I promise I\'ll call you. I\'ll be there at six. Don\'t worry, I won\'t be late.</p>' +
        '<p><b>A2 tekrar listesi:</b> was / were, past simple (düzenli, düzensiz), should, going to, comparatives, must / have to, present perfect (for / since), polite requests.</p>',
      examples: ["I'll call you tomorrow.", "If it rains, we'll stay at home.", 'You should practise every day.', "I promise I won't be late."]
    },
    exercises: [
      fill("I ___ call you tomorrow. (söz)", ['will', "'ll"], 'will'),
      mc('If it rains, we ___ at home.', ['will stay', 'stay', 'stayed', 'are staying'], 'will stay', 'first conditional'),
      mc('If you ___ every day, you will improve.', ['practise', 'will practise', 'practised', 'practising'], 'practise', 'first conditional', 'if cümlesinde will kullanılmaz.'),
      mc('Hangisi doğru?', ["If it rains, I'll take an umbrella.", "If it'll rain, I take an umbrella.", 'If it will rain, I take umbrella.', 'If rains, I will take an umbrella.'], "If it rains, I'll take an umbrella.", 'first conditional'),
      mc('You ___ worry. It is only a small problem.', ["shouldn't", 'should', 'will', "don't"], "shouldn't", 'should'),
      mc('I promise I ___ forget your birthday.', ["won't", "don't", "didn't", 'not'], "won't", 'will'),
      fill('What ___ I do? (tavsiye iste)', ['should'], 'should'),
      order(['If', 'you', 'study', 'you', 'will', 'pass'], ['If you study, you will pass', 'If you study you will pass'], 'first conditional'),
      order(['You', 'should', 'practise', 'every', 'day'], ['You should practise every day'], 'should'),
      typed('Çevir: Yarın seni arayacağım.', ["I'll call you tomorrow", 'I will call you tomorrow', 'I will phone you tomorrow', "I'll phone you tomorrow"], 'will'),
      typed('Çevir: Yarın yağmur yağarsa evde kalırız.', ["If it rains tomorrow, we'll stay at home", 'If it rains tomorrow, we will stay at home', "If it rains tomorrow we'll stay at home"], 'first conditional'),
      match([['promise', 'söz vermek'], ['advice', 'tavsiye'], ['probably', 'muhtemelen'], ['decide', 'karar vermek']], 'vocab')
    ],
    listening: [
      lmc("If it rains, we'll stay at home.", ["If it rains, we'll stay at home.", "If it rains, we stay at home.", "If it rained, we'd stay at home.", "If it rains, we'll stay at work."], "If it rains, we'll stay at home.", 'first conditional'),
      lmc("I won't be late.", ["I won't be late.", 'I want to be late.', "I wasn't late.", "I won't be there."], "I won't be late.", 'will', "won't (uon't) ve want (uont) benzerdir."),
      dict("I'll call you tomorrow.", ["I'll call you tomorrow", 'I will call you tomorrow'], 'will'),
      dict('You should practise every day.')
    ],
    speaking: [
      speak("I'll call you tomorrow.", 'Yarın seni arayacağım.'),
      speak("If it rains, we'll stay at home.", 'Yağmur yağarsa evde kalırız.'),
      speak('You should practise every day.', 'Her gün pratik yapmalısın.'),
      speak("I promise I won't be late.", 'Söz veriyorum geç kalmayacağım.')
    ],
    reading: {
      text: 'Advice for new learners\n1. You should practise a little every day.\n2. If you listen to the radio, your English will improve.\n3. Don\'t worry about mistakes. Everyone makes them.\n4. If you speak with neighbours, you\'ll learn new words.\nIn a year, you will probably understand a lot more.',
      glossary: [['improve', 'gelişmek'], ['mistake', 'hata'], ['neighbour', 'komşu']],
      questions: [
        rq('How often should you practise?', ['every day', 'once a month', 'never', 'only on Sunday'], 'every day'),
        rq('What helps you learn new words?', ['speaking with neighbours', 'sleeping', 'buying books', 'waiting'], 'speaking with neighbours'),
        rq('What will probably happen in a year?', ['You will understand more.', 'You will forget everything.', 'You will stop learning.', 'Nothing will change.'], 'You will understand more.')
      ]
    },
    writing: {
      prompt: 'Give advice to a friend who has just moved to the UK. Write four pieces of advice and two promises. Use should, will and If ... will. (60 to 80 words)',
      promptTR: 'Birleşik Krallık\'a yeni taşınmış bir arkadaşına tavsiyeler ver: dört tavsiye ve iki söz yaz. should, will ve If ... will kullan. (60-80 kelime)',
      minWords: 45,
      checklist: ['should kullandım', "will veya 'll kullandım", 'If + present simple, will + fiil yazdım', 'Bir söz verdim (I promise...)']
    }
  });

  def('3.1', {
    can: 'I can tell a story about something that happened, using the past continuous with the past simple and sequencing words.',
    vocab: [
      v('suddenly', 'birdenbire', 'Suddenly the lights went out.', 'Birdenbire ışıklar söndü.'),
      v('while', '... iken', 'While I was cooking, the phone rang.', 'Yemek yaparken telefon çaldı.'),
      v('when', '... dığında', 'When I arrived, they were eating.', 'Vardığımda yemek yiyorlardı.'),
      v('at first', 'ilk önce', 'At first I did not understand.', 'İlk başta anlamadım.'),
      v('then', 'sonra', 'Then I called a taxi.', 'Sonra bir taksi çağırdım.'),
      v('after that', 'ondan sonra', 'After that, we went home.', 'Ondan sonra eve gittik.'),
      v('in the end', 'sonunda', 'In the end, everything was fine.', 'Sonunda her şey yolundaydı.'),
      v('luckily', 'şans eseri', 'Luckily, nobody was hurt.', 'Şans eseri kimse yaralanmadı.'),
      v('notice', 'fark etmek', 'I noticed a strange noise.', 'Garip bir ses fark ettim.'),
      v('realise', 'fark etmek, anlamak', 'I realised I had no keys.', 'Anahtarım olmadığını fark ettim.'),
      v('crowded', 'kalabalık', 'The train was very crowded.', 'Tren çok kalabalıktı.'),
      v('lucky', 'şanslı', 'We were lucky with the weather.', 'Havayla ilgili şanslıydık.')
    ],
    grammar: {
      title: 'Past continuous and past simple (when, while), sequencing words',
      html: '<p><b>Past continuous</b> (was / were + -ing) describes a background action in progress: I <b>was walking</b> home. They <b>were waiting</b> for the bus.</p>' +
        '<p><b>Past simple</b> describes a short event that interrupts it: I was walking home <b>when</b> it started to rain. The phone <b>rang</b> while I <b>was cooking</b>.</p>' +
        '<p><b>while + past continuous</b> (long action): <b>While</b> I was cooking, the phone rang. <b>when + past simple</b> (short action): <b>When</b> the phone rang, I was cooking. Two long actions together: I was cooking <b>while</b> he was watching TV.</p>' +
        '<p><b>Sequencing words:</b> First, At first, Then, Next, After that, Suddenly, In the end, Finally. Use a comma after them: Then, I called a taxi.</p>' +
        '<p><b>Do not use the continuous</b> for finished single events: Yesterday I was going to the shop is wrong when you mean a completed trip. Say: I went to the shop. Stative verbs (know, like, want) are not used in the continuous.</p>',
      examples: ['I was walking home when it started to rain.', 'While I was cooking, the phone rang.', 'At first I was nervous. In the end, it was fine.', 'We were waiting at the station when the train arrived.']
    },
    exercises: [
      mc('I ___ home when it started to rain.', ['was walking', 'walked', 'am walking', 'walking'], 'was walking', 'past continuous'),
      mc('While I ___ dinner, the phone rang.', ['was cooking', 'cooked', 'cook', 'am cooking'], 'was cooking', 'when/while'),
      mc('I was cooking ___ the phone rang.', ['when', 'while', 'during', 'because'], 'when', 'when/while', 'A short event (the phone rang) comes with when.'),
      fill('They ___ waiting at the station. (were / was)', ['were'], 'past continuous'),
      fill('She was ___ a book when I came in. (read)', ['reading'], 'past continuous'),
      mc('Hangisi doğru?', ['We were watching TV when the lights went out.', 'We watched TV when the lights were going out.', 'We were watch TV when the lights went out.', 'We was watching TV when the lights went out.'], 'We were watching TV when the lights went out.', 'when/while'),
      mc('___, the lights went out. (birdenbire)', ['Suddenly', 'Finally', 'Usually', 'Often'], 'Suddenly', 'sequencing'),
      order(['While', 'I', 'was', 'walking', 'it', 'started', 'to', 'rain'], ['While I was walking, it started to rain', 'While I was walking it started to rain'], 'when/while'),
      order(['In', 'the', 'end', 'everything', 'was', 'fine'], ['In the end, everything was fine', 'In the end everything was fine'], 'sequencing'),
      typed('Translate: Ben yemek yaparken telefon çaldı.', ['While I was cooking, the phone rang', 'While I was cooking the phone rang', 'The phone rang while I was cooking'], 'when/while'),
      typed('Translate: Tren geldiğinde istasyonda bekliyorduk.', ['We were waiting at the station when the train arrived', 'When the train arrived, we were waiting at the station'], 'past continuous'),
      match([['suddenly', 'birdenbire'], ['luckily', 'şans eseri'], ['in the end', 'sonunda'], ['after that', 'ondan sonra']], 'sequencing')
    ],
    listening: [
      lmc('I was cooking when the phone rang.', ['I was cooking when the phone rang.', 'I cooked when the phone rang.', 'I was cooking while the phone rang.', 'I was cooking when the doorbell rang.'], 'I was cooking when the phone rang.', 'when/while'),
      lmc('Suddenly, the bus stopped.', ['Suddenly, the bus stopped.', 'Slowly, the bus stopped.', 'Suddenly, the bus started.', 'Suddenly, the bus was stopping.'], 'Suddenly, the bus stopped.', 'sequencing'),
      dict('We were waiting for the bus.'),
      dict('In the end, everything was fine.')
    ],
    speaking: [
      speak('I was walking home when it started to rain.', 'Eve yürürken yağmur başladı.'),
      speak('While I was cooking, the phone rang.', 'Yemek yaparken telefon çaldı.'),
      speak('At first I was nervous, but in the end it was fine.', 'İlk başta gergindim ama sonunda her şey yolunda gitti.'),
      speak('Luckily, nobody was hurt.', 'Şans eseri kimse yaralanmadı.')
    ],
    reading: {
      text: 'A bad morning\nLast Tuesday I was walking to the station when I realised I had no keys. I was already late.\nSuddenly, a neighbour called my name. She was holding my keys! I had dropped them near the bus stop.\nI thanked her and ran to the station. The train was leaving as I arrived, but I jumped on.\nIn the end, I was only five minutes late.',
      glossary: [['dropped', 'düşürdü'], ['leaving', 'kalkıyor'], ['jumped on', 'atladı, bindi']],
      questions: [
        rq('What was the writer doing when she realised something?', ['walking to the station', 'cooking dinner', 'driving a car', 'sleeping'], 'walking to the station'),
        rq('Where were the keys?', ['A neighbour was holding them.', 'They were at home.', 'They were in the train.', 'They were in the bin.'], 'A neighbour was holding them.'),
        rq('How late was the writer in the end?', ['five minutes', 'one hour', 'not late at all', 'two hours'], 'five minutes')
      ]
    },
    writing: {
      prompt: 'Tell a story about something that happened to you. Use the past continuous and the past simple, with when, while and at least four sequencing words. (90 to 110 words)',
      promptTR: 'Başından geçen bir olayı anlat. Past continuous ve past simple, when, while ve en az dört sıralama kelimesi (first, then, suddenly...) kullan. (90-110 kelime)',
      minWords: 70,
      checklist: ['was / were + -ing kullandım', 'when ve while kullandım', 'En az 4 sıralama kelimesi kullandım', 'Hikâyenin bir sonu var']
    }
  });

  def('3.2', {
    can: 'I can give a life update, using the present perfect, the past simple, and how long.',
    vocab: [
      v('move', 'taşınmak', 'We moved to Chester last year.', 'Geçen yıl Chester\'a taşındık.'),
      v('settle in', 'alışmak, yerleşmek', 'We have settled in well.', 'Çok iyi yerleştik.'),
      v('get used to', 'alışmak', 'I am getting used to the weather.', 'Havaya alışıyorum.'),
      v('miss', 'özlemek', 'I miss my family in Turkey.', 'Türkiye\'deki ailemi özlüyorum.'),
      v('lately', 'son zamanlarda', 'I have been busy lately.', 'Son zamanlarda meşguldüm.'),
      v('recently', 'geçenlerde', 'I have recently started a course.', 'Geçenlerde bir kursa başladım.'),
      v('so far', 'şimdiye kadar', 'So far, I have met three neighbours.', 'Şimdiye kadar üç komşuyla tanıştım.'),
      v('since then', 'o zamandan beri', 'I have lived here since then.', 'O zamandan beri burada yaşıyorum.'),
      v('progress', 'ilerleme', 'I have made progress in English.', 'İngilizcede ilerleme kaydettim.'),
      v('challenge', 'zorluk', 'The accent is a challenge.', 'Aksan bir zorluk.'),
      v('improve', 'gelişmek, geliştirmek', 'My English has improved.', 'İngilizcem gelişti.'),
      v('catch up', 'sohbet edip haberleşmek', "Let's catch up this weekend.", 'Hafta sonu görüşüp konuşalım.')
    ],
    grammar: {
      title: 'Present perfect versus past simple, present perfect continuous (intro), how long',
      html: '<p><b>Past simple</b> = finished time, named or clear: I <b>moved</b> here <b>in 2023</b>. I <b>met</b> her <b>last week</b>.</p>' +
        '<p><b>Present perfect</b> = link to now, unfinished time, experience or result: I <b>have lived</b> here <b>for three years</b>. I <b>have made</b> progress. Time words: for, since, so far, recently, lately, ever, never, just, already, yet.</p>' +
        '<p><b>Present perfect continuous (introduction):</b> have / has been + -ing. Focus on the activity, often something still going on: I <b>have been learning</b> English <b>for a year</b>. She <b>has been working</b> hard <b>lately</b>.</p>' +
        '<p><b>How long?</b> <b>How long have you lived</b> here? <b>How long have you been learning</b> English? Answer with for or since.</p>' +
        '<p><b>Do not mix:</b> I have lived here since 2023 (not: I live here since 2023). Never: I have seen him yesterday. Say: I saw him yesterday.</p>',
      examples: ['I moved to Chester in 2023.', 'I have lived here for three years.', 'I have been learning English for a year.', 'How long have you lived in the UK?']
    },
    exercises: [
      mc('I ___ to Chester in 2023.', ['moved', 'have moved', 'move', 'am moving'], 'moved', 'perfect vs past'),
      mc('I ___ here for three years.', ['have lived', 'lived', 'live', 'am living'], 'have lived', 'perfect vs past'),
      mc('How long ___ you been learning English?', ['have', 'did', 'do', 'are'], 'have', 'perfect continuous'),
      fill('She has been ___ hard lately. (work)', ['working'], 'perfect continuous'),
      mc('Hangisi doğru?', ['I have lived here since 2023.', 'I live here since 2023.', 'I am living here since 2023.', 'I lived here since 2023.'], 'I have lived here since 2023.', 'for/since'),
      mc('I ___ my keys yesterday.', ['lost', 'have lost', 'lose', 'was losing'], 'lost', 'perfect vs past', 'Yesterday is a finished time: use the past simple.'),
      mc('___ have you lived in the UK?', ['How long', 'How much', 'How many', 'How often'], 'How long', 'questions'),
      fill('So far, I ___ met three neighbours.', ['have', "'ve"], 'present perfect'),
      order(['How', 'long', 'have', 'you', 'been', 'learning', 'English'], ['How long have you been learning English'], 'perfect continuous'),
      order(['We', 'have', 'settled', 'in', 'well'], ['We have settled in well', "We've settled in well"], 'present perfect'),
      typed('Translate: Üç yıldır burada yaşıyoruz.', ['We have lived here for three years', "We've lived here for three years"], 'for/since'),
      typed('Translate: Bir yıldır İngilizce öğreniyorum.', ['I have been learning English for a year', "I've been learning English for a year"], 'perfect continuous'),
      match([['settle in', 'yerleşmek'], ['miss', 'özlemek'], ['lately', 'son zamanlarda'], ['progress', 'ilerleme']], 'vocab')
    ],
    listening: [
      lmc("I've lived here for three years.", ["I've lived here for three years.", 'I lived here for three years.', "I've lived here since three years.", "I've lived there for three years."], "I've lived here for three years.", 'perfect vs past'),
      lmc("She's been working hard lately.", ["She's been working hard lately.", "She's working hard lately.", 'She worked hard lately.', "He's been working hard lately."], "She's been working hard lately.", 'perfect continuous'),
      dict('How long have you lived in the UK?'),
      dict("I've made a lot of progress.", ["I've made a lot of progress", 'I have made a lot of progress'], 'present perfect')
    ],
    speaking: [
      speak("I've lived in the UK for two years.", 'İki yıldır Birleşik Krallık\'ta yaşıyorum.'),
      speak("I've been learning English for a year.", 'Bir yıldır İngilizce öğreniyorum.'),
      speak('I moved here in 2023 and I have made new friends.', '2023\'te buraya taşındım ve yeni arkadaşlar edindim.'),
      speak('How long have you been here?', 'Ne zamandır buradasın?')
    ],
    reading: {
      text: 'Hi Maya,\nSorry I haven\'t written for ages! A lot has happened.\nWe moved to Bristol in March. Since then we have been decorating the flat. It is almost finished!\nI have also started an English course. I have been going every Tuesday for three months, and I have already made good progress.\nHow long have you lived in Manchester now? We must catch up soon.\nLove, Selin',
      glossary: [['for ages', 'uzun zamandır'], ['decorate', 'boyamak, döşemek'], ['almost', 'neredeyse']],
      questions: [
        rq('When did Selin move to Bristol?', ['in March', 'last week', 'three months ago', 'in Tuesday'], 'in March'),
        rq('What has she been doing since then?', ['decorating the flat', 'studying law', 'travelling', 'working abroad'], 'decorating the flat'),
        rq('How long has she been going to the course?', ['three months', 'three years', 'one week', 'since March'], 'three months')
      ]
    },
    writing: {
      prompt: 'Write a life update to a friend. Say where you live now, when you moved, what you have been doing recently, and what progress you have made. (90 to 110 words)',
      promptTR: 'Bir arkadaşına hayat güncellemesi yaz: şimdi nerede yaşıyorsun, ne zaman taşındın, son zamanlarda neler yapıyorsun ve hangi ilerlemeyi kaydettin. (90-110 kelime)',
      minWords: 70,
      checklist: ['Past simple (moved in 2023) ve present perfect (have lived for...) birlikte kullandım', 'have been + -ing kullandım', 'for ve since kullandım', 'Bitirirken arkadaşıma bir soru sordum']
    }
  });

  def('3.3', {
    can: 'I can talk about plans and dreams, choose between will, going to and the present continuous, and use the zero, first and second conditional.',
    vocab: [
      v('dream', 'hayal', 'My dream is to open a cafe.', 'Hayalim bir kafe açmak.'),
      v('plan', 'plan', 'I have a plan for next year.', 'Gelecek yıl için bir planım var.'),
      v('career', 'kariyer', 'I want to change my career.', 'Kariyerimi değiştirmek istiyorum.'),
      v('qualification', 'yeterlilik, diploma', 'I need a qualification.', 'Bir yeterlilik belgesine ihtiyacım var.'),
      v('save money', 'para biriktirmek', 'We are saving money for a car.', 'Araba için para biriktiriyoruz.'),
      v('afford', 'parası yetmek', "I can't afford a big house.", 'Büyük bir eve param yetmez.'),
      v('imagine', 'hayal etmek', 'Imagine you win a lot of money.', 'Çok para kazandığını hayal et.'),
      v('wish', 'dilemek', 'I wish I had more time.', 'Keşke daha çok zamanım olsaydı.'),
      v('travel the world', 'dünyayı gezmek', "If I could, I'd travel the world.", 'Yapabilseydim dünyayı gezerdim.'),
      v('chance', 'şans, fırsat', 'It is a good chance to learn.', 'Öğrenmek için iyi bir fırsat.'),
      v('depend on', 'bağlı olmak', 'It depends on the weather.', 'Havaya bağlı.'),
      v('probably', 'muhtemelen', "I'll probably stay at home.", 'Muhtemelen evde kalırım.')
    ],
    grammar: {
      title: 'Talking about the future: will, going to, present continuous; conditionals 0, 1, 2',
      html: '<p><b>will</b>: decisions made now, offers, predictions with an opinion (I think, probably): I <b>will</b> help you. I think it <b>will</b> rain.</p>' +
        '<p><b>going to</b>: plans and intentions made before, and predictions with evidence: I\'m <b>going to</b> start a course. Look at those clouds! It\'s <b>going to</b> rain.</p>' +
        '<p><b>Present continuous</b>: fixed arrangements with a time or a person: I\'<b>m meeting</b> the manager on Friday.</p>' +
        '<p><b>Zero conditional</b> (always true): If you <b>heat</b> ice, it <b>melts</b>. <b>First conditional</b> (real, possible future): If it <b>rains</b>, we <b>will stay</b> at home. <b>Second conditional</b> (unreal or unlikely, now or future): If I <b>had</b> more money, I <b>would travel</b> the world. If + <b>past simple</b>, <b>would</b> + verb. Use <b>were</b> for all persons in formal speech: If I <b>were</b> you, I would apply.</p>' +
        '<p><b>I wish + past simple</b> for unreal present wishes: I wish I <b>had</b> more time.</p>',
      examples: ["I'm going to start a course next month.", 'If it rains, we will stay at home.', 'If I had more time, I would learn Spanish.', "If I were you, I'd apply."]
    },
    exercises: [
      mc("I've decided. I ___ start a new course in September.", ['am going to', 'will', 'start', 'am start'], 'am going to', 'future forms'),
      mc('Look at those black clouds! It ___ rain.', ['is going to', 'will', 'rains', 'is raining'], 'is going to', 'future forms', 'There is evidence now (clouds), so going to.'),
      mc('"The phone is ringing." "I ___ answer it."', ['will', 'am going to', 'am answering', 'answer'], 'will', 'future forms', 'A decision made at the moment of speaking: will.'),
      mc('If it rains tomorrow, we ___ at home.', ['will stay', 'would stay', 'stay', 'stayed'], 'will stay', 'first conditional'),
      mc('If I ___ more money, I would travel the world.', ['had', 'have', 'will have', 'would have'], 'had', 'second conditional'),
      fill('If I ___ you, I would apply. (be)', ['were', 'was'], 'second conditional'),
      mc('If you heat ice, it ___.', ['melts', 'will melt', 'melted', 'would melt'], 'melts', 'zero conditional'),
      mc('Hangisi doğru?', ["If I won the lottery, I'd buy a house.", 'If I will win the lottery, I buy a house.', "If I win the lottery, I'd buy a house.", "If I won the lottery, I'll bought a house."], "If I won the lottery, I'd buy a house.", 'second conditional'),
      order(['If', 'I', 'had', 'more', 'time', 'I', 'would', 'learn', 'Spanish'], ['If I had more time, I would learn Spanish', 'If I had more time I would learn Spanish'], 'second conditional'),
      order(['I', 'am', 'meeting', 'the', 'manager', 'on', 'Friday'], ['I am meeting the manager on Friday', "I'm meeting the manager on Friday"], 'future forms'),
      typed('Translate: Param olsaydı dünyayı gezerdim.', ["If I had money, I would travel the world", "If I had the money, I'd travel the world", "If I had money, I'd travel the world", 'If I had the money, I would travel the world'], 'second conditional'),
      typed('Translate: Gelecek ay bir kursa başlayacağım.', ["I'm going to start a course next month", 'I am going to start a course next month', "I'm starting a course next month"], 'future forms'),
      match([['dream', 'hayal'], ['afford', 'parası yetmek'], ['qualification', 'yeterlilik'], ['depend on', 'bağlı olmak']], 'vocab')
    ],
    listening: [
      lmc("If I had more time, I'd learn Spanish.", ["If I had more time, I'd learn Spanish.", "If I have more time, I'll learn Spanish.", "If I had more time, I'd learn French.", 'If I had more money, I would learn Spanish.'], "If I had more time, I'd learn Spanish.", 'second conditional'),
      lmc("I'm going to start a course next month.", ["I'm going to start a course next month.", "I'll start a course next month.", "I'm going to start a course last month.", "I'm going to finish a course next month."], "I'm going to start a course next month.", 'future forms'),
      dict('If it rains, we will stay at home.'),
      dict('What would you do if you won the lottery?')
    ],
    speaking: [
      speak("I'm going to start a course next month.", 'Gelecek ay bir kursa başlayacağım.'),
      speak('If I could, I would travel the world.', 'Yapabilseydim dünyayı gezerdim.'),
      speak('If it rains tomorrow, we will stay at home.', 'Yarın yağmur yağarsa evde kalırız.'),
      speak('What would you do if you won a lot of money?', 'Çok para kazansan ne yapardın?')
    ],
    reading: {
      text: 'My plans\nNext year I am going to start a business course. I\'m meeting the college advisor on Monday.\nIf I pass the course, I will look for a job in a bank.\nMy dream is to open a small cafe. If I had enough money, I would open it tomorrow! But I can\'t afford it yet, so I am saving every month.\nWho knows? Maybe in five years it will happen.',
      glossary: [['advisor', 'danışman'], ['business', 'iş, ticaret'], ['enough', 'yeterli']],
      questions: [
        rq('What is the writer going to do next year?', ['start a business course', 'open a cafe', 'move to a bank', 'travel the world'], 'start a business course'),
        rq('What would the writer do with enough money?', ['open a cafe', 'buy a car', 'move abroad', 'stop working'], 'open a cafe'),
        rq('What is the writer doing now to reach the dream?', ['saving money every month', 'working in a cafe', 'studying law', 'asking for a loan'], 'saving money every month')
      ]
    },
    writing: {
      prompt: 'Write about your plans and dreams. Include one plan with going to, one arrangement with the present continuous, one first conditional and two second conditionals ("If I could..."). (90 to 120 words)',
      promptTR: 'Planlarını ve hayallerini yaz: going to ile bir plan, present continuous ile bir randevu, bir first conditional ve iki second conditional ("If I could..."). (90-120 kelime)',
      minWords: 70,
      checklist: ['going to ile plan yazdım', 'Present continuous ile bir randevu yazdım', 'If + present simple, will kullandım', 'If + past simple, would kullandım']
    }
  });

  def('3.4', {
    can: 'I can talk about possibility, give advice and make deductions with may, might, could, should, ought to, must and can\'t, and explain a problem and suggest solutions.',
    vocab: [
      v('possible', 'mümkün', 'It is possible to pay online.', 'Online ödemek mümkün.'),
      v('certain', 'kesin', "I'm certain it is broken.", 'Bunun bozuk olduğundan eminim.'),
      v('probably', 'muhtemelen', 'It is probably a fault.', 'Muhtemelen bir arıza.'),
      v('fault', 'arıza, kusur', "There is a fault in the heating.", 'Isıtmada bir arıza var.'),
      v('broken', 'bozuk, kırık', 'The boiler is broken.', 'Kombi bozuk.'),
      v('repair', 'tamir etmek', 'Could someone repair it?', 'Biri tamir edebilir mi?'),
      v('solution', 'çözüm', "I'd like a solution.", 'Bir çözüm istiyorum.'),
      v('suggest', 'önermek', 'I suggest we call the landlord.', 'Ev sahibini aramamızı öneririm.'),
      v('complain', 'şikâyet etmek', 'I want to complain about the noise.', 'Gürültüyü şikâyet etmek istiyorum.'),
      v('urgent', 'acil', 'It is urgent.', 'Bu acil.'),
      v('as soon as possible', 'mümkün olan en kısa sürede', 'Please reply as soon as possible.', 'Lütfen en kısa sürede cevap verin.'),
      v('in case', '... ihtimaline karşı', 'Take a coat in case it rains.', 'Yağmur ihtimaline karşı mont al.')
    ],
    grammar: {
      title: 'may, might, could, should, ought to, must and can\'t (deduction)',
      html: '<p><b>Possibility (now or future):</b> <b>may / might / could</b> + verb = it is possible, not sure. It <b>might</b> rain. The landlord <b>may</b> be away. It <b>could</b> be a fault. Negative: might not, may not (not "couldn\'t" for possibility).</p>' +
        '<p><b>Deduction (logical conclusion):</b> <b>must</b> = I\'m almost sure it is true. He <b>must</b> be at work. <b>can\'t</b> = I\'m almost sure it is not true. She <b>can\'t</b> be at home. Her car is gone. Use <b>must be / can\'t be</b>, not "must to".</p>' +
        '<p><b>Advice:</b> <b>should / ought to / had better</b>. You <b>should</b> call the landlord. You <b>ought to</b> keep a copy. You <b>had better</b> hurry (strong, warning). Negative: shouldn\'t.</p>' +
        '<p><b>Explain a problem, suggest solutions:</b> The problem is that ... It might be ... I suggest (we) ... Could you send someone to look at it? What do you suggest?</p>' +
        '<p><b>Polite and firm:</b> I\'m afraid it is urgent. I would be grateful if you could ...</p>',
      examples: ["It might be a fault in the boiler.", 'He must be at work. His car is outside.', 'You should call the landlord.', 'Could you send someone to look at it?']
    },
    exercises: [
      mc('The lights are off. They ___ be at home.', ["can't", 'must', 'ought', 'should'], "can't", 'deduction', 'Lights are off: we are almost sure they are not at home.'),
      mc('His car is outside. He ___ be at home.', ['must', "can't", 'might not', 'should'], 'must', 'deduction'),
      mc('I\'m not sure, but it ___ be a fault.', ['might', 'must', "can't", 'ought'], 'might', 'possibility'),
      mc('You ___ call the landlord. It is a good idea.', ['should', 'might', 'may', 'can'], 'should', 'advice'),
      mc('You ___ to keep a copy of the letter.', ['ought', 'should to', 'must to', 'might to'], 'ought', 'advice', 'ought to: always with to.'),
      fill('Hurry! You had ___ catch the bus.', ['better'], 'advice'),
      mc('Hangisi doğru?', ['It might be a fault in the boiler.', 'It might to be a fault.', 'It mights be a fault.', 'It might being a fault.'], 'It might be a fault in the boiler.', 'possibility'),
      fill('The boiler is broken. ___ you send someone to repair it?', ['could', 'Could', 'can', 'would'], 'requests'),
      order(['I', 'suggest', 'we', 'call', 'the', 'landlord'], ['I suggest we call the landlord'], 'suggestions'),
      order(['It', 'could', 'be', 'a', 'fault', 'in', 'the', 'heating'], ['It could be a fault in the heating'], 'possibility'),
      typed('Translate: Ev sahibi evde olabilir. (olasılık)', ['The landlord might be at home', 'The landlord may be at home', 'The landlord could be at home'], 'possibility'),
      typed('Translate: Bu bir arıza olmalı. (kesin)', ['It must be a fault', "It must be a fault"], 'deduction'),
      match([['broken', 'bozuk'], ['repair', 'tamir etmek'], ['urgent', 'acil'], ['fault', 'arıza']], 'vocab')
    ],
    listening: [
      lmc("It might be a fault in the heating.", ["It might be a fault in the heating.", "It must be a fault in the heating.", "It can't be a fault in the heating.", 'It might be a fault in the heater.'], "It might be a fault in the heating.", 'possibility'),
      lmc("He can't be at home.", ["He can't be at home.", 'He can be at home.', 'He must be at home.', "He can't be at work."], "He can't be at home.", 'deduction'),
      dict('You should call the landlord.'),
      dict('Could you send someone to look at it?')
    ],
    speaking: [
      speak('The heating is not working.', 'Isıtma çalışmıyor.'),
      speak('It might be a fault in the boiler.', 'Kombide bir arıza olabilir.'),
      speak('Could you send someone to look at it?', 'Birini bakması için gönderebilir misiniz?'),
      speak('I suggest we call the landlord.', 'Ev sahibini aramamızı öneririm.')
    ],
    reading: {
      text: 'From: Selin Aydin\nTo: Mr Jones, landlord\nSubject: Heating problem\nDear Mr Jones,\nThe heating has not been working since Monday. The radiators are cold, and the boiler is making a strange noise. It could be a fault in the boiler, or it might be the pump.\nIt is quite urgent because we have a small child. I would be grateful if you could send someone to look at it as soon as possible.\nKind regards,\nSelin Aydin',
      glossary: [['radiator', 'kalorifer'], ['boiler', 'kombi'], ['pump', 'pompa']],
      questions: [
        rq('What is the problem?', ['The heating is not working.', 'The water is dirty.', 'The flat is too small.', 'The rent is too high.'], 'The heating is not working.'),
        rq('Why is it urgent?', ['There is a small child.', 'It is Monday.', 'The landlord is away.', 'The boiler is new.'], 'There is a small child.'),
        rq('What does Selin ask?', ['Send someone to look at it.', 'Lower the rent.', 'Change the flat.', 'Pay for a hotel.'], 'Send someone to look at it.')
      ]
    },
    writing: {
      prompt: 'Write a message to a landlord or provider about a problem. Explain what is wrong, say what the cause might be, and suggest a solution. Use might, could, must or can\'t at least twice and ask politely. (90 to 110 words)',
      promptTR: 'Bir ev sahibine veya hizmet sağlayıcıya sorunu anlatan bir mesaj yaz: ne bozuk, nedeni ne olabilir ve çözüm öner. might, could, must veya can\'t en az iki kez kullan ve kibarca rica et. (90-110 kelime)',
      minWords: 70,
      checklist: ['Sorunu açıkça anlattım', 'might / could / must / can\'t kullandım', 'Çözüm önerdim (I suggest / Could you ...)', 'Kibar ve net bir kapanış yazdım']
    }
  });

  def('3.5', {
    can: 'I can describe people and things precisely with defining relative clauses (who, which, that, where), for example at a lost property desk.',
    vocab: [
      v('lost property', 'kayıp eşya bürosu', 'I went to the lost property office.', 'Kayıp eşya bürosuna gittim.'),
      v('describe', 'tarif etmek', 'Can you describe it?', 'Tarif edebilir misin?'),
      v('colour', 'renk', 'It is a dark blue bag.', 'Koyu mavi bir çanta.'),
      v('shape', 'şekil', 'It is a round box.', 'Yuvarlak bir kutu.'),
      v('made of', '... den yapılmış', 'It is made of leather.', 'Deriden yapılmış.'),
      v('leather', 'deri', 'a leather wallet', 'deri bir cüzdan'),
      v('strap', 'askı, kayış', 'It has a long strap.', 'Uzun bir askısı var.'),
      v('contain', 'içermek', 'It contains my keys and phone.', 'İçinde anahtarlarım ve telefonum var.'),
      v('belong to', 'ait olmak', 'This umbrella belongs to me.', 'Bu şemsiye bana ait.'),
      v('lost', 'kayıp', 'I have lost my wallet.', 'Cüzdanımı kaybettim.'),
      v('found', 'bulunmuş', 'Has anyone found a bag?', 'Biri bir çanta buldu mu?'),
      v('item', 'eşya, ürün', 'What does the item look like?', 'Eşya neye benziyor?')
    ],
    grammar: {
      title: 'Defining relative clauses: who, which, that, where',
      html: '<p>A <b>defining relative clause</b> tells us <b>which</b> person or thing we mean. No comma.</p>' +
        '<p><b>who</b> for people: The woman <b>who</b> works at the desk is kind. The man <b>who</b> found my bag is Tom. <b>which</b> for things: The bag <b>which</b> I lost is blue. <b>that</b> for people or things (very common, a little less formal): The bag <b>that</b> I lost is blue. The woman <b>that</b> helped me was kind.</p>' +
        '<p><b>where</b> for places: This is the cafe <b>where</b> I lost my phone.</p>' +
        '<p><b>Object pronoun can be dropped:</b> The bag (<b>that</b>) I lost is blue. (I is the subject of the clause, so that can go.) But not as the subject: The man <b>who</b> found my bag ... (who is needed).</p>' +
        '<p><b>Do not repeat the pronoun:</b> The bag which I lost <b>it</b> is blue is wrong. Say: The bag which I lost is blue.</p>' +
        '<p><b>Describing without naming:</b> It is a thing that you use to open doors. (key) It is a place where you can borrow books. (library)</p>',
      examples: ['The woman who works at the desk is kind.', 'The bag which I lost is blue.', 'This is the cafe where I lost my phone.', "It's a thing that you use to open doors."]
    },
    exercises: [
      mc('The woman ___ works at the desk is kind.', ['who', 'which', 'where', 'what'], 'who', 'relative clauses'),
      mc('The bag ___ I lost is blue.', ['which', 'who', 'where', 'whose'], 'which', 'relative clauses'),
      mc('This is the cafe ___ I lost my phone.', ['where', 'who', 'which', 'when'], 'where', 'relative clauses'),
      mc('The man ___ found my wallet is called Tom.', ['who', 'which', 'where', 'it'], 'who', 'relative clauses'),
      mc('The umbrella ___ is on the table is mine.', ['that', 'who', 'where', 'whose'], 'that', 'relative clauses'),
      mc('Hangisi doğru?', ['The bag which I lost is blue.', 'The bag which I lost it is blue.', 'The bag what I lost is blue.', 'The bag I lost it is blue.'], 'The bag which I lost is blue.', 'relative clauses', 'Do not repeat the object (it).'),
      fill('A library is a place ___ you can borrow books.', ['where'], 'relative clauses'),
      fill('A key is something ___ you use to open a door.', ['that', 'which'], 'relative clauses'),
      order(['The', 'woman', 'who', 'helped', 'me', 'was', 'kind'], ['The woman who helped me was kind', 'The woman that helped me was kind'], 'relative clauses'),
      order(['This', 'is', 'the', 'shop', 'where', 'I', 'bought', 'my', 'bag'], ['This is the shop where I bought my bag'], 'relative clauses'),
      typed('Translate: Kaybettiğim çanta mavi.', ['The bag that I lost is blue', 'The bag which I lost is blue', 'The bag I lost is blue'], 'relative clauses'),
      typed('Translate: Cüzdanımı bulan adam Tom.', ['The man who found my wallet is Tom', 'The man that found my wallet is Tom'], 'relative clauses'),
      match([['lost property', 'kayıp eşya bürosu'], ['leather', 'deri'], ['strap', 'askı'], ['belong to', 'ait olmak']], 'vocab')
    ],
    listening: [
      lmc('The woman who works here is very helpful.', ['The woman who works here is very helpful.', 'The woman who worked here is very helpful.', 'The woman which works here is very helpful.', 'The man who works here is very helpful.'], 'The woman who works here is very helpful.', 'relative clauses'),
      lmc('This is the cafe where I lost my phone.', ['This is the cafe where I lost my phone.', 'This is the shop where I lost my phone.', 'This is the cafe where I found my phone.', 'That is the cafe where I lost my phone.'], 'This is the cafe where I lost my phone.', 'relative clauses'),
      dict('The bag that I lost is blue.'),
      dict('It is a place where you can borrow books.')
    ],
    speaking: [
      speak('The bag that I lost is dark blue.', 'Kaybettiğim çanta koyu mavi.'),
      speak('It is made of leather.', 'Deriden yapılmış.'),
      speak('The woman who works here is very kind.', 'Burada çalışan kadın çok kibar.'),
      speak('It is a place where you can borrow books.', 'Kitap ödünç alabileceğin bir yer.')
    ],
    reading: {
      text: 'At the lost property desk\nClerk: Can I help you?\nMan: Yes, I\'ve lost a bag.\nClerk: Can you describe it?\nMan: It\'s a black leather bag that has a long strap. It contains a laptop and some papers which I need for work.\nClerk: Where did you lose it?\nMan: On the number 5 bus, the one that goes to the station.\nClerk: Let me check. A woman who found a bag handed it in this morning!',
      glossary: [['clerk', 'görevli'], ['handed in', 'teslim etti'], ['papers', 'belgeler']],
      questions: [
        rq('What has the man lost?', ['a black leather bag', 'a blue umbrella', 'a phone', 'a coat'], 'a black leather bag'),
        rq('Where did he lose it?', ['on a bus', 'in a cafe', 'at work', 'at the station'], 'on a bus'),
        rq('Who handed the bag in?', ['a woman who found it', 'the clerk', 'the bus driver', 'nobody'], 'a woman who found it')
      ]
    },
    writing: {
      prompt: 'Describe five things or people without naming them. Use who, which, that and where in each sentence, for example "It is a place where ...". Then say what each is. (70 to 100 words)',
      promptTR: 'Adlarını söylemeden beş şeyi veya kişiyi tarif et. Her cümlede who, which, that veya where kullan: "It is a place where ...". Sonra cevapları yaz. (70-100 kelime)',
      minWords: 55,
      checklist: ['Beş tarif yazdım', 'who, which, that ve where kullandım', 'Aynı kelimeyi iki kez yazmadım (which I lost it değil)', 'Cevapları yazdım']
    }
  });

  def('3.6', {
    can: 'I can give and defend opinions, disagree politely, and join ideas with linking words in a discussion.',
    vocab: [
      v('opinion', 'görüş', 'In my opinion, it is a good idea.', 'Bence bu iyi bir fikir.'),
      v('agree', 'katılmak', 'I agree with you.', 'Sana katılıyorum.'),
      v('disagree', 'katılmamak', "I'm afraid I disagree.", 'Korkarım katılmıyorum.'),
      v('point', 'nokta, görüş', "That's a good point.", 'Bu iyi bir nokta.'),
      v('advantage', 'avantaj', 'One advantage is the price.', 'Bir avantajı fiyatı.'),
      v('disadvantage', 'dezavantaj', 'A disadvantage is the noise.', 'Bir dezavantajı gürültü.'),
      v('however', 'ancak', 'It is cheap. However, it is far.', 'Ucuz. Ancak uzak.'),
      v('although', '... e rağmen', 'Although it is cheap, I will not buy it.', 'Ucuz olmasına rağmen almayacağım.'),
      v('because of', '... yüzünden', 'Because of the rain, we stayed in.', 'Yağmur yüzünden evde kaldık.'),
      v('on the other hand', 'öte yandan', 'On the other hand, it is quicker.', 'Öte yandan daha hızlı.'),
      v('to be honest', 'dürüst olmak gerekirse', "To be honest, I don't mind.", 'Dürüst olmak gerekirse umurumda değil.'),
      v('conclude', 'sonuçlandırmak', 'To conclude, I prefer the first option.', 'Sonuç olarak, ilk seçeneği tercih ederim.')
    ],
    grammar: {
      title: 'Opinion phrases, polite disagreement, linking words',
      html: '<p><b>Giving opinions:</b> I think / I believe / In my opinion / As far as I\'m concerned ... To be honest, ... It seems to me that ...</p>' +
        '<p><b>Agreeing:</b> I agree. That\'s true. Exactly. You\'re right. <b>Disagreeing politely:</b> I see what you mean, but ... I\'m afraid I don\'t agree. I\'m not sure about that. That\'s a good point, but ... Avoid: No, you are wrong!</p>' +
        '<p><b>Linking words:</b> <b>because</b> (reason): I stayed because it was raining. <b>so</b> (result): It was raining, so I stayed. <b>but</b> (contrast): It is cheap but far. <b>although</b> (contrast, joins two clauses): <b>Although</b> it is cheap, I won\'t buy it. <b>however</b> (starts a new sentence, comma after): It is cheap. <b>However</b>, it is far. <b>on the other hand</b>: shows the other side. <b>because of</b> + noun: because of the rain.</p>' +
        '<p><b>Do not say</b> "Although it is cheap, but I won\'t buy it." Use one linker only: although OR but.</p>' +
        '<p><b>Structure of a short opinion:</b> 1) Opinion. 2) Reason. 3) Example. 4) Other side. 5) Conclusion. Linking words: First, Also, In addition, For example, Finally, To conclude.</p>',
      examples: ['In my opinion, children should walk to school.', "I see what you mean, but I'm not sure.", 'Although it is cheap, it is far.', 'It is cheap. However, it is far from the centre.']
    },
    exercises: [
      mc('It was raining, ___ we stayed at home.', ['so', 'because', 'although', 'but'], 'so', 'linking words'),
      mc('We stayed at home ___ it was raining.', ['because', 'so', 'but', 'however'], 'because', 'linking words'),
      mc('___ it is cheap, I will not buy it.', ['Although', 'Because', 'So', 'And'], 'Although', 'linking words'),
      mc('It is cheap. ___, it is far from the centre.', ['However', 'Because', 'So', 'And'], 'However', 'linking words'),
      mc('Hangisi doğru?', ["Although it is cheap, I won't buy it.", "Although it is cheap, but I won't buy it.", "Although it is cheap so I won't buy it.", "Although cheap, but I won't buy it."], "Although it is cheap, I won't buy it.", 'linking words', 'Use although OR but, not both.'),
      mc('Which is the politest way to disagree?', ["I see what you mean, but I'm not sure.", 'You are wrong.', 'No, that is stupid.', "I don't care."], "I see what you mean, but I'm not sure.", 'opinions'),
      fill('We cancelled the trip ___ of the bad weather.', ['because'], 'linking words'),
      mc('"On the other hand" is used to ___.', ['show the other side', 'start the text', 'say thank you', 'give a reason'], 'show the other side', 'linking words'),
      order(['In', 'my', 'opinion', 'it', 'is', 'a', 'good', 'idea'], ['In my opinion, it is a good idea', 'In my opinion it is a good idea'], 'opinions'),
      order(['Although', 'it', 'is', 'cheap', 'it', 'is', 'far'], ['Although it is cheap, it is far', 'Although it is cheap it is far'], 'linking words'),
      typed('Translate: Bence bu iyi bir fikir.', ['In my opinion, it is a good idea', 'I think it is a good idea', 'I think it is a good idea', 'In my opinion it is a good idea'], 'opinions'),
      typed('Translate: Ucuz olmasına rağmen almayacağım.', ["Although it is cheap, I won't buy it", 'Although it is cheap, I will not buy it', "Although it is cheap I won't buy it"], 'linking words'),
      match([['agree', 'katılmak'], ['disagree', 'katılmamak'], ['however', 'ancak'], ['opinion', 'görüş']], 'vocab')
    ],
    listening: [
      lmc("I see what you mean, but I'm not sure.", ["I see what you mean, but I'm not sure.", "I see what you mean, so I'm sure.", "I see what you mean, but I'm sure.", "I don't see what you mean."], "I see what you mean, but I'm not sure.", 'opinions'),
      lmc('Although it is cheap, it is far from the centre.', ['Although it is cheap, it is far from the centre.', 'Because it is cheap, it is far from the centre.', 'It is cheap, so it is far from the centre.', 'Although it is cheap, it is near the centre.'], 'Although it is cheap, it is far from the centre.', 'linking words'),
      dict('In my opinion, it is a good idea.', ['In my opinion, it is a good idea', 'In my opinion it is a good idea'], 'opinions'),
      dict('That is a good point, however, I disagree.', ['That is a good point however I disagree', "That's a good point, however, I disagree", "That's a good point however I disagree"], 'opinions')
    ],
    speaking: [
      speak('In my opinion, it is a good idea.', 'Bence bu iyi bir fikir.'),
      speak("I see what you mean, but I'm not sure.", 'Ne demek istediğini anlıyorum ama emin değilim.'),
      speak('Although it is cheap, it is far from the centre.', 'Ucuz olmasına rağmen merkeze uzak.'),
      speak('To conclude, I prefer the first option.', 'Sonuç olarak ilk seçeneği tercih ederim.')
    ],
    reading: {
      text: 'Should children walk to school?\nIn my opinion, children should walk to school. First, it is good exercise. Also, it is cheaper than the bus.\nHowever, it is not always safe. Some roads are busy, so younger children need an adult with them.\nAlthough walking takes more time, I believe the advantages are greater than the disadvantages.\nTo conclude, I think children should walk if the route is safe.',
      glossary: [['exercise', 'egzersiz'], ['safe', 'güvenli'], ['route', 'güzergâh']],
      questions: [
        rq('What is the writer\'s opinion?', ['Children should walk to school.', 'Children should take the bus.', 'Children should stay at home.', 'Schools should close.'], 'Children should walk to school.'),
        rq('Which disadvantage does the writer mention?', ['It is not always safe.', 'It is expensive.', 'It is boring.', 'It is too fast.'], 'It is not always safe.'),
        rq('What does the writer say in the conclusion?', ['Walk if the route is safe.', 'Never walk.', 'Always take a taxi.', 'Walking is dangerous.'], 'Walk if the route is safe.')
      ]
    },
    writing: {
      prompt: 'Give your opinion on a topic (health, school, the news or a local issue). Give reasons and one example, mention the other side, and conclude. Use at least four linking words. (100 to 130 words)',
      promptTR: 'Bir konuda görüşünü yaz (sağlık, okul, haberler veya yerel bir konu). Nedenlerini ve bir örnek ver, diğer görüşü de belirt ve sonuçlandır. En az dört bağlaç kullan. (100-130 kelime)',
      minWords: 75,
      checklist: ['Net bir görüş yazdım', 'En az 4 bağlaç kullandım (because, so, however, although...)', 'Diğer tarafı da belirttim (On the other hand)', 'To conclude ile bitirdim']
    }
  });

  def('3.7', {
    can: 'I can pass on a message and report what someone said, using said that, told me to and simple reported questions.',
    vocab: [
      v('say / said', 'söylemek', 'She said that she was tired.', 'Yorgun olduğunu söyledi.'),
      v('tell / told', 'söylemek (birine)', 'He told me to wait.', 'Bana beklememi söyledi.'),
      v('ask / asked', 'sormak', 'She asked me where I lived.', 'Nerede yaşadığımı sordu.'),
      v('explain', 'açıklamak', 'The doctor explained the problem.', 'Doktor sorunu açıkladı.'),
      v('mention', 'söz etmek', 'He mentioned a meeting.', 'Bir toplantıdan söz etti.'),
      v('promise', 'söz vermek', 'She promised to call.', 'Arayacağına söz verdi.'),
      v('warn', 'uyarmak', 'He warned me about the ice.', 'Beni buz konusunda uyardı.'),
      v('message', 'mesaj', 'I have a message for you.', 'Senin için bir mesajım var.'),
      v('pass on', 'iletmek', 'Can you pass on a message?', 'Bir mesajı iletebilir misin?'),
      v('reply', 'cevap vermek', 'He replied that he was busy.', 'Meşgul olduğunu cevapladı.'),
      v('appointment', 'randevu', 'The nurse said my appointment was on Monday.', 'Hemşire randevumun Pazartesi olduğunu söyledi.'),
      v('instructions', 'talimatlar', 'The teacher gave us instructions.', 'Öğretmen bize talimat verdi.')
    ],
    grammar: {
      title: 'Reported speech: said that, told me to, reported questions',
      html: '<p><b>Statements:</b> Move the tense back one step. "I <b>am</b> tired." → She said (that) she <b>was</b> tired. "I <b>work</b> here." → He said he <b>worked</b> there. "I <b>will</b> call." → She said she <b>would</b> call. "I <b>have</b> finished." → He said he <b>had finished</b>. "I <b>can</b> help." → She said she <b>could</b> help.</p>' +
        '<p><b>Pronouns and places change:</b> I → he / she, my → his / her, here → there, today → that day, tomorrow → the next day, yesterday → the day before.</p>' +
        '<p><b>say / tell:</b> <b>say</b> something (without object): She <b>said</b> she was tired. <b>tell</b> someone: She <b>told me</b> she was tired. Not: She said me.</p>' +
        '<p><b>Commands and requests:</b> "Please wait." → He <b>told me to</b> wait. "Don\'t park here." → She <b>told me not to</b> park there. "Could you help?" → He <b>asked me to</b> help.</p>' +
        '<p><b>Reported questions:</b> no do / does, statement order. "Where do you live?" → She <b>asked where I lived</b>. "Are you ready?" → He <b>asked if (whether) I was ready</b>. Not: She asked where did I live.</p>',
      examples: ['She said that she was tired.', 'The nurse told me to rest.', 'He asked me where I lived.', 'She asked if I was ready.']
    },
    exercises: [
      mc('"I am tired." → She said she ___ tired.', ['was', 'is', 'were', 'be'], 'was', 'reported statements'),
      mc('"I will call you." → He said he ___ call me.', ['would', 'will', 'did', 'can'], 'would', 'reported statements'),
      mc('"I have finished." → She said she ___ finished.', ['had', 'has', 'have', 'was'], 'had', 'reported statements'),
      mc('"Please wait here." → He told me ___ there.', ['to wait', 'wait', 'waiting', 'that wait'], 'to wait', 'reported commands'),
      mc('"Don\'t touch it." → She told me ___ it.', ['not to touch', "don't touch", 'to not touched', 'no touch'], 'not to touch', 'reported commands'),
      mc('"Where do you live?" → He asked me ___.', ['where I lived', 'where did I live', 'where do I live', 'where I live'], 'where I lived', 'reported questions'),
      mc('"Are you ready?" → She asked me ___ I was ready.', ['if', 'that', 'what', 'do'], 'if', 'reported questions'),
      mc('Hangisi doğru?', ['She told me that she was busy.', 'She said me that she was busy.', 'She told that she was busy me.', 'She said to that she busy.'], 'She told me that she was busy.', 'say/tell'),
      fill('The doctor ___ me to rest. (told / said)', ['told'], 'say/tell'),
      order(['She', 'asked', 'me', 'where', 'I', 'lived'], ['She asked me where I lived'], 'reported questions'),
      order(['He', 'told', 'me', 'to', 'wait', 'outside'], ['He told me to wait outside'], 'reported commands'),
      typed('Translate: Yorgun olduğunu söyledi. (she)', ['She said that she was tired', 'She said she was tired', 'She told me she was tired', 'She told me that she was tired'], 'reported statements'),
      typed('Translate: Bana nerede yaşadığımı sordu. (he)', ['He asked me where I lived', 'He asked where I lived'], 'reported questions'),
      match([['said', 'söyledi'], ['told', 'söyledi (birine)'], ['asked', 'sordu'], ['warned', 'uyardı']], 'vocab')
    ],
    listening: [
      lmc('She said that she was tired.', ['She said that she was tired.', 'She says that she is tired.', 'She said that she is tired.', 'She told that she was tired.'], 'She said that she was tired.', 'reported statements'),
      lmc('The teacher told us to open our books.', ['The teacher told us to open our books.', 'The teacher asked us to open our books.', 'The teacher told us to close our books.', 'The teacher told me to open my book.'], 'The teacher told us to open our books.', 'reported commands'),
      dict('He asked me where I lived.'),
      dict('She told me not to park there.')
    ],
    speaking: [
      speak('She said that she was tired.', 'Yorgun olduğunu söyledi.'),
      speak('The doctor told me to rest.', 'Doktor bana dinlenmemi söyledi.'),
      speak('He asked me where I lived.', 'Bana nerede yaşadığımı sordu.'),
      speak('The teacher said that the homework was easy.', 'Öğretmen ödevin kolay olduğunu söyledi.')
    ],
    reading: {
      text: 'Phone message\nHi Ayla, it\'s Sam. I phoned the school this morning. The secretary said that the school trip was on Friday and that the children had to bring a packed lunch. She also told me to send a form back by Wednesday. I asked her if the trip was free, and she said it cost £5. Can you tell Ali? I\'ll see you later.',
      glossary: [['secretary', 'sekreter'], ['trip', 'gezi'], ['packed lunch', 'beslenme çantası']],
      questions: [
        rq('When is the trip?', ['on Friday', 'on Wednesday', 'on Monday', 'on Sunday'], 'on Friday'),
        rq('What did the secretary tell Sam to do?', ['send a form back by Wednesday', 'pay £50', 'come on Friday', 'phone again'], 'send a form back by Wednesday'),
        rq('How much does the trip cost?', ['£5', '£50', 'nothing', '£15'], '£5')
      ]
    },
    writing: {
      prompt: 'Report five messages or conversations from the last week (a doctor, a teacher, a neighbour, a colleague). Use said that, told me to and asked if or where. (90 to 110 words)',
      promptTR: 'Geçen haftadan beş mesajı veya konuşmayı aktar (doktor, öğretmen, komşu, iş arkadaşı). said that, told me to ve asked if veya where kullan. (90-110 kelime)',
      minWords: 65,
      checklist: ['said / told ayrımını doğru yaptım', 'Zamanı bir adım geri aldım', 'told me to / not to kullandım', 'Dolaylı soruda düz cümle sırası kullandım']
    }
  });

  def('3.8', {
    can: 'I can understand and use the present and past passive, and summarise a short article or leaflet.',
    vocab: [
      v('make / made', 'yapmak', 'This table is made of wood.', 'Bu masa ahşaptan yapılmış.'),
      v('build / built', 'inşa etmek', 'The bridge was built in 1900.', 'Köprü 1900\'de inşa edildi.'),
      v('open / opened', 'açmak', 'The library is opened at nine.', 'Kütüphane dokuzda açılır.'),
      v('produce', 'üretmek', 'Cars are produced in Sunderland.', 'Arabalar Sunderland\'de üretilir.'),
      v('invent', 'icat etmek', 'The telephone was invented in 1876.', 'Telefon 1876\'da icat edildi.'),
      v('deliver', 'teslim etmek', 'The parcels are delivered every day.', 'Paketler her gün teslim edilir.'),
      v('repair', 'tamir etmek', 'The road was repaired last month.', 'Yol geçen ay onarıldı.'),
      v('charge', 'ücret almak', 'A fee is charged for parking.', 'Park için ücret alınır.'),
      v('require', 'gerektirmek', 'A ticket is required.', 'Bilet gerekir.'),
      v('allow', 'izin vermek', 'Dogs are not allowed.', 'Köpeklere izin verilmez.'),
      v('leaflet', 'broşür', 'I read the leaflet.', 'Broşürü okudum.'),
      v('article', 'makale, haber yazısı', 'I read an article about the NHS.', 'NHS hakkında bir yazı okudum.')
    ],
    grammar: {
      title: 'Present and past passive',
      html: '<p><b>Form:</b> be + <b>past participle</b>. Present: <b>is / are</b> + p.p. Past: <b>was / were</b> + p.p. The object of the active sentence becomes the subject.</p>' +
        '<p>Active: They <b>make</b> cars in Sunderland. → Passive: Cars <b>are made</b> in Sunderland. Active: Someone <b>stole</b> my bike. → Passive: My bike <b>was stolen</b>.</p>' +
        '<p><b>When we use the passive:</b> the person who does the action is unknown, unimportant or obvious. Rules and notices: Children <b>are not allowed</b>. Tickets <b>are checked</b>. News: The road <b>was closed</b> after the accident. Processes: The parcels <b>are delivered</b> every day.</p>' +
        '<p><b>by + agent</b> only when it is useful: The book <b>was written by</b> Agatha Christie.</p>' +
        '<p><b>Negatives and questions:</b> Dogs <b>aren\'t allowed</b>. Was it <b>repaired</b>? When <b>was</b> the bridge <b>built</b>? Where <b>are</b> these cars <b>made</b>?</p>' +
        '<p><b>Common irregular past participles:</b> make → made, build → built, steal → stolen, write → written, take → taken, give → given, see → seen, find → found.</p>',
      examples: ['Cars are made in Sunderland.', 'The bridge was built in 1900.', 'Dogs are not allowed.', 'When was the telephone invented?']
    },
    exercises: [
      mc('Cars ___ in Sunderland.', ['are made', 'make', 'is made', 'are making'], 'are made', 'present passive'),
      mc('The bridge ___ in 1900.', ['was built', 'is built', 'built', 'were built'], 'was built', 'past passive'),
      mc('My bike ___ last week.', ['was stolen', 'is stolen', 'stole', 'stolen'], 'was stolen', 'past passive'),
      mc('Dogs ___ allowed in the shop.', ["aren't", "isn't", "don't", "weren't being"], "aren't", 'present passive'),
      mc('When ___ the telephone invented?', ['was', 'is', 'were', 'did'], 'was', 'passive questions'),
      mc('Hangisi doğru?', ['The parcels are delivered every day.', 'The parcels deliver every day.', 'The parcels are deliver every day.', 'The parcels is delivered every day.'], 'The parcels are delivered every day.', 'present passive'),
      fill('This book ___ written by Agatha Christie. (was / is)', ['was'], 'past passive'),
      fill('A ticket ___ required. (is / are)', ['is'], 'present passive'),
      mc('Which sentence is passive?', ['The road was closed.', 'They closed the road.', 'The road closed.', 'They are closing the road.'], 'The road was closed.', 'identify passive'),
      order(['The', 'road', 'was', 'closed', 'after', 'the', 'accident'], ['The road was closed after the accident'], 'past passive'),
      order(['Where', 'are', 'these', 'cars', 'made'], ['Where are these cars made'], 'passive questions'),
      typed('Translate: Köprü 1900\'de inşa edildi.', ['The bridge was built in 1900', 'The bridge was built in 1900'], 'past passive'),
      typed('Translate: Köpeklere izin verilmez.', ['Dogs are not allowed', "Dogs aren't allowed"], 'present passive'),
      match([['produce', 'üretmek'], ['deliver', 'teslim etmek'], ['invent', 'icat etmek'], ['charge', 'ücret almak']], 'vocab')
    ],
    listening: [
      lmc('The parcels are delivered every day.', ['The parcels are delivered every day.', 'The parcels were delivered every day.', 'The parcels deliver every day.', 'The parcels are delivered on Sundays.'], 'The parcels are delivered every day.', 'present passive'),
      lmc('The bridge was built in nineteen hundred.', ['The bridge was built in nineteen hundred.', 'The bridge is built in nineteen hundred.', 'The bridge was built in nineteen ninety.', 'The bridge was built in ninety nineteen.'], 'The bridge was built in nineteen hundred.', 'past passive'),
      dict('Dogs are not allowed.'),
      dict('The road was repaired last month.')
    ],
    speaking: [
      speak('The bridge was built in nineteen hundred.', 'Köprü 1900\'de inşa edildi.'),
      speak('Dogs are not allowed in the shop.', 'Dükkâna köpek alınmaz.'),
      speak('The parcels are delivered every day.', 'Paketler her gün teslim edilir.'),
      speak('When was the telephone invented?', 'Telefon ne zaman icat edildi?')
    ],
    reading: {
      text: 'Library leaflet\nThe library is opened at 9 am and closed at 5 pm, Monday to Saturday.\nBooks are borrowed for three weeks. A late fee is charged if a book is returned late.\nFree English classes are held on Wednesdays. Children\'s books are kept near the window.\nFood and drinks are not allowed. Dogs are not allowed, but guide dogs are welcome.',
      glossary: [['borrow', 'ödünç almak'], ['late fee', 'gecikme ücreti'], ['guide dog', 'rehber köpek']],
      questions: [
        rq('How long can books be borrowed for?', ['three weeks', 'one week', 'one month', 'two days'], 'three weeks'),
        rq('When are free English classes held?', ['on Wednesdays', 'on Mondays', 'on Sundays', 'every day'], 'on Wednesdays'),
        rq('What is not allowed?', ['food, drinks and dogs', 'books', 'children', 'guide dogs'], 'food, drinks and dogs')
      ]
    },
    writing: {
      prompt: 'Write a short summary of a leaflet, a notice or a news item you have read. Use at least six passive sentences (present and past). (90 to 110 words)',
      promptTR: 'Okuduğun bir broşürün, duyurunun veya haberin kısa bir özetini yaz. En az altı edilgen cümle (present ve past) kullan. (90-110 kelime)',
      minWords: 65,
      checklist: ['is / are + past participle kullandım', 'was / were + past participle kullandım', 'by + yapan kişiyi sadece gerekirse yazdım', 'En az 6 edilgen cümle var']
    }
  });

  def('3.9', {
    can: 'I can use everyday phrasal verbs and informal British expressions naturally when chatting with colleagues or neighbours.',
    vocab: [
      v('get up', 'kalkmak', 'I get up at seven.', 'Yedide kalkarım.'),
      v('look for', 'aramak', "I'm looking for my keys.", 'Anahtarlarımı arıyorum.'),
      v('look after', 'bakmak', 'She looks after her grandson.', 'Torununa bakıyor.'),
      v('give up', 'bırakmak, vazgeçmek', "Don't give up!", 'Vazgeçme!'),
      v('find out', 'öğrenmek, bulmak', "I'll find out the time.", 'Saati öğreneceğim.'),
      v('turn up', 'gelmek, ortaya çıkmak', 'He turned up late.', 'Geç geldi.'),
      v('put off', 'ertelemek', 'We put off the meeting.', 'Toplantıyı erteledik.'),
      v('carry on', 'devam etmek', 'Carry on, please.', 'Devam edin, lütfen.'),
      v('run out of', 'bitmek', 'We have run out of milk.', 'Sütümüz bitti.'),
      v('come across', 'rastlamak', 'I came across an old friend.', 'Eski bir arkadaşa rastladım.'),
      v('cheers', 'sağ ol, teşekkürler (UK)', 'Cheers, mate!', 'Sağ ol!'),
      v('no worries', 'sorun değil', 'No worries, it is fine.', 'Sorun değil.')
    ],
    grammar: {
      title: 'Phrasal verbs and informal British expressions',
      html: '<p>A <b>phrasal verb</b> = verb + small word (up, out, off, on, after). The meaning often changes: <b>look</b> = bakmak, <b>look for</b> = aramak, <b>look after</b> = bakmak (çocuğa), <b>look up</b> = (sözlükte) bakmak.</p>' +
        '<p><b>Inseparable</b> (object after the whole phrase): look <b>after</b> the baby, look <b>for</b> my keys, run <b>out of</b> milk, come <b>across</b> a friend.</p>' +
        '<p><b>Separable</b> (object can go in the middle): <b>turn off</b> the light = turn the light off. If the object is a pronoun, it must go in the middle: turn <b>it</b> off (not turn off it).</p>' +
        '<p><b>30 everyday phrasal verbs (groups):</b> Daily life: get up, wake up, put on, take off, turn on, turn off. Searching and learning: look for, look up, find out, work out. Social: turn up, hang out, catch up, get on with. Problems: run out of, break down, give up, put off.</p>' +
        '<p><b>Informal British expressions:</b> Cheers = thank you / goodbye. You alright? = hello (answer: Yes, thanks, you?). No worries = it is fine. I\'m knackered = I am very tired. Quid = pound. Lovely = very nice. Fancy a cuppa? = Would you like a tea?</p>' +
        '<p><b>Be careful:</b> Informal expressions are for friends and colleagues. In formal writing use single verbs (find out → discover, put off → postpone).</p>',
      examples: ["I'm looking for my keys.", 'Please turn the light off.', 'We have run out of milk.', "Fancy a cuppa? Cheers!"]
    },
    exercises: [
      mc("I'm ___ my keys. I can't find them.", ['looking for', 'looking after', 'looking up', 'looking at for'], 'looking for', 'phrasal verbs'),
      mc('She ___ her grandson every Tuesday.', ['looks after', 'looks for', 'looks up', 'looks out'], 'looks after', 'phrasal verbs'),
      mc('We have ___ of milk.', ['run out', 'run off', 'run up', 'run on'], 'run out', 'phrasal verbs'),
      mc('Please ___ the light. It is dark.', ['turn on', 'turn off', 'turn up', 'turn out'], 'turn on', 'phrasal verbs'),
      mc("Don't ___ ! You can do it.", ['give up', 'give out', 'give off', 'give in to'], 'give up', 'phrasal verbs'),
      mc('Hangisi doğru?', ['Turn it off.', 'Turn off it.', 'Turn off the it.', 'Off turn it.'], 'Turn it off.', 'separable', 'With a pronoun, the object goes in the middle.'),
      mc('"Fancy a cuppa?" means:', ['Would you like a tea?', 'Do you like a coat?', 'Are you cold?', 'Are you free?'], 'Would you like a tea?', 'informal'),
      mc('"You alright?" is usually:', ['a greeting', 'a serious question about health', 'a goodbye', 'an invitation'], 'a greeting', 'informal', 'The normal reply is "Yes, thanks, you?"'),
      fill('We need to ___ out what time the shop opens. (öğrenmek)', ['find'], 'phrasal verbs'),
      order(['He', 'turned', 'up', 'late', 'for', 'work'], ['He turned up late for work'], 'phrasal verbs'),
      order(['Please', 'turn', 'the', 'TV', 'off'], ['Please turn the TV off', 'Please turn off the TV'], 'separable'),
      typed('Translate: Anahtarlarımı arıyorum.', ["I'm looking for my keys", 'I am looking for my keys'], 'phrasal verbs'),
      typed('Translate: Sütümüz bitti.', ['We have run out of milk', "We've run out of milk", 'We ran out of milk'], 'phrasal verbs'),
      match([['give up', 'vazgeçmek'], ['carry on', 'devam etmek'], ['put off', 'ertelemek'], ['find out', 'öğrenmek']], 'vocab')
    ],
    listening: [
      lmc("I'm looking for my keys.", ["I'm looking for my keys.", "I'm looking after my keys.", "I'm looking at my keys.", "I'm looking up my keys."], "I'm looking for my keys.", 'phrasal verbs'),
      lmc('We have run out of milk.', ['We have run out of milk.', 'We have run out of money.', 'We ran out of milk.', 'We have run up the milk.'], 'We have run out of milk.', 'phrasal verbs'),
      dict('Please turn the light off.'),
      dict('Fancy a cup of tea? Cheers!', ['Fancy a cup of tea? Cheers', 'Fancy a cup of tea Cheers', 'Fancy a cup of tea, cheers'], 'informal')
    ],
    speaking: [
      speak("I'm looking for my keys.", 'Anahtarlarımı arıyorum.'),
      speak("Don't give up!", 'Vazgeçme!'),
      speak('We have run out of milk.', 'Sütümüz bitti.'),
      speak('Fancy a cuppa? Cheers!', 'Bir çay içer misin? Sağ ol!')
    ],
    reading: {
      text: 'Chat at work\nTom: You alright, Ela?\nEla: Yes, thanks, you? I\'m knackered. I got up at five.\nTom: Fancy a cuppa? I\'ll put the kettle on.\nEla: Lovely, cheers! Oh no, we have run out of milk.\nTom: No worries. I\'ll pop out to the shop. Don\'t give up on the report. I\'ll help you when I\'m back.',
      glossary: [['kettle', 'su ısıtıcısı'], ['pop out', 'bir an dışarı çıkmak'], ['report', 'rapor']],
      questions: [
        rq('Why is Ela tired?', ['She got up at five.', 'She worked all night.', 'She was ill.', 'She was on holiday.'], 'She got up at five.'),
        rq('What have they run out of?', ['milk', 'tea', 'coffee', 'sugar'], 'milk'),
        rq('What will Tom do?', ['go to the shop and help her later', 'go home', 'finish the report alone', 'make coffee'], 'go to the shop and help her later')
      ]
    },
    writing: {
      prompt: 'Write a chat (8 to 10 lines) between two colleagues or neighbours. Use at least ten phrasal verbs or informal expressions from this unit. (90 to 120 words)',
      promptTR: 'İki iş arkadaşı veya komşu arasında 8-10 satırlık bir sohbet yaz. Bu üniteden en az on phrasal verb veya günlük ifade kullan. (90-120 kelime)',
      minWords: 65,
      checklist: ['En az 10 phrasal verb veya günlük ifade kullandım', 'Zamirli ifadede doğru sıra kullandım (turn it off)', 'Cheers, no worries gibi ifadeler doğal duruyor', 'Sohbet kısa ve anlaşılır']
    }
  });

  def('3.10', {
    can: 'I can write formal emails: requests, complaints and replies with polite formulas, and a clear structure.',
    vocab: [
      v('Dear Sir or Madam', 'Sayın Yetkili', 'Dear Sir or Madam,', 'Sayın Yetkili,'),
      v('I am writing to', '... için yazıyorum', 'I am writing to complain about the noise.', 'Gürültüyü şikâyet etmek için yazıyorum.'),
      v('I would be grateful if', '... minnettar olurum', 'I would be grateful if you could reply.', 'Cevap verirseniz minnettar olurum.'),
      v('Kind regards', 'Saygılarımla', 'Kind regards, Ayse Demir', 'Saygılarımla, Ayse Demir'),
      v('Yours faithfully', 'Saygılarımla (Dear Sir ile)', 'Yours faithfully,', 'Saygılarımla,'),
      v('Yours sincerely', 'Saygılarımla (Dear Mr ile)', 'Yours sincerely,', 'Saygılarımla,'),
      v('complaint', 'şikâyet', 'I have a complaint about the bill.', 'Faturayla ilgili bir şikâyetim var.'),
      v('refund', 'para iadesi', 'I would like a refund.', 'Para iadesi istiyorum.'),
      v('enclose', 'eklemek (ek)', 'I enclose a copy of the bill.', 'Faturanın bir kopyasını ekliyorum.'),
      v('as soon as possible', 'en kısa sürede', 'Please reply as soon as possible.', 'Lütfen en kısa sürede cevap verin.'),
      v('look forward to', 'sabırsızlıkla beklemek', 'I look forward to your reply.', 'Cevabınızı bekliyorum.'),
      v('apologise', 'özür dilemek', 'We apologise for the delay.', 'Gecikme için özür dileriz.')
    ],
    grammar: {
      title: 'Formal emails: structure, polite formulas, tone',
      html: '<p><b>Structure:</b> 1) Subject line (short, clear). 2) Greeting. 3) Reason for writing. 4) Details. 5) What you want. 6) Closing. 7) Name.</p>' +
        '<p><b>Greeting and closing:</b> <b>Dear Mr Jones, ... Yours sincerely</b> (name known). <b>Dear Sir or Madam, ... Yours faithfully</b> (name unknown). In emails <b>Kind regards</b> or <b>Best regards</b> is also common.</p>' +
        '<p><b>Polite formulas:</b> <b>I am writing to</b> complain about / ask about / inform you that ... <b>I would be grateful if you could</b> ... <b>Could you please</b> ... <b>I would like to</b> ... <b>Please find attached</b> ... <b>I look forward to hearing from you.</b> <b>Thank you for your help.</b> <b>I apologise for any inconvenience.</b></p>' +
        '<p><b>Formal tone:</b> No contractions in a formal text (I am, I would, do not). Use a formal verb: ask → enquire, get → receive, tell → inform, help → assist, buy → purchase. No slang. Short clear paragraphs.</p>' +
        '<p><b>Complaint model:</b> state the problem, give facts (date, reference number), say what you want (refund, repair, reply), and give a deadline politely: "within 14 days" or "as soon as possible".</p>',
      examples: ['I am writing to complain about the noise from the flat above.', 'I would be grateful if you could reply within 14 days.', 'Please find attached a copy of the bill.', 'I look forward to hearing from you.']
    },
    exercises: [
      mc('Dear Sir or Madam, ... ___', ['Yours faithfully', 'Yours sincerely', 'Cheers', 'See you'], 'Yours faithfully', 'letter closing'),
      mc('Dear Mr Jones, ... ___', ['Yours sincerely', 'Yours faithfully', 'Love', 'Bye'], 'Yours sincerely', 'letter closing'),
      mc('Which is the best opening?', ['I am writing to complain about my bill.', 'Hi, I want to complain.', 'Hello! My bill is bad.', 'Listen, I have a problem.'], 'I am writing to complain about my bill.', 'formal register'),
      mc('I would be ___ if you could reply by Friday.', ['grateful', 'glad of', 'pleasing', 'thanks'], 'grateful', 'polite formulas'),
      fill('I look ___ to hearing from you.', ['forward'], 'polite formulas'),
      fill('Please ___ attached a copy of the bill.', ['find'], 'polite formulas'),
      mc('Which sentence is more formal?', ['I would like to enquire about the price.', 'I wanna know the price.', "Tell me the price!", 'What is the price?'], 'I would like to enquire about the price.', 'formal register'),
      mc('In a formal email, you should NOT use ___.', ['contractions like "I\'m"', 'a subject line', 'Dear Mr Jones', 'Kind regards'], 'contractions like "I\'m"', 'formal register'),
      order(['I', 'would', 'be', 'grateful', 'if', 'you', 'could', 'reply'], ['I would be grateful if you could reply'], 'polite formulas'),
      order(['I', 'look', 'forward', 'to', 'hearing', 'from', 'you'], ['I look forward to hearing from you'], 'polite formulas'),
      typed('Translate: Gürültüyü şikâyet etmek için yazıyorum.', ['I am writing to complain about the noise', 'I am writing to complain about the noise'], 'complaints'),
      typed('Translate: Cevabınızı bekliyorum.', ['I look forward to your reply', 'I look forward to hearing from you'], 'polite formulas'),
      match([['complaint', 'şikâyet'], ['refund', 'para iadesi'], ['enclose', 'eklemek'], ['apologise', 'özür dilemek']], 'vocab')
    ],
    listening: [
      lmc('I am writing to complain about the noise.', ['I am writing to complain about the noise.', 'I am writing to ask about the noise.', 'I am writing to thank you for the noise.', 'I wrote to complain about the noise.'], 'I am writing to complain about the noise.', 'complaints'),
      lmc('I would be grateful if you could reply soon.', ['I would be grateful if you could reply soon.', 'I would be glad if you could reply soon.', 'I will be grateful if you reply soon.', 'I would be grateful if you could repeat soon.'], 'I would be grateful if you could reply soon.', 'polite formulas'),
      dict('Please find attached a copy of the bill.'),
      dict('I look forward to hearing from you.')
    ],
    speaking: [
      speak('I am writing to complain about my bill.', 'Faturamı şikâyet etmek için yazıyorum.'),
      speak('I would be grateful if you could reply soon.', 'Yakında cevap verirseniz minnettar olurum.'),
      speak('Please find attached a copy of the bill.', 'Faturanın bir kopyası ektedir.'),
      speak('I look forward to hearing from you.', 'Haberinizi bekliyorum.')
    ],
    reading: {
      text: 'Subject: Complaint about heating bill\nDear Sir or Madam,\nI am writing to complain about my gas bill dated 3 March. The bill is for £210, but my usual bill is about £90. I think there is a mistake with the meter reading.\nI enclose a copy of the bill and a photo of the meter. I would be grateful if you could check the bill and send a corrected one within 14 days.\nI look forward to hearing from you.\nYours faithfully,\nAyse Demir',
      glossary: [['meter', 'sayaç'], ['reading', 'okuma'], ['corrected', 'düzeltilmiş']],
      questions: [
        rq('Why is the writer unhappy?', ['The bill is much higher than usual.', 'The gas was cut off.', 'The meter is old.', 'The bill came late.'], 'The bill is much higher than usual.'),
        rq('What does she enclose?', ['a copy of the bill and a photo of the meter', 'a cheque', 'a letter from the bank', 'nothing'], 'a copy of the bill and a photo of the meter'),
        rq('What does she want?', ['a corrected bill within 14 days', 'a free month', 'a new meter', 'a phone call'], 'a corrected bill within 14 days')
      ]
    },
    writing: {
      prompt: 'Write a formal email of about 120 words to a school, a council or an energy supplier. State the reason, give details, say what you want and when, and close politely. Use a subject line. (110 to 130 words)',
      promptTR: 'Bir okula, belediyeye veya enerji şirketine yaklaşık 120 kelimelik resmi bir e-posta yaz. Nedenini, ayrıntıları, ne istediğini ve ne zaman istediğini belirt, kibarca bitir. Konu satırı kullan. (110-130 kelime)',
      minWords: 85,
      checklist: ['Subject line var', 'Dear ... ve doğru kapanış (Yours faithfully / sincerely) kullandım', 'I am writing to ... ve I would be grateful if ... kullandım', 'Kısaltma ve argo kullanmadım']
    }
  });

  def('3.11', {
    can: 'I can understand natural connected speech, reductions and different accents, and summarise a short broadcast.',
    vocab: [
      v('broadcast', 'yayın', 'I listened to a radio broadcast.', 'Bir radyo yayını dinledim.'),
      v('podcast', 'podcast', 'I listen to a podcast on the bus.', 'Otobüste bir podcast dinliyorum.'),
      v('accent', 'aksan', 'She has a Scottish accent.', 'İskoç aksanı var.'),
      v('speed', 'hız', 'He speaks at a high speed.', 'Çok hızlı konuşuyor.'),
      v('main idea', 'ana fikir', 'What is the main idea?', 'Ana fikir nedir?'),
      v('detail', 'ayrıntı', 'I missed one detail.', 'Bir ayrıntıyı kaçırdım.'),
      v('summarise', 'özetlemek', 'Can you summarise the news?', 'Haberi özetleyebilir misin?'),
      v('gist', 'genel anlam', 'I understood the gist.', 'Genel anlamı anladım.'),
      v('guess', 'tahmin etmek', 'I can guess the word from context.', 'Kelimeyi bağlamdan tahmin edebilirim.'),
      v('connected speech', 'bağlı konuşma', 'Connected speech is hard at first.', 'Bağlı konuşma başta zordur.'),
      v('stress', 'vurgu', 'The stress is on the first syllable.', 'Vurgu ilk hecede.'),
      v('repeat', 'tekrar etmek', 'Could you repeat that?', 'Tekrar eder misiniz?')
    ],
    grammar: {
      title: 'Connected speech, reductions and listening strategies',
      html: '<p>In natural speech words <b>join</b> and <b>reduce</b>. You hear fewer words than you see in writing.</p>' +
        '<p><b>Common reductions:</b> going to → "gonna", want to → "wanna", have to → "hafta", got to → "gotta", kind of → "kinda", a lot of → "a lotta", what do you → "whaddya", did you → "didja", could have → "could\'ve" ("couda"). Unstressed words become weak: <b>and</b> → /ən/, <b>of</b> → /əv/, <b>to</b> → /tə/, <b>can</b> → /kən/ (but can\'t is strong).</p>' +
        '<p><b>Linking:</b> consonant + vowel join: "pick it up" → "pi-ki-tup". Intrusive sounds: "I am" → "I yam"; "go on" → "go won". Final t often disappears or is not released: "last night" → "las night".</p>' +
        '<p><b>Sentence stress:</b> content words (nouns, verbs, adjectives, negatives) are stressed. Function words (a, the, of, to) are weak. English rhythm has stress beats at roughly equal intervals.</p>' +
        '<p><b>Accents:</b> Scottish, Irish, Northern, London and American accents differ in vowels and in the r sound. Listen to short clips from different regions.</p>' +
        '<p><b>Strategies:</b> 1) Listen first for the gist (who, where, what). 2) Predict the topic. 3) Do not stop at one unknown word. 4) Listen again for details. 5) Shadow: repeat after the speaker. 6) Summarise in 3 sentences: topic, key points, conclusion.</p>',
      examples: ["I'm gonna go to the shop.", 'What do you want? → Whaddya wanna?', 'Pick it up.', "I could've gone."]
    },
    exercises: [
      mc('"I\'m gonna go." means:', ["I'm going to go.", 'I have gone.', 'I did go.', "I'd go."], "I'm going to go.", 'reductions'),
      mc('"I hafta work." means:', ['I have to work.', 'I had work.', 'I have worked.', 'I half work.'], 'I have to work.', 'reductions'),
      mc('"Whaddya want?" means:', ['What do you want?', 'What did you want?', 'What are you?', 'Who do you want?'], 'What do you want?', 'reductions'),
      mc('"I could\'ve gone" means:', ['I had the chance to go.', 'I could go.', 'I went.', 'I could have to go.'], 'I had the chance to go.', 'reductions'),
      mc('Which words are usually stressed in a sentence?', ['content words (nouns, verbs, adjectives)', 'a, the, of, to', 'all words equally', 'only the last word'], 'content words (nouns, verbs, adjectives)', 'stress'),
      mc('What should you do first when you listen to a broadcast?', ['listen for the gist', 'translate every word', 'write every word', 'stop at each new word'], 'listen for the gist', 'strategies'),
      mc('"Pick it up" can sound like:', ['pi-ki-tup', 'pick-it-up (three clear words)', 'pic-et-up', 'pick-up-it'], 'pi-ki-tup', 'linking'),
      fill('To get the main idea, listen first for the ___. (genel anlam)', ['gist'], 'strategies'),
      order(['Could', 'you', 'repeat', 'that', 'please'], ['Could you repeat that, please', 'Could you repeat that please'], 'strategies'),
      order(['She', 'has', 'a', 'Scottish', 'accent'], ['She has a Scottish accent'], 'accents'),
      typed('Translate: Genel anlamı anladım.', ['I understood the gist', 'I got the gist'], 'strategies'),
      typed('Translate: Haberi özetleyebilir misin?', ['Can you summarise the news', 'Could you summarise the news', 'Can you summarize the news'], 'strategies'),
      match([['accent', 'aksan'], ['summarise', 'özetlemek'], ['detail', 'ayrıntı'], ['speed', 'hız']], 'vocab')
    ],
    listening: [
      lmc("I'm gonna have a cup of tea.", ["I'm going to have a cup of tea.", "I'm going to buy a cup of tea.", 'I have had a cup of tea.', "I'm going to make a cup of tea."], "I'm going to have a cup of tea.", 'reductions', 'The sentence on screen is the full form of what you heard: gonna = going to.'),
      lmc('What do you want to do tonight?', ['What do you want to do tonight?', 'What did you want to do tonight?', 'Who do you want to see tonight?', 'What do you want to eat tonight?'], 'What do you want to do tonight?', 'reductions'),
      dict('Pick it up and put it on the table.'),
      dict('I could have gone, but I was tired.', ['I could have gone but I was tired', "I could've gone but I was tired", "I could've gone, but I was tired"], 'reductions')
    ],
    speaking: [
      speak('Could you repeat that, please?', 'Tekrar eder misiniz, lütfen?'),
      speak('I understood the main idea but I missed some details.', 'Ana fikri anladım ama bazı ayrıntıları kaçırdım.'),
      speak('Could you speak a little more slowly?', 'Biraz daha yavaş konuşabilir misiniz?'),
      speak('I am going to listen to a podcast tonight.', 'Bu akşam bir podcast dinleyeceğim.')
    ],
    reading: {
      text: 'Radio broadcast (transcript)\n"Good morning. This is the local news. A new bus route, the 42, starts next Monday. It will connect the station and the hospital every ten minutes.\nThe council says the route will cut journey times by about twenty minutes. Tickets will cost two pounds.\nMeanwhile, the library is going to open on Sundays from next month. And now the weather..."',
      glossary: [['route', 'güzergâh'], ['connect', 'bağlamak'], ['journey time', 'yolculuk süresi']],
      questions: [
        rq('What is the main news?', ['A new bus route starts.', 'The library closes.', 'The hospital moves.', 'The weather is bad.'], 'A new bus route starts.'),
        rq('How often will the bus run?', ['every ten minutes', 'every hour', 'every twenty minutes', 'once a day'], 'every ten minutes'),
        rq('What will happen to the library next month?', ['It will open on Sundays.', 'It will close.', 'It will move.', 'It will be free.'], 'It will open on Sundays.')
      ]
    },
    writing: {
      prompt: 'Listen to a short radio news item or a podcast (3 minutes). Write a summary in three parts: the topic, three key points and your conclusion. (80 to 110 words)',
      promptTR: 'Kısa bir radyo haberi veya podcast (3 dakika) dinle. Üç bölümlük bir özet yaz: konu, üç ana nokta ve sonuç. (80-110 kelime)',
      minWords: 55,
      checklist: ['Konuyu ilk cümlede söyledim', 'Üç ana noktayı yazdım', 'Kendi sözcüklerimle yazdım', 'Bir sonuç cümlesi yazdım']
    }
  });

  def('3.12', {
    can: 'I can have a 5 to 10 minute conversation and write a 150 word text, using all B1 grammar. This is the B1 review.',
    vocab: [
      v('review', 'tekrar etmek, gözden geçirmek', 'Let me review the main points.', 'Ana noktaları gözden geçireyim.'),
      v('fluency', 'akıcılık', 'Fluency takes time.', 'Akıcılık zaman alır.'),
      v('accuracy', 'doğruluk', 'Accuracy is important in writing.', 'Yazıda doğruluk önemlidir.'),
      v('improve', 'geliştirmek', 'I want to improve my speaking.', 'Konuşmamı geliştirmek istiyorum.'),
      v('confident', 'kendinden emin', 'I feel more confident now.', 'Şimdi daha kendime güveniyorum.'),
      v('achieve', 'başarmak', 'I achieved my goal.', 'Hedefime ulaştım.'),
      v('goal', 'hedef', 'My goal is to pass the exam.', 'Hedefim sınavı geçmek.'),
      v('experience', 'deneyim', 'I have a lot of experience.', 'Çok deneyimim var.'),
      v('describe', 'tarif etmek', 'Describe a place you like.', 'Sevdiğin bir yeri anlat.'),
      v('compare', 'karşılaştırmak', 'Compare life here and in Turkey.', 'Burada ve Türkiye\'de hayatı karşılaştır.'),
      v('in conclusion', 'sonuç olarak', 'In conclusion, I am happy here.', 'Sonuç olarak burada mutluyum.'),
      v('for example', 'örneğin', 'For example, I can now call a doctor.', 'Örneğin artık bir doktoru arayabiliyorum.')
    ],
    grammar: {
      title: 'B1 review: tenses, conditionals, passive, reported speech, relative clauses, linking',
      html: '<p><b>Tenses:</b> past simple (I moved in 2023), past continuous (I was walking when ...), present perfect (I have lived here for three years), present perfect continuous (I have been learning ...), will / going to / present continuous for the future.</p>' +
        '<p><b>Conditionals:</b> zero (If you heat ice, it melts), first (If it rains, we will stay), second (If I had time, I would travel).</p>' +
        '<p><b>Modals:</b> may / might / could (possibility), must / can\'t (deduction), should / ought to (advice).</p>' +
        '<p><b>Passive:</b> is / are + p.p., was / were + p.p. <b>Reported speech:</b> She said that she was tired. He told me to wait. She asked if I was ready. <b>Relative clauses:</b> who, which, that, where.</p>' +
        '<p><b>Linking words:</b> because, so, but, although, however, on the other hand, in addition, for example, in conclusion.</p>' +
        '<p><b>Conversation tips (5 to 10 minutes):</b> 1) Answer with a reason and an example. 2) Ask the other person a question. 3) Use fillers: Well, Let me think, To be honest. 4) If you do not know a word, describe it: "It is a thing that you use to ..." 5) Self-correct calmly: Sorry, I mean ...</p>' +
        '<p><b>150 word text plan:</b> Introduction (2 sentences), main point 1 (3 sentences), main point 2 (3 sentences), your opinion (2 sentences), conclusion (1 to 2 sentences). Check: tenses, articles, third person -s, spelling.</p>',
      examples: ["I've lived here for three years, and I've made a lot of progress.", 'If I had more time, I would study every day.', 'The woman who helped me said that I should rest.', 'Although it was hard, I did not give up.']
    },
    exercises: [
      mc('I ___ here for three years.', ['have lived', 'lived', 'live', 'am living'], 'have lived', 'review tenses'),
      mc('She ___ when the phone rang.', ['was cooking', 'cooked', 'has cooked', 'cooks'], 'was cooking', 'review tenses'),
      mc('If it rains tomorrow, we ___ at home.', ['will stay', 'stayed', 'would stay', 'stay'], 'will stay', 'conditionals'),
      mc('If I ___ more money, I would travel.', ['had', 'have', 'will have', 'would have'], 'had', 'conditionals'),
      mc('The lights are off. They ___ be at home.', ["can't", 'must', 'ought', 'should'], "can't", 'modals'),
      mc('You ___ see a doctor. You look ill.', ['should', 'might to', 'can to', 'would'], 'should', 'modals'),
      mc('The bridge ___ in 1900.', ['was built', 'built', 'is built', 'were built'], 'was built', 'passive'),
      mc('She said that she ___ tired.', ['was', 'is', 'were', 'be'], 'was', 'reported speech'),
      mc('The man ___ helped me is called Tom.', ['who', 'which', 'where', 'whose'], 'who', 'relative clauses'),
      mc('___ it was cheap, I did not buy it.', ['Although', 'Because', 'So', 'But'], 'Although', 'linking words'),
      fill('He asked me where I ___ . (live)', ['lived'], 'reported speech'),
      order(['If', 'I', 'had', 'more', 'time', 'I', 'would', 'study', 'every', 'day'], ['If I had more time, I would study every day', 'If I had more time I would study every day'], 'conditionals'),
      order(['She', 'told', 'me', 'to', 'wait', 'outside'], ['She told me to wait outside'], 'reported speech'),
      typed('Translate: Üç yıldır burada yaşıyorum.', ["I've lived here for three years", 'I have lived here for three years'], 'review tenses'),
      match([['fluency', 'akıcılık'], ['accuracy', 'doğruluk'], ['confident', 'kendinden emin'], ['achieve', 'başarmak']], 'vocab')
    ],
    listening: [
      lmc("I've been learning English for two years.", ["I've been learning English for two years.", 'I learned English for two years.', "I've learned English two years ago.", "I'm learning English for two years."], "I've been learning English for two years.", 'review tenses'),
      lmc('If I had more time, I would learn Spanish.', ['If I had more time, I would learn Spanish.', 'If I have more time, I will learn Spanish.', 'If I had more money, I would learn Spanish.', 'If I have more time, I would learn Spanish.'], 'If I had more time, I would learn Spanish.', 'conditionals'),
      dict('She said that she was tired.'),
      dict('Although it was hard, I did not give up.')
    ],
    speaking: [
      speak("I've lived here for three years and I like it.", 'Üç yıldır burada yaşıyorum ve burayı seviyorum.'),
      speak('If I had more time, I would travel more.', 'Daha çok zamanım olsaydı daha çok seyahat ederdim.'),
      speak('In my opinion, learning English is worth it.', 'Bence İngilizce öğrenmek değer.'),
      speak('Although it was hard, I did not give up.', 'Zor olmasına rağmen vazgeçmedim.')
    ],
    reading: {
      text: 'A year in the UK\nWhen I arrived in the UK a year ago, I could not understand the news. I was always worried when I was speaking on the phone.\nSince then I have been learning English every day. I have made friends, and I have found a part time job. If I had known how hard it would be, I might have been afraid, but I am glad I came.\nMy goal for next year is to pass an English exam. In conclusion, although life here is not always easy, I am proud of my progress.',
      glossary: [['proud of', 'gurur duymak'], ['worried', 'endişeli'], ['exam', 'sınav']],
      questions: [
        rq('How long has the writer been in the UK?', ['one year', 'one month', 'ten years', 'two years'], 'one year'),
        rq('What has she found?', ['a part time job', 'a full time job', 'a flat', 'a car'], 'a part time job'),
        rq('What is her goal for next year?', ['to pass an English exam', 'to move to Turkey', 'to change job', 'to buy a house'], 'to pass an English exam')
      ]
    },
    writing: {
      prompt: 'Write a text of about 150 words about your life in the UK: how you have changed, a problem you solved, your plans, and your opinion. Use at least five B1 structures (perfect, conditional, passive, reported speech, relative clause, linking words). (140 to 170 words)',
      promptTR: 'Birleşik Krallık\'taki hayatın hakkında yaklaşık 150 kelimelik bir metin yaz: nasıl değiştin, hangi sorunu çözdün, planların ve görüşün. En az beş B1 yapısı kullan. (140-170 kelime)',
      minWords: 105,
      checklist: ['En az 5 farklı B1 yapısı kullandım', 'Giriş, iki ana nokta, görüş ve sonuç var', 'Bağlaçlar kullandım (although, however, because...)', 'Zamanları, articles ve -s kontrol ettim']
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
