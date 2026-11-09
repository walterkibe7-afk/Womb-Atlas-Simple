import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col h-full w-full bg-[#F7F3EC] text-[#4A2B33] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center"
      >
        <span className="font-serif text-4xl lg:text-5xl font-normal tracking-tight block">Womb Atlas</span>
        <p className="text-xs text-[#7A5862] font-sans mt-2">A private sanctuary for your rhythm</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: 'easeInOut' }}
        className="mt-8 flex items-center gap-2"
      >
        <div className="w-2 h-2 rounded-full bg-[#C99A86] animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-[#C99A86] animate-pulse" style={{ animationDelay: '0.15s' }} />
        <div className="w-2 h-2 rounded-full bg-[#C99A86] animate-pulse" style={{ animationDelay: '0.3s' }} />
      </motion.div>
    </div>
  );
};