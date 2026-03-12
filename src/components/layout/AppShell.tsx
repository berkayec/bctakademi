import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from '@/hooks/use-theme';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MaintenancePage } from '@/pages/MaintenancePage'; // Import etmeyi unutma

export function AppShell() {
  const { pathname, search } = useLocation();
  const { isDark } = useTheme();

  // --- BAKIM MODU KONTROLÜ ---
  // Siteyi kapatmak istediğinde burayı 'true' yap.
  const isMaintenanceMode = true; 

  // Kendi girişin için gizli anahtar (bctakademi.com/?admin=true)
  const isAdmin = new URLSearchParams(search).get('key') === 'shizi2510';

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    document.title = 'BCT Akademi | Biyomedikal Eğitim Portalı';
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const color = isDark ? '#020617' : '#ffffff';
    
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, [pathname, isDark]);

  // Eğer bakım modu aktifse ve admin parametresi yoksa sadece Bakım Sayfasını göster
  if (isMaintenanceMode && !isAdmin) {
    return <MaintenancePage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 font-sans">
      <ScrollToTop />
      <Navbar /> 
      
      <main className="flex-1">
        <Outlet /> 
      </main>

      <Footer />

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
