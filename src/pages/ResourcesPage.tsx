import React, { useState, useEffect } from 'react';
import { resources as staticResources } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Download, ExternalLink, Loader2, FileWarning, FileText, Video, Presentation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/use-user-store';

interface ApiResource {
  id:          string;
  title:       string;
  description: string;
  type:        'PDF' | 'Video' | 'Sunum';
  category:    string;
  file_url:    string;
  file_size:   string;
  duration:    string;
  is_published: number;
}

const TYPE_ICON: Record<string, React.ElementType> = {
  PDF:   FileText,
  Video: Video,
  Sunum: Presentation,
};

export function ResourcesPage() {
  const [filter, setFilter]           = useState('Tümü');
  const [search, setSearch]           = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [resources, setResources]     = useState<ApiResource[]>([]);
  const [loading, setLoading]         = useState(true);

  const isAuthenticated = useUserStore(s => s.isAuthenticated);
  const trackResource   = useUserStore(s => s.trackResource);
  const user            = useUserStore(s => s.user);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res  = await fetch('/api/resources');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setResources(json.data);
        } else {
          // Statik fallback
          setResources(staticResources.map(r => ({
            id:          r.id,
            title:       r.title,
            description: r.description,
            type:        r.type as 'PDF' | 'Video' | 'Sunum',
            category:    r.category,
            file_url:    '',
            file_size:   (r as any).fileSize || '',
            duration:    (r as any).duration || '',
            is_published: 1,
          })));
        }
      } catch {
        setResources(staticResources.map(r => ({
          id: r.id, title: r.title, description: r.description,
          type: r.type as 'PDF' | 'Video' | 'Sunum', category: r.category,
          file_url: '', file_size: (r as any).fileSize || '', duration: (r as any).duration || '', is_published: 1,
        })));
      }
      setLoading(false);
    })();
  }, []);

  const categories = ['Tümü', 'PDF', 'Video', 'Sunum'];

  const filteredResources = resources.filter(res => {
    const matchesFilter = filter === 'Tümü' || res.type === filter;
    const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleResourceClick = async (res: ApiResource) => {
    setProcessingId(res.id);
    await new Promise(r => setTimeout(r, 600));

    if (isAuthenticated) {
      trackResource(res.id);
      // D1'e kaydet
      if (user?.email) {
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, entity_type: 'resource', entity_id: res.id }),
        }).catch(() => {});
      }
    }

    if (res.file_url) {
      window.open(res.file_url, '_blank');
    }
    setProcessingId(null);
  };

  return (
    <div className="bg-background min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold text-foreground tracking-tight leading-tight transition-colors">
              Kaynak Merkezi
            </h1>
            <p className="text-muted-foreground font-medium transition-colors">
              Akademik çalışmalarınız için teknik belgelere ve eğitim videolarına erişin.
            </p>
          </div>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
            <Input
              placeholder="Kaynak ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 rounded-xl border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-teal-500 shadow-2xl transition-all"
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
                  : "bg-muted/50 text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground"
              )}
            >
              {cat === 'Tümü' ? 'Tümü' : `${cat}'ler`}
            </button>
          ))}
        </div>

        {/* KAYNAK IZGARASI */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-72 rounded-[2.5rem]" />)}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredResources.map((res) => {
                const Icon = TYPE_ICON[res.type] || FileText;
                return (
                  <motion.div
                    key={res.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card backdrop-blur-xl rounded-[2.5rem] p-8 border border-border flex flex-col h-full hover:bg-card/80 transition-all group shadow-xl"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className="p-4 rounded-2xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                        <Icon className="w-7 h-7" />
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase font-black border-border text-muted-foreground bg-muted px-3 py-1">
                        {res.category}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight group-hover:text-teal-500 transition-colors leading-tight">
                      {res.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1 transition-colors">
                      {res.description}
                    </p>

                    {(res.file_size || res.duration) && (
                      <p className="text-xs text-muted-foreground/70 font-medium mb-4">
                        {res.file_size && `📁 ${res.file_size}`}
                        {res.duration && `⏱ ${res.duration}`}
                      </p>
                    )}

                    <Button
                      onClick={() => handleResourceClick(res)}
                      disabled={!!processingId}
                      className={cn(
                        "w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest border-none transition-all active:scale-95 shadow-xl",
                        res.type === 'Video'
                          ? "bg-teal-600 hover:bg-teal-500 text-white shadow-teal-900/20"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-black/10"
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
        )}

        {!loading && filteredResources.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed border-border rounded-[3rem] transition-colors">
            <FileWarning className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Kaynak bulunamadı</h3>
            <p className="text-muted-foreground text-sm">Farklı anahtar kelimelerle aramayı deneyebilirsiniz.</p>
          </div>
        )}
      </div>
    </div>
  );
}
