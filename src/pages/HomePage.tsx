import React from 'react';
import { Link } from 'react-router-dom';
import { Play, BookOpen, FileText, CheckCircle2, ArrowRight, TrendingUp } from 'lucide-react';
import { grades } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
export function HomePage() {
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
          <h1 className="text-3xl font-display font-bold text-slate-900">Hoş Geldin, Öğrenci 👋</h1>
          <p className="text-slate-500">Kaldığın yerden devam et ve biyomedikal dünyasını keşfet.</p>
        </header>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden border-none shadow-2xl relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-48 h-48" />
            </div>
            <CardHeader className="relative z-10">
              <Badge className="w-fit bg-teal-500 hover:bg-teal-500 mb-4">Son Kaldığın Ders</Badge>
              <CardTitle className="text-3xl font-display">{featuredCourse.title}</CardTitle>
              <CardDescription className="text-slate-300 text-lg max-w-md">
                {featuredCourse.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Kurs İlerlemesi</span>
                  <span>%45</span>
                </div>
                <Progress value={45} className="h-2 bg-slate-700" />
              </div>
              <Link to={`/dersler/${grades[0].id}/${featuredCourse.id}`}>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-8 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95">
                  Öğrenmeye Devam Et <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-slate-100 shadow-sm">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-slate-900">Derslerinize Göz Atın</h2>
            <Link to="/dersler">
              <Button variant="ghost" className="text-teal-600 hover:text-teal-700 font-semibold p-0">
                Tümünü Gör <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grades.flatMap(g => g.courses.slice(0, 3)).map((course) => (
              <Card key={course.id} className="group hover:shadow-lg transition-all border-slate-200">
                <CardHeader className="p-0">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <CardTitle className="text-lg mb-2 group-hover:text-teal-600 transition-colors">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-sm">{course.description}</CardDescription>
                </CardContent>
                <div className="p-5 pt-0 mt-auto">
                   <Button variant="secondary" className="w-full group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors" asChild>
                     <Link to={`/dersler/${grades.find(g => g.courses.includes(course))?.id}/${course.id}`}>İncele</Link>
                   </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}