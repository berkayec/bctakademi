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
        title: 'Biyoölçme',
        description: 'Tıbbi cihazlarda elektriksel güvenlik testleri (EST), kaçak akım analizi ve kalibrasyon protokolleri üzerine uzmanlık eğitimi.',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
        units: [
          {
            id: 'est-u-1',
            title: 'Ünite 1: İSG ve Laboratuvar Disiplini',
            description: 'Biyomedikal teknik servislerde iş sağlığı, güvenliği ve profesyonel laboratuvar standartları.',
            estimatedReadingTime: '120 dk',
            topics: [
              {
                id: 'est-t-1-1',
                title: 'Biyomedikalde Güvenlik Temelleri',
                videoYoutubeId: 'qR6H_Y_pD6M',
                content: `Biyomedikal cihazlarla çalışırken güvenlik, hem teknisyen hem de hasta için hayati önem taşır.\n\nElektriksel güvenlik testlerinin temel amacı, cihazın normal çalışma ve tek hata durumlarında (Single Fault Conditions) sızdırdığı akımın belirlenen limitler dahilinde kalmasını sağlamaktır.\n\nLaboratuvar Disiplini:\n1. ESD (Elektrostatik Deşarj) bilekliği kullanımı.\n2. İzolasyon trafolu çalışma masaları.\n3. Antistatik zemin kaplaması.`,
                quiz: [
                  {
                    question: "Biyomedikal laboratuvarında çalışırken 'Tek Hata Durumu' (Single Fault) neyi ifade eder?",
                    options: ["Cihazın tamamen yanması", "Toprak hattının kopması gibi tek bir güvenlik önleminin devre dışı kalması", "Tüm sigortaların atması", "Cihazın yanlış prize takılması"],
                    correctAnswer: 1,
                    explanation: "IEC 60601 standartlarına göre güvenlik testleri, bir koruma önleminin (örneğin toprak hattı) bozulduğu 'tek hata' senaryosu altında cihazın hala güvenli olup olmadığını doğrular."
                  }
                ]
              },
              {
                id: 'est-t-1-2',
                title: 'Kişisel Koruyucu Donanım (KKD)',
                content: `Teknik servis süreçlerinde kullanılan KKD'ler, yüksek gerilim ve biyolojik risklere karşı koruma sağlar.\n\nTıbbi cihazların kalibrasyonu sırasında radyasyon veya kimyasal maruziyeti riski varsa, kurşun önlük veya özel maske kullanımı zorunludur.`,
                quiz: [
                  {
                    question: "Elektriksel ölçümler sırasında neden yalıtkan tabanlı ayakkabı tercih edilmelidir?",
                    options: ["Daha rahat olduğu için", "Statik elektriği artırmak için", "Vücut üzerinden toprağa akacak akım yolunu kesmek için", "Cihazı korumak için"],
                    correctAnswer: 2,
                    explanation: "Yalıtkan taban, olası bir kaçak durumunda elektrik akımının vücudunuz üzerinden toprağa tamamlanmasını engelleyerek çarpılma riskini minimize eder."
                  }
                ]
              }
            ]
          },
          {
            id: 'est-u-2',
            title: 'Ünite 2: IEC 62353 Standartları',
            description: 'Tıbbi cihazların periyodik bakımı ve onarım sonrası elektriksel güvenlik gereksinimleri.',
            estimatedReadingTime: '90 dk',
            topics: [
              {
                id: 'est-t-2-1',
                title: 'Uluslararası Güvenlik Protokolleri',
                content: 'IEC 62353, hastane ortamında kullanılan cihazların güvenliğini sağlamak için geliştirilmiş pratik bir standarttır.',
                quiz: []
              }
            ]
          },
          {
            id: 'est-u-3',
            title: 'Ünite 3: Kaçak Akım Ölçüm Teknikleri',
            description: 'Farklı cihaz sınıflarında (Class I, II) kaçak akım ölçüm yöntemleri ve analizör kullanımı.',
            estimatedReadingTime: '110 dk',
            topics: [
              {
                id: 'est-t-3-1',
                title: 'Diferansiyel ve Doğrudan Ölçüm',
                content: 'Kaçak akımlar, cihazın yalıtım kalitesini gösteren en kritik parametrelerdir.',
                quiz: []
              }
            ]
          },
          {
            id: 'est-u-4',
            title: 'Ünite 4: Klinik Kalibrasyon Prosedürleri',
            description: 'Biyo-parametre ölçen cihazların (NIBP, SPO2, ECG) simülatörlerle kalibrasyonu.',
            estimatedReadingTime: '140 dk',
            topics: [
              {
                id: 'est-t-4-1',
                title: 'Hata Payı ve Belirsizlik Analizi',
                content: 'Kalibrasyon, cihazın ölçüm doğruluğunu ulusal standartlara göre doğrulama sürecidir.',
                quiz: []
              }
            ]
          },
          {
            id: 'est-u-5',
            title: 'Ünite 5: Hata Analizi ve Raporlama',
            description: 'Teknik servis raporu hazırlama, arıza kodlarının yorumlanması ve envanter yönetimi.',
            estimatedReadingTime: '100 dk',
            topics: [
              {
                id: 'est-t-5-1',
                title: 'Etik ve Profesyonel Raporlama',
                content: 'Doğru raporlama, cihazın geçmişini takip etmek ve gelecekteki arızaları önlemek için şarttır.',
                quiz: []
              }
            ]
          }
        ]
      },
      {
        id: 'biyoenstrumantasyon',
        title: 'Biyoenstrümantasyon',
        description: 'Biyomedikal sinyal işleme, operasyonel yükselteçler (Op-Amp) ve sensör teknolojilerinin mühendislik temelleri.',
        image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=1200',
        units: [
          {
            id: 'be-u-1',
            title: 'Ünite 1: Biyopotansiyel Sensörler',
            description: 'Elektrot yapıları ve vücut-yüzey etkileşimi.',
            estimatedReadingTime: '150 dk',
            topics: [
              {
                id: 'be-t-1-1',
                title: 'Sensör Teknolojileri',
                content: 'Biyomedikal verinin başlangıç noktası sensörlerdir.',
                quiz: []
              }
            ]
          }
        ]
      },
      {
        id: 'mesleki-fizyoloji',
        title: 'Mesleki Fizyoloji ve Terminoloji',
        description: 'İnsan anatomisinin ve fizyolojik sistemlerin biyomedikal mühendislik perspektifiyle analizi.',
        image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=1200',
        units: [
          {
            id: 'mf-u-1',
            title: 'Ünite 1: Hücre Elektrofizyolojisi',
            description: 'Membran potansiyeli ve sinyal iletimi.',
            estimatedReadingTime: '100 dk',
            topics: [
              {
                id: 'mf-t-1-1',
                title: 'Hücresel Sinyaller',
                content: 'Tüm biyomedikal sinyallerin kaynağı hücre bazındaki elektriksel değişimlerdir.',
                quiz: []
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
        description: 'Ventilatör, defibrilatör, anestezi ve diyaliz sistemlerinin çalışma prensipleri ve arıza giderme yöntemleri.',
        image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=1200',
        units: [
          {
            id: 'yd-u-1',
            title: 'Ünite 1: Ventilatör Teknolojisi',
            description: 'Mekanik ventilasyon modları ve pnömatik sistemler.',
            estimatedReadingTime: '180 dk',
            topics: [
              {
                id: 'yd-t-1-1',
                title: 'Ventilasyon Prensipleri',
                content: 'Modern ventilatörler hassas basınç ve akış kontrolü sağlar.',
                quiz: []
              }
            ]
          }
        ]
      }
    ]
  }
];