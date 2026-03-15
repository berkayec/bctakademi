import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Search, LogOut } from 'lucide-react';
import { navLinks } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore, getUserTitle } from '@/store/use-user-store';
import { AuthModal } from '@/components/auth/AuthModal';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '../ThemeToggle';
import { toast } from 'sonner';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const points = user?.points ?? 0;

  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  const handlePortalClick = () => {
    if (isAuthenticated) {
      navigate('/portal');
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Başarıyla çıkış yapıldı.");
    navigate('/');
    setIsOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dersler?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-background/80 text-foreground sticky top-0 z-50 border-b border-border shadow-xl backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20 items-center">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <Logo size={32} className="sm:size-[40px] group-hover:rotate-1 transition-transform duration-300" />
          </Link>

          {/* DESKTOP NAV LİNKLERİ */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-xs font-bold tracking-widest uppercase transition-all relative py-1",
                    isActive ? "text-teal-500" : "text-muted-foreground hover:text-foreground"
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

          <div className="flex items-center gap-2 sm:gap-4">
            {/* DESKTOP ARAMA */}
            <div className="relative hidden lg:flex items-center">
              <form onSubmit={handleSearch} className="flex items-center relative group">
                <Search className="absolute left-3 w-4 h-4 text-muted-foreground group-focus-within:text-teal-500 transition-colors" />
                <Input
                  className="bg-muted border-border w-40 focus:w-60 transition-all duration-300 rounded-xl h-10 pl-10 text-xs font-bold text-foreground placeholder:text-muted-foreground focus-visible:ring-teal-500/50"
                  placeholder="Ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* XP VE UNVAN PANELİ */}
            {isAuthenticated && user && (
              <div className="hidden sm:flex items-center gap-3 bg-muted p-1.5 pr-4 rounded-full border border-border">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-xs font-black text-slate-950">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-teal-500 uppercase leading-none">{getUserTitle(points)}</span>
                  <span className="text-[10px] text-muted-foreground font-bold">{points} XP</span>
                </div>
              </div>
            )}

            <ThemeToggle />

            {/* DESKTOP LOGOUT (Sadece Giriş Yapılmışsa) */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hidden sm:flex rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Çıkış Yap"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            )}

            {/* PORTAL BUTONU */}
            <Button
              onClick={handlePortalClick}
              className="bg-gradient-primary hover:scale-[1.03] text-white font-bold rounded-xl px-3 sm:px-6 h-9 sm:h-11 text-[10px] sm:text-xs transition-all active:scale-95 border-none whitespace-nowrap"
            >
              {isAuthenticated ? (
                <><LayoutDashboard className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Portal</>
              ) : (
                'Portal Giriş'
              )}
            </Button>

            {/* MOBİL BUTONLAR */}
            <div className="md:hidden flex items-center gap-1">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-1.5 text-muted-foreground hover:text-foreground">
                <Search className="w-5 h-5" />
              </button>
              <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 text-muted-foreground hover:text-foreground">
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBİL MENÜ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border z-50 overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-10 space-y-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="block text-xl font-bold text-foreground hover:text-teal-500" 
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated && (
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 text-xl font-bold text-rose-500 pt-4 border-t border-border w-full"
                >
                  <LogOut className="w-5 h-5" /> Çıkış Yap
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  );
}
