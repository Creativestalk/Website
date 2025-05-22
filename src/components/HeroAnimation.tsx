import React, { useEffect, useState } from 'react';
import { Camera, Scissors, RefreshCw } from 'lucide-react';
import Logo from './Logo';

interface HeroAnimationProps {
  onAnimationComplete: () => void;
}

const HeroAnimation: React.FC<HeroAnimationProps> = ({ onAnimationComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [startZoom, setStartZoom] = useState(false);
  
  const steps = [
    { icon: Camera, text: 'Shoot' },
    { icon: Scissors, text: 'Edit' },
    { icon: RefreshCw, text: 'Repeat' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      } else if (currentStep === steps.length) {
        setStartZoom(true);
        setTimeout(onAnimationComplete, 1500); // Adjusted timing for zoom effect
      }
    }, currentStep === 0 ? 1000 : 400);

    return () => clearTimeout(timer);
  }, [currentStep, onAnimationComplete]);

  return (
    <div className={`fixed inset-0 bg-black flex items-center justify-center z-50 ${startZoom ? 'animate-fade-out' : ''}`}>
      <div className="relative">
        {/* Logo Animation */}
        <div className={`transition-all duration-1000 ${
          startZoom ? 'scale-[15] opacity-0' : 'scale-100 opacity-100'
        }`}>
          <Logo className={`h-24 w-24 text-primary transition-all duration-1500 ${
            startZoom ? 'logo-reveal' : ''
          }`} />
        </div>

        {/* Step Animations */}
        {steps.map((Step, index) => (
          <div
            key={index}
            className={`absolute left-1/2 -translate-x-1/2 top-32 flex items-center gap-2 transition-all duration-200
              ${currentStep === index + 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <Step.icon className="h-6 w-6 text-primary" />
            <span className="text-white text-lg font-medium">{Step.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroAnimation;