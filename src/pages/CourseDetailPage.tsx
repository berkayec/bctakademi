import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { curriculum } from '@/lib/curriculum';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; 
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronRight, PlayCircle, BookOpen, ArrowRight, Award } from 'lucide-react';

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
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <BookOpen className="w-10 h-10 text-slate-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Kurs içeriği bulunamadı.</h2>
        <Button asChild className="bg-orange-500 hover:bg-orange-600 border-none px-8 h-12 rounded-xl font-bold transition-all active:scale-95">
          <Link to="/dersler">Derslere Dön</Link>
        </Button>
      </div>
    );
  }

  const firstUnitId = course.units?.[0]?.id;

  return (
    <div className="bg-[#0a0e1a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        
        {/* BREADCRUMB - MOBİLDE KAYDIRILABİLİR */}
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
          
          {/* SOL TARAF: ANA İÇERİK */}
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
              <h1 className="text-3xl md:text-6xl font-display font-bold text-white leading-tight tracking-tight">
                {course.title}
              </h1>
              
              {/* KURS GÖRSELİ / VIDEO KAPAĞI */}
              <div className="aspect-video relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 group">
                <img 
                  src={course.image} 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                  alt={course.title} 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-2xl">
                    <PlayCircle className="w-10 h-10 md:w-12 md:h-12 fill-white/10" />
                  </div>
                </div>
              </div>
              
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl">
                {course.description}
              </p>
            </section>

            {/* ÜNİTE LİSTESİ */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                <h2 className="text-2xl font-bold text-white">Eğitim İçeriği</h2>
                <Badge variant="outline" className="text-teal-400 border-teal-500/20 bg-teal-500/5 px-4 py-1">
                  {course.units?.length || 0} Ünite
                </Badge>
              </div>
              
              <Accordion type="single" collapsible className="space-y-4">
                {course.units?.map((unit, idx) => (
                  <AccordionItem 
                    key={unit.id} 
                    value={unit.id} 
                    className="border-none bg-slate-900/40 backdrop-blur-md rounded-3xl overflow-hidden border border-white/5 hover:bg-slate-900/60 transition-all shadow-sm"
                  >
                    <AccordionTrigger className="px-6 py-7 hover:no-underline text-left group">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest">
                          Modül {idx + 1}
                        </span>
                        <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                          {unit.title}
                        </h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-slate-400">
                      <div className="h-px bg-white/5 mb-6" />
                      <p className="mb-6 text-base leading-relaxed">{unit.description}</p>
                      <Button asChild className="w-full bg-teal-600 hover:bg-teal-500 text-white rounded-2xl h-14 border-none font-bold shadow-lg shadow-teal-900/20 transition-all">
                        <Link to={`/dersler/${categoryId}/${course.id}/${unit.id}`} className="flex items-center justify-center gap-2">
                          Eğitime Başla <ArrowRight className="w-5 h-5" />
                        </Link>
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>

          {/* SAĞ TARAF: BİLGİ PANELİ */}
          <aside className="lg:sticky lg:top-28 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-8">
                <div className="space-y-2">
                   <h4 className="text-2xl font-bold text-white tracking-tight">Kurs Paneli</h4>
                   <p className="text-slate-400 text-sm leading-relaxed">Bu eğitim modülünü tamamlayarak uzmanlık sertifikası ve XP kazanabilirsiniz.</p>
                </div>
                
                <ul className="space-y-5">
                  {[
                    { text: "Başarı Sertifikası", icon: Award },
                    { text: "Teknik Dokümantasyon", icon: BookOpen },
                    { text: "Uygulamalı Quizler", icon: ArrowRight }
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300 font-semibold">
                      <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                      {item.text}
                    </li>
                  ))}
                </ul>

                {firstUnitId && (
                  <Button asChild className="w-full h-16 bg-orange-500 hover:bg-orange-600 text-white font-black text-lg rounded-2xl border-none shadow-xl shadow-orange-950/40 active:scale-95 transition-all">
                    <Link to={`/dersler/${categoryId}/${courseId}/${firstUnitId}`}>
                      HEMEN BAŞLA
                    </Link>
                  </Button>
                )}
              </div>
              {/* Dekoratif Işık */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
            </div>

            {/* DESTEK KARTI */}
            <div className="bg-slate-900/30 border border-slate-800/50 p-6 rounded-[2rem] text-center">
              <p className="text-xs text-slate-500 leading-relaxed">
                Eğitim içeriğiyle ilgili bir sorunuz mu var? <br />
                <Link to="/iletisim" className="text-teal-500 font-bold hover:underline underline-offset-4">Akademik Destek</Link>
              </p>
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
}
