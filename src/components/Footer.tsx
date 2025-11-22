import React from "react";
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
  { name: "Medium", icon: SiMedium, href: "#", color: "#000000" },
  { name: "LinkedIn", icon: SiLinkedin, href: "#", color: "#0A66C2" },
  { name: "Gravatar", icon: SiGravatar, href: "#", color: "#1E8CBE" },
  { name: "ORCID", icon: SiOrcid, href: "#", color: "#A6CE39" },
  { name: "Instagram", icon: SiInstagram, href: "#", color: "#E4405F" },
  { name: "Facebook", icon: SiFacebook, href: "#", color: "#1877F2" },
  { name: "GitHub", icon: SiGithub, href: "#", color: "#181717" },
  { name: "Twitter", icon: SiX, href: "#", color: "#000000" },
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 py-16 sm:py-20 md:py-24 border-t border-slate-200/40 dark:border-slate-800/40">
      <div className="max-w-7xl mx-auto px-6">
        {/* BRAND + TAGLINE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h3 className={`text-3xl font-bold bg-gradient-to-r ${brand.gradientFrom} ${brand.gradientTo} bg-clip-text text-transparent`}>
            Farhan Kabir
          </h3>
          <p className={`mt-3 ${brand.textMuted} max-w-xl mx-auto text-sm sm:text-base`}>
            Software Engineer | Researcher | AI Enthusiast | Writer | Prompt Specialist
          </p>

          {/* KEY LINE: Slightly larger and emphasized */}
          <p className={`mt-2 ${brand.textMain} max-w-xl mx-auto text-base sm:text-lg font-semibold italic`}>
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
                <div className={`${brand.textMain} group-hover:scale-110 transition-transform duration-300`}>
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
          <p className={`${brand.textMain} max-w-xl mx-auto text-base sm:text-lg font-semibold tracking-tight`}>
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
          <h4 className="text-lg font-semibold mb-3">Latest Publications</h4>
          <p className={`${brand.textMuted} text-sm mb-4`}>
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
          className="flex flex-col items-center gap-3 mb-14"
        >
          <div className={`flex items-center ${brand.surface} ${brand.border} backdrop-blur-md px-4 py-2 rounded-full w-full max-w-sm`}>
            <input
              type="email"
              placeholder="your@email.com"
              className={`flex-1 bg-transparent outline-none text-sm ${brand.textMain} placeholder-slate-400 dark:placeholder-slate-500`}
            />
            <button className={`px-4 py-1.5 rounded-full text-white text-sm font-semibold bg-gradient-to-r ${brand.gradientFrom} ${brand.gradientTo}`}>
              Join
            </button>
          </div>
          <p className={`${brand.textMuted} text-sm`}>
            Or email me at <a href="mailto:hi@farhankabir.me" className="underline">hi@farhankabir.me</a>
          </p>
        </motion.div>

        {/* COPYRIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center border-t border-slate-200/40 dark:border-slate-800/40 pt-6"
        >
          <p className={`${brand.textMuted} text-sm`}>
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
