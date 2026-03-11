import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Activity, LayoutDashboard } from 'lucide-react';
import { navLinks } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  return (
    <nav className="bg-slate-950 text-slate-100 sticky top-0 z-50 border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-teal-500 p-2 rounded-xl group-hover:bg-teal-400 group-hover:rotate-12 transition-all duration-300">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">
              BCT<span className="text-teal-400">Öğretmeni</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-sm font-bold tracking-wider uppercase transition-all relative py-1",
                    isActive ? "text-teal-400" : "text-slate-400 hover:text-white"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-teal-400 rounded-full" />
                  )}
                </Link>
              );
            })}
            <Link to="/portal">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl px-8 h-12 transition-all active:scale-95 shadow-lg shadow-orange-500/20">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Portala Gir
              </Button>
            </Link>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-300 hover:text-white transition-colors"
              aria-label="Menü"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "md:hidden absolute w-full bg-slate-950 border-b border-slate-800 transition-all duration-300 ease-in-out z-40 shadow-2xl overflow-hidden",
          isOpen ? "max-h-[500px] opacity-100 py-10" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 space-y-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "block text-xl font-bold transition-all",
                  isActive ? "text-teal-400 pl-4 border-l-4 border-teal-400" : "text-slate-400 hover:text-white"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-6">
            <Link to="/portal" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white h-14 text-lg font-bold rounded-2xl">
                Öğrenci Portalı
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}