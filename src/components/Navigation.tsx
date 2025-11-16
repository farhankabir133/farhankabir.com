import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#contact' },
];

const menuVariants = {
  open: { opacity: 1, y: 0, transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
  closed: { opacity: 0, y: 50, transition: { when: 'afterChildren' } },
};

const navItemVariants = {
  open: { y: 0, opacity: 1, transition: { y: { stiffness: 1000, velocity: -100 } } },
  closed: { y: 50, opacity: 0, transition: { y: { stiffness: 1000 } } },
};

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <>
      {/* --- Desktop Navbar --- */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 120, damping: 20 }}
        className="hidden md:block fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-[1280px] flex items-center justify-between p-2 rounded-full border shadow-lg
                        bg-white/60 border-slate-200/80 backdrop-blur-lg dark:bg-slate-800/60 dark:border-slate-700/70">
          <div className="text-lg lg:text-xl font-bold tracking-wide bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Farhan Kabir
          </div>
          <div className="flex items-center gap-2 lg:gap-4 flex-nowrap">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-slate-800 dark:text-slate-200 hover:text-amber-500 dark:hover:text-amber-400
                           transition-colors duration-200 font-medium tracking-wide
                           px-[clamp(8px,1.5vw,16px)] py-[clamp(4px,1vw,8px)]
                           text-[clamp(0.875rem,2vw,1rem)] lg:text-[clamp(1rem,1.5vw,1.125rem)]
                           rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
                whileHover={{ y: -2 }}
              >
                {item.name}
              </motion.button>
            ))}
            <ThemeToggle />
          </div>
        </div>
      </motion.nav>

      {/* --- Mobile Menu Button --- */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-[env(safe-area-inset-top,16px)] right-[env(safe-area-inset-right,16px)] z-50
                   p-[clamp(8px,2vw,12px)] rounded-full shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-md
                   focus:outline-none ring-2 ring-amber-400/50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'x' : 'menu'}
            initial={{ rotate: 45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -45, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="w-6 h-6 text-slate-800 dark:text-slate-200" /> : <Menu className="w-6 h-6 text-slate-800 dark:text-slate-200" />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* --- Mobile Fullscreen Menu --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center
                       max-h-[90vh] overflow-y-auto px-4"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.div className="text-3xl xs:text-4xl font-bold tracking-wide bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent absolute top-16 xs:top-20 text-center">
              Farhan Kabir
            </motion.div>

            <motion.ul className="flex flex-col items-center justify-center space-y-2 xs:space-y-4 w-full" variants={menuVariants}>
              {navItems.map((item) => (
                <motion.li key={item.name} variants={navItemVariants} className="w-full">
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className="w-full text-center py-[clamp(12px,3vh,20px)]
                               text-[clamp(1rem,3vw,1.5rem)] text-slate-700 dark:text-slate-300
                               hover:text-amber-500 dark:hover:text-amber-400 font-semibold tracking-wider"
                  >
                    {item.name}
                  </button>
                </motion.li>
              ))}
            </motion.ul>

            <div className="absolute bottom-[env(safe-area-inset-bottom,32px)]">
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
