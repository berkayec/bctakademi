import React from 'react';
import { RootLayout } from '@/components/layout/RootLayout';
import { FileText } from 'lucide-react';
export function ResourcesPage() {
  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-24 md:py-32 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-50 text-orange-600 mb-4">
            <FileText className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900">Resource Center</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A centralized hub for technical manuals, device whitepapers, and surgical guides. 
            Final data migration in progress.
          </p>
          <div className="pt-8">
            <div className="h-2 w-48 bg-slate-100 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-orange-500 w-1/2 animate-[shimmer_2s_infinite]" />
            </div>
            <p className="mt-4 text-sm text-slate-400 uppercase tracking-widest font-semibold">Deploying Assets</p>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}