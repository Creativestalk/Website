import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Service } from '../types';
import AnimatedText from './AnimatedText';
import * as LucideIcons from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // @ts-ignore - Dynamic icon lookup
  const IconComponent = LucideIcons[service.icon.charAt(0).toUpperCase() + service.icon.slice(1)];

  return (
    <motion.div 
      className="service-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ 
        y: -5,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      whileTap={{ scale: 0.98 }}
      layout="position"
    >
      <div className="flex flex-col items-center text-center">
        {IconComponent && (
          <motion.div 
            className="service-icon-wrapper mb-4"
            whileHover={{ 
              scale: 1.1,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
          >
            <IconComponent className="service-icon h-8 w-8" />
          </motion.div>
        )}
        
        <div className="flex items-center space-x-2 mb-4">
          <AnimatedText
            text={service.title}
            className="text-lg font-medium"
            type="words"
            stagger={0.05}
            delay={index * 0.1}
          />
          <motion.div
            animate={{ 
              rotate: isExpanded ? 180 : 0,
              scale: isExpanded ? 1.1 : 1
            }}
            transition={{ 
              duration: 0.6, 
              type: "spring", 
              stiffness: 200, 
              damping: 20 
            }}
            whileHover={{ scale: 1.2 }}
          >
            <ChevronDown className="h-5 w-5 text-primary" />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              key="expanded-content"
              initial={{ 
                opacity: 0,
                height: 0,
                marginTop: 0
              }}
              animate={{ 
                opacity: 1,
                height: "auto",
                marginTop: 16
              }}
              exit={{ 
                opacity: 0,
                height: 0,
                marginTop: 0
              }}
              transition={{
                duration: 0.6,
                ease: [0.04, 0.62, 0.23, 0.98],
                opacity: { duration: 0.4 },
                height: { duration: 0.6 },
                marginTop: { duration: 0.6 }
              }}
              className="overflow-hidden w-full"
            >
              <div className="grid grid-cols-1 gap-3">
                {service.subservices.map((subservice, idx) => (
                  <motion.div
                    key={subservice}
                    initial={{ 
                      opacity: 0, 
                      x: -20,
                      scale: 0.95
                    }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      scale: 1
                    }}
                    transition={{ 
                      delay: idx * 0.08,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                    className="service-feature"
                    whileHover={{ 
                      scale: 1.02,
                      x: 8,
                      backgroundColor: "rgba(255, 165, 0, 0.1)",
                      transition: { 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 15,
                        backgroundColor: { duration: 0.2 }
                      }
                    }}
                  >
                    <span className="block">
                      {subservice}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ServiceCard;