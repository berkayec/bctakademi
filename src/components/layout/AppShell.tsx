import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from '@/hooks/use-theme';
import { ScrollToTop } from '@/components/layout/ScrollToTop'; // Absolute path kullanıldı
import { Navbar } from '@/components/layout/Navbar'; // Doğrulanmış tam yol

/**
 * Global uygulama kabuğu. 
 * Navbar'ı sabitler, sayfa geçişlerinde en üste kaydırır 
 * ve bildirim sistemini (Toaster) yönetir.
 */
export function AppShell() {
  const { pathname } = useLocation();
  const { isDark } = useTheme();

  useEffect(() => {
    // Tarayıcı sekme başlığını güncelle
    document.title = 'BCT Akademi | Biyomedikal Eğitim Portalı';
    
    // Mobil tarayıcılar için üst bar renk uyumu
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const color = isDark ? '#020617' : '#0f172a';
    
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, [pathname, isDark]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e1a]">
      {/* Sayfa her değiştiğinde otomatik en üste kaydırır */}
      <ScrollToTop />
      
      {/* Navbar artık tüm sayfalarda buradan yönetiliyor */}
      <Navbar /> 
      
      <main className="flex-1">
        {/* main.tsx içindeki çocuk sayfalar buraya yüklenir */}
        <Outlet /> 
      </main>

      {/* Global bildirim sistemi */}
      <Toaster
        position="top-right"
        richColors
        expand={false}
        theme={isDark ? 'dark' : 'light'}
        className="font-sans"
        closeButton
        duration={4000}
      />
    </div>
  );
}
