import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import WorkCard from '../components/WorkCard';
import { workItems } from '../data/works';

interface WorksSectionProps {
  onNavigateToPortfolio: () => void;
}

const WorksSection: React.FC<WorksSectionProps> = ({ onNavigateToPortfolio }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const slideNext = () => {
    if (currentIndex < workItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const slidePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handlePortfolioClick = () => {
    onNavigateToPortfolio();
  };

  return (
    <section id="works" className="py-20 bg-dark-lighter">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-heading font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Recent Works, Notable Impact
          </motion.h2>
          
          <motion.p 
            className="text-gray-medium max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Explore our portfolio of successful projects
          </motion.p>
          
          <motion.button
            onClick={handlePortfolioClick}
            className="inline-block btn-primary px-8 py-3 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(255, 165, 0, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">View Full Portfolio</span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-primary to-yellow-500"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 border-2 border-primary rounded-md"></div>
            <motion.div 
              className="absolute inset-[-2px] bg-gradient-to-r from-primary to-yellow-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{
                backgroundSize: '200% 200%'
              }}
            />
          </motion.button>
        </div>
        
        <div className="carousel-container">
          <motion.div 
            ref={trackRef}
            className="carousel-track"
            animate={{ 
              transform: `translateX(-${currentIndex * (100 / 3)}%)` 
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
          >
            {workItems.map((work, index) => (
              <motion.div 
                key={work.id} 
                className="carousel-item w-full sm:w-1/2 lg:w-1/3 px-2"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <div className="h-64">
                  <WorkCard work={work} index={index} />
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="flex justify-center mt-8 space-x-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.button 
              onClick={slidePrev}
              disabled={currentIndex === 0}
              className={`p-3 rounded-full transition-all duration-300 ${
                currentIndex === 0 
                  ? 'text-gray-dark bg-dark-card cursor-not-allowed' 
                  : 'text-white bg-dark-card hover:bg-primary hover:shadow-lg hover:shadow-primary/25'
              }`}
              whileHover={currentIndex !== 0 ? { scale: 1.1 } : {}}
              whileTap={currentIndex !== 0 ? { scale: 0.9 } : {}}
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>
            
            <motion.button 
              onClick={slideNext}
              disabled={currentIndex >= workItems.length - 3}
              className={`p-3 rounded-full transition-all duration-300 ${
                currentIndex >= workItems.length - 3 
                  ? 'text-gray-dark bg-dark-card cursor-not-allowed' 
                  : 'text-white bg-dark-card hover:bg-primary hover:shadow-lg hover:shadow-primary/25'
              }`}
              whileHover={currentIndex < workItems.length - 3 ? { scale: 1.1 } : {}}
              whileTap={currentIndex < workItems.length - 3 ? { scale: 0.9 } : {}}
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WorksSection;