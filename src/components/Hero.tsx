import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail, X } from 'lucide-react';
import GravityCodeOrbsBackground from './GravityCodeOrbsBackground';
import { supabase } from '../lib/supabase';

const Hero: React.FC = () => {
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Typewriter animation state
  const jobRoles = [
    'Software Engineer',
    'AI Engineer',
    'ML-NLP Researcher',
    'Full Stack Developer',
    'Prompt Specialist'
  ];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // Typewriter effect
  useEffect(() => {
    const currentRole = jobRoles[currentRoleIndex];
    
    const handleTyping = () => {
      if (!isDeleting) {
        // Typing forward
        if (displayedText.length < currentRole.length) {
          setDisplayedText(currentRole.substring(0, displayedText.length + 1));
          setTypingSpeed(150);
        } else {
          // Finished typing, pause then start deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (displayedText.length > 0) {
          setDisplayedText(currentRole.substring(0, displayedText.length - 1));
          setTypingSpeed(75);
        } else {
          // Finished deleting, move to next role
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % jobRoles.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentRoleIndex, typingSpeed, jobRoles]);

  const scrollToNext = () => {
    const nextSection = document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Check if supabase is properly configured
      if (!supabase || typeof supabase.from !== 'function') {
        console.warn('Supabase not configured - redirecting to Medium newsletter');
        // Fallback: redirect to Medium newsletter
        window.open('https://medium.com/the-ink-home/newsletter#:~:text=Get%20this-,newsletter,-By%20signing%20up', '_blank');
        setSubmitMessage('Redirecting you to subscribe...');
        setTimeout(() => {
          setShowNewsletterModal(false);
          setEmail('');
          setSubmitMessage('');
        }, 2000);
        setIsSubmitting(false);
        return;
      }

      console.log('Attempting to subscribe email:', email.toLowerCase().trim());

      // Save email to Supabase
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([
          {
            email: email.toLowerCase().trim(),
            source: 'hero_section',
            status: 'active'
          }
        ])
        .select();

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        // Check if email already exists
        if (error.code === '23505') {
          setSubmitMessage('You are already subscribed! 🎉');
        } else if (error.message.includes('relation') || error.message.includes('does not exist')) {
          setSubmitMessage('Database table not found. Please run the migration first.');
        } else {
          setSubmitMessage(`Error: ${error.message}`);
        }
      } else {
        setSubmitMessage('Successfully subscribed! Thank you! 🎉');
      }

      // Close modal and reset after 2.5 seconds
      setTimeout(() => {
        setShowNewsletterModal(false);
        setEmail('');
        setSubmitMessage('');
      }, 2500);
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      setSubmitMessage(error?.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    } finally {
      setTimeout(() => setIsSubmitting(false), 500);
    }
  };

  return (
  <section id="home" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-black full-vh">
      <GravityCodeOrbsBackground />
  <div className="relative z-30 flex flex-col items-center justify-center w-full h-full pt-20 sm:pt-32 pb-16 px-4">
        <motion.div
          className="mb-2 relative z-20"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.span
            className="block text-2xl md:text-3xl text-white text-center tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            Hi, I&apos;m
          </motion.span>
        </motion.div>
        <motion.h1
          className="text-4xl md:text-6xl text-white text-center mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] relative z-20"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Farhan Kabir
        </motion.h1>
        <motion.div
          className="text-xl md:text-2xl mb-8 text-center px-4 relative z-20 h-[60px] md:h-[70px] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span
            className="relative z-20 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] text-shadow-lg inline-flex items-center"
            style={{ 
              color: '#facc15', 
              fontWeight: 'bold',
              textShadow: '0 0 20px rgba(250,204,21,0.6), 0 2px 8px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6)'
            }}
          >
            {displayedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              className="ml-1"
            >
              |
            </motion.span>
          </span>
        </motion.div>
        <motion.p
          className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed text-center px-4 relative z-20 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          I craft digital experiences that blend beautiful design with powerful functionality. 
          Let&apos;s build something amazing together.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            onClick={() => setShowNewsletterModal(true)}
            className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-amber-500 text-amber-400 rounded-full hover:bg-amber-500 hover:border-amber-500 hover:text-white transition-all duration-300 cursor-pointer font-bold shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/50 transform hover:-translate-y-1 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-5 h-5" />
            <span>Subscribe To My Newsletter</span>
          </motion.button>
          <motion.button
            onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full overflow-hidden shadow-lg cursor-pointer font-bold"
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
        </motion.div>
        {/* Modern Scroll Indicator */}
        <motion.div
          className="flex flex-col items-center mt-12 gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          {/* Animated Text Label */}
          <motion.span
            className="text-amber-400/80 text-sm font-semibold tracking-wider uppercase"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Scroll Down
          </motion.span>
          
          {/* Mouse Scroll Icon */}
          <motion.button
            onClick={scrollToNext}
            className="group relative cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to next section"
          >
            {/* Outer Glow Ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Mouse Container */}
            <div className="relative w-8 h-12 border-2 border-amber-400/60 rounded-full flex items-start justify-center p-2 group-hover:border-amber-400 transition-colors duration-300 bg-gradient-to-b from-amber-400/10 to-transparent backdrop-blur-sm">
              {/* Animated Scroll Wheel */}
              <motion.div
                className="w-1.5 h-3 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50"
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            
            {/* Pulsing Chevrons Below */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col gap-0.5">
              <motion.div
                animate={{ y: [0, 4, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0 }}
              >
                <ChevronDown className="w-5 h-5 text-amber-400/70" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 4, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
              >
                <ChevronDown className="w-5 h-5 text-amber-400/50 -mt-3" />
              </motion.div>
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Newsletter Modal */}
      <AnimatePresence>
        {showNewsletterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setShowNewsletterModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-amber-400/50 dark:border-amber-400/30"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowNewsletterModal(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Content */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-400/20 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-amber-500 dark:text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Subscribe to The Ink Home
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Get the latest insights delivered straight to your inbox.
                </p>
              </div>

              {/* Newsletter Form */}
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 transition-all"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold rounded-lg hover:from-amber-500 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Get This Newsletter'}
                </button>

                {submitMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm text-amber-600 dark:text-amber-400 font-semibold"
                  >
                    {submitMessage}
                  </motion.p>
                )}
              </form>

              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
                Join readers getting insights from The Ink Home newsletter.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;