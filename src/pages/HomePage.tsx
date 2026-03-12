import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Microscope, Cpu, Search, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, useScroll, useSpring } from 'framer-motion';
import { HeroInteractiveCanvas } from '@/components/HeroInteractiveCanvas';

export function HomePage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const { scrollYProgress } = useScroll();

  // Sayfa ilerleme çubuğu
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) navigate(`/dersler?q=${encodeURIComponent(searchValue)}`);
  };

  return (
    // bg-[#0a0e1a] -> bg-background | text-foreground eklendi
    <div className="flex flex-col relative bg-background text-foreground transition-colors duration-300">
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-orange-500 origin-left z-[100]" 
        style={{ scaleX }} 
      />

      {/* HERO SECTION */}
      <section className="relative pt-0 pb-24 md:pb-48 overflow-hidden min-h-[90vh] flex flex-col">
        {/* İnteraktif Arka Plan Kanvası */}
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-60 md:opacity-100">
          <HeroInteractiveCanvas />
        </div>
        
        {/* Üst Banner Görseli */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1.5 }} 
          className="relative w-full z-10 overflow-hidden"
        >
          <div className="relative w-full h-[220px] md:h-[350px]">
            <img 
              src="https://i.imgur.com/QesRWrO.jpg" 
              className="w-full h-full object-cover grayscale-[20%] dark:grayscale-0" 
              alt="BCT Banner" 
            />
            {/* Alt tarafa doğru yumuşak geçiş - bg-background'a bağlandı */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
          </div>
        </motion.div>

        {/* Ana İçerik Alanı */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full -mt-16 md:-mt-20">
          <div className="text-center space-y-10">
            
            {/* Başlık Grubu */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              {/* text-white -> text-foreground */}
              <h1 className="text-4xl md:text-8xl font-display font-black text-foreground mb-6 tracking-tight leading-[1.1] drop-shadow-2xl">
                Geleceğin Sağlık <br className="hidden md:block" />
                <span className="text-orange-500">Teknolojisini Keşfet</span>
              </h1>
              
              <p className="max-w-xl mx-auto text-[9px] md:text-xs text-teal-500 dark:text-[#2dd4bf] font-black tracking-[0.4em] md:tracking-[0.6em] uppercase mb-8 transition-colors">
                BİYOMEDİKAL CİHAZ TEKNOLOJİLERİ EĞİTİM PLATFORMU
              </p>
              
              {/* text-slate-400 -> text-muted-foreground */}
              <p className="max-w-2xl mx-auto text-base md:text-xl text-muted-foreground leading-relaxed px-4 font-medium transition-colors">
                Türkiye'nin en kapsamlı biyomedikal eğitim platformu. <br className="hidden md:block" /> 
                Profesyonel teknik içeriklerle uzmanlığınızı şekillendirin.
              </p>
            </motion.div>

            {/* Arama Kutusu */}
            <div className="max-w-2xl mx-auto px-4">
              {/* bg-white/95 -> bg-card/95 | shadow-black/30 -> shadow-lg */}
              <form onSubmit={handleSearch} className="relative flex p-1.5 bg-card/95 backdrop-blur-md rounded-[2rem] shadow-2xl group transition-all border border-border">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
                <Input 
                  placeholder="Cihaz veya teknik konu ara..." 
                  className="h-14 md:h-16 pl-14 md:pl-16 border-none text-foreground bg-transparent text-lg focus-visible:ring-0 placeholder:text-muted-foreground font-semibold" 
                  value={searchValue} 
                  onChange={e => setSearchValue(e.target.value)} 
                />
                <Button 
                  type="submit" 
                  className="hidden sm:flex bg-orange-500 hover:bg-orange-600 h-13 md:h-14 px-10 rounded-2xl font-bold text-white border-none shadow-xl transition-all active:scale-95"
                >
                  Ara
                </Button>
              </form>
            </div>

            {/* Ana Butonlar */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 px-4 pt-6">
              <Link to="/dersler" className="w-full sm:w-auto">
                <Button className="w-full h-16 md:h-20 px-12 bg-orange-500 hover:bg-orange-600 text-white font-black text-xl rounded-2xl border-none shadow-2xl transition-transform hover:scale-[1.03] active:scale-95">
                  EĞİTİMLERE GÖZ AT
                </Button>
              </Link>
              <Link to="/blog" className="w-full sm:w-auto">
                {/* bg-slate-800 -> bg-secondary */}
                <Button className="w-full h-16 md:h-20 px-12 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-black rounded-2xl text-xl border-none shadow-xl transition-transform hover:scale-[1.03] active:scale-95">
                  <Newspaper className="mr-3 w-6 h-6" /> BCT BLOG
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ÖZELLİKLER BÖLÜMÜ (TEMAYA DUYARLI GEÇİŞ) */}
      {/* bg-white -> bg-muted/30 */}
      <section className="py-24 md:py-32 bg-muted/30 border-t border-border transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: ShieldCheck, title: "Profesyonel İçerik", desc: "Endüstri odaklı derinlemesine teknik incelemeler ve bakım protokolleri." },
              { icon: Microscope, title: "Teknik Derinlik", desc: "Sensörlerden klinik mühendislik uygulamalarına kadar her şey." },
              { icon: Cpu, title: "Modern Teknoloji", desc: "Yeni nesil görüntüleme sistemleri ve modern yaşam destek üniteleri." }
            ].map((f, i) => (
              <div key={i} className="group p-10 rounded-[2.5rem] bg-card border border-border hover:shadow-2xl transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center text-white mb-8 shadow-lg shadow-orange-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <f.icon className="w-8 h-8" />
                </div>
                {/* text-slate-900 -> text-foreground */}
                <h3 className="text-2xl font-bold text-foreground mb-4 tracking-tight transition-colors">{f.title}</h3>
                {/* text-slate-600 -> text-muted-foreground */}
                <p className="text-muted-foreground text-base leading-relaxed font-medium transition-colors">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
