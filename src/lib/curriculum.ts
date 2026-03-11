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
                content: `Biyomedikal cihaz teknolojileri alanında iş sağlığı ve güvenliği, 6331 sayılı kanun çerçevesinde şekillenir. Bu kanun, teknik personelin laboratuvar ve hastane ortamındaki güvenliğini en üst düzeye çıkarmayı hedefler. Teknisyenlerin çalışma alanlarında karşılaşabileceği biyolojik, kimyasal ve elektriksel riskler için önceden risk analizi yapılması şarttır.
                Özellikle hastanelerde klinik mühendislik birimlerinde çalışanlar, sadece kendi güvenliklerinden değil, aynı zamanda cihazların güvenli çalışmasından da sorumludur. Hatalı bir onarım veya yetersiz kalibrasyon, hastanın hayatını doğrudan tehlikeye atabilir. Bu nedenle teknik dokümantasyon takibi ve standartlara uyum yasal bir zorunluluktur.`,
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
        estimatedTime: '15 Saat',
        units: [
          {
            id: 'tr-1',
            title: 'Teknik Resim Esasları',
            description: 'Çizim araçları, standart çizgiler ve yazı tipleri.',
            estimatedReadingTime: '45 dk',
            topics: [
              {
                id: 'tr-cizgi',
                title: 'Standart Çizgi Tipleri',
                content: 'Teknik resimde kullanılan her çizginin bir dili vardır. Sürekli kalın çizgiler görünen çevreleri, kesik çizgiler ise görünmeyen kenarları temsil eder. Çizgi kalınlıkları TS EN ISO 128 standartlarına göre belirlenir.'
              }
            ]
          },
          {
            id: 'tr-2',
            title: 'İzdüşüm ve Görünüş Çıkarma',
            description: 'Dik izdüşüm yöntemleri ve parça görünüşleri.',
            estimatedReadingTime: '60 dk',
            topics: [
              {
                id: 'tr-gorunus',
                title: 'Temel Görünüşler',
                content: 'Bir parçayı tam olarak tanımlayabilmek için genellikle ön, üst ve yan görünüş olmak üzere üç temel görünüş kullanılır. Bu görünüşler arasında hizalama kuralları esastır.'
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
        id: 'yasam-destek',
        title: 'Yaşam Destek Cihazları',
        description: 'Ventilatör, defibrilatör ve diyaliz makineleri teknolojisi.',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
        difficulty: 'İleri',
        estimatedTime: '30 Saat',
        isPopular: true,
        units: []
      },
      {
        id: 'biyomalzeme',
        title: 'Biyomalzeme ve Biyomekanik',
        description: 'İmplant teknolojileri ve insan vücudunun mekanik analizi.',
        image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800',
        difficulty: 'İleri',
        estimatedTime: '20 Saat',
        units: [
          {
            id: 'bm-1',
            title: 'Biyouyumluluk ve Malzeme Bilimi',
            description: 'Vücut içi implantlarda malzeme seçimi.',
            estimatedReadingTime: '50 dk',
            topics: [
              {
                id: 'bm-polimer',
                title: 'Biyomedikal Polimerler',
                content: 'Polimerler, esneklikleri ve işlenebilirlikleri nedeniyle protezlerden ilaç salınım sistemlerine kadar geniş bir yelpazede kullanılırlar. Polietilen ve silikon en yaygın örnekleridir.'
              }
            ]
          }
        ]
      }
    ]
  }
];