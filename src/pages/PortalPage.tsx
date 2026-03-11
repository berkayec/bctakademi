import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, CheckCircle2, ArrowRight, TrendingUp, Award, Lock } from 'lucide-react';
import { curriculum } from '@/lib/curriculum';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useUserStore, getUserTitle } from '@/store/use-user-store';
export function PortalPage() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  const stats = useMemo(() => {
    if (!user) return [];
    return [
      { label: 'Modüller', value: user.completedUnits.length.toString(), icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
      { label: 'Akademik Puan', value: user.points.toString(), icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
      { label: 'Materyaller', value: user.accessedResources.length.toString(), icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' }
    ];
  }, [user]);
  const recommendations = useMemo(() => {
    if (!user) return [];
    const allCourses = curriculum.flatMap(c => c.courses);
    return allCourses
      .filter(c => !user.completedUnits.some(unitId => c.units.some(u => u.id === unitId)))
      .slice(0, 2);
  }, [user]);
  if (!user) return null;
  const currentTitle = getUserTitle(user.points);
  const nextTitleThresholds = [500, 1500, 3000, 10000];
  const nextThreshold = nextTitleThresholds.find(t => t > user.points) || 10000;
  const levelProgress = Math.min(Math.max((user.points / nextThreshold) * 100, 0), 100);
  const activityData = [
    { day: 'Pzt', hours: 2.5 },
    { day: 'Sal', hours: 1.8 },
    { day: 'Çar', hours: 3.2 },
    { day: 'Per', hours: 0.5 },
    { day: 'Cum', hours: 2.1 },
    { day: 'Cmt', hours: 4.0 },
    { day: 'Paz', hours: 1.2 },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col gap-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-teal-600 mb-2">
              <Award className="w-6 h-6" />
              <span className="font-bold uppercase tracking-[0.2em] text-xs">{currentTitle}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tighter">BCTAkademi Portalı 👋</h1>
            <p className="text-slate-500 text-lg font-medium">Hoş geldin {user.username}. Akademik gelişimin burada yönetiliyor.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-xl h-12 font-bold border-slate-200 shadow-sm" asChild>
               <Link to="/sertifikalar">Başarı Belgelerim</Link>
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
              <CardTitle className="text-4xl md:text-5xl font-display leading-tight">{currentTitle}</CardTitle>
              <CardDescription className="text-slate-400 text-lg max-w-md mt-4">
                Yeni yetkinlikler kazanmak için teknik modülleri tamamlamaya devam et.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-10 p-10 pt-0">
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold tracking-widest uppercase opacity-80">
                  <span>Kariyer Yolculuğu</span>
                  <span className="text-teal-400">%{Math.round(levelProgress)} Tamamlandı</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                   <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
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
              <Card key={stat.label} className="border-slate-100 shadow-sm hover:shadow-lg hover:translate-x-1 transition-all flex-1 rounded-3xl">
                <CardContent className="p-8 flex items-center gap-6 h-full">
                  <div className={`p-5 rounded-2xl ${stat.bg} ${stat.color} shadow-sm`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 leading-none">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <Card className="lg:col-span-2 rounded-[2.5rem] border-slate-100 relative shadow-sm overflow-hidden bg-white">
            {user.points < 300 && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[4px] z-20 flex flex-col items-center justify-center rounded-3xl p-10 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-2">Performans Analizi Kilidi</h4>
                <p className="text-slate-500 text-lg max-w-xs leading-relaxed">Haftalık çalışma grafiğini açmak için en az 300 XP puanına ulaşmalısın.</p>
              </div>
            )}
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-xl font-bold">Haftalık Aktivite (Saat/Gün)</CardTitle>
              <CardDescription>BCTAkademi üzerindeki çalışma yoğunluğun.</CardDescription>
            </CardHeader>
            <CardContent className="h-72 p-8 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="hours" radius={[8, 8, 0, 0]} barSize={45}>
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.hours > 3 ? '#14b8a6' : '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Senin İçin Önerilenler</h3>
            <div className="space-y-4">
              {recommendations.length > 0 ? recommendations.map(rec => (
                <Link key={rec.id} to="/dersler" className="block group">
                  <div className="flex gap-5 p-5 rounded-[1.5rem] border border-slate-100 bg-white hover:border-teal-200 hover:bg-teal-50/20 transition-all shadow-sm">
                    <img src={rec.image} className="w-24 h-24 rounded-2xl object-cover shrink-0 shadow-sm" alt="" />
                    <div className="flex flex-col justify-center">
                      <p className="text-[10px] font-bold text-teal-600 mb-1 uppercase tracking-widest">Önerilen Ders</p>
                      <h4 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1 text-lg">{rec.title}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-[10px] font-bold border-slate-200">{rec.estimatedTime}</Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-500 font-medium">Harika! Tüm dersleri tamamladın.</p>
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