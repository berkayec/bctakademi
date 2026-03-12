// src/components/layout/AppShell.tsx
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from '@/hooks/use-theme';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer'; // Footer eklendi

export function AppShell() {
  const { pathname } = useLocation();
  const { isDark } = useTheme();

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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 font-sans">
      <ScrollToTop />
      <Navbar /> 
      
      {/* flex-1 sayesinde içerik az olsa bile footer en altta kalır */}
      <main className="flex-1">
        <Outlet /> 
      </main>

      {/* FOOTER BURAYA EKLENDİ */}
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
