-- ============================================================
-- BCT Akademi — Migration 003: Mevcut Statik Veri Seed
-- Çalıştır:
--   wrangler d1 execute bctakademi-db --file=migrations/003_seed.sql
-- ============================================================

-- ── Kategoriler ──────────────────────────────────────────────
INSERT OR IGNORE INTO categories (id, title, sort_order) VALUES
  ('temel-dersler', 'Temel Dersler', 1),
  ('alan-dersleri',  'Alan Dersleri',  2);

-- ── Kurslar ──────────────────────────────────────────────────
INSERT OR IGNORE INTO courses (id, category_id, title, description, image_url, sort_order, is_published) VALUES
  ('biyo-olcme',
   'temel-dersler',
   'Biyoölçme',
   'Tıbbi cihazlarda elektriksel güvenlik testleri (EST), kaçak akım analizi ve kalibrasyon protokolleri üzerine uzmanlık eğitimi.',
   'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
   1, 1),

  ('biyoenstrumantasyon',
   'temel-dersler',
   'Biyoenstrümantasyon',
   'Biyomedikal sinyal işleme, operasyonel yükselteçler (Op-Amp) ve sensör teknolojilerinin mühendislik temelleri.',
   'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=1200',
   2, 1),

  ('mesleki-fizyoloji-ve-terminoloji',
   'temel-dersler',
   'Mesleki Fizyoloji ve Terminoloji',
   'İnsan anatomisinin ve fizyolojik sistemlerin biyomedikal mühendislik perspektifiyle analizi.',
   'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=1200',
   3, 1),

  ('teknik-resim',
   'temel-dersler',
   'Teknik Resim',
   'Biyomedikal cihaz tasarımı ve standart teknik çizim protokolleri.',
   'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200',
   4, 1),

  ('yasam-destek',
   'alan-dersleri',
   'Yaşam Destek Cihazları',
   'Ventilatör, defibrilatör, anestezi ve diyaliz sistemlerinin çalışma prensipleri ve arıza giderme yöntemleri.',
   'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=1200',
   1, 1),

  ('biyomalzeme-biyomekanik',
   'alan-dersleri',
   'Biyomalzeme ve Biyomekanik',
   'Vücut içi implantlar, biyomalzeme sınıfları ve insan vücudunun mekanik analizleri.',
   'https://images.unsplash.com/photo-1576086213369-97a306dca664?auto=format&fit=crop&q=80&w=1200',
   2, 1);

-- ── Üniteler ─────────────────────────────────────────────────
INSERT OR IGNORE INTO units (id, course_id, title, description, estimated_reading_time, sort_order, is_published) VALUES
  -- Biyoölçme
  ('est-u-1', 'biyo-olcme',
   'Ünite 1: İSG ve Laboratuvar Disiplini',
   'Biyomedikal teknik servislerde iş sağlığı, güvenliği ve profesyonel laboratuvar standartları.',
   '120 dk', 1, 1),

  ('est-u-2', 'biyo-olcme',
   'Ünite 2: IEC 62353 Standartları',
   'Tıbbi cihazların periyodik bakımı ve onarım sonrası elektriksel güvenlik gereksinimleri.',
   '90 dk', 2, 1),

  ('est-u-3', 'biyo-olcme',
   'Ünite 3: Kaçak Akım Ölçüm Teknikleri',
   'Farklı cihaz sınıflarında (Class I, II) kaçak akım ölçüm yöntemleri ve analizör kullanımı.',
   '110 dk', 3, 1),

  -- Biyoenstrümantasyon
  ('be-u-1', 'biyoenstrumantasyon',
   'Ünite 1: Operasyonel Yükselteçler (Op-Amp)',
   'Biyopotansiyel sinyallerin yükseltilmesinde kullanılan temel devre elemanları.',
   '150 dk', 1, 1),

  ('be-u-2', 'biyoenstrumantasyon',
   'Ünite 2: Aktif Filtreleme ve ADC',
   'Analog sinyallerin temizlenmesi ve dijitale aktarılması.',
   '120 dk', 2, 1),

  -- Mesleki Fizyoloji
  ('mf-u-1', 'mesleki-fizyoloji-ve-terminoloji',
   'Ünite 1: Kardiyovasküler Sistem Dinamiği',
   'Kalbin elektriksel iletim sistemi ve hemodinamik parametreler.',
   '100 dk', 1, 1),

  ('mf-u-2', 'mesleki-fizyoloji-ve-terminoloji',
   'Ünite 2: Sinir Sistemi ve Biyo-elektrik',
   'Nöronal iletim, aksiyon potansiyeli ve EEG temelleri.',
   '120 dk', 2, 1),

  -- Teknik Resim
  ('tr-u-1', 'teknik-resim',
   'Ünite 1: Teknik Çizim Esasları',
   'Temel geometrik çizimler ve görünüş çıkarma teknikleri.',
   '60 dk', 1, 1),

  -- Yaşam Destek
  ('yd-u-1', 'yasam-destek',
   'Ünite 1: Ventilatör Teknolojisi',
   'Mekanik ventilasyon modları, pnömatik devreler ve sensör kalibrasyonları.',
   '180 dk', 1, 1),

  ('yd-u-2', 'yasam-destek',
   'Ünite 2: Defibrilasyon ve Kardiyoversiyon',
   'Elektro-şok cihazlarının çalışma prensibi ve enerji boşalma devreleri.',
   '140 dk', 2, 1),

  -- Biyomalzeme
  ('bm-u-1', 'biyomalzeme-biyomekanik',
   'Ünite 1: Biyomalzeme Sınıflandırması',
   'Metaller, seramikler ve polimerlerin biyolojik uyumluluğu.',
   '90 dk', 1, 1);

