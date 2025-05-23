import React, { useEffect, useState } from 'react';
import { Camera, Scissors, RefreshCw } from 'lucide-react';
import Logo from './Logo';

interface HeroAnimationProps {
  onAnimationComplete: () => void;
}

const HeroAnimation: React.FC<HeroAnimationProps> = ({ onAnimationComplete }) => {
  const [currentStep, setCurrentStep] = useState(-1); // Start at -1
  const [startZoom, setStartZoom] = useState(false);
  const [revealContent, setRevealContent] = useState(false);

  const steps = [
    { icon: Camera, text: 'Shoot', duration: 800 },
    { icon: Scissors, text: 'Edit', duration: 600 },
    { icon: RefreshCw, text: 'Repeat', duration: 400 }
  ];

  // Delay showing the first step by 300ms
  useEffect(() => {
    const delayTimer = setTimeout(() => setCurrentStep(0), 300);
    return () => clearTimeout(delayTimer);
  }, []);

  // Handle step transitions
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (currentStep >= 0 && currentStep < steps.length) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, steps[currentStep]?.duration || 500);
    } else if (currentStep === steps.length) {
      setStartZoom(true);
      setRevealContent(true);
      onAnimationComplete();
    }

    return () => clearTimeout(timer);
  }, [currentStep, onAnimationComplete]);

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 transition-all duration-1000 ${
        revealContent ? 'bg-opacity-0' : 'bg-opacity-100'
      }`}
    >
      <div className="relative">
        <div
          className={`transition-all duration-1000 ease-in-out ${
            startZoom ? 'scale-[25] opacity-0 blur-lg' : 'scale-100 opacity-100 blur-none'
          }`}
        >
          <Logo className="h-24 w-24" />
        </div>

        {steps.map((Step, index) => (
          <div
            key={index}
            className={`absolute left-1/2 -translate-x-1/2 top-32 flex items-center gap-2 transition-all duration-300
              ${currentStep === index ? 'opacity-100 translate-y-0' :
                currentStep > index ? 'opacity-0 -translate-y-8' :
                'opacity-0 translate-y-8'}`}
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
