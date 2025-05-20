import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import WorksSection from './sections/WorksSection';
import ContactSection from './sections/ContactSection';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    document.title = "Creativestalk Studio | Visual Storytelling";
  }, []);

  return (
    <div className="bg-dark text-white">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <WorksSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;