import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const HeroSection: React.FC = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    const headline = headlineRef.current;
    if (!headline) return;
    
    const words = headline.querySelectorAll('span');
    words.forEach((word, index) => {
      word.style.animationDelay = `${0.2 * (index + 1)}s`;
      word.classList.add('animate-fade-in');
    });
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-10">
          <img 
            src="https://raw.githubusercontent.com/Creativestalk/Website/main/774-160.png" 
            alt="Creativestalk Studio"
            className="h-8 mb-4 animate-fade-in"
          />
          
          <h1 ref={headlineRef} className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-8 leading-tight">
            Bringing <span className="highlight-orange">Your</span> ✦ Vision to <span className="highlight-yellow">Life</span>.
          </h1>
          
          <div className="max-w-3xl space-y-4 animate-fade-in animate-delay-300">
            <p className="text-gray-light leading-relaxed">
              At Creativestalk, we don't edit videos; instead, we craft visual experiences. Whether it is video editing, VFX, motion graphics, color grading (D.I), or graphic design, we bring creativity and precision together to make your content stand out.
            </p>
            <p className="text-gray-light leading-relaxed">
              We believe that every project has a story, and we want to make sure that yours gets told in the most captivating way possible. Working with a passionate team of individuals who are crazy about visuals, we transform raw footage into outstanding, professional-grade content.
            </p>
            <p className="text-gray-light leading-relaxed">
              Let's collaborate on something amazing today. Reach out to us now!
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <a href="#services" className="text-gray-medium hover:text-primary transition-colors duration-300">
            <ChevronDown className="h-8 w-8" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;