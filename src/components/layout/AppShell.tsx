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
    // Synchronize the application's browser tab title with the updated brand name and specific page context
    document.title = 'BCT Akademi | Biyomedikal Eğitim Portalı';
    // Set theme color for mobile browsers to match header branding
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#020617' : '#0f172a');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = isDark ? '#020617' : '#0f172a';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, [pathname, isDark]);
  return (
    <>
      <ScrollToTop />
      <Toaster
        position="top-right"
        richColors
        expand={false}
        theme={isDark ? 'dark' : 'light'}
        className="font-sans"
        closeButton
        duration={4000}
      />
      <Outlet />
    </>
  );
}