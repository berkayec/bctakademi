import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { curriculum } from '@/lib/curriculum';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; 
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronRight, PlayCircle, BookOpen, ArrowRight } from 'lucide-react';

export function CourseDetailPage() {
  const { categoryId, courseId } = useParams();

  // Veriyi bulma
  const category = curriculum.find(c => c.id === categoryId);
  const course = category?.courses.find(c => c.id === courseId);

  // Sayfa açıldığında en üste kaydır
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // HATA ÖNLEYİCİ: Eğer kurs bulunamazsa sayfayı çökertme, bu mesajı göster.
  if (!course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-[#0a0e1a]">
        <h2 className="text-2xl font-bold text-white mb-4">Kurs içeriği bulunamadı.</h2>
        <Button asChild className="bg-orange-500 hover:bg-orange-600 border-none">
          <Link to="/dersler">Derslere Dön</Link>
        </Button>
      </div>
    );
  }

  const firstUnitId = course.units?.[0]?.id;

  return (
    <div className="bg-[#0a0e1a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Breadcrumb - Mobil Uyumlu Navigasyon */}
        <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar uppercase tracking-widest">
          <Link to="/dersler" className="hover:text-teal-400 transition-colors">Müfredat</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link to={`/dersler?cat=${categoryId}`} className="hover:text-teal-400 transition-colors">
            {category?.title}
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-teal-400">{course.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* SOL TARAF: Ana İçerik */}
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
                {course.title}
              </h1>
              
              {/* Kurs Görseli / Video Placeholder */}
              <div className="aspect-video relative rounded-[2rem] overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 group">
                <img src={course.image} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt={course.title} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-2xl">
                    <PlayCircle className="w-10 h-10 fill-white/10" />
                  </div>
                </div>
              </div>
              
              <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
                {course.description}
              </p>
            </section>

            {/* Ünite Listesi */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                <h2 className="text-2xl font-bold text-white">Eğitim İçeriği</h2>
                <Badge variant="outline" className="text-slate-400 border-slate-700 px-4 py-1">
                  {course.units?.length || 0} Ünite
                </Badge>
              </div>
              
              <Accordion type="single" collapsible className="space-y-4">
                {course.units?.map((unit, idx) => (
                  <AccordionItem 
                    key={unit.id} 
                    value={unit.id} 
                    className="border-none bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 hover:bg-white/10 transition-all shadow-sm"
                  >
                    <AccordionTrigger className="px-6 py-6 hover:no-underline text-left group">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                          Ünite {idx + 1}
                        </span>
                        <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                          {unit.title}
                        </h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-slate-400">
                      <div className="h-px bg-white/5 mb-4" />
                      <p className="mb-6 text-sm leading-relaxed">{unit.description}</p>
                      <Button asChild className="w-full bg-teal-600 hover:bg-teal-500 text-white rounded-xl h-12 border-none font-bold shadow-lg shadow-teal-900/20">
                        <Link to={`/dersler/${categoryId}/${course.id}/${unit.id}`}>
                          Eğitime Başla <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>

          {/* SAĞ TARAF: Bilgi Paneli */}
          <aside className="lg:sticky lg:top-28 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-8">
                <div className="space-y-2">
                   <h4 className="text-2xl font-bold text-white">Kurs Paneli</h4>
                   <p className="text-slate-400 text-sm">Bu modülü tamamlayarak akademik puan kazanabilirsiniz.</p>
                </div>
                
                <ul className="space-y-4">
                  {[
                    { text: "Başarı Sertifikası", icon: Award },
                    { text: "Teknik Dokümantasyon", icon: BookOpen },
                    { text: "Uygulamalı Sınavlar", icon: ArrowRight }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      {item.text}
                    </li>
                  ))}
                </ul>

                {firstUnitId && (
                  <Button asChild className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl border-none shadow-xl shadow-orange-950/20 active:scale-95 transition-all">
                    <Link to={`/dersler/${categoryId}/${courseId}/${firstUnitId}`}>
                      Hemen Başla
                    </Link>
                  </Button>
                )}
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
            </div>

            {/* Ek Bilgi Kartı */}
            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
              <p className="text-xs text-slate-500 leading-relaxed text-center">
                Sorularınız için <Link to="/iletisim" className="text-teal-500 hover:underline">akademik destek</Link> ekibimizle iletişime geçebilirsiniz.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
