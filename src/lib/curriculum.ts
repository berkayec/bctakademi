export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
export interface Topic {
  id: string;
  title: string;
  content: string;
  videoYoutubeId?: string;
  quiz?: QuizQuestion[];
}
export interface Unit {
  id: string;
  title: string;
  description: string;
  estimatedReadingTime: string;
  topics: Topic[];
}
export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  units: Unit[];
}
export interface Category {
  id: string;
  title: string;
  courses: Course[];
}
export const curriculum: Category[] = [
  {
    id: 'temel-dersler',
    title: 'Temel Dersler',
    courses: [
      {
        id: 'biyo-olcme',
        title: 'Biyoölçme ve EST',
        description: 'Tıbbi cihazlarda elektriksel güvenlik testleri (EST), kaçak akım analizi ve kalibrasyon protokolleri üzerine uzmanlık eğitimi.',
        image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=1200',
        units: Array.from({ length: 5 }).map((_, i) => ({
          id: `est-u-${i + 1}`,
          title: `Ünite ${i + 1}: ${['İSG ve Laboratuvar Disiplini', 'IEC 62353 Standartları', 'Kaçak Akım Ölçüm Teknikleri', 'Kalibrasyon ve İzlenebilirlik', 'Hata Analizi ve Raporlama'][i]}`,
          description: 'Profesyonel biyomedikal teknik servis standartlarında derinlemesine teknik inceleme.',
          estimatedReadingTime: '120 dk',
          topics: [
            {
              id: `est-t-${i}-1`,
              title: 'Teknik Uygulama Rehberi',
              content: `Bu bölümde, biyomedikal cihazların güvenli çalışmasını sağlayan kritik teknik parametreler ele alınmaktadır. \n\nDevre Şeması Analizi:\nCihazın güç katı girişi (L, N, PE) ile gövde arasındaki izolasyon direnci ölçülürken test cihazı 500V DC gerilim uygular. Bu süreçte cihazın tüm sigortalarının (F1, F2) sağlam olduğu doğrulanmalıdır. \n\nKlinik Prosedürler:\n1. Toprak Hattı Sürekliliği: Test cihazı 200mA akım basarak toprak direncini ölçer. Kabul edilebilir limit 200mΩ altıdır.\n2. Kaçak Akım Ölçümü: Cihaz çalışma geriliminde iken gövde kaçak akımı (Chassis Leakage) diferansiyel metodla ölçülür.\n\nArıza Giderme:\nYüksek kaçak akım tespit edildiğinde, ilk olarak EMI filtre kapasitörleri ve kablo izolasyonları kontrol edilmelidir. Çoğu durumda şebeke kablosundaki deformasyonlar test başarısızlığına yol açar.`,
              quiz: [
                {
                  question: "Toprak sürekliliği testi için kabul edilebilir direnç sınırı nedir?",
                  options: ["0.2 Ohm", "1 Ohm", "5 Ohm", "0.5 Ohm"],
                  correctAnswer: 0,
                  explanation: "IEC 62353 standartlarına göre toprak sürekliliği direnci 0.2 Ohm (200mOhm) altında olmalıdır."
                }
              ]
            }
          ]
        }))
      },
      {
        id: 'biyoenstrumantasyon',
        title: 'Biyoenstrümantasyon',
        description: 'Biyomedikal sinyal işleme, operasyonel yükselteçler (Op-Amp) ve sensör teknolojilerinin mühendislik temelleri.',
        image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=1200',
        units: Array.from({ length: 5 }).map((_, i) => ({
          id: `be-u-${i + 1}`,
          title: `Ünite ${i + 1}: ${['Biyopotansiyel Sensörler', 'Enstrümantasyon Amplifikatörleri', 'Aktif Filtre Tasarımı', 'ADC ve Sinyal Dönüştürme', 'İzolasyon Amplifikatörleri'][i]}`,
          description: 'Elektronik devre tasarımı ve sinyal bütünlüğü analizi.',
          estimatedReadingTime: '150 dk',
          topics: [
            {
              id: `be-t-${i}-1`,
              title: 'Devre Analizi ve Tasarım',
              content: `Biyomedikal sinyaller genellikle mikrovolt seviyesindedir. Bu sinyalleri yükseltmek için yüksek CMRR değerine sahip devreler gerekir.\n\nOp-Amp Yapılandırması:\nECG yükseltici katında AD620 gibi özel enstrümantasyon amplifikatörleri kullanılır. Bu yapı üç ana Op-Amp'tan oluşur. Kazanç (Gain) ayarı dış bir direnç (Rg) ile belirlenir. \n\nFormül: G = 1 + (49.4 kΩ / Rg)\n\nFiltreleme:\nŞebeke gürültüsünü (50Hz) yok etmek için Twin-T Notch filtre tasarımı uygulanır. Bu filtre dar bir bantta yüksek bastırma sağlar. \n\nKlinik Uygulama:\nElektrot-Deri empedansı sinyal kalitesini doğrudan etkiler. Bu nedenle giriş katında yüksek giriş empedansı (>10 GΩ) sağlanmalıdır.`,
              quiz: [
                {
                  question: "Biyomedikal sinyal yükseltmede neden CMRR önemlidir?",
                  options: ["Hızı artırır", "Şebeke gürültüsünü yok eder", "Güç tüketimini azaltır", "Maliyet düşürür"],
                  correctAnswer: 1,
                  explanation: "Common Mode Rejection Ratio (CMRR), her iki girişe ortak gelen gürültüleri (50Hz) yok etme yeteneğidir."
                }
              ]
            }
          ]
        }))
      },
      {
        id: 'mesleki-fizyoloji',
        title: 'Mesleki Fizyoloji ve Terminoloji',
        description: 'İnsan anatomisinin ve fizyolojik sistemlerin biyomedikal mühendislik perspektifiyle analizi.',
        image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=1200',
        units: Array.from({ length: 5 }).map((_, i) => ({
          id: `mf-u-${i + 1}`,
          title: `Ünite ${i + 1}: ${['Hücre Elektrofizyolojisi', 'Kardiyovasküler Dinamikler', 'Nörolojik Sinyal İletimi', 'Solunum Mekaniği', 'Renal Sistem ve Diyaliz Fizyolojisi'][i]}`,
          description: 'Biyomedikal cihazların etkileşimde olduğu biyolojik sistemlerin teknik incelenmesi.',
          estimatedReadingTime: '100 dk',
          topics: [
            {
              id: `mf-t-${i}-1`,
              title: 'Sistemik Analiz',
              content: `İnsan vücudu karmaşık bir elektro-mekanik sistemdir. \n\nAksiyon Potansiyeli:\nHücre zarı Na+/K+ pompası ile -70mV dinlenim potansiyelini korur. Uyarı anında iyon kanallarının açılmasıyla gerçekleşen depolarizasyon, ECG ve EEG cihazlarının temel veri kaynağıdır. \n\nHemodinamik:\nKalp debisi (CO) = Atım Hacmi (SV) x Kalp Hızı (HR). Ventilatör ve kalp-akciğer makineleri bu parametreleri yapay olarak kontrol eder. \n\nTıbbi Terminoloji:\n- Hipoksi: Dokuların oksijensiz kalması.\n- İskemi: Kan akışının yetersizliği.\n- Taşikardi: Kalp hızının normalin üzerine çıkması.`,
              quiz: [
                {
                  question: "Normal bir hücrenin dinlenim potansiyeli yaklaşık kaçtır?",
                  options: ["+40 mV", "0 mV", "-70 mV", "-10 mV"],
                  correctAnswer: 2,
                  explanation: "Çoğu uyarılabilir hücrede dinlenim zar potansiyeli -70 mV civarındadır."
                }
              ]
            }
          ]
        }))
      },
      {
        id: 'teknik-resim',
        title: 'Teknik Resim',
        description: 'Biyomedikal cihaz parçalarının 2D/3D teknik çizimleri, devre şemaları ve montaj dökümanları.',
        image: 'https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=1200',
        units: Array.from({ length: 5 }).map((_, i) => ({
          id: `tr-u-${i + 1}`,
          title: `Ünite ${i + 1}: ${['Geometrik Çizimler', 'Görünüş Çıkartma', 'Kesit Alma Teknikleri', 'Elektronik Semboller', 'CAD ile Cihaz Tasarımı'][i]}`,
          description: 'Teknik dokümantasyon ve endüstriyel standartlarda çizim eğitimi.',
          estimatedReadingTime: '90 dk',
          topics: [
            {
              id: `tr-t-${i}-1`,
              title: 'Teknik Çizim Standartları',
              content: `Biyomedikal cihazların bakım kılavuzlarında yer alan şemalar ISO ve ANSI standartlarına dayanır. \n\nProjekisyon Metodları:\nTürkiye'de genellikle 1. Açı (E) projeksiyonu kullanılır. Parçanın ön, üst ve sol yan görünüşleri temel alınır. \n\nElektronik Şema Okuma:\nBir defibrilatör şemasında HV (High Voltage) katı, kontrol katından optokuplörler ile ayrılır. Çizimde bu ayrım kalın çizgilerle ve izolasyon bariyeri sembolü ile gösterilir.\n\nÖlçülendirme:\nTıbbi hassasiyet gereği ölçüler genellikle mm cinsinden ve +/- 0.01 toleransla belirtilir.`,
              quiz: [
                {
                  question: "Teknik resimde gizli kenarlar hangi çizgi tipiyle gösterilir?",
                  options: ["Sürekli kalın", "Sürekli ince", "Kesik çizgi", "Noktalı kesik"],
                  correctAnswer: 2,
                  explanation: "Görünmeyen veya gizli kalan kenarlar kesik (kesikli) çizgilerle ifade edilir."
                }
              ]
            }
          ]
        }))
      }
    ]
  },
  {
    id: 'alan-dersleri',
    title: 'Alan Dersleri',
    courses: [
      {
        id: 'yasam-destek',
        title: 'Yaşam Destek Cihazları',
        description: 'Ventilatör, defibrilatör, anestezi ve diyaliz sistemlerinin çalışma prensipleri ve arıza giderme yöntemleri.',
        image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=1200',
        units: Array.from({ length: 5 }).map((_, i) => ({
          id: `yd-u-${i + 1}`,
          title: `Ünite ${i + 1}: ${['Ventilatör Teknolojisi', 'Defibrilasyon Prensipleri', 'Diyaliz Makine Dinamikleri', 'İnfüzyon ve Perfüzyon Pompaları', 'Ameliyathane Destek Sistemleri'][i]}`,
          description: 'Kritik bakım cihazlarının teknik ve klinik analizi.',
          estimatedReadingTime: '180 dk',
          topics: [
            {
              id: `yd-t-${i}-1`,
              title: 'Cihaz Mühendisliği',
              content: `Yaşam destek cihazları, hata kabul etmeyen sistemlerdir. \n\nVentilatör Pnömatik Yapısı:\nHava ve Oksijen girişi 4 bar basınçla regülatörlere gelir. Akış kontrolü orantılı valfler (Proportional Valves) ile sağlanır. Ekspirasyon valfi PEEP basıncını kontrol eder. \n\nDefibrilatör Enerji Boşaltımı:\nKapasitörde depolanan enerji (maks. 360 Joule), Bifaizik dalga formu ile hastaya iletilir. Bu süreçte göğüs empedansı otomatik olarak ölçülür ve akım şiddeti ayarlanır. \n\nBakım Protokolü:\nOksijen sensörlerinin 6 aylık periyotlarla değiştirilmesi ve batarya kapasite testlerinin yapılması zorunludur.`,
              quiz: [
                {
                  question: "Bifaizik defibrilatörlerin monofaziklere göre en büyük avantajı nedir?",
                  options: ["Daha ucuzdur", "Daha hafiftir", "Daha düşük enerjiyle daha etkili şok sağlar", "Daha hızlı şarj olur"],
                  correctAnswer: 2,
                  explanation: "Bifaizik dalga formu, akımı iki yönde ileterek kalp kasına daha az zarar verir ve daha başarılı defibrilasyon sağlar."
                }
              ]
            }
          ]
        }))
      },
      {
        id: 'biyomalzeme',
        title: 'Biyomalzeme ve Biyomekanik',
        description: 'Vücut içi implantlar, protez sistemleri ve doku ile etkileşime giren malzemelerin mekanik ve kimyasal analizi.',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
        units: Array.from({ length: 5 }).map((_, i) => ({
          id: `bm-u-${i + 1}`,
          title: `Ünite ${i + 1}: ${['Biyouyumluluk Standartları', 'Metalik İmplantlar', 'Biyoseramikler ve Polimerler', 'Kırılma ve Yorulma Analizi', 'Yapay Organ Mekaniği'][i]}`,
          description: 'Malzeme bilimi ve biyolojik sistem etkileşimi.',
          estimatedReadingTime: '130 dk',
          topics: [
            {
              id: `bm-t-${i}-1`,
              title: 'Malzeme Mühendisliği',
              content: `Biyomalzemeler, vücudun korozif ortamında fonksiyonunu yitirmeden çalışmalıdır. \n\nMetalik Malzemeler:\nTitanyum alaşımları (Ti-6Al-4V) yüksek biyouyumluluk ve elastisite modülü sayesinde ortopedik implantlarda standarttır. Paslanmaz çelik (316L) ise korozyon direnci nedeniyle geçici tespit elemanlarında kullanılır. \n\nBiyomekanik Analiz:\nKalça protezi tasarımı yapılırken 'Stress Shielding' etkisi minimize edilmelidir. Kemik ile implant arasındaki yük paylaşımı, kemik erimesini (rezorpsiyon) engellemek için dengeli olmalıdır. \n\nYorulma Testi:\nBir kalp kapakçığı yılda 40 milyon kez açılıp kapanır. Bu nedenle kullanılan polimerlerin yorulma ömrü (Fatigue Life) sonsuz döngü yaklaşımıyla test edilir.`,
              quiz: [
                {
                  question: "Biyouyumluluk açısından en ideal metal grubu hangisidir?",
                  options: ["Bakır alaşımları", "Alüminyum", "Titanyum alaşımları", "Demir"],
                  correctAnswer: 2,
                  explanation: "Titanyum, vücut sıvılarına karşı yüksek korozyon direnci ve kemikle kaynaşma (osseointegrasyon) yeteneği nedeniyle en ideal malzemedir."
                }
              ]
            }
          ]
        }))
      }
    ]
  }
];