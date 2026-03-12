import React, { useEffect, useMemo } from 'react';
import { curriculum } from '@/lib/curriculum';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Download, Share2, ChevronLeft, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/use-user-store';

// DİKKAT: "export function CertificatePage" isminin main.tsx ile tam uyuşması şart
export function CertificatePage() {
  const navigate = useNavigate();
  const user = useUserStore(s => s.user);
  const isAuthenticated = useUserStore(s => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const earnedCertificates = useMemo(() => {
    if (!user) return [];
    const completedUnits = user.completedUnits;
    const allCourses = curriculum.flatMap(cat => 
      cat.courses.map(course => ({ 
        ...course, 
        categoryPrefix: cat.id.split('-')[0].toUpperCase() 
      }))
    );
    
    return allCourses.filter(course => {
      return course.units.every(unit => completedUnits.includes(unit.id));
    }).map(course => ({
      id: `cert-${course.id}`,
      title: `${course.title} Uzmanlık Sertifikası`,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      prefix: course.prefix || course.categoryPrefix,
      points: user.points
    }));
  }, [user]);

  if (!isAuthenticated || !user) return null;

  return (
    <div className="bg-[#0a0e1a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col gap-12">
          
          {/* ÜST BAŞLIK */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <Link to="/portal" className="flex items-center text-[10px] font-bold text-teal-500 hover:text-teal-400 transition-colors uppercase mb-4 tracking-widest">
                <ChevronLeft className="w-4 h-4 mr-1" /> Panele Dön
              </Link>
              <h1 className="text-4xl font-display font-bold text-white tracking-tight leading-tight">Başarı Belgelerim</h1>
              <p className="text-slate-400 font-medium">Tamamladığınız kurslar için kazandığınız resmi sertifikalar.</p>
            </div>
          </header>

          {earnedCertificates.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                {earnedCertificates.map((cert) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    {/* SERTİFİKA KARTI */}
                    <Card className="overflow-hidden border-none shadow-2xl bg-white rounded-[2.5rem] relative">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                      <CardContent className="p-8 md:p-16 border-[12px] border-double border-slate-50 m-3 rounded-[2rem]">
                        <div className="text-center space-y-8 relative z-10">
                          <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-teal-500/20">
                              <Award className="w-10 h-10" />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <p className="text-[10px] font-black tracking-[0.3em] text-teal-600 uppercase">BAŞARI SERTİFİKASI</p>
                            <h2 className="text-2xl md:text-5xl font-display font-bold text-slate-900 leading-tight">{cert.title}</h2>
                          </div>

                          <div className="h-px w-24 bg-slate-200 mx-auto" />

                          <div className="space-y-4">
                            <p className="text-slate-500 italic text-sm">Bu sertifika, ilgili eğitim modülünü başarıyla tamamlayan</p>
                            <p className="text-3xl font-display font-black text-slate-900 underline decoration-teal-400 decoration-4 underline-offset-8">
                              {user.username}
                            </p>
                            <p className="text-slate-500 italic text-sm">adına BCT Akademi tarafından düzenlenmiştir.</p>
                          </div>

                          <div className="grid grid-cols-2 gap-8 pt-12 border-t border-slate-50">
                            <div className="text-left">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Veriliş Tarihi</p>
                              <p className="text-sm font-bold text-slate-900">{cert.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sertifika No</p>
                              <p className="text-sm font-bold text-slate-900 uppercase">
                                {cert.prefix}-{new Date().getFullYear()}-{(cert.points + 124).toString().padStart(4, '0')}
                              </p>
                            </div>
                          </div>

                          <div className="pt-8 flex justify-center opacity-20">
                            <ShieldCheck className="w-12 h-12 text-slate-900" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-end px-4">
                      <Button variant="ghost" className="text-slate-400 hover:text-white font-bold gap-2">
                        <Download className="w-4 h-4" /> PDF İNDİR
                      </Button>
                      <Button variant="ghost" className="text-slate-400 hover:text-white font-bold gap-2">
                        <Share2 className="w-4 h-4" /> LINKEDIN'DE PAYLAŞ
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* YAN PANEL */}
              <aside className="lg:sticky lg:top-28 space-y-6">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-6">
                  <h3 className="text-xl font-bold text-white tracking-tight">Akademik Durum</h3>
                  <div className="space-y-4">
                    <div className="p-5 bg-teal-500/10 rounded-2xl border border-teal-500/20">
                      <p className="text-[10px] font-black text-teal-500 uppercase mb-1 tracking-widest">Kazanılan Sertifika</p>
                      <p className="text-3xl font-black text-white">{earnedCertificates.length}</p>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Sertifikalarınız block-chain tabanlı doğrulama koduna sahiptir ve profesyonel ağlarda paylaşılabilir.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            /* SERTİFİKA YOKSA */
            <div className="py-24 text-center bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-800 max-w-2xl mx-auto">
              <Award className="w-16 h-16 text-slate-700 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Henüz Sertifikanız Yok</h2>
              <p className="text-slate-500 mb-8 px-8">Bir kursun tüm ünitelerini başarıyla tamamlayarak ilk uzmanlık belgenizi hemen alabilirsiniz.</p>
              <Button asChild className="bg-teal-600 hover:bg-teal-500 text-white rounded-xl px-10 h-14 font-bold border-none shadow-xl">
                <Link to="/dersler">DERSLERİ KEŞFET</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
