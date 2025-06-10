import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWorkItems, getDefaultWorkItems } from '../data/works';
import WorkCard from '../components/WorkCard';
import { WorkItem } from '../types';

// ✅ Updated Category type to include all used categories
type Category =
  | 'all'
  | 'reels'
  | 'videos'
  | 'animation'
  | 'podcasts'
  | 'promos'
  | 'motiongraphics';

// ✅ All categories now match the type definition
export const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'All Works' },
  { id: 'reels', label: 'Reel Edits' },
  { id: 'videos', label: 'Video Edits' },
  { id: 'animation', label: 'Animation' },
  { id: 'podcasts', label: 'Podcasts' },
  { id: 'promos', label: 'Promo Cuts' },
  { id: 'motiongraphics', label: 'Motion Graphics' },
];

interface PortfolioProps {
  onNavigateHome: (scrollToWorks?: boolean) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ onNavigateHome }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [workItems, setWorkItems] = useState<WorkItem[]>(getDefaultWorkItems());
  const [loading, setLoading] = useState(true);

  // Load work items on component mount and when returning to portfolio
  useEffect(() => {
    const loadWorkItems = async () => {
      setLoading(true);
      try {
        const items = await getWorkItems();
        setWorkItems(items);
      } catch (error) {
        console.error('Error loading work items:', error);
        // Keep default items if there's an error
      } finally {
        setLoading(false);
      }
    };

    loadWorkItems();
  }, []);

  const filteredWorks = workItems.filter(work =>
    activeCategory === 'all' ? true : work.category === activeCategory
  );

  const handleBackClick = () => {
    onNavigateHome(true); // Navigate back to home and scroll to works section
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.button
            onClick={handleBackClick}
            className="inline-flex items-center text-gray-medium hover:text-primary transition-colors duration-300 mb-8 group"
            whileHover={{ x: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div
              animate={{ x: [-2, 0, -2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
            </motion.div>
            Back to Works
          </motion.button>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our Portfolio
          </motion.h1>
          
          <motion.p 
            className="text-gray-medium max-w-2xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Explore our complete collection of works across different categories.
          </motion.p>

          <motion.p 
            className="text-sm text-gray-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Total works: {workItems.length} {loading && '(updating...)'}
          </motion.p>
        </motion.div>

        {/* Category Filters */}
        <motion.div 
          className="flex flex-wrap gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-dark-card text-gray-medium hover:bg-dark-lighter hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              {category.label}
              {activeCategory === category.id && (
                <span className="ml-2 text-xs">
                  ({filteredWorks.length})
                </span>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Loading indicator */}
        {loading && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-medium">Loading latest portfolio items...</p>
          </motion.div>
        )}

        {/* Portfolio Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-full"
          layout
        >
          {filteredWorks.map((work, index) => (
            <motion.div 
              key={work.id} 
              className="aspect-video max-w-xs mx-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              layout
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <WorkCard work={work} index={index} />
            </motion.div>
          ))}
        </motion.div>

        {filteredWorks.length === 0 && !loading && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-medium text-lg">No works found in this category.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;