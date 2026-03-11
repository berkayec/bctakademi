import { BookOpen, FileText, Video, Presentation } from 'lucide-react';
export const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Lessons', href: '/lessons' },
  { name: 'Resources', href: '/resources' },
  { name: 'Blog', href: '/blog' },
];
export const curriculum = {
  grade9: {
    title: '9th Grade Curriculum',
    lessons: [
      {
        id: 'g9-1',
        title: 'Introduction to Biomedical Tech',
        description: 'Foundations of medical device technology and its role in modern healthcare.',
        duration: '45 mins',
        image: 'https://images.unsplash.com/photo-1576091160550-2173bdb999ef?auto=format&fit=crop&q=80&w=800',
      },
      {
        id: 'g9-2',
        title: 'Basic Anatomy for Engineers',
        description: 'Understanding human systems from a mechanical and electrical perspective.',
        duration: '60 mins',
        image: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=800',
      },
    ],
  },
  grade10: {
    title: '10th Grade Curriculum',
    lessons: [
      {
        id: 'g10-1',
        title: 'Sensors & Transducers',
        description: 'Exploring how physical biological signals are converted into electrical data.',
        duration: '55 mins',
        image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=800',
      },
      {
        id: 'g10-2',
        title: 'Medical Imaging Fundamentals',
        description: 'Introduction to X-Ray, MRI, and Ultrasound technology principles.',
        duration: '75 mins',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
      },
    ],
  },
  coreFields: {
    title: 'Core Field Lessons',
    lessons: [
      {
        id: 'core-1',
        title: 'Clinical Engineering',
        description: 'Management and maintenance of medical equipment in hospital settings.',
        duration: '90 mins',
        image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=800',
      },
      {
        id: 'core-2',
        title: 'Bio-Signal Processing',
        description: 'Advanced techniques for analyzing ECG, EEG, and EMG signals.',
        duration: '120 mins',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      },
    ],
  },
};
export const resources = [
  {
    id: 'res-1',
    type: 'PDF',
    title: 'Safety Standards Handbook',
    description: 'Essential electrical safety guidelines for medical devices.',
    icon: FileText,
    category: 'Safety',
  },
  {
    id: 'res-2',
    type: 'Presentation',
    title: 'The Future of Prosthetics',
    description: 'Visual slides covering robotic limbs and neural interfaces.',
    icon: Presentation,
    category: 'Innovation',
  },
  {
    id: 'res-3',
    type: 'Video',
    title: 'Hemodialysis Machine Walkthrough',
    description: 'Step-by-step breakdown of blood purification systems.',
    icon: Video,
    category: 'Equipment',
  },
];