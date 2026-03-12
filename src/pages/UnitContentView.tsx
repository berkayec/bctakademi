import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { curriculum, QuizQuestion, Unit } from '@/lib/curriculum';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  ChevronLeft,
  CheckCircle,
  Menu as MenuIcon,
  Clock,
  BookOpen,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/use-user-store';
import { toast } from 'sonner';

interface TopicListProps {
  unit: Unit;
  activeTopicIndex: number;
  setActiveTopicIndex: (idx: number) => void;
  isMobile?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

const TopicList = memo(({ unit, activeTopicIndex, setActiveTopicIndex, isMobile = false, setIsMobileMenuOpen }: TopicListProps) => (
  <div className={cn("space-y-1", isMobile ? "px-2 py-4" : "p-4")}>
    {unit.topics.map((topic, idx) => (
      <button
        key={topic.id}
        onClick={() => {
          setActiveTopicIndex(idx);
          if (isMobile && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
        }}
        className={cn(
          "w-full text-left p-4 rounded-2xl transition-all border group relative",
          activeTopicIndex === idx
            ? "bg-teal-500/10 border-teal-500/50 shadow-sm ring-1 ring-teal-500/20"
            : "bg-transparent border-transparent hover:bg-white/5"
        )}
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center transition-all text-xs font-black shrink-0",
            activeTopicIndex === idx ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20" : "bg-slate-800 text-slate-500 group-hover:bg-slate-700"
          )}>
            {idx + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-[13px] font-bold leading-tight transition-colors",
              activeTopicIndex === idx ? "text-white" : "text-slate-400 group-hover:text-slate-200"
            )}>{topic.title}</p>
          </div>
        </div>
      </button>
    ))}
  </div>
));
TopicList.displayName = 'TopicList';

