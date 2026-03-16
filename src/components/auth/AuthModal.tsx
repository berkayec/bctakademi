import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ShieldCheck, GraduationCap, UserCircle, ArrowLeft, MailCheck } from 'lucide-react';
import { useUserStore } from '@/store/use-user-store';
import { toast } from 'sonner';
import { Logo } from '@/components/Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UserRole = 'student' | 'teacher' | 'pro' | 'other' | '';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const login  = useUserStore((s) => s.login);
  const signup = useUserStore((s) => s.signup);

  const [loading, setLoading] = useState(false);
  const [step, setStep]       = useState<'form' | 'verify'>('form');
  const [verificationCode, setVerificationCode] = useState('');

  const [formData, setFormData] = useState({
    username:    '',
    email:       '',
    role:        '' as UserRole,
    extraDetail: '',
  });

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ── Login ────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    const email = formData.username.trim(); // email veya username alanı email alıyor
    if (!email || !validateEmail(email)) {
      toast.error('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    setLoading(true);
    try {
      const res    = await fetch('/api/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });
      const result = await res.json();

      if (result.success && result.data) {
        const u = result.data;
        login({
          username: u.username,
          email:    u.email,
          role:     u.role,
          detail:   u.detail,
          status:   u.status,
        });
        toast.success(`Tekrar hoş geldin, ${u.username}! 👋`);
        onClose();
      } else {
        toast.error(result.error || 'Bu e-posta ile kayıtlı hesap bulunamadı.');
      }
    } catch {
      toast.error('Sunucuya bağlanılamadı.');
    }
    setLoading(false);
  };

  // ── Kayıt ────────────────────────────────────────────────────────────────
  const handleSignup = async () => {
    if (!formData.username.trim()) {
      toast.error('Lütfen adınızı girin.');
      return;
    }
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      toast.error('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          username: formData.username,
          email:    formData.email,
          role:     formData.role,
          detail:   formData.extraDetail,
        }),
      });
      const result = await res.json();

      if (result.success) {
        toast.success('Doğrulama kodu e-postana gönderildi!');
        setStep('verify');
      } else {
        toast.error(result.error || 'Bir hata oluştu.');
      }
    } catch {
      toast.error('Sunucuya bağlanılamadı.');
    }
    setLoading(false);
  };

  // ── Kod Doğrulama ────────────────────────────────────────────────────────
  const handleVerify = async () => {
    if (verificationCode.length < 6) {
      toast.error('Lütfen 6 haneli kodu girin.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/verify', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: formData.email, code: verificationCode }),
      });
      const result = await res.json();

      if (result.success) {
        // Kullanıcıyı store'a pending_admin olarak kaydet
        signup(formData.username, formData.email, {
          role:   formData.role,
          detail: formData.extraDetail,
          status: 'pending_admin',
        });
        toast.success('E-posta doğrulandı! Admin onayı bekleniyor.');
        onClose();
      } else {
        toast.error(result.error || 'Hatalı veya süresi dolmuş kod.');
      }
    } catch {
      toast.error('Doğrulama yapılamadı.');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setStep('form');
    setVerificationCode('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); resetForm(); } }}>
      <DialogContent className="max-w-[95vw] sm:max-w-[850px] p-0 overflow-hidden border-none rounded-[2rem] sm:rounded-[2.5rem] bg-background shadow-2xl focus:outline-none">
        <DialogTitle className="sr-only">BCT Akademi — Giriş / Kayıt</DialogTitle>
        <DialogDescription className="sr-only">Hesabınıza giriş yapın veya yeni üye olun.</DialogDescription>

        <div className="flex flex-col md:flex-row min-h-[550px] sm:min-h-[600px]">

          {/* SOL PANEL — her zaman koyu */}
          <div className="hidden md:flex md:w-5/12 bg-slate-950 p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
            <div className="relative z-10">
              <div className="mb-10"><Logo size={48} /></div>
              <h2 className="text-3xl font-display font-bold text-white mb-6 leading-tight">
                Geleceğin Sağlık Teknolojisine Adım At
              </h2>
              <p className="text-slate-400">Müfredat uyumlu içeriklerimizle kariyerini bir üst seviyeye taşı.</p>
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                Profesyonel Sertifikasyon
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                Tüm Seviyelere Eğitim
              </div>
            </div>
          </div>

          {/* SAĞ PANEL — temaya uyumlu */}
          <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center bg-card overflow-y-auto">
            {step === 'form' ? (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted rounded-2xl p-1.5 h-12 sm:h-14">
                  <TabsTrigger value="login" className="rounded-xl font-bold data-[state=active]:bg-foreground data-[state=active]:text-background">
                    Giriş
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-xl font-bold data-[state=active]:bg-foreground data-[state=active]:text-background">
                    Kayıt Ol
                  </TabsTrigger>
                </TabsList>

                {/* GİRİŞ */}
                <TabsContent value="login" className="space-y-4 outline-none">
                  <div className="space-y-2">
                    <Label htmlFor="l-email" className="ml-1 font-bold text-foreground/80 text-sm">
                      E-posta Adresiniz
                    </Label>
                    <Input
                      id="l-email"
                      type="email"
                      placeholder="kullanici@mail.com"
                      className="rounded-xl h-12 border-border bg-background text-foreground"
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    />
                  </div>
                  <Button
                    disabled={loading}
                    className="w-full bg-foreground hover:bg-foreground/90 text-background h-14 rounded-xl font-bold mt-4"
                    onClick={handleLogin}
                  >
                    {loading ? 'Giriş Yapılıyor...' : 'Hemen Giriş Yap'}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground pt-2">
                    Kayıtlı e-posta adresinizi girin. Şifre gerekmez.
                  </p>
                </TabsContent>

                {/* KAYIT */}
                <TabsContent value="signup" className="space-y-4 outline-none">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="s-name" className="ml-1 font-bold text-foreground/80 text-sm">Ad Soyad</Label>
                      <Input
                        id="s-name"
                        placeholder="Ad Soyad"
                        className="rounded-xl h-11 border-border bg-background text-foreground"
                        value={formData.username}
                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="s-email" className="ml-1 font-bold text-foreground/80 text-sm">E-posta</Label>
                      <Input
                        id="s-email"
                        type="email"
                        placeholder="ornek@bct.com"
                        className="rounded-xl h-11 border-border bg-background text-foreground"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="ml-1 font-bold text-orange-500 text-sm">Mevcut Rolünüz?</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'student', label: 'Öğrenci',         icon: GraduationCap },
                        { id: 'teacher', label: 'Eğitimci',         icon: UserCircle },
                        { id: 'pro',     label: 'Sektör Çalışanı', icon: ShieldCheck },
                        { id: 'other',   label: 'Diğer',            icon: UserCircle },
                      ].map(r => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, role: r.id as UserRole, extraDetail: '' })}
                          className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-xs font-bold ${
                            formData.role === r.id
                              ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                              : 'border-border hover:border-border/60 text-muted-foreground'
                          }`}
                        >
                          <r.icon className="w-4 h-4" />
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.role === 'student' && (
                    <div className="space-y-2">
                      <Label className="ml-1 font-bold text-foreground/80 text-sm">Eğitim Seviyesi</Label>
                      <select
                        className="w-full h-11 rounded-xl border-2 border-border px-3 text-sm font-medium focus:border-orange-500 outline-none bg-background text-foreground"
                        value={formData.extraDetail}
                        onChange={e => setFormData({ ...formData, extraDetail: e.target.value })}
                      >
                        <option value="">Seviye Seçin</option>
                        <option value="ortaokul">Ortaokul</option>
                        <option value="lise">Lise</option>
                        <option value="universite">Üniversite / Mezun</option>
                      </select>
                    </div>
                  )}

                  {(formData.role === 'teacher' || formData.role === 'pro') && (
                    <div className="space-y-2">
                      <Label className="ml-1 font-bold text-foreground/80 text-sm">
                        {formData.role === 'teacher' ? 'Görev Yaptığınız Kurum' : 'Çalıştığınız Şirket/Hastane'}
                      </Label>
                      <Input
                        placeholder="Kurum adını yazınız..."
                        className="rounded-xl h-11 border-border bg-background text-foreground"
                        value={formData.extraDetail}
                        onChange={e => setFormData({ ...formData, extraDetail: e.target.value })}
                      />
                    </div>
                  )}

                  <Button
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 h-14 rounded-xl font-bold text-white mt-2 shadow-xl shadow-orange-500/20 transition-all active:scale-95 border-none"
                    onClick={handleSignup}
                  >
                    {loading ? 'Kaydolunuyor...' : 'Akademiye Katıl (+150 XP)'}
                  </Button>
                </TabsContent>
              </Tabs>
            ) : (
              /* ONAY KODU */
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MailCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">E-postanı Kontrol Et</h3>
                  <p className="text-muted-foreground text-sm">
                    <strong className="text-foreground">{formData.email}</strong> adresine 6 haneli bir doğrulama kodu gönderdik.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="ml-1 font-bold text-foreground/80 text-sm">Doğrulama Kodu</Label>
                  <Input
                    placeholder="000000"
                    className="rounded-xl h-14 text-center text-2xl tracking-[1em] font-bold border-border bg-background text-foreground"
                    maxLength={6}
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={e => e.key === 'Enter' && handleVerify()}
                  />
                </div>

                <div className="space-y-3">
                  <Button
                    disabled={loading}
                    className="w-full bg-foreground text-background h-14 rounded-xl font-bold hover:bg-foreground/90"
                    onClick={handleVerify}
                  >
                    {loading ? 'Doğrulanıyor...' : 'Kodu Onayla'}
                  </Button>
                  <button
                    onClick={resetForm}
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Bilgileri Düzenle
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
