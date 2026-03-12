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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady && !isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate, isReady]);

  const stats = useMemo(() => {
    if (!user) return [];
    return [
      { 
        label: 'Tamamlanan Ünite', 
        value: user.completedUnits.length, 
        icon: CheckCircle2, 
        color: 'text-emerald-400', 
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20'
      },
      { 
        label: 'Akademik Puan (XP)', 
        value: user.points, 
        icon: TrendingUp, 
        color: 'text-orange-400', 
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20'
      },
      { 
        label: 'Materyal Erişimi', 
        value: user.accessedResources.length, 
        icon: FileText, 
        color: 'text-blue-400', 
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20'
      }
    ];
  }, [user]);

  if (!isReady || !user) {
    return (
      <div className="bg-[#0a0e1a] min-h-screen p-8 md:p-12 space-y-8">
        <Skeleton className="h-20 w-1/3 rounded-2xl bg-white/5" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-64 lg:col-span-2 rounded-[2rem] bg-white/5" />
          <div className="space-y-4">
            <Skeleton className="h-24 rounded-2xl bg-white/5" />
            <Skeleton className="h-24 rounded-2xl bg-white/5" />
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
    <div className="bg-[#0a0e1a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* ÜST BAŞLIK ALANI */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-teal-400 mb-2"
            >
              <Award className="w-5 h-5" />
              <span className="font-black text-[10px] uppercase tracking-[0.3em]">{currentTitle}</span>
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight">
              BCT Akademi Portalı 👋
            </h1>
            <p className="text-slate-400 text-lg font-medium">
              Hoş geldin <span className="text-white font-bold">{user.username}</span>. Akademik yolculuğun burada şekilleniyor.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full md:w-auto h-12 border-slate-800 bg-white/5 text-white hover:bg-white/10 rounded-xl font-bold transition-all"
            asChild
          >
            <Link to="/sertifikalar">Sertifikalarımı Görüntüle</Link>
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* İLERLEME KARTI */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 text-white rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
            <CardHeader className="p-8 md:p-10">
              <Badge className="bg-teal-500 hover:bg-teal-500 text-white w-fit mb-4 px-4 py-1 border-none font-bold">
                Mevcut Seviye
              </Badge>
              <CardTitle className="text-3xl md:text-5xl font-display font-bold leading-tight">
                {currentTitle}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8 md:p-10 pt-0 space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest opacity-60">
                   <span>Akademik İlerleme</span>
                   <span className="text-teal-400">%{Math.round(levelProgress)} Tamamlandı</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden p-1 border border-white/5">
                   <motion.div 
                     initial={{ width: 0 }} 
                     animate={{ width: `${levelProgress}%` }} 
                     transition={{ duration: 1.5, ease: "circOut" }}
                     className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.4)]" 
                   />
                </div>
                <p className="text-xs text-slate-500 font-medium italic">
                  * Bir sonraki unvan için {(nextThreshold - points).toLocaleString()} XP daha kazanmalısınız.
                </p>
              </div>
              
              <Button asChild className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white h-16 px-10 rounded-2xl font-black text-lg border-none shadow-xl shadow-orange-950/40 transition-transform hover:scale-105 active:scale-95">
                <Link to="/dersler" className="flex items-center gap-2">
                  EĞİTİME DEVAM ET <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </CardContent>

            {/* Dekoratif Arka Plan Işığı */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
          </Card>

          {/* İSTATİSTİK KARTLARI */}
          <div className="grid grid-cols-1 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`border-none shadow-xl bg-slate-900/40 backdrop-blur-md rounded-3xl p-6 border ${stat.border} hover:bg-slate-900/60 transition-all group`}>
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner transition-transform group-hover:scale-110`}>
                      <stat.icon className="w-7 h-7" />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">
                         {stat.label}
                       </p>
                       <p className="text-2xl font-black text-white leading-none">
                         {stat.value.toLocaleString()}
                       </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
            
            {/* HIZLI İPUCU KARTI */}
            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 mt-2">
               <p className="text-[11px] text-slate-400 leading-relaxed text-center font-medium">
                 💡 <span className="text-slate-300">İpucu:</span> Ünite sonlarındaki quizleri çözerek +15 XP ekstra puan kazanabilirsin.
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
