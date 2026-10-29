# English Coach Uygulaması

Tarayıcıda çalışan, kurulum gerektirmeyen İngilizce çalışma uygulaması. Telefona uygulama gibi kurulabilir (PWA) ve ilk açılıştan sonra internetsiz çalışır. Veriler sadece kullanıcının cihazında ve tarayıcısında (localStorage) saklanır. Sunucu, hesap veya şifre yoktur.

## Neler var
| Beceri / özellik | Nasıl çalışıyor |
|---|---|
| Kelime (vocabulary) | Kartlar, mini test, aralıklı tekrar (1, 3, 7, 14, 30 gün) |
| Dilbilgisi (grammar) | Türkçe anlatım + 8 tip alıştırma: çoktan seçmeli, boşluk doldurma, cümle sıralama, eşleştirme, çeviri yazma |
| Dinleme (listening) | Tarayıcının sesli okuması (en-GB tercih edilir), yavaş mod, duyduğunu yaz (dictation), duyduğunu seç |
| Konuşma (speaking) | Mikrofonla söyle, tarayıcı tanır, benzerlik skoru (%75 geçer). Destek yoksa kendini değerlendir |
| Okuma (reading) | Kısa metin, sözlükçe, sesli okuma, sorular |
| Yazma (writing) | Editör, otomatik kontrol (büyük harf, noktalama, "I"), kendi kontrol listesi, Claude'a tek tuşla kopyala |
| Ödev (homework) | Her gün otomatik: kelime tekrarı, hata tekrarı, dinleme, konuşma, yazma |
| Sınavlar | Seviye tespit (4 bölüm), her ünite sonunda sınav (%80 geçer), aşama sınavları (genel + konuşma + yazma) |
| İlerleme | Beceri doğrulukları, seri, puan, Claude projesi için "Progress Snapshot" |
| Profiller | Aynı cihazda birden fazla öğrenci, her birinin ilerlemesi ayrı |

İçerik: Stage 0 (0.1, 0.2) ile A1, A2 ve B1 dahil müfredatın 36 ünitesi (0.1 ila 3.12) ve ek olarak B2 için 12 ünite (4.1 ila 4.12) uygulamada hazır. `packs/unit-1.5-daily-routine.json` paket biçimine örnek olarak duruyor (aynı içerik, yüklemeye gerek yok). B2 sonrası veya yeni ek içerik için Claude projesinde paket ürettirip yüklersin (10_app_content_pack_spec.md).

## Profiller
- Her öğrencinin kendi profili vardır: ilerleme, seri, kelime tekrarı (SRS), ödev, sınavlar, yazılar, arayüz dili, konuşma hızı ve ses ayrı tutulur.
- Tek profil varsa uygulama doğrudan açılır. İki veya daha fazla profil varsa açılışta "Kim çalışıyor?" ekranı gelir.
- Profil değiştirmek için üst çubuktaki yuvarlak simgeye dokun. Aynı ekrandan yeni profil eklenir; ✎ düğmesiyle ad, simge ve renk değiştirilir.
- Profil silmek için düzenleme ekranında "Profili sil" seçilir ve onay için profil adı aynen yazılır. Silinen profil geri gelmez, önce yedek al.
- İçerik paketleri tüm profiller için ortaktır: bir kez yüklemek yeter.
- Şifre ve hesap yoktur. Profiller gizlilik için değil, aynı cihazı paylaşan kişilerin ilerlemesini ayırmak içindir.
- Progress Snapshot metninde "Learner:" satırı profil adını gösterir.

### Eski sürümden geçiş
Eski sürümdeki ilerleme (anahtar `english_coach_v1`) ilk açılışta otomatik olarak ilk profile kopyalanır. Profil adı eski kayıttaki addan alınır, ad yoksa "Profile 1" olur. Eski kayıt silinmez, yedek olarak tarayıcıda kalır.

## Çalıştırma
1. **Bilgisayarda test (önerilen):** klasörde terminal aç ve şunlardan birini yaz, sonra tarayıcıda adresi aç:
   - `node tools/serve.js` (adres: `http://localhost:8000/`)
   - `node tools/serve.js 8000 --base=/english-coach/` (GitHub Pages gibi alt klasörde dener)
   - `python3 -m http.server 8000` (Python kuruluysa)
   `localhost` güvenli sayılır, mikrofon ve çevrimdışı çalışma burada denenebilir.
