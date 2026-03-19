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
                content: 'IEC 62353 standardı, IEC 60601-1 standardının hastane ortamındaki periyodik testler için optimize edilmiş halidir.',
                quiz: [
                  {
                    question: "Aşağıdaki uygulama parçası tiplerinden hangisi en sıkı kaçak akım limitlerine sahiptir?",
                    options: ["Tip B", "Tip BF", "Tip CF", "Tip DEF"],
                    correctAnswer: 2,
                    explanation: "Tip CF (Cardiac Floating), kalp ile doğrudan temas eden cihazlar içindir."
                  }
                ]
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
                content: 'Kaçak akım ölçümünde üç temel yöntem kullanılır: Doğrudan yöntem, Diferansiyel yöntem ve Alternatif yöntem.',
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
            title: 'Ünite 1: Operasyonel Yükselteçler (Op-Amp)',
            description: 'Biyopotansiyel sinyallerin yükseltilmesinde kullanılan temel devre elemanları.',
            estimatedReadingTime: '150 dk',
            topics: [
              {
                id: 'be-t-1-1',
                title: 'Enstrümantasyon Yükselteçleri (In-Amp)',
                content: 'Biyomedikal sinyaller genellikle mikrovolt seviyesindedir ve yüksek gürültü içerir.',
                quiz: [
                  {
                    question: "Biyomedikal sinyal işlemede neden yüksek CMRR istenir?",
                    options: ["Hız için", "Gürültü bastırma için", "Güç tasarrufu için", "Empedans için"],
                    correctAnswer: 1,
                    explanation: "CMRR ne kadar yüksekse, ortak mod gürültüleri o kadar iyi bastırılır."
                  }
                ]
              }
            ]
          },
          {
            id: 'be-u-2',
            title: 'Ünite 2: Aktif Filtreleme ve ADC',
            description: 'Analog sinyallerin temizlenmesi ve dijitale aktarılması.',
            estimatedReadingTime: '120 dk',
            topics: [
              {
                id: 'be-t-2-1',
                title: 'Band-Pass ve Notch Filtreler',
                content: 'EKG sinyali 0.05 Hz ile 150 Hz frekans bileşenlerine sahiptir.',
                quiz: []
              }
            ]
          }
        ]
      },
      {
        id: 'mesleki-fizyoloji-ve-terminoloji',
        title: 'Mesleki Fizyoloji ve Terminoloji',
        description: 'İnsan anatomisinin ve fizyolojik sistemlerin biyomedikal mühendislik perspektifiyle analizi.',
        image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=1200',
        units: [
          {
            id: 'mf-u-1',
            title: 'Ünite 1: Kardiyovasküler Sistem Dinamiği',
            description: 'Kalbin elektriksel iletim sistemi ve hemodinamik parametreler.',
            estimatedReadingTime: '100 dk',
            topics: [
              {
                id: 'mf-t-1-1',
                title: 'EKG Dalga Formu ve Fizyolojik Kaynağı',
                content: 'P dalgası atriyal depolarizasyonu, QRS kompleksi ventriküler depolarizasyonu temsil eder.',
                quiz: []
              }
            ]
          },
          {
            id: 'mf-u-2',
            title: 'Ünite 2: Sinir Sistemi ve Biyo-elektrik',
            description: 'Nöronal iletim, aksiyon potansiyeli ve EEG temelleri.',
            estimatedReadingTime: '120 dk',
            topics: [
              {
                id: 'mf-t-2-1',
                title: 'Aksiyon Potansiyeli ve İyon Kanalları',
                content: 'Hücre membranındaki sodyum-potasyum pompası sinyal oluşumunu sağlar.',
                quiz: []
              }
            ]
          }
        ]
      },
      {
        id: 'teknik-resim',
        title: 'Teknik Resim',
        description: 'Biyomedikal cihaz tasarımı ve standart teknik çizim protokolleri.',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200',
        units: [
          {
            id: 'tr-u-1',
            title: 'Ünite 1: Teknik Çizim Esasları',
            description: 'Temel geometrik çizimler ve görünüş çıkarma teknikleri.',
            estimatedReadingTime: '60 dk',
            topics: []
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
            description: 'Mekanik ventilasyon modları, pnömatik devreler ve sensör kalibrasyonları.',
            estimatedReadingTime: '180 dk',
            topics: [
              {
                id: 'yd-t-1-1',
                title: 'Ventilasyon Kontrol Modları',
                content: 'Modern ventilatörler PCV ve VCV olmak üzere iki temel modda çalışır.',
                quiz: [
                  {
                    question: "Ventilatörde PEEP ne işe yarar?",
                    options: ["Kolay nefes", "Alveollerin sönmesini önler", "Oksijen artırır", "Isınmayı engeller"],
                    correctAnswer: 1,
                    explanation: "Akciğerlerin tamamen kapanmasını önler."
                  }
                ]
              }
            ]
          },
          {
            id: 'yd-u-2',
            title: 'Ünite 2: Defibrilasyon ve Kardiyoversiyon',
            description: 'Elektro-şok cihazlarının çalışma prensibi ve enerji boşalma devreleri.',
            estimatedReadingTime: '140 dk',
            topics: [
              {
                id: 'yd-t-2-1',
                title: 'Bifazik vs Monofazik Dalga Formları',
                content: 'Modern defibrilatörler bifazik dalga formu kullanır.',
                quiz: []
              }
            ]
          }
        ]
      },
      {
        id: 'biyomalzeme-biyomekanik',
        title: 'Biyomalzeme ve Biyomekanik',
        description: 'Vücut içi implantlar, biyomalzeme sınıfları ve insan vücudunun mekanik analizleri.',
        image: 'https://images.unsplash.com/photo-1576086213369-97a306dca664?auto=format&fit=crop&q=80&w=1200',
        units: [
          {
            id: 'bm-u-1',
            title: 'Ünite 1: Biyomalzeme Sınıflandırması',
            description: 'Metaller, seramikler ve polimerlerin biyolojik uyumluluğu.',
            estimatedReadingTime: '90 dk',
            topics: []
          }
        ]
      }
    ]
  }
];
