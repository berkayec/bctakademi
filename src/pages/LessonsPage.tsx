import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { curriculum, Course } from '@/lib/curriculum';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowRight, FileWarning, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function LessonsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('q') || '';
  const categoryFromUrl = searchParams.get('cat') || 'all';
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [activeTab, setActiveTab] = useState(categoryFromUrl);
  useEffect(() => {
    setSearchQuery(queryFromUrl);
    setActiveTab(categoryFromUrl);
  }, [queryFromUrl, categoryFromUrl]);
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (activeTab !== 'all') params.set('cat', activeTab);
      const newQuery = params.toString();
      const currentQuery = searchParams.toString();
      if (newQuery !== currentQuery) {
        setSearchParams(params, { replace: true });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab, setSearchParams, searchParams]);
  const filteredCategories = useMemo(() => {
    return curriculum.map(cat => ({
      ...cat,
      courses: cat.courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(cat => cat.courses.length > 0);
  }, [searchQuery]);
  const activeTabResults = useMemo(() => {
    if (activeTab === 'all') {
      return filteredCategories;
    }
    return filteredCategories.filter(cat => cat.id === activeTab);
  }, [activeTab, filteredCategories]);
  const handleClear = useCallback(() => {
    setSearchQuery('');
    setActiveTab('all');
  }, []);
  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="space-y-12">
          <header className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">Akademik Bilgi Havuzu</h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Temel teknik eğitimden ileri düzey klinik mühendisliğe kadar tüm modüllerimizle biyomedikal uzmanı olma yolculuğunuzu planlayın.
            </p>
            <div className="relative max-w-xl mx-auto pt-6 group">
              <Search className="absolute left-4 top-[calc(50%+12px)] -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
              <Input
                placeholder="Ders veya konu ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 h-14 rounded-2xl border-slate-200 shadow-sm focus:ring-teal-500 text-base bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-[calc(50%+12px)] -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
          </header>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-slate-100/50 backdrop-blur-sm p-1.5 rounded-[2rem] h-auto border border-slate-200/50 flex-wrap justify-center">
                <TabsTrigger value="all" className="rounded-full px-6 md:px-8 py-2 md:py-3 text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-xl transition-all">Tümü</TabsTrigger>
                {curriculum.map(cat => (
                  <TabsTrigger key={cat.id} value={cat.id} className="rounded-full px-6 md:px-8 py-2 md:py-3 text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-xl transition-all">
                    {cat.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + searchQuery}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTabResults.length > 0 ? (
                  activeTab === 'all' ? (
                    <div className="space-y-20">
                      {activeTabResults.map(cat => (
                        <div key={cat.id} className="space-y-8">
                          <div className="flex items-center gap-6">
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 whitespace-nowrap">{cat.title}</h2>
                            <div className="h-px flex-1 bg-slate-200" />
                            <Badge variant="outline" className="rounded-lg border-slate-200 font-bold hidden sm:inline-flex">{cat.courses.length} Ders</Badge>
                          </div>
                          <CourseGrid categoryId={cat.id} courses={cat.courses} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {activeTabResults.map(cat => (
                        <CourseGrid key={cat.id} categoryId={cat.id} courses={cat.courses} />
                      ))}
                    </div>
                  )
                ) : (
                  <div className="py-24 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 max-w-2xl mx-auto">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileWarning className="w-12 h-12 text-slate-300" />
                    </div>
                    <p className="text-slate-900 font-bold text-2xl mb-2">
                      {activeTab === 'all' ? 'Eşleşen Ders Bulunamadı' : 'Bu Kategoride Sonuç Yok'}
                    </p>
                    <p className="text-slate-500 mb-8">
                      "{searchQuery}" araması için {activeTab === 'all' ? 'herhangi bir' : 'bu kategoride'} sonuç çıkmadı.
                    </p>
                    <Button
                      onClick={handleClear}
                      className="bg-slate-950 text-white rounded-xl px-8 border-none"
                    >
                      Aramayı Temizle
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </RootLayout>
  );
}
interface CourseGridProps {
  courses: Course[];
  categoryId: string;
}
function CourseGrid({ courses, categoryId }: CourseGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <Card key={course.id} className="group flex flex-col h-full hover:shadow-2xl transition-all duration-500 border-slate-200/60 rounded-[2.5rem] overflow-hidden bg-white/60 backdrop-blur-sm">
          <div className="aspect-[16/10] relative overflow-hidden">
            <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
          </div>
          <CardHeader className="p-8">
            <CardTitle className="text-xl md:text-2xl font-display font-bold group-hover:text-teal-600 transition-colors mb-2">{course.title}</CardTitle>
            <CardDescription className="text-slate-500 text-sm leading-relaxed line-clamp-2">{course.description}</CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto p-8 pt-0">
            <Button variant="outline" className="w-full h-12 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2" asChild>
              <Link to={`/dersler/${categoryId}/${course.id}`}>
                İncele <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}