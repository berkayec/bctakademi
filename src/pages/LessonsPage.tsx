import React, { useState, useMemo } from 'react';
import { RootLayout } from '@/components/layout/RootLayout';
import { curriculum } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Clock, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function LessonsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const allLessons = useMemo(() => {
    return [
      ...curriculum.grade9.lessons.map(l => ({ ...l, level: '9th Grade' })),
      ...curriculum.grade10.lessons.map(l => ({ ...l, level: '10th Grade' })),
      ...curriculum.coreFields.lessons.map(l => ({ ...l, level: 'Core Fields' }))
    ];
  }, []);
  const filteredLessons = (lessons: any[]) => {
    return lessons.filter(l => 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.tags?.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };
  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl font-display font-bold text-slate-900">Curriculum Directory</h1>
            <p className="text-slate-600 text-lg">
              Explore our comprehensive library of biomedical engineering modules, 
              from foundational anatomy to advanced clinical engineering.
            </p>
            <div className="relative max-w-xl mx-auto pt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search by title, topic, or technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-teal-500"
              />
            </div>
          </div>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="bg-slate-100 p-1 rounded-xl">
                <TabsTrigger value="all" className="rounded-lg px-6">All Modules</TabsTrigger>
                <TabsTrigger value="grade9" className="rounded-lg px-6">9th Grade</TabsTrigger>
                <TabsTrigger value="grade10" className="rounded-lg px-6">10th Grade</TabsTrigger>
                <TabsTrigger value="core" className="rounded-lg px-6">Core Fields</TabsTrigger>
              </TabsList>
            </div>
            <AnimatePresence mode="wait">
              <TabsContent value="all" className="mt-0 outline-none">
                <LessonGrid lessons={filteredLessons(allLessons)} />
              </TabsContent>
              <TabsContent value="grade9" className="mt-0 outline-none">
                <LessonGrid lessons={filteredLessons(curriculum.grade9.lessons)} />
              </TabsContent>
              <TabsContent value="grade10" className="mt-0 outline-none">
                <LessonGrid lessons={filteredLessons(curriculum.grade10.lessons)} />
              </TabsContent>
              <TabsContent value="core" className="mt-0 outline-none">
                <LessonGrid lessons={filteredLessons(curriculum.coreFields.lessons)} />
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </RootLayout>
  );
}
function LessonGrid({ lessons }: { lessons: any[] }) {
  if (lessons.length === 0) {
    return (
      <div className="py-24 text-center">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">No lessons found matching your criteria.</p>
      </div>
    );
  }
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {lessons.map((lesson) => (
        <Card key={lesson.id} className="group flex flex-col h-full hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden">
          <div className="aspect-video relative overflow-hidden">
            <img src={lesson.image} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className="bg-white/90 text-slate-900 border-none shadow-sm">{lesson.duration}</Badge>
            </div>
          </div>
          <CardHeader>
            <div className="flex gap-2 mb-2 flex-wrap">
              {lesson.tags?.map((tag: string) => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <CardTitle className="line-clamp-1 group-hover:text-teal-600 transition-colors">{lesson.title}</CardTitle>
            <CardDescription className="line-clamp-2">{lesson.description}</CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Button className="w-full bg-slate-900 hover:bg-teal-600 text-white font-semibold transition-all group-hover:gap-3">
              Begin Module <Clock className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </motion.div>
  );
}