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
                videoYoutubeId: 'qR6H_Y_pD6M', // Introduction to Biomedical Engineering
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
          ...Array.from({ length: 4 }).map((_, i) => ({
            id: `est-u-${i + 2}`,
            title: `Ünite ${i + 2}: ${['IEC 62353 Standartları', 'Kaçak Akım Ölçüm Teknikleri', 'Kalibrasyon ve İzlenebilirlik', 'Hata Analizi ve Raporlama'][i]}`,
            description: 'Profesyonel biyomedikal teknik servis standartlarında derinlemesine teknik inceleme.',
            estimatedReadingTime: '120 dk',
            topics: [
              {
                id: `est-t-${i+2}-1`,
                title: 'Teknik Uygulama Rehberi',
                content: `Bu bölümde, biyomedikal cihazların güvenli çalışmasını sağlayan kritik teknik parametreler ele alınmaktadır. \n\nDevre Şeması Analizi:\nCihazın güç katı girişi (L, N, PE) ile gövde arasındaki izolasyon direnci ölçülürken test cihazı 500V DC gerilim uygular. Bu süreçte cihazın tüm sigortalarının (F1, F2) sağlam olduğu doğrulanmalıdır. \n\nKlinik Prosedürler:\n1. Toprak Hattı Sürekliliği: Test cihazı 200mA akım basarak toprak direncini ölçer. Kabul edilebilir limit 200mΩ altıdır.\n2. Kaçak Akım Ölçümü: Cihaz çalışma geriliminde iken gövde kaçak akımı (Chassis Leakage) diferansiyel metodla ölçülür.`,
                quiz: [
                  {
                    question: "Toprak sürekliliği testi için kabul edilebilir direnç sınırı nedir?",
                    options: ["0.2 Ohm", "1 Ohm", "5 Ohm", "0.5 Ohm"],
                    correctAnswer: 0,
                    explanation: "IEC 62353 standartlarına göre toprak sürekliliği direnci 0.2 Ohm (200mOhm) altında olmalıdır. Bu değerin üzerindeki direnç, toprak hattının zayıf olduğunu ve güvenlik riski taşıdığını gösterir."
                  }
                ]
              }
            ]
          }))
        ]
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
              content: `Biyomedikal sinyaller genellikle mikrovolt seviyesindedir. Bu sinyalleri yükseltmek için yüksek CMRR değerine sahip devreler gerekir.\n\nOp-Amp Yapılandırması:\nECG yükseltici katında AD620 gibi özel enstrümantasyon amplifikatörleri kullanılır. Bu yapı üç ana Op-Amp'tan oluşur. Kazanç (Gain) ayarı dış bir direnç (Rg) ile belirlenir.`,
              quiz: [
                {
                  question: "Biyomedikal sinyal yükseltmede neden CMRR önemlidir?",
                  options: ["Hızı artırır", "Şebeke gürültüsünü yok eder", "Güç tüketimini azaltır", "Maliyet düşürür"],
                  correctAnswer: 1,
                  explanation: "Common Mode Rejection Ratio (CMRR), her iki girişe ortak gelen şebeke gürültülerini (50Hz/60Hz) bastırma yeteneğidir. Biyomedikal sinyaller çok küçük olduğu için bu gürültülerin elenmesi hayati önem taşır."
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
              content: `İnsan vücudu karmaşık bir elektro-mekanik sistemdir. \n\nAksiyon Potansiyeli:\nHücre zarı Na+/K+ pompası ile -70mV dinlenim potansiyelini korur. Uyarı anında iyon kanallarının açılmasıyla gerçekleşen depolarizasyon, ECG ve EEG cihazlarının temel veri kaynağıdır.`,
              quiz: [
                {
                  question: "Normal bir uyarılabilir hücrenin dinlenim potansiyeli yaklaşık kaçtır?",
                  options: ["+40 mV", "0 mV", "-70 mV", "-10 mV"],
                  correctAnswer: 2,
                  explanation: "Çoğu uyarılabilir hücrede (sinir ve kas hücreleri gibi) dinlenim zar potansiyeli iç tarafın dışa göre negatif olduğu -70 mV civarındadır."
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
              content: `Yaşam destek cihazları, hata kabul etmeyen sistemlerdir. \n\nVentilatör Pnömatik Yapısı:\nHava ve Oksijen girişi 4 bar basınçla regülatörlere gelir. Akış kontrolü orantılı valfler (Proportional Valves) ile sağlanır.`,
              quiz: [
                {
                  question: "Bifaizik defibrilatörlerin monofaziklere göre en büyük avantajı nedir?",
                  options: ["Daha ucuzdur", "Daha hafiftir", "Daha düşük enerjiyle daha etkili şok sağlar", "Daha hızlı şarj olur"],
                  correctAnswer: 2,
                  explanation: "Bifaizik dalga formu, akımı iki yönde ileterek kalp kasına (miyokard) daha az zarar verir ve daha düşük enerji seviyelerinde bile daha başarılı defibrilasyon (ritim düzeltme) sağlar."
                }
              ]
            }
          ]
        }))
      }
    ]
  }
];