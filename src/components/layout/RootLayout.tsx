import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
interface RootLayoutProps {
  children: React.ReactNode;
}
export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-teal-500/30 selection:text-teal-900">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}