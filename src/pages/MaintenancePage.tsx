import React, { useState, useEffect } from 'react';
import { Hammer, Clock, Mail } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function MaintenancePage() {
  const [logoSize, setLogoSize] = useState(48);

  // window erişimi sadece mount sonrası — SSR/hydration crash'i önler
  useEffect(() => {
    setLogoSize(window.innerWidth < 640 ? 36 : 48);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 text-center transition-colors duration-300 relative overflow-hidden">

      <div className="absolute top-6 sm:top-10">
        <Logo size={logoSize} />
      </div>

      <div className="relative space-y-6 sm:space-y-10 max-w-2xl w-full">

        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-orange-500/10 blur-[80px] sm:blur-[100px] rounded-full" />
          <div className="relative bg-card border border-border p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-2xl transition-colors">
            <Hammer className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500 animate-bounce" />
          </div>
        </div>

        <div className="space-y-4 px-2">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-black text-foreground tracking-tight leading-tight">
            Sistem Bakımda 🛠️
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed font-medium max-w-lg mx-auto">
            Sizlere daha iyi bir eğitim deneyimi sunmak için altyapımızı güçlendiriyoruz.
            Çok kısa bir süre sonra tekrar görüşmek üzere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-8 text-left w-full max-w-xl mx-auto">

          <div className="bg-card/50 border border-border p-5 sm:p-6 rounded-2xl sm:rounded-3xl flex items-center gap-4 transition-colors">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tahmini Süre</p>
              <p className="text-sm sm:text-base font-bold text-foreground">~24 Saat</p>
            </div>
          </div>

          <div className="bg-card/50 border border-border p-5 sm:p-6 rounded-2xl sm:rounded-3xl flex items-center gap-4 transition-colors">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-black uppercase text-muted-foreground tracking-widest">Destek Hattı</p>
              <p className="text-sm sm:text-base font-bold text-foreground lowercase truncate">
                akademi@bctakademi.com
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
