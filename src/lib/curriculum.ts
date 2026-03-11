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
    title: 'Temel Eğitim',
    courses: [
      {
        id: 'biyo-olcme',
        title: 'Biyoölçme ve EST',
        description: 'Biyomedikal cihazlarda temel ölçme teknikleri, elektriksel güvenlik testleri ve kalibrasyon esasları.',
        image: 'https://images.unsplash.com/photo-1576091160550-2173bdb999ef?auto=format&fit=crop&q=80&w=800',
        difficulty: 'Temel',
        estimatedTime: '45 Saat',
        isPopular: true,
        units: [
          {
            id: 'unit-1-isg',
            title: 'Ünite 1: İş Sağlığı ve Laboratuvar Güvenliği',
            description: 'Biyomedikal teknik servislerde güvenlik standartları ve 6331 sayılı kanun uygulamaları.',
            estimatedReadingTime: '60 dk',
            topics: [
              {
                id: 'isg-detay',
                title: 'Klinik Ortamda Risk Analizi',
                content: `Biyomedikal teknisyenleri için iş sağlığı ve güvenliği, sadece kişisel koruma değil, hastane ekosisteminin korunmasıdır. Biyomedikal laboratuvarlarında karşılaşılan en büyük riskler; yüksek gerilim, radyasyon ve biyolojik kontaminasyondur.\n\nRisk analizi yapılırken "Önce Güvenlik" prensibi ile her cihazın izolasyon durumu kontrol edilmelidir. Özellikle 9. sınıf öğrencilerinin atölye disiplininde el aletlerinin doğru kullanımı ve ESD (Elektrostatik Deşarj) önlemleri hayati önem taşır. Cihaz onarımı sırasında statik elektriğin hassas CMOS devrelerine verebileceği zarar, sistemin kararsız çalışmasına neden olabilir.`,
                quiz: [
                  {
                    question: "Elektrostatik deşarjdan korunmak için teknik serviste ne kullanılır?",
                    options: ["Gözlük", "ESD Bileklik", "Yün Eldiven", "Plastik Önlük"],
                    correctAnswer: 1,
                    explanation: "Hassas devre elemanlarını korumak için teknisyenlerin topraklanmış bir ESD bilekliği kullanması şarttır."
                  }
                ]
              }
            ]
          },
          {
            id: 'unit-est-prosedur',
            title: 'Ünite 2: İleri EST Prosedürleri',
            description: 'IEC 62353 standardına göre kaçak akım ölçümleri ve hasta güvenliği.',
            estimatedReadingTime: '90 dk',
            topics: [
              {
                id: 'est-akımlar',
                title: 'Kaçak Akım Ölçüm Teknikleri',
                content: `Elektriksel Güvenlik Testi (EST), tıbbi bir cihazın hastaya mikro-şok vermesini engellemek için yapılan zorunlu bir testtir. IEC 62353 standardı, servis sonrası yapılan periyodik testleri tanımlar.\n\nTest kapsamında: \n1. Toprak Hattı Sürekliliği (Earth Bond): 200mA veya 25A akım ile toprak direnci ölçülür (limit < 0.2 ohm).\n2. İzolasyon Direnci: 500V DC uygulanarak yalıtım kalitesi ölçülür.\n3. Gövde Kaçak Akımı: Cihazın metal aksamından geçen kaçak akım belirlenir.\n\n[Diyagram: EST Test Cihazı Bağlantı Şeması]\nReferans elektrotların hastaya temas eden kısımlara (Applied Parts) doğru bağlanması, testin doğruluğu için kritiktir.`,
                quiz: [
                  {
                    question: "IEC 62353'e göre toprak hattı direnci sınırı nedir?",
                    options: ["10 Ohm", "0.2 Ohm", "5 Ohm", "0.5 Ohm"],
                    correctAnswer: 1,
                    explanation: "Toprak sürekliliği direnci güvenli bir deşarj için 0.2 Ohm değerinin altında olmalıdır."
                  }
                ]
              }
            ]
          },
          {
            id: 'unit-kalibrasyon-izlenebilirlik',
            title: 'Ünite 3: Kalibrasyon ve Metroloji',
            description: 'Ölçüm doğruluğu, hata analizleri ve uluslararası izlenebilirlik zinciri.',
            estimatedReadingTime: '70 dk',
            topics: [
              {
                id: 'metroloji-temel',
                title: 'Ölçüm Belirsizliği ve Hata Payı',
                content: `Kalibrasyon, bir ölçü aletinin gösterdiği değerin uluslararası referans standartlarla karşılaştırılması işlemidir. Biyomedikalde kalibrasyon, teşhisin doğruluğunu sağlar. Örneğin, bir tansiyon aletinin 5 mmHg hata yapması, hastaya yanlış tedavi uygulanmasına neden olabilir.\n\nİzlenebilirlik (Traceability), yapılan ölçümün kesintisiz bir belgeler zinciri ile SI (Uluslararası Birimler Sistemi) standartlarına bağlanmasıdır. Kalibrasyon sertifikasında ölçüm belirsizliği mutlaka belirtilmelidir. Belirsizlik ne kadar düşükse, ölçüm o kadar güvenilirdir.`,
                quiz: [
                  {
                    question: "Ölçüm doğruluğunun standartlarla karşılaştırılmasına ne denir?",
                    options: ["Bakım", "Tamir", "Kalibrasyon", "Montaj"],
                    correctAnswer: 2,
                    explanation: "Kalibrasyon, referans bir standart ile test edilen cihaz arasındaki farkın belirlenmesidir."
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'biyoenstrumantasyon',
        title: 'Biyoenstrümantasyon',
        description: 'Tıbbi cihazların elektronik yapısı, sensörler ve sinyal işleme teknikleri.',
        image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=800',
        difficulty: 'Orta',
        estimatedTime: '50 Saat',
        isPopular: true,
        units: [
          {
            id: 'be-unit-1-sensor',
            title: 'Ünite 1: Biyomedikal Sensörler',
            description: 'Fizyolojik verilerin elektriksel sinyallere dönüştürülmesi.',
            estimatedReadingTime: '80 dk',
            topics: [
              {
                id: 'sensor-tipler',
                title: 'Transduserler ve Sensör Teknolojisi',
                content: `Sensörler, vücuttaki fiziksel veya kimyasal değişimleri algılayan ilk birimdir. \n- Piezoelektrik Sensörler: Ultrason problarında basıncı elektriğe dönüştürür.\n- Termistörler: Vücut sıcaklığını yüksek hassasiyetle ölçer.\n- Fotodedektörler: Pulse oksimetre cihazlarında kandaki oksijen doygunluğunu ışık emilimi ile belirler.\n\nSensörlerin lineerliği ve hassasiyeti (sensitivity), tıbbi cihazın kalitesini belirler. Lineer olmayan bir sensör, sinyal işleme katmanında matematiksel olarak kompanze edilmelidir.`,
                quiz: [
                  {
                    question: "Ultrason problarında kullanılan sensör tipi hangisidir?",
                    options: ["LDR", "Termokupl", "Piezoelektrik", "Hall Effect"],
                    correctAnswer: 2,
                    explanation: "Piezoelektrik kristaller, mekanik basıncı elektrik sinyaline dönüştürerek ses dalgalarını algılar."
                  }
                ]
              }
            ]
          },
          {
            id: 'be-unit-2-opamp',
            title: 'Ünite 2: İşlemsel Yükselteçler (Op-Amp)',
            description: 'Biyopotansiyel sinyallerin (ECG, EEG) yükseltilmesi.',
            estimatedReadingTime: '85 dk',
            topics: [
              {
                id: 'opamp-devreler',
                title: 'Enstrümantasyon Amplifikatörleri',
                content: `ECG gibi biyopotansiyel sinyaller mikrovolt seviyesindedir. Bu sinyalleri yükseltmek için standart Op-Amp'lar yerine yüksek CMRR (Ortak Mod Reddetme Oranı) değerine sahip enstrümantasyon amplifikatörleri (InAmp) kullanılır.\n\nInAmp tasarımı genellikle üç Op-Amp'tan oluşur. Bu yapı, elektrotlardan gelen 50Hz şebeke gürültüsünü yok ederken sadece vücuttan gelen fark sinyalini yükseltir. Devredeki direnç toleransları CMRR değerini doğrudan etkiler.`,
                quiz: [
                  {
                    question: "Biyopotansiyel sinyalleri yükseltmek için neden InAmp tercih edilir?",
                    options: ["Daha ucuzdur", "Gürültüyü reddeder (CMRR)", "Daha hızlıdır", "Isınmaz"],
                    correctAnswer: 1,
                    explanation: "Enstrümantasyon amplifikatörleri ortak mod gürültüsünü (50Hz şebeke) yok etme yeteneğine sahiptir."
                  }
                ]
              }
            ]
          },
          {
            id: 'be-unit-3-filtre',
            title: 'Ünite 3: Aktif Filtre Tasarımı',
            description: 'Gürültü engelleme ve sinyal temizleme stratejileri.',
            estimatedReadingTime: '75 dk',
            topics: [
              {
                id: 'filtre-tasarim',
                title: 'Alçak, Yüksek ve Bant Geçiren Filtreler',
                content: `Tıbbi sinyaller her zaman gürültü ile karışıktır. Filtreler bu istenmeyen bileşenleri ayıklar.\n- Alçak Geçiren (LPF): Kas gürültülerini (EMG artığı) temizler.\n- Yüksek Geçiren (HPF): Solunuma bağlı temel kaymalarını (baseline wander) önler.\n- Çentik Filtre (Notch): 50Hz veya 60Hz şebeke gürültüsünü spesifik olarak yok eder.\n\nFiltre derecesi arttıkça (order), kesim keskinliği artar ancak faz kayması ve devre karmaşıklığı da yükselir.`,
                quiz: [
                  {
                    question: "Solunuma bağlı kaymaları önlemek için hangi filtre kullanılır?",
                    options: ["Alçak Geçiren", "Yüksek Geçiren", "Çentik Filtre", "Hepsi"],
                    correctAnswer: 1,
                    explanation: "Yüksek geçiren filtreler (HPF), düşük frekanslı solunum artefaktlarını temizlemek için kullanılır."
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'fizyoloji-dersleri',
    title: 'Mesleki Fizyoloji',
    courses: [
      {
        id: 'mesleki-fizyoloji',
        title: 'Mesleki Fizyoloji ve Terminoloji',
        description: 'İnsan vücudunun çalışma prensipleri ve tıbbi terimlerin teknik analizi.',
        image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800',
        difficulty: 'İleri',
        estimatedTime: '40 Saat',
        units: [
          {
            id: 'mf-unit-1-hucre',
            title: 'Ünite 1: Hücre Elektrofizyolojisi',
            description: 'Aksiyon potansiyeli ve iyon kanalları dinamiği.',
            estimatedReadingTime: '65 dk',
            topics: [
              {
                id: 'hucre-elektrik',
                title: 'Dinlenim ve Aksiyon Potansiyeli',
                content: `Hücre zarı, iyon konsantrasyon farkları nedeniyle bir kondansatör gibi davranır. Dinlenim halindeki bir hücrenin iç kısmı genellikle -70mV civarındadır. \n\nBir uyarı geldiğinde Na+ kanalları açılır ve hücre içi pozitifleşir (Depolarizasyon). Ardından K+ kanalları açılarak hücre eski haline döner (Repolarizasyon). Bu elektriksel değişim, ECG ve EEG cihazlarının ölçtüğü temel sinyal kaynağıdır. Hücre zarındaki Na+/K+ pompası bu dengeyi aktif olarak korur.`,
                quiz: [
                  {
                    question: "Hücre zarının depolarize olması ne anlama gelir?",
                    options: ["İçinin negatifleşmesi", "İçinin pozitifleşmesi", "Ölmesi", "Durgunlaşması"],
                    correctAnswer: 1,
                    explanation: "Depolarizasyon sırasında sodyum girişi ile hücre içi pozitif bir değer alır."
                  }
                ]
              }
            ]
          },
          {
            id: 'mf-unit-2-kardiyo',
            title: 'Ünite 2: Kardiyovasküler Sistem Mekaniği',
            description: 'Kalbin pompa fonksiyonu ve hemodinamik parametreler.',
            estimatedReadingTime: '75 dk',
            topics: [
              {
                id: 'kalp-mekanik',
                title: 'Debi, Basınç ve Akış Analizi',
                content: `Kalp, günde yaklaşık 100.000 kez atan mekanik bir pompadır. \n- Sistolik Basınç: Kalbin kasılma anındaki basınç (120 mmHg).\n- Diyastolik Basınç: Gevşeme anındaki basınç (80 mmHg).\n\nKalp debisi (Cardiac Output), bir dakikada pompalanan kan miktarıdır. Bu değer, solunum cihazlarının ve yapay kalp-akciğer makinelerinin tasarımında temel referans noktasıdır. Damar direnci ve kanın viskozitesi, kan basıncını doğrudan etkileyen fiziksel faktörlerdir.`,
                quiz: [
                  {
                    question: "Sağlıklı bir yetişkinde normal sistolik basınç değeri nedir?",
                    options: ["80 mmHg", "150 mmHg", "120 mmHg", "200 mmHg"],
                    correctAnswer: 2,
                    explanation: "Normal yetişkinlerde sistolik (büyük) tansiyonun 120 mmHg civarında olması beklenir."
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];