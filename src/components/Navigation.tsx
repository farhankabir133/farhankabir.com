import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Blog", href: "#blog" },
  { name: "Contact", href: "#contact" },
];

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<string>("Home");

  const scrollToSection = (href: string, name: string) => {
    const section = document.querySelector(href);
    if (section) section.scrollIntoView({ behavior: "smooth" });
    setActive(name);
    setIsOpen(false);
  };

  // Track section on scroll
  useEffect(() => {
    const handleScroll = () => {
      navItems.forEach((item) => {
        const section = document.querySelector(item.href);
        if (!section) return;

        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.4) {
          setActive(item.name);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 🖥 DESKTOP NAV */}
      <motion.nav
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden md:flex fixed inset-x-0 top-4 z-50 justify-center px-[clamp(12px,4vw,48px)]"
      >
        <div
          className="
            max-w-[clamp(900px,80vw,1400px)] w-full flex items-center justify-between
            px-[clamp(16px,3vw,36px)] py-[clamp(8px,2vh,14px)]
            rounded-full backdrop-blur-xl border 
            shadow-[0_8px_30px_rgb(0,0,0,0.06)]
            bg-white/60 dark:bg-slate-900/40
            border-white/40 dark:border-white/10
          "
        >
          {/* Branding */}
          <h1 className="font-semibold text-[clamp(1rem,1.6vw,1.25rem)] tracking-wide text-neutral-900 dark:text-neutral-100 cursor-pointer" onClick={() => scrollToSection('#home', 'Home')}>
            Farhan Kabir
          </h1>

          {/* Nav Items */}
          <div className="relative flex items-center gap-[clamp(12px,2vw,32px)]">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.href, item.name)}
                className="
                  relative font-medium transition-opacity text-neutral-900 dark:text-neutral-200
                  text-[clamp(0.8rem,1.2vw,1rem)]
                "
                whileHover={{ opacity: 0.6 }}
              >
                {item.name}

                {/* 🍏 Elastic Active Underline */}
                {active === item.name && (
                  <motion.div
                    layoutId="apple-underline"
                    className="
                      absolute left-0 right-0 -bottom-[6px] h-[2px]
                      bg-neutral-900 dark:bg-neutral-100 rounded-full
                    "
                    transition={{
                      type: "spring",
                      stiffness: 900,
                      damping: 22,
                      mass: 0.3
                    }}
                  />
                )}
              </motion.button>
            ))}

            <ThemeToggle />
          </div>
        </div>
      </motion.nav>

      {/* 📱 MOBILE TOGGLE BUTTON */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="
          md:hidden fixed top-4 right-4 z-50 p-[clamp(10px,3vw,14px)]
          rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl
          border border-white/40 dark:border-white/10 shadow-lg
        "
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </motion.button>

      {/* 📱 FULLSCREEN MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center
              bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"
          >
            <ul className="flex flex-col items-center gap-[clamp(18px,4vw,32px)]
                           text-[clamp(1rem,4vw,2rem)]">
              {navItems.map((item) => (
                <motion.li key={item.name} whileHover={{ scale: 1.05 }}>
                  <button
                    onClick={() => scrollToSection(item.href, item.name)}
                    className="text-neutral-800 dark:text-neutral-200 font-semibold tracking-wide"
                  >
                    {item.name}
                  </button>
                </motion.li>
              ))}
              <ThemeToggle />
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
