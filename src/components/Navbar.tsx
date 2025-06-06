import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
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
    <nav className="navbar-floating">
      <div className="navbar-inner">
        <div className="flex items-center justify-between">
          <motion.a 
            href="#home" 
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex items-center space-x-2 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              whileHover={{ 
                rotate: 360,
                transition: { duration: 0.5 }
              }}
            >
              <Logo className="h-6 w-6 text-primary transition-all duration-300 group-hover:glow-effect" />
            </motion.div>
            <AnimatedText
              text="Creativestalk"
              className="text-base font-heading font-bold bg-gradient-to-r from-primary to-white bg-clip-text text-transparent"
              type="chars"
              stagger={0.05}
              once={false}
            />
          </motion.a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a 
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`nav-link ${activeSection === item.id ? 'text-primary' : 'text-gray-light hover:text-primary'}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ 
                  y: -2,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
                {item.label}
              </motion.a>
            ))}
            <motion.a 
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className={`btn-primary text-sm px-6 py-2.5 ${activeSection === 'contact' ? 'bg-opacity-90' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px rgba(255, 165, 0, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Let's Talk
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
              className="md:hidden mt-4 py-2 backdrop-blur-lg bg-dark/80 rounded-lg overflow-hidden"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {navItems.map((item, index) => (
                <motion.a 
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`block py-2.5 px-4 transition-colors duration-300 text-sm ${
                    activeSection === item.id 
                      ? 'text-primary bg-white/5' 
                      : 'text-gray-light hover:text-primary hover:bg-white/5'
                  }`}
                  variants={menuItemVariants}
                  whileHover={{ x: 10 }}
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.div 
                className="px-4 pt-2 pb-2"
                variants={menuItemVariants}
              >
                <motion.a 
                  href="#contact"
                  onClick={(e) => handleNavClick(e, 'contact')}
                  className={`block w-full text-center btn-primary text-sm py-2.5 ${
                    activeSection === 'contact' ? 'bg-opacity-90' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Let's Talk
                </motion.a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;