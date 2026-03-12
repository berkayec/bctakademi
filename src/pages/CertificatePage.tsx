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
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  const earnedCertificates = useMemo(() => {
    if (!user) return [];
    const completedUnits = user.completedUnits;
    const allCourses = curriculum.flatMap(cat => cat.courses.map(course => ({ ...course, categoryPrefix: cat.id.split('-')[0].toUpperCase() })));
    return allCourses.filter(course => {
      // A course is completed if all its units are in user's completedUnits array
      return course.units.every(unit => completedUnits.includes(unit.id));
    }).map(course => ({
      id: `cert-${course.id}`,
      title: `${course.title} Uzmanlık Sertifikası`,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      prefix: course.categoryPrefix,
      points: user.points
    }));
  }, [user]);
  if (!isAuthenticated || !user) return null;
  return (
    <RootLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col gap-12">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <Link to="/portal" className="flex items-center text-xs font-bold text-slate-400 hover:text-teal-600 transition-colors uppercase mb-4">
                <ChevronLeft className="w-4 h-4 mr-1" /> Panele Dön
              </Link>
              <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Başarı Belgelerim</h1>
              <p className="text-slate-500">Tamamladığınız kurslar için kazandığınız sertifikalar.</p>
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
                    <Card className="overflow-hidden border-none shadow-2xl bg-white rounded-[2.5rem] relative">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                      <CardContent className="p-12 md:p-16 border-8 border-double border-slate-100 m-2 rounded-[2rem]">
                        <div className="text-center space-y-8 relative z-10">
                          <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-teal-500/20">
                              <Award className="w-10 h-10" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-bold tracking-[0.2em] text-teal-600 uppercase">Başarı Sertifikası</p>
                            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900">{cert.title}</h2>
                          </div>
                          <div className="h-px w-24 bg-slate-200 mx-auto" />
                          <div className="space-y-4">
                            <p className="text-slate-500 italic">Bu sertifika, ilgili eğitim modülünü başarıyla tamamlayan</p>
                            <p className="text-3xl font-display font-bold text-slate-900 underline decoration-teal-400 decoration-4 underline-offset-8">
                              {user.username}
                            </p>
                            <p className="text-slate-500 italic">adına BCTAkademi tarafından düzenlenmiştir.</p>
                          </div>
                          <div className="grid grid-cols-2 gap-8 pt-12">
                            <div className="text-left">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Veriliş Tarihi</p>
                              <p className="text-sm font-bold text-slate-900">{cert.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sertifika No</p>
                              <p className="text-sm font-bold text-slate-900">
                                {cert.prefix}-{new Date().getFullYear()}-{(cert.points + 100).toString().padStart(4, '0')}
                              </p>
                            </div>
                          </div>
                          <div className="pt-8 flex justify-center">
                            <ShieldCheck className="w-12 h-12 text-slate-200" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <div className="mt-4 flex gap-4 justify-end px-4">
                      <Button variant="ghost" className="text-slate-500 font-bold">
                        <Download className="w-4 h-4 mr-2" /> PDF İndir
                      </Button>
                      <Button variant="ghost" className="text-slate-500 font-bold">
                        <Share2 className="w-4 h-4 mr-2" /> LinkedIn'de Paylaş
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
              <aside className="lg:sticky lg:top-28 space-y-6">
                <div className="bg-slate-950 text-white p-8 rounded-[2rem] shadow-xl space-y-6">
                  <h3 className="text-xl font-bold">Akademik Durum</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Kazanılan Sertifika</p>
                      <p className="text-2xl font-bold">{earnedCertificates.length}</p>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Her tamamladığınız kurs size kalıcı bir başarı belgesi ve 100 XP kazandırır.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 max-w-2xl mx-auto">
              <Award className="w-16 h-16 text-slate-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Henüz Sertifikanız Yok</h2>
              <p className="text-slate-500 mb-8">Bir kursun tüm ünitelerini başarıyla tamamlayarak ilk uzmanlık belgenizi alabilirsiniz.</p>
              <Button asChild className="bg-slate-900 text-white rounded-xl px-8 h-12">
                <Link to="/dersler">Dersleri Keşfet</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </RootLayout>
  );
}
