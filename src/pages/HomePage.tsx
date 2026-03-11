import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, ShieldCheck, Microscope, Cpu, GraduationCap, Search, Globe, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
export function HomePage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/dersler?q=${encodeURIComponent(searchValue)}`);
    }
  };
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-slate-950 pt-24 pb-36 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(20,184,166,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-bold tracking-widest text-teal-400 uppercase bg-teal-400/10 border border-teal-400/20 rounded-full">
                <Globe className="w-3 h-3" /> Universal Biomedical Learning Hub
              </span>
              <h1 className="text-display text-white mb-8 tracking-tight">
                Geleceğin Sağlık <br />
                <span className="text-teal-400">Teknolojilerini Keşfedin</span>
              </h1>
              <p className="max-w-3xl mx-auto text-xl text-slate-400 leading-relaxed font-medium">
                Milli Eğitim Bakanlığı standartlarıyla %100 uyumlu, kapsamlı ve etkileşimli biyomedikal eğitim ekosistemi. Teknik bilginizi bir üst seviyeye taşıyın.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
                <div className="relative flex p-1.5 bg-white rounded-2xl border-none shadow-2xl">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Biyoölçme, Defibrilatör veya İSG ara..."
                    className="h-14 pl-14 pr-4 border-none shadow-none text-slate-900 bg-transparent text-lg focus-visible:ring-0"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <Button type="submit" className="h-14 px-8 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl hidden sm:flex">
                    Hemen Ara
                  </Button>
                </div>
              </form>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-6 pt-4"
            >
              <Link to="/dersler?cat=temel-dersler">
                <Button className="w-full sm:w-auto h-16 px-10 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-2xl group shadow-xl shadow-orange-500/20 transition-all hover:scale-105 active:scale-95">
                  Temel Derslerden Başla <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/dersler?cat=alan-dersleri">
                <Button variant="outline" className="w-full sm:w-auto h-16 px-10 border-slate-700 text-white hover:bg-white hover:text-slate-900 rounded-2xl text-lg font-bold transition-all">
                  Alanında Uzmanlaş <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Stats Board */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: ShieldCheck, title: "Resmi Müfredat", desc: "Milli Eğitim Bakanlığı Biyomedikal Cihaz Teknolojileri müfredatı ile tam uyumlu içerikler." },
              { icon: Microscope, title: "Klinik Yaklaşım", desc: "Teorik bilginin pratik hastane ve servis uygulamalarıyla harmanlandığı özel modüller." },
              { icon: Cpu, title: "Modern Donanım", desc: "En yeni tanısal görüntüleme, yaşam destek ve biyoenstrümantasyon teknolojileri üzerine odaklı." }
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
      {/* Mission / Universal Hub */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight">
                  Tüm Biyomedikal Bilgi <br /> <span className="text-teal-600">Tek Bir Merkezde</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  Biyomedikal Hub, öğrencilerin sınıf seviyesine takılmadan, ihtiyaç duydukları her an doğru bilgiye ulaşabilmesi için tasarlandı. İster temel bir biyoölçme prensibi, ister karmaşık bir ventilatör arıza giderme protokolü olsun; her şey parmaklarınızın ucunda.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Kapsamlı Atölye Notları",
                  "Cihaz Bakım Protokolleri",
                  "Teknik Çizim Kütüphanesi",
                  "İnteraktif Değerlendirmeler"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-teal-500 to-blue-600 rounded-[3rem] overflow-hidden shadow-2xl rotate-3">
                <img
                  src="https://images.unsplash.com/photo-1579154235602-3c37ca99a3ae?auto=format&fit=crop&q=80&w=800"
                  alt="Biomedical technician working"
                  className="w-full h-full object-cover mix-blend-overlay opacity-90"
                />
              </div>
              <div className="absolute -top-10 -left-10 bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-3xl font-display font-bold text-slate-900">120+</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Eğitim Modülü</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonial / Community */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-16">Eğitmen Gözünden</h3>
          <div className="max-w-4xl mx-auto">
             <blockquote className="text-3xl md:text-4xl font-display font-bold text-slate-900 leading-tight">
               "Biyomedikal cihaz teknolojileri sadece tamir değil, yaşamı koruma sanatıdır. Bu portal, öğrencilerimize bu sanatı en bilimsel ve modern yollarla öğretiyor."
             </blockquote>
             <div className="mt-10 flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" alt="Instructor" />
                </div>
                <div className="text-left">
                   <p className="font-bold text-slate-900">Dr. Mehmet Akif</p>
                   <p className="text-slate-500 font-medium">Klinik Mühendisliği Uzmanı</p>
                </div>
             </div>
          </div>
        </div>
      </section>
      {/* Final CTA */}
      <section className="py-24 bg-teal-600 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-10 relative z-10">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight">
            Kariyerinizi Bugün <br /> Şekillendirin
          </h2>
          <p className="text-teal-50 text-xl font-medium opacity-90 max-w-2xl mx-auto">
            Ücretsiz hesap oluşturarak tüm teknik kaynaklara erişin ve biyomedikal dünyasının geleceği için hazırlanmaya başlayın.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/portal">
              <Button size="lg" className="w-full sm:w-auto bg-white text-teal-600 hover:bg-slate-50 h-16 px-12 rounded-2xl font-bold text-xl shadow-2xl transition-all hover:scale-105">
                Portala Üye Ol
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-20 opacity-10">
           <Activity className="w-96 h-96 text-white" />
        </div>
      </section>
    </div>
  );
}