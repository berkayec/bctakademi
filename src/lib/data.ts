import { FileText, Video, Presentation } from 'lucide-react';
export const navLinks = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Dersler', href: '/dersler' },
  { name: 'Kaynaklar', href: '/kaynaklar' },
  { name: 'Blog', href: '/blog' },
  { name: 'İletişim', href: '/iletisim' },
];
export interface Topic {
  id: string;
  title: string;
  content: string;
}
export interface Unit {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
}
export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  units: Unit[];
}
export interface Grade {
  id: string;
  title: string;
  courses: Course[];
}
export const grades: Grade[] = [
  {
    id: '9-sinif',
    title: '9. Sınıf',
    courses: [
      {
        id: 'biyo-olcme',
        title: 'Biyoölçme',
        description: 'Biyomedikal cihazlarda temel ölçme teknikleri, elektriksel güvenlik ve laboratuvar disiplini.',
        image: 'https://images.unsplash.com/photo-1576091160550-2173bdb999ef?auto=format&fit=crop&q=80&w=800',
        units: [
          {
            id: 'is-sagligi',
            title: 'Ünite 1: İş Sağlığı ve Güvenliği',
            description: 'Biyomedikal atölyelerinde OSGB kuralları ve güvenlik protokolleri.',
            topics: [
              { 
                id: 'isg-temelleri', 
                title: 'Biyomedikalde İSG Temelleri', 
                content: 'Biyomedikal cihaz teknolojileri alanında iş sağlığı ve güvenliği, sadece yasal bir zorunluluk değil, aynı zamanda hem teknisyenin hem de hastanın hayatını koruyan kritik bir disiplindir. Atölye çalışmalarında 6331 sayılı İş Sağlığı ve Güvenliği Kanunu temel alınır. Biyomedikal teknik servislerinde karşılaşılan riskler; elektriksel riskler, radyasyon riskleri, biyolojik riskler ve kimyasal riskler olarak sınıflandırılır. Koruyucu ekipman kullanımı (ESD bileklikler, yalıtkan ayakkabılar, önlükler) zorunludur. Özellikle tıbbi cihazların kalibrasyonu sırasında yüksek gerilimle çalışırken izole edilmiş araçlar kullanılmalıdır.' 
              },
              { 
                id: 'laboratuvar-guvenligi', 
                title: 'Laboratuvar ve Atölye Güvenliği', 
                content: 'Laboratuvar ortamında düzen, hatasız ölçümün ilk adımıdır. Her cihazın bir kullanım kılavuzu ve güvenlik kartı (MSDS) bulunmalıdır. Atölye içinde "Sıfır Hata" prensibi ile çalışılmalı, arızalı cihazlar mutlaka etiketlenerek karantinaya alınmalıdır. Yangın güvenliği için biyomedikal atölyelerinde genellikle CO2 veya Kuru Kimyevi Toz tipi söndürücüler bulundurulur. Acil durumlarda panik yapmadan "Acil Durum Eylem Planı"na uyulmalı ve acil durdurma butonlarının yerleri tüm personel tarafından bilinmelidir.' 
              }
            ]
          },
          {
            id: 'temel-olcme',
            title: 'Ünite 2: Temel Elektriksel Ölçümler',
            description: 'Gerilim, akım ve direnç ölçme teknikleri.',
            topics: [
              { id: 'multimetre', title: 'Multimetre Kullanımı', content: 'Dijital ve analog multimetreler ile gerilim (V), akım (A) ve direnç (Ω) ölçümleri yapılırken dikkat edilmesi gereken en önemli nokta, ölçüm kademesinin doğru seçilmesidir. Yanlış kademede yapılan ölçümler hem cihaza hem de kullanıcıya zarar verebilir.' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '10-sinif',
    title: '10. Sınıf',
    courses: [
      {
        id: 'biyoenstrumantasyon-atolyesi',
        title: 'Biyoenstrümantasyon Atölyesi',
        description: 'Tıbbi cihazların çalışma prensipleri ve arıza giderme yöntemleri.',
        image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=800',
        units: [
          {
            id: 'bakim-temelleri',
            title: 'Cihaz Bakım Temelleri',
            description: 'Koruyucu ve önleyici bakım süreçleri.',
            topics: [
              { id: 'periyodik-bakim', title: 'Periyodik Bakım Planlaması', content: 'Tıbbi cihazların ömrünü uzatmak ve hasta güvenliğini sağlamak için belirli aralıklarla yapılan bakımlardır.' }
            ]
          }
        ]
      },
      {
        id: 'mesleki-fizyoloji',
        title: 'Mesleki Fizyoloji ve Terminoloji',
        description: 'İnsan vücudu sistemleri ve biyomedikal terimler.',
        image: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=800',
        units: []
      }
    ]
  },
  {
    id: 'alan-dersleri',
    title: 'Alan Dersleri',
    courses: [
      {
        id: 'yasam-destek-cihazlari',
        title: 'Yaşam Destek Cihazları',
        description: 'Ventilatör, defibrilatör ve diyaliz makineleri teknolojisi.',
        image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=800',
        units: [
          {
            id: 'ventilator-tek',
            title: 'Ventilatör Teknolojisi',
            description: 'Yapay solunum cihazlarının mekanik ve elektronik yapısı.',
            topics: [
              { id: 'akıs-kontrol', title: 'Akış Kontrol Valfleri', content: 'Ventilatörlerde oksijen ve hava karışımını sağlayan hassas valf sistemlerinin çalışma mantığı.' }
            ]
          }
        ]
      }
    ]
  }
];
export const resources = [
  {
    id: 'res-1',
    type: 'PDF',
    title: 'MEB 9. Sınıf Biyoölçme Kitabı',
    description: 'Resmi müfredata uygun Biyoölçme dersi konu anlatımı ve uygulamaları.',
    icon: FileText,
    category: 'Müfredat',
    fileSize: '4.2 MB',
  },
  {
    id: 'res-2',
    type: 'Sunum',
    title: 'Elektriksel Güvenlik Testleri (EST)',
    description: 'Tıbbi cihazlarda kaçak akım testleri ve IEC 62353 standartları.',
    icon: Presentation,
    category: 'Teknik Eğitim',
    fileSize: '8.4 MB',
  },
  {
    id: 'res-3',
    type: 'Video',
    title: 'Defibrilatör Kullanım ve Bakımı',
    description: 'Uygulamalı defibrilatör test ve kalibrasyon adımları.',
    icon: Video,
    category: 'Cihaz Eğitimi',
    duration: '15:20',
  }
];
export const blogPosts = [
  {
    id: 'post-1',
    title: 'Biyomedikalde Kariyer: Nereden Başlamalı?',
    excerpt: 'Lise ve üniversite döneminde kendinizi geliştirmeniz gereken temel alanlar.',
    date: '10 Kasım 2023',
    readTime: '8 dk okuma',
    author: 'Öğr. Gör. Mehmet Ak',
    category: 'Kariyer',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    id: 'post-2',
    title: 'Yeni Nesil Görüntüleme Teknolojileri',
    excerpt: 'MRI ve BT cihazlarındaki son teknolojik gelişmeler ve yapay zeka entegrasyonu.',
    date: '5 Kasım 2023',
    readTime: '5 dk okuma',
    author: 'Dr. Ayşe Yılmaz',
    category: 'Teknoloji',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    featured: false,
  }
];