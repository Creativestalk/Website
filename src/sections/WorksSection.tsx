import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WorkCard from '../components/WorkCard';
import { workItems } from '../data/works';

const WorksSection: React.FC = () => {
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

  return (
    <section id="works" className="py-20 bg-dark-lighter">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 animate-fade-in">
            Recent Works, Notable Impact
          </h2>
          <p className="text-gray-medium max-w-2xl mx-auto animate-fade-in animate-delay-100">
            Explore our portfolio of successful projects
          </p>
        </div>
        
        <div className="carousel-container">
          <div 
            ref={trackRef}
            className="carousel-track"
            style={{ transform: `translateX(-${currentIndex * (100 / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1))}%)` }}
          >
            {workItems.map((work, index) => (
              <WorkCard 
                key={work.id} 
                work={work} 
                index={index} 
              />
            ))}
          </div>
          
          <div className="flex justify-center mt-8 space-x-4">
            <button 
              onClick={slidePrev}
              disabled={currentIndex === 0}
              className={`p-2 rounded-full ${currentIndex === 0 ? 'text-gray-dark bg-dark-card' : 'text-white bg-dark-card hover:bg-primary transition-colors duration-300'}`}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={slideNext}
              disabled={currentIndex >= workItems.length - (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1)}
              className={`p-2 rounded-full ${currentIndex >= workItems.length - (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1) ? 'text-gray-dark bg-dark-card' : 'text-white bg-dark-card hover:bg-primary transition-colors duration-300'}`}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorksSection;