import { useState, useEffect } from 'react';

// Tema tercihini localStorage'da sakla — sayfa değişimlerinde kaybolmaz
export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('bct-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // isDark değiştiğinde DOM ve localStorage'ı güncelle
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('bct-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Sayfa yüklendiğinde localStorage'dan oku ve DOM'a uygula (flash önleme)
  useEffect(() => {
    const saved = localStorage.getItem('bct-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = saved ? saved === 'dark' : prefersDark;
    
    const root = window.document.documentElement;
    if (shouldBeDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // State'i sadece uyumsuzluk varsa güncelle
    setIsDark(shouldBeDark);
  }, []);

  const toggleTheme = () => setIsDark(prev => !prev);

  return { isDark, toggleTheme };
}