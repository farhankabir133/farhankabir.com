import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { skills } from '../data/portfolio';
import VirtualTerminalBackground from './VirtualTerminalBackground';

const Skills: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [activeCategory, setActiveCategory] = useState<'technical' | 'creative' | 'soft'>('technical');

  const categories = [
    { key: 'technical' as const, label: 'Technical Skills', color: 'from-blue-500 to-cyan-500' },
    { key: 'creative' as const, label: 'Creative Skills', color: 'from-purple-500 to-pink-500' },
    { key: 'soft' as const, label: 'Soft Skills', color: 'from-green-500 to-emerald-500' },
  ];

  const filteredSkills = skills.filter(skill => skill.category === activeCategory);

  return (
    <section id="skills" className="relative py-16 sm:py-20 md:py-24 skill-section bg-white dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      {/* Virtual Terminal Animated Background - Hidden on smaller screens */}
      <div className="hidden md:block">
        <VirtualTerminalBackground />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          {/* Responsiveness Improvements: Fluid typography for the section title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Skills & Expertise
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full mb-6 md:mb-8" />
          {/* Responsiveness Improvements: Fluid typography for the paragraph */}
          <p className="text-lg sm:text-xl max-w-3xl mx-auto opacity-90">
            A comprehensive overview of my technical abilities, creative skills, and professional competencies
          </p>
        </motion.div>

        {/* Responsiveness Improvements: flex-wrap ensures tabs wrap on smaller screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              /* Responsiveness Improvements: Responsive padding and font size for buttons */
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
                activeCategory === category.key
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : 'bg-white/90 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:shadow-md'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              data-cursor="pointer"
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        {/* Responsiveness Improvements:
            - Grid columns now adapt across multiple breakpoints: 1 on small screens, 2 on medium, 3 on large, and 4 on 3xl+.
            - This ensures the grid is always balanced and readable.
            - Gap is also responsive.
        */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4 md:gap-6"
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl">{skill.icon}</div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {skill.name}
                  </h3>
                  <p className="text-sm capitalize opacity-70">
                    {skill.category}
                  </p>
                </div>
              </div>

              {/* Skill Bar */}
              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm font-medium opacity-80">
                    Proficiency
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {skill.level}%
                  </span>
                </div>
                
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${
                      categories.find(c => c.key === activeCategory)?.color
                    } rounded-full`}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${skill.level}%` } : {}}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
              </div>

              {/* Circular Progress */}
              <div className="mt-4 flex justify-center">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 transform -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-slate-200 dark:text-slate-600"
                    />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={inView ? { pathLength: skill.level / 100 } : {}}
                      transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
                      style={{
                        strokeDasharray: '175.929',
                        strokeDashoffset: '175.929',
                      }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ea580c" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white">
                      {skill.level}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 md:mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 sm:p-8 rounded-2xl text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">
              Always Learning, Always Growing
            </h3>
            <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto">
              Technology evolves rapidly, and so do I. I'm constantly exploring new tools, 
              frameworks, and methodologies to stay at the forefront of innovation.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;