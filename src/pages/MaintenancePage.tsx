import React from 'react';
import { Hammer, Clock, Mail } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center transition-colors duration-300">
      <div className="absolute top-10">
        <Logo size={48} />
      </div>

      <div className="relative space-y-8 max-w-2xl">
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-orange-500/10 blur-[100px] rounded-full" />
          <div className="relative bg-card border border-border p-10 rounded-[3rem] shadow-2xl">
            <Hammer className="w-16 h-16 text-orange-500 animate-bounce" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-display font-black text-foreground tracking-tight leading-tight">
            Sistem Bakımda 🛠️
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-medium">
            Sizlere daha iyi bir eğitim deneyimi sunmak için altyapımızı güçlendiriyoruz. 
            Çok kısa bir süre sonra tekrar görüşmek üzere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
          <div className="bg-card/50 border border-border p-6 rounded-3xl flex items-center gap-4">
            <Clock className="w-6 h-6 text-teal-500" />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tahmini Süre</p>
              <p className="text-sm font-bold text-foreground">~2 Saat</p>
            </div>
          </div>
          <div className="bg-card/50 border border-border p-6 rounded-3xl flex items-center gap-4 text-left">
            <Mail className="w-6 h-6 text-orange-500" />
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Destek</p>
              <p className="text-sm font-bold text-foreground">akademi@bctakademi.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
