import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Service } from '../types';
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
    >
      <div className="flex flex-col items-center text-center">
        {IconComponent && (
          <div className="service-icon-wrapper mb-4">
            <IconComponent className="service-icon h-8 w-8" />
          </div>
        )}
        <div className="flex items-center space-x-2 mb-4">
          <h3 className="text-lg font-medium">{service.title}</h3>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="service-feature"
                  >
                    {subservice}
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