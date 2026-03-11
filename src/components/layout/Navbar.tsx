import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Search, LogOut } from 'lucide-react';
import { navLinks } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore, getUserTitle } from '@/store/use-user-store';
import { AuthModal } from '@/components/auth/AuthModal';
import { Logo } from '@/components/Logo';
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  useEffect(() => {
    document.title = 'BCTAkademi - Biyomedikal Cihaz Teknolojileri';
  }, []);
  const handlePortalClick = () => {
    if (isAuthenticated) {
      navigate('/portal');
    } else {
      setIsAuthOpen(true);
    }
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dersler?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };
  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);
  return (
    <nav className="bg-slate-950 text-slate-100 sticky top-0 z-50 border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo size={42} className="group-hover:rotate-6 transition-transform duration-300" />
            <span className="font-display font-bold text-2xl tracking-tighter hidden sm:inline-block">
              BCTA<span className="text-teal-400">kademi</span>
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
                    "text-xs font-bold tracking-widest uppercase transition-all relative py-1",
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
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:flex items-center">
              <form onSubmit={handleSearch} className="flex items-center relative">
                <Search className="absolute left-3 w-4 h-4 text-slate-500" />
                <Input
                  className="bg-slate-900 border-slate-800 w-40 focus:w-56 transition-all rounded-xl h-10 pl-10 text-xs font-bold text-white placeholder:text-slate-500 focus-visible:ring-teal-500"
                  placeholder="Ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
            {isAuthenticated && user && (
              <div className="hidden sm:flex items-center gap-4 bg-slate-900/50 p-1 pr-4 rounded-full border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold shadow-lg shadow-teal-500/20">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-teal-400 uppercase leading-none">{getUserTitle(user.points)}</span>
                  <span className="text-[10px] text-slate-400 font-bold">{user.points} XP</span>
                </div>
              </div>
            )}
            <Button
              onClick={handlePortalClick}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl px-6 h-11 transition-all active:scale-95 shadow-lg shadow-orange-500/20 border-none"
            >
              {isAuthenticated ? <><LayoutDashboard className="w-4 h-4 mr-2" /> Portal</> : 'Portal Giriş'}
            </Button>
            <div className="md:hidden flex items-center gap-2">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-slate-300 hover:text-white">
                <Search className="w-6 h-6" />
              </button>
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-300 hover:text-white" aria-label="Menü">
                {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-slate-900 border-b border-slate-800 md:hidden overflow-hidden">
            <div className="p-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input className="bg-slate-950 border-slate-800 h-14 pl-12 rounded-xl text-white focus:ring-teal-500" placeholder="Arama yap..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={cn("md:hidden absolute w-full bg-slate-950 border-b border-slate-800 transition-all duration-300 z-40 overflow-hidden", isOpen ? "max-h-[600px] opacity-100 py-10" : "max-h-0 opacity-0")}>
        <div className="px-6 space-y-6">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.href} className="block text-xl font-bold text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>
              {link.name}
            </Link>
          ))}
          {isAuthenticated && (
            <button onClick={() => { logout(); setIsOpen(false); }} className="flex items-center gap-2 text-xl font-bold text-rose-400">
              <LogOut className="w-5 h-5" /> Çıkış Yap
            </button>
          )}
        </div>
      </div>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  );
}