import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { grades } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, LayoutList, BookOpen, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
export function CourseDetailPage() {
  const { gradeId, courseId } = useParams();
  const grade = grades.find(g => g.id === gradeId);
  const course = grade?.courses.find(c => c.id === courseId);
  if (!course) return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">Ders bulunamadı.</div>
    </RootLayout>
  );
  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/dersler" className="hover:text-teal-600 transition-colors">Dersler</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium">{grade?.title}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-teal-600 font-bold">{course.title}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight">{course.title}</h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">{course.description}</p>
              <div className="flex flex-wrap gap-4 py-2">
                <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-bold border-none">
                  <LayoutList className="w-4 h-4 mr-2 text-teal-600" /> {course.units.length} Ünite
                </Badge>
                <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-bold border-none">
                  <Clock className="w-4 h-4 mr-2 text-orange-600" /> {course.estimatedTime || '10+ Saat'}
                </Badge>
                <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-bold border-none">
                   <ShieldCheck className="w-4 h-4 mr-2 text-blue-600" /> MEB Uyumlu
                </Badge>
              </div>
            </div>
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-bold text-slate-900">Müfredat İçeriği</h2>
                <span className="text-sm font-bold text-slate-400">{course.units.length} Toplam Bölüm</span>
              </div>
              <div className="space-y-4">
                {course.units.length === 0 ? (
                  <div className="p-16 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-300">
                    <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                    <p className="text-slate-500 font-bold text-lg">Bu ders için henüz ünite eklenmemiş.</p>
                  </div>
                ) : (
                  course.units.map((unit, index) => (
                    <Card key={unit.id} className="border-slate-200 hover:border-teal-300 transition-all group rounded-2xl overflow-hidden hover:shadow-xl bg-white">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 md:p-8">
                        <div className="space-y-2 pr-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-1 rounded-md">Ünite {index + 1}</span>
                            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {unit.estimatedReadingTime || '30 dk'}</span>
                          </div>
                          <CardTitle className="text-xl md:text-2xl group-hover:text-teal-700 transition-colors leading-snug">{unit.title}</CardTitle>
                        </div>
                        <Link to={`/dersler/${gradeId}/${courseId}/${unit.id}`} className="shrink-0">
                          <Button className="bg-slate-900 hover:bg-orange-500 text-white rounded-xl px-6 h-12 font-bold transition-all shadow-md group-hover:shadow-lg active:scale-95">Derse Başla</Button>
                        </Link>
                      </CardHeader>
                      <CardContent className="px-8 pb-8 pt-0">
                        <div className="h-px bg-slate-100 mb-6" />
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
                          {unit.topics.map((topic) => (
                            <li key={topic.id} className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              <span className="truncate">{topic.title}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
          <aside className="lg:sticky lg:top-28 space-y-6">
            <Card className="border-none shadow-2xl bg-slate-950 text-white rounded-[2.5rem] overflow-hidden">
               <div className="p-8 space-y-8">
                  <div className="space-y-4">
                     <p className="text-3xl font-display font-bold">Ücretsiz Erişim</p>
                     <p className="text-slate-400 text-sm leading-relaxed">Milli Eğitim Bakanlığı Biyomedikal Cihaz Teknolojileri öğrencileri için tam erişim aktiftir.</p>
                  </div>
                  <div className="space-y-4">
                     {[
                        "Ömür Boyu Erişim",
                        "Güncel MEB Müfredatı",
                        "Uygulamalı Teknik Videolar",
                        "Dijital Sertifika",
                        "Konu Sonu Testleri"
                     ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-medium">
                           <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-500">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                           </div>
                           {item}
                        </div>
                     ))}
                  </div>
                  <Link to={`/dersler/${gradeId}/${courseId}/${course.units[0]?.id}`} className="block">
                     <Button className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                        Şimdi Başla
                     </Button>
                  </Link>
                  <p className="text-center text-[10px] uppercase font-bold tracking-widest text-slate-500">
                     Geleceğin Sağlık Teknolojilerini Öğrenin
                  </p>
               </div>
            </Card>
            <Card className="rounded-[2rem] border-slate-100 bg-slate-50 shadow-sm">
               <CardContent className="p-8 space-y-4">
                  <h4 className="font-bold text-slate-900 text-lg">Eğitmen Notu</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">Bu ders içeriği alan öğretmenleri tarafından hazırlanmış olup, mesleki gelişim standartlarını %100 karşılamaktadır.</p>
                  <Button variant="link" className="p-0 text-teal-600 font-bold h-auto hover:text-teal-700">Daha Fazla Bilgi</Button>
               </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </RootLayout>
  );
}