import React, { useState } from 'react';
import { RootLayout } from '@/components/layout/RootLayout';
import { resources } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, ExternalLink, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/use-user-store';
import { toast } from 'sonner';

export function ResourcesPage() {
  const [filter, setFilter] = useState('Tümü');
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const isAuthenticated = useUserStore(s => s.isAuthenticated);
  const trackResource = useUserStore(s => s.trackResource);

  const categories = ['Tümü', 'PDF', 'Video', 'Sunum'];

  const filteredResources = resources.filter(res => {
    const matchesFilter = filter === 'Tümü' || res.type === filter;
    const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleResourceClick = async (resId: string, type: string) => {
    setProcessingId(resId);
    await new Promise(r => setTimeout(r, 1000));
    if (isAuthenticated) trackResource(resId);
    window.open('https://google.com', '_blank');
    setProcessingId(null);
  };

  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-bold text-white md:text-slate-900 tracking-tight">Kaynak Merkezi</h1>
            <p className="text-slate-400 md:text-slate-500">Çalışmalarınız için teknik belgelere ve videolara erişin.</p>
          </div>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Kaynak ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 rounded-xl bg-white text-slate-900" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                filter === cat
                  ? "bg-teal-500 text-white border-teal-500 md:bg-slate-900 md:border-slate-900"
                  : "bg-slate-900/50 text-slate-300 border-slate-800 md:bg-white md:text-slate-600 md:border-slate-200 hover:border-slate-300"
              )}
            >
              {cat === 'Tümü' ? 'Tümü' : `${cat}'ler`}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredResources.map((res) => {
              const Icon = res.icon;
              return (
                <motion.div key={res.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl p-6 border shadow-sm flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-slate-50 text-teal-600"><Icon className="w-6 h-6" /></div>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold">{res.category}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{res.title}</h3>
                  <p className="text-slate-600 text-sm mb-6 flex-1">{res.description}</p>
                  <Button
                    onClick={() => handleResourceClick(res.id, res.type)}
                    className={cn("w-full rounded-xl font-bold", res.type === 'Video' ? "bg-teal-600 text-white" : "border-slate-200 text-slate-900")}
                    disabled={!!processingId}
                  >
                    {processingId === res.id ? <Loader2 className="animate-spin" /> : (res.type === 'Video' ? 'İzle' : 'İndir')}
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </RootLayout>
  );
}
