import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BookOpen, ExternalLink, Calendar, Clock } from 'lucide-react';

interface InkHomeStory {
  id: number;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  image: string;
  readTime: number;
  link: string;
}

const ArticleCardSkeleton: React.FC = () => (
  <div className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col animate-pulse">
    <div className="w-full h-48 sm:h-56 bg-slate-200 dark:bg-slate-700"></div>
    <div className="p-4 sm:p-6 flex flex-col flex-grow">
      <div className="flex items-center gap-4 mb-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
      </div>
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 mb-4"></div>
      <div className="mt-auto">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

const Publications: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [stories, setStories] = useState<InkHomeStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const extractImageUrl = (description: string, thumbnail: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = description;
    const imgTag = tempDiv.querySelector('img');
    if (imgTag && imgTag.src) {
      try {
        const url = new URL(imgTag.src);
        if (url.hostname === 'miro.medium.com') {
          const pathParts = url.pathname.split('/');
          if (pathParts.length > 2 && pathParts[2].startsWith('resize:')) {
            pathParts[2] = 'resize:fit:800';
            url.pathname = pathParts.join('/');
            return url.toString();
          }
        }
        return imgTag.src;
      } catch (e) {
        return imgTag.src;
      }
    }
    return thumbnail || `https://picsum.photos/seed/${Math.random()}/800/600`;
  };

  const parseDescription = (description: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = description;
    
    let contentElement = tempDiv.querySelector('p:nth-of-type(2)');
    if (!contentElement || contentElement.textContent.length < 50) {
      contentElement = Array.from(tempDiv.querySelectorAll('p')).find(p => p.textContent.length > 50) || tempDiv.querySelector('p');
    }

    let excerpt = (contentElement?.textContent || tempDiv.textContent || "").trim();
    
    if (!excerpt) {
      excerpt = (tempDiv.innerText || "").trim();
    }
    
    excerpt = excerpt.replace(/Continue reading on Medium »/g, '').trim();

    const maxLength = 150;
    if (excerpt.length > maxLength) {
      const trimmed = excerpt.substring(0, maxLength);
      return trimmed.substring(0, Math.min(trimmed.length, trimmed.lastIndexOf(' '))) + '...';
    }
    return excerpt;
  };

  const extractReadTime = (description: string): number => {
    const readTimeMatch = description.match(/(\d+)\s*min\s*read/i);
    if (readTimeMatch && readTimeMatch[1]) {
      return parseInt(readTimeMatch[1], 10);
    }
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = description;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    const wordsPerMinute = 200;
    const words = textContent.split(/\s+/).filter(word => word.length > 0).length;
    const calculatedTime = Math.ceil(words / wordsPerMinute);
    
    return Math.max(1, Math.min(calculatedTime, 20));
  };

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch from The Ink Home publication
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2Fthe-ink-home');
        if (!response.ok) {
          throw new Error('Network response was not ok. Could not reach content feed.');
        }
        const data = await response.json();

        if (data.status !== 'ok' || !data.items || data.items.length === 0) {
          throw new Error(data.message || 'Failed to fetch The Ink Home feed or the feed is empty.');
        }
        
        const fetchedStories: InkHomeStory[] = data.items
          .filter((item: any) => item.title && item.link)
          .slice(0, 4) // Show only 4 featured stories
          .map((item: any, index: number) => ({
            id: index + 201,
            title: item.title,
            author: item.author || 'The Ink Home',
            date: new Date(item.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            excerpt: parseDescription(item.description),
            image: extractImageUrl(item.description, item.thumbnail),
            readTime: extractReadTime(item.description),
            link: item.link,
          }));

        setStories(fetchedStories);
      } catch (err) {
        if (err instanceof Error) {
          setError(`${err.message}`);
        } else {
          setError('An unknown error occurred while fetching stories.');
        }
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <section id="publications" className="publications-section py-16 sm:py-20 md:py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            My Publications
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full mb-6 md:mb-8" />
          <p className="text-lg sm:text-xl max-w-3xl mx-auto opacity-90">
            The Ink Home
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 max-w-4xl mx-auto"
          >
            <p className="text-center text-yellow-800 dark:text-yellow-200 text-sm">
              <span className="font-semibold">Note:</span> {error}
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            <>
              {[...Array(4)].map((_, index) => (
                <ArticleCardSkeleton key={index} />
              ))}
            </>
          ) : (
            stories.map((story, index) => (
            <motion.article
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col"
              whileHover={{ y: -10 }}
            >
              <div className="relative overflow-hidden w-full h-48 sm:h-56">
                <img
                  src={story.image}
                  alt={story.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-amber-400 text-slate-900 text-xs sm:text-sm font-semibold rounded-full flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Featured
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {story.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {story.readTime} min read
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-amber-500 transition-colors duration-200 line-clamp-2">
                  {story.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                  {story.excerpt}
                </p>

                <div className="mt-auto">
                  <a
                    href={story.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-amber-500 font-semibold hover:gap-3 transition-all duration-200 text-sm sm:text-base"
                  >
                    <span data-cursor="pointer">Read Story</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.article>
            ))
          )}
        </div>

        {!loading && stories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-center py-16 bg-slate-50 dark:bg-slate-900/30 rounded-lg"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-2xl font-serif text-slate-700 dark:text-slate-300">No stories available</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Visit The Ink Home on Medium for our latest stories!</p>
            <a 
              href="https://medium.com/the-ink-home"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              Visit The Ink Home
            </a>
          </motion.div>
        )}

        {!loading && stories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-12 md:mt-16"
          >
            <motion.a
              href="https://medium.com/the-ink-home"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-7 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 text-sm sm:text-base"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              data-cursor="pointer"
            >
              Explore The Ink Home
            </motion.a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Publications;
