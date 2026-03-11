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
  const [activeTab, setActiveTab] = useState('all');
  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">Ders Kataloğu</h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              MEB biyomedikal cihaz teknolojileri müfredatındaki tüm modülleri keşfedin; temel fizyolojiden ileri düzey klinik mühendisliğe kadar her şey burada.
            </p>
            <div className="relative max-w-xl mx-auto pt-6 group">
              <Search className="absolute left-4 top-[calc(50%+12px)] -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
              <Input
                placeholder="Ders, konu veya teknoloji ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 rounded-2xl border-slate-200 shadow-sm focus:ring-teal-500 text-base"
              />
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-auto">
                <TabsTrigger value="all" className="rounded-xl px-8 py-3 text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Tüm Sınıflar</TabsTrigger>
                {grades.map(grade => (
                  <TabsTrigger key={grade.id} value={grade.id} className="rounded-xl px-8 py-3 text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    {grade.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <AnimatePresence mode="popLayout">
              {activeTab === 'all' ? (
                <TabsContent value="all" forceMount className="mt-0 outline-none">
                  <motion.div
                    key="all-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-20"
                  >
                    {grades.map(grade => (
                      <div key={grade.id} className="space-y-8">
                        <div className="flex items-center gap-4">
                          <h2 className="text-3xl font-display font-bold text-slate-900">{grade.title}</h2>
                          <div className="h-0.5 flex-1 bg-slate-100" />
                        </div>
                        <CourseGrid gradeId={grade.id} courses={grade.courses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))} />
                      </div>
                    ))}
                  </motion.div>
                </TabsContent>
              ) : (
                grades.map(grade => (
                  activeTab === grade.id && (
                    <TabsContent key={grade.id} value={grade.id} forceMount className="mt-0 outline-none">
                      <motion.div
                        key={grade.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CourseGrid gradeId={grade.id} courses={grade.courses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))} />
                      </motion.div>
                    </TabsContent>
                  )
                ))
              )}
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
      <div className="py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
        <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-bold text-lg">Bu kategoride aramanızla eşleşen ders bulunamadı.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <Card key={`${gradeId}-${course.id}`} className="group flex flex-col h-full hover:shadow-2xl transition-all duration-500 border-slate-200 rounded-3xl overflow-hidden bg-white">
          <div className="aspect-[16/10] relative overflow-hidden">
            <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute top-4 left-4">
               <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none font-bold">Kredi: 5</Badge>
            </div>
          </div>
          <CardHeader className="p-7">
            <CardTitle className="text-2xl font-display font-bold line-clamp-1 group-hover:text-teal-600 transition-colors mb-2">{course.title}</CardTitle>
            <CardDescription className="line-clamp-2 text-slate-500 text-sm leading-relaxed">{course.description}</CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto p-7 pt-0">
            <Button className="w-full h-12 bg-slate-900 hover:bg-orange-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group-hover:gap-3" asChild>
              <Link to={`/dersler/${gradeId}/${course.id}`}>
                İncele <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}