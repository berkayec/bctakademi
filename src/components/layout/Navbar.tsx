import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Search, LogOut, User, ChevronDown, Award } from 'lucide-react';
import { navLinks } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore, getUserTitle } from '@/store/use-user-store';
import { AuthModal } from '@/components/auth/AuthModal';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle.tsx';
import { toast } from 'sonner';

// 16 avatar — biyomedikal tematik + geometrik karışık
export const AVATARS = [
  { id: 'heart',       emoji: '🫀', label: 'Kalp' },
  { id: 'brain',       emoji: '🧠', label: 'Beyin' },
  { id: 'dna',         emoji: '🧬', label: 'DNA' },
  { id: 'microscope',  emoji: '🔬', label: 'Mikroskop' },
  { id: 'syringe',     emoji: '💉', label: 'Şırınga' },
  { id: 'pill',        emoji: '💊', label: 'İlaç' },
  { id: 'stethoscope', emoji: '🩺', label: 'Stetoskop' },
  { id: 'xray',        emoji: '🩻', label: 'X-Ray' },
  { id: 'robot',       emoji: '🤖', label: 'Robot' },
  { id: 'atom',        emoji: '⚛️',  label: 'Atom' },
  { id: 'circuit',     emoji: '🔌', label: 'Devre' },
  { id: 'chart',       emoji: '📈', label: 'Grafik' },
  { id: 'shield',      emoji: '🛡️',  label: 'Kalkan' },
  { id: 'star',        emoji: '⭐', label: 'Yıldız' },
  { id: 'lightning',   emoji: '⚡', label: 'Enerji' },
  { id: 'gem',         emoji: '💎', label: 'Elmas' },
];

export function Navbar() {
  const [isOpen,     setIsOpen]     = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const location = useLocation();
  const navigate = useNavigate();
  const dropRef  = useRef<HTMLDivElement>(null);

  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const user            = useUserStore((s) => s.user);
  const logout          = useUserStore((s) => s.logout);
  const points          = user?.points ?? 0;

  useEffect(() => { setSearchQuery(urlQuery); }, [urlQuery]);
  useEffect(() => { setIsOpen(false); setIsDropOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setIsDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/dersler?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = () => {
    logout();
    toast.success('Başarıyla çıkış yapıldı.');
    navigate('/');
    setIsOpen(false);
    setIsDropOpen(false);
  };

  const avatarEmoji = user?.avatar
    ? AVATARS.find(a => a.id === user.avatar)?.emoji
    : null;

  const initials = user?.username
    ? user.username.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className="bg-background/80 text-foreground sticky top-0 z-50 border-b border-border shadow-xl backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

          {/* LOGO — shrink-0 ile asla küçülmez */}
          <Link to="/" className="shrink-0 group">
            <Logo size={36} className="group-hover:rotate-1 transition-transform duration-300" />
          </Link>

          {/* DESKTOP NAV — ortada, overflow olmaz */}
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

            {isAuthenticated && user ? (
              <>
                {/* AVATAR DROPDOWN */}
                <div className="relative hidden sm:block" ref={dropRef}>
                  <button
                    onClick={() => setIsDropOpen(v => !v)}
                    className="flex items-center gap-2 bg-muted hover:bg-muted/80 pl-1.5 pr-3 py-1.5 rounded-full border border-border transition-all"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-sm shrink-0">
                      {avatarEmoji ? (
                        <span className="text-base leading-none">{avatarEmoji}</span>
                      ) : (
                        <span className="text-[11px] font-black text-white">{initials}</span>
                      )}
                    </div>
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[10px] font-black text-teal-500 uppercase tracking-wide">{getUserTitle(points)}</span>
                      <span className="text-[10px] text-muted-foreground font-bold">{points} XP</span>
                    </div>
                    <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform duration-200', isDropOpen && 'rotate-180')} />
                  </button>

                  <AnimatePresence>
                    {isDropOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-border bg-muted/30">
                          <p className="text-sm font-bold text-foreground truncate">{user.username}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          {[
                            { to: '/profil',      icon: User,            label: 'Profilim' },
                            { to: '/portal',      icon: LayoutDashboard, label: 'Portal' },
                            { to: '/sertifikalar',icon: Award,           label: 'Sertifikalarım' },
                          ].map(item => (
                            <Link
                              key={item.to}
                              to={item.to}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                              onClick={() => setIsDropOpen(false)}
                            >
                              <item.icon className="w-4 h-4 text-muted-foreground" />
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-border py-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            Çıkış Yap
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* PORTAL BUTONU */}
                <Button
                  onClick={() => navigate('/portal')}
                  className="hidden sm:flex bg-gradient-primary hover:scale-[1.03] text-white font-bold rounded-xl px-4 h-9 text-[11px] transition-all active:scale-95 border-none whitespace-nowrap"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" /> Portal
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsAuthOpen(true)}
                className="bg-gradient-primary hover:scale-[1.03] text-white font-bold rounded-xl px-4 sm:px-6 h-9 sm:h-10 text-[11px] transition-all active:scale-95 border-none whitespace-nowrap"
              >
                Portal Giriş
              </Button>
            )}

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
              {isAuthenticated && user && (
                <div className="flex items-center gap-3 pb-5 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-base shrink-0">
                    {avatarEmoji ? avatarEmoji : <span className="text-sm font-black text-white">{initials}</span>}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{user.username}</p>
                    <p className="text-xs text-teal-500 font-bold">{points} XP · {getUserTitle(points)}</p>
                  </div>
                </div>
              )}

              {navLinks.map((link) => (
                <Link key={link.name} to={link.href} className="block text-xl font-bold text-foreground" onClick={() => setIsOpen(false)}>
                  {link.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="pt-4 border-t border-border space-y-4">
                  <Link to="/profil"       className="flex items-center gap-2 text-lg font-bold text-foreground" onClick={() => setIsOpen(false)}><User className="w-5 h-5" /> Profilim</Link>
                  <Link to="/portal"       className="flex items-center gap-2 text-lg font-bold text-foreground" onClick={() => setIsOpen(false)}><LayoutDashboard className="w-5 h-5" /> Portal</Link>
                  <Link to="/sertifikalar" className="flex items-center gap-2 text-lg font-bold text-foreground" onClick={() => setIsOpen(false)}><Award className="w-5 h-5" /> Sertifikalarım</Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-xl font-bold text-rose-500 w-full text-left pt-2 border-t border-border">
                    <LogOut className="w-5 h-5" /> Çıkış Yap
                  </button>
                </div>
              ) : (
                <Button onClick={() => { setIsAuthOpen(true); setIsOpen(false); }} className="w-full bg-gradient-primary text-white font-bold rounded-xl h-12 border-none">
                  Portal Giriş
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  );
}