2. **`index.html` dosyasına çift tıklamak:** temel kullanım çalışır, fakat kurulum (PWA), çevrimdışı çalışma ve çoğu tarayıcıda mikrofon çalışmaz.
3. **Telefon:** uygulamayı bir HTTPS adresine yükle (aşağıda "Yayınlama"). Telefondan yerel ağ adresiyle (`http://192.168...`) açarsan HTTPS olmadığı için mikrofon ve kurulum çalışmaz.

## Telefona kurulum (ana ekrana ekleme)
HTTPS adresi gerekir. İlk açılışta sayfanın tam yüklenmesini bekle, çevrimdışı kopya o sırada hazırlanır.

**Android (Chrome):**
1. Uygulama adresini Chrome'da aç.
2. Sağ üstteki ⋮ menüsünden "Uygulamayı yükle" veya "Ana ekrana ekle" seç.
3. "Yükle" ile onayla. Simge ana ekrana ve uygulama listesine gelir, tam ekran açılır.

**iPhone ve iPad (Safari):**
1. Adresi Safari'de aç (Chrome veya başka tarayıcıda bu adım olmaz).
2. Alttaki Paylaş düğmesine (kare ve yukarı ok) dokun.
3. "Ana Ekrana Ekle" seç, adı kontrol et, "Ekle"ye dokun.

Not: iPhone'da ana ekrandan açılan uygulamanın verisi Safari'deki sekmeden ayrıdır. Safari'de ilerlemen varsa önce Ayarlar > Bu profili yedekle ile indir, ana ekran uygulamasında Yedeği yükle ile geri al.

## Çevrimdışı çalışma
- İlk açılıştan sonra uygulama internetsiz açılır. Kelime, dilbilgisi, alıştırmalar, dinleme (cihazın sesiyle), okuma, yazma, ödev, sınavlar, profiller ve yedekleme çevrimdışı çalışır.
- Üst çubuktaki yeşil nokta çevrimiçi, "Çevrimdışı" yazısı internetsiz olduğunu gösterir.
- Konuşma tanıma (mikrofonla değerlendirme) çoğu tarayıcıda internet ister. Çevrimdışıyken uygulama bunu söyler ve kendi değerlendirme düğmelerini gösterir.
- Yeni sürüm yayınlanınca ekranın üstünde "Yeni sürüm hazır" çıkar. "Yenile"ye dokununca yeni sürüm açılır. Dokunmazsan eski sürüm çalışmaya devam eder, ilerleme kaybolmaz.

## Ses
- Sesli okuma ilk dokunuştan sonra başlar. Telefonlar, kullanıcı dokunmadan ses çalınmasına izin vermez; bu yüzden uygulama da kendiliğinden ses çalmaz.
- İngiliz sesi (en-GB) varsa otomatik seçilir. Ayarlar > Ses ile değiştirebilirsin. Liste boşsa birkaç saniye bekle, sesler geç yüklenebilir.
- Ses gelmiyorsa: telefonun sessiz modunu kapat, ses düzeyini aç. iPhone'da Ayarlar > Erişilebilirlik > Seslendirilen İçerik > Sesler bölümünden İngilizce (UK) bir ses indirebilirsin.

## Veri ve yedek
- Her cihaz ve tarayıcının verisi ayrıdır. Ayarlar ekranında bunu hatırlatan bir not vardır.
- **Bu profili yedekle:** sadece açık profili indirir.
- **Tüm profilleri yedekle:** bütün profilleri ve içerik paketlerini tek dosyada indirir.
- **Yedeği yükle:** dosyayı kontrol eder. Tanımadığı veya bozuk bir dosyayı nedenini söyleyerek reddeder, hiçbir şeyi değiştirmez. Geçerli dosyada iki seçenek sunar:
  - yeni profil olarak ekle (tüm profiller dosyasında: hepsini yeni profil olarak ekle),
  - mevcut bir profilin yerine koy (tüm profiller dosyasında: aynı profilleri güncelle, diğerlerini ekle).
- Eski sürümden alınmış yedek dosyaları da yüklenebilir.
- Tarayıcı verisini silersen ilerleme gider. Haftada bir yedek almak iyi bir alışkanlıktır.

