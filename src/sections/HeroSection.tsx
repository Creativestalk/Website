import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import AnimatedText from '../components/AnimatedText';
import TypewriterText from '../components/TypewriterText';
import StarfieldBackground from '../components/StarfieldBackground';

const HeroSection: React.FC = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section id="home" className="relative min-h-[85vh] flex flex-col justify-center pt-24 pb-6 overflow-hidden">
      {/* Beautiful Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Primary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10"></div>
        
        {/* Radial gradient for depth */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-secondary/25 rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Subtle mesh gradient overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent"></div>
        </div>
        
        {/* Noise texture overlay for premium feel */}
        <div className="absolute inset-0 opacity-[0.015] bg-gradient-to-br from-white via-transparent to-white mix-blend-overlay"></div>
      </div>

      {/* Animated Starfield Background */}
      <StarfieldBackground density="medium" />

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="flex flex-col items-center text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.img 
            src="https://raw.githubusercontent.com/Creativestalk/Website/main/774-160.png" 
            alt="Creativestalk Studio"
            className="h-8 mb-4 drop-shadow-lg"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.1,
              filter: "drop-shadow(0 0 20px rgba(255, 165, 0, 0.6))"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
          
          <motion.div variants={itemVariants}>
            <AnimatedText
              text="Inspired by you ✦ Created by us"
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-8 leading-tight text-white drop-shadow-lg"
              type="words"
              stagger={0.15}
              delay={0.5}
            />
          </motion.div>
          
          <motion.div 
            className="max-w-3xl space-y-6"
            variants={itemVariants}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <TypewriterText
                texts={[
                  "We craft visual experiences",
                  "We create stunning content",
                  "We bring stories to life",
                  "We transform your vision"
                ]}
                className="text-xl md:text-2xl text-primary font-medium mb-6 block drop-shadow-md"
                speed={80}
                deleteSpeed={40}
                pauseDuration={2000}
              />
            </motion.div>
            
            <AnimatedText
              text="At Creativestalk, we don't edit videos; instead, we craft visual experiences. Whether it is video editing, VFX, motion graphics, color grading (D.I), or graphic design, we bring creativity and precision together to make your content stand out."
              className="text-gray-light leading-relaxed drop-shadow-sm"
              type="words"
              stagger={0.02}
              delay={1.8}
            />
            
            <AnimatedText
              text="We believe that every project has a story, and we want to make sure that yours gets told in the most captivating way possible. Working with a passionate team of individuals who are crazy about visuals, we transform raw footage into outstanding, professional-grade content."
              className="text-gray-light leading-relaxed drop-shadow-sm"
              type="words"
              stagger={0.02}
              delay={2.2}
            />
            
            <AnimatedText
              text="Let's collaborate on something amazing today. Reach out to us now!"
              className="text-gray-light leading-relaxed font-medium drop-shadow-sm"
              type="words"
              stagger={0.05}
              delay={2.6}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;