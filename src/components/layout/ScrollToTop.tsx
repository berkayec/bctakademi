import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
/**
 * Utility component that handles scrolling to top on route transitions.
 * Since we are using standard window scrolling, this ensures a clean jump 
 * to the top of the viewport when clicking links.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Immediate scroll to top on path change
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}