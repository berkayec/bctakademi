import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Mail, Briefcase, GraduationCap, Edit3, Save, X,
  Trophy, BookOpen, Star, Clock, ChevronRight, Shield,
  CheckCircle2, TrendingUp, FileText, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUserStore, getUserTitle } from '@/store/use-user-store';
import { curriculum } from '@/lib/curriculum';

const ROLE_LABELS: Record<string, string> = {
  student: 'Öğrenci',
  teacher: 'Eğitimci',
  pro: 'Sektör Çalışanı',
  other: 'Diğer',
};

const LEVEL_CONFIG = [
  { title: 'BCT Çırağı',            min: 0,    max: 500,  color: 'from-slate-400 to-slate-600',   bg: 'bg-slate-500/10',   text: 'text-slate-500' },
  { title: 'BCT Teknisyeni',        min: 500,  max: 1500, color: 'from-teal-400 to-teal-600',     bg: 'bg-teal-500/10',    text: 'text-teal-500' },
  { title: 'Klinik Mühendis Adayı', min: 1500, max: 3000, color: 'from-orange-400 to-orange-600', bg: 'bg-orange-500/10',  text: 'text-orange-500' },
  { title: 'Uzman Biyomedikalci',   min: 3000, max: 5000, color: 'from-purple-400 to-purple-600', bg: 'bg-purple-500/10',  text: 'text-purple-500' },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ username: '', detail: '' });

  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return; }
    if (user) setForm({ username: user.username, detail: user.detail });
  }, [isAuthenticated, user, navigate]);

  if (!user) return null;

  const points       = user.points;
  const currentTitle = getUserTitle(points);
  const levelCfg     = LEVEL_CONFIG.find(l => l.title === currentTitle) || LEVEL_CONFIG[0];
  const nextThreshold = points < 500 ? 500 : points < 1500 ? 1500 : points < 3000 ? 3000 : 5000;
  const prevThreshold = points < 500 ? 0   : points < 1500 ? 500  : points < 3000 ? 1500 : 3000;
  const levelProgress = Math.min(((points - prevThreshold) / (nextThreshold - prevThreshold)) * 100, 100);

  // Tamamlanan dersler
  const allCourses = curriculum.flatMap(cat => cat.courses.map(c => ({ ...c, catId: cat.id })));
  const completedCourses = allCourses.filter(course =>
    course.units.length > 0 && course.units.every(u => user.completedUnits.includes(u.id))
  );
  const inProgressCourses = allCourses.filter(course =>
    course.units.some(u => user.completedUnits.includes(u.id)) &&
    !course.units.every(u => user.completedUnits.includes(u.id))
  );

  const handleSave = async () => {
    if (!form.username.trim()) { toast.error('Ad Soyad boş olamaz.'); return; }
    setSaving(true);
    try {
      await updateProfile({ username: form.username.trim(), detail: form.detail.trim() });
      toast.success('Profil güncellendi!');
      setIsEditing(false);
    } catch {
      toast.error('Güncelleme başarısız.');
    }
    setSaving(false);
  };

  const initials = user.username.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="bg-background min-h-screen transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">

        {/* ── ÜSTTE PROFIL KARTI ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
            {/* Arka plan dekorasyon */}
            <div className={`h-32 bg-gradient-to-r ${levelCfg.color} opacity-20`} />

            <CardContent className="px-8 pb-8 -mt-16 relative">
              {/* Avatar */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-6 mb-8">
                <div className={`w-28 h-28 rounded-[1.5rem] bg-gradient-to-br ${levelCfg.color} flex items-center justify-center text-3xl font-black text-white shadow-2xl border-4 border-background`}>
                  {initials}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">{user.username}</h1>
                    <Badge className={`${levelCfg.bg} ${levelCfg.text} border-none font-bold text-[10px] uppercase tracking-wider`}>
                      {currentTitle}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} disabled={saving} size="sm" className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl border-none gap-2">
                        <Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
                      </Button>
                      <Button onClick={() => { setIsEditing(false); setForm({ username: user.username, detail: user.detail }); }} size="sm" variant="ghost" className="rounded-xl gap-2">
                        <X className="w-4 h-4" /> İptal
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} size="sm" variant="outline" className="rounded-xl border-border gap-2 text-foreground">
                      <Edit3 className="w-4 h-4" /> Düzenle
                    </Button>
                  )}
                </div>
              </div>

              {/* Bilgiler */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sol: Düzenlenebilir bilgiler */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <User className="w-3.5 h-3.5" /> Ad Soyad
                    </Label>
                    {isEditing ? (
                      <Input
                        value={form.username}
                        onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                        className="rounded-xl border-border bg-muted/50 text-foreground h-11"
                      />
                    ) : (
                      <p className="text-foreground font-semibold">{user.username}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" /> E-posta
                    </Label>
                    <p className="text-foreground font-semibold">{user.email}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5" /> Rol
                    </Label>
                    <p className="text-foreground font-semibold">{ROLE_LABELS[user.role] || user.role}</p>
                  </div>

                  {(user.role === 'student' || user.role === 'teacher' || user.role === 'pro') && (
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {user.role === 'student' ? 'Eğitim Seviyesi' : 'Kurum'}
                      </Label>
                      {isEditing ? (
                        <Input
                          value={form.detail}
                          onChange={e => setForm(f => ({ ...f, detail: e.target.value }))}
                          placeholder={user.role === 'student' ? 'Eğitim seviyeniz' : 'Kurum adı'}
                          className="rounded-xl border-border bg-muted/50 text-foreground h-11"
                        />
                      ) : (
                        <p className="text-foreground font-semibold">{user.detail || '—'}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Sağ: XP ve seviye */}
                <div className="space-y-4">
                  <div className={`${levelCfg.bg} rounded-2xl p-6 border border-border`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-black uppercase tracking-widest ${levelCfg.text}`}>Akademik Seviye</span>
                      <Trophy className={`w-5 h-5 ${levelCfg.text}`} />
                    </div>
                    <p className="text-3xl font-black text-foreground mb-1">{points.toLocaleString()} XP</p>
                    <p className="text-xs text-muted-foreground mb-4">Sonraki seviye: {nextThreshold.toLocaleString()} XP</p>
                    <div className="h-2.5 bg-background/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${levelProgress}%` }}
                        transition={{ duration: 1.2, ease: 'circOut' }}
                        className={`h-full bg-gradient-to-r ${levelCfg.color} rounded-full`}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 text-right">%{Math.round(levelProgress)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Tamamlanan Ünite', value: user.completedUnits.length, icon: CheckCircle2, color: 'text-teal-500' },
                      { label: 'Erişilen Kaynak',  value: user.accessedResources.length, icon: FileText,    color: 'text-blue-500' },
                    ].map((s, i) => (
                      <div key={i} className="bg-muted/30 rounded-2xl p-4 border border-border text-center">
                        <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
                        <p className="text-xl font-black text-foreground">{s.value}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider leading-tight mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── DEVAM EDEN DERSLER ── */}
        {inProgressCourses.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Devam Eden Dersler
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
                            <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
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
              <Star className="w-5 h-5 text-teal-500" />
              Tamamlanan Dersler
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {completedCourses.map(course => (
                <div key={course.id} className="bg-card border border-teal-500/20 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-muted">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-sm truncate">{course.title}</p>
                    <p className="text-xs text-teal-500 font-bold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Tamamlandı
                    </p>
                  </div>
                  <Link to="/sertifikalar">
                    <Award className="w-5 h-5 text-teal-500 hover:text-teal-400 transition-colors" />
                  </Link>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── HIZLI ERİŞİM ── */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Hızlı Erişim
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Portala Git',   href: '/portal',       icon: Shield,    color: 'text-teal-500',   bg: 'bg-teal-500/10' },
              { label: 'Dersler',       href: '/dersler',      icon: BookOpen,  color: 'text-orange-500', bg: 'bg-orange-500/10' },
              { label: 'Sertifikalar',  href: '/sertifikalar', icon: Award,     color: 'text-purple-500', bg: 'bg-purple-500/10' },
              { label: 'Kaynaklar',     href: '/kaynaklar',    icon: FileText,  color: 'text-blue-500',   bg: 'bg-blue-500/10' },
            ].map((item, i) => (
              <Link key={i} to={item.href}>
                <div className={`${item.bg} border border-border rounded-2xl p-5 text-center hover:scale-[1.02] transition-all group`}>
                  <item.icon className={`w-6 h-6 ${item.color} mx-auto mb-3`} />
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
