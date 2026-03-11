import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { grades } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function LessonsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl font-display font-bold text-slate-900">Ders Kataloğu</h1>
            <p className="text-slate-600 text-lg">
              Biyomedikal mühendisliği modüllerini keşfedin; temel fizyolojiden gelişmiş klinik mühendisliğe kadar her şey burada.
            </p>
            <div className="relative max-w-xl mx-auto pt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Ders, konu veya teknoloji ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-teal-500"
              />
            </div>
          </div>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="bg-slate-100 p-1 rounded-xl">
                <TabsTrigger value="all" className="rounded-lg px-6">Tüm Sınıflar</TabsTrigger>
                {grades.map(grade => (
                  <TabsTrigger key={grade.id} value={grade.id} className="rounded-lg px-6">
                    {grade.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <AnimatePresence mode="wait">
              <TabsContent value="all" className="mt-0 outline-none">
                <motion.div
                  key="all-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="space-y-16">
                    {grades.map(grade => (
                      <div key={grade.id} className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-teal-500 pl-4">{grade.title}</h2>
                        <CourseGrid gradeId={grade.id} courses={grade.courses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
              {grades.map(grade => (
                <TabsContent key={grade.id} value={grade.id} className="mt-0 outline-none">
                  <motion.div
                    key={grade.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <CourseGrid gradeId={grade.id} courses={grade.courses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))} />
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </RootLayout>
  );
}
function CourseGrid({ courses, gradeId }: { courses: any[], gradeId: string }) {
  if (courses.length === 0) {
    return (
      <div className="py-12 text-center">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Bu kategoride ders bulunamadı.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <Card key={`${gradeId}-${course.id}`} className="group flex flex-col h-full hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden">
          <div className="aspect-video relative overflow-hidden">
            <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-1 group-hover:text-teal-600 transition-colors">{course.title}</CardTitle>
            <CardDescription className="line-clamp-2">{course.description}</CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Button className="w-full bg-slate-900 hover:bg-teal-600 text-white font-semibold transition-all group-hover:gap-3" asChild>
              <Link to={`/dersler/${gradeId}/${course.id}`}>
                İncele <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}