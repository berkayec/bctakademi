import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Microscope, Cpu, Search, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, useScroll, useSpring, useMotionValue } from 'framer-motion';
import { HeroInteractiveCanvas } from '@/components/HeroInteractiveCanvas';
import { RootLayout } from '@/components/layout/RootLayout';

export function HomePage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const { scrollYProgress } = useScroll();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) navigate(`/dersler?q=${encodeURIComponent(searchValue)}`);
  };

  return (
    <RootLayout>
      <div className="flex flex-col relative bg-[#0a0e1a]">
        <section className="relative pt-0 pb-24 md:pb-48 overflow-hidden min-h-[90vh] flex flex-col">
          <div className="absolute inset-0 z-0"><HeroInteractiveCanvas /></div>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="relative w-full z-10 overflow-hidden">
            <div className="relative w-full h-[200px] md:h-[350px]">
              <img src="https://i.imgur.com/QesRWrO.jpg" className="w-full h-full object-cover" alt="Banner" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0e1a]" />
            </div>
          </motion.div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full -mt-12 md:-mt-16">
            <div className="text-center space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
                <h1 className="text-4xl md:text-7xl font-display font-black text-white mb-6 tracking-tight leading-[1.1]">
                  Geleceğin Sağlık <br className="hidden md:block" />
                  <span className="text-orange-500">Teknolojisini Keşfet</span>
                </h1>
                <p className="max-w-xl mx-auto text-[8px] md:text-xs text-[#2dd4bf] font-black tracking-[0.4em] md:tracking-[0.6em] uppercase mb-8">
                  BİYOMEDİKAL CİHAZ TEKNOLOJİLERİ EĞİTİM PLATFORMU
                </p>
                <p className="max-w-2xl mx-auto text-base md:text-xl text-slate-400 leading-relaxed px-4">
                  Türkiye'nin en kapsamlı biyomedikal eğitim platformu. Profesyonel içeriklerle uzmanlığınızı şekillendirin.
                </p>
              </motion.div>

              <div className="max-w-2xl mx-auto px-4">
                <form onSubmit={handleSearch} className="relative flex p-1.5 bg-white rounded-2xl shadow-2xl">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    placeholder="Ders ara..." 
                    className="h-12 md:h-16 pl-12 border-none text-slate-900 bg-transparent text-lg focus-visible:ring-0" 
                    value={searchValue} 
                    onChange={e => setSearchValue(e.target.value)} 
                  />
                  <Button type="submit" className="hidden md:flex bg-orange-500 h-12 md:h-14 px-8 rounded-xl font-bold text-white border-none">Ara</Button>
                </form>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 pt-4">
                <Link to="/dersler" className="w-full sm:w-auto">
                  <Button className="w-full h-14 md:h-16 px-10 bg-orange-500 text-white font-bold text-lg rounded-xl border-none shadow-lg">Eğitimlere Göz At</Button>
                </Link>
                <Link to="/blog" className="w-full sm:w-auto">
                  <Button className="w-full h-14 md:h-16 px-10 bg-slate-800 text-white font-bold rounded-xl text-lg border-none shadow-lg">BCT Blog</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: ShieldCheck, title: "Profesyonel İçerik", desc: "Endüstri odaklı derinlemesine teknik incelemeler." },
                { icon: Microscope, title: "Teknik Derinlik", desc: "Sensörlerden klinik mühendislik uygulamalarına." },
                { icon: Cpu, title: "Modern Teknoloji", desc: "Yeni nesil görüntüleme ve yaşam destek üniteleri." }
              ].map((f, i) => (
                <div key={i} className="p-10 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all">
                  <div className="w-14 h-14 rounded-xl bg-orange-500 flex items-center justify-center text-white mb-6"><f.icon className="w-7 h-7" /></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </RootLayout>
  );
}
