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
    setShowContent(true);
    setTimeout(() => setShowAnimation(false), 500);
  };

  return (
    <>
      {showAnimation && <HeroAnimation onAnimationComplete={handleAnimationComplete} />}
      <div className={`bg-dark text-white transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar />
        <main>
          <HeroSection />
          <ServicesSection />
          <WorksSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;