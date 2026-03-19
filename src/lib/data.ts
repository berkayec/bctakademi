import { FileText, Video, Presentation } from 'lucide-react';

export const navLinks = [
  { name: 'Ana Sayfa',  href: '/' },
  { name: 'Dersler',    href: '/dersler' },
  { name: 'Kaynaklar',  href: '/kaynaklar' },
  { name: 'Blog',       href: '/blog' },
  { name: 'Liderlik',   href: '/liderlik-tablosu' },
  { name: 'İletişim',   href: '/iletisim' },
];

export const resources = [
  {
    id: 'res-1',
    type: 'PDF',
    title: 'MEB BCT Müfredat Kitabı',
    description: 'Resmi müfredata uygun Biyomedikal Cihaz Teknolojileri dersi konu anlatımı ve uygulamaları.',
    icon: FileText,
    category: 'Müfredat',
    fileSize: '4.2 MB',
  },
  {
    id: 'res-2',
    type: 'Sunum',
    title: 'Elektriksel Güvenlik Testleri (EST)',
    description: 'BCT Akademi teknik eğitim serisi: Tıbbi cihazlarda kaçak akım testleri ve IEC 62353 standartları.',
    icon: Presentation,
    category: 'Teknik Eğitim',
    fileSize: '8.4 MB',
  },
  {
    id: 'res-3',
    type: 'Video',
    title: 'Defibrilatör Kullanım ve Bakımı',
    description: 'Uygulamalı defibrilatör test ve kalibrasyon adımları uzman eğitmen anlatımıyla.',
    icon: Video,
    category: 'Cihaz Eğitimi',
    duration: '15:20',
  }
];

export const blogPosts = [
  {
    id: 'post-1',
    title: 'Biyomedikalde Kariyer: Uzmanlık Yolculuğu',
    excerpt: 'Lise ve üniversite döneminde kendinizi geliştirmeniz gereken temel klinik mühendislik alanları.',
    date: '10 Kasım 2023',
    readTime: '8 dk okuma',
    author: 'Öğr. Gör. Mehmet Ak',
    category: 'Kariyer',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    id: 'post-2',
    title: 'Görüntüleme Teknolojilerinde Yapay Zeka',
    excerpt: 'BCT Akademi incelemesi: MRI ve BT cihazlarındaki son teknolojik gelişmeler ve AI entegrasyonu.',
    date: '5 Kasım 2023',
    readTime: '5 dk okuma',
    author: 'Dr. Ayşe Yılmaz',
    category: 'Teknoloji',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    featured: false,
  }
];
