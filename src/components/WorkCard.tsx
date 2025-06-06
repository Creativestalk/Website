import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { WorkItem } from '../types';

interface WorkCardProps {
  work: WorkItem;
  index: number;
}

const WorkCard: React.FC<WorkCardProps> = ({ work, index }) => {
  const handleClick = () => {
    window.open(work.youtubeUrl, '_blank');
  };

  return (
    <motion.div 
      className="relative group overflow-hidden rounded-lg cursor-pointer h-full"
      onClick={handleClick}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.img 
        src={work.thumbnail} 
        alt={work.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
      
      <motion.div 
        className="absolute bottom-0 left-0 right-0 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-medium">{work.title}</h3>
        {work.views && <p className="text-sm text-gray-light">{work.views}</p>}
      </motion.div>
      
      <motion.div 
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <motion.button 
          className="bg-primary bg-opacity-90 p-4 rounded-full transform transition-transform duration-300 hover:scale-110"
          whileHover={{ 
            scale: 1.2,
            boxShadow: "0 0 20px rgba(255, 165, 0, 0.6)"
          }}
          whileTap={{ scale: 0.9 }}
        >
          <Play className="h-6 w-6" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default WorkCard