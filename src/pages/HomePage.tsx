import React from 'react';
import { Search, ArrowRight, BookOpen, Download, ExternalLink } from 'lucide-react';
import { curriculum, resources } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
export function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-teal-500 py-24 lg:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <Badge className="bg-teal-400/20 text-teal-100 border-teal-400/30 hover:bg-teal-400/30 px-4 py-1">
              Next-Gen Medical Learning
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white leading-[1.1]">
              Master the World of <br />
              <span className="text-teal-300">Biomedical Technology</span>
            </h1>
            <p className="text-lg text-blue-50/90 leading-relaxed">
              Structured courses, clinical insights, and engineering fundamentals 
              tailored for biomedical students and aspiring tech professionals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <div className="relative w-full max-w-md group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                <Input 
                  placeholder="Search lessons, devices, anatomy..." 
                  className="pl-10 h-14 bg-white border-0 shadow-2xl focus-visible:ring-2 focus-visible:ring-teal-400 text-slate-900 text-lg rounded-2xl"
                />
              </div>
              <Button className="h-14 px-8 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5">
                Start Learning
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Curriculum Sections */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-24">
          {Object.entries(curriculum).map(([key, section]) => (
            <div key={key}>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-bold text-slate-900">{section.title}</h2>
                  <p className="text-slate-600">Deep dive into specialized modules designed for your level.</p>
                </div>
                <Button variant="ghost" className="text-teal-600 font-semibold hover:text-teal-700 p-0 hover:bg-transparent group">
                  View all modules <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.lessons.map((lesson) => (
                  <Card key={lesson.id} className="group flex flex-col h-full border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={lesson.image} 
                        alt={lesson.title} 
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/90 text-slate-900 border-none backdrop-blur shadow-sm">
                          {lesson.duration}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="group-hover:text-teal-600 transition-colors line-clamp-1">{lesson.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{lesson.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto pt-0">
                      <Button className="w-full bg-slate-900 hover:bg-teal-600 text-white transition-colors">
                        Begin Module
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Resources Section */}
      <section className="bg-slate-50 border-y border-slate-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-display font-bold text-slate-900">Supplemental Resources</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Access high-quality reference materials, video demonstrations, and industry-standard documentation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((res) => {
              const Icon = res.icon;
              return (
                <div key={res.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="mb-3">{res.type}</Badge>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{res.title}</h3>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    {res.description}
                  </p>
                  <Button variant="outline" className="w-full border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300">
                    {res.type === 'Video' ? <ExternalLink className="w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                    {res.type === 'Video' ? 'Watch Now' : 'Download File'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}