import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Activity } from 'lucide-react';
import { navLinks } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  return (
    <nav className="bg-slate-950 text-slate-100 sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-teal-500 p-1.5 rounded-lg group-hover:bg-teal-400 transition-colors">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              BCT<span className="text-teal-400">Öğretmeni</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-all relative py-1",
                    isActive ? "text-teal-400" : "text-slate-300 hover:text-teal-400"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400 rounded-full" />
                  )}
                </Link>
              );
            })}
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-6 transition-transform active:scale-95">
              Öğrenci Girişi
            </Button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "md:hidden absolute w-full bg-slate-950 border-b border-slate-800 transition-all duration-300 ease-in-out z-40 shadow-2xl",
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="px-4 py-8 space-y-4">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "block text-lg font-semibold transition-colors",
                  isActive ? "text-teal-400 pl-2 border-l-2 border-teal-400" : "text-slate-300 hover:text-teal-400"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-base">
              Öğrenci Girişi
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}