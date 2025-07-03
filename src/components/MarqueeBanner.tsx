import React from 'react';
import { motion } from 'framer-motion';

const MarqueeBanner: React.FC = () => {
  const marqueeText = "VIDEO EDITING • VFX • MOTION GRAPHICS • COLOR GRADING • GRAPHIC DESIGN • VIDEOGRAPHY • PHOTOGRAPHY • ANIMATION • STORYTELLING • CREATIVE STRATEGY • CONTENT CREATION • VISUAL EFFECTS • POST PRODUCTION • DIGITAL MARKETING • BRAND IDENTITY • CREATIVE DIRECTION • ";

  return (
    <div className="relative overflow-hidden bg-primary py-4 border-y border-primary/20">
      {/* Main scrolling text */}
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -2000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        <div className="flex items-center space-x-8 text-black font-bold text-lg md:text-xl lg:text-2xl tracking-wider">
          {Array.from({ length: 3 }).map((_, index) => (
            <span key={index} className="flex items-center space-x-8">
              {marqueeText.split(' • ').map((text, textIndex) => (
                <span key={textIndex} className="flex items-center space-x-8">
                  <span>{text}</span>
                  {textIndex < marqueeText.split(' • ').length - 1 && (
                    <span className="text-black/60">•</span>
                  )}
                </span>
              ))}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-primary to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-primary to-transparent pointer-events-none"></div>
    </div>
  );
};

export default MarqueeBanner;