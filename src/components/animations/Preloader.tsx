import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-8"
          >
            <div className="w-20 h-20 border border-white flex items-center justify-center bg-white/5">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 10px rgba(255, 255, 255, 0.1)',
                  '0 0 30px rgba(255, 255, 255, 0.2)',
                  '0 0 10px rgba(255, 255, 255, 0.1)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0"
            />
          </motion.div>

          {/* Text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-2xl font-light uppercase tracking-widest mb-2"
            style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF' }}
          >
            DEVPULSE <span className="font-bold">AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-[10px] uppercase tracking-widest mb-8"
            style={{ color: '#888888', fontFamily: 'JetBrains Mono, monospace' }}
          >
            Initializing prediction engine...
          </motion.p>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-48 h-px overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <motion.div
              className="h-full"
              style={{
                background: '#FFFFFF',
                width: `${Math.min(progress, 100)}%`,
                transition: 'width 0.3s ease-out',
              }}
            />
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-3 text-[10px] uppercase tracking-widest"
            style={{ color: '#888888', fontFamily: 'JetBrains Mono, monospace' }}
          >
            {Math.min(Math.round(progress), 100)}%
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
