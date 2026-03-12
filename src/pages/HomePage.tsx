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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX - innerWidth / 2);
    mouseY.set(clientY - innerHeight / 2);
  };
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/dersler?q=${encodeURIComponent(searchValue)}`);
    }
  };
  return (
    <RootLayout>
      <div className="flex flex-col" onMouseMove={handleMouseMove}>
        <motion.div className="fixed top-0 left-0 right-0 h-1 bg-orange-500 origin-left z-[60]" style={{ scaleX }} />
        {/* Hero Section */}
        <section className="relative bg-[#0a0e1a] pt-0 pb-36 md:pb-48 overflow-hidden min-h-[95vh] flex flex-col">
          {/* Tech Grid & Node Interactive Background */}
          <div className="absolute inset-0 z-0">
            <HeroInteractiveCanvas />
          </div>
          {/* Full-Width Cinematic Banner - Positioned Top */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-full z-10 overflow-hidden bg-[#0a0e1a]"
          >
            <div className="relative w-full">
              <img
                src="https://i.imgur.com/QesRWrO.jpg"
                alt="Biomedical Technology Banner"
                className="w-full h-[300px] object-cover"
              />
              {/* Single Gradient Blending for smooth transition to background */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0e1a] pointer-events-none" />
            </div>
          </motion.div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full -mt-16">
            <div className="text-center space-y-8 md:space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <h1 className="text-display text-white mb-6 tracking-tighter drop-shadow-2xl">
                  Geleceğin Sağlık <br className="hidden sm:block" />
                  <span className="text-orange-500">Teknolojisini Keşfet</span>
                </h1>
                <p className="max-w-xl mx-auto text-2xs md:text-xs text-orange-500 font-black tracking-[0.6em] uppercase mb-10">
                  BCT AKADEMİ
                </p>
                <p className="max-w-3xl mx-auto text-lg md:text-2xl text-slate-400 leading-relaxed font-normal px-4">
                  Türkiye'nin en kapsamlı biyomedikal eğitim platformu. Profesyonel teknik içerikler ve
                  klinik mühendislik temelleri ile uzmanlığınızı şekillendirin.
                </p>
              </motion.div>
              {/* High-Contrast Light Search Interface */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="max-w-2xl mx-auto px-4"
              >
                <form onSubmit={handleSearch} className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/10 to-teal-500/10 rounded-[2.2rem] blur-3xl opacity-0 group-focus-within:opacity-100 transition-all duration-700" />
                  <div className="relative flex p-2 bg-white/95 backdrop-blur-2xl rounded-[2rem] border border-white/20 shadow-2xl transition-all duration-300 hover:bg-white">
                    <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
                    <Input
                      placeholder="Ders, cihaz veya teknik konu ara..."
                      className="h-16 pl-16 pr-6 border-none shadow-none text-slate-900 bg-transparent text-xl focus-visible:ring-0 w-full placeholder:text-slate-400 font-semibold"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <Button
                      type="submit"
                      className="h-14 px-10 bg-gradient-primary hover:scale-[1.02] text-white font-bold rounded-2xl hidden sm:flex border-none my-auto mr-1 shadow-xl shadow-orange-500/30 active:scale-95 transition-all"
                    >
                      Ara
                    </Button>
                  </div>
                </form>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row justify-center gap-6 pt-6 px-4"
              >
                <Link to="/dersler">
                  <Button className="w-full sm:w-auto h-16 px-12 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl rounded-2xl group shadow-lg transition-all hover:scale-105 border-none">
                    Eğitimlere Göz At <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button className="w-full sm:w-auto h-16 px-12 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xl transition-all hover:scale-105 border-none shadow-lg">
                    <Newspaper className="mr-2 w-6 h-6" /> BCT Blog
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section className="py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: ShieldCheck, title: "Profesyonel İçerik", desc: "Endüstri odaklı derinlemesine teknik incelemeler ve cihaz bakım protokolleri." },
                { icon: Microscope, title: "Teknik Derinlik", desc: "Sensörlerden mikrodenetleyicilere, klinik mühendislik uygulamalarından kalibrasyon temellerine." },
                { icon: Cpu, title: "Modern Teknoloji", desc: "Yeni nesil görüntüleme sistemleri ve modern yaşam destek üniteleri üzerine güncel modüller." }
              ].map((f, i) => (
                <div key={i} className="group p-10 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-orange-500/20">
                    <f.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </RootLayout>
  );
}
