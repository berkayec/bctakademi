import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { curriculum, QuizQuestion, Unit } from '@/lib/curriculum';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  ChevronLeft,
  CheckCircle,
  HelpCircle,
  Award,
  Menu as MenuIcon,
  AlertCircle,
  Clock,
  BookOpen,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUserStore, getUserTitle } from '@/store/use-user-store';
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
            ? "bg-teal-500/10 border-teal-500/50 md:bg-teal-50/80 md:border-teal-200 shadow-sm ring-2 ring-teal-500/20"
            : "bg-transparent border-transparent hover:bg-white/5 md:hover:bg-slate-100/50"
        )}
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center transition-all text-xs font-black shrink-0",
            activeTopicIndex === idx ? "bg-teal-500 text-white shadow-lg" : "bg-slate-800 text-slate-500 md:bg-slate-100 md:text-slate-400 group-hover:bg-slate-200"
          )}>
            {idx + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-[13px] font-bold leading-tight",
              activeTopicIndex === idx ? "text-white md:text-teal-900" : "text-slate-400 md:text-slate-600 group-hover:text-white md:group-hover:text-slate-900"
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
  const user = useUserStore(s => s.user);

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

  if (!unit || !course) return <div className="p-20 text-center text-white font-bold">İçerik bulunamadı.</div>;

  const handleComplete = () => {
    if (activeTopicIndex === unit.topics.length - 1) {
      completeUnit(unit.id);
      setUnitCompleted(true);
      toast.success("Ünite Tamamlandı!", { description: "+100 XP kazandınız." });
    } else {
      setActiveTopicIndex(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e1a] md:bg-background overflow-hidden">
      <Navbar />
      <div className="flex flex-1 h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] overflow-hidden relative">
        
        {/* SIDEBAR (DESKTOP) */}
        <div className="hidden md:flex w-80 flex-col border-r bg-white/40 backdrop-blur-xl border-slate-200">
          <div className="p-6 border-b bg-white/60">
            <Link to={`/dersler/${categoryId}/${courseId}`} className="flex items-center text-[10px] font-bold text-teal-600 hover:underline uppercase mb-3 tracking-widest">
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> {course.title}
            </Link>
            <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight">{unit.title}</h3>
          </div>
          <ScrollArea className="flex-1">
            <TopicList unit={unit} activeTopicIndex={activeTopicIndex} setActiveTopicIndex={setActiveTopicIndex} />
          </ScrollArea>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col bg-[#0a0e1a] md:bg-white overflow-hidden relative">
          <header className="px-4 md:px-8 py-4 border-b border-slate-800 md:border-slate-100 flex items-center justify-between bg-[#0a0e1a]/80 md:bg-white/80 backdrop-blur-md z-30 sticky top-0">
            <div className="flex items-center gap-3">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden text-white md:text-slate-600">
                    <MenuIcon className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0 bg-slate-950 md:bg-white border-slate-800 md:border-slate-200">
                  <SheetHeader className="p-6 border-b text-left border-slate-800 md:border-slate-100">
                    <SheetTitle className="text-white md:text-slate-900">{unit.title}</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-100px)]">
                    <TopicList unit={unit} activeTopicIndex={activeTopicIndex} setActiveTopicIndex={setActiveTopicIndex} isMobile setIsMobileMenuOpen={setIsMobileMenuOpen} />
                  </ScrollArea>
                </SheetContent>
              </Sheet>
              <h2 className="text-sm md:text-base font-bold text-white md:text-slate-900 truncate max-w-[140px] sm:max-w-md">
                {currentTopic?.title}
              </h2>
            </div>
            <Button size="sm" onClick={handleComplete} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 md:px-8 rounded-xl h-10 border-none transition-all active:scale-95">
               {activeTopicIndex === unit.topics.length - 1 ? 'Üniteyi Bitir' : 'Sonraki Konu'}
            </Button>
            <div className="absolute bottom-0 left-0 h-[3px] bg-teal-500 transition-all duration-300" style={{ width: `${scrollProgress}%` }} />
          </header>

          <div className="flex-1 overflow-y-auto scroll-smooth" ref={scrollContainerRef} onScroll={handleScroll}>
            <div className="max-w-4xl mx-auto px-6 md:px-8 pt-8 pb-24 space-y-10">
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 md:border-slate-100 pb-4">
                 <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> ~{unit.estimatedReadingTime}</span>
                 <span className="flex items-center gap-1.5"><BookOpen className="w-3 h-3" /> {activeTopicIndex + 1}/{unit.topics.length}</span>
              </div>

              {currentTopic?.videoYoutubeId && (
                <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                  <iframe className="w-full h-full border-none" src={`https://www.youtube.com/embed/${currentTopic.videoYoutubeId}`} allowFullScreen />
                </div>
              )}

              <article className={cn("prose max-w-none", "prose-invert md:prose-slate")}>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-white md:text-slate-900 leading-tight mb-8">
                  {currentTopic?.title}
                </h1>
                <div className="text-slate-300 md:text-slate-700 text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-sans">
                  {currentTopic?.content}
                </div>
              </article>
              
              {currentTopic?.quiz && currentTopic.quiz.length > 0 && (
                <div id="quiz-section" className="pt-12 border-t border-slate-800 md:border-slate-100">
                   <QuizSection key={currentTopic.id} quiz={currentTopic.quiz} isAuthenticated={isAuthenticated} onSuccess={() => setHasCompletedCurrentQuiz(true)} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COMPLETION OVERLAY */}
        <AnimatePresence>
          {unitCompleted && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 text-center">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-md space-y-8">
                <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-teal-500/20">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-bold text-white">Ünite Tamamlandı!</h2>
                  <p className="text-slate-400">"{unit.title}" ünitesini başarıyla bitirdiniz.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button asChild className="bg-teal-500 hover:bg-teal-600 rounded-xl h-12 font-bold border-none"><Link to="/dersler">Diğer Modüllere Göz At</Link></Button>
                  <Button asChild variant="ghost" className="text-slate-400 hover:text-white"><Link to={`/dersler/${categoryId}/${courseId}`}>Kurs Sayfasına Dön</Link></Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ... QuizSection aynı mantıkla devam edecek, mobil buton renkleri kontrol edildi.
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
      <div className="bg-slate-900 md:bg-slate-50 p-10 rounded-3xl text-center border border-slate-800 md:border-slate-200">
        <Trophy className="w-12 h-12 text-teal-500 mx-auto mb-4" />
        <h4 className="text-xl font-bold text-white md:text-slate-900 mb-2">Quiz Tamamlandı!</h4>
        <p className="text-slate-400 mb-6">Başarı Oranı: {score} / {quiz.length}</p>
        <Button onClick={() => setIsQuizFinished(false)} className="bg-teal-500 text-white rounded-xl px-8 h-12 border-none">Sonucu Gözden Geçir</Button>
      </div>
    );
  }

  return (
    <div className="bg-white md:bg-white/50 rounded-[2rem] p-6 md:p-10 border border-slate-200 shadow-sm">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Soru {currentQIndex + 1}</p>
          <h4 className="text-xl font-bold text-slate-900 leading-tight">{currentQ.question}</h4>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              disabled={isSubmitted}
              onClick={() => setSelectedOption(i)}
              className={cn(
                "p-4 rounded-xl text-left font-bold border transition-all",
                selectedOption === i ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-100 text-slate-700",
                isSubmitted && i === currentQ.correctAnswer && "bg-emerald-500 border-emerald-500 text-white",
                isSubmitted && selectedOption === i && i !== currentQ.correctAnswer && "bg-rose-500 border-rose-500 text-white"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
        {!isSubmitted ? (
          <Button disabled={selectedOption === null} onClick={handleSubmit} className="w-full h-12 bg-teal-500 text-white rounded-xl border-none font-bold">Kontrol Et</Button>
        ) : (
          <Button onClick={handleNext} className="w-full h-12 bg-slate-900 text-white rounded-xl border-none font-bold">
            {currentQIndex < quiz.length - 1 ? 'Sıradaki Soru' : 'Bitir'}
          </Button>
        )}
      </div>
    </div>
  );
}
