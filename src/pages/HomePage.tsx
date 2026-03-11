import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Microscope, Cpu, Search, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion';
export function HomePage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const { scrollYProgress } = useScroll();
  // Mouse movement parallax effect for the hero background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useSpring(useTransform(mouseX, [-500, 500], [-20, 20]), { stiffness: 50, damping: 20 });
  const bgY = useSpring(useTransform(mouseY, [-500, 500], [-20, 20]), { stiffness: 50, damping: 20 });
  const bgScale = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 1.1]), { stiffness: 100, damping: 30 });
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
    <div className="flex flex-col" onMouseMove={handleMouseMove}>
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-orange-500 origin-left z-[60]" style={{ scaleX }} />
      {/* Hero Section */}
      <section className="relative bg-slate-950 pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden min-h-[90vh] flex items-center">
        {/* Interactive Background Layer */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ x: bgX, y: bgY, scale: bgScale }}
        >
          <img
            src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=1920"
            alt="Biomedical Technology Background"
            className="w-full h-full object-cover opacity-20 filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950 opacity-60" />
        </motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <h1 className="text-display text-white mb-6 tracking-tighter drop-shadow-2xl">
                Geleceğin Sağlık <br className="hidden sm:block" />
                <span className="text-orange-500">Teknolojisini Keşfet</span>
              </h1>
              <p className="max-w-xl mx-auto text-xs md:text-sm text-teal-400/80 font-bold tracking-[0.5em] uppercase mb-8">
                Biyomedikal Cihaz Teknolojileri Akademisi
              </p>
              <p className="max-w-2xl mx-auto text-base md:text-xl text-slate-400 leading-relaxed font-normal">
                Türkiye'nin en kapsamlı biyomedikal eğitim platformu. Profesyonel teknik içerikler,
                cihaz dökümantasyonları ve klinik mühendislik temelleri ile uzmanlığınızı şekillendirin.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-xl mx-auto"
            >
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-orange-500/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative flex p-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    placeholder="Ders, cihaz veya teknik konu ara..."
                    className="h-14 pl-14 pr-4 border-none shadow-none text-white bg-transparent text-lg focus-visible:ring-0 w-full placeholder:text-slate-500"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <Button type="submit" className="h-12 px-6 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-xl hidden sm:flex border-none my-auto mr-1">
                    Ara
                  </Button>
                </div>
              </form>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center gap-5 pt-2"
            >
              <Link to="/dersler">
                <Button className="w-full sm:w-auto h-14 px-10 bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg rounded-2xl group shadow-lg transition-all hover:scale-105 border-none">
                  Eğitimi İncele <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/blog">
                <Button className="w-full sm:w-auto h-14 px-10 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-lg transition-all hover:scale-105 border-none shadow-lg">
                  <Newspaper className="mr-2 w-5 h-5" /> Güncel Haberler
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
                <div className="w-16 h-16 rounded-2xl bg-teal-500 flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-teal-500/20">
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
  );
}