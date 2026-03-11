import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { curriculum } from '@/lib/curriculum';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  ChevronRight, 
  LayoutList, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  PlayCircle,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
export function CourseDetailPage() {
  const { categoryId, courseId } = useParams();
  const category = curriculum.find(c => c.id === categoryId);
  const course = category?.courses.find(c => c.id === courseId);
  if (!course) return <RootLayout><div className="py-20 text-center">Kurs bulunamadı.</div></RootLayout>;
  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-10 overflow-x-auto whitespace-nowrap">
          <Link to="/dersler" className="hover:text-teal-600 transition-colors font-medium">Müfredat</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900">{category?.title}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-teal-600 font-bold">{course.title}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          <div className="lg:col-span-2 space-y-16">
            <section className="space-y-6">
              <h1 className="text-5xl font-display font-bold text-slate-900 leading-tight">{course.title}</h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">{course.description}</p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Badge variant="secondary" className="px-5 py-2 rounded-full bg-slate-100 text-slate-700 font-bold border-none">
                  <LayoutList className="w-4 h-4 mr-2 text-teal-600" /> {course.units.length} Modül
                </Badge>
                <Badge variant="secondary" className="px-5 py-2 rounded-full bg-slate-100 text-slate-700 font-bold border-none">
                  <Clock className="w-4 h-4 mr-2 text-orange-600" /> {course.estimatedTime}
                </Badge>
                <Badge variant="secondary" className="px-5 py-2 rounded-full bg-slate-100 text-slate-700 font-bold border-none">
                  <ShieldCheck className="w-4 h-4 mr-2 text-blue-600" /> MEB Onaylı
                </Badge>
              </div>
            </section>
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <h2 className="text-3xl font-bold text-slate-900">Eğitim İçeriği</h2>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{course.units.length} Ünite Mevcut</span>
              </div>
              <Accordion type="single" collapsible className="space-y-4">
                {course.units.map((unit, idx) => (
                  <AccordionItem 
                    key={unit.id} 
                    value={unit.id} 
                    className="border-none bg-white/40 backdrop-blur-md rounded-[2rem] border border-slate-200/50 shadow-sm overflow-hidden"
                  >
                    <AccordionTrigger className="px-8 py-7 hover:no-underline group">
                      <div className="flex flex-col items-start text-left gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2.5 py-1 rounded-lg">Ünite {idx + 1}</span>
                          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {unit.estimatedReadingTime}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{unit.title}</h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-8 pb-8 pt-0">
                      <div className="h-px bg-slate-100 mb-8" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <p className="text-slate-600 leading-relaxed font-medium">{unit.description}</p>
                          <ul className="space-y-3">
                            {unit.topics.map((topic, tIdx) => (
                              <li key={topic.id} className="flex items-center gap-3 text-slate-500 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span className="font-medium">{topic.title}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-col justify-end items-end gap-4">
                          <Button asChild className="bg-slate-900 hover:bg-orange-500 text-white rounded-2xl h-14 px-10 font-bold transition-all shadow-xl active:scale-95 group/btn">
                            <Link to={`/dersler/${categoryId}/${course.id}/${unit.id}`}>
                              Eğitime Başla <PlayCircle className="ml-2 w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>
          {/* Sidebar / CTA */}
          <aside className="lg:sticky lg:top-28 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-950 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden"
            >
              <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                  <h4 className="text-4xl font-display font-bold">Tam Erişim</h4>
                  <p className="text-slate-400 text-lg leading-relaxed">Bu ders tüm öğrencilerimiz için ücretsiz olarak sunulmaktadır.</p>
                </div>
                <ul className="space-y-4">
                  {["Uygulamalı Simülasyonlar", "Teknik Dokümantasyon", "Uzman Eğitmen Desteği", "Konu Sonu Quizleri"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-semibold">
                      <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="w-full h-16 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-95">
                  Hemen Katıl
                </Button>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
            </motion.div>
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] space-y-4">
              <h5 className="font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" /> Kaynak Merkezi
              </h5>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Bu dersle ilgili PDF notlara ve teknik şemalara Kaynak Merkezi'nden ulaşabilirsiniz.</p>
              <Button variant="link" className="p-0 text-teal-600 font-bold hover:text-teal-700 h-auto" asChild>
                <Link to="/kaynaklar">Dosyaları İncele <ArrowRight className="ml-1 w-4 h-4" /></Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </RootLayout>
  );
}