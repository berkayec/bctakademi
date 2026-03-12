import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from '@/hooks/use-theme';
import { ScrollToTop } from './ScrollToTop';
import { Navbar } from './Navbar'; // Navbar'ı buraya ekledik

export function AppShell() {
  const { pathname } = useLocation();
  const { isDark } = useTheme();

  useEffect(() => {
    document.title = 'BCT Akademi | Biyomedikal Eğitim Portalı';
    
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
      <ScrollToTop />
      <Navbar /> {/* Navbar artık tüm sayfalarda otomatik görünecek */}
      
      <main className="flex-1">
        <Outlet /> {/* Sayfalar buraya yüklenecek */}
      </main>

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
