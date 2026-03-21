import React, { useMemo, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, CheckCircle2, ArrowRight, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useUserStore, getUserTitle } from '@/store/use-user-store';

export function PortalPage() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  // 500ms bekleyerek Zustand'ın localStorage'dan rehydrate etmesine izin ver
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // isReady true olduktan SONRA auth kontrolü yap
  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) navigate('/');
  }, [isReady, isAuthenticated, navigate]);

  const stats = useMemo(() => {
    if (!user) return [];
    return [
      {
        label: 'Tamamlanan Ünite',
        value: user.completedUnits.length,
        icon: CheckCircle2,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
      },
      {
        label: 'Akademik Puan (XP)',
        value: user.points,
        icon: TrendingUp,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
      },
      {
        label: 'Materyal Erişimi',
        value: user.accessedResources.length,
        icon: FileText,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
      },
    ];
  }, [user]);

  // Rehydrate bekleniyor veya kullanıcı yok
  if (!isReady || !user) {
    return (
      <div className="bg-background min-h-screen p-8 md:p-12 space-y-8">
        <Skeleton className="h-20 w-1/3 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-64 lg:col-span-2 rounded-[2rem]" />
          <div className="space-y-4">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const points = user.points;
  const currentTitle = getUserTitle(points);
  const nextThreshold = points < 500 ? 500 : points < 1500 ? 1500 : 3000;
  const levelProgress = Math.min((points / nextThreshold) * 100, 100);

  return (
    <div className="bg-background min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-teal-500 mb-2"
            >
              <Award className="w-5 h-5" />
              <span className="font-black text-[10px] uppercase tracking-[0.3em]">{currentTitle}</span>
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight leading-tight">
              BCT Akademi Portalı 👋
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Hoş geldin <span className="text-foreground font-bold">{user.username}</span>. Akademik yolculuğun burada şekilleniyor.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full md:w-auto h-12 border-border bg-background text-foreground hover:bg-muted rounded-xl font-bold transition-all"
            asChild
          >
            <Link to="/sertifikalar">Sertifikalarımı Görüntüle</Link>
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-card border-border text-foreground rounded-[2.5rem] overflow-hidden shadow-2xl relative group transition-colors">
            <CardHeader className="p-8 md:p-10">
              <Badge className="bg-teal-500 hover:bg-teal-500 text-white w-fit mb-4 px-4 py-1 border-none font-bold">
                Mevcut Seviye
              </Badge>
              <CardTitle className="text-3xl md:text-5xl font-display font-bold leading-tight text-foreground">
                {currentTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 md:p-10 pt-0 space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Akademik İlerleme</span>
                  <span className="text-teal-500">%{Math.round(levelProgress)} Tamamlandı</span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden p-1 border border-border">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1.5, ease: 'circOut' }}
                    className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full"
                  />
                </div>
                <p className="text-xs text-muted-foreground font-medium italic">
                  * Bir sonraki unvan için {(nextThreshold - points).toLocaleString()} XP daha kazanmalısınız.
                </p>
              </div>
              <Button
                asChild
                className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white h-16 px-10 rounded-2xl font-black text-lg border-none shadow-xl shadow-orange-500/20 transition-transform hover:scale-105 active:scale-95"
              >
                <Link to="/dersler" className="flex items-center gap-2">
                  EĞİTİME DEVAM ET <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  className={`shadow-xl bg-card rounded-3xl p-6 border ${stat.border} hover:bg-muted/30 transition-all group`}
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}
                    >
                      <stat.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-black text-foreground leading-none">
                        {stat.value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            <div className="bg-muted/30 border border-border rounded-3xl p-6 mt-2 transition-colors">
              <p className="text-[11px] text-muted-foreground leading-relaxed text-center font-medium">
                💡 <span className="text-foreground/80">İpucu:</span> Ünite sonlarındaki quizleri çözerek +15 XP
                ekstra puan kazanabilirsin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
