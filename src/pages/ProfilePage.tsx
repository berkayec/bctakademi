import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Briefcase, GraduationCap, Edit3, Save, X,
  Trophy, BookOpen, Star, Clock, ChevronRight,
  CheckCircle2, TrendingUp, FileText, Award, Smile
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUserStore, getUserTitle } from '@/store/use-user-store';
import { AVATARS } from '@/components/layout/Navbar';
import { curriculum } from '@/lib/curriculum';

const ROLE_LABELS: Record<string, string> = {
  student: 'Öğrenci',
  teacher: 'Eğitimci',
  pro:     'Sektör Çalışanı',
  other:   'Diğer',
};

const LEVEL_CONFIG = [
  { title: 'BCT Çırağı',            color: 'from-slate-400 to-slate-600',   bg: 'bg-slate-500/10',   text: 'text-slate-500',   border: 'border-slate-500/20' },
  { title: 'BCT Teknisyeni',        color: 'from-teal-400 to-teal-600',     bg: 'bg-teal-500/10',    text: 'text-teal-500',    border: 'border-teal-500/20' },
  { title: 'Klinik Mühendis Adayı', color: 'from-orange-400 to-orange-600', bg: 'bg-orange-500/10',  text: 'text-orange-500',  border: 'border-orange-500/20' },
  { title: 'Uzman Biyomedikalci',   color: 'from-purple-400 to-purple-600', bg: 'bg-purple-500/10',  text: 'text-purple-500',  border: 'border-purple-500/20' },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile } = useUserStore();
  const [isEditing,      setIsEditing]      = useState(false);
  const [isAvatarOpen,   setIsAvatarOpen]   = useState(false);
  const [saving,         setSaving]         = useState(false);
  const [isReady,        setIsReady]        = useState(false);
  const [form, setForm] = useState({ username: '', detail: '', avatar: '' });

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) { navigate('/'); return; }
    if (user) setForm({ username: user.username, detail: user.detail, avatar: user.avatar || '' });
  }, [isReady, isAuthenticated, user, navigate]);

  if (!isReady || !user) return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
    </div>
  );

  const points        = user.points;
  const currentTitle  = getUserTitle(points);
  const levelCfg      = LEVEL_CONFIG.find(l => l.title === currentTitle) || LEVEL_CONFIG[0];
  const nextThreshold = points < 500 ? 500 : points < 1500 ? 1500 : points < 3000 ? 3000 : 5000;
  const prevThreshold = points < 500 ? 0   : points < 1500 ? 500  : points < 3000 ? 1500 : 3000;
  const levelProgress = Math.min(((points - prevThreshold) / (nextThreshold - prevThreshold)) * 100, 100);

  const allCourses = curriculum.flatMap(cat => cat.courses.map(c => ({ ...c, catId: cat.id })));
  const completedCourses  = allCourses.filter(c => c.units.length > 0 && c.units.every(u => user.completedUnits.includes(u.id)));
  const inProgressCourses = allCourses.filter(c =>
    c.units.some(u => user.completedUnits.includes(u.id)) &&
    !c.units.every(u => user.completedUnits.includes(u.id))
  );

  const handleSave = async () => {
    if (!form.username.trim()) { toast.error('Ad Soyad boş olamaz.'); return; }
    setSaving(true);
    try {
      await updateProfile({ username: form.username.trim(), detail: form.detail.trim(), avatar: form.avatar });
      toast.success('Profil güncellendi!');
      setIsEditing(false);
      setIsAvatarOpen(false);
    } catch {
      toast.error('Güncelleme başarısız.');
    }
    setSaving(false);
  };

  const currentAvatar = AVATARS.find(a => a.id === (form.avatar || user.avatar));
  const initials = user.username.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="bg-background min-h-screen transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">

        {/* ── PROFIL KARTI ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className={`h-28 bg-gradient-to-r ${levelCfg.color} opacity-20`} />
            <CardContent className="px-6 md:px-8 pb-8 -mt-14 relative">
              <div className="flex flex-col sm:flex-row sm:items-end gap-5 mb-8">

                {/* Avatar */}
                <div className="relative">
                  <div className={`w-24 h-24 rounded-[1.5rem] bg-gradient-to-br ${levelCfg.color} flex items-center justify-center shadow-2xl border-4 border-background`}>
                    {currentAvatar ? (
                      <span className="text-4xl">{currentAvatar.emoji}</span>
                    ) : (
                      <span className="text-2xl font-black text-white">{initials}</span>
                    )}
                  </div>
                  {/* Avatar değiştir butonu */}
                  <button
                    onClick={() => setIsAvatarOpen(true)}
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-teal-500 hover:bg-teal-600 flex items-center justify-center shadow-lg transition-colors border-2 border-background"
                    title="Avatar değiştir"
                  >
                    <Smile className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="flex-1 pb-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">{user.username}</h1>
                    <Badge className={`${levelCfg.bg} ${levelCfg.text} ${levelCfg.border} font-bold text-[10px] uppercase tracking-wider`}>
                      {currentTitle}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>

                <div className="flex gap-2 pb-1">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} disabled={saving} size="sm" className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl border-none gap-1.5">
                        <Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
                      </Button>
                      <Button onClick={() => { setIsEditing(false); setForm({ username: user.username, detail: user.detail, avatar: user.avatar || '' }); }} size="sm" variant="ghost" className="rounded-xl gap-1.5">
                        <X className="w-4 h-4" /> İptal
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} size="sm" variant="outline" className="rounded-xl border-border gap-1.5 text-foreground">
                      <Edit3 className="w-4 h-4" /> Düzenle
                    </Button>
                  )}
                </div>
              </div>

              {/* Bilgiler grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sol — düzenlenebilir */}
                <div className="space-y-5">

                  {/* Ad Soyad — DEĞİŞTİRİLEBİLİR */}
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      Ad Soyad <span className="text-teal-500">(değiştirilebilir)</span>
                    </Label>
                    {isEditing ? (
                      <Input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className="rounded-xl border-border bg-muted/50 text-foreground h-11" />
                    ) : (
                      <p className="text-foreground font-semibold">{user.username}</p>
                    )}
                  </div>

                  {/* E-posta — DEĞİŞTİRİLEMEZ */}
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <Mail className="w-3 h-3" /> E-posta <span className="text-muted-foreground/50">(değiştirilemez)</span>
                    </Label>
                    <p className="text-foreground font-semibold text-sm bg-muted/30 px-3 py-2 rounded-xl border border-border">{user.email}</p>
                  </div>

                  {/* Rol — DEĞİŞTİRİLEMEZ */}
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3" /> Rol <span className="text-muted-foreground/50">(değiştirilemez)</span>
                    </Label>
                    <p className="text-foreground font-semibold text-sm bg-muted/30 px-3 py-2 rounded-xl border border-border">{ROLE_LABELS[user.role] || user.role}</p>
                  </div>

                  {/* Kurum/Seviye — DEĞİŞTİRİLEBİLİR */}
                  {(user.role === 'student' || user.role === 'teacher' || user.role === 'pro') && (
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <GraduationCap className="w-3 h-3" />
                        {user.role === 'student' ? 'Eğitim Seviyesi' : 'Kurum'}
                        <span className="text-teal-500">(değiştirilebilir)</span>
                      </Label>
                      {isEditing ? (
                        <Input value={form.detail} onChange={e => setForm(f => ({ ...f, detail: e.target.value }))} placeholder={user.role === 'student' ? 'Eğitim seviyeniz' : 'Kurum adı'} className="rounded-xl border-border bg-muted/50 text-foreground h-11" />
                      ) : (
                        <p className="text-foreground font-semibold">{user.detail || '—'}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Sağ — XP kartı */}
                <div className="space-y-4">
                  <div className={`${levelCfg.bg} ${levelCfg.border} border rounded-2xl p-5`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${levelCfg.text}`}>Akademik Seviye</span>
                      <Trophy className={`w-5 h-5 ${levelCfg.text}`} />
                    </div>
                    <p className="text-3xl font-black text-foreground mb-1">{points.toLocaleString()} XP</p>
                    <p className="text-xs text-muted-foreground mb-3">Sonraki seviye: {nextThreshold.toLocaleString()} XP</p>
                    <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${levelProgress}%` }}
                        transition={{ duration: 1.2, ease: 'circOut' }}
                        className={`h-full bg-gradient-to-r ${levelCfg.color} rounded-full`}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1.5 text-right">%{Math.round(levelProgress)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Tamamlanan Ünite', value: user.completedUnits.length,    icon: CheckCircle2, color: 'text-teal-500' },
                      { label: 'Erişilen Kaynak',  value: user.accessedResources.length, icon: FileText,     color: 'text-blue-500' },
                    ].map((s, i) => (
                      <div key={i} className="bg-muted/30 rounded-2xl p-4 border border-border text-center">
                        <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
                        <p className="text-xl font-black text-foreground">{s.value}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide leading-tight mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── AVATAR SEÇİCİ MODAL ── */}
        <AnimatePresence>
          {isAvatarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setIsAvatarOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="bg-card border border-border rounded-[2rem] p-6 md:p-8 w-full max-w-md shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground">Avatar Seç</h3>
                  <button onClick={() => setIsAvatarOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-6">
                  {AVATARS.map(avatar => (
                    <button
                      key={avatar.id}
                      onClick={() => setForm(f => ({ ...f, avatar: avatar.id }))}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 ${
                        form.avatar === avatar.id
                          ? 'border-teal-500 bg-teal-500/10 scale-105 shadow-lg'
                          : 'border-border bg-muted/30 hover:border-teal-500/40 hover:bg-muted/60'
                      }`}
                      title={avatar.label}
                    >
                      <span className="text-2xl">{avatar.emoji}</span>
                      <span className="text-[9px] text-muted-foreground font-bold truncate w-full text-center px-1">{avatar.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => setIsAvatarOpen(false)} variant="outline" className="flex-1 rounded-xl border-border">İptal</Button>
                  <Button
                    onClick={async () => {
                      setSaving(true);
                      try {
                        await updateProfile({ username: user.username, detail: user.detail, avatar: form.avatar });
                        toast.success('Avatar güncellendi!');
                        setIsAvatarOpen(false);
                      } catch { toast.error('Güncelleme başarısız.'); }
                      setSaving(false);
                    }}
                    disabled={saving}
                    className="flex-1 rounded-xl bg-teal-500 hover:bg-teal-600 text-white border-none"
                  >
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── DEVAM EDEN DERSLER ── */}
        {inProgressCourses.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" /> Devam Eden Dersler
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inProgressCourses.map(course => {
                const completed = course.units.filter(u => user.completedUnits.includes(u.id)).length;
                const total     = course.units.length;
                const pct       = Math.round((completed / total) * 100);
                return (
                  <Link key={course.id} to={`/dersler/${course.catId}/${course.id}`}>
                    <div className="bg-card border border-border rounded-2xl p-5 hover:border-orange-500/40 hover:bg-card/80 transition-all group">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-muted">
                          <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-80" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-foreground text-sm group-hover:text-orange-500 transition-colors truncate">{course.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{completed}/{total} ünite tamamlandı</p>
                          <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-500 transition-colors shrink-0 mt-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* ── TAMAMLANAN DERSLER ── */}
        {completedCourses.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-teal-500" /> Tamamlanan Dersler
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {completedCourses.map(course => (
                <div key={course.id} className="bg-card border border-teal-500/20 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-muted">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-sm truncate">{course.title}</p>
                    <p className="text-xs text-teal-500 font-bold mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Tamamlandı</p>
                  </div>
                  <Link to="/sertifikalar"><Award className="w-5 h-5 text-teal-500 hover:text-teal-400 transition-colors" /></Link>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── HIZLI ERİŞİM ── */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" /> Hızlı Erişim
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Portal',       href: '/portal',       emoji: '🏠', color: 'text-teal-500',   bg: 'bg-teal-500/10',   border: 'border-teal-500/20' },
              { label: 'Dersler',      href: '/dersler',      emoji: '📚', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
              { label: 'Sertifikalar', href: '/sertifikalar', emoji: '🏆', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
              { label: 'Kaynaklar',    href: '/kaynaklar',    emoji: '📁', color: 'text-blue-500',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
            ].map((item, i) => (
              <Link key={i} to={item.href}>
                <div className={`${item.bg} border ${item.border} rounded-2xl p-5 text-center hover:scale-[1.02] transition-all`}>
                  <span className="text-2xl block mb-2">{item.emoji}</span>
                  <p className={`text-sm font-bold ${item.color}`}>{item.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}
