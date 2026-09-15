import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from '@/hooks/use-theme';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export function AppShell() {
  const { pathname } = useLocation();
  const { isDark } = useTheme();

  useEffect(() => {
    document.title = 'BCT Akademi | Biyomedikal Eğitim Portalı';
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', isDark ? '#020617' : '#ffffff');
  }, [pathname, isDark]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 font-sans">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" richColors theme={isDark ? 'dark' : 'light'} className="font-sans" closeButton />
    </div>
  );
}
