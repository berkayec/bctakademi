import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ScrollToTop } from './ScrollToTop';
/**
 * Global application shell that wraps all routes.
 * Handles cross-cutting concerns like scrolling to top on navigation
 * and setting page metadata.
 */
export function AppShell() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Ensure the professional brand name persists across all views
    document.title = 'BCTAkademi - Biyomedikal Cihaz Teknolojileri';
  }, [pathname]);
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}