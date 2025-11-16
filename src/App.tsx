import { useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '@/index.css';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AdminDashboard from './components/AdminDashboard';

function App() {
  // Use a layout effect so the browser hasn't painted yet and we can prevent
  // any autofocus-driven scroll jumps (e.g. VirtualTerminalBackground input).
  useLayoutEffect(() => {
    // Prefer manual scroll restoration to avoid the browser restoring a previous position
    try {
      if ('scrollRestoration' in history) {
        (history as any).scrollRestoration = 'manual';
      }
    } catch (e) {
      // ignore in restricted environments
    }

    // Remove any URL hash so anchors don't auto-scroll
    try {
      if (window.location.hash) {
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
      }
    } catch (e) {
      // ignore if replaceState is not allowed
    }

    // If any element grabbed focus during mount (inputs with autoFocus), blur it
    try {
      const active = document.activeElement as HTMLElement | null;
      if (active && active !== document.body && typeof active.blur === 'function') {
        active.blur();
      }
    } catch (e) {
      // ignore
    }

    // Prefer scrolling the hero element into view synchronously before paint.
    try {
      const hero = document.getElementById('home');
      if (hero) {
        hero.scrollIntoView({ behavior: 'auto', block: 'start' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    } catch (e) {
      // fallback
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, []);

  return (
  <div className="min-h-[100svh] bg-white dark:bg-slate-900 transition-colors duration-500 light-mode full-vh">
      {/* Custom animated cursor */}
      <CustomCursor />

      {/* Site Navigation Bar */}
      <Navigation />

      {/* Animated Main Content */}
      <AnimatePresence mode="wait">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="section-container"
        >
          {/* Hero Section */}
          <Hero />

          {/* About Section */}
          <About />

          {/* Skills Section */}
          <Skills />

          {/* Portfolio Section */}
          <Portfolio />

          {/* Testimonials Section */}
          <Testimonials />

          {/* Blog Section */}
          <Blog />

          {/* Contact Section */}
          <Contact />
        </motion.main>
      </AnimatePresence>

      {/* Footer Section */}
      <Footer />

      {/* Chatbot Widget */}
      <Chatbot />

      {/* Admin Dashboard (optional visibility logic can be added later) */}
      <AdminDashboard />
    </div>
  );
}

export default App;
