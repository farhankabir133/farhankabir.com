import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgressIndicator = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [sectionColor, setSectionColor] = useState('#fbbf24'); // amber-400 default

  useEffect(() => {
    const updateSectionColor = () => {
      const sections = [
        { id: 'home', color: '#fbbf24' }, // amber
        { id: 'about', color: '#3b82f6' }, // blue
        { id: 'skills', color: '#8b5cf6' }, // purple
        { id: 'portfolio', color: '#ec4899' }, // pink
        { id: 'testimonials', color: '#10b981' }, // green
        { id: 'blog', color: '#f59e0b' }, // amber
        { id: 'contact', color: '#ef4444' }, // red
      ];

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && scrollPosition >= section.offsetTop) {
          setSectionColor(sections[i].color);
          break;
        }
      }
    };

    window.addEventListener('scroll', updateSectionColor);
    updateSectionColor(); // Initial call

    return () => window.removeEventListener('scroll', updateSectionColor);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
      style={{
        scaleX,
        backgroundColor: sectionColor,
        boxShadow: `0 0 10px ${sectionColor}`,
      }}
    />
  );
};

export default ScrollProgressIndicator;
