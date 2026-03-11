import { FileText, Video, Presentation, LucideIcon } from 'lucide-react';
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
        estimatedTime: '12 Saat',
        isPopular: true,
        units: [
          {
            id: 'isg-ve-guvenlik',
            title: 'İş Sağlığı ve Güvenliği',
            description: 'Biyomedikal atölyelerinde OSGB kuralları ve güvenlik protokolleri.',
            estimatedReadingTime: '45 dk',
            topics: [
              {
                id: 'isg-temelleri',
                title: 'Biyomedikalde İSG Temelleri',
                videoYoutubeId: 'dQw4w9WgXcQ',
                content: `Biyomedikal cihaz teknolojileri alanında iş sağlığı ve güvenliği, sadece yasal bir zorunluluk değil, aynı zamanda hem teknisyenin hem de hastanın hayatını koruyan kritik bir disiplindir. Atölye çalışmalarında 6331 sayılı İş Sağlığı ve Güvenliği Kanunu temel alınır. 
                Teknik servis ortamında karşılaşılabilecek riskler biyolojik, elektriksel ve mekanik olarak üç ana grupta toplanır. Cihazlara müdahale etmeden önce mutlaka güç bağlantısının kesilmesi ve gerekli kişisel koruyucu donanımların (KKD) kuşanılması gerekir. Özellikle yüksek gerilim içeren defibilatör gibi cihazlarda deşarj prosedürleri hayati önem taşır.
                Hastanelerde tıbbi cihazların güvenli kullanımı için "Elektriksel Güvenlik Testleri" periyodik olarak yapılmalıdır. Bu testler, cihazın gövdesinden sızabilecek kaçak akımların hasta veya operatör üzerinde oluşturabileceği mikro-şok ve makro-şok risklerini minimize eder.
                Atölye düzeni, hatasız çalışmanın temelidir. Her cihazın bir servis kılavuzu (Service Manual) bulunmalı ve bu kılavuzlardaki güvenlik uyarılarına harfiyen uyulmalıdır. Kimyasal maddelerin bulunduğu alanlarda ise Malzeme Güvenlik Bilgi Formları (MSDS) mutlaka ulaşılabilir olmalıdır.`,
                quiz: [
                  {
                    question: "Biyomedikalde en kritik İSG kanunu hangisidir?",
                    options: ["4857", "6331", "5510", "2822"],
                    correctAnswer: 1,
                    explanation: "6331 sayılı İSG Kanunu tüm teknik servis süreçlerini kapsar."
                  }
                ],
                attachments: [
                  { title: "İSG Kontrol Listesi", type: "PDF", url: "#" },
                  { title: "Atölye Yerleşim Planı", type: "Diagram", url: "#" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'biyoenstrumantasyon',
        title: 'Biyoenstrümantasyon',
        description: 'Tıbbi ölçüm sistemlerinin mimarisi ve sensör teknolojileri.',
        image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=800',
        difficulty: 'Orta',
        estimatedTime: '18 Saat',
        units: []
      },
      {
        id: 'fizyoloji-terminoloji',
        title: 'Mesleki Fizyoloji ve Terminoloji',
        description: 'Biyomedikal cihazların etkileşimde olduğu insan fizyolojisi ve teknik terimler.',
        image: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=800',
        difficulty: 'Temel',
        estimatedTime: '10 Saat',
        units: []
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
        image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=800',
        difficulty: 'İleri',
        estimatedTime: '24 Saat',
        isPopular: true,
        units: []
      }
    ]
  }
];