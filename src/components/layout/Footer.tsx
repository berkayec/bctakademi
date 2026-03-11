import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Logo } from '@/components/Logo';
export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <Logo size={40} />
            </div>
            <p className="max-w-md text-base leading-relaxed text-slate-400 font-medium">
              Türkiye'nin öncü Biyomedikal Cihaz Teknolojileri eğitim portalı. Geleceğin klinik mühendislerini ve teknisyenlerini profesyonel müfredat ve modern öğrenme araçlarıyla yetiştiriyoruz.
            </p>
            <div className="flex gap-4">
              <Link to="#" className="text-slate-500 hover:text-teal-400 transition-colors p-2.5 bg-slate-900 hover:bg-teal-500/10 rounded-xl" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link to="#" className="text-slate-500 hover:text-teal-400 transition-colors p-2.5 bg-slate-900 hover:bg-teal-500/10 rounded-xl" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link to="#" className="text-slate-500 hover:text-teal-400 transition-colors p-2.5 bg-slate-900 hover:bg-teal-500/10 rounded-xl" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-lg tracking-tight">Eğitimler</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/dersler" className="hover:text-teal-400 transition-colors">Ders Kataloğu</Link></li>
              <li><Link to="/kaynaklar" className="hover:text-teal-400 transition-colors">Kaynak Merkezi</Link></li>
              <li><Link to="/blog" className="hover:text-teal-400 transition-colors">BCTA Blog</Link></li>
              <li><Link to="/iletisim" className="hover:text-teal-400 transition-colors">İletişim & Destek</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-lg tracking-tight">Kurumsal</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/iletisim" className="hover:text-teal-400 transition-colors">Hakkımızda</Link></li>
              <li><Link to="#" className="hover:text-teal-400 transition-colors">Gizlilik Politikası</Link></li>
              <li><Link to="#" className="hover:text-teal-400 transition-colors">Kullanım Şartları</Link></li>
              <li className="flex items-center gap-2 text-teal-500 pt-2">
                <Mail className="w-4 h-4" />
                <span className="text-[13px] lowercase">akademi@bctakademi.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <p>© {new Date().getFullYear()} BCTAkademi. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <p>Biyomedikal Cihaz Teknolojileri Akademisi</p>
            <p>TÜRKİYE</p>
          </div>
        </div>
      </div>
    </footer>
  );
}