-- ── Konular ──────────────────────────────────────────────────
INSERT OR IGNORE INTO topics (id, unit_id, title, content, sort_order, is_published) VALUES
  ('est-t-1-1', 'est-u-1',
   'Biyomedikalde Güvenlik Temelleri',
   'Biyomedikal cihazlarla çalışırken güvenlik, hem teknisyen hem de hasta için hayati önem taşır.

Elektriksel güvenlik testlerinin temel amacı, cihazın normal çalışma ve tek hata durumlarında (Single Fault Conditions) sızdırdığı akımın belirlenen limitler dahilinde kalmasını sağlamaktır.

Laboratuvar Disiplini:
1. ESD (Elektrostatik Deşarj) bilekliği kullanımı.
2. İzolasyon trafolu çalışma masaları.
3. Antistatik zemin kaplaması.',
   1, 1),

  ('est-t-1-2', 'est-u-1',
   'Kişisel Koruyucu Donanım (KKD)',
   'Teknik servis süreçlerinde kullanılan KKD''ler, yüksek gerilim ve biyolojik risklere karşı koruma sağlar.

Tıbbi cihazların kalibrasyonu sırasında radyasyon veya kimyasal maruziyeti riski varsa, kurşun önlük veya özel maske kullanımı zorunludur.',
   2, 1),

  ('est-t-2-1', 'est-u-2',
   'Uluslararası Güvenlik Protokolleri',
   'IEC 62353 standardı, IEC 60601-1 standardının hastane ortamındaki periyodik testler için optimize edilmiş halidir.',
   1, 1),

  ('est-t-3-1', 'est-u-3',
   'Diferansiyel ve Doğrudan Ölçüm',
   'Kaçak akım ölçümünde üç temel yöntem kullanılır: Doğrudan yöntem, Diferansiyel yöntem ve Alternatif yöntem.',
   1, 1),

  ('be-t-1-1', 'be-u-1',
   'Enstrümantasyon Yükselteçleri (In-Amp)',
   'Biyomedikal sinyaller genellikle mikrovolt seviyesindedir ve yüksek gürültü içerir.',
   1, 1),

  ('be-t-2-1', 'be-u-2',
   'Band-Pass ve Notch Filtreler',
   'EKG sinyali 0.05 Hz ile 150 Hz frekans bileşenlerine sahiptir.',
   1, 1),

  ('mf-t-1-1', 'mf-u-1',
   'EKG Dalga Formu ve Fizyolojik Kaynağı',
   'P dalgası atriyal depolarizasyonu, QRS kompleksi ventriküler depolarizasyonu temsil eder.',
   1, 1),

  ('mf-t-2-1', 'mf-u-2',
   'Aksiyon Potansiyeli ve İyon Kanalları',
   'Hücre membranındaki sodyum-potasyum pompası sinyal oluşumunu sağlar.',
   1, 1),

  ('yd-t-1-1', 'yd-u-1',
   'Ventilasyon Kontrol Modları',
   'Modern ventilatörler PCV ve VCV olmak üzere iki temel modda çalışır.',
   1, 1),

  ('yd-t-2-1', 'yd-u-2',
   'Bifazik vs Monofazik Dalga Formları',
   'Modern defibrilatörler bifazik dalga formu kullanır.',
   1, 1);

