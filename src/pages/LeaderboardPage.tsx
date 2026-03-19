import React, { useState, useEffect } from 'react';
import { Crown, Medal, Trophy, RefreshCw, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/use-user-store';
import { AVATARS } from '@/components/layout/Navbar';
import { cn } from '@/lib/utils';

type Period = 'all' | 'monthly' | 'weekly';

interface LeaderEntry {
  rank: number;
  display_name: string;
  avatar?: string;
  xp: number;
}

export function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('all');
  const [data, setData] = useState<LeaderEntry[]>([]);
  const [myRank, setMyRank] = useState<{ rank: number; xp: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const user = useUserStore(s => s.user);
  const isAuthenticated = useUserStore(s => s.isAuthenticated);

  const load = async (p: Period) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?period=${p}&limit=50`);
      const json = await res.json();
      if (json.success) setData(json.data || []);
    } catch {
      // API yoksa boş liste göster
      setData([]);
    }

    if (isAuthenticated && user?.email) {
      try {
        const res = await fetch(`/api/leaderboard/me?email=${encodeURIComponent(user.email)}&period=${p}`);
        const json = await res.json();
        if (json.success) setMyRank(json.data);
      } catch { setMyRank(null); }
    }
    setLoading(false);
  };

  useEffect(() => { load(period); }, [period]);

  const periods: { id: Period; label: string }[] = [
    { id: 'all',     label: 'Tüm Zamanlar' },
    { id: 'monthly', label: 'Bu Ay' },
    { id: 'weekly',  label: 'Bu Hafta' },
  ];

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
    if (rank === 3) return <Trophy className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-black text-muted-foreground w-5 text-center">{rank}</span>;
  };

  const rankBg = (rank: number) => {
    if (rank === 1) return 'border-yellow-400/30 bg-yellow-400/5';
    if (rank === 2) return 'border-slate-400/30 bg-slate-400/5';
    if (rank === 3) return 'border-amber-600/30 bg-amber-600/5';
    return 'border-border bg-card';
  };

  const getAvatar = (name: string) => {
    // display_name formatı "Ad S." - avatar bilgisi API'den gelmeyebilir
    return null;
  };

  return (
    <div className="bg-background min-h-screen transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 py-10 md:py-16 space-y-8">

        {/* Başlık */}
        <div className="text-center space-y-3">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-teal-500 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="font-black text-[10px] uppercase tracking-[0.3em]">Akademik Sıralama</span>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight">
            Liderlik Tablosu
          </h1>
          <p className="text-muted-foreground font-medium">
            Ders tamamlayarak, quiz çözerek XP kazan ve sıralamalarda yüksel.
          </p>
        </div>

        {/* Kendi sıran */}
        {isAuthenticated && myRank && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-black text-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">{user?.username}</p>
                <p className="text-xs text-teal-500 font-bold">Senin sıran</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-foreground text-lg">#{myRank.rank}</p>
              <p className="text-xs text-muted-foreground">{myRank.xp.toLocaleString()} XP</p>
            </div>
          </motion.div>
        )}

        {/* Dönem seçici */}
        <div className="flex gap-2 bg-muted/40 p-1.5 rounded-2xl">
          {periods.map(p => (
            <button key={p.id} onClick={() => setPeriod(p.id)}
              className={cn(
                'flex-1 py-2 rounded-xl font-bold text-sm transition-all',
                period === p.id
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                  : 'text-muted-foreground hover:text-foreground'
              )}>
              {p.label}
            </button>
          ))}
        </div>

        {/* Liste */}
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted/30 rounded-2xl animate-pulse" />
            ))
          ) : data.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">Henüz sıralama verisi yok.</p>
              <p className="text-sm mt-1">Ders tamamlayarak ilk sıraya gir!</p>
            </div>
          ) : (
            data.map((entry, i) => {
              const isMe = isAuthenticated && user && myRank?.rank === entry.rank;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-2xl border transition-all',
                    rankBg(entry.rank),
                    isMe && 'ring-2 ring-teal-500/50'
                  )}>
                  <div className="w-8 flex items-center justify-center shrink-0">
                    {rankIcon(entry.rank)}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shrink-0 text-white font-black text-sm">
                    {entry.display_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground text-sm truncate">{entry.display_name}</p>
                      {isMe && (
                        <span className="text-[9px] bg-teal-500 text-white px-2 py-0.5 rounded-full font-black">Sen</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-foreground">{entry.xp.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">XP</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Yenile butonu */}
        <div className="flex justify-center">
          <Button onClick={() => load(period)} variant="ghost"
            className="text-muted-foreground hover:text-foreground gap-2 rounded-xl">
            <RefreshCw className="w-4 h-4" /> Yenile
          </Button>
        </div>

        {/* Açıklama */}
        <div className="bg-muted/30 border border-border rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            🔒 Gizlilik: Sıralamada sadece isim baş harfleri gösterilir. <br />
            Haftalık ve aylık puanlar her dönem başında sıfırlanır.
          </p>
        </div>
      </div>
    </div>
  );
}
