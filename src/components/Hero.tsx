import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Download } from 'lucide-react';
import GravityCodeOrbsBackground from './GravityCodeOrbsBackground';

const Hero: React.FC = () => {
  const scrollToNext = () => {
    const nextSection = document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
  <section id="home" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-black full-vh">
      <GravityCodeOrbsBackground />
  <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pt-20 sm:pt-32 pb-16">
        <motion.div
          className="mb-2"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.span
            className="block text-2xl md:text-3xl text-white text-center tracking-wider"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            Hi, I&apos;m
          </motion.span>
        </motion.div>
        <motion.h1
          className="text-4xl md:text-6xl text-white text-center mb-4 drop-shadow-lg"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Farhan Kabir
        </motion.h1>
        <motion.div
          className="text-xl md:text-2xl mb-8 text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.span
            key="text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ color: '#facc15', fontWeight: 'bold' }}
          >
            Full Stack Developer - UI/UX Designer - AI Enthusiast
          </motion.span>
        </motion.div>
        <motion.p
          className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          I craft digital experiences that blend beautiful design with powerful functionality. 
          Let&apos;s build something amazing together.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full overflow-hidden shadow-lg cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Explore My Work</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500"
              initial={{ x: '100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          <motion.a
            href="/Resume_of_FK.pdf"
            download
            className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-amber-400 text-amber-400 rounded-full hover:bg-amber-400 hover:text-slate-900 transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-5 h-5" />
            Download Resume
          </motion.a>
        </motion.div>
        <motion.div
          className="flex flex-col items-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <motion.button
            onClick={scrollToNext}
            className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            aria-label="Scroll to next section"
          >
            <ChevronDown className="w-8 h-8" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;