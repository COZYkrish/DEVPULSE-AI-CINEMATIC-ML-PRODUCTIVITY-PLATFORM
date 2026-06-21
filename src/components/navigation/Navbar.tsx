import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import 'iconify-icon'; // Make sure the web component is available

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/model-arena', label: 'Arena' },
  { path: '/ai-insights', label: 'Insights' },
  { path: '/developer-lab', label: 'Lab' },
  { path: '/data-explorer', label: 'Explorer' },
  { path: '/history', label: 'History' },
  { path: '/about', label: 'About' },
];

export default function Navbar() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-0 right-0 z-50 pointer-events-none"
      >
        <div className="container flex items-center justify-between">
          
          {/* Left: Glass Circle Logo */}
          <Link
            to="/"
            className="w-12 h-12 rounded-full liquid-glass pointer-events-auto flex items-center justify-center text-white transition-transform hover:scale-105"
          >
            {/* @ts-ignore */}
            <iconify-icon icon="solar:box-minimalistic-linear" width="24" height="24"></iconify-icon>
          </Link>

          {/* Center: Liquid Glass Pill */}
          <div className="hidden lg:flex items-center p-1.5 rounded-full liquid-glass pointer-events-auto">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'relative px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    isActive ? 'text-white' : 'text-white/60 hover:text-white'
                  )}
                  style={{ fontFamily: 'Barlow, sans-serif' }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill-indicator"
                      className="absolute inset-0 bg-white/10 rounded-full -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
            
            {/* CTA Button in Pill */}
            <Link
              to="/dashboard"
              className="ml-2 flex items-center gap-1.5 px-5 py-2.5 bg-white text-black rounded-full font-medium text-sm transition-transform hover:scale-105"
              style={{ fontFamily: 'Barlow, sans-serif' }}
            >
              Launch System
              {/* @ts-ignore */}
              <iconify-icon icon="lucide:arrow-up-right" width="18" height="18"></iconify-icon>
            </Link>
          </div>

          {/* Mobile: Glass Circle Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden w-12 h-12 rounded-full liquid-glass pointer-events-auto flex items-center justify-center text-white transition-transform hover:scale-105"
          >
            {isMobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              /* @ts-ignore */
              <iconify-icon icon="solar:hamburger-menu-linear" width="24" height="24"></iconify-icon>
            )}
          </button>
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
            className="fixed inset-x-0 top-20 z-40 p-4 lg:hidden"
          >
            <div className="liquid-glass-strong rounded-3xl p-4 pointer-events-auto">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={cn(
                        'flex items-center px-4 py-3 text-lg font-medium transition-colors rounded-xl',
                        isActive
                          ? 'text-white bg-white/10'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      )}
                      style={{ fontFamily: 'Barlow, sans-serif' }}
                    >
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
