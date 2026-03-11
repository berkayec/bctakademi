import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ShieldCheck, GraduationCap } from 'lucide-react';
import { useUserStore } from '@/store/use-user-store';
import { toast } from 'sonner';
import { Logo } from '@/components/Logo';
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const login = useUserStore((s) => s.login);
  const signup = useUserStore((s) => s.signup);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const handleAuth = async (type: 'login' | 'signup') => {
    if (!formData.email || !formData.username) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (type === 'login') {
      login(formData.username, formData.email);
      toast.success(`Tekrar hoş geldin, ${formData.username}!`);
    } else {
      signup(formData.username, formData.email);
      toast.success(`Aramıza hoş geldin, ${formData.username}! Kayıt bonusu (+150 XP) tanımlandı.`);
    }
    setLoading(false);
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-none rounded-[2.5rem] bg-white shadow-2xl">
        <div className="flex flex-col md:flex-row min-h-[550px]">
          <div className="hidden md:flex md:w-1/2 bg-slate-950 p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10">
                <Logo size={48} />
                <span className="font-display font-bold text-2xl text-white tracking-tighter">BCTAkademi</span>
              </div>
              <h2 className="text-4xl font-display font-bold text-white mb-6 leading-tight">Geleceğin Sağlık Teknolojisine Adım At</h2>
              <p className="text-slate-400 text-lg">Müfredat uyumlu içeriklerimizle kariyerini bir üst seviyeye taşı.</p>
            </div>
            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
                   <ShieldCheck className="w-4 h-4" />
                </div>
                Profesyonel Sertifikasyon
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                Klinik Odaklı Eğitim
              </div>
            </div>
          </div>
          <div className="flex-1 p-10 flex flex-col justify-center">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-10 bg-slate-100 rounded-2xl p-1.5 h-14">
                <TabsTrigger value="login" className="rounded-xl font-bold text-base data-[state=active]:bg-white data-[state=active]:shadow-md">Giriş</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-xl font-bold text-base data-[state=active]:bg-white data-[state=active]:shadow-md">Kayıt Ol</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="l-user" className="ml-1 font-bold text-slate-700">Kullanıcı Adı</Label>
                    <Input id="l-user" placeholder="kullanici_adi" className="rounded-xl h-12 border-slate-200" onChange={e => setFormData({...formData, username: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="l-email" className="ml-1 font-bold text-slate-700">E-posta</Label>
                    <Input id="l-email" type="email" placeholder="ornek@bct.com" className="rounded-xl h-12 border-slate-200" onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                <Button disabled={loading} className="w-full bg-slate-950 hover:bg-slate-900 h-14 rounded-xl font-bold text-lg text-white mt-4 border-none shadow-xl" onClick={() => handleAuth('login')}>
                  {loading ? "Giriş Yapılıyor..." : "Hemen Giriş Yap"}
                </Button>
              </TabsContent>
              <TabsContent value="signup" className="space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="s-user" className="ml-1 font-bold text-slate-700">Adınız Soyadınız</Label>
                    <Input id="s-user" placeholder="Ad Soyad" className="rounded-xl h-12 border-slate-200" onChange={e => setFormData({...formData, username: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s-email" className="ml-1 font-bold text-slate-700">E-posta Adresiniz</Label>
                    <Input id="s-email" type="email" placeholder="ogrenci@bct.com" className="rounded-xl h-12 border-slate-200" onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                <Button disabled={loading} className="w-full bg-teal-500 hover:bg-teal-600 h-14 rounded-xl font-bold text-lg text-white mt-4 border-none shadow-xl shadow-teal-500/20" onClick={() => handleAuth('signup')}>
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