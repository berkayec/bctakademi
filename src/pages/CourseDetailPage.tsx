import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { grades } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, LayoutList, BookOpen, Clock } from 'lucide-react';
export function CourseDetailPage() {
  const { gradeId, courseId } = useParams();
  const grade = grades.find(g => g.id === gradeId);
  const course = grade?.courses.find(c => c.id === courseId);
  if (!course) return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">Ders bulunamadı.</div>
    </RootLayout>
  );
  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/dersler" className="hover:text-teal-600">Dersler</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium">{grade?.title}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-teal-600 font-bold">{course.title}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-display font-bold text-slate-900">{course.title}</h1>
              <p className="text-slate-600 leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Badge variant="secondary" className="px-4 py-1"><LayoutList className="w-3 h-3 mr-2" /> {course.units.length} Ünite</Badge>
                <Badge variant="secondary" className="px-4 py-1"><Clock className="w-3 h-3 mr-2" /> Sertifikalı</Badge>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold text-slate-900">Müfredat İçeriği</h2>
            <div className="space-y-4">
              {course.units.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Bu ders için henüz ünite eklenmemiş.</p>
                </div>
              ) : (
                course.units.map((unit, index) => (
                  <Card key={unit.id} className="border-slate-200 hover:border-teal-300 transition-colors overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Ünite {index + 1}</span>
                        <CardTitle className="text-xl">{unit.title}</CardTitle>
                      </div>
                      <Link to={`/dersler/${gradeId}/${courseId}/${unit.id}`}>
                        <Button className="bg-slate-900 hover:bg-teal-600 text-white rounded-xl">Derse Başla</Button>
                      </Link>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {unit.topics.map((topic) => (
                          <li key={topic.id} className="flex items-center gap-3 text-slate-600 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                            {topic.title}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}