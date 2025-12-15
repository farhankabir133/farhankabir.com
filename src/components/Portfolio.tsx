import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, Github, Filter, X } from 'lucide-react';
import { projects } from '../data/portfolio';

const Portfolio: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const baseCategories = ['Web Development', 'Mobile Development', 'Design', 'Data Science'];
  const hasPublication = projects.some(p => p.category === 'Publication');
  const categories = [
    'All',
    ...baseCategories.filter(cat => projects.some(p => p.category === cat)),
    ...(hasPublication ? ['Publication'] : [])
  ];

  let filteredProjects = [];
  if (filter === 'All') {
    const nonPublication = projects.filter(p => p.category !== 'Publication');
    const publication = projects.filter(p => p.category === 'Publication');
    filteredProjects = [...nonPublication, ...publication];
  } else {
    filteredProjects = projects.filter(p => p.category === filter);
  }

  return (
    <section id="portfolio" className="py-16 sm:py-20 md:py-24 work-section bg-slate-50 dark:bg-slate-800 transition-colors duration-300">
      <div className="max-w-screen-4k mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-slate-900 dark:text-white mb-4">
            Featured Work
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full mb-6 md:mb-8" />
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            A showcase of my recent projects, demonstrating expertise across various technologies and industries.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-start md:justify-center gap-2 sm:gap-3 mb-12 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar md:flex-wrap md:mx-0 md:px-0"
        >
          <Filter className="w-5 h-5 text-slate-500 dark:text-slate-400 ml-1 mr-2 flex-shrink-0" />
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 sm:px-5 rounded-full transition-all duration-300 text-sm md:text-base flex-shrink-0 ${
                filter === category
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:shadow-md'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              data-cursor="pointer"
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 4k:grid-cols-5 gap-6 md:gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                whileHover={{ y: -10 }}
              >
                <div className="relative overflow-hidden aspect-w-16 aspect-h-9">
                  <img src={project.image} alt={project.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    {/* Always show on small (touch) devices; hide on hover-only sizes until hovered */}
                    <div className="flex gap-2 mb-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                      {project.liveUrl && <motion.a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} data-cursor="pointer"><ExternalLink className="w-4 h-4" /></motion.a>}
                      {project.githubUrl && <motion.a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} data-cursor="pointer"><Github className="w-4 h-4" /></motion.a>}
                    </div>
                  </div>
                  {project.featured && <div className="absolute top-4 left-4"><span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs sm:text-sm rounded-full">Featured</span></div>}
                </div>
                  <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-3"><span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs sm:text-sm rounded-full">{project.category}</span></div>
                  <h3 className="text-lg sm:text-xl text-slate-900 dark:text-white mb-2 group-hover:text-amber-500 transition-colors duration-200">{project.title}</h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => <span key={tech} className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs rounded">{tech}</span>)}
                    {project.technologies.length > 3 && <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded">+{project.technologies.length - 3}</span>}
                  </div>
                  <motion.button onClick={() => setSelectedProject(project.id)} className="w-full py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform sm:translate-y-2 sm:group-hover:translate-y-0 text-sm sm:text-base" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} data-cursor="pointer">View Details</motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {selectedProject && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProject(null)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto no-scrollbar" onClick={(e) => e.stopPropagation()}>
                {(() => {
                  const project = projects.find(p => p.id === selectedProject);
                  if (!project) return null;
                  return (
                    <div>
                      <div className="relative aspect-w-16 aspect-h-9">
                        <img src={project.image} alt={project.title} loading="lazy" className="w-full h-full object-cover rounded-t-2xl" />
                        <button onClick={() => setSelectedProject(null)} className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors duration-200" data-cursor="pointer" aria-label="Close modal"><X size={20}/></button>
                      </div>
                      <div className="p-4 sm:p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                          <h3 className="text-2xl sm:text-3xl text-slate-900 dark:text-white">{project.title}</h3>
                          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-sm rounded-full flex-shrink-0">{project.category}</span>
                        </div>
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-6">{project.longDescription}</p>
                        <div className="mb-6">
                          <h4 className="text-lg text-slate-900 dark:text-white mb-3">Technologies Used</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => <span key={tech} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full">{tech}</span>)}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg hover:shadow-lg transition-shadow duration-200" data-cursor="pointer"><ExternalLink className="w-4 h-4" />View Live</a>}
                          {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200" data-cursor="pointer"><Github className="w-4 h-4" />View Code</a>}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Portfolio;
