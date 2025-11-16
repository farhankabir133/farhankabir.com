import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/portfolio';

const Blog: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="blog" className="py-16 sm:py-20 md:py-24 insight-section dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Latest Insight
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full mb-6 md:mb-8" />
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Thoughts, tutorials, and insights about technology, design, and the future of digital experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col"
              whileHover={{ y: -10 }}
            >
              <div className="relative overflow-hidden aspect-w-16 aspect-h-10">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-amber-400 text-slate-900 text-xs sm:text-sm font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {post.readTime} min read
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-amber-500 transition-colors duration-200 line-clamp-2 flex-grow">
                  {post.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-auto">
                    <motion.div
                      className="flex items-center gap-2 text-amber-500 font-semibold group-hover:gap-3 transition-all duration-200 text-sm sm:text-base"
                    >
                      <span data-cursor="pointer">Read More</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12 md:mt-16"
        >
          <motion.button
            className="px-7 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 text-sm sm:text-base"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            data-cursor="pointer"
          >
            View All Posts
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16"
        >
          <div className="flex justify-center">
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-9453027387148804"
              data-ad-slot="2468135790"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;