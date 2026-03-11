import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { curriculum, QuizQuestion } from '@/lib/curriculum';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle, 
  FileText, 
  CheckCircle, 
  HelpCircle, 
  AlertCircle, 
  Award,
  Download,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
export function UnitContentView() {
  const { categoryId, courseId, unitId } = useParams();
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [unitCompleted, setUnitCompleted] = useState(false);
  const category = curriculum.find(c => c.id === categoryId);
  const course = category?.courses.find(c => c.id === courseId);
  const unit = course?.units.find(u => u.id === unitId);
  useEffect(() => {
    setActiveTopicIndex(0);
    setUnitCompleted(false);
  }, [unitId]);
  if (!unit || !course) return <div className="p-20 text-center text-slate-500">İçerik bulunamadı.</div>;
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
      <div className="flex h-[calc(100vh-80px)] overflow-hidden relative bg-slate-50/50">
        <AnimatePresence>
          {unitCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 text-center"
            >
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-md space-y-6">
                <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto shadow-teal-500/50 shadow-2xl">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white">Tebrikler!</h2>
                <p className="text-slate-400 text-lg">"{unit.title}" ünitesini başarıyla tamamladınız.</p>
                <div className="flex gap-4 justify-center">
                  <Button asChild variant="outline" className="border-slate-700 text-white hover:bg-slate-800 rounded-xl">
                    <Link to={`/dersler/${categoryId}/${courseId}`}>Geri Dön</Link>
                  </Button>
                  <Button asChild className="bg-teal-500 hover:bg-teal-600 rounded-xl">
                    <Link to="/dersler">Sonraki Ders</Link>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Sidebar */}
        <div className="hidden md:flex w-80 flex-col border-r bg-white/40 backdrop-blur-xl border-slate-200">
          <div className="p-6 border-b bg-white/60">
            <Link to={`/dersler/${categoryId}/${courseId}`} className="flex items-center text-xs font-bold text-slate-400 hover:text-teal-600 transition-colors uppercase mb-4">
              <ChevronLeft className="w-4 h-4 mr-1" /> Müfredata Dön
            </Link>
            <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight">{unit.title}</h3>
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
                      "w-8 h-8 rounded-full flex items-center justify-center transition-colors text-xs font-bold",
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
          <header className="px-8 py-4 border-b flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
               <h2 className="text-lg font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">{currentTopic.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button size="sm" onClick={handleComplete} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 rounded-xl h-10 shadow-lg shadow-emerald-500/20">
                {activeTopicIndex === unit.topics.length - 1 ? 'Üniteyi Bitir' : 'Sonraki Konu'}
              </Button>
            </div>
          </header>
          <ScrollArea className="flex-1">
            <div className="max-w-4xl mx-auto px-8 py-12 space-y-12">
              {currentTopic.videoYoutubeId && (
                <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative group">
                  <iframe
                    className="w-full h-full border-none"
                    src={`https://www.youtube.com/embed/${currentTopic.videoYoutubeId}`}
                    title={currentTopic.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <article className="prose prose-slate max-w-none">
                <h1 className="text-4xl font-display font-bold text-slate-900 leading-tight mb-8">
                  {currentTopic.title}
                </h1>
                <div className="text-slate-600 text-lg leading-[1.8] font-sans whitespace-pre-wrap">
                  {currentTopic.content}
                </div>
              </article>
              {currentTopic.attachments && currentTopic.attachments.length > 0 && (
                <section className="pt-8 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Ekler & Kaynaklar</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentTopic.attachments.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors group">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-teal-600" />
                          <span className="text-sm font-semibold text-slate-700">{file.title}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="group-hover:text-teal-600">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {currentTopic.quiz && (
                <div className="pt-12 border-t">
                  <QuizSection key={currentTopic.id} quiz={currentTopic.quiz} />
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
    <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 border border-slate-200">
      <div className="flex items-center gap-2 text-teal-600 mb-8">
        <HelpCircle className="w-6 h-6" />
        <span className="font-bold uppercase tracking-widest text-sm">Kendini Test Et</span>
      </div>
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-bold text-slate-400">Soru {currentQIndex + 1} / {quiz.length}</p>
          <h4 className="text-2xl font-bold text-slate-900 leading-tight">{currentQ.question}</h4>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              disabled={isSubmitted}
              onClick={() => setSelectedOption(i)}
              className={cn(
                "p-5 rounded-2xl text-left font-medium transition-all border outline-none text-lg",
                selectedOption === i
                  ? "bg-teal-50 border-teal-500 text-teal-900 shadow-md"
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
              "p-6 rounded-2xl flex items-start gap-4 shadow-sm",
              isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
            )}>
              {isCorrect ? <CheckCircle className="w-6 h-6 shrink-0 mt-0.5" /> : <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />}
              <div>
                <p className="font-bold text-lg">{isCorrect ? 'Tebrikler!' : 'Yanlış Cevap'}</p>
                <p className="text-base opacity-90 leading-relaxed mt-2">{currentQ.explanation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!isSubmitted ? (
          <Button disabled={selectedOption === null} onClick={handleSubmit} className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-lg transition-transform active:scale-95 shadow-xl">Cevabı Kontrol Et</Button>
        ) : (
          currentQIndex < quiz.length - 1 ? (
            <Button onClick={handleNext} className="w-full h-14 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-2xl text-lg shadow-xl shadow-teal-500/20">Sonraki Soru <ChevronRight className="ml-2 w-5 h-5" /></Button>
          ) : (
            <div className="text-center p-8 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
              <div className="flex flex-col items-center gap-4">
                <Award className="w-12 h-12 text-teal-600" />
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Test Tamamlandı</p>
                  <p className="text-4xl font-display font-bold text-teal-600 mt-1">Skor: {score} / {quiz.length}</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}