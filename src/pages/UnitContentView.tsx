import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { grades } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, PlayCircle, FileText, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
export function UnitContentView() {
  const { gradeId, courseId, unitId } = useParams();
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const grade = grades.find(g => g.id === gradeId);
  const course = grade?.courses.find(c => c.id === courseId);
  const unit = course?.units.find(u => u.id === unitId);
  if (!unit) return <div className="p-20 text-center text-slate-500">İçerik bulunamadı.</div>;
  const currentTopic = unit.topics[activeTopicIndex];
  return (
    <RootLayout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Sidebar Topics */}
        <div className="hidden md:flex w-80 flex-col border-r bg-slate-50">
          <div className="p-6 border-b bg-white">
            <Link to={`/dersler/${gradeId}/${courseId}`} className="flex items-center text-xs font-bold text-slate-400 hover:text-teal-600 transition-colors uppercase mb-4">
              <ChevronLeft className="w-4 h-4" /> Derse Dön
            </Link>
            <h3 className="font-bold text-slate-900 line-clamp-2">{unit.title}</h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {unit.topics.map((topic, idx) => (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopicIndex(idx)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl transition-all border group",
                    activeTopicIndex === idx
                      ? "bg-white border-teal-200 shadow-sm"
                      : "bg-transparent border-transparent hover:bg-white/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                      activeTopicIndex === idx ? "bg-teal-500 text-white" : "bg-slate-200 text-slate-500"
                    )}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        "text-sm font-semibold",
                        activeTopicIndex === idx ? "text-teal-900" : "text-slate-700"
                      )}>{topic.title}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <header className="px-8 py-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="md:hidden">
                  <Link to={`/dersler/${gradeId}/${courseId}`}><ChevronLeft className="w-6 h-6" /></Link>
               </div>
               <h2 className="text-lg font-bold text-slate-900 truncate">{currentTopic.title}</h2>
            </div>
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <CheckCircle className="w-4 h-4 mr-2" /> Tamamlandı
            </Button>
          </header>
          <ScrollArea className="flex-1">
            <div className="max-w-4xl mx-auto px-8 py-12 space-y-12">
              <div className="aspect-video bg-slate-900 rounded-3xl flex items-center justify-center relative group overflow-hidden shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" alt="Video cover" />
                 <PlayCircle className="w-20 h-20 text-white relative z-10 group-hover:scale-110 transition-transform cursor-pointer" />
                 <div className="absolute bottom-6 left-6 z-10">
                    <Badge className="bg-orange-500 text-white">Video Dersi</Badge>
                 </div>
              </div>
              <div className="prose prose-slate max-w-none">
                <h1 className="text-3xl font-display font-bold text-slate-900">{currentTopic.title}</h1>
                <div className="text-slate-600 text-lg leading-relaxed mt-4">
                  {currentTopic.content}. Bu bölüm, biyomedikal cihazların temel prensiplerini ve çalışma mekanizmalarını derinlemesine incelemektedir.
                  Teknik detaylar, devre şemaları ve uygulama alanları bu ünitenin temelini oluşturur.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                   <div className="p-6 bg-slate-50 rounded-2xl border">
                      <FileText className="w-8 h-8 text-teal-500 mb-4" />
                      <h4 className="font-bold mb-2">Ders Notları</h4>
                      <p className="text-sm text-slate-500 mb-4">Bu konuyla ilgili teknik PDF dokümanını indirin.</p>
                      <Button variant="outline" className="w-full">İndir (PDF)</Button>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-2xl border">
                      <PlayCircle className="w-8 h-8 text-orange-500 mb-4" />
                      <h4 className="font-bold mb-2">Uygulama Videosu</h4>
                      <p className="text-sm text-slate-500 mb-4">Laboratuvar ortamında cihazın çalıştırılması.</p>
                      <Button variant="outline" className="w-full">İzle</Button>
                   </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          <footer className="px-8 py-6 border-t bg-slate-50 flex items-center justify-between">
            <Button
              variant="ghost"
              disabled={activeTopicIndex === 0}
              onClick={() => setActiveTopicIndex(prev => prev - 1)}
            >
              <ChevronLeft className="mr-2 w-4 h-4" /> Önceki Konu
            </Button>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Konu {activeTopicIndex + 1} / {unit.topics.length}
            </div>
            <Button
              className="bg-slate-900 text-white"
              disabled={activeTopicIndex === unit.topics.length - 1}
              onClick={() => setActiveTopicIndex(prev => prev + 1)}
            >
              Sonraki Konu <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </footer>
        </div>
      </div>
    </RootLayout>
  );
}