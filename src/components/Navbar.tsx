import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navItems } from '../data/navItems';
import Logo from './Logo';
import AnimatedText from './AnimatedText';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = [...navItems.map(item => item.id), 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    closed: {
      opacity: 0,
      x: -20
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <motion.div 
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-8 py-4 shadow-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          {/* Logo - Left Side */}
          <motion.a 
            href="#home" 
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex items-center group flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              whileHover={{ 
                rotate: 360,
                transition: { duration: 0.5 }
              }}
            >
              <Logo className="h-8 w-8" />
            </motion.div>
          </motion.a>

          {/* Desktop Menu - Centered Navigation Items */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-10">
              <motion.a 
                href="#about"
                onClick={(e) => handleNavClick(e, 'home')}
                className="text-white/90 hover:text-white transition-colors duration-300 text-sm font-medium relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                whileHover={{ y: -2 }}
              >
                Why Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
              
              {navItems.filter(item => item.id === 'services').map((item, index) => (
                <motion.a 
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`text-sm font-medium transition-colors duration-300 relative group ${
                    activeSection === item.id ? 'text-white' : 'text-white/90 hover:text-white'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  Services
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </motion.a>
              ))}
              
              {navItems.filter(item => item.id === 'works').map((item, index) => (
                <motion.a 
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`text-sm font-medium transition-colors duration-300 relative group ${
                    activeSection === item.id ? 'text-white' : 'text-white/90 hover:text-white'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  Works
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Let's Talk Button - Right Side */}
          <div className="hidden md:flex flex-shrink-0">
            <motion.a 
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="bg-primary hover:bg-primary/90 text-black font-medium px-6 py-2.5 rounded-full flex items-center space-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px rgba(255, 165, 0, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Let's Talk</span>
              <ArrowUpRight className="h-4 w-4" />
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden mt-4 py-4 border-t border-white/20"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex flex-col space-y-4">
                <motion.a 
                  href="#about"
                  onClick={(e) => handleNavClick(e, 'home')}
                  className="text-white/90 hover:text-white transition-colors duration-300 text-sm font-medium py-2"
                  variants={menuItemVariants}
                  whileHover={{ x: 10 }}
                >
                  Why Us
                </motion.a>
                
                {navItems.map((item, index) => (
                  <motion.a 
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`text-sm font-medium transition-colors duration-300 py-2 ${
                      activeSection === item.id 
                        ? 'text-white' 
                        : 'text-white/90 hover:text-white'
                    }`}
                    variants={menuItemVariants}
                    whileHover={{ x: 10 }}
                  >
                    {item.label}
                  </motion.a>
                ))}
                
                <motion.div 
                  className="pt-2"
                  variants={menuItemVariants}
                >
                  <motion.a 
                    href="#contact"
                    onClick={(e) => handleNavClick(e, 'contact')}
                    className="bg-primary hover:bg-primary/90 text-black font-medium px-6 py-2.5 rounded-full flex items-center justify-center space-x-2 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Let's Talk</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
};

export default Navbar;