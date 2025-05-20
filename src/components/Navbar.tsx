import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { navItems } from '../data/navItems';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`w-full py-4 transition-all duration-300 ${isSticky ? 'navbar-sticky' : 'absolute top-0 left-0 right-0 z-50'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <a href="#home" className="flex items-center space-x-2">
            <Logo />
            <span className="text-xl font-heading font-bold">Creativestalk</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <a 
                key={item.id}
                href={item.href}
                className="text-gray-light hover:text-primary transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
            <a 
              href="#contact" 
              className="btn-primary"
            >
              Let's Talk
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-2 bg-dark-lighter rounded-lg animate-fade-in">
            {navItems.map(item => (
              <a 
                key={item.id}
                href={item.href}
                className="block py-2 px-4 text-gray-light hover:text-primary hover:bg-dark-card transition-colors duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="px-4 pt-2 pb-3">
              <a 
                href="#contact" 
                className="block w-full text-center btn-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Let's Talk
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar