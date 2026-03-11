import React from 'react';
import { RootLayout } from '@/components/layout/RootLayout';
import { BookOpen } from 'lucide-react';
export function LessonsPage() {
  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-24 md:py-32 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-50 text-teal-600 mb-4">
            <BookOpen className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900">Lessons Directory</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We are currently cataloging our full curriculum of biomedical engineering modules. 
            Check back soon for the complete filterable directory.
          </p>
          <div className="pt-8">
            <div className="h-2 w-48 bg-slate-100 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-teal-500 w-1/3 animate-[shimmer_2s_infinite]" />
            </div>
            <p className="mt-4 text-sm text-slate-400 uppercase tracking-widest font-semibold">Under Construction</p>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}