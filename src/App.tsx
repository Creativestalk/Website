import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import HeroSection from './sections/HeroSection';
import MarqueeBanner from './components/MarqueeBanner';
import ServicesSection from './sections/ServicesSection';
import WorksSection from './sections/WorksSection';
import ContactSection from './sections/ContactSection';
import Footer from './components/Footer';
import HeroAnimation from './components/HeroAnimation';
import CursorTrail from './components/CursorTrail';
import Portfolio from './pages/Portfolio';
import UploadFile from './pages/UploadFile';
import Admin from './pages/Admin';

function App() {
  const [showAnimation, setShowAnimation] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    document.title = "Creativestalk Studio | Visual Storytelling";
    
    // Handle browser navigation
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/portfolio') {
        setCurrentPage('portfolio');
      } else if (path === '/uploadfile007') {
        setCurrentPage('upload');
      } else if (path === '/admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState(); // Set initial page

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleAnimationComplete = () => {
    setShowContent(true);
    setTimeout(() => setShowAnimation(false), 1000);
  };

  const navigateToPortfolio = () => {
    setCurrentPage('portfolio');
    window.history.pushState(null, '', '/portfolio');
  };

  const navigateToHome = (scrollToWorks = false) => {
    setCurrentPage('home');
    window.history.pushState(null, '', '/');
    
    if (scrollToWorks) {
      // Scroll to works section immediately
      setTimeout(() => {
        const worksElement = document.getElementById('works');
        if (worksElement) {
          const yOffset = -80;
          const y = worksElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 0);
    }
  };

  if (currentPage === 'upload') {
    return <UploadFile />;
  }

  if (currentPage === 'admin') {
    return <Admin />;
  }

  return (
    <>
      <CursorTrail />
      {showAnimation && <HeroAnimation onAnimationComplete={handleAnimationComplete} />}
      
      {currentPage === 'portfolio' ? (
        <Portfolio onNavigateHome={navigateToHome} />
      ) : (
        <div className={`bg-dark text-white transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          <Navbar />
          <main>
            <HeroSection />
            <MarqueeBanner type="services" />
            <ServicesSection />
            
            {/* Client Brands Section */}
            <div className="bg-dark py-8">
              <div className="text-center mb-4">
                <motion.h3 
                  className="text-white font-bold text-2xl md:text-3xl tracking-wider"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  WE WORK FOR
                </motion.h3>
              </div>
              <MarqueeBanner type="clients" />
            </div>
            
            <WorksSection onNavigateToPortfolio={navigateToPortfolio} />
            <ContactSection />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}

export default App