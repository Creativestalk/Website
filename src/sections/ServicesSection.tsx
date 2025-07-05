import React from 'react';
import { motion } from 'framer-motion';
import ServiceCard from '../components/ServiceCard';
import AnimatedText from '../components/AnimatedText';
import StarfieldBackground from '../components/StarfieldBackground';
import { services } from '../data/services';

const ServicesSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section id="services" className="pt-24 pb-20 bg-dark-card relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-card to-dark opacity-50"></div>
      
      {/* Animated Starfield Background */}
      <StarfieldBackground density="light" />
      
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div 
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <motion.a 
              href="#services" 
              className="bg-black text-primary font-medium py-3 px-6 rounded-md transition-all duration-300 hover:bg-opacity-80 inline-block mb-8"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px rgba(255, 165, 0, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Our Services
            </motion.a>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <AnimatedText
              text="Experience The Benefits Of Our Expertise"
              className="text-3xl md:text-4xl font-heading font-bold mb-4"
              type="words"
              stagger={0.1}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <AnimatedText
              text="That drives impactful gain, powerful results"
              className="text-gray-medium max-w-2xl mx-auto"
              type="words"
              stagger={0.05}
              delay={0.3}
            />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              transition={{ delay: index * 0.1 }}
            >
              <ServiceCard
                service={service}
                index={index}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;