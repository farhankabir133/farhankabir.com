import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { testimonials } from '../data/portfolio';

const Testimonials: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-16 sm:py-20 md:py-24 client-section dark:bg-slate-800 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            What Clients Say
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full mb-6 md:mb-8" />
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Don't just take my word for it. Here's what my clients and colleagues have to say about working with me.
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-4xl mx-auto"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="bg-white dark:bg-slate-700 rounded-2xl p-6 sm:p-8 md:p-12 shadow-xl relative"
              >
                <Quote className="hidden sm:block absolute top-4 left-4 sm:top-6 sm:left-6 w-8 h-8 text-amber-400 opacity-20" />
                
                <div className="flex justify-center mb-4 sm:mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }}>
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-current" />
                    </motion.div>
                  ))}
                </div>

                <blockquote className="text-lg sm:text-xl md:text-2xl text-slate-700 dark:text-slate-200 text-center mb-6 sm:mb-8 leading-relaxed font-medium">
                  "{testimonials[currentIndex].content}"
                </blockquote>

                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-amber-400 shadow-sm"
                  />
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                      {testimonials[currentIndex].position}
                    </p>
                    <p className="text-sm sm:text-base text-amber-600 dark:text-amber-400 font-semibold">
                      {testimonials[currentIndex].company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="hidden sm:flex absolute inset-y-0 left-0 -translate-x-1/2 items-center">
              <motion.button onClick={prevTestimonial} className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 text-slate-700 dark:text-slate-300 hover:text-amber-500" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} data-cursor="pointer" aria-label="Previous testimonial"><ChevronLeft className="w-6 h-6" /></motion.button>
            </div>
            <div className="hidden sm:flex absolute inset-y-0 right-0 translate-x-1/2 items-center">
                <motion.button onClick={nextTestimonial} className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 text-slate-700 dark:text-slate-300 hover:text-amber-500" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} data-cursor="pointer" aria-label="Next testimonial"><ChevronRight className="w-6 h-6" /></motion.button>
            </div>
          </motion.div>

          <div className="flex sm:hidden justify-center gap-4 mt-8">
            <motion.button onClick={prevTestimonial} className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-lg" whileTap={{ scale: 0.95 }} data-cursor="pointer"><ChevronLeft className="w-6 h-6" /></motion.button>
            <motion.button onClick={nextTestimonial} className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-lg" whileTap={{ scale: 0.95 }} data-cursor="pointer"><ChevronRight className="w-6 h-6" /></motion.button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-amber-400 scale-125'
                    : 'bg-slate-300 dark:bg-slate-600 hover:bg-amber-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
                data-cursor="pointer"
              />
            ))}
          </div>
        </div>

        {/* All Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className={`bg-white dark:bg-slate-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col ${
                index === currentIndex ? 'ring-2 ring-amber-400' : ''
              }`}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ y: -5 }}
              data-cursor="pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {testimonial.position}
                  </p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                ))}
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-4 flex-grow">
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
