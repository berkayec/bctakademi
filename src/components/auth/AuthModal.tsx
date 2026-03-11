import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Activity, ShieldCheck, GraduationCap } from 'lucide-react';
import { useUserStore } from '@/store/use-user-store';
import { toast } from 'sonner';
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
    // Mock delay
    await new Promise(r => setTimeout(r, 800));
    if (type === 'login') {
      login(formData.username, formData.email);
      toast.success(`Tekrar hoş geldin, ${formData.username}!`);
    } else {
      signup(formData.username, formData.email);
      toast.success(`Aramıza hoş geldin, ${formData.username}! Kayıt bonusu tanımlandı.`);
    }
    setLoading(false);
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-none rounded-[2rem]">
        <div className="flex flex-col md:flex-row h-[500px]">
          <div className="hidden md:flex md:w-1/2 bg-slate-950 p-10 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <Activity className="w-8 h-8 text-teal-400" />
                <span className="font-display font-bold text-2xl text-white">BCT Hub</span>
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">Eğitimde Yeni Boyut</h2>
              <p className="text-slate-400">Biyomedikal dünyasına adım at, puanları topla ve uzmanlık unvanını kazan.</p>
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <ShieldCheck className="w-5 h-5 text-teal-400" /> MEB Müfredat Uyumu
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <GraduationCap className="w-5 h-5 text-teal-400" /> Akademik Sertifikasyon
              </div>
            </div>
          </div>
          <div className="flex-1 p-8 bg-white">
            <Tabs defaultValue="login" className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 rounded-xl p-1">
                <TabsTrigger value="login" className="rounded-lg font-bold">Giriş Yap</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg font-bold">Kayıt Ol</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="space-y-6 flex-1 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="l-user">Kullanıcı Adı</Label>
                    <Input id="l-user" placeholder="ahmet_bct" className="rounded-xl h-12" onChange={e => setFormData({...formData, username: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="l-email">E-posta</Label>
                    <Input id="l-email" type="email" placeholder="ahmet@example.com" className="rounded-xl h-12" onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                <Button disabled={loading} className="w-full bg-slate-900 h-14 rounded-xl font-bold text-lg" onClick={() => handleAuth('login')}>
                  {loading ? "Giriş Yapılıyor..." : "Hemen Giriş Yap"}
                </Button>
              </TabsContent>
              <TabsContent value="signup" className="space-y-6 flex-1 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="s-user">Kullanıcı Adı</Label>
                    <Input id="s-user" placeholder="Yeni Öğrenci" className="rounded-xl h-12" onChange={e => setFormData({...formData, username: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s-email">E-posta</Label>
                    <Input id="s-email" type="email" placeholder="bct@gelecek.com" className="rounded-xl h-12" onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                <Button disabled={loading} className="w-full bg-teal-500 hover:bg-teal-600 h-14 rounded-xl font-bold text-lg text-white" onClick={() => handleAuth('signup')}>
                  {loading ? "Kaydolunuyor..." : "Hesap Oluştur"}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}