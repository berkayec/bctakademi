import React, { useMemo, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, CheckCircle2, ArrowRight, TrendingUp, Award, Star, Activity } from 'lucide-react';
import { curriculum } from '@/lib/curriculum';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useUserStore, getUserTitle } from '@/store/use-user-store';
import { RootLayout } from '@/components/layout/RootLayout';

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
      { label: 'Ünite', value: user.completedUnits.length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
      { label: 'Akademik Puan', value: user.points, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
      { label: 'Materyal', value: user.accessedResources.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' }
    ];
  }, [user]);

  if (!isReady || !user) return <RootLayout><div className="p-12 space-y-8"><Skeleton className="h-20 w-full rounded-2xl" /><Skeleton className="h-64 w-full rounded-2xl" /></div></RootLayout>;

  const points = user.points;
  const currentTitle = getUserTitle(points);
  const nextThreshold = points < 500 ? 500 : points < 1500 ? 1500 : 3000;
  const levelProgress = Math.min((points / nextThreshold) * 100, 100);

  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-teal-400 mb-2">
              <Award className="w-5 h-5" /><span className="font-bold text-[10px] uppercase tracking-widest">{currentTitle}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white md:text-slate-900 leading-tight">BCT Akademi Portalı 👋</h1>
            <p className="text-slate-400 md:text-slate-500 font-medium">Hoş geldin {user.username}. İlerlemen kaydediliyor.</p>
          </div>
          <Button variant="outline" className="w-full md:w-auto h-12 border-slate-700 md:border-slate-200 text-white md:text-slate-900 rounded-xl font-bold" asChild>
            <Link to="/sertifikalar">Sertifikalarım</Link>
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-slate-900 border-slate-800 text-white rounded-[2rem] overflow-hidden shadow-2xl relative">
            <CardHeader className="p-8">
              <Badge className="bg-teal-500 text-white w-fit mb-4">Akademik Seviye</Badge>
              <CardTitle className="text-3xl md:text-4xl font-display leading-tight">{currentTitle}</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                   <span>İlerleme Durumu</span>
                   <span className="text-teal-400">%{Math.round(levelProgress)}</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${levelProgress}%` }} className="h-full bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
                </div>
              </div>
              <Button asChild className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white h-14 px-10 rounded-xl font-bold border-none transition-transform hover:scale-105">
                <Link to="/dersler">Eğitime Devam Et <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {stats.map((stat, i) => (
              <Card key={i} className="border-none shadow-sm bg-white rounded-2xl p-6 flex items-center gap-6">
                <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon className="w-6 h-6" /></div>
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                   <p className="text-xl font-black text-slate-900">{stat.value}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