-- ── Quiz Soruları ─────────────────────────────────────────────
INSERT OR IGNORE INTO quiz_questions (topic_id, question, options, correct_answer, explanation, sort_order) VALUES
  ('est-t-1-1',
   'Biyomedikal laboratuvarında çalışırken "Tek Hata Durumu" (Single Fault) neyi ifade eder?',
   '["Cihazın tamamen yanması","Toprak hattının kopması gibi tek bir güvenlik önleminin devre dışı kalması","Tüm sigortaların atması","Cihazın yanlış prize takılması"]',
   1,
   'IEC 60601 standartlarına göre güvenlik testleri, bir koruma önleminin (örneğin toprak hattı) bozulduğu "tek hata" senaryosu altında cihazın hala güvenli olup olmadığını doğrular.',
   1),

  ('est-t-1-2',
   'Elektriksel ölçümler sırasında neden yalıtkan tabanlı ayakkabı tercih edilmelidir?',
   '["Daha rahat olduğu için","Statik elektriği artırmak için","Vücut üzerinden toprağa akacak akım yolunu kesmek için","Cihazı korumak için"]',
   2,
   'Yalıtkan taban, olası bir kaçak durumunda elektrik akımının vücudunuz üzerinden toprağa tamamlanmasını engelleyerek çarpılma riskini minimize eder.',
   1),

  ('est-t-2-1',
   'Aşağıdaki uygulama parçası tiplerinden hangisi en sıkı kaçak akım limitlerine sahiptir?',
   '["Tip B","Tip BF","Tip CF","Tip DEF"]',
   2,
   'Tip CF (Cardiac Floating), kalp ile doğrudan temas eden cihazlar içindir.',
   1),

  ('be-t-1-1',
   'Biyomedikal sinyal işlemede neden yüksek CMRR istenir?',
   '["Hız için","Gürültü bastırma için","Güç tasarrufu için","Empedans için"]',
   1,
   'CMRR ne kadar yüksekse, ortak mod gürültüleri o kadar iyi bastırılır.',
   1),

  ('yd-t-1-1',
   'Ventilatörde PEEP ne işe yarar?',
   '["Kolay nefes","Alveollerin sönmesini önler","Oksijen artırır","Isınmayı engeller"]',
   1,
   'Akciğerlerin tamamen kapanmasını önler.',
   1);

-- ── Blog Yazıları ─────────────────────────────────────────────
INSERT OR IGNORE INTO blog_posts (id, title, excerpt, content, author, category, image_url, read_time, featured, is_published, published_at) VALUES
  ('post-1',
   'Biyomedikalde Kariyer: Uzmanlık Yolculuğu',
   'Lise ve üniversite döneminde kendinizi geliştirmeniz gereken temel klinik mühendislik alanları.',
   'Biyomedikal mühendislik, sağlık ile teknolojinin kesiştiği, her geçen gün büyüyen bir alan.',
   'Öğr. Gör. Mehmet Ak',
   'Kariyer',
   'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
   '8 dk okuma',
   1, 1,
   '2023-11-10T10:00:00.000Z'),

  ('post-2',
   'Görüntüleme Teknolojilerinde Yapay Zeka',
   'BCT Akademi incelemesi: MRI ve BT cihazlarındaki son teknolojik gelişmeler ve AI entegrasyonu.',
   'Yapay zeka, tıbbi görüntüleme alanında devrim yaratmaya devam ediyor.',
   'Dr. Ayşe Yılmaz',
   'Teknoloji',
   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
   '5 dk okuma',
   0, 1,
   '2023-11-05T10:00:00.000Z');

-- ── Kaynaklar ────────────────────────────────────────────────
INSERT OR IGNORE INTO resources (id, title, description, type, category, file_url, file_size, duration, is_published) VALUES
  ('res-1',
   'MEB BCT Müfredat Kitabı',
   'Resmi müfredata uygun Biyomedikal Cihaz Teknolojileri dersi konu anlatımı ve uygulamaları.',
   'PDF',
   'Müfredat',
   '',
   '4.2 MB',
   '',
   1),

  ('res-2',
   'Elektriksel Güvenlik Testleri (EST)',
   'BCT Akademi teknik eğitim serisi: Tıbbi cihazlarda kaçak akım testleri ve IEC 62353 standartları.',
   'Sunum',
   'Teknik Eğitim',
   '',
   '8.4 MB',
   '',
   1),

  ('res-3',
   'Defibrilatör Kullanım ve Bakımı',
   'Uygulamalı defibrilatör test ve kalibrasyon adımları uzman eğitmen anlatımıyla.',
   'Video',
   'Cihaz Eğitimi',
   '',
   '',
   '15:20',
   1);
