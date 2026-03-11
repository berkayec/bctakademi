import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, FileText, CheckCircle2, ArrowRight, TrendingUp, BookOpen, Clock, Award, Lock } from 'lucide-react';
import { grades } from '@/lib/data';
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
  if (!user) return null;
  const currentTitle = getUserTitle(user.points);
  const nextTitleThresholds = [500, 1500, 3000, 10000];
  const nextThreshold = nextTitleThresholds.find(t => t > user.points) || 10000;
  const levelProgress = (user.points / nextThreshold) * 100;
  const stats = [
    { label: 'Tamamlanan', value: user.completedUnits.length.toString(), icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'XP Puanı', value: user.points.toString(), icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Kaynaklar', value: user.accessedResources.length.toString(), icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' }
  ];
  const activityData = [
    { day: 'Pzt', hours: 2.5 },
    { day: 'Sal', hours: 1.8 },
    { day: 'Çar', hours: 3.2 },
    { day: 'Per', hours: 0.5 },
    { day: 'Cum', hours: 2.1 },
    { day: 'Cmt', hours: 4.0 },
    { day: 'Paz', hours: 1.2 },
  ];
  const recommendations = grades.flatMap(g => g.courses).filter(c => c.isPopular).slice(0, 2);
  const featuredCourse = grades[0].courses[0];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col gap-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-teal-600 mb-2">
              <Award className="w-5 h-5" />
              <span className="font-bold uppercase tracking-widest text-xs">{currentTitle}</span>
            </div>
            <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Hoş Geldin, {user.username} 👋</h1>
            <p className="text-slate-500 text-lg">Biyomedikal yolculuğunda emin adımlarla ilerliyorsun.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-xl" asChild>
               <Link to="/sertifikalar">Sertifikalarım</Link>
             </Button>
          </div>
        </header>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-slate-950 text-white overflow-hidden border-none shadow-2xl relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp className="w-48 h-48" />
            </div>
            <CardHeader className="relative z-10 p-8">
              <div className="flex items-center gap-2 mb-4">
                 <Badge className="bg-teal-500 hover:bg-teal-500 px-4 py-1 border-none">Ünvan İlerlemesi</Badge>
                 <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Sonraki Hedef: {nextThreshold} XP</span>
              </div>
              <CardTitle className="text-3xl md:text-4xl font-display leading-tight">{currentTitle}</CardTitle>
              <CardDescription className="text-slate-400 text-lg max-w-md mt-4">
                Yeni ünvanlar kazanmak için daha fazla ünite tamamla ve testleri çöz.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-8 p-8 pt-0">
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold tracking-wider uppercase opacity-80">
                  <span>Seviye İlerlemesi</span>
                  <span className="text-teal-400">%{Math.round(levelProgress)}</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                   <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-teal-500 to-teal-300 relative"
                   />
                </div>
              </div>
              <Link to="/dersler" className="block">
                <Button className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white h-14 px-10 rounded-2xl font-bold transition-transform hover:scale-105 shadow-lg shadow-orange-500/20">
                  Dersleri Keşfet <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <div className="space-y-4 flex flex-col justify-between">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-slate-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all flex-1">
                <CardContent className="p-6 flex items-center gap-5">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 rounded-3xl border-slate-100 relative">
            {user.points < 300 && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center rounded-3xl p-6 text-center">
                <Lock className="w-12 h-12 text-slate-400 mb-4" />
                <h4 className="text-xl font-bold text-slate-900 mb-2">Detaylı Analiz Kilidi</h4>
                <p className="text-slate-500 text-sm max-w-xs">Haftalık aktivite analizini görmek için en az 300 XP puanına ulaşmalısın.</p>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl font-bold">Haftalık Aktivite</CardTitle>
              <CardDescription>Öğrenme istatistiklerin burada görünür.</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} dy={10} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="hours" radius={[6, 6, 0, 0]} barSize={40}>
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.hours > 3 ? '#14b8a6' : '#94a3b8'} fillOpacity={0.6} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Sana Özel Öneriler</h3>
            <div className="space-y-4">
              {recommendations.map(rec => (
                <Link key={rec.id} to={`/dersler`} className="block group">
                  <div className="flex gap-4 p-4 rounded-2xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all">
                    <img src={rec.image} className="w-20 h-20 rounded-xl object-cover shrink-0" alt="" />
                    <div className="flex flex-col justify-center">
                      <p className="text-xs font-bold text-teal-600 mb-1">Popüler Ders</p>
                      <h4 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">{rec.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{rec.estimatedTime}</p>
                    </div>
                  </div>
                </Link>
              ))}
              <Button variant="ghost" className="w-full rounded-xl text-slate-500 font-bold group" asChild>
                <Link to="/dersler">Tümünü Keşfet <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}