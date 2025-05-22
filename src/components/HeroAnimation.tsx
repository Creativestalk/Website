import React, { useEffect, useState } from 'react';
import { Camera, Scissors, RefreshCw } from 'lucide-react';
import Logo from './Logo';

interface HeroAnimationProps {
  onAnimationComplete: () => void;
}

const HeroAnimation: React.FC<HeroAnimationProps> = ({ onAnimationComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: Camera, text: 'Shoot' },
    { icon: Scissors, text: 'Edit' },
    { icon: RefreshCw, text: 'Repeat' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        setTimeout(onAnimationComplete, 200);
      }
    }, currentStep === 0 ? 1000 : 400); // Initial delay 1s, then 0.2s for each step

    return () => clearTimeout(timer);
  }, [currentStep, onAnimationComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="relative">
        {/* Logo Animation - stays visible throughout */}
        <div className="transition-all duration-1000 opacity-100 scale-100">
          <Logo className="h-24 w-24 text-primary" />
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