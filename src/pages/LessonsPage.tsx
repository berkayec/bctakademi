import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
      setSearchParams(params, { replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab, setSearchParams]);

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
    if (activeTab === 'all') return filteredCategories;
    return filteredCategories.filter(cat => cat.id === activeTab);
  }, [activeTab, filteredCategories]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setActiveTab('all');
  }, []);

  return (
    <div className="bg-[#0a0e1a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="space-y-12">
          {/* BAŞLIK VE ARAMA */}
          <header className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight">
              Akademik Bilgi Havuzu
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed px-4">
              Temel teknik eğitimden ileri düzey klinik mühendisliğe kadar tüm modüllerimizle biyomedikal uzmanı olma yolculuğunuzu planlayın.
            </p>
            <div className="relative max-w-xl mx-auto pt-4 px-4">
              <div className="flex items-center relative group">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                <Input
                  placeholder="Ders veya konu ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-14 pr-12 rounded-2xl border-slate-800 bg-slate-900/50 text-white placeholder:text-slate-500 focus-visible:ring-teal-500 w-full"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-7 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* KATEGORİ SEKMELERİ */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-slate-900/40 backdrop-blur-md p-1.5 rounded-[2rem] h-auto border border-slate-800 flex-wrap justify-center overflow-x-auto max-w-full">
                <TabsTrigger 
                  value="all" 
                  className="rounded-full px-6 py-2.5 text-sm font-bold data-[state=active]:bg-teal-500 data-[state=active]:text-white text-slate-400 transition-all"
                >
                  Tümü
                </TabsTrigger>
                {curriculum.map(cat => (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id} 
                    className="rounded-full px-6 py-2.5 text-sm font-bold data-[state=active]:bg-teal-500 data-[state=active]:text-white text-slate-400 transition-all"
                  >
                    {cat.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab + searchQuery} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }} 
                transition={{ duration: 0.3 }}
              >
                {activeTabResults.length > 0 ? (
                  <div className="space-y-20">
                    {activeTabResults.map(cat => (
                      <div key={cat.id} className="space-y-8">
                        <div className="flex items-center gap-6 px-4">
                          <h2 className="text-2xl md:text-3xl font-display font-bold text-white whitespace-nowrap">{cat.title}</h2>
                          <div className="h-px flex-1 bg-slate-800" />
                          <Badge variant="outline" className="rounded-lg border-slate-800 text-slate-500 font-bold hidden sm:inline-flex">
                            {cat.courses.length} Ders
                          </Badge>
                        </div>
                        <CourseGrid categoryId={cat.id} courses={cat.courses} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-24 text-center">
                    <FileWarning className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Eşleşen Ders Bulunamadı</h3>
                    <p className="text-slate-500 mb-8">Farklı anahtar kelimelerle aramayı deneyebilirsiniz.</p>
                    <Button onClick={handleClear} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl h-12">
                      Aramayı Temizle
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// KURS KARTLARI
interface CourseGridProps {
  courses: Course[];
  categoryId: string;
}

function CourseGrid({ courses, categoryId }: CourseGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
      {courses.map((course) => (
        <Card key={course.id} className="group flex flex-col h-full bg-slate-900/40 backdrop-blur-xl border-slate-800 rounded-[2.5rem] overflow-hidden hover:bg-slate-900/60 transition-all duration-500">
          <div className="aspect-[16/10] overflow-hidden relative">
            <img 
              src={course.image} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" 
              alt={course.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          </div>
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl md:text-2xl font-bold text-white group-hover:text-teal-400 transition-colors leading-tight">
              {course.title}
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm leading-relaxed line-clamp-2 mt-2">
              {course.description}
            </CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto p-8 pt-4">
            <Button variant="outline" className="w-full h-12 border-slate-700 text-white hover:bg-teal-500 hover:border-teal-500 font-bold rounded-xl transition-all" asChild>
              <Link to={`/dersler/${categoryId}/${course.id}`}>
                İncele <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