export function UnitContentView() {
  const { categoryId, courseId, unitId } = useParams();
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [unitCompleted, setUnitCompleted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasCompletedCurrentQuiz, setHasCompletedCurrentQuiz] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackedSessionVideos = useRef<Set<string>>(new Set());

  const category = curriculum.find(c => c.id === categoryId);
  const course = category?.courses.find(c => c.id === courseId);
  const unit = course?.units.find(u => u.id === unitId);
  
  const completeUnit = useUserStore(s => s.completeUnit);
  const trackVideo = useUserStore(s => s.trackVideo);
  const isAuthenticated = useUserStore(s => s.isAuthenticated);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(isNaN(progress) ? 0 : Math.min(progress, 100));
    }
  }, []);

  useEffect(() => {
    setActiveTopicIndex(0);
    setUnitCompleted(false);
    setScrollProgress(0);
    setHasCompletedCurrentQuiz(false);
    window.scrollTo(0, 0);
  }, [unitId]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
      setScrollProgress(0);
      setHasCompletedCurrentQuiz(false);
    }
  }, [activeTopicIndex]);

  const currentTopic = unit?.topics[activeTopicIndex];

  useEffect(() => {
    if (currentTopic?.videoYoutubeId && isAuthenticated && !trackedSessionVideos.current.has(currentTopic.videoYoutubeId)) {
      trackVideo(currentTopic.videoYoutubeId);
      trackedSessionVideos.current.add(currentTopic.videoYoutubeId);
    }
  }, [currentTopic?.id, currentTopic?.videoYoutubeId, isAuthenticated, trackVideo]);

  if (!unit || !course) return <div className="p-20 text-center text-white font-bold bg-[#0a0e1a] min-h-screen">İçerik bulunamadı.</div>;

  const handleComplete = () => {
    if (activeTopicIndex === unit.topics.length - 1) {
      completeUnit(unit.id);
      setUnitCompleted(true);
      toast.success("Ünite Tamamlandı!", { 
        description: "+100 XP kazandınız.",
        icon: <Trophy className="text-teal-500 w-4 h-4" />
      });
    } else {
      setActiveTopicIndex(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] overflow-hidden relative bg-[#0a0e1a]">
      
      {/* SIDEBAR (DESKTOP) */}
      <div className="hidden md:flex w-80 flex-col border-r border-white/5 bg-white/5 backdrop-blur-xl">
        <div className="p-6 border-b border-white/5 bg-black/20">
          <Link to={`/dersler/${categoryId}/${courseId}`} className="flex items-center text-[10px] font-bold text-teal-400 hover:text-teal-300 transition-colors uppercase mb-3 tracking-widest">
            <ChevronLeft className="w-3.5 h-3.5 mr-1" /> {course.title}
          </Link>
          <h3 className="font-bold text-white line-clamp-2 leading-tight tracking-tight">{unit.title}</h3>
        </div>
        <ScrollArea className="flex-1">
          <TopicList unit={unit} activeTopicIndex={activeTopicIndex} setActiveTopicIndex={setActiveTopicIndex} />
        </ScrollArea>
      </div>

      {/* ANA İÇERİK ALANI */}
      <div className="flex-1 flex flex-col bg-[#0a0e1a] overflow-hidden relative">
        <header className="px-4 md:px-8 py-4 border-b border-white/5 flex items-center justify-between bg-[#0a0e1a]/80 backdrop-blur-md z-30 sticky top-0">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
                  <MenuIcon className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0 bg-slate-950 border-white/10">
                <SheetHeader className="p-6 border-b border-white/5 text-left bg-black/20">
                  <Link to={`/dersler/${categoryId}/${courseId}`} className="flex items-center text-[10px] font-bold text-teal-400 uppercase mb-2 tracking-widest">
                    <ChevronLeft className="w-3 h-3 mr-1" /> Geri Dön
                  </Link>
                  <SheetTitle className="text-white text-lg font-bold leading-tight">{unit.title}</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-120px)]">
                  <TopicList unit={unit} activeTopicIndex={activeTopicIndex} setActiveTopicIndex={setActiveTopicIndex} isMobile setIsMobileMenuOpen={setIsMobileMenuOpen} />
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <h2 className="text-sm md:text-base font-bold text-white truncate max-w-[140px] sm:max-w-md tracking-tight">
              {currentTopic?.title}
            </h2>
          </div>
          
          <Button size="sm" onClick={handleComplete} className="bg-teal-500 hover:bg-teal-600 text-white font-black px-5 md:px-8 rounded-xl h-10 border-none transition-all active:scale-95 shadow-lg shadow-teal-900/20">
             {activeTopicIndex === unit.topics.length - 1 ? 'ÜNİTEYİ BİTİR' : 'SONRAKİ KONU'}
          </Button>
          
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 h-[3px] bg-teal-500 transition-all duration-300 z-40" style={{ width: `${scrollProgress}%` }} />
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth no-scrollbar" ref={scrollContainerRef} onScroll={handleScroll}>
          <div className="max-w-4xl mx-auto px-6 md:px-12 pt-8 pb-24 space-y-12">
            
            {/* Meta Bilgileri */}
            <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 pb-6">
               <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> ~{unit.estimatedReadingTime}</span>
               <span className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> KONU {activeTopicIndex + 1}/{unit.topics.length}</span>
            </div>

            {/* Video Alanı */}
            {currentTopic?.videoYoutubeId && (
              <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 ring-1 ring-white/5">
                <iframe 
                  className="w-full h-full" 
                  src={`https://www.youtube.com/embed/${currentTopic.videoYoutubeId}`} 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen 
                />
              </div>
            )}

            {/* İçerik Metni */}
            <article className="prose prose-invert max-w-none prose-h1:font-display prose-h1:tracking-tight prose-p:text-slate-300 prose-p:leading-[1.8] prose-p:text-lg">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-10">
                {currentTopic?.title}
              </h1>
              <div className="whitespace-pre-wrap font-sans">
                {currentTopic?.content}
              </div>
            </article>
            
            {/* Quiz Bölümü */}
            {currentTopic?.quiz && currentTopic.quiz.length > 0 && (
              <div id="quiz-section" className="pt-16 border-t border-white/5">
                 <QuizSection 
                   key={currentTopic.id} 
                   quiz={currentTopic.quiz} 
                   isAuthenticated={isAuthenticated} 
                   onSuccess={() => setHasCompletedCurrentQuiz(true)} 
                 />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ÜNİTE TAMAMLANDI OVERLAY */}
      <AnimatePresence>
        {unitCompleted && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6 text-center"
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-md space-y-8">
              <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(20,184,166,0.3)]">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">Harika İş Çıkardın!</h2>
                <p className="text-slate-400 text-lg">"{unit.title}" ünitesini başarıyla tamamlayarak uzmanlık yolunda büyük bir adım attın.</p>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <Button asChild className="bg-teal-500 hover:bg-teal-600 text-white font-black rounded-2xl h-14 border-none shadow-xl transition-all active:scale-95">
                  <Link to="/dersler">DİĞER MODÜLLERE GÖZ AT</Link>
                </Button>
                <Button asChild variant="ghost" className="text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl h-12">
                  <Link to={`/dersler/${categoryId}/${courseId}`}>Kurs Sayfasına Dön</Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuizSection({ quiz, isAuthenticated, onSuccess }: { quiz: QuizQuestion[], isAuthenticated: boolean, onSuccess: () => void }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const addPoints = useUserStore(s => s.addPoints);
  const currentQ = quiz[currentQIndex];

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (selectedOption === currentQ.correctAnswer) {
      setScore(prev => prev + 1);
      if (isAuthenticated) addPoints(15);
      toast.success("+15 XP!", { icon: <Trophy className="w-4 h-4 text-orange-500" /> });
    }
  };

  const handleNext = () => {
    if (currentQIndex < quiz.length - 1) {
      setSelectedOption(null);
      setIsSubmitted(false);
      setCurrentQIndex(prev => prev + 1);
    } else {
      setIsQuizFinished(true);
      onSuccess();
    }
  };

  if (isQuizFinished) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-xl p-10 rounded-[2.5rem] text-center border border-white/5 shadow-2xl">
        <Trophy className="w-16 h-16 text-teal-500 mx-auto mb-6" />
        <h4 className="text-2xl font-bold text-white mb-2">Bilgi Kontrolü Tamamlandı!</h4>
        <p className="text-slate-400 mb-8">Başarı Oranı: <span className="text-white font-bold">{score} / {quiz.length}</span></p>
        <Button onClick={() => setIsQuizFinished(false)} className="bg-white text-slate-950 hover:bg-slate-200 rounded-2xl px-10 h-14 font-black text-xs uppercase tracking-widest border-none">SONUCU GÖZDEN GEÇİR</Button>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-12 border border-white/5 shadow-2xl">
      <div className="space-y-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
             <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-teal-500/20">Soru {currentQIndex + 1}</span>
          </div>
          <h4 className="text-xl md:text-2xl font-bold text-white leading-snug tracking-tight">{currentQ.question}</h4>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              disabled={isSubmitted}
              onClick={() => setSelectedOption(i)}
              className={cn(
                "p-5 rounded-2xl text-left font-bold border transition-all duration-300 text-base shadow-sm",
                selectedOption === i 
                  ? "bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-500/20" 
                  : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10",
                isSubmitted && i === currentQ.correctAnswer && "bg-emerald-500 border-emerald-500 text-white",
                isSubmitted && selectedOption === i && i !== currentQ.correctAnswer && "bg-rose-500 border-rose-500 text-white"
              )}
            >
              <div className="flex items-center gap-4">
                 <span className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center text-xs font-black">{String.fromCharCode(65 + i)}</span>
                 {opt}
              </div>
            </button>
          ))}
        </div>
        
        <div className="pt-4">
          {!isSubmitted ? (
            <Button disabled={selectedOption === null} onClick={handleSubmit} className="w-full h-16 bg-white text-slate-950 hover:bg-slate-200 rounded-2xl border-none font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95">KONTROL ET</Button>
          ) : (
            <div className="space-y-6">
              <div className={cn("p-6 rounded-2xl text-sm font-medium leading-relaxed border", selectedOption === currentQ.correctAnswer ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400")}>
                <p className="font-black mb-2 uppercase tracking-widest">{selectedOption === currentQ.correctAnswer ? "Doğru!" : "Hatalı"}</p>
                {currentQ.explanation}
              </div>
              <Button onClick={handleNext} className="w-full h-16 bg-slate-800 text-white hover:bg-slate-700 rounded-2xl font-black text-sm uppercase tracking-[0.2em] border-none shadow-xl transition-all">
                {currentQIndex < quiz.length - 1 ? 'SIRADAKİ SORU' : 'QUIZI BİTİR'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
