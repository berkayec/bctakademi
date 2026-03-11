import React from 'react';
import { RootLayout } from '@/components/layout/RootLayout';
import { Sparkles } from 'lucide-react';
export function BlogPage() {
  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-24 md:py-32 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 text-blue-600 mb-4">
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900">BioMedTech Blog</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Industry news, breakthrough device reviews, and career insights for biomedical professionals.
          </p>
          <div className="pt-8">
            <div className="h-2 w-48 bg-slate-100 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-blue-500 w-3/4 animate-[shimmer_2s_infinite]" />
            </div>
            <p className="mt-4 text-sm text-slate-400 uppercase tracking-widest font-semibold">Editing Posts</p>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}