import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Download } from 'lucide-react';
import { experiences } from '../data/portfolio';

const About: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleGetInTouchClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="about"
      className="relative overflow-hidden py-16 sm:py-20 md:py-24 about-section bg-slate-50 dark:bg-slate-800 transition-colors duration-300"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 sm:gap-16 items-center">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-last lg:order-first lg:col-span-2"
          >
            <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl transform -rotate-3"
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 10, repeat: Infinity, repeatType: 'mirror' }}
              />
              <img
                src="https://images.pexels.com/photos/34100614/pexels-photo-34100614.png"
                alt="Farhan Kabir"
                loading="lazy"
                className="relative w-full h-auto object-cover rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
              />
              <motion.div
                className="hidden sm:flex absolute -top-4 -right-4 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-amber-400 rounded-full flex items-center justify-center shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror' }}
              >
                <span className="text-xl sm:text-2xl">🚀</span>
              </motion.div>
              <motion.div
                className="hidden sm:flex absolute -bottom-4 -left-4 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1, repeatType: 'mirror' }}
              >
                <span className="text-lg sm:text-xl">💡</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6 lg:col-span-3"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Passionate Developer & Designer
            </h3>

            <div className="space-y-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                With over 3.5 years of experience in full-stack development and UI/UX design, 
                I specialize in creating digital experiences that are both beautiful and functional.
              </p>
              <p>
                My journey began with a curiosity about how things work, which led me to explore 
                the intersection of technology and design. Today, I help businesses and startups 
                bring their ideas to life through innovative web and mobile solutions.
              </p>
              <p>
                When I'm not coding or designing, you can find me exploring new technologies, 
                contributing to open-source projects, or sharing knowledge with the developer community.
              </p>
            </div>

            {/* Buttons */}
            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                onClick={handleGetInTouchClick}
                className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-center"
              >
                Get In Touch
              </a>
              <motion.a
                href="/Resume.pdf"
                download="Resume_Farhan_Kabir.pdf"
                className="group inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400 rounded-lg hover:bg-amber-500 hover:border-amber-500 hover:text-white dark:hover:bg-amber-400 dark:hover:text-slate-900 transition-all duration-300 cursor-pointer font-bold shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/50 dark:shadow-amber-400/30 dark:hover:shadow-amber-400/50 transform hover:-translate-y-1 bg-amber-50/50 dark:bg-transparent"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-5 h-5" />
                Download Resume
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 sm:mt-24 md:mt-32"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
            My Journey
          </h3>

          <div className="relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute left-1/2 top-2 bottom-2 transform -translate-x-1/2 w-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="md:hidden absolute left-5 top-2 bottom-2 w-1 bg-slate-200 dark:bg-slate-700 rounded-full" />

            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
                className={`relative mb-12 md:mb-0 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
              >
                <div className="md:flex items-center">
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:order-2'}`}>
                    <div className={`bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ml-10 md:ml-0 border border-slate-100 ${index % 2 === 0 ? 'dark:bg-slate-700 dark:border-slate-600' : 'dark:bg-slate-900 dark:border-slate-700'}`}>
                      <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                        {exp.current && <span className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs font-semibold rounded-full">Current</span>}
                        <span className="text-amber-500 dark:text-amber-400 font-semibold text-sm sm:text-base">{exp.period}</span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1">{exp.title}</h4>
                      <p className="text-amber-600 dark:text-amber-400 font-semibold mb-3 text-sm sm:text-base">{exp.company}</p>
                      <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">{exp.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-5 md:left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-amber-400 rounded-full border-4 border-slate-50 dark:border-slate-900 shadow-md"/>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
