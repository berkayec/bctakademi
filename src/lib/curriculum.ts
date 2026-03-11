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
        estimatedTime: '24 Saat',
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
                content: `Biyomedikal cihaz teknolojileri alanında iş sağlığı ve güvenliği, 6331 sayılı kanun çerçevesinde şekillenir. Bu kanun, teknik personelin laboratuvar ve hastane ortamındaki güvenliğini en üst düzeye çıkarmayı hedefler.
Teknisyenlerin çalışma alanlarında karşılaşabileceği biyolojik, kimyasal ve elektriksel riskler için önceden risk analizi yapılması şarttır. Özellikle hastanelerde klinik mühendislik birimlerinde çalışanlar, sadece kendi güvenliklerinden değil, aynı zamanda cihazların güvenli çalışmasından da sorumludur. Hatalı bir onarım veya yetersiz kalibrasyon, hastanın hayatını doğrudan tehlikeye atabilir.`,
                videoYoutubeId: 'dQw4w9WgXcQ'
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
        estimatedTime: '30 Saat',
        units: [
          {
            id: 'tr-1',
            title: 'Teknik Resim Esasları',
            description: 'Çizim araçları ve standart çizgi tipleri.',
            estimatedReadingTime: '45 dk',
            topics: [
              {
                id: 'tr-cizgi',
                title: 'Standart Çizgi Tipleri',
                content: 'Teknik resimde her çizginin bir dili vardır. TS EN ISO 128 standartlarına göre sürekli kalın çizgiler görünen çevreleri, ince çizgiler ise ölçülendirmeyi temsil eder.'
              }
            ]
          },
          {
            id: 'tr-2',
            title: 'İzdüşüm ve Görünüşler',
            description: 'Dik izdüşüm yöntemleri ve parça görünüşleri.',
            estimatedReadingTime: '60 dk',
            topics: [
              {
                id: 'tr-gorunus',
                title: 'Temel Görünüşler',
                content: 'Bir parçayı tam tanımlayabilmek için ön, üst ve yan olmak üzere üç temel görünüş kullanılır. Görünüşler arasındaki hizalama teknik resmin doğruluğu için kritiktir.'
              }
            ]
          },
          {
            id: 'tr-3',
            title: 'Ölçülendirme ve Toleranslar',
            description: 'Boyutlandırma kuralları ve teknik geçme toleransları.',
            estimatedReadingTime: '75 dk',
            topics: [
              {
                id: 'tr-olc-kurallari',
                title: 'Ölçülendirme Kuralları',
                content: 'Ölçü çizgileri, parça kenarından en az 10 mm uzaklıkta başlamalıdır. Ölçü rakamları çizginin üzerinde ve ortasında yer almalıdır. Biyomedikal parçaların üretiminde mikron düzeyindeki hassasiyetler hayati önem taşır.'
              },
              {
                id: 'tr-tolerans',
                title: 'Boyutsal Toleranslar',
                content: 'Sıfır hata ile üretim imkansızdır. Bu nedenle her parçanın kabul edilebilir bir sapma aralığı (tolerans) vardır. H7/g6 gibi geçme sistemleri tıbbi cihazların montajında sıkça kullanılır.'
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
        estimatedTime: '25 Saat',
        units: [
          {
            id: 'bm-1',
            title: 'Biyouyumluluk Esasları',
            description: 'Vücut içi implantlarda malzeme-doku etkileşimi.',
            estimatedReadingTime: '50 dk',
            topics: [
              {
                id: 'bm-polimer',
                title: 'Biyomedikal Polimerler',
                content: 'Polietilen ve silikon gibi polimerler, esneklikleri nedeniyle yumuşak doku protezlerinde ve ilaç salınım sistemlerinde yaygın olarak tercih edilir.'
              }
            ]
          },
          {
            id: 'bm-2',
            title: 'Metalik İmplantlar',
            description: 'Titanyum ve çelik alaşımlarının klinik kullanımı.',
            estimatedReadingTime: '65 dk',
            topics: [
              {
                id: 'bm-titanyum',
                title: 'Titanyum Alaşımları',
                content: 'Titanyum (Ti-6Al-4V), yüksek korozyon direnci ve kemik ile olan mükemmel biyolojik uyumu (osseointegrasyon) sayesinde ortopedik implantlarda altın standarttır.'
              },
              {
                id: 'bm-celik',
                title: 'Paslanmaz Çelik Kullanımı',
                content: '316L paslanmaz çelik, genellikle geçici sabitleme elemanlarında (plak ve vidalar) kullanılır. Uzun vadede titanyuma göre korozyon riski daha yüksektir.'
              }
            ]
          },
          {
            id: 'bm-3',
            title: 'Biyomekanik Analiz',
            description: 'Kemik mekaniği ve yük taşıyan sistemlerin tasarımı.',
            estimatedReadingTime: '80 dk',
            topics: [
              {
                id: 'bm-kemik',
                title: 'Kemik Mekaniği',
                content: 'Kemik, anizotropik bir malzemedir. Yani yüklendiği yöne göre farklı mekanik özellikler gösterir. Stres-gerinim analizi, implant ömrünü belirleyen en temel kriterdir.'
              },
              {
                id: 'bm-tasarim',
                title: 'Yük Taşıyan İmplant Tasarımı',
                content: 'Kalça protezi gibi sistemlerde gerilme kalkanlaması (stress shielding) etkisini önlemek için malzemenin elastisite modülü kemiğe yakın seçilmelidir.'
              }
            ]
          }
        ]
      }
    ]
  }
];