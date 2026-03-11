import React, { useState } from 'react';
import { RootLayout } from '@/components/layout/RootLayout';
import { resources } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, ExternalLink, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/use-user-store';
import { toast } from 'sonner';
export function ResourcesPage() {
  const [filter, setFilter] = useState('Tümü');
  const [search, setSearch] = useState('');
  const trackResource = useUserStore(s => s.trackResource);
  const isAuthenticated = useUserStore(s => s.isAuthenticated);
  const categories = ['Tümü', 'PDF', 'Video', 'Sunum'];
  const filteredResources = resources.filter(res => {
    const typeLabel = res.type === 'Sunum' ? 'Sunum' : res.type;
    const matchesFilter = filter === 'Tümü' || typeLabel === filter;
    const matchesSearch =
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      res.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  const handleResourceClick = (resId: string) => {
    if (isAuthenticated) {
      trackResource(resId);
      toast.success("+10 XP Kazandın!", { icon: <Sparkles className="text-orange-500 w-4 h-4" /> });
    }
  };
  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Kaynak Merkezi</h1>
            <p className="text-slate-500">Çalışmalarınız için teknik belgelere ve videolara erişin.</p>
          </div>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
            <Input
              placeholder="Kaynak ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-teal-500"
            />
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
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
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
                <motion.div
                  key={res.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-slate-50 text-teal-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold">
                      {res.category}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{res.title}</h3>
                  <p className="text-slate-600 text-sm mb-6 flex-1">{res.description}</p>
                  <div className="flex items-center justify-between mb-4 text-xs text-slate-400 font-bold">
                    <span>{res.type}</span>
                    <span>{res.fileSize || res.duration}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-slate-200 text-slate-900 hover:bg-slate-50 rounded-xl font-bold"
                    onClick={() => handleResourceClick(res.id)}
                  >
                    {res.type === 'Video' ? <><ExternalLink className="w-4 h-4 mr-2" /> İzle</> : <><Download className="w-4 h-4 mr-2" /> İndir</>}
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