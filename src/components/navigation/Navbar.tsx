import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, LayoutDashboard, BarChart3, Trophy, Brain, FlaskConical, Database, History, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
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
        <div className={cn(
          'container transition-all duration-500',
          isScrolled || !isLanding ? '' : ''
        )}>
          <div
            className={cn(
              'flex items-center justify-between rounded-2xl px-4 sm:px-6 py-3 transition-all duration-500',
              isScrolled || !isLanding
                ? 'glass shadow-lg shadow-black/20'
                : 'bg-transparent'
            )}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #00E5FF, #7C3AED)' }}
              >
                <Zap className="w-5 h-5 text-white relative z-10" strokeWidth={2.5} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #00E5FF)' }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#F1F5F9' }}>
                  DEVPULSE
                </span>
                <span className="text-[10px] font-medium -mt-0.5" style={{ color: '#00E5FF', fontFamily: 'JetBrains Mono, monospace' }}>
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
                      'relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300',
                      isActive
                        ? 'text-[#00E5FF]'
                        : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 rounded-lg -z-10"
                        style={{ background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.2)' }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #00E5FF, #22D3EE)',
                  color: '#050816',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                <Zap className="w-3.5 h-3.5" />
                Launch
              </Link>

              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden p-2 rounded-lg transition-colors"
                style={{ color: '#94A3B8' }}
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
            <div className="glass rounded-2xl p-4 shadow-xl shadow-black/30">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'text-[#00E5FF] bg-[rgba(0,229,255,0.1)]'
                          : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[rgba(255,255,255,0.05)]'
                      )}
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
