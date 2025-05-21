import React from 'react';
import ServiceCard from '../components/ServiceCard';
import { services } from '../data/services';

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-lighter to-dark opacity-50"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="text-center mb-16">
          <a href="#services" className="bg-black text-primary font-medium py-3 px-6 rounded-md transition-all duration-300 hover:bg-opacity-80 inline-block mb-8">
            Our Services
          </a>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 animate-fade-in">
            Experience The Benefits Of Our Expertise
          </h2>
          <p className="text-gray-medium max-w-2xl mx-auto animate-fade-in animate-delay-100">
            That drives impactful gain, powerful results
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;