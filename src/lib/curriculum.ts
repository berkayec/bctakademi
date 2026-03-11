import { Category } from './curriculum.types';
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
                Özellikle hastanelerde klinik mühendislik birimlerinde çalışanlar, sadece kendi güvenliklerinden değil, aynı zamanda cihazların güvenli çalışmasından da sorumludur. Hatalı bir onarım veya yetersiz kalibrasyon, hastanın hayatını doğrudan tehlikeye atabilir. Bu nedenle teknik dokümantasyon takibi ve standartlara uyum yasal bir zorunluluktur.
                Laboratuvar ortamında Kişisel Koruyucu Donanım (KKD) kullanımı asla ihmal edilmemelidir. Antistatik önlükler, koruyucu gözlükler ve yüksek gerilimle çalışırken izole eldivenler temel ekipmanlar arasındadır. Ayrıca, cihazlara müdahale edilmeden önce mutlaka "LOTO" (Lock Out - Tag Out / Kilitle ve Etiketle) prosedürü uygulanarak enerjinin kesildiği teyit edilmelidir.`,
                videoYoutubeId: 'dQw4w9WgXcQ'
              }
            ]
          },
          {
            id: 'unit-2-elektriksel-guvenlik',
            title: 'Ünite 2: Elektriksel Güvenlik Testleri',
            description: 'Kaçak akım ölçümleri ve izolasyon testleri.',
            estimatedReadingTime: '90 dk',
            topics: [
              {
                id: 'kacak-akm',
                title: 'Kaçak Akım Ölçüm Prensipleri',
                content: `Tıbbi cihazlarda elektriksel güvenlik, IEC 62353 ve IEC 60601-1 standartları ile belirlenir. Bu standartlar, cihazın şasi veya uygulamalı parçalarından hastaya veya operatöre akabilecek akım sınırlarını tanımlar. Mikro-şok riski, kalbe yakın bölgelerde kullanılan cihazlar için milimetre başına mikroamper seviyelerindedir.
                Kaçak akım testleri genellikle cihazın normal çalışma koşullarında, tek arıza koşullarında ve ters polarite durumlarında yapılır. Toprak süreklilik testi, cihazın koruma iletkeninin direncini ölçerek, oluşabilecek bir kısa devre durumunda akımın güvenle toprağa akıp akmayacağını belirler. Bu değer genellikle 0.2 ohm altında olmalıdır.
                İzolasyon direnci testleri ise, cihazın enerjili kısımları ile erişilebilir metal kısımları arasındaki yalıtımın kalitesini ölçer. Zamanla eskiyen kablolar, nem ve toz birikimi izolasyon kalitesini düşürerek yangın ve çarpılma riskini artırır. Bu testler periyodik bakımın en kritik aşamasıdır.`
              }
            ]
          },
          {
            id: 'unit-3-olcu-birimleri',
            title: 'Ünite 3: Ölçü Birimleri ve Hata Analizi',
            description: 'Uluslararası birim sistemleri ve hassas ölçüm.',
            estimatedReadingTime: '45 dk',
            topics: [
              {
                id: 'si-birimleri',
                title: 'Biyomedikalde SI Birimleri',
                content: `Hassas ölçüm, biyomedikal mühendisliğin temel taşıdır. Uluslararası Birimler Sistemi (SI), tüm dünyada ölçüm birliği sağlar. Uzunluk (metre), kütle (kilogram), zaman (saniye) ve elektrik akımı (amper) temel birimlerimizdir. Tıbbi cihazlarda ise bu birimlerin türevleri olan Volt, Ohm, Pascal ve Hertz sıkça kullanılır.
                Ölçümlerde karşılaşılan hatalar sistematik ve rastgele olmak üzere ikiye ayrılır. Sistematik hatalar genellikle cihazın yanlış kalibre edilmesinden veya çevre koşullarından kaynaklanır ve düzeltilebilir. Rastgele hatalar ise öngörülemez varyasyonlardır. Bir teknisyenin görevi, ölçüm belirsizliğini minimuma indirerek en doğru veriyi elde etmektir.
                Kalibrasyon, bir ölçü aletinin doğruluğunu, daha yüksek hassasiyete sahip bir referans (standard) ile karşılaştırma işlemidir. Kalibrasyonu yapılmamış bir cihazla yapılan teşhis, yanlış tedaviye yol açabilir. Bu nedenle biyomedikalde izlenebilirlik (traceability) zinciri asla kopmamalıdır.`
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
        units: []
      }
    ]
  }
];