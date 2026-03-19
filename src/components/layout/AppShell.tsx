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

const MAINTENANCE_MODE = true;

async function verifyAdminKey(key: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/users?key=${encodeURIComponent(key)}`);
    return res.ok;
  } catch {
    return false;
  }
}

export function AppShell() {
  const { pathname, search } = useLocation();
  const { isDark } = useTheme();
  const { user, isAuthenticated, checkSessionExpiry } = useUserStore();

  const urlParams = new URLSearchParams(search);
  const keyInUrl  = urlParams.get('key');

  const [isAdmin, setIsAdmin] = useState<boolean>(
    () => sessionStorage.getItem('bct_admin_verified') === 'true'
  );

  useEffect(() => {
    checkSessionExpiry();
  }, [checkSessionExpiry]);

  useEffect(() => {
    if (!keyInUrl) return;
    verifyAdminKey(keyInUrl).then(valid => {
      if (valid) {
        setIsAdmin(true);
        sessionStorage.setItem('bct_admin_verified', 'true');
      }
    });
  }, [keyInUrl]);

  // Meta güncellemeleri — tema DOM uygulaması use-theme hook'unda yapılıyor
  useEffect(() => {
    document.title = 'BCT Akademi | Biyomedikal Eğitim Portalı';
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', isDark ? '#020617' : '#ffffff');
  }, [pathname, isDark]);

  if (MAINTENANCE_MODE && !isAdmin) {
    return <MaintenancePage />;
  }

  if (isAuthenticated && user && !isAdmin) {
    if (user.status === 'pending_admin') {
      return <PendingApproval />;
    }
    if (user.status === 'rejected') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6 text-center transition-colors">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-bold text-destructive">Başvurunuz Onaylanmadı</h1>
            <p className="text-muted-foreground">
              Maalesef kriterlerimize uygun bulunmadığınız için kaydınız reddedilmiştir.
            </p>
            <button
              onClick={() => useUserStore.getState().logout()}
              className="text-primary font-bold underline underline-offset-4 hover:text-primary/80 transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      );
    }
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
