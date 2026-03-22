import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChevronLeft, CheckCircle, Menu as MenuIcon,
  Clock, BookOpen, Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/use-user-store';
import { useCurriculum, useUnitTopics } from '@/hooks/use-curriculum';
import { toast } from 'sonner';

const TopicList = memo(({
  topics, activeTopicIndex, setActiveTopicIndex, isMobile = false, setIsMobileMenuOpen
}: {
  topics: any[];
  activeTopicIndex: number;
  setActiveTopicIndex: (idx: number) => void;
  isMobile?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}) => (
  <div className={cn("space-y-1", isMobile ? "px-2 py-4" : "p-4")}>
    {topics.map((topic, idx) => (
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
            : "bg-transparent border-transparent hover:bg-foreground/5"
        )}
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center transition-all text-xs font-black shrink-0",
            activeTopicIndex === idx
              ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20"
              : "bg-muted text-muted-foreground group-hover:bg-muted/80"
          )}>
            {idx + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-[13px] font-bold leading-tight transition-colors",
              activeTopicIndex === idx ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
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
  const [unitCompleted, setUnitCompleted]       = useState(false);
  const [scrollProgress, setScrollProgress]     = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackedSessionVideos = useRef<Set<string>>(new Set());

  const { data: curriculum_data, loading: currLoading } = useCurriculum();
  const { topics, loading: topicsLoading }              = useUnitTopics(unitId);

  const completeUnit    = useUserStore(s => s.completeUnit);
  const trackVideo      = useUserStore(s => s.trackVideo);
  const isAuthenticated = useUserStore(s => s.isAuthenticated);
  const user            = useUserStore(s => s.user);

  const category = curriculum_data.find(c => c.id === categoryId);
  const course   = category?.courses.find(c => c.id === courseId);
  const unitMeta = course?.units.find(u => u.id === unitId);

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
    window.scrollTo(0, 0);
  }, [unitId]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
      setScrollProgress(0);
    }
  }, [activeTopicIndex]);

  const currentTopic = topics[activeTopicIndex];

  useEffect(() => {
    if (
      currentTopic?.videoYoutubeId &&
      isAuthenticated &&
      !trackedSessionVideos.current.has(currentTopic.videoYoutubeId)
    ) {
      trackVideo(currentTopic.videoYoutubeId);
      trackedSessionVideos.current.add(currentTopic.videoYoutubeId);
      if (user?.email) {
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            entity_type: 'video',
            entity_id: currentTopic.videoYoutubeId,
          }),
        }).catch(() => {});
      }
    }
  }, [currentTopic?.id, currentTopic?.videoYoutubeId, isAuthenticated, trackVideo, user?.email]);

  const loading = currLoading || topicsLoading;

  if (loading) {
    return (
      <div className="flex flex-1 h-[calc(100vh-80px)] bg-background p-8 gap-6">
        <Skeleton className="w-72 h-full rounded-3xl hidden md:block" />
        <div className="flex-1 space-y-6">
          <Skeleton className="h-12 w-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-[2.5rem]" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!unitMeta || topics.length === 0) {
    return (
      <div className="p-20 text-center text-foreground font-bold bg-background min-h-screen transition-colors">
        İçerik bulunamadı.{' '}
        <Link to="/dersler" className="text-teal-500 hover:underline">Derslere Dön</Link>
      </div>
    );
  }

  const handleComplete = () => {
    if (activeTopicIndex === topics.length - 1) {
      completeUnit(unitMeta.id);
      if (user?.email) {
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, entity_type: 'unit', entity_id: unitMeta.id }),
        }).catch(() => {});
      }
      setUnitCompleted(true);
      toast.success('Ünite Tamamlandı!', {
        description: '+100 XP kazandınız.',
        icon: <Trophy className="text-teal-500 w-4 h-4" />,
      });
    } else {
      setActiveTopicIndex(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] overflow-hidden relative bg-background transition-colors duration-300">

      {/* SIDEBAR */}
      <div className="hidden md:flex w-80 flex-col border-r border-border bg-card/50 backdrop-blur-xl">
        <div className="p-6 border-b border-border bg-muted/30">
          <Link
            to={`/dersler/${categoryId}/${courseId}`}
            className="flex items-center text-[10px] font-bold text-teal-500 hover:text-teal-400 transition-colors uppercase mb-3 tracking-widest"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" /> {course?.title}
          </Link>
          <h3 className="font-bold text-foreground line-clamp-2 leading-tight tracking-tight">{unitMeta.title}</h3>
        </div>
        <ScrollArea className="flex-1">
          <TopicList topics={topics} activeTopicIndex={activeTopicIndex} setActiveTopicIndex={setActiveTopicIndex} />
        </ScrollArea>
      </div>

      {/* ANA İÇERİK */}
      <div className="flex-1 flex flex-col bg-background overflow-hidden relative">
        <header className="px-4 md:px-8 py-4 border-b border-border flex items-center justify-between bg-background/80 backdrop-blur-md z-30 sticky top-0">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:bg-foreground/10">
                  <MenuIcon className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0 bg-background border-border">
                <SheetHeader className="p-6 border-b border-border text-left bg-muted/30">
                  <Link
                    to={`/dersler/${categoryId}/${courseId}`}
                    className="flex items-center text-[10px] font-bold text-teal-500 uppercase mb-2 tracking-widest"
                  >
                    <ChevronLeft className="w-3 h-3 mr-1" /> Geri Dön
                  </Link>
                  <SheetTitle className="text-foreground text-lg font-bold leading-tight">{unitMeta.title}</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-120px)]">
                  <TopicList
                    topics={topics}
                    activeTopicIndex={activeTopicIndex}
                    setActiveTopicIndex={setActiveTopicIndex}
                    isMobile
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                  />
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <h2 className="text-sm md:text-base font-bold text-foreground truncate max-w-[140px] sm:max-w-md tracking-tight">
              {currentTopic?.title}
            </h2>
          </div>

          <Button
            size="sm"
            onClick={handleComplete}
            className="bg-teal-500 hover:bg-teal-600 text-white font-black px-5 md:px-8 rounded-xl h-10 border-none transition-all active:scale-95 shadow-lg shadow-teal-500/20"
          >
            {activeTopicIndex === topics.length - 1 ? 'ÜNİTEYİ BİTİR' : 'SONRAKİ KONU'}
          </Button>

          <div
            className="absolute bottom-0 left-0 h-[3px] bg-teal-500 transition-all duration-300 z-40"
            style={{ width: `${scrollProgress}%` }}
          />
        </header>

        {/* Sayfa içeriği */}
        <div
          className="flex-1 overflow-y-auto scroll-smooth no-scrollbar"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-24 space-y-10">

            {/* Meta bilgi */}
            <div className="flex items-center gap-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-border pb-5">
              <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> ~{unitMeta.estimatedReadingTime}</span>
              <span className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> KONU {activeTopicIndex + 1}/{topics.length}</span>
            </div>

            {/* ── YENİ SARMALAYAN LAYOUT (Grid kaldırıldı, Float eklendi) ── */}
            <div className="block overflow-hidden w-full"> 
              {currentTopic?.videoYoutubeId && (
                <div className="w-full lg:w-[55%] lg:float-left lg:mr-10 lg:mb-6">
                  <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-border">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${currentTopic.videoYoutubeId}?rel=0&modestbranding=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mb-6">
                  {currentTopic?.title}
                </h1>
                <div className="whitespace-pre-wrap font-sans text-foreground/80 text-lg leading-relaxed">
                  {currentTopic?.content}
                </div>
              </div>
              
              {/* Float'ı temizlemek için */}
              <div className="clear-both"></div>
            </div>

            {/* Ek Materyal */}
            {currentTopic?.attachment_url && (
              <div className="space-y-3 pt-10 border-t border-border/50">
                <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  <span>📎 Ek Materyal</span>
                </div>
                {/\.(pdf)$/i.test(currentTopic.attachment_url) ? (
                  <div className="rounded-2xl overflow-hidden border border-border shadow-xl">
                    <iframe
                      src={currentTopic.attachment_url}
                      className="w-full"
                      style={{ height: '800px' }}
                      title="Ek Materyal — PDF"
                    />
                  </div>
                ) : /\.(ppt|pptx)$/i.test(currentTopic.attachment_url) ? (
                  <div className="rounded-2xl overflow-hidden border border-border shadow-xl">
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(currentTopic.attachment_url)}&embedded=true`}
                      className="w-full"
                      style={{ height: '800px' }}
                      title="Ek Materyal — Sunum"
                    />
                  </div>
                ) : (
                  <a
                    href={currentTopic.attachment_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-5 bg-muted/40 border border-border rounded-2xl hover:bg-muted/70 transition-all group"
                  >
                    <div className="w-10 h-10 bg-teal-500/10 text-teal-500 rounded-xl flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm group-hover:text-teal-500 transition-colors">
                        Ek Materyali İndir / Görüntüle
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">
                        {currentTopic.attachment_url.split('/').pop()}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            )}

            {/* Quiz */}
            {currentTopic?.quiz && currentTopic.quiz.length > 0 && (
              <div id="quiz-section" className="pt-10 border-t border-border">
                <QuizSection
                  key={currentTopic.id}
                  quiz={currentTopic.quiz}
                  isAuthenticated={isAuthenticated}
                  topicId={currentTopic.id}
                  userEmail={user?.email}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {unitCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex items-center justify-center p-6 text-center"
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-md space-y-8">
              <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(20,184,166,0.3)]">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight">Harika İş Çıkardın!</h2>
                <p className="text-muted-foreground text-lg">"{unitMeta.title}" ünitesini başarıyla tamamladın.</p>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <Button asChild className="bg-teal-500 hover:bg-teal-600 text-white font-black rounded-2xl h-14 border-none shadow-xl transition-all active:scale-95">
                  <Link to="/dersler">DİĞER MODÜLLERE GÖZ AT</Link>
                </Button>
                <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-2xl h-12">
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

function QuizSection({
  quiz, isAuthenticated, topicId, userEmail,
}: {
  quiz: any[];
  isAuthenticated: boolean;
  topicId: string;
  userEmail?: string;
}) {
  const [currentQIndex, setCurrentQIndex]   = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted]        = useState(false);
  const [score, setScore]                    = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const addPoints = useUserStore(s => s.addPoints);
  const currentQ  = quiz[currentQIndex];

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (selectedOption === currentQ.correctAnswer) {
      setScore(prev => prev + 1);
      if (isAuthenticated) {
        addPoints(15);
        if (userEmail) {
          fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: userEmail,
              entity_type: 'quiz',
              entity_id: `${topicId}-q${currentQIndex}`,
            }),
          }).catch(() => {});
        }
      }
      toast.success('+15 XP!', { icon: <Trophy className="w-4 h-4 text-orange-500" /> });
    }
  };

  const handleNext = () => {
    if (currentQIndex < quiz.length - 1) {
      setSelectedOption(null);
      setIsSubmitted(false);
      setCurrentQIndex(prev => prev + 1);
    } else {
      setIsQuizFinished(true);
    }
  };

  if (isQuizFinished) {
    return (
      <div className="bg-card backdrop-blur-xl p-10 rounded-[2.5rem] text-center border border-border shadow-2xl transition-colors">
        <Trophy className="w-16 h-16 text-teal-500 mx-auto mb-6" />
        <h4 className="text-2xl font-bold text-foreground mb-2">Bilgi Kontrolü Tamamlandı!</h4>
        <p className="text-muted-foreground mb-8">
          Başarı Oranı: <span className="text-foreground font-bold">{score} / {quiz.length}</span>
        </p>
        <Button
          onClick={() => setIsQuizFinished(false)}
          className="bg-primary text-primary-foreground hover:opacity-90 rounded-2xl px-10 h-14 font-black text-xs uppercase tracking-widest border-none"
        >
          SONUCU GÖZDEN GEÇİR
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card/50 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-12 border border-border shadow-2xl transition-colors">
      <div className="space-y-10">
        <div className="space-y-4">
          <span className="px-3 py-1 bg-teal-500/10 text-teal-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-teal-500/20">
            Soru {currentQIndex + 1}
          </span>
          <h4 className="text-xl md:text-2xl font-bold text-foreground leading-snug tracking-tight transition-colors">
            {currentQ.question}
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {currentQ.options.map((opt: string, i: number) => (
            <button
              key={i}
              disabled={isSubmitted}
              onClick={() => setSelectedOption(i)}
              className={cn(
                'p-5 rounded-2xl text-left font-bold border transition-all duration-300 text-base shadow-sm',
                selectedOption === i
                  ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-500/20'
                  : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted',
                isSubmitted && i === currentQ.correctAnswer && 'bg-emerald-500 border-emerald-500 text-white',
                isSubmitted && selectedOption === i && i !== currentQ.correctAnswer && 'bg-rose-500 border-rose-500 text-white',
              )}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-black/10 dark:bg-black/20 flex items-center justify-center text-xs font-black">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </div>
            </button>
          ))}
        </div>

        <div className="pt-4">
          {!isSubmitted ? (
            <Button
              disabled={selectedOption === null}
              onClick={handleSubmit}
              className="w-full h-16 bg-foreground text-background hover:opacity-90 rounded-2xl border-none font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95"
            >
              KONTROL ET
            </Button>
          ) : (
            <div className="space-y-6">
              <div className={cn(
                'p-6 rounded-2xl text-sm font-medium leading-relaxed border transition-colors',
                selectedOption === currentQ.correctAnswer
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
              )}>
                <p className="font-black mb-2 uppercase tracking-widest">
                  {selectedOption === currentQ.correctAnswer ? 'Doğru!' : 'Hatalı'}
                </p>
                {currentQ.explanation}
              </div>
              <Button
                onClick={handleNext}
                className="w-full h-16 bg-muted text-foreground hover:bg-muted/80 rounded-2xl font-black text-sm uppercase tracking-[0.2em] border-none shadow-xl transition-all"
              >
                {currentQIndex < quiz.length - 1 ? 'SIRADAKİ SORU' : 'QUIZI BİTİR'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
