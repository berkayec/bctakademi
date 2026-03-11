import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
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
      toast.success("Mesajınız başarıyla iletildi! En kısa sürede size döneceğiz.");
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900">Bize Ulaşın</h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Eğitim portalımızla ilgili sorularınız, teknik destek talepleriniz veya kurumsal iş birlikleri için yanınızdayız.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <Card className="border-none shadow-xl bg-slate-50 rounded-[2rem]">
            <CardContent className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Adınız Soyadınız</label>
                    <Input required placeholder="Örn: Ahmet Yılmaz" className="rounded-xl border-slate-200 h-12 bg-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">E-posta Adresiniz</label>
                    <Input required type="email" placeholder="ahmet@örnek.com" className="rounded-xl border-slate-200 h-12 bg-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Konu</label>
                  <Input required placeholder="Mesajınızın konusu" className="rounded-xl border-slate-200 h-12 bg-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Mesajınız</label>
                  <Textarea required placeholder="Size nasıl yardımcı olabiliriz?" className="rounded-xl border-slate-200 min-h-[150px] bg-white pt-3" />
                </div>
                <Button disabled={loading} className="w-full bg-slate-900 hover:bg-teal-600 text-white h-14 rounded-xl font-bold text-lg transition-all active:scale-95">
                  {loading ? "Gönderiliyor..." : <><Send className="w-5 h-5 mr-2" /> Mesajı Gönder</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col justify-between space-y-12">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">İletişim Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              {[
                { icon: Mail, label: "E-posta", value: "destek@bctogretmeni.com", sub: "7/24 Teknik Destek" },
                { icon: Phone, label: "Telefon", value: "+90 (212) 555 01 01", sub: "Hafta içi 09:00 - 18:00" },
                { icon: MapPin, label: "Ofis", value: "Biyomedikal Teknoloji Vadisi", sub: "İstanbul, Türkiye" }
              ].map((item, i) => (
                <div key={i} className="flex gap-5 items-start p-6 rounded-3xl border border-slate-100 bg-white hover:border-teal-200 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-lg font-bold text-slate-900">{item.value}</p>
                    <p className="text-sm text-slate-500 font-medium">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-100 rounded-[2rem] p-4 h-64 relative overflow-hidden group">
            <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
               <div className="text-center">
                  <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500 font-bold">Harita Yükleniyor...</p>
               </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-blue-500/20 mix-blend-overlay group-hover:opacity-100 opacity-0 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
}