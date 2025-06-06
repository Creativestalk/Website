import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedText from '../components/AnimatedText';
import TypewriterText from '../components/TypewriterText';

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
    <section id="home" className="relative min-h-screen flex flex-col justify-center pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="flex flex-col items-center text-center mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.img 
            src="https://raw.githubusercontent.com/Creativestalk/Website/main/774-160.png" 
            alt="Creativestalk Studio"
            className="h-8 mb-4"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.1,
              filter: "drop-shadow(0 0 20px rgba(255, 165, 0, 0.6))"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
          
          <motion.div variants={itemVariants}>
            <AnimatedText
              text="Bringing Your ✦ Vision to Life."
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-8 leading-tight"
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
                className="text-xl md:text-2xl text-primary font-medium mb-6 block"
                speed={80}
                deleteSpeed={40}
                pauseDuration={2000}
              />
            </motion.div>
            
            <AnimatedText
              text="At Creativestalk, we don't edit videos; instead, we craft visual experiences. Whether it is video editing, VFX, motion graphics, color grading (D.I), or graphic design, we bring creativity and precision together to make your content stand out."
              className="text-gray-light leading-relaxed"
              type="words"
              stagger={0.02}
              delay={1.8}
            />
            
            <AnimatedText
              text="We believe that every project has a story, and we want to make sure that yours gets told in the most captivating way possible. Working with a passionate team of individuals who are crazy about visuals, we transform raw footage into outstanding, professional-grade content."
              className="text-gray-light leading-relaxed"
              type="words"
              stagger={0.02}
              delay={2.2}
            />
            
            <AnimatedText
              text="Let's collaborate on something amazing today. Reach out to us now!"
              className="text-gray-light leading-relaxed font-medium"
              type="words"
              stagger={0.05}
              delay={2.6}
            />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3 }}
        >
          <motion.a 
            href="#services" 
            className="text-gray-medium hover:text-primary transition-colors duration-300"
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            whileHover={{ scale: 1.2 }}
          >
            <ChevronDown className="h-8 w-8" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;