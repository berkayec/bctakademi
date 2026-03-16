import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Mesajınız BCT Akademi'ye iletildi! En kısa sürede size döneceğiz.");
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(result.error || 'Mesaj gönderilemedi.');
      }
    } catch {
      toast.error('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
    }

    setLoading(false);
  };

  return (
    <div className="bg-background min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">

        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
            Bize Ulaşın
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-medium">
            BCT Akademi eğitim portalımızla ilgili sorularınız, teknik destek talepleriniz
            veya kurumsal iş birlikleri için yanınızdayız.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">

          {/* FORM */}
          <div className="order-2 lg:order-1">
            <Card className="border-none shadow-2xl bg-card rounded-[2.5rem] border border-border transition-colors">
              <CardContent className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground/80 ml-1">Ad Soyad</label>
                      <Input
                        required
                        placeholder="Örn: Ahmet Yılmaz"
                        className="rounded-xl border-border bg-muted/50 text-foreground focus-visible:ring-orange-500 h-12"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground/80 ml-1">E-posta</label>
                      <Input
                        required
                        type="email"
                        placeholder="ahmet@ornek.com"
                        className="rounded-xl border-border bg-muted/50 text-foreground focus-visible:ring-orange-500 h-12"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/80 ml-1">Konu</label>
                    <Input
                      required
                      placeholder="Mesajınızın konusu"
                      className="rounded-xl border-border bg-muted/50 text-foreground focus-visible:ring-orange-500 h-12"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/80 ml-1">Mesajınız</label>
                    <Textarea
                      required
                      placeholder="Size nasıl yardımcı olabiliriz?"
                      className="rounded-xl border-border bg-muted/50 text-foreground focus-visible:ring-orange-500 min-h-[150px] pt-3"
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                    />
                  </div>
                  <Button
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white h-14 rounded-xl font-bold text-lg transition-all active:scale-95 border-none shadow-xl shadow-orange-500/20"
                  >
                    {loading
                      ? 'Gönderiliyor...'
                      : <><Send className="w-5 h-5 mr-2" /> Mesajı Gönder</>
                    }
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* BİLGİLER */}
          <div className="order-1 lg:order-2 flex flex-col justify-between space-y-8">
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">İletişim Bilgileri</h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: Mail,   label: 'E-posta', value: 'akademi@bctakademi.com', sub: '7/24 Akademik Destek',      color: 'bg-orange-500/10 text-orange-500' },
                  { icon: Phone,  label: 'Telefon', value: '+90 (212) 555 01 01',    sub: 'Hafta içi 09:00 – 18:00', color: 'bg-teal-500/10 text-teal-500' },
                  { icon: MapPin, label: 'Ofis',    value: 'Biyomedikal Teknoloji Vadisi', sub: 'İstanbul, Türkiye',  color: 'bg-muted text-muted-foreground' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 items-start p-6 rounded-3xl border border-border bg-card/30 hover:bg-card/60 transition-all group">
                    <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-lg font-bold text-foreground">{item.value}</p>
                      <p className="text-sm text-muted-foreground font-medium">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Harita placeholder */}
            <div className="bg-muted rounded-[2.5rem] p-4 h-48 md:h-64 relative overflow-hidden border border-border shadow-inner group">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <MapPin className="w-20 h-20 text-foreground transition-transform group-hover:scale-110 duration-500" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                Harita Yükleniyor...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
