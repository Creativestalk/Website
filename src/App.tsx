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
            <ServicesSection />
            <WorksSection onNavigateToPortfolio={navigateToPortfolio} />
            
            {/* We Work For Section */}
            <section className="py-16 bg-dark-card">
              <div className="container mx-auto px-4 md:px-6">
                <motion.div 
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.h2 
                    className="text-3xl md:text-4xl font-bold mb-8 text-white"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    SOME OF OUR CLIENTS
                  </motion.h2>
                </motion.div>

                {/* Client Logos Grid - Fixed Alignment */}
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-stretch justify-items-center max-w-6xl mx-auto"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {/* Client 1 - DOCH */}
                  <motion.div 
                    className="flex flex-col items-center group w-full"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="bg-dark rounded-lg border border-white/5 hover:border-primary/20 transition-all duration-300 mb-4 w-full h-32 flex items-center justify-center overflow-hidden">
                      <img 
                        src="/DOCH" 
                        alt="DOCH" 
                        className="max-w-full max-h-full object-contain scale-90 group-hover:scale-100 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-medium group-hover:text-primary transition-colors duration-300 text-center min-h-[2.5rem] flex items-center">
                      DOCH
                    </span>
                  </motion.div>

                  {/* Client 2 - LOCA LOKA */}
                  <motion.div 
                    className="flex flex-col items-center group w-full"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="bg-dark rounded-lg border border-white/5 hover:border-primary/20 transition-all duration-300 mb-4 w-full h-32 flex items-center justify-center overflow-hidden">
                      <img 
                        src="/Loca Loka" 
                        alt="Loca Loka" 
                        className="max-w-full max-h-full object-contain scale-90 group-hover:scale-100 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-medium group-hover:text-primary transition-colors duration-300 text-center min-h-[2.5rem] flex items-center">
                      LOCA LOKA
                    </span>
                  </motion.div>

                  {/* Client 3 - THE HILLS MEDIA HOUSE */}
                  <motion.div 
                    className="flex flex-col items-center group w-full"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="bg-dark rounded-lg border border-white/5 hover:border-primary/20 transition-all duration-300 mb-4 w-full h-32 flex items-center justify-center overflow-hidden">
                      <img 
                        src="/Hills Media" 
                        alt="The Hills Media House" 
                        className="max-w-full max-h-full object-contain scale-90 group-hover:scale-100 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-medium group-hover:text-primary transition-colors duration-300 text-center min-h-[2.5rem] flex items-center">
                      THE HILLS<br />MEDIA HOUSE
                    </span>
                  </motion.div>

                  {/* Client 4 - B FOR BRANDING */}
                  <motion.div 
                    className="flex flex-col items-center group w-full"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="bg-dark rounded-lg border border-white/5 hover:border-primary/20 transition-all duration-300 mb-4 w-full h-32 flex items-center justify-center overflow-hidden">
                      <img 
                        src="/B For branding" 
                        alt="B For Branding" 
                        className="max-w-full max-h-full object-contain scale-90 group-hover:scale-100 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-medium group-hover:text-primary transition-colors duration-300 text-center min-h-[2.5rem] flex items-center">
                      B FOR<br />BRANDING
                    </span>
                  </motion.div>

                  {/* Client 5 - DHAARMINE STUDIOS */}
                  <motion.div 
                    className="flex flex-col items-center group w-full"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="bg-dark rounded-lg border border-white/5 hover:border-primary/20 transition-all duration-300 mb-4 w-full h-32 flex items-center justify-center overflow-hidden">
                      <img 
                        src="Dhaarmine"
                        alt="Dhaarmine Studios" 
                        className="max-w-full max-h-full object-contain scale-90 group-hover:scale-100 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-medium group-hover:text-primary transition-colors duration-300 text-center min-h-[2.5rem] flex items-center">
                      DHAARMINE<br />STUDIOS
                    </span>
                  </motion.div>

                  {/* Client 6 - YUMMY BEE */}
                  <motion.div 
                    className="flex flex-col items-center group w-full"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="bg-dark rounded-lg border border-white/5 hover:border-primary/20 transition-all duration-300 mb-4 w-full h-32 flex items-center justify-center overflow-hidden">
                      <img 
                        src="/Yummy Bee"
                        alt="Yummy Bee" 
                        className="max-w-full max-h-full object-contain scale-90 group-hover:scale-100 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-medium group-hover:text-primary transition-colors duration-300 text-center min-h-[2.5rem] flex items-center">
                      YUMMY BEE
                    </span>
                  </motion.div>
                </motion.div>

                {/* Subtitle */}
                <motion.div 
                  className="text-center mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <p className="text-gray-medium max-w-2xl mx-auto">
                    Trusted by leading brands and creative agencies to deliver exceptional visual content that drives results.
                  </p>
                </motion.div>
              </div>
            </section>
            
            <ContactSection />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}

export default App