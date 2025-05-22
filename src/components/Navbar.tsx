import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { navItems } from '../data/navItems';
import Logo from './Logo';

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

  return (
    <nav className="navbar-floating">
      <div className="navbar-inner">
        <div className="flex items-center justify-between">
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex items-center space-x-2 group"
          >
            <Logo className="h-6 w-6 text-primary transition-all duration-300 group-hover:glow-effect" />
            <span className="text-base font-heading font-bold bg-gradient-to-r from-primary to-white bg-clip-text text-transparent">
              Creativestalk
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <a 
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`nav-link ${activeSection === item.id ? 'text-primary' : 'text-gray-light hover:text-primary'}`}
              >
                {item.label}
              </a>
            ))}
            <a 
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className={`btn-primary text-sm px-6 py-2.5 ${activeSection === 'contact' ? 'bg-opacity-90' : ''}`}
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
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-2 backdrop-blur-lg bg-dark/80 rounded-lg animate-fade-in">
            {navItems.map(item => (
              <a 
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`block py-2.5 px-4 transition-colors duration-300 text-sm ${
                  activeSection === item.id 
                    ? 'text-primary bg-white/5' 
                    : 'text-gray-light hover:text-primary hover:bg-white/5'
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="px-4 pt-2 pb-2">
              <a 
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className={`block w-full text-center btn-primary text-sm py-2.5 ${
                  activeSection === 'contact' ? 'bg-opacity-90' : ''
                }`}
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

export default Navbar;