import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from '@/hooks/use-theme';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MaintenancePage } from '@/pages/MaintenancePage';
import { useUserStore } from '@/store/use-user-store';
import { PendingApproval } from '@/components/PendingApproval';
 
export function AppShell() {
  const { pathname, search } = useLocation();
  const { isDark } = useTheme();
  const { user, isAuthenticated, checkSessionExpiry } = useUserStore();

  const isMaintenanceMode = true; // Bakım modu ayarı

  const urlParams = new URLSearchParams(search);
  const keyInUrl = urlParams.get('key');
  const validKey = 'shizi2510';

  const [isAdmin, setIsAdmin] = useState(() => {
    const hasLocalAccess = localStorage.getItem('bct_admin_access') === 'true';
    const hasUrlAccess = keyInUrl === validKey;
    if (hasUrlAccess) localStorage.setItem('bct_admin_access', 'true');
    return hasLocalAccess || hasUrlAccess;
  });

  // Uygulama ilk açıldığında session süresini kontrol et
  useEffect(() => {
    checkSessionExpiry();
  }, []);

  useEffect(() => {
    if (keyInUrl === validKey) {
      setIsAdmin(true);
      localStorage.setItem('bct_admin_access', 'true');
    }

    const root = window.document.documentElement;
    isDark ? root.classList.add('dark') : root.classList.remove('dark');
    document.title = 'BCT Akademi | Biyomedikal Eğitim Portalı';

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const color = isDark ? '#020617' : '#ffffff';
    if (metaThemeColor) metaThemeColor.setAttribute('content', color);
  }, [pathname, isDark, keyInUrl]);

  // --- 1. BAKIM MODU KONTROLÜ ---
  if (isMaintenanceMode && !isAdmin) {
    return <MaintenancePage />;
  }

  // --- 2. ADMIN ONAY KONTROLÜ ---
  if (isAuthenticated && user && !isAdmin) {
    if (user.status === 'pending_admin') {
      return <PendingApproval />;
    }

    if (user.status === 'rejected') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-bold text-red-600">Başvurunuz Onaylanmadı</h1>
            <p className="text-slate-600">Maalesef kriterlerimize uygun bulunmadığınız için kaydınız reddedilmiştir.</p>
            <button onClick={() => useUserStore.getState().logout()} className="text-blue-600 font-bold underline">Çıkış Yap</button>
          </div>
        </div>
      );
    }
  }

  // --- 3. NORMAL SİTE AKIŞI ---
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
