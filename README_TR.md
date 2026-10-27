# English Coach Uygulaması

Tarayıcıda çalışan, kurulum gerektirmeyen İngilizce çalışma uygulaması. Veriler sadece kullanıcının tarayıcısında (localStorage) saklanır. Sunucu, hesap veya internet bağlantısı gerekmez (sesli özellikler için tarayıcı desteği gerekir).

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

İçerik: Stage 0 (0.1, 0.2) ve A1 ünite 1.1 ila 1.4 hazır. `packs/unit-1.5-daily-routine.json` örnek ek pakettir. Kalan ünitelerin içeriğini Claude projesinde ürettirip paket olarak yüklersin (10_app_content_pack_spec.md).

## Çalıştırma
1. **En basit:** `index.html` dosyasına çift tıkla. Mikrofon ile konuşma tanıma bazı tarayıcılarda bu yöntemle çalışmaz.
2. **Aynı bilgisayarda (önerilen test):** klasörde terminal aç, `python3 -m http.server 8000` yaz, tarayıcıda `http://localhost:8000` aç. Mikrofon çalışır.
3. **Telefon ve her yerden erişim:** klasörü ücretsiz bir statik barındırmaya yükle (GitHub Pages, Netlify, Cloudflare Pages). `https` adresi mikrofon için gereklidir. Telefonda "Ana ekrana ekle" ile uygulama gibi kullanılır.

Tarayıcı notları: Konuşma tanıma Chrome ve Edge'de en iyi çalışır, Safari'de sürüme ve Siri ayarına göre değişir, Firefox'ta yoktur (kendini değerlendirme moduna geçer). Sesli okumanın kalitesi cihazın İngilizce seslerine bağlıdır (Ayarlar > Ses).

## Veri ve yedek
- Her cihaz ve tarayıcının verisi ayrıdır. Cihaz değiştirirsen Ayarlar > Yedekle ile indir, yenisinde Yedeği yükle.
- Tarayıcı verisini silersen ilerleme gider. Haftada bir yedek almak iyi bir alışkanlıktır.

## Claude projesiyle birlikte kullanım
1. Uygulamada çalış (kelime, alıştırma, dinleme, konuşma, sınav).
2. Yazma görevlerinde "Claude'dan geri bildirim al" ile metni kopyala, projeye yapıştır.
3. Seans sonunda İlerleme > Snapshot'ı kopyala, Claude projesinde yeni sohbetin başına yapıştır.
4. Uygulamada olmayan üniteler için Claude'a "Make content for unit 1.6 as an app content pack" de. Gelen JSON dosyasını Ayarlar > İçerik paketi yükle ile ekle.

## Dosyalar
- `index.html`: arayüz ve stiller
- `js/app.js`: motor (sınav motoru, tekrar, ödev, ses, kayıt)
- `js/content.js`: ünite içerikleri, seviye tespit soruları, aşama sınavı verileri, doğrulayıcı
- `packs/`: ek içerik paketleri
- `tools/validate.js`: içerik ve paket doğrulayıcı (`node tools/validate.js packs/dosya.json`)

## Sınırlar
- Serbest yazma ve serbest konuşma otomatik notlanamaz. Bunlar için Claude projesindeki sohbet gerekir.
- Konuşma tanıma telaffuzu ölçmez, söylenen kelimelerin tanınıp tanınmadığına bakar. Yine de iyi bir pratik ve geri bildirimdir.
- Aşama sınavları, ilgili aşamanın tüm üniteleri uygulamada olunca açılır (A1 için 1.5 ila 1.10 içerikleri eklenmeli).
