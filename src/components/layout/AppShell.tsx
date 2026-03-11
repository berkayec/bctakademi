import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from '@/hooks/use-theme';
import { ScrollToTop } from './ScrollToTop';
/**
 * Global application shell that wraps all routes.
 * Handles cross-cutting concerns like scrolling to top on navigation,
 * setting page metadata, and hosting the global notification system.
 */
export function AppShell() {
  const { pathname } = useLocation();
  const { isDark } = useTheme();
  useEffect(() => {
    // Ensure the professional brand name persists across all views
    document.title = 'BCTAkademi - Biyomedikal Cihaz Teknolojileri';
  }, [pathname]);
  return (
    <>
      <ScrollToTop />
      <Toaster
        position="top-right"
        richColors
        expand={false}
        theme={isDark ? 'dark' : 'light'}
        className="font-sans"
      />
      <Outlet />
    </>
  );
}