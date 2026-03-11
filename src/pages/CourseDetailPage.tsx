import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { curriculum } from '@/lib/curriculum';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  ChevronRight,
  PlayCircle,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
export function CourseDetailPage() {
  const { categoryId, courseId } = useParams();
  const category = curriculum.find(c => c.id === categoryId);
  const course = category?.courses.find(c => c.id === courseId);
  if (!course) return <RootLayout><div className="py-20 text-center text-slate-500 font-bold">Kurs bulunamadı.</div></RootLayout>;
  const firstUnitId = course.units[0]?.id;
  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-10 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/dersler" className="hover:text-teal-600 transition-colors font-medium">Müfredat</Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link
            to={`/dersler?cat=${categoryId}`}
            className="hover:text-teal-600 transition-colors font-medium"
          >
            {category?.title}
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className="text-teal-600 font-bold">{course.title}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-2 space-y-12 md:space-y-16">
            <section className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight">{course.title}</h1>
              <div className="aspect-video relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group mb-8 shadow-2xl bg-slate-100">
                <img src={course.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={course.title} />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-teal-600 shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
                    <PlayCircle className="w-10 h-10 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl">{course.description}</p>
            </section>
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Eğitim İçeriği</h2>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">{course.units.length} Ünite</span>
              </div>
              <Accordion type="single" collapsible className="space-y-4">
                {course.units.map((unit, idx) => (
                  <AccordionItem
                    key={unit.id}
                    value={unit.id}
                    className="border-none bg-white/60 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] border border-slate-200/50 shadow-sm overflow-hidden transition-all hover:border-teal-200"
                  >
                    <AccordionTrigger className="px-6 md:px-8 py-6 md:py-7 hover:no-underline group">
                      <div className="flex flex-col items-start text-left gap-2">
                        <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2.5 py-1 rounded-lg">Ünite {idx + 1}</span>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{unit.title}</h3>
                      </div>
                      <ChevronRight className="w-6 h-6 text-slate-300 group-data-[state=open]:rotate-90 transition-transform shrink-0" />
                    </AccordionTrigger>
                    <AccordionContent className="px-6 md:px-8 pb-8 pt-0">
                      <div className="h-px bg-slate-100 mb-8" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <p className="text-slate-600 leading-relaxed font-medium">{unit.description}</p>
                        </div>
                        <div className="flex flex-col justify-end items-end gap-4">
                          <Button asChild className="bg-slate-900 hover:bg-orange-500 text-white rounded-2xl h-14 px-10 font-bold transition-all shadow-xl active:scale-95 group/btn border-none">
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
          <aside className="lg:sticky lg:top-28 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-950 text-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden"
            >
              <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                  <h4 className="text-3xl md:text-4xl font-display font-bold">Tam Erişim</h4>
                  <p className="text-slate-400 text-lg leading-relaxed">Bu ders tüm uzmanlık yolculuğunuz için ücretsiz sunulmaktadır.</p>
                </div>
                <ul className="space-y-4">
                  {["Uygulamalı Simülasyonlar", "Teknik Dokümantasyon", "Uzman Eğitmen Desteği", "Konu Sonu Quizleri"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                      <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                {firstUnitId && (
                  <Button asChild className="w-full h-16 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-95 border-none">
                    <Link to={`/dersler/${categoryId}/${courseId}/${firstUnitId}`}>
                      Hemen Katıl
                    </Link>
                  </Button>
                )}
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
            </motion.div>
            <div className="bg-white border border-slate-100 p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm space-y-4 transition-all hover:shadow-md">
              <h5 className="font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" /> Kaynak Merkezi
              </h5>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Bu dersle ilgili PDF notlara ve teknik şemalara Kaynak Merkezi'nden ulaşabilirsiniz.</p>
              <Button variant="link" className="p-0 text-teal-600 font-bold hover:text-teal-700 h-auto" asChild>
                <Link to="/kaynaklar" className="flex items-center gap-1">Dosyaları İncele <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </RootLayout>
  );
}