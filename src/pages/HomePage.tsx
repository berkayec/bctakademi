import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, ShieldCheck, Microscope, Cpu, GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
export function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-slate-950 pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-teal-400 uppercase bg-teal-400/10 border border-teal-400/20 rounded-full">
                Geleceğin Sağlık Teknolojileri
              </span>
              <h1 className="text-display text-white mb-6">
                Biyomedikal Cihaz <br />
                <span className="text-teal-400">Teknolojilerinde Uzmanlaşın</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
                Milli Eğitim Bakanlığı müfredatına uygun, teorik ve uygulamalı biyomedikal eğitim portalı. Geleceğin biyomedikal teknisyenleri burada yetişiyor.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link to="/portal">
                <Button className="w-full sm:w-auto h-14 px-10 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-2xl group transition-all">
                  Portala Giriş Yap <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/dersler">
                <Button variant="outline" className="w-full sm:w-auto h-14 px-10 border-slate-700 text-white hover:bg-slate-900 rounded-2xl text-lg">
                  Müfredatı İncele
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: ShieldCheck, title: "MEB Standartları", desc: "Tüm içeriklerimiz Milli Eğitim Bakanlığı biyomedikal müfredatı ile %100 uyumludur." },
              { icon: Microscope, title: "Uygulamalı İçerik", desc: "Cihaz simülasyonları, arıza giderme videoları ve teknik çizimlerle pratik odaklı öğrenme." },
              { icon: Cpu, title: "Güncel Teknoloji", desc: "En yeni tanısal görüntüleme ve yaşam destek cihazları üzerine güncel dokümantasyon." }
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-teal-500 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Mission Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight">
                Geleceğin Teknik <br /> Liderlerini Yetiştiriyoruz
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Biyomedikal Cihaz Teknolojileri alanı, modern tıbbın kalbidir. Amacımız, öğrencilerimizin sadece cihazları tamir etmesini değil, çalışma prensiplerini en derin ayrıntısına kadar kavramasını sağlamaktır.
              </p>
              <div className="space-y-4">
                {[
                  "Kapsamlı Biyoölçme Atölyesi Notları",
                  "Yaşam Destek Cihazları Teknik Detayları",
                  "Mesleki Fizyoloji ve Terminoloji Sözlüğü",
                  "Dijital Kaynak ve Video Kütüphanesi"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                      <Activity className="w-3 h-3" />
                    </div>
                    <span className="font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-teal-400 to-blue-600 rounded-4xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=800" 
                  alt="Biomedical student" 
                  className="w-full h-full object-cover mix-blend-overlay opacity-80"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">5,000+</p>
                    <p className="text-sm text-slate-500 font-medium">Aktif Öğrenci</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats / Proof */}
      <section className="py-24 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div>
              <p className="text-5xl font-display font-bold text-teal-400 mb-2">120+</p>
              <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">Teknik Ünite</p>
            </div>
            <div>
              <p className="text-5xl font-display font-bold text-teal-400 mb-2">450+</p>
              <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">Uygulama Videosu</p>
            </div>
            <div>
              <p className="text-5xl font-display font-bold text-teal-400 mb-2">15</p>
              <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">Farklı Modül</p>
            </div>
            <div>
              <p className="text-5xl font-display font-bold text-teal-400 mb-2">%100</p>
              <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">MEB Uyumlu</p>
            </div>
          </div>
        </div>
      </section>
      {/* Final CTA */}
      <section className="py-24 bg-teal-600 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
            Eğitim Serüvenine Bugün Başlayın
          </h2>
          <p className="text-teal-50 text-xl opacity-90">
            Hemen kayıt olun ve biyomedikal dünyasındaki yerinizi alın. Ücretsiz kaynaklar ve MEB onaylı müfredat sizi bekliyor.
          </p>
          <Link to="/portal" className="inline-block">
            <Button size="lg" className="bg-white text-teal-600 hover:bg-slate-50 h-16 px-12 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-all">
              Hemen Başla
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}