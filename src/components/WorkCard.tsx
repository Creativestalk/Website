import React from 'react';
import { Play } from 'lucide-react';
import { WorkItem } from '../types';

interface WorkCardProps {
  work: WorkItem;
  index: number;
}

const WorkCard: React.FC<WorkCardProps> = ({ work, index }) => {
  return (
    <div 
      className="carousel-item w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 animate-fade-in" 
      style={{ animationDelay: `${0.15 * index}s` }}
    >
      <div className="relative group overflow-hidden rounded-lg">
        <img 
          src={work.thumbnail} 
          alt={work.title} 
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-medium">{work.title}</h3>
          {work.views && <p className="text-sm text-gray-light">{work.views}</p>}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-primary bg-opacity-90 p-4 rounded-full transform transition-transform duration-300 hover:scale-110">
            <Play className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkCard;