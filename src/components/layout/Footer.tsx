// src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function Footer() {
  return (
    // bg-muted (açık modda gri, dark modda koyu) ve border-border kullanıldı
    <footer className="bg-muted/50 text-muted-foreground border-t border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <Logo size={40} />
            </div>
            <p className="max-w-md text-base leading-relaxed font-medium">
              Türkiye'nin öncü Biyomedikal Cihaz Teknolojileri eğitim portalı. Geleceğin klinik mühendislerini ve teknisyenlerini profesyonel müfredat ve modern öğrenme araçlarıyla yetiştiriyoruz.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Github, label: 'GitHub' }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  to="#" 
                  className="text-muted-foreground hover:text-orange-500 transition-colors p-2.5 bg-background border border-border rounded-xl hover:shadow-lg" 
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-bold mb-6 text-lg tracking-tight">Eğitimler</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/dersler" className="hover:text-orange-500 transition-colors">Ders Kataloğu</Link></li>
              <li><Link to="/kaynaklar" className="hover:text-orange-500 transition-colors">Kaynak Merkezi</Link></li>
              <li><Link to="/blog" className="hover:text-orange-500 transition-colors">BCT Güncel</Link></li>
              <li><Link to="/iletisim" className="hover:text-orange-500 transition-colors">İletişim & Destek</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-bold mb-6 text-lg tracking-tight">Kurumsal</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/iletisim" className="hover:text-orange-500 transition-colors">Hakkımızda</Link></li>
              <li><Link to="#" className="hover:text-orange-500 transition-colors">Gizlilik Politikası</Link></li>
              <li><Link to="#" className="hover:text-orange-500 transition-colors">Kullanım Şartları</Link></li>
              <li className="flex items-center gap-2 text-orange-500 pt-2 font-black">
                <Mail className="w-4 h-4" />
                <span className="text-[13px] lowercase">akademi@bctakademi.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
          <p>© {new Date().getFullYear()} BCT Akademi. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <p>Biyomedikal Cihaz Teknolojileri Akademisi</p>
            <p>TÜRKİYE</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
