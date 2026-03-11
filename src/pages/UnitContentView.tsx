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
  AlertCircle
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
  <div className={cn("space-y-2", isMobile ? "px-1" : "p-4")}>
    {unit.topics.map((topic, idx) => (
      <button
        key={topic.id}
        onClick={() => {
          setActiveTopicIndex(idx);
          if (isMobile && setIsMobileMenuOpen) setIsMobileMenuOpen(false);
        }}
        className={cn(
          "w-full text-left p-4 rounded-xl transition-all border group",
          activeTopicIndex === idx
            ? "bg-teal-50/50 border-teal-200 shadow-sm"
            : "bg-transparent border-transparent hover:bg-white/50"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-colors text-xs font-bold shrink-0",
            activeTopicIndex === idx ? "bg-teal-500 text-white" : "bg-slate-200 text-slate-500"
          )}>
            {idx + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-sm font-bold truncate",
              activeTopicIndex === idx ? "text-teal-900" : "text-slate-700"
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
  }, [unitId]);
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
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
  if (!unit || !course) return <div className="p-20 text-center text-slate-500 font-bold">İçerik bulunamadı.</div>;
  const handleComplete = () => {
    if (currentTopic?.quiz && currentTopic.quiz.length > 0 && !hasCompletedCurrentQuiz) {
      toast("Bilgi Kontrolü", {
        description: "Devam etmeden önce konuyu pekiştirmek için aşağıdaki quizi çözmenizi öneririz.",
        icon: <AlertCircle className="text-orange-500 w-4 h-4" />,
        action: {
          label: "Şimdi Çöz",
          onClick: () => {
            const quizEl = document.getElementById('quiz-section');
            quizEl?.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }
    if (activeTopicIndex === unit.topics.length - 1) {
      const currentPoints = useUserStore.getState().user?.points ?? 0;
      const oldTitle = getUserTitle(currentPoints);
      completeUnit(unit.id);
      setUnitCompleted(true);
      if (isAuthenticated) {
        setTimeout(() => {
          const updatedPoints = useUserStore.getState().user?.points ?? 0;
          const newTitle = getUserTitle(updatedPoints);
          if (oldTitle !== newTitle) {
            toast.success("MÜKEMMEL İLERLEME!", {
              description: `Yeni akademik seviyeye ulaştın: ${newTitle}`,
              duration: 6000,
            });
          } else {
            toast.success("Tebrikler!", {
              description: "Üniteyi başarıyla tamamladın. XP puanların eklendi.",
            });
          }
        }, 300);
      }
    } else {
      setActiveTopicIndex(prev => prev + 1);
    }
  };
  const handleQuizSuccess = () => {
    setHasCompletedCurrentQuiz(true);
  };
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 h-[calc(100vh-80px)] overflow-hidden relative bg-slate-50/50">
        <AnimatePresence>
          {unitCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 text-center"
            >
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-md space-y-8">
                <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto shadow-teal-500/50 shadow-2xl">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-display font-bold text-white">Ünite Tamamlandı!</h2>
                  <p className="text-slate-400 text-lg">"{unit.title}" ünitesini başarıyla bitirdiniz. {isAuthenticated && "Akademik hanenize +100 XP eklendi."}</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button asChild variant="outline" className="border-slate-700 text-white hover:bg-slate-800 rounded-xl h-12 px-8">
                    <Link to={`/dersler/${categoryId}/${courseId}`}>Kurs Sayfasına Dön</Link>
                  </Button>
                  <Button asChild className="bg-teal-500 hover:bg-teal-600 rounded-xl border-none h-12 px-8 font-bold">
                    <Link to="/dersler">Diğer Modüller</Link>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="hidden md:flex w-80 flex-col border-r bg-white/40 backdrop-blur-xl border-slate-200">
          <div className="p-6 border-b bg-white/60">
            <Link to={`/dersler/${categoryId}/${courseId}`} className="flex items-center text-[10px] font-bold text-teal-600 hover:underline transition-all uppercase mb-3 tracking-widest">
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> {course.title}
            </Link>
            <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight">{unit.title}</h3>
          </div>
          <ScrollArea className="flex-1">
            <TopicList 
              unit={unit} 
              activeTopicIndex={activeTopicIndex} 
              setActiveTopicIndex={setActiveTopicIndex} 
            />
          </ScrollArea>
        </div>
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
          <header className="px-6 md:px-8 py-4 border-b flex items-center justify-between bg-white/80 backdrop-blur-md z-10 sticky top-0">
            <div className="flex items-center gap-3">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden text-slate-600 hover:bg-slate-50">
                    <MenuIcon className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0 bg-white/95 backdrop-blur-xl border-r">
                  <SheetHeader className="p-6 border-b text-left bg-white/50">
                    <Link to={`/dersler/${categoryId}/${courseId}`} className="flex items-center text-[10px] font-bold text-teal-600 hover:underline transition-all uppercase mb-2 tracking-widest">
                      <ChevronLeft className="w-3.5 h-3.5 mr-1" /> {course.title}
                    </Link>
                    <SheetTitle className="text-lg font-bold text-slate-900">{unit.title}</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-140px)]">
                    <TopicList 
                      unit={unit} 
                      activeTopicIndex={activeTopicIndex} 
                      setActiveTopicIndex={setActiveTopicIndex} 
                      isMobile 
                      setIsMobileMenuOpen={setIsMobileMenuOpen} 
                    />
                  </ScrollArea>
                </SheetContent>
              </Sheet>
              <h2 className="text-sm md:text-base font-bold text-slate-900 truncate max-w-[150px] sm:max-w-md">
                {currentTopic?.title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleComplete} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 md:px-8 rounded-xl h-10 shadow-lg shadow-emerald-500/20 border-none transition-all active:scale-95">
                {activeTopicIndex === unit.topics.length - 1 ? 'Üniteyi Bitir' : 'Sonraki Konu'}
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-teal-500 transition-all duration-300" style={{ width: `${scrollProgress}%` }} />
          </header>
          <div
            className="flex-1 overflow-y-auto scroll-smooth"
            onScroll={handleScroll}
            ref={scrollContainerRef}
          >
            <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-10 pb-20 space-y-12">
              {currentTopic?.videoYoutubeId && (
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
                <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 leading-tight mb-8">
                  {currentTopic?.title}
                </h1>
                <div className="text-slate-600 text-lg md:text-xl leading-relaxed md:leading-[2.2] font-sans whitespace-pre-wrap">
                  {currentTopic?.content}
                </div>
              </article>
              {currentTopic?.quiz && currentTopic.quiz.length > 0 && (
                <div id="quiz-section" className="py-12 border-t border-slate-100">
                  <QuizSection
                    key={currentTopic.id}
                    quiz={currentTopic.quiz}
                    isAuthenticated={isAuthenticated}
                    onSuccess={handleQuizSuccess}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function QuizSection({ quiz, isAuthenticated, onSuccess }: { quiz: QuizQuestion[], isAuthenticated: boolean, onSuccess: () => void }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const addPoints = useUserStore(s => s.addPoints);
  const currentQ = quiz[currentQIndex];
  const isCorrect = selectedOption === currentQ.correctAnswer;
  const handleSubmit = () => {
    setIsSubmitted(true);
    if (isCorrect) {
      setScore(prev => prev + 1);
      if (isAuthenticated) {
        addPoints(15);
        toast.success("+15 XP Kazandın!", {
          icon: <Award className="text-orange-500 w-4 h-4" />
        });
      }
    }
  };
  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setCurrentQIndex(prev => prev + 1);
  };
  useEffect(() => {
    if (isSubmitted && currentQIndex === quiz.length - 1) {
      onSuccess();
    }
  }, [isSubmitted, currentQIndex, quiz.length, onSuccess]);
  return (
    <div className="bg-slate-50 rounded-[2.5rem] p-6 md:p-12 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 text-teal-600 mb-8">
        <div className="p-2 bg-teal-50 rounded-lg">
          <HelpCircle className="w-5 h-5" />
        </div>
        <span className="font-bold uppercase tracking-widest text-xs">Akademik Değerlendirme</span>
      </div>
      <div className="space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Soru {currentQIndex + 1} / {quiz.length}</p>
          <h4 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">{currentQ.question}</h4>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              disabled={isSubmitted}
              onClick={() => setSelectedOption(i)}
              className={cn(
                "p-5 rounded-2xl text-left font-bold transition-all border outline-none text-base md:text-lg shadow-sm",
                selectedOption === i ? "bg-teal-50 border-teal-500 text-teal-900" : "bg-white border-slate-200 hover:border-teal-200",
                isSubmitted && i === currentQ.correctAnswer && "bg-emerald-50 border-emerald-500 text-emerald-900",
                isSubmitted && selectedOption === i && i !== currentQ.correctAnswer && "bg-rose-50 border-rose-500 text-rose-900",
                isSubmitted && "cursor-default"
              )}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs text-slate-500 group-hover:bg-teal-100 transition-colors">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </div>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={cn(
                "p-6 rounded-2xl text-sm font-medium leading-relaxed",
                isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
              )}
            >
              <p className="font-bold mb-1">{isCorrect ? "Doğru!" : "Hatalı Cevap"}</p>
              {currentQ.explanation}
            </motion.div>
          )}
        </AnimatePresence>
        {!isSubmitted ? (
          <Button disabled={selectedOption === null} onClick={handleSubmit} className="w-full h-14 bg-slate-950 text-white rounded-2xl font-bold border-none shadow-xl active:scale-[0.98] transition-all">Cevabı Kontrol Et</Button>
        ) : (
          currentQIndex < quiz.length - 1 ? (
            <Button onClick={handleNext} className="w-full h-14 bg-teal-500 text-white rounded-2xl font-bold border-none shadow-xl active:scale-[0.98] transition-all">Sonraki Soru</Button>
          ) : (
            <Button onClick={onSuccess} className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold border-none shadow-xl active:scale-[0.98] transition-all">Quiz Tamamlandı ({score}/{quiz.length})</Button>
          )
        )}
      </div>
    </div>
  );
}