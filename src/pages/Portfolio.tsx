import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { workItems } from '../data/works';
import WorkCard from '../components/WorkCard';

type Category = 'all' | 'reels' | 'videos' | 'animation';

const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'All Works' },
  { id: 'reels', label: 'Reel Edits' },
  { id: 'videos', label: 'Video Edits' },
  { id: 'animation', label: 'Animation' },
];

const Portfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filteredWorks = workItems.filter(work => 
    activeCategory === 'all' ? true : work.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-dark text-white">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="mb-12">
          <a 
            href="/"
            className="inline-flex items-center text-gray-medium hover:text-primary transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home
          </a>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Portfolio</h1>
          <p className="text-gray-medium max-w-2xl">
            Explore our complete collection of works across different categories.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-dark-card text-gray-medium hover:bg-dark-lighter'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredWorks.map((work, index) => (
            <div key={work.id} className="aspect-video">
              <WorkCard work={work} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio