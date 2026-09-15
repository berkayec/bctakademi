import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { navLinks } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle.tsx';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { setSearchQuery(urlQuery); }, [urlQuery]);
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/dersler?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <nav className="bg-background/80 text-foreground sticky top-0 z-50 border-b border-border shadow-xl backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

          {/* LOGO */}
          <Link to="/" className="shrink-0 group">
            <Logo size={36} className="group-hover:rotate-1 transition-transform duration-300" />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 overflow-hidden">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    'text-[11px] font-bold tracking-widest uppercase transition-all relative py-1 whitespace-nowrap shrink-0',
                    isActive ? 'text-teal-500' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-2 left-0 w-full h-1 bg-teal-500 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* SAĞ KISIM */}
          <div className="flex items-center gap-2 shrink-0">

            {/* ARAMA — sadece xl ekranda */}
            <div className="hidden xl:flex items-center">
              <form onSubmit={handleSearch} className="flex items-center relative group">
                <Search className="absolute left-3 w-4 h-4 text-muted-foreground group-focus-within:text-teal-500 transition-colors" />
                <Input
                  className="bg-muted border-border w-36 focus:w-52 transition-all duration-300 rounded-xl h-9 pl-9 text-xs font-bold text-foreground placeholder:text-muted-foreground focus-visible:ring-teal-500/50"
                  placeholder="Ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            <ThemeToggle />

            {/* MOBİL MENÜ */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1.5 text-muted-foreground hover:text-foreground"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBİL MENÜ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border z-50 overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-8 space-y-5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-xl font-bold text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
