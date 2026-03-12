import React, { useEffect, useMemo } from 'react';
import { RootLayout } from '@/components/layout/RootLayout';
import { curriculum } from '@/lib/curriculum';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Download, Share2, ChevronLeft, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/use-user-store';

export function CertificatePage() {
  const navigate = useNavigate();
  const user = useUserStore(s => s.user);
  const isAuthenticated = useUserStore(s => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const earnedCertificates = useMemo(() => {
    if (!user) return [];
    const completedUnits = user.completedUnits;
    const allCourses = curriculum.flatMap(cat => cat.courses.map(course => ({ ...course, categoryPrefix: cat.id.split('-')[0].toUpperCase() })));
    return allCourses.filter(course => course.units.every(unit => completedUnits.includes(unit.id))).map(course => ({
      id: `cert-${course.id}`,
      title: `${course.title}`,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      prefix: course.categoryPrefix,
      points: user.points
    }));
  }, [user]);

  if (!isAuthenticated || !user) return null;

  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <header className="mb-12">
          <Link to="/portal" className="flex items-center text-xs font-bold text-slate-400 hover:text-teal-600 transition-colors uppercase mb-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Panele Dön
          </Link>
          <h1 className="text-4xl font-display font-bold text-white md:text-slate-900 tracking-tight">Başarı Belgelerim</h1>
          <p className="text-slate-400 md:text-slate-500">Tamamladığınız kurslar için kazandığınız sertifikalar.</p>
        </header>

        {earnedCertificates.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {earnedCertificates.map((cert) => (
                <motion.div key={cert.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <Card className="overflow-hidden border-none shadow-2xl bg-white rounded-[2rem] md:rounded-[2.5rem] relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                    <CardContent className="p-6 md:p-16 border-4 md:border-8 border-double border-slate-100 m-2 rounded-[1.5rem] md:rounded-[2rem]">
                      <div className="text-center space-y-6 md:space-y-8 relative z-10">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-xl mx-auto">
                          <Award className="w-8 h-8 md:w-10 md:h-10" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-teal-600 uppercase">Uzmanlık Sertifikası</p>
                          <h2 className="text-2xl md:text-5xl font-display font-bold text-slate-900 leading-tight">{cert.title}</h2>
                        </div>
                        <div className="h-px w-24 bg-slate-200 mx-auto" />
                        <div className="space-y-4">
                          <p className="text-slate-500 italic text-sm md:text-base">Bu sertifika, ilgili eğitim modülünü başarıyla tamamlayan</p>
                          <p className="text-2xl md:text-3xl font-display font-bold text-slate-900 underline decoration-teal-400 decoration-4 underline-offset-8">
                            {user.username}
                          </p>
                          <p className="text-slate-500 italic text-sm md:text-base">adına BCT Akademi tarafından düzenlenmiştir.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-8 md:pt-12 border-t border-slate-50">
                          <div className="text-left">
                            <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Veriliş Tarihi</p>
                            <p className="text-xs md:text-sm font-bold text-slate-900">{cert.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sertifika No</p>
                            <p className="text-xs md:text-sm font-bold text-slate-900">
                              {cert.prefix}-{new Date().getFullYear()}-{(cert.points + 100).toString().padStart(4, '0')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="mt-4 flex flex-wrap gap-2 md:gap-4 justify-center md:justify-end px-4">
                    <Button variant="ghost" size="sm" className="text-slate-400 md:text-slate-500 font-bold hover:text-white"><Download className="w-4 h-4 mr-2" /> PDF</Button>
                    <Button variant="ghost" size="sm" className="text-slate-400 md:text-slate-500 font-bold hover:text-white"><Share2 className="w-4 h-4 mr-2" /> Paylaş</Button>
                  </div>
                </motion.div>
              ))}
            </div>
            <aside className="lg:sticky lg:top-28">
              <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-white">Akademik Durum</h3>
                <p className="text-slate-400 text-sm">Her tamamladığınız kurs size kalıcı bir başarı belgesi kazandırır.</p>
                <div className="p-4 bg-teal-500/10 rounded-2xl border border-teal-500/20 text-center">
                   <p className="text-2xl font-black text-teal-400">{earnedCertificates.length}</p>
                   <p className="text-[10px] font-bold text-teal-500 uppercase">Sertifika</p>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="py-24 text-center bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-800 max-w-2xl mx-auto">
            <Award className="w-16 h-16 text-slate-700 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Henüz Sertifikanız Yok</h2>
            <p className="text-slate-400 mb-8 px-6">Bir kursun tüm ünitelerini tamamlayarak uzmanlık belgenizi alabilirsiniz.</p>
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8 h-12 border-none">
              <Link to="/dersler">Eğitimlere Göz At</Link>
            </Button>
          </div>
        )}
      </div>
    </RootLayout>
  );
}
