import React, { useMemo, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, CheckCircle2, ArrowRight, TrendingUp, Award, Lock, Activity, Star } from 'lucide-react';
import { curriculum } from '@/lib/curriculum';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useUserStore, getUserTitle } from '@/store/use-user-store';
export function PortalPage() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (isReady && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, isReady]);
  const stats = useMemo(() => {
    if (!user) return [];
    return [
      { label: 'Tamamlanan Ünite', value: user.completedUnits.length.toString(), icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
      { label: 'Akademik Puan (XP)', value: user.points.toString(), icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
      { label: 'Materyal Erişimi', value: user.accessedResources.length.toString(), icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' }
    ];
  }, [user]);
  const recommendations = useMemo(() => {
    if (!user) return [];
    const allCourses = curriculum.flatMap(c => c.courses);
    const completedUnits = user.completedUnits;
    // Logic: Find courses that have some progress but are not finished, or belong to categories user is interested in
    return allCourses
      .map(course => ({
        ...course,
        completedCount: course.units.filter(u => completedUnits.includes(u.id)).length
      }))
      .filter(c => c.completedCount < c.units.length)
      .sort((a, b) => b.completedCount - a.completedCount)
      .slice(0, 3);
  }, [user]);
  // Derived activity data based on user progress to make mock feel alive
  const activityData = useMemo(() => {
    if (!user) return [];
    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const baseProgress = user.completedUnits.length;
    return days.map((day, idx) => ({
      day,
      hours: (idx === 5 || idx === 6) ? baseProgress * 0.8 : (baseProgress % (idx + 1)) * 1.2
    }));
  }, [user]);
  const hasNewCert = useMemo(() => {
    if (!user) return false;
    const completedUnits = user.completedUnits;
    const allCourses = curriculum.flatMap(cat => cat.courses);
    return allCourses.some(course => course.units.every(unit => completedUnits.includes(unit.id)));
  }, [user]);
  if (!isReady || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64 rounded-[2.5rem]" />
          <Skeleton className="h-6 w-96 rounded-[2.5rem]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-[400px] lg:col-span-2 rounded-[2.5rem]" />
          <div className="space-y-6">
            <Skeleton className="h-24 rounded-[2rem]" />
            <Skeleton className="h-24 rounded-[2rem]" />
            <Skeleton className="h-24 rounded-[2rem]" />
          </div>
        </div>
      </div>
    );
  }
  const points = user.points;
  const currentTitle = getUserTitle(points);
  const nextTitleThresholds = [500, 1500, 3000, 10000];
  const nextThreshold = nextTitleThresholds.find(t => t > points) || 10000;
  const prevThreshold = [...nextTitleThresholds].reverse().find(t => t <= points) || 0;
  const range = nextThreshold - prevThreshold;
  const progressInRange = points - prevThreshold;
  const levelProgress = Math.min(Math.max((progressInRange / range) * 100, 0), 100);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col gap-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-teal-600 mb-2">
              <Award className="w-6 h-6" />
              <span className="font-bold uppercase tracking-[0.2em] text-xs">{currentTitle}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tighter">BCTAkademi Portalı 👋</h1>
            <p className="text-slate-500 text-lg font-medium">Hoş geldin {user.username}. Akademik ilerlemen anlık olarak güncelleniyor.</p>
          </div>
          <div className="flex gap-3 relative">
             <Button variant="outline" className="rounded-xl h-12 font-bold border-slate-200 shadow-sm" asChild>
               <Link to="/sertifikalar">
                 Sertifikalarım
                 {hasNewCert && (
                   <span className="absolute -top-1 -right-1 flex h-4 w-4">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-500"></span>
                   </span>
                 )}
               </Link>
             </Button>
          </div>
        </header>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-slate-950 text-white overflow-hidden border-none shadow-2xl relative group rounded-[2.5rem]">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp className="w-48 h-48" />
            </div>
            <CardHeader className="relative z-10 p-10 pb-6">
              <div className="flex items-center gap-3 mb-6">
                 <Badge className="bg-teal-500 hover:bg-teal-500 px-5 py-1.5 border-none text-sm font-bold">Unvan İlerlemesi</Badge>
                 <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Sonraki Kademe: {nextThreshold} XP</span>
              </div>
              <CardTitle className="text-3xl md:text-5xl font-display leading-tight">{currentTitle}</CardTitle>
              <CardDescription className="text-slate-400 text-lg max-w-md mt-4">
                Kariyer yolculuğunda yeni yetkinlikler kazanmak için teknik modülleri tamamlamaya devam et.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-10 p-10 pt-0">
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold tracking-widest uppercase opacity-80">
                  <span>Akademik Yolculuk</span>
                  <span className="text-teal-400">%{Math.round(levelProgress)} Tamamlandı</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                   <motion.div
                    key={user.points}
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-teal-500 via-teal-400 to-teal-300 relative shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                   />
                </div>
              </div>
              <Link to="/dersler" className="inline-block">
                <Button className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white h-16 px-12 rounded-2xl font-bold text-lg transition-transform hover:scale-105 shadow-xl shadow-orange-500/20 border-none">
                  Eğitime Devam Et <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-slate-100 shadow-sm hover:shadow-lg hover:translate-x-1 transition-all flex-1 rounded-[2rem]">
                <CardContent className="p-8 flex items-center gap-6 h-full">
                  <div className={`p-5 rounded-2xl ${stat.bg} ${stat.color} shadow-sm`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-bold text-slate-900 leading-none">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <Card className="lg:col-span-2 rounded-[2.5rem] border-slate-100 relative shadow-sm overflow-hidden bg-white min-h-[400px]">
            <CardHeader className="p-8 pb-0">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-teal-500" />
                <CardTitle className="text-xl font-bold">Haftalık Aktivite (Saat/Gün)</CardTitle>
              </div>
              <CardDescription>BCTAkademi üzerindeki çalışma yoğunluğun.</CardDescription>
            </CardHeader>
            <CardContent className="h-72 p-8 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', zIndex: 10 }}
                  />
                  <Bar dataKey="hours" radius={[8, 8, 0, 0]} barSize={45}>
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.hours > 2 ? '#14b8a6' : '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Star className="w-6 h-6 text-orange-500 fill-orange-500" /> Kariyer Önerileri
            </h3>
            <div className="space-y-4">
              {recommendations.length > 0 ? recommendations.map(rec => {
                const category = curriculum.find(cat => cat.courses.some(c => c.id === rec.id));
                return (
                  <Link key={rec.id} to={`/dersler/${category?.id}/${rec.id}`} className="block group">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex gap-5 p-5 rounded-[1.5rem] border border-slate-100 bg-white hover:border-teal-200 hover:bg-teal-50/20 transition-all shadow-sm"
                    >
                      <img src={rec.image} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shrink-0 shadow-sm" alt="" />
                      <div className="flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-teal-600 mb-1 uppercase tracking-widest">
                          {rec.completedCount > 0 ? 'Devam Et' : 'Yeni Başla'}
                        </p>
                        <h4 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1 text-base md:text-lg">{rec.title}</h4>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1 w-20 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500" style={{ width: `${(rec.completedCount / rec.units.length) * 100}%` }} />
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">%{Math.round((rec.completedCount / rec.units.length) * 100)}</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              }) : (
                <div className="p-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6 text-teal-600" />
                  </div>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed">Tebrikler! Mevcut tüm uzmanlık modüllerini başarıyla tamamladın.</p>
                </div>
              )}
              <Button variant="ghost" className="w-full rounded-2xl h-14 text-slate-500 font-bold group hover:bg-slate-50" asChild>
                <Link to="/dersler">Tüm Kataloğu Keşfet <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}