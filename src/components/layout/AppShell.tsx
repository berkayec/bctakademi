// src/components/layout/AppShell.tsx
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from '@/hooks/use-theme';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MaintenancePage } from '@/pages/MaintenancePage';

export function AppShell() {
  const { pathname, search } = useLocation();
  const { isDark } = useTheme();
  
  // 1. Bakım Modu Ayarı (Gerçekten kapatmak istediğinde true yap)
  const isMaintenanceMode = true; 

  // 2. Admin Durumu Kontrolü (URL'den veya Hafızadan)
  const urlParams = new URLSearchParams(search);
  const keyInUrl = urlParams.get('key');
  
  // Başlangıçta hafızada kayıt var mı kontrol et
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('bct_admin_access') === 'true';
  });

  useEffect(() => {
    // URL'de doğru anahtar varsa hafızaya kaydet ve yetki ver
    if (keyInUrl === 'shizi2510') {
      localStorage.setItem('bct_admin_access', 'true');
      setIsAdmin(true);
    }

    // Temel tema ve başlık ayarları
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
    }
  }, [pathname, isDark, keyInUrl]);

  // --- EĞER BAKIM MODUNDAYSAK VE ADMIN DEĞİLSEK ---
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
        theme={isDark ? 'dark' : 'light'}
        className="font-sans"
        closeButton
      />
    </div>
  );
}
