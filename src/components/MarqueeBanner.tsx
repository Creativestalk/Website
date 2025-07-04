import React from 'react';
import { motion } from 'framer-motion';

interface MarqueeBannerProps {
  type?: 'services' | 'clients';
}

const MarqueeBanner: React.FC<MarqueeBannerProps> = ({ type = 'services' }) => {
  const servicesText = "VIDEO EDITING VFX MOTION GRAPHICS COLOR GRADING GRAPHIC DESIGN VIDEOGRAPHY PHOTOGRAPHY ANIMATION STORYTELLING CREATIVE STRATEGY CONTENT CREATION VISUAL EFFECTS POST PRODUCTION DIGITAL MARKETING BRAND IDENTITY CREATIVE DIRECTION ";
  
  const clientsText = "DOCH • LOCA LOKA • THE HILLS MEDIA HOUSE • B FOR BRANDING • DHAARMINE STUDIOS • ";

  const marqueeText = type === 'clients' ? clientsText : servicesText;

  return (
    <div className="relative overflow-hidden bg-primary py-3 border-y border-primary/20">
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
            duration: type === 'clients' ? 25 : 30,
            ease: "linear",
          },
        }}
      >
        <div className={`flex items-center text-black font-bold tracking-wider ${
          type === 'clients' 
            ? 'text-base md:text-lg space-x-4' 
            : 'text-lg md:text-xl lg:text-2xl space-x-4'
        }`}>
          {Array.from({ length: type === 'clients' ? 6 : 3 }).map((_, index) => (
            <span key={index} className={`flex items-center ${
              type === 'clients' ? 'space-x-4' : 'space-x-4'
            }`}>
              {type === 'clients' ? (
                // For clients: keep the dots
                marqueeText.split(' • ').map((text, textIndex) => (
                  <span key={textIndex} className="flex items-center space-x-4">
                    <span>{text}</span>
                    {textIndex < marqueeText.split(' • ').length - 1 && (
                      <span className="text-black/60">•</span>
                    )}
                  </span>
                ))
              ) : (
                // For services: no dots, just spaces
                marqueeText.split(' ').map((text, textIndex) => (
                  <span key={textIndex}>{text}</span>
                ))
              )}
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