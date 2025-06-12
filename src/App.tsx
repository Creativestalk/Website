import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import HeroSection from './sections/HeroSection';
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
  const [isLoading, setIsLoading] = useState(true);

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

    // Set loading to false after a short delay to ensure everything is ready
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      clearTimeout(loadingTimer);
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

  // Show loading screen while app initializes
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white">Loading Creativestalk Studio...</p>
        </div>
      </div>
    );
  }

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
            <div className="section-divider mx-auto max-w-7xl px-4" />
            <ServicesSection />
            <div className="section-divider mx-auto max-w-7xl px-4" />
            <WorksSection onNavigateToPortfolio={navigateToPortfolio} />
            <div className="section-divider mx-auto max-w-7xl px-4" />
            <ContactSection />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}

export default App