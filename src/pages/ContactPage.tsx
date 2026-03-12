import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export function ContactPage() {
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Mesajınız BCT Akademi'ye iletildi! En kısa sürede size döneceğiz.");
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="bg-[#0a0e1a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        {/* BAŞLIK BÖLÜMÜ */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Bize Ulaşın
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed font-medium">
            BCT Akademi eğitim portalımızla ilgili sorularınız, teknik destek talepleriniz veya kurumsal iş birlikleri için yanınızdayız.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          {/* İLETİŞİM FORMU */}
          <div className="order-2 lg:order-1">
            <Card className="border-none shadow-2xl bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5">
              <CardContent className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-300 ml-1">Ad Soyad</label>
                      <Input 
                        required 
                        placeholder="Örn: Ahmet Yılmaz" 
                        className="rounded-xl border-slate-800 bg-slate-950/50 text-white focus-visible:ring-orange-500 h-12" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-300 ml-1">E-posta</label>
                      <Input 
                        required 
                        type="email" 
                        placeholder="ahmet@ornek.com" 
                        className="rounded-xl border-slate-800 bg-slate-950/50 text-white focus-visible:ring-orange-500 h-12" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 ml-1">Konu</label>
                    <Input 
                      required 
                      placeholder="Mesajınızın konusu" 
                      className="rounded-xl border-slate-800 bg-slate-950/50 text-white focus-visible:ring-orange-500 h-12" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 ml-1">Mesajınız</label>
                    <Textarea 
                      required 
                      placeholder="Size nasıl yardımcı olabiliriz?" 
                      className="rounded-xl border-slate-800 bg-slate-950/50 text-white focus-visible:ring-orange-500 min-h-[150px] pt-3" 
                    />
                  </div>
                  <Button 
                    disabled={loading} 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white h-14 rounded-xl font-bold text-lg transition-all active:scale-95 border-none shadow-xl shadow-orange-500/20"
                  >
                    {loading ? "Gönderiliyor..." : <><Send className="w-5 h-5 mr-2" /> Mesajı Gönder</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* İLETİŞİM BİLGİLERİ */}
          <div className="order-1 lg:order-2 flex flex-col justify-between space-y-8">
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white mb-6">İletişim Bilgileri</h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: Mail, label: "E-posta", value: "akademi@bctakademi.com", sub: "7/24 Akademik Destek", color: "bg-orange-500/10 text-orange-500" },
                  { icon: Phone, label: "Telefon", value: "+90 (212) 555 01 01", sub: "Hafta içi 09:00 - 18:00", color: "bg-teal-500/10 text-teal-400" },
                  { icon: MapPin, label: "Ofis", value: "Biyomedikal Teknoloji Vadisi", sub: "İstanbul, Türkiye", color: "bg-slate-800 text-slate-300" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 items-start p-6 rounded-3xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 transition-all group">
                    <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-lg font-bold text-white">{item.value}</p>
                      <p className="text-sm text-slate-400 font-medium">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HARİTA PLACEHOLDER */}
            <div className="bg-slate-900 rounded-[2.5rem] p-4 h-48 md:h-64 relative overflow-hidden border border-slate-800 shadow-inner group">
               <div className="absolute inset-0 flex items-center justify-center opacity-20">
                 <MapPin className="w-20 h-20 text-white transition-transform group-hover:scale-110 duration-500" />
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
               <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                 Harita Yükleniyor...
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
