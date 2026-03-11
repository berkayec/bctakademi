import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Github, Twitter, Linkedin } from 'lucide-react';
export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-teal-500" />
              <span className="font-display font-bold text-xl text-white">
                BCT Öğretmeni
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed">
              Geleceğin biyomedikal mühendislerini ve cihaz teknisyenlerini dünya standartlarında eğitim kaynakları ve yapılandırılmış müfredatla güçlendiriyoruz.
            </p>
            <div className="flex gap-4">
              <Link to="#" className="hover:text-teal-400 transition-colors"><Twitter className="w-5 h-5" /></Link>
              <Link to="#" className="hover:text-teal-400 transition-colors"><Linkedin className="w-5 h-5" /></Link>
              <Link to="#" className="hover:text-teal-400 transition-colors"><Github className="w-5 h-5" /></Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dersler" className="hover:text-teal-400">Ders Kataloğu</Link></li>
              <li><Link to="/kaynaklar" className="hover:text-teal-400">Kaynak Merkezi</Link></li>
              <li><Link to="/blog" className="hover:text-teal-400">Sektör Haberleri</Link></li>
              <li><Link to="#" className="hover:text-teal-400">Destek Masası</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Yasal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-teal-400">Gizlilik Politikası</Link></li>
              <li><Link to="#" className="hover:text-teal-400">Kullanım Şartları</Link></li>
              <li><Link to="#" className="hover:text-teal-400">Çerez Ayarları</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} BCT Öğretmeni. Tüm hakları saklıdır.</p>
          <p>Biyomedikal Cihaz Teknolojileri öğrencileri için tasarlanmıştır.</p>
        </div>
      </div>
    </footer>
  );
}