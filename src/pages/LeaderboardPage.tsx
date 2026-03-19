import React, { useEffect, useState, useCallback } from 'react';
import { Trophy, Medal, Crown, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore, getUserTitle } from '@/store/use-user-store';
import { AVATARS } from '@/components/layout/Navbar';

// ─── Tipler ────────────────────────────────────────────────────────────────
interface LeaderboardEntry {
  rank:     number;
  username: string;
  avatar:   string | null;
  xp:       number;
}

interface MyRank {
  rank:   number | null;
  xp:     number;
  period: string;
}

type Period = 'all' | 'weekly' | 'monthly';

const PERIODS: { id: Period; label: string }[] = [
  { id: 'all',     label: 'Tüm Zamanlar' },
  { id: 'monthly', label: 'Bu Ay' },
  { id: 'weekly',  label: 'Bu Hafta' },
];

// ─── Rozet renkleri ─────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown  className="w-5 h-5 text-amber-400" />;
  if (rank === 2) return <Medal  className="w-5 h-5 text-slate-400" />;
  if (rank === 3) return <Trophy className="w-5 h-5 text-amber-600" />;
  return <span className="w-5 h-5 flex items-center justify-center text-xs font-black text-muted-foreground">{rank}</span>;
}

function rankRowClass(rank: number, isMe: boolean) {
  if (isMe)   return 'bg-teal-500/10 border-teal-500/40 ring-1 ring-teal-500/30';
  if (rank === 1) return 'bg-amber-500/8 border-amber-400/30';
  if (rank === 2) return 'bg-slate-400/8 border-slate-400/20';
  if (rank === 3) return 'bg-amber-600/8 border-amber-600/20';
  return 'bg-card border-border';
}

// ─── Ana Sayfa ─────────────────────────────────────────────────────────────
export function LeaderboardPage() {
  const [period, setPeriod]     = useState<Period>('all');
  const [data, setData]         = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank]     = useState<MyRank | null>(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const user          = useUserStore(s => s.user);
  const isAuthenticated = useUserStore(s => s.isAuthenticated);

  const fetchLeaderboard = useCallback(async (p: Period, silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try {
      const res  = await fetch(`/api/leaderboard?period=${p}&limit=50`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch { /* sessiz hata */ }

    if (isAuthenticated && user?.email) {
      try {
        const res  = await fetch(`/api/leaderboard/me?email=${encodeURIComponent(user.email)}&period=${p}`);
        const json = await res.json();
        if (json.success) setMyRank({ rank: json.rank, xp: json.xp, period: p });
      } catch { /* sessiz hata */ }
    }

    if (!silent) setLoading(false); else setRefreshing(false);
  }, [isAuthenticated, user?.email]);

  useEffect(() => {
    fetchLeaderboard(period);
  }, [period, fetchLeaderboard]);

  const myEntry = data.find(d => {
    if (!user?.username) return false;
    const parts   = (user.username || '').trim().split(' ');
    const display = parts.length >= 2
      ? `${parts[0]} ${parts[parts.length - 1][0]}.`
      : parts[0];
    return d.username === display;
  });

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Başlık */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Liderlik Tablosu</h1>
          <p className="text-muted-foreground">XP kazanarak sıralamana yüksel. Kullanıcı gizliliği korunur.</p>
        </div>

        {/* Kendi Sıran — giriş yapılmışsa */}
        {isAuthenticated && myRank && myRank.rank && (
          <div className="bg-gradient-to-r from-teal-500/10 to-teal-500/5 border border-teal-500/30 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-xl shrink-0">
                {user?.avatar
                  ? AVATARS.find(a => a.id === user.avatar)?.emoji ?? '🧠'
                  : '🧠'}
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Senin Sıran</p>
                <p className="text-xs text-muted-foreground">{getUserTitle(myRank.xp)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-teal-500">#{myRank.rank}</p>
              <p className="text-xs text-muted-foreground font-bold">{myRank.xp.toLocaleString('tr-TR')} XP</p>
            </div>
          </div>
        )}

        {/* Dönem seçici */}
        <div className="flex gap-2 bg-muted/50 p-1.5 rounded-2xl">
          {PERIODS.map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-bold transition-all',
                period === p.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Tablo */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16 bg-muted/20 rounded-[2rem] border-2 border-dashed border-border">
            <Trophy className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">Bu dönem için henüz sıralama yok.</p>
            <p className="text-muted-foreground/60 text-sm mt-1">Ders tamamlayarak ilk sıraya gir!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Yenile butonu */}
            <div className="flex justify-end">
              <button
                onClick={() => fetchLeaderboard(period, true)}
                disabled={refreshing}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-bold"
              >
                <RefreshCw className={cn('w-3.5 h-3.5', refreshing && 'animate-spin')} />
                Yenile
              </button>
            </div>

            {data.map((entry) => {
              const isMe       = !!myEntry && entry.rank === myEntry.rank;
              const avatarEmoji = entry.avatar
                ? AVATARS.find(a => a.id === entry.avatar)?.emoji
                : null;
              const initials   = entry.username.slice(0, 1).toUpperCase();

              return (
                <div
                  key={entry.rank}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-2xl border transition-all',
                    rankRowClass(entry.rank, isMe),
                    isMe && 'scale-[1.01]'
                  )}
                >
                  {/* Sıra */}
                  <div className="w-8 flex items-center justify-center shrink-0">
                    <RankBadge rank={entry.rank} />
                  </div>

                  {/* Avatar */}
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-base shrink-0',
                    entry.rank === 1 ? 'bg-amber-400/20 ring-2 ring-amber-400/50' :
                    entry.rank === 2 ? 'bg-slate-400/20 ring-2 ring-slate-400/30' :
                    entry.rank === 3 ? 'bg-amber-600/20 ring-2 ring-amber-600/30' :
                    'bg-muted'
                  )}>
                    {avatarEmoji ? (
                      <span>{avatarEmoji}</span>
                    ) : (
                      <span className="text-sm font-black text-muted-foreground">{initials}</span>
                    )}
                  </div>

                  {/* İsim + unvan */}
                  <div className="flex-1 min-w-0">
                    <p className={cn('font-bold text-sm', isMe ? 'text-teal-600 dark:text-teal-400' : 'text-foreground')}>
                      {entry.username}
                      {isMe && <span className="ml-2 text-[10px] bg-teal-500/20 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Sen</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">{getUserTitle(entry.xp)}</p>
                  </div>

                  {/* XP */}
                  <div className="text-right shrink-0">
                    <p className={cn(
                      'font-black text-base',
                      entry.rank === 1 ? 'text-amber-500' :
                      entry.rank === 2 ? 'text-slate-400' :
                      entry.rank === 3 ? 'text-amber-600' :
                      isMe ? 'text-teal-500' : 'text-foreground'
                    )}>
                      {entry.xp.toLocaleString('tr-TR')}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">XP</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Gizlilik notu */}
        <p className="text-center text-xs text-muted-foreground/60 pb-4">
          🔒 Sadece ad ve soyad baş harfi gösterilmektedir. E-posta adresi hiçbir zaman paylaşılmaz.
        </p>
      </div>
    </div>
  );
}
