import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import WorksSection from './sections/WorksSection';
import ContactSection from './sections/ContactSection';
import Footer from './components/Footer';
import HeroAnimation from './components/HeroAnimation';
import CursorTrail from './components/CursorTrail';

function App() {
  const [showAnimation, setShowAnimation] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    document.title = "Creativestalk Studio | Visual Storytelling";
  }, []);

  const handleAnimationComplete = () => {
    setShowContent(true);
    setTimeout(() => setShowAnimation(false), 1000);
  };

  return (
    <>
      <CursorTrail />
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