import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { grades, QuizQuestion } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, PlayCircle, FileText, CheckCircle, HelpCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
export function UnitContentView() {
  const { gradeId, courseId, unitId } = useParams();
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [unitCompleted, setUnitCompleted] = useState(false);
  const grade = grades.find(g => g.id === gradeId);
  const course = grade?.courses.find(c => c.id === courseId);
  const unit = course?.units.find(u => u.id === unitId);
  if (!unit) return <div className="p-20 text-center text-slate-500">İçerik bulunamadı.</div>;
  const currentTopic = unit.topics[activeTopicIndex];
  const handleComplete = () => {
    if (activeTopicIndex === unit.topics.length - 1) {
      setUnitCompleted(true);
    } else {
      setActiveTopicIndex(prev => prev + 1);
    }
  };
  return (
    <RootLayout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden relative">
        <AnimatePresence>
          {unitCompleted && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 text-center"
            >
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-md space-y-6">
                <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto shadow-teal-500/50 shadow-2xl">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white">Tebrikler!</h2>
                <p className="text-slate-400 text-lg">"{unit.title}" ünitesini başarıyla tamamladınız. Öğrenmeye devam etmek ister misiniz?</p>
                <div className="flex gap-4 justify-center">
                  <Button asChild variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
                    <Link to={`/dersler/${gradeId}/${courseId}`}>Ünite Listesine Dön</Link>
                  </Button>
                  <Button asChild className="bg-teal-500 hover:bg-teal-600">
                    <Link to="/dersler">Ders Kataloğu</Link>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <header className="px-8 py-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="md:hidden">
                  <Link to={`/dersler/${gradeId}/${courseId}`}><ChevronLeft className="w-6 h-6" /></Link>
               </div>
               <h2 className="text-lg font-bold text-slate-900 truncate">{currentTopic.title}</h2>
            </div>
            <Button size="sm" onClick={handleComplete} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <CheckCircle className="w-4 h-4 mr-2" /> {activeTopicIndex === unit.topics.length - 1 ? 'Üniteyi Bitir' : 'Sonraki Konu'}
            </Button>
          </header>
          <ScrollArea className="flex-1">
            <div className="max-w-4xl mx-auto px-8 py-12 space-y-12">
              <div className="aspect-video bg-slate-900 rounded-3xl flex items-center justify-center relative group overflow-hidden shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" alt="Video cover" />
                 <PlayCircle className="w-20 h-20 text-white relative z-10 group-hover:scale-110 transition-transform cursor-pointer" />
              </div>
              <div className="prose prose-slate max-w-none">
                <h1 className="text-3xl font-display font-bold text-slate-900">{currentTopic.title}</h1>
                <div className="text-slate-600 text-lg leading-relaxed mt-4">
                  {currentTopic.content}
                </div>
              </div>
              {currentTopic.quiz && (
                <div className="pt-12 border-t">
                  <QuizSection quiz={currentTopic.quiz} />
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </RootLayout>
  );
}
function QuizSection({ quiz }: { quiz: QuizQuestion[] }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const currentQ = quiz[currentQIndex];
  const isCorrect = selectedOption === currentQ.correctAnswer;
  const handleSubmit = () => {
    setIsSubmitted(true);
    if (isCorrect) setScore(prev => prev + 1);
  };
  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setCurrentQIndex(prev => prev + 1);
  };
  return (
    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
      <div className="flex items-center gap-2 text-teal-600 mb-6">
        <HelpCircle className="w-5 h-5" />
        <span className="font-bold uppercase tracking-widest text-xs">Kendini Test Et</span>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400">Soru {currentQIndex + 1} / {quiz.length}</p>
          <h4 className="text-xl font-bold text-slate-900">{currentQ.question}</h4>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              disabled={isSubmitted}
              onClick={() => setSelectedOption(i)}
              className={cn(
                "p-4 rounded-xl text-left font-medium transition-all border",
                selectedOption === i 
                  ? "bg-teal-50 border-teal-500 text-teal-900" 
                  : "bg-white border-slate-200 hover:border-slate-300",
                isSubmitted && i === currentQ.correctAnswer && "bg-emerald-50 border-emerald-500 text-emerald-900",
                isSubmitted && selectedOption === i && i !== currentQ.correctAnswer && "bg-rose-50 border-rose-500 text-rose-900"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
        <AnimatePresence>
          {isSubmitted && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn(
              "p-4 rounded-xl flex items-start gap-3",
              isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
            )}>
              {isCorrect ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <div>
                <p className="font-bold">{isCorrect ? 'Harika! Doğru cevap.' : 'Maalesef yanlış.'}</p>
                <p className="text-sm opacity-90">{currentQ.explanation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!isSubmitted ? (
          <Button disabled={selectedOption === null} onClick={handleSubmit} className="w-full h-12 bg-slate-900 rounded-xl">Cevabı Kontrol Et</Button>
        ) : (
          currentQIndex < quiz.length - 1 ? (
            <Button onClick={handleNext} className="w-full h-12 bg-teal-500 rounded-xl">Sonraki Soru</Button>
          ) : (
            <div className="text-center p-4 bg-white rounded-xl border border-dashed border-slate-200">
              <p className="text-sm font-bold text-slate-500">Testi bitirdiniz!</p>
              <p className="text-2xl font-bold text-teal-600">Skor: {score + (isCorrect ? 0 : 0)} / {quiz.length}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}