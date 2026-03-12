import React, { useState } from 'react';
import { resources } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, ExternalLink, Loader2, FileWarning } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/use-user-store';

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
    await new Promise(r => setTimeout(r, 800));
    if (isAuthenticated) trackResource(resId);
    window.open('https://google.com', '_blank');
    setProcessingId(null);
  };

  return (
    <div className="bg-[#0a0e1a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* BAŞLIK VE ARAMA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold text-white tracking-tight leading-tight">
              Kaynak Merkezi
            </h1>
            <p className="text-slate-400 font-medium">
              Akademik çalışmalarınız için teknik belgelere ve eğitim videolarına erişin.
            </p>
          </div>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
            <Input 
              placeholder="Kaynak ara..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-11 h-12 rounded-xl border-slate-800 bg-slate-900/50 text-white placeholder:text-slate-500 focus-visible:ring-teal-500 shadow-2xl" 
            />
          </div>
        </div>

        {/* KATEGORİ FİLTRELERİ */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border",
                filter === cat
                  ? "bg-teal-500 text-white border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.4)]"
                  : "bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300"
              )}
            >
              {cat === 'Tümü' ? 'Tümü' : `${cat}'ler`}
            </button>
          ))}
        </div>

        {/* KAYNAK IZGARASI */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 flex flex-col h-full hover:bg-slate-900/60 transition-all group shadow-xl"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="p-4 rounded-2xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                      <Icon className="w-7 h-7" />
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase font-black border-slate-800 text-slate-500 bg-black/20 px-3 py-1">
                      {res.category}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-teal-400 transition-colors leading-tight">
                    {res.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                    {res.description}
                  </p>
                  
                  {/* DÜZELTİLEN BUTON KISMI */}
                  <Button
                    onClick={() => handleResourceClick(res.id, res.type)}
                    disabled={!!processingId}
                    className={cn(
                      "w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest border-none transition-all active:scale-95 shadow-xl",
                      res.type === 'Video' 
                        ? "bg-teal-600 hover:bg-teal-500 text-white shadow-teal-900/20" 
                        : "bg-slate-800 hover:bg-slate-700 text-white shadow-black/40" // Buradaki text-white sorunu çözer
                    )}
                  >
                    {processingId === res.id ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {res.type === 'Video' ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                        {res.type === 'Video' ? 'İzle' : 'İndir'}
                      </span>
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* BOŞ SONUÇ DURUMU */}
        {filteredResources.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed border-slate-800 rounded-[3rem]">
            <FileWarning className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Kaynak bulunamadı</h3>
            <p className="text-slate-500 text-sm">Farklı anahtar kelimelerle aramayı deneyebilirsiniz.</p>
          </div>
        )}
      </div>
    </div>
  );
}
