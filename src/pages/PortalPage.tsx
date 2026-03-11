import React from 'react';
import { Link } from 'react-router-dom';
import { Play, FileText, CheckCircle2, ArrowRight, TrendingUp, BookOpen } from 'lucide-react';
import { grades } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
export function PortalPage() {
  const stats = [
    { label: 'Tamamlanan Konular', value: '12', icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Devam Eden Dersler', value: '3', icon: Play, color: 'text-orange-500' },
    { label: 'Kayıtlı Kaynaklar', value: '8', icon: FileText, color: 'text-blue-500' }
  ];
  const featuredCourse = grades[0].courses[0];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col gap-10">
        <header className="space-y-2">
          <div className="flex items-center gap-3 text-teal-600 mb-2">
            <BookOpen className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-xs">Öğrenci Portalı</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Hoş Geldin, Öğrenci 👋</h1>
          <p className="text-slate-500 text-lg">Kaldığın yerden devam et ve biyomedikal dünyasını keşfet.</p>
        </header>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-slate-900 text-white overflow-hidden border-none shadow-2xl relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-48 h-48" />
            </div>
            <CardHeader className="relative z-10 p-8">
              <Badge className="w-fit bg-teal-500 hover:bg-teal-500 mb-4 px-4 py-1">Son Kaldığın Ders</Badge>
              <CardTitle className="text-3xl md:text-4xl font-display leading-tight">{featuredCourse.title}</CardTitle>
              <CardDescription className="text-slate-400 text-lg max-w-md mt-4">
                {featuredCourse.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-8 p-8 pt-0">
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold tracking-wider uppercase opacity-80">
                  <span>Kurs İlerlemesi</span>
                  <span>%45</span>
                </div>
                <Progress value={45} className="h-2.5 bg-slate-800" />
              </div>
              <Link to={`/dersler/${grades[0].id}/${featuredCourse.id}`} className="block">
                <Button className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white h-14 px-10 rounded-2xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20">
                  Öğrenmeye Devam Et <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center gap-5">
                  <div className={`p-4 rounded-2xl bg-slate-50 ${stat.color}`}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-display font-bold text-slate-900">Müfredatına Göz At</h2>
            <Link to="/dersler">
              <Button variant="link" className="text-teal-600 hover:text-teal-700 font-bold text-base p-0 group">
                Tümünü Gör <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {grades.flatMap(g => g.courses.slice(0, 3)).map((course) => (
              <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 border-slate-200 rounded-3xl overflow-hidden flex flex-col">
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <CardTitle className="text-xl mb-3 group-hover:text-teal-600 transition-colors">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-slate-500 text-sm mb-6 flex-1">{course.description}</CardDescription>
                  <Button variant="secondary" className="w-full bg-slate-100 hover:bg-teal-50 hover:text-teal-700 transition-colors font-bold h-12 rounded-xl" asChild>
                    <Link to={`/dersler/${grades.find(g => g.courses.includes(course))?.id}/${course.id}`}>Dersi İncele</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}