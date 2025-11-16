import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense initialization error:', error);
    }
  }, []);

  return (
    <footer className="footer-section dark:bg-slate-900 text-slate-800 dark:text-white py-12 sm:py-16 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-4">
              Farhan Kabir
            </h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-base transition-colors duration-300">
              Full Stack Developer & UI/UX Designer passionate about creating 
              exceptional digital experiences that make a difference.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 mb-8 text-sm sm:text-base transition-colors duration-300"
          >
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>and lots of coffee</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400 mb-8 font-semibold text-sm sm:text-base md:text-lg transition-colors duration-300"
          >
            <span className="text-center">THIS SITE IS STILL UNDER CONSTRUCTION 💪</span>
            <span className="text-center">After completion of site will be available on 👇</span>
            <span className="mt-2 text-center text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-bold transition-colors duration-300">
              farhankabir.com
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-t border-slate-200 dark:border-slate-800 pt-8 mt-8 transition-colors duration-300"
          >
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base transition-colors duration-300">
              © 2025 Farhan Kabir. All rights reserved.
            </p>
          </motion.div>
        </div>

        {/* Back to Top Button */}
        <motion.button
          onClick={scrollToTop}
          className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          data-cursor="pointer"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </motion.button>
      </div>
    </footer>
  );
};

export default Footer;
