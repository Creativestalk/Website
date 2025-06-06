import React from 'react';
import { Phone, Mail, MapPin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import ContactForm from '../components/ContactForm';
import AnimatedText from '../components/AnimatedText';

const ContactSection: React.FC = () => {
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

  const contactItems = [
    {
      icon: Phone,
      title: "Phone",
      content: "+91 9948880710",
      href: "tel:+919948880710"
    },
    {
      icon: Mail,
      title: "Email",
      content: "creativestalkstudio@gmail.com",
      href: "mailto:creativestalkstudio@gmail.com"
    },
    {
      icon: MapPin,
      title: "Address",
      content: "H No: 5-4-1233, Plot No: 182, Sharada Nagar, Vanasthalipuram",
      href: "https://g.co/kgs/41NAo1h"
    },
    {
      icon: Instagram,
      title: "Instagram",
      content: "@creativestalkstudio",
      href: "https://www.instagram.com/creativestalkstudio/"
    }
  ];

  const workingHours = [
    { day: "Monday - Friday:", time: "9:00 AM - 6:00 PM" },
    { day: "Saturday:", time: "10:00 AM - 4:00 PM" },
    { day: "Sunday:", time: "Closed" }
  ];

  return (
    <section id="contact" className="py-20 bg-dark">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <motion.div 
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <motion.span 
              className="inline-block bg-primary/10 text-primary font-medium py-2 px-4 rounded-full mb-4"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(255, 165, 0, 0.2)"
              }}
            >
              Contact Us
            </motion.span>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <AnimatedText
              text="Let's Talk"
              className="text-3xl md:text-4xl font-heading font-bold mb-4"
              type="chars"
              stagger={0.1}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <AnimatedText
              text="Ready to bring your vision to life? Reach out to discuss your project."
              className="text-gray-medium max-w-2xl mx-auto"
              type="words"
              stagger={0.03}
              delay={0.3}
            />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-dark-card rounded-2xl p-8 shadow-xl border border-white/5"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ContactForm />
          </motion.div>
          
          <motion.div 
            className="lg:order-1"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              <motion.div variants={itemVariants}>
                <AnimatedText
                  text="Get in Touch"
                  className="text-xl font-medium mb-4"
                  type="words"
                  stagger={0.1}
                />
                <AnimatedText
                  text="Have a project in mind? Contact us today and let's create something amazing together."
                  className="text-gray-light mb-6"
                  type="words"
                  stagger={0.02}
                  delay={0.3}
                />
              </motion.div>
              
              <div className="space-y-6">
                {contactItems.map((item, index) => (
                  <motion.a 
                    key={index}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="contact-link group"
                    variants={itemVariants}
                    whileHover={{ 
                      x: 10,
                      transition: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                  >
                    <item.icon className="contact-icon" />
                    <div>
                      <motion.h4 
                        className="text-gray-light font-medium group-hover:text-primary transition-colors duration-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {item.title}
                      </motion.h4>
                      <motion.p 
                        className="text-gray-medium group-hover:text-white transition-colors duration-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.1 }}
                      >
                        {item.content}
                      </motion.p>
                    </div>
                  </motion.a>
                ))}
              </div>
              
              <motion.div 
                className="pt-8 mt-8 border-t border-white/5"
                variants={itemVariants}
              >
                <AnimatedText
                  text="Working Hours"
                  className="text-xl font-medium mb-6"
                  type="words"
                  stagger={0.1}
                />
                <div className="space-y-3">
                  {workingHours.map((item, index) => (
                    <motion.div
                      key={index}
                      className="working-hours-item"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ 
                        x: 8,
                        transition: { type: "spring", stiffness: 400, damping: 10 }
                      }}
                    >
                      <span className="text-gray-light">{item.day}</span>
                      <span className="text-gray-medium">{item.time}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;