import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Logo } from '@/components/Logo';
export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <Logo size={40} />
              <span className="font-display font-bold text-2xl text-white tracking-tighter">
                BCTAkademi
              </span>
            </div>
            <p className="max-w-md text-base leading-relaxed text-slate-400">
              Türkiye'nin öncü Biyomedikal Cihaz Teknolojileri eğitim portalı. Geleceğin klinik mühendislerini ve teknisyenlerini profesyonel müfredat ve modern öğrenme araçlarıyla yetiştiriyoruz.
            </p>
            <div className="flex gap-5">
              <Link to="#" className="hover:text-teal-400 transition-colors p-2 bg-slate-900 rounded-lg"><Twitter className="w-5 h-5" /></Link>
              <Link to="#" className="hover:text-teal-400 transition-colors p-2 bg-slate-900 rounded-lg"><Linkedin className="w-5 h-5" /></Link>
              <Link to="#" className="hover:text-teal-400 transition-colors p-2 bg-slate-900 rounded-lg"><Github className="w-5 h-5" /></Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Eğitimler</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/dersler" className="hover:text-teal-400 transition-colors">Ders Kataloğu</Link></li>
              <li><Link to="/kaynaklar" className="hover:text-teal-400 transition-colors">Kaynak Merkezi</Link></li>
              <li><Link to="/blog" className="hover:text-teal-400 transition-colors">BCTA Blog</Link></li>
              <li><Link to="/iletisim" className="hover:text-teal-400 transition-colors">İletişim & Destek</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Kurumsal</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/iletisim" className="hover:text-teal-400 transition-colors">Hakkımızda</Link></li>
              <li><Link to="#" className="hover:text-teal-400 transition-colors">Gizlilik Politikası</Link></li>
              <li><Link to="#" className="hover:text-teal-400 transition-colors">Kullanım Şartları</Link></li>
              <li className="flex items-center gap-2 text-teal-500">
                <Mail className="w-4 h-4" />
                <span>akademi@bctakademi.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-500">
          <p>© {new Date().getFullYear()} BCTAkademi. Tüm hakları saklıdır.</p>
          <div className="flex gap-8">
            <p>Biyomedikal Cihaz Teknolojileri Akademisi</p>
            <p>TÜRKİYE</p>
          </div>
        </div>
      </div>
    </footer>
  );
}