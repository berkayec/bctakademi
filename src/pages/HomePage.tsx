import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, ShieldCheck, Microscope, Cpu, GraduationCap, Search, Globe, ChevronRight, CheckCircle2, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, useScroll, useSpring } from 'framer-motion';
export function HomePage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const { scrollYProgress } = useScroll();
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
    <div className="flex flex-col">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-orange-500 origin-left z-[60]" style={{ scaleX }} />
      {/* Hero Section */}
      <section className="relative bg-slate-950 pt-24 pb-36 overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1579154235602-3c37ca99a3ae?auto=format&fit=crop&q=80&w=1920"
            alt="Biomedical Laboratory"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center space-y-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-bold tracking-widest text-teal-400 uppercase bg-teal-400/10 border border-teal-400/20 rounded-full">
                <Globe className="w-3 h-3" /> Geleceğin Sağlık Teknolojileri
              </span>
              <h1 className="text-display text-white mb-8 tracking-tight">
                Biyomedikalde <br />
                <span className="text-teal-400">Uzmanlaşmaya Başla</span>
              </h1>
              <p className="max-w-3xl mx-auto text-xl text-slate-300 leading-relaxed font-medium">
                Milli Eğitim Bakanlığı standartlarıyla %100 uyumlu, kapsamlı ve etkileşimli biyomedikal eğitim ekosistemi. Teknik bilginizi bir üst seviyeye taşıyın.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-orange-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
                <div className="relative flex p-1.5 bg-white rounded-2xl shadow-2xl">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Ders, cihaz veya konu ara..."
                    className="h-14 pl-14 pr-4 border-none shadow-none text-slate-900 bg-transparent text-lg focus-visible:ring-0 w-full"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <Button type="submit" className="h-14 px-8 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl hidden sm:flex">
                    Ara
                  </Button>
                </div>
              </form>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
              <Link to="/dersler">
                <Button className="w-full sm:w-auto h-16 px-10 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-2xl group shadow-xl transition-all hover:scale-105">
                  Derslere Göz At <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/blog">
                <Button variant="outline" className="w-full sm:w-auto h-16 px-10 border-slate-700 text-white hover:bg-white hover:text-slate-900 rounded-2xl text-lg font-bold transition-all">
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
              { icon: ShieldCheck, title: "Resmi Müfredat", desc: "Milli Eğitim Bakanlığı Biyomedikal Cihaz Teknolojileri müfredatı ile tam uyumlu içerikler." },
              { icon: Microscope, title: "Klinik Yaklaşım", desc: "Teorik bilginin pratik hastane ve servis uygulamalarıyla harmanlandığı özel modüller." },
              { icon: Cpu, title: "Modern Donanım", desc: "En yeni tanısal görüntüleme ve yaşam destek teknolojileri üzerine odaklı eğitimler." }
            ].map((f, i) => (
              <div key={i} className="group p-10 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-teal-500 flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
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