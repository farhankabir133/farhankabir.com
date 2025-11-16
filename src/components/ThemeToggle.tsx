import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for saved theme in localStorage, otherwise use system preference
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    // Apply the theme class to the root element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className="relative flex items-center justify-center">
        <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors duration-300
                    text-slate-700 dark:text-amber-400 
                    hover:bg-slate-200/70 dark:hover:bg-slate-700/70 
                    focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 
                    focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800"
            whileTap={{ scale: 0.9, rotate: 15 }}
            aria-label="Toggle theme"
            data-cursor="pointer"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={isDarkMode ? "moon" : "sun"}
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </motion.div>
            </AnimatePresence>
        </motion.button>
    </div>
  );
};

export default ThemeToggle;
