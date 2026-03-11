import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ScrollToTop } from './ScrollToTop';
/**
 * Global application shell that wraps all routes.
 * Handles cross-cutting concerns like scrolling to top on navigation.
 */
export function AppShell() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = 'BCTAkademi - Biyomedikal Cihaz Teknolojileri';
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}