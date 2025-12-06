import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import {
  SiFacebook,
  SiInstagram,
  SiLinkedin,
  SiOrcid,
  SiMedium,
  SiGravatar,
  SiGithub,
  SiX,
} from "react-icons/si";
import { supabase } from '../lib/supabase';

// SITE BRAND COLORS
const brand = {
  gradientFrom: "from-amber-400",
  gradientTo: "to-orange-500",
  surface: "bg-white/10 dark:bg-white/5",
  textMain: "text-slate-700 dark:text-slate-200",
  textMuted: "text-slate-500 dark:text-slate-400",
  border: "border-white/10",
};

// Social icons matching the reference image exactly
const socials = [
  { name: "X", icon: SiX, href: "https://x.com/fkh_236", color: "#000000" },
  { name: "Medium", icon: SiMedium, href: "https://medium.com/@farhankabir133", color: "#000000" },
  { name: "Facebook", icon: SiFacebook, href: "https://web.facebook.com/baba111b/", color: "#1877F2" },
  { name: "GitHub", icon: SiGithub, href: "https://github.com/farhankabir133", color: "#181717" },
  { name: "Instagram", icon: SiInstagram, href: "https://www.instagram.com/_farhan_kabir/", color: "#E4405F" },
  { name: "LinkedIn", icon: SiLinkedin, href: "https://www.linkedin.com/in/farhankabir133/", color: "#0A66C2" },
  // keep optional/legacy icons (Gravatar, ORCID) but without links unless you want them
  { name: "Gravatar", icon: SiGravatar, href: "#", color: "#1E8CBE" },
  { name: "ORCID", icon: SiOrcid, href: "#", color: "#A6CE39" },
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        setSubmitMessage('Redirecting...');
        setTimeout(() => {
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
            source: 'footer_section',
            status: 'active'
          }
        ])
        .select();

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        // Check if email already exists
        if (error.code === '23505') {
          setSubmitMessage('Already subscribed! 🎉');
        } else if (error.message.includes('relation') || error.message.includes('does not exist')) {
          setSubmitMessage('Database error. Please try again.');
        } else {
          setSubmitMessage(`Error: ${error.message}`);
        }
      } else {
        setSubmitMessage('Subscribed! 🎉');
      }

      // Reset after 2.5 seconds
      setTimeout(() => {
        setEmail('');
        setSubmitMessage('');
      }, 2500);
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      setSubmitMessage('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer-section relative w-full bg-slate-50 dark:bg-slate-900 py-16 sm:py-20 md:py-24 border-t border-slate-200/40 dark:border-slate-800/40">
      <div className="max-w-7xl mx-auto px-6">
        {/* BRAND + TAGLINE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h3 className="text-3xl font-bold text-white drop-shadow-lg">
            Farhan Kabir
          </h3>
          <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base opacity-80">
            Software Engineer | Researcher | AI Enthusiast | Writer | Prompt Specialist
          </p>

          {/* KEY LINE: Slightly larger and emphasized */}
          <p className="mt-2 max-w-xl mx-auto text-base sm:text-lg font-semibold italic opacity-90">
            Trying to make people's life better through tech and creativity!!.
          </p>

        </motion.div>

        {/* FRAMER-MOTION SOCIAL ICONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-5 mb-12"
        >
          {socials.map((item) => {
            const IconComponent = item.icon;
            return (
              <motion.a
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                key={item.name}
                href={item.href}
                className={`group w-12 h-12 rounded-xl ${brand.surface} ${brand.border} backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:shadow-lg`}
                style={{
                  '--hover-color': item.color,
                } as React.CSSProperties}
                aria-label={item.name}
              >
                <div className="group-hover:scale-110 transition-transform duration-300">
                  <IconComponent />
                </div>
              </motion.a>
            );
          })}
        </motion.div>

        {/* ENGAGED LINE AFTER SOCIAL ICONS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="text-center mb-8"
        >
          <p className="max-w-xl mx-auto text-base sm:text-lg font-semibold tracking-tight opacity-90">
            Building thoughtful digital tools.
          </p>
        </motion.div>

        {/* PUBLICATION + RESEARCH SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto text-center mb-16"
        >
          <h4 className="text-lg font-semibold mb-3 opacity-95">Latest Publications</h4>
          <p className="text-sm mb-4 opacity-80">
            Explore my recent research work, writing, and contributions.
          </p>
          <a
            href="#"
            className={`inline-block px-5 py-2 rounded-full text-white font-semibold bg-gradient-to-r ${brand.gradientFrom} ${brand.gradientTo} shadow-md hover:shadow-lg transition`}
          >
            View Publications
          </a>
        </motion.div>

        {/* NEWSLETTER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-col items-center gap-4 mb-14"
        >
          <div className="text-center mb-2">
            <h4 className="text-xl font-bold mb-2">Stay Connected</h4>
            <p className="text-sm opacity-80">Subscribe to get the latest updates and insights</p>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="w-full max-w-md">
            <motion.div 
              className="flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-xl border-2 border-white/30 dark:border-white/20 px-5 py-3 rounded-2xl w-full shadow-xl transition-all duration-300"
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 12px 32px rgba(251, 191, 36, 0.3)",
                borderColor: "rgba(251, 191, 36, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="flex-1 bg-transparent outline-none text-base text-white placeholder-white/60 dark:placeholder-white/50 transition-all font-medium"
              />
              <motion.button 
                type="submit"
                disabled={isSubmitting}
                className={`relative px-6 py-2.5 rounded-xl text-white text-sm font-bold bg-gradient-to-r ${brand.gradientFrom} ${brand.gradientTo} disabled:opacity-50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300`}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.92 }}
                animate={isSubmitting ? { 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                } : {}}
                transition={{ 
                  rotate: { duration: 0.5, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <motion.span
                  className="relative z-10 flex items-center gap-1"
                  animate={isSubmitting ? { opacity: [1, 0.7, 1] } : {}}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  {isSubmitting ? '✓ Joining...' : 'Subscribe'}
                </motion.span>
                {!isSubmitting && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  />
                )}
              </motion.button>
            </motion.div>
            {submitMessage && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-sm mt-3 text-green-400 dark:text-green-300 font-bold flex items-center justify-center gap-2"
              >
                <span>✓</span> {submitMessage}
              </motion.p>
            )}
          </form>
          <p className="text-sm opacity-80">
            Or reach out directly at <a href="mailto:hi@farhankabir.me" className="font-semibold underline decoration-2 underline-offset-2 hover:opacity-100 hover:text-amber-400 transition-colors">hi@farhankabir.me</a>
          </p>
        </motion.div>

        {/* COPYRIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center border-t border-slate-200/40 dark:border-slate-800/40 pt-6"
        >
          <p className="text-sm opacity-75">
            © {new Date().getFullYear()} Farhan Kabir — Built with care.
          </p>
        </motion.div>
      </div>

      {/* BACK TO TOP BUTTON */}
      <motion.button
        onClick={scrollToTop}
        className={`absolute bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl bg-gradient-to-r ${brand.gradientFrom} ${brand.gradientTo}`}
        whileHover={{ scale: 1.15, y: -3 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        aria-label="Scroll back to top"
      >
        <ArrowUp className="w-5 h-5 text-white" />
      </motion.button>
    </footer>
  );
};

export default Footer;
