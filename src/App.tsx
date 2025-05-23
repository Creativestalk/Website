import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import WorksSection from './sections/WorksSection';
import ContactSection from './sections/ContactSection';
import Footer from './components/Footer';
import HeroAnimation from './components/HeroAnimation';

function App() {
  const [showAnimation, setShowAnimation] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    document.title = "Creativestalk Studio | Visual Storytelling";
  }, []);

  const handleAnimationComplete = () => {
    // Show content immediately as animation starts to fade
    setShowContent(true);
    // Remove animation overlay after zoom completes
    setTimeout(() => setShowAnimation(false), 1000);
  };

  return (
    <>
      {showAnimation && <HeroAnimation onAnimationComplete={handleAnimationComplete} />}
      <div className={`bg-dark text-white transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar />
        <main>
          <HeroSection />
          <div className="section-divider mx-auto max-w-7xl px-4" />
          <ServicesSection />
          <div className="section-divider mx-auto max-w-7xl px-4" />
          <WorksSection />
          <div className="section-divider mx-auto max-w-7xl px-4" />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;