import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { RootLayout } from '@/components/layout/RootLayout';

export function ContactPage() {
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Mesajınız iletildi! En kısa sürede döneceğiz.");
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white md:text-slate-900 tracking-tight">Bize Ulaşın</h1>
          <p className="text-lg text-slate-400 md:text-slate-600 leading-relaxed font-medium">
            BCT Akademi ile ilgili sorularınız veya destek talepleriniz için yanınızdayız.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          <div className="order-2 lg:order-1">
            <Card className="border-none shadow-2xl bg-white rounded-[2rem] md:rounded-[2.5rem]">
              <CardContent className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Ad Soyad</label>
                      <Input required className="rounded-xl border-slate-200 h-12 bg-slate-50/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">E-posta</label>
                      <Input required type="email" className="rounded-xl border-slate-200 h-12 bg-slate-50/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Konu</label>
                    <Input required className="rounded-xl border-slate-200 h-12 bg-slate-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Mesajınız</label>
                    <Textarea required className="rounded-xl border-slate-200 min-h-[150px] bg-slate-50/50 pt-3" />
                  </div>
                  <Button disabled={loading} className="w-full bg-slate-900 hover:bg-orange-500 text-white h-14 rounded-xl font-bold text-lg transition-all shadow-xl">
                    {loading ? "Gönderiliyor..." : "Mesajı Gönder"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="order-1 lg:order-2 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white md:text-slate-900 mb-6">İletişim Bilgileri</h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: Mail, label: "E-posta", value: "akademi@bctakademi.com", color: "bg-orange-500" },
                  { icon: Phone, label: "Telefon", value: "+90 (212) 555 01 01", color: "bg-teal-500" },
                  { icon: MapPin, label: "Ofis", value: "İstanbul, Türkiye", color: "bg-slate-800" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 items-center p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-white shrink-0`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                      <p className="text-base font-bold text-slate-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 rounded-[2rem] p-4 h-48 md:h-64 relative overflow-hidden border border-slate-800 shadow-inner">
               <div className="absolute inset-0 flex items-center justify-center opacity-20"><MapPin className="w-20 h-20 text-white" /></div>
               <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 text-xs font-bold uppercase tracking-widest">Harita Yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
