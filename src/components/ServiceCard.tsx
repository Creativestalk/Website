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
    >
      <div className="flex flex-col items-center text-center">
        {IconComponent && (
          <motion.div 
            className="service-icon-wrapper mb-4"
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
          >
            <motion.div
              animate={isExpanded ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              <IconComponent className="service-icon h-8 w-8" />
            </motion.div>
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
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.2 }}
          >
            <ChevronDown className="h-5 w-5 text-primary" />
          </motion.div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-2">
                {service.subservices.map((subservice, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: idx * 0.05,
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }}
                    className="service-feature"
                    whileHover={{ 
                      scale: 1.02,
                      x: 5,
                      transition: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                  >
                    <AnimatedText
                      text={subservice}
                      className=""
                      type="chars"
                      stagger={0.01}
                      delay={idx * 0.05}
                    />
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