## Yayınlama
Mikrofon ve telefona kurulum için adres **HTTPS** olmalıdır. Aşağıdaki iki yol da ücretsiz HTTPS verir. Uygulama alt klasörde de çalışır (tüm adresler görelidir).

**GitHub Pages:**
1. Bu klasörü bir GitHub deposuna gönder (`main` dalı).
2. Depoda Settings > Pages > Build and deployment > Source: **GitHub Actions** seç.
3. Her gönderimde `.github/workflows/pages.yml` önce testleri çalıştırır, sonra sadece uygulama dosyalarını yayınlar. Adres: `https://kullanici-adi.github.io/depo-adi/`.

**Netlify:** depoyu Netlify'a bağla; `netlify.toml` hazırdır (sadece uygulama dosyaları yayınlanır, `sw.js` her açılışta yeniden kontrol edilir). Elle yüklemek istersen `index.html`, `manifest.webmanifest`, `sw.js`, `favicon.ico`, `js`, `packs`, `icons` öğelerini bir klasöre kopyalayıp app.netlify.com/drop sayfasına sürükle.

**Yeni sürüm yayınlarken:** `sw.js` içindeki `VERSION` değerini artır (örneğin `2.0.0` yerine `2.0.1`). Değiştirmezsen telefonlar eski kopyayı kullanmaya devam eder. Yeni bir dosya eklersen `sw.js` içindeki `ASSETS` listesine de ekle (test bunu kontrol eder).

## Testler ve araçlar
Uygulamanın kendisi hiçbir paket gerektirmez. Testler için Node.js 20 veya üstü gerekir:
- `npm install` (sadece testler için jsdom kurar)
- `npm test` (profil, geçiş, yedek, ders akışları, PWA ve mobil davranış testleri)
- `node tools/validate.js packs/dosya.json` (içerik ve paket doğrulayıcı)
- `node tools/make-icons.js` (simgeleri yeniden üretir)
- `node tools/serve.js` (yerel sunucu)

## Claude projesiyle birlikte kullanım
1. Uygulamada çalış (kelime, alıştırma, dinleme, konuşma, sınav).
2. Yazma görevlerinde "Claude'dan geri bildirim al" ile metni kopyala, projeye yapıştır.
3. Seans sonunda İlerleme > Snapshot'ı kopyala, Claude projesinde yeni sohbetin başına yapıştır.
4. Uygulamada olmayan üniteler için Claude'a "Make content for unit 1.6 as an app content pack" de. Gelen JSON dosyasını Ayarlar > İçerik paketi yükle ile ekle.

## Dosyalar
- `index.html`: arayüz ve stiller
- `js/app.js`: motor (sınav motoru, tekrar, ödev, ses, profil ekranları, yedek, çevrimdışı)
- `js/store.js`: profil kayıtları, eski sürümden geçiş, yedek dosyası kontrolü
- `js/content.js`: ünite içerikleri, seviye tespit soruları, aşama sınavı verileri, doğrulayıcı
- `packs/`: ek içerik paketleri
- `sw.js`, `manifest.webmanifest`, `icons/`, `favicon.ico`: kurulabilir ve çevrimdışı uygulama
- `tools/`: doğrulayıcı, simge üretici, yerel sunucu
- `tests/`: otomatik testler (yayınlanmaz)

## Sınırlar
- Serbest yazma ve serbest konuşma otomatik notlanamaz. Bunlar için Claude projesindeki sohbet gerekir.
- Konuşma tanıma telaffuzu ölçmez, söylenen kelimelerin tanınıp tanınmadığına bakar.
- Konuşma tanıma Chrome ve Edge'de en iyi çalışır, internet ister. Firefox'ta yoktur. iPhone'da Safari'de sürüme göre çalışır, ana ekrandan açılan uygulamada genellikle çalışmaz; uygulama bu durumda kendi değerlendirme moduna geçer ve nedenini yazar.
- Sesli okumanın kalitesi cihazın İngilizce seslerine bağlıdır.
- Veriler cihazlar arasında eşitlenmez. Başka cihaza geçmek için yedek dosyası kullanılır.
- iPhone, uzun süre açılmayan sitelerin verisini silebilir. Ana ekrana eklenen uygulamada bu risk düşüktür, yine de düzenli yedek al.
- Aşama sınavları, ilgili aşamanın tüm üniteleri bitince açılır (Stage 0, A1, A2, B1 ve B2 sınavları).
