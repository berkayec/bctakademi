import React from 'react';
import { Outlet } from 'react-router-dom';
import { ScrollToTop } from './ScrollToTop';
/**
 * Global application shell that wraps all routes.
 * Handles cross-cutting concerns like scrolling to top on navigation.
 */
export function AppShell() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}