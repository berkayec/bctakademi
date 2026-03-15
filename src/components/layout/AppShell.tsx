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
  
  // 1. Bakım Modu Ayarı (Aktif etmek için true, kapatmak için false yapabilirsin)
  const isMaintenanceMode = true; 

  // 2. Admin Erişim Kontrolü
  const urlParams = new URLSearchParams(search);
  const keyInUrl = urlParams.get('key');
  const validKey = 'shizi2510';

  // State'i başlatırken hem hafızaya hem de URL'e anlık bakıyoruz.
  // Bu sayede sayfa geçişlerinde veya yenilemelerde "admin" durumu kaybolmaz.
  const [isAdmin, setIsAdmin] = useState(() => {
    const hasLocalAccess = localStorage.getItem('bct_admin_access') === 'true';
    const hasUrlAccess = keyInUrl === validKey;
    
    if (hasUrlAccess) {
      localStorage.setItem('bct_admin_access', 'true');
    }
    
    return hasLocalAccess || hasUrlAccess;
  });

  useEffect(() => {
    // Navigasyon sırasında URL'de anahtar yakalanırsa yetkiyi güncelle
    if (keyInUrl === validKey) {
      setIsAdmin(true);
      localStorage.setItem('bct_admin_access', 'true');
    }

    // Tema ve Stil Ayarları
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

  // --- BAKIM MODU KONTROLÜ ---
  // Admin yetkisi yoksa ve bakım modu aktifse kullanıcıyı engelle
  if (isMaintenanceMode && !isAdmin) {
    return <MaintenancePage />;
  }

  // Admin yetkisi varsa veya bakım modu kapalıysa normal siteyi göster
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
