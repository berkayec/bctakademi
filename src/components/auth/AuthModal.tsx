import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ShieldCheck, GraduationCap, UserCircle } from 'lucide-react';
import { useUserStore } from '@/store/use-user-store';
import { toast } from 'sonner';
import { Logo } from '@/components/Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UserRole = 'student' | 'teacher' | 'pro' | 'other' | '';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const login = useUserStore((s) => s.login);
  const signup = useUserStore((s) => s.signup);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    role: '' as UserRole,
    extraDetail: '' 
  });

  const validateEmail = (email: string) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const handleAuth = async (type: 'login' | 'signup') => {
    if (!formData.username.trim()) {
      toast.error("Lütfen adınızı veya kullanıcı adınızı girin.");
      return;
    }
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      toast.error("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    if (type === 'signup') {
      if (!formData.role) {
        toast.error("Lütfen bir rol seçin.");
        return;
      }
      if (formData.role !== 'other' && !formData.extraDetail) {
        toast.error("Lütfen ilgili alan bilgisini (okul/kurum) girin.");
        return;
      }
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    if (type === 'login') {
      login(formData.username, formData.email);
      toast.success(`Tekrar hoş geldin, ${formData.username}!`);
    } else {
      signup(formData.username, formData.email, { role: formData.role, detail: formData.extraDetail });
      toast.success(`Aramıza hoş geldin! Kayıt bonusu (+150 XP) tanımlandı.`);
    }
    
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[850px] p-0 overflow-hidden border-none rounded-[2rem] sm:rounded-[2.5rem] bg-white shadow-2xl focus:outline-none">
        <DialogTitle className="sr-only">BCT Akademi - Giriş / Kayıt</DialogTitle>
        <DialogDescription className="sr-only">Hesabınıza giriş yapın veya yeni üye olun.</DialogDescription>
        
        <div className="flex flex-col md:flex-row min-h-[550px] sm:min-h-[600px]">
          {/* SOL PANEL */}
          <div className="hidden md:flex md:w-5/12 bg-slate-950 p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
            <div className="relative z-10">
              <div className="mb-10"><Logo size={48} /></div>
              <h2 className="text-3xl font-display font-bold text-white mb-6 leading-tight">Geleceğin Sağlık Teknolojisine Adım At</h2>
              <p className="text-slate-400">Müfredat uyumlu içeriklerimizle kariyerini bir üst seviyeye taşı.</p>
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400"><ShieldCheck className="w-4 h-4" /></div>
                Profesyonel Sertifikasyon
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400"><GraduationCap className="w-4 h-4" /></div>
                Tüm Seviyelere Eğitim
              </div>
            </div>
          </div>

          {/* SAĞ PANEL */}
          <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center bg-white overflow-y-auto">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 rounded-2xl p-1.5 h-12 sm:h-14">
                <TabsTrigger value="login" className="rounded-xl font-bold data-[state=active]:bg-slate-950 data-[state=active]:text-white">Giriş</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-xl font-bold data-[state=active]:bg-slate-950 data-[state=active]:text-white">Kayıt Ol</TabsTrigger>
              </TabsList>

              {/* GİRİŞ FORMU */}
              <TabsContent value="login" className="space-y-4 outline-none">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="l-user" className="ml-1 font-bold text-slate-700 text-sm">Kullanıcı Adı veya E-posta</Label>
                    {/* Yazı rengi düzeltildi: text-slate-950 */}
                    <Input id="l-user" placeholder="kullanici@mail.com" className="rounded-xl h-12 border-slate-200 text-slate-950" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                  </div>
                </div>
                <Button disabled={loading} className="w-full bg-slate-950 hover:bg-slate-900 h-14 rounded-xl font-bold text-white mt-4" onClick={() => handleAuth('login')}>
                  {loading ? "Giriş Yapılıyor..." : "Hemen Giriş Yap"}
                </Button>
              </TabsContent>

              {/* KAYIT FORMU */}
              <TabsContent value="signup" className="space-y-4 outline-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="s-user" className="ml-1 font-bold text-slate-700 text-sm">Ad Soyad</Label>
                    {/* Yazı rengi düzeltildi: text-slate-950 */}
                    <Input id="s-user" placeholder="Ad Soyad" className="rounded-xl h-11 border-slate-200 text-slate-950" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s-email" className="ml-1 font-bold text-slate-700 text-sm">E-posta</Label>
                    {/* Yazı rengi düzeltildi: text-slate-950 */}
                    <Input id="s-email" type="email" placeholder="ornek@bct.com" className="rounded-xl h-11 border-slate-200 text-slate-950" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="ml-1 font-bold text-slate-700 text-sm text-orange-600">Sizi Tanıyalım: Mevcut Rolünüz?</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'student', label: 'Öğrenci', icon: GraduationCap },
                      { id: 'teacher', label: 'Eğitimci', icon: UserCircle },
                      { id: 'pro', label: 'Sektör Çalışanı', icon: ShieldCheck },
                      { id: 'other', label: 'Diğer', icon: UserCircle },
                    ].map((roleItem) => (
                      <button
                        key={roleItem.id}
                        type="button"
                        onClick={() => setFormData({...formData, role: roleItem.id as UserRole, extraDetail: ''})}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-xs font-bold ${
                          formData.role === roleItem.id 
                            ? 'border-orange-500 bg-orange-50/50 text-orange-700' 
                            : 'border-slate-100 hover:border-slate-200 text-slate-500'
                        }`}
                      >
                        <roleItem.icon className="w-4 h-4" />
                        {roleItem.label}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.role === 'student' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label className="ml-1 font-bold text-slate-700 text-sm">Eğitim Seviyesi</Label>
                    {/* Select yazı rengi düzeltildi: text-slate-950 */}
                    <select 
                      className="w-full h-11 rounded-xl border-2 border-slate-100 px-3 text-sm font-medium focus:border-orange-500 outline-none text-slate-950"
                      value={formData.extraDetail}
                      onChange={e => setFormData({...formData, extraDetail: e.target.value})}
                    >
                      <option value="">Seviye Seçin</option>
                      <option value="ortaokul">Ortaokul</option>
                      <option value="lise">Lise</option>
                      <option value="universite">Üniversite / Mezun</option>
                    </select>
                  </div>
                )}

                {(formData.role === 'teacher' || formData.role === 'pro') && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label className="ml-1 font-bold text-slate-700 text-sm">
                      {formData.role === 'teacher' ? 'Görev Yaptığınız Kurum' : 'Çalıştığınız Şirket/Hastane'}
                    </Label>
                    {/* Dinamik input yazı rengi düzeltildi: text-slate-950 */}
                    <Input 
                      placeholder="Kurum adını yazınız..." 
                      className="rounded-xl h-11 border-slate-200 text-slate-950" 
                      value={formData.extraDetail} 
                      onChange={e => setFormData({...formData, extraDetail: e.target.value})} 
                    />
                  </div>
                )}

                <Button disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 h-14 rounded-xl font-bold text-white mt-2 shadow-xl shadow-orange-500/20 transition-all active:scale-95" onClick={() => handleAuth('signup')}>
                  {loading ? "Kaydolunuyor..." : "Akademiye Katıl (+150 XP)"}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
