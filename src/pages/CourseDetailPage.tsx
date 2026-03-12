import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { curriculum } from '@/lib/curriculum';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronRight, PlayCircle, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function CourseDetailPage() {
  const { categoryId, courseId } = useParams();
  const category = curriculum.find(c => c.id === categoryId);
  const course = category?.courses.find(c => c.id === courseId);

  if (!course) return <RootLayout><div className="py-20 text-center text-white font-bold">Kurs bulunamadı.</div></RootLayout>;
  const firstUnitId = course.units[0]?.id;

  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
          <Link to="/dersler" className="hover:text-teal-400 transition-colors uppercase">Müfredat</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link to={`/dersler?cat=${categoryId}`} className="hover:text-teal-400 transition-colors uppercase">{category?.title}</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-teal-400 uppercase">{course.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white md:text-slate-900 leading-tight">{course.title}</h1>
              <div className="aspect-video relative rounded-[2rem] overflow-hidden shadow-2xl bg-slate-900">
                <img src={course.image} className="w-full h-full object-cover opacity-80" alt={course.title} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
                    <PlayCircle className="w-10 h-10 fill-white/20" />
                  </div>
                </div>
              </div>
              <p className="text-lg text-slate-400 md:text-slate-600 leading-relaxed">{course.description}</p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 md:border-slate-100 pb-6">
                <h2 className="text-2xl font-bold text-white md:text-slate-900">Eğitim İçeriği</h2>
                <Badge variant="outline" className="text-slate-500 border-slate-700">{course.units.length} Ünite</Badge>
              </div>
              <Accordion type="single" collapsible className="space-y-4">
                {course.units.map((unit, idx) => (
                  <AccordionItem key={unit.id} value={unit.id} className="border-none bg-white md:bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm">
                    <AccordionTrigger className="px-6 py-6 hover:no-underline group">
                      <div className="flex flex-col items-start text-left gap-1">
                        <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Ünite {idx + 1}</span>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{unit.title}</h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-slate-600">
                      <p className="mb-6 text-sm leading-relaxed">{unit.description}</p>
                      <Button asChild className="w-full bg-slate-900 hover:bg-teal-600 text-white rounded-xl h-12 border-none">
                        <Link to={`/dersler/${categoryId}/${course.id}/${unit.id}`}>Eğitime Başla</Link>
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 relative overflow-hidden shadow-2xl">
              <div className="relative z-10 space-y-8 text-center md:text-left">
                <h4 className="text-2xl font-bold text-white">Tam Erişim</h4>
                <ul className="space-y-4 text-sm text-slate-400 font-medium">
                  {["Teknik Dokümantasyon", "Konu Sonu Quizleri", "Uzman Desteği"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500" /> {item}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl border-none shadow-lg">
                  <Link to={`/dersler/${categoryId}/${courseId}/${firstUnitId}`}>Hemen Katıl</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </RootLayout>
  );
}
