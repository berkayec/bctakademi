import { FileText, Video, Presentation } from 'lucide-react';
export const navLinks = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Dersler', href: '/dersler' },
  { name: 'Kaynaklar', href: '/kaynaklar' },
  { name: 'Blog', href: '/blog' },
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
        description: 'Biyomedikal cihazlarda temel ölçme teknikleri ve elektriksel güvenlik.',
        image: 'https://images.unsplash.com/photo-1576091160550-2173bdb999ef?auto=format&fit=crop&q=80&w=800',
        units: [
          {
            id: 'unit-1',
            title: 'Ünite 1: Temel Elektriksel Ölçümler',
            description: 'Gerilim, akım ve direnç ölçme teknikleri.',
            topics: [
              { id: 't1', title: 'Multimetre Kullanımı', content: 'Dijital multimetre ile temel ölçümler...' },
              { id: 't2', title: 'Osiloskop Temelleri', content: 'Sinyal görüntüleme ve analiz...' }
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
        description: 'Tıbbi cihazların çalışma prensipleri ve arıza giderme.',
        image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=800',
        units: []
      },
      {
        id: 'mesleki-fizyoloji',
        title: 'Mesleki Fizyoloji ve Terminoloji',
        description: 'İnsan vücudu sistemleri ve tıbbi terimler.',
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
        description: 'Vantilatör, defibrilatör ve diyaliz makineleri.',
        image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=800',
        units: []
      }
    ]
  }
];
export const resources = [
  {
    id: 'res-1',
    type: 'PDF',
    title: 'Elektriksel Güvenlik Standartları',
    description: 'Tıbbi cihazlar için IEC 60601 standartları özeti.',
    icon: FileText,
    category: 'Güvenlik',
    fileSize: '2.4 MB',
  },
  {
    id: 'res-2',
    type: 'Sunum',
    title: 'Protez Teknolojilerinin Geleceği',
    description: 'Robotik uzuvlar ve nöral arayüzler sunumu.',
    icon: Presentation,
    category: 'İnovasyon',
    fileSize: '15.8 MB',
  },
  {
    id: 'res-3',
    type: 'Video',
    title: 'Hemodiyaliz Cihazı Kurulumu',
    description: 'Diyaliz sistemlerinin adım adım devreye alınması.',
    icon: Video,
    category: 'Ekipman',
    duration: '12:45',
  }
];
export const blogPosts = [
  {
    id: 'post-1',
    title: 'Tanısal Görüntülemede Yapay Zeka',
    excerpt: 'Makine öğrenimi algoritmalarının radyoloji alanındaki devrimi.',
    date: '24 Ekim 2023',
    readTime: '6 dk okuma',
    author: 'Dr. Sarah Chen',
    category: 'AI & Görüntüleme',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    id: 'post-2',
    title: 'Giyilebilir Teknolojiler: Nabız Takibinin Ötesi',
    excerpt: 'Yeni nesil sürekli glikoz izleme ve ter analizi yamaları.',
    date: '18 Ekim 2023',
    readTime: '4 dk okuma',
    author: 'James Wilson',
    category: 'Giyilebilir',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    featured: false,
  }
];