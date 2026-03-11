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
  attachments?: { title: string; type: 'PDF' | 'Diagram'; url: string }[];
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
  difficulty: 'Temel' | 'Orta' | 'İleri';
  estimatedTime: string;
  isPopular?: boolean;
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
        title: 'Biyoölçme',
        description: 'Biyomedikal cihazlarda temel ölçme teknikleri, elektriksel güvenlik ve laboratuvar disiplini.',
        image: 'https://images.unsplash.com/photo-1576091160550-2173bdb999ef?auto=format&fit=crop&q=80&w=800',
        difficulty: 'Temel',
        estimatedTime: '40 Saat',
        isPopular: true,
        units: [
          {
            id: 'unit-1-isg',
            title: 'Ünite 1: İş Sağlığı ve Güvenliği',
            description: 'Biyomedikal teknik servislerde güvenlik standartları.',
            estimatedReadingTime: '60 dk',
            topics: [
              {
                id: 'isg-mevzuat',
                title: 'Biyomedikalde Yasal Mevzuat',
                content: `Biyomedikal cihaz teknolojileri alanında iş sağlığı ve güvenliği, 6331 sayılı kanun çerçevesinde şekillenir. Bu kanun, teknik personelin laboratuvar ve hastane ortamındaki güvenliğini en üst düzeye çıkarmayı hedefler.\n\nTeknisyenlerin çalışma alanlarında karşılaşabileceği biyolojik, kimyasal ve elektriksel riskler için önceden risk analizi yapılması şarttır. Özellikle hastanelerde klinik mühendislik birimlerinde çalışanlar, sadece kendi güvenliklerinden değil, aynı zamanda cihazların güvenli çalışmasından da sorumludur. Hatalı bir onarım veya yetersiz kalibrasyon, hastanın hayatını doğrudan tehlikeye atabilir.`,
                videoYoutubeId: 'dQw4w9WgXcQ'
              }
            ]
          },
          {
            id: 'unit-2-est',
            title: 'Ünite 2: Elektriksel Güvenlik Testleri (EST)',
            description: 'IEC 62353 ve IEC 60601 standartlarına göre kaçak akım ölçümleri.',
            estimatedReadingTime: '75 dk',
            topics: [
              {
                id: 'est-temelleri',
                title: 'EST Standartları ve Kaçak Akımlar',
                content: `Elektriksel güvenlik testleri, tıbbi cihazların hem hasta hem de operatör için güvenli olduğunu doğrulamak amacıyla yapılır. Temel olarak IEC 60601 (üretim aşaması) ve IEC 62353 (servis aşaması) standartları baz alınır.\n\nBu testlerde gövde kaçak akımı, hasta kaçak akımı ve toprak hattı sürekliliği gibi parametreler ölçülür. Mikro-şok riski, özellikle kalp ameliyatı gibi invaziv işlemlerde kullanılan cihazlarda hayati önem taşır. Cihazın izolasyon direncinin belirlenen limitlerin üzerinde olması, elektriksel ark ve kısa devre riskini minimize eder.`,
                quiz: [
                  {
                    question: "IEC 62353 standardı hangi aşamadaki testleri kapsar?",
                    options: ["Üretim Tasarımı", "Periyodik Bakım ve Servis", "Ambalajlama", "Yazılım Geliştirme"],
                    correctAnswer: 1,
                    explanation: "IEC 62353, tıbbi cihazların kullanım süresince yapılan periyodik test ve servis sonrası güvenlik doğrulamaları için standarttır."
                  }
                ]
              }
            ]
          },
          {
            id: 'unit-3-elektrot',
            title: 'Ünite 3: Biyopotansiyel Elektrotlar',
            description: 'Vücut yüzeyinden sinyal toplama prensipleri ve elektrot tipleri.',
            estimatedReadingTime: '55 dk',
            topics: [
              {
                id: 'elektrot-fizik',
                title: 'Elektrot-Doku Arayüzü',
                content: `Biyopotansiyel elektrotlar, vücuttaki iyonik akımı elektrik devresindeki elektron akımına dönüştüren transduserlerdir. ECG, EEG ve EMG sinyalleri bu elektrotlar aracılığıyla toplanır.\n\nElektrot ile deri arasındaki temas direnci (empedans), sinyal kalitesini doğrudan etkiler. Ag/AgCl elektrotlar, düşük gürültü ve kararlı yarı-hücre potansiyeli nedeniyle klinik uygulamalarda en çok tercih edilen tiplerdir. Deri hazırlığı yapılmadan takılan elektrotlar, yüksek artefakt ve gürültüye neden olarak hatalı tanılara yol açabilir.`
              }
            ]
          },
          {
            id: 'unit-4-analog',
            title: 'Ünite 4: Analog Sinyal İşleme',
            description: 'Filtreleme ve amplifikasyon teknikleri.',
            estimatedReadingTime: '90 dk',
            topics: [
              {
                id: 'opamp-uygulama',
                title: 'Enstrümantasyon Amplifikatörleri',
                content: `Biyomedikal sinyaller genellikle mikrovolt veya milivolt seviyesindedir. Bu zayıf sinyalleri yükseltmek için yüksek ortak mod reddetme oranına (CMRR) sahip enstrümantasyon amplifikatörleri kullanılır.\n\n50Hz şebeke gürültüsünü engellemek için çentik (notch) filtreler, düşük frekanslı kaymaları (baseline wander) önlemek için ise yüksek geçiren filtreler tasarlanır. Devre kartı tasarımında analog ve dijital toprak hatlarının ayrılması, gürültü girişimini önleyen kritik bir mühendislik adımıdır.`
              }
            ]
          },
          {
            id: 'unit-5-kalibrasyon',
            title: 'Ünite 5: Kalibrasyon ve Metroloji',
            description: 'Ölçüm doğruluğu ve izlenebilirlik.',
            estimatedReadingTime: '60 dk',
            topics: [
              {
                id: 'kalib-hata',
                title: 'Ölçüm Hataları ve Belirsizlik',
                content: `Kalibrasyon, bir cihazın gösterdiği değer ile referans bir standart arasındaki ilişkinin belirlenmesidir. Tıbbi cihazlarda kalibrasyon, teşhisin doğruluğu için tartışılmaz bir zorunluluktur.\n\nKalibrasyon periyotları, cihazın kullanım sıklığına ve üretici tavsiyelerine göre belirlenir. Ölçüm belirsizliği hesabı yapılırken çevresel faktörler, cihaz hassasiyeti ve operatör hataları dikkate alınmalıdır. İzlenebilirlik zinciri kopmuş bir ölçüm, hukuki ve tıbbi açıdan geçersiz kabul edilir.`
              }
            ]
          }
        ]
      },
      {
        id: 'teknik-resim',
        title: 'Teknik Resim',
        description: 'Biyomedikal parçaların tasarımı ve teknik çizim prensipleri.',
        image: 'https://images.unsplash.com/photo-1544383335-917366bcc07e?auto=format&fit=crop&q=80&w=800',
        difficulty: 'Temel',
        estimatedTime: '35 Saat',
        units: [
          {
            id: 'tr-1',
            title: 'Teknik Resim Esasları',
            description: 'Çizim araçları ve standart çizgi tipleri.',
            estimatedReadingTime: '45 dk',
            topics: [{ id: 'tr-cizgi', title: 'Standart Çizgi Tipleri', content: 'Teknik resimde her çizginin bir dili vardır. TS EN ISO 128 standartlarına göre sürekli kalın çizgiler görünen çevreleri temsil eder.' }]
          },
          {
            id: 'tr-2',
            title: 'İzdüşüm ve Görünüşler',
            description: 'Dik izdüşüm yöntemleri ve parça görünüşleri.',
            estimatedReadingTime: '60 dk',
            topics: [{ id: 'tr-gorunus', title: 'Temel Görünüşler', content: 'Bir parçayı tam tanımlayabilmek için ön, üst ve yan olmak üzere üç temel görünüş kullanılır.' }]
          },
          {
            id: 'tr-3',
            title: 'Ölçülendirme ve Toleranslar',
            description: 'Boyutlandırma kuralları ve teknik geçme toleransları.',
            estimatedReadingTime: '75 dk',
            topics: [{ id: 'tr-olc-kurallari', title: 'Ölçülendirme Kuralları', content: 'Ölçü çizgileri, parça kenarından en az 10 mm uzaklıkta başlamalıdır. Biyomedikal parçaların üretiminde mikron düzeyindeki hassasiyetler hayati önem taşır.' }]
          },
          {
            id: 'tr-4',
            title: 'Ünite 4: Montaj Resimleri',
            description: 'Komple ve alt montaj çizimlerinin okunması.',
            estimatedReadingTime: '80 dk',
            topics: [
              {
                id: 'tr-montaj-kurallari',
                title: 'Parça Listesi ve Balonlama',
                content: `Montaj resimleri, birden fazla parçanın nasıl bir araya getirileceğini gösteren teknik belgelerdir. Her parçaya bir numara verilir (balonlama) ve bu numaralar antetteki parça listesiyle eşleştirilir.\n\nKesit alma teknikleri, montajın iç yapısındaki mekanik ilişkileri görmek için kullanılır. Biyomedikal cihazlarda, örneğin bir şırınga pompasının motor-mil bağlantısı montaj resimlerinde tüm detaylarıyla belirtilmelidir. Standart elemanlar (vida, somun, rulman) genellikle kesilmezler.`
              }
            ]
          },
          {
            id: 'tr-5',
            title: 'Ünite 5: Yüzey İşleme İşaretleri',
            description: 'Yüzey pürüzlülüğü ve kaplama standartları.',
            estimatedReadingTime: '50 dk',
            topics: [
              {
                id: 'tr-yuzey-kalite',
                title: 'Ra ve Rz Değerleri',
                content: `Tıbbi cihazların yüzey kalitesi, biyouyumluluk ve sterilizasyon kolaylığı açısından kritiktir. Yüzey pürüzlülüğü sembolleri, parçanın üretim yöntemini (taşlama, frezeleme vb.) ve istenen kaliteyi (Ra) belirtir.\n\nÖrneğin, bir kemik implantının yüzeyi doku tutunması için pürüzlü istenirken, bir eklem yüzeyi sürtünmeyi azaltmak için ayna parlaklığında olmalıdır. Teknik resimde bu özellikler ters üçgen sembolleri ve yanındaki nümerik değerlerle ifade edilir.`
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'alan-dersleri',
    title: 'Alan Dersleri',
    courses: [
      {
        id: 'biyomalzeme',
        title: 'Biyomalzeme ve Biyomekanik',
        description: 'İmplant teknolojileri ve insan vücudunun mekanik analizi.',
        image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800',
        difficulty: 'İleri',
        estimatedTime: '30 Saat',
        units: [
          {
            id: 'bm-1',
            title: 'Biyouyumluluk Esasları',
            description: 'Vücut içi implantlarda malzeme-doku etkileşimi.',
            estimatedReadingTime: '50 dk',
            topics: [{ id: 'bm-polimer', title: 'Biyomedikal Polimerler', content: 'Polietilen ve silikon gibi polimerler, esneklikleri nedeniyle yumuşak doku protezlerinde tercih edilir.' }]
          },
          {
            id: 'bm-2',
            title: 'Metalik İmplantlar',
            description: 'Titanyum ve çelik alaşımlarının klinik kullanımı.',
            estimatedReadingTime: '65 dk',
            topics: [{ id: 'bm-titanyum', title: 'Titanyum Alaşımları', content: 'Titanyum (Ti-6Al-4V), yüksek korozyon direnci ve kemik ile olan mükemmel biyolojik uyumu sayesinde altın standarttır.' }]
          },
          {
            id: 'bm-3',
            title: 'Biyomekanik Analiz',
            description: 'Kemik mekaniği ve yük taşıyan sistemlerin tasarımı.',
            estimatedReadingTime: '80 dk',
            topics: [{ id: 'bm-kemik', title: 'Kemik Mekaniği', content: 'Kemik, anizotropik bir malzemedir. Stres-gerinim analizi, implant ömrünü belirleyen en temel kriterdir.' }]
          },
          {
            id: 'bm-4',
            title: 'Ünite 4: Biyoseramikler ve Camlar',
            description: 'Sert doku onarımında kullanılan seramik malzemeler.',
            estimatedReadingTime: '70 dk',
            topics: [
              {
                id: 'bm-hidroksiapatit',
                title: 'Biyoaktif Seramikler',
                content: `Biyoseramikler, vücutta kemik dokusuyla doğrudan kimyasal bağ kurabilen (biyoaktif) veya tamamen inert olan malzemelerdir. Hidroksiapatit (HA), kemiğin doğal mineral yapısına benzediği için kemik dolgu maddesi olarak kullanılır.\n\nAlümina ve zirkonya gibi yüksek mukavemetli seramikler, aşınma dirençleri nedeniyle kalça protezi başlıklarında tercih edilir. Bu malzemelerin en büyük dezavantajı kırılgan yapılarıdır, bu nedenle tasarım aşamasında çekme gerilmelerinden kaçınılmalıdır.`
              }
            ]
          },
          {
            id: 'bm-5',
            title: 'Ünite 5: Yumuşak Doku Mekaniği',
            description: 'Damarlar, deri ve kasların viskoelastik özellikleri.',
            estimatedReadingTime: '60 dk',
            topics: [
              {
                id: 'bm-viskoelastisite',
                title: 'Doku Davranış Modelleri',
                content: `Yumuşak dokular, hem katı hem de sıvı benzeri davranış gösteren viskoelastik yapılardır. Zamanla değişen yükleme altında gevşeme (relaxation) ve sürünme (creep) yaparlar.\n\nDamar protezi (greft) tasarlanırken, yapay malzemenin esnekliği ile doğal damarın esnekliğinin uyumlu olması (compliance matching) gerekir. Uyumsuzluk durumunda kan akışında türbülans oluşarak pıhtılaşma riski artar. Deri mekaniği ise yanık tedavileri ve plastik cerrahi simülasyonları için temel oluşturur.`
              }
            ]
          }
        ]
      }
    ]
  }
];