import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, LayoutDashboard, BarChart3, Trophy, Brain, FlaskConical, Database, History, Info, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/model-arena', label: 'Arena', icon: Trophy },
  { path: '/ai-insights', label: 'Insights', icon: Brain },
  { path: '/developer-lab', label: 'Lab', icon: FlaskConical },
  { path: '/data-explorer', label: 'Explorer', icon: Database },
  { path: '/history', label: 'History', icon: History },
  { path: '/about', label: 'About', icon: Info },
];

export default function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled || !isLanding
            ? 'py-2'
            : 'py-4'
        )}
      >
        <div className="container transition-all duration-500">
          <div
            className={cn(
              'flex items-center justify-between px-4 sm:px-6 py-3 transition-all duration-500',
              isScrolled || !isLanding
                ? 'border border-white/20 bg-black/80 backdrop-blur-md shadow-lg shadow-black/20'
                : 'bg-transparent'
            )}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative w-10 h-10 border border-white flex items-center justify-center bg-white/5 transition-colors group-hover:bg-white">
                <Zap className="w-5 h-5 text-white group-hover:text-black transition-colors" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-light tracking-widest uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}>
                  DEVPULSE
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase -mt-1" style={{ color: '#AAAAAA', fontFamily: 'JetBrains Mono, monospace' }}>
                  AI
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'relative flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-widest transition-all duration-300 font-bold',
                      isActive
                        ? 'text-white'
                        : 'text-gray-500 hover:text-white'
                    )}
                    style={{ fontFamily: 'JetBrains Mono' }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 -z-10"
                        style={{ borderBottom: '1px solid #FFFFFF' }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-2 px-4 py-2 border border-white bg-white text-black text-[10px] uppercase tracking-widest font-bold transition-all duration-300 hover:bg-black hover:text-white"
                style={{ fontFamily: 'JetBrains Mono' }}
              >
                <Zap className="w-3.5 h-3.5" />
                Launch System
              </Link>

              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden p-2 transition-colors border border-white/20 hover:bg-white/10"
                style={{ color: '#FFFFFF' }}
              >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-16 z-40 p-4 lg:hidden"
          >
            <div className="border border-white/20 bg-black/95 backdrop-blur-md p-4 shadow-xl shadow-black/30">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-all duration-200 border border-transparent',
                        isActive
                          ? 'text-white border-white/20 bg-white/5'
                          : 'text-gray-500 hover:text-white hover:border-white/10 hover:bg-white/5'
                      )}
                      style={{ fontFamily: 'JetBrains Mono' }}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
