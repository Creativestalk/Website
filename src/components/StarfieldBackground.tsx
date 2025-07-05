import React from 'react';
import { motion } from 'framer-motion';

interface StarfieldBackgroundProps {
  density?: 'light' | 'medium' | 'dense';
  className?: string;
}

const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({ 
  density = 'medium',
  className = ''
}) => {
  // Dense field of visible stars - 30% more than usual
  const baseStarCount = density === 'light' ? 25 : density === 'medium' ? 40 : 60;
  const starCount = Math.floor(baseStarCount * 1.3); // 30% more stars

  // Generate visible static stars with better distribution
  const stars = Array.from({ length: starCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1, // 1px to 3px - clearly visible
    opacity: Math.random() * 0.4 + 0.6, // 0.6 to 1.0 - always visible
    delay: Math.random() * 8,
    duration: Math.random() * 4 + 6, // Slow, gentle twinkling
    color: Math.random() > 0.3 ? 'white' : 'gray', // More white stars
    twinkleIntensity: Math.random() * 0.2 + 0.8 // Strong twinkling
  }));

  // Select specific stars for shooting effects - 2 to 4 at a time
  const shootingStarConfigs = [
    // Group 1 - 3 shooting stars from specific dots
    { 
      delay: 2,
      stars: [
        { starIndex: 5, distance: 25, intensity: 'high' },
        { starIndex: 12, distance: 30, intensity: 'medium' },
        { starIndex: 23, distance: 20, intensity: 'high' }
      ]
    },
    // Group 2 - 2 shooting stars  
    { 
      delay: 7,
      stars: [
        { starIndex: 8, distance: 28, intensity: 'medium' },
        { starIndex: 18, distance: 32, intensity: 'high' }
      ]
    },
    // Group 3 - 4 shooting stars
    { 
      delay: 12,
      stars: [
        { starIndex: 3, distance: 24, intensity: 'medium' },
        { starIndex: 15, distance: 26, intensity: 'high' },
        { starIndex: 28, distance: 22, intensity: 'medium' },
        { starIndex: 35, distance: 29, intensity: 'high' }
      ]
    },
    // Group 4 - 3 shooting stars
    { 
      delay: 18,
      stars: [
        { starIndex: 7, distance: 27, intensity: 'high' },
        { starIndex: 20, distance: 25, intensity: 'medium' },
        { starIndex: 32, distance: 31, intensity: 'high' }
      ]
    }
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Dense Field of Static Twinkling Stars - DOTS DON'T MOVE */}
      {stars.map((star) => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color === 'white' ? '#ffffff' : '#d1d5db',
            boxShadow: star.color === 'white' 
              ? `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8), 0 0 ${star.size * 4}px rgba(255, 255, 255, 0.4)`
              : `0 0 ${star.size * 1.5}px rgba(209, 213, 219, 0.6), 0 0 ${star.size * 3}px rgba(209, 213, 219, 0.3)`
          }}
          initial={{ opacity: star.opacity * 0.7, scale: 1 }}
          animate={{ 
            opacity: [
              star.opacity * 0.7, 
              star.opacity * star.twinkleIntensity, 
              star.opacity * 0.8, 
              star.opacity * star.twinkleIntensity,
              star.opacity * 0.7
            ],
            scale: [1, 1.1, 1, 1.1, 1], // Gentle scale twinkling, but dot stays in place
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Falling Star Effects from Specific Dots */}
      {shootingStarConfigs.map((group, groupIndex) => 
        group.stars.map((shootingConfig, starIndex) => {
          const sourceStar = stars[shootingConfig.starIndex % stars.length];
          if (!sourceStar) return null;

          return (
            <motion.div
              key={`falling-star-${groupIndex}-${starIndex}`}
              className="absolute pointer-events-none"
              style={{
                left: `${sourceStar.x}%`,
                top: `${sourceStar.y}%`,
                zIndex: 10
              }}
            >
              {/* Bright Flash at Source Dot */}
              <motion.div 
                className="absolute bg-white rounded-full"
                style={{
                  width: `${sourceStar.size + 1}px`,
                  height: `${sourceStar.size + 1}px`,
                  left: `-0.5px`,
                  top: `-0.5px`,
                  boxShadow: `
                    0 0 ${(sourceStar.size + 1) * 3}px rgba(255, 255, 255, 1),
                    0 0 ${(sourceStar.size + 1) * 6}px rgba(255, 255, 255, 0.7),
                    0 0 ${(sourceStar.size + 1) * 9}px rgba(255, 255, 255, 0.4)
                  `,
                }}
                initial={{ 
                  scale: 1,
                  opacity: 0
                }}
                animate={{
                  scale: [1, 1.8, 1.4, 1.2, 1],
                  opacity: [0, 1, 0.9, 0.6, 0.3, 0] // Bright flash that fades
                }}
                transition={{
                  duration: 5,
                  delay: group.delay + (starIndex * 0.4),
                  repeat: Infinity,
                  repeatDelay: 20,
                  ease: "easeOut"
                }}
              />

              {/* Falling Star Trail - Starts from dot, falls diagonally */}
              <motion.div 
                className="absolute"
                style={{ 
                  width: '1.5px',
                  height: `${shootingConfig.distance * 2}px`,
                  left: `${sourceStar.size / 2}px`,
                  top: `${sourceStar.size / 2}px`,
                  transformOrigin: 'top center',
                  transform: 'rotate(45deg)', // Diagonal fall direction (↘️)
                  background: `linear-gradient(to bottom, 
                    rgba(255, 255, 255, 1) 0%, 
                    rgba(255, 255, 255, 0.95) 10%, 
                    rgba(255, 255, 255, 0.8) 25%, 
                    rgba(255, 255, 255, 0.6) 45%, 
                    rgba(255, 255, 255, 0.4) 65%, 
                    rgba(255, 255, 255, 0.2) 80%, 
                    rgba(255, 255, 255, 0.05) 95%, 
                    transparent 100%)`,
                  borderRadius: '1px',
                  filter: 'blur(0.3px)',
                  boxShadow: `0 0 3px rgba(255, 255, 255, 0.8), 0 0 6px rgba(255, 255, 255, 0.4)`,
                }}
                initial={{
                  scaleY: 0,
                  opacity: 0,
                  y: 0
                }}
                animate={{
                  scaleY: [0, 0.2, 0.6, 1, 0.8, 0.4, 0], // Trail grows then shrinks
                  opacity: [0, 0.3, 0.8, 1, 0.7, 0.3, 0],
                  y: [0, 2, 8, 15, 22, 28, 35] // Falls down slowly
                }}
                transition={{
                  duration: 5,
                  delay: group.delay + (starIndex * 0.4),
                  repeat: Infinity,
                  repeatDelay: 20,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              />

              {/* Traveling Bright Head */}
              <motion.div 
                className="absolute bg-white rounded-full"
                style={{
                  width: '2px',
                  height: '2px',
                  left: `${sourceStar.size / 2 - 1}px`,
                  top: `${sourceStar.size / 2 - 1}px`,
                  boxShadow: `
                    0 0 8px rgba(255, 255, 255, 1),
                    0 0 16px rgba(255, 255, 255, 0.8),
                    0 0 24px rgba(255, 255, 255, 0.4)
                  `,
                  zIndex: 15
                }}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                  scale: 0.5
                }}
                animate={{
                  // Cross-falling movement: diagonal from dot toward bottom-right
                  x: [0, shootingConfig.distance * 0.7, shootingConfig.distance * 0.9], 
                  y: [0, shootingConfig.distance * 0.7, shootingConfig.distance * 0.9], 
                  opacity: [0, 0.8, 1, 0.9, 0.6, 0.2, 0], // Bright then fades
                  scale: [0.5, 1.2, 1, 0.8, 0.5, 0.2]
                }}
                transition={{
                  duration: 5,
                  delay: group.delay + (starIndex * 0.4),
                  repeat: Infinity,
                  repeatDelay: 20,
                  ease: "easeOut"
                }}
              />

              {/* Fading Starting Point Effect */}
              <motion.div 
                className="absolute bg-white rounded-full"
                style={{
                  width: `${sourceStar.size * 0.8}px`,
                  height: `${sourceStar.size * 0.8}px`,
                  left: `${sourceStar.size * 0.1}px`,
                  top: `${sourceStar.size * 0.1}px`,
                  boxShadow: `0 0 ${sourceStar.size * 4}px rgba(255, 255, 255, 0.6)`,
                }}
                initial={{
                  opacity: 0,
                  scale: 1
                }}
                animate={{
                  opacity: [0, 0.8, 0.6, 0.4, 0.2, 0.1, 0], // Starting point slowly fades
                  scale: [1, 1.1, 1, 0.9, 0.8, 0.7, 0.6]
                }}
                transition={{
                  duration: 5,
                  delay: group.delay + (starIndex * 0.4) + 0.5, // Starts fading after trail begins
                  repeat: Infinity,
                  repeatDelay: 20,
                  ease: "easeOut"
                }}
              />
            </motion.div>
          );
        })
      )}

      {/* Subtle Ambient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          background: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.015) 0%, transparent 50%)
          `
        }}
      />
    </div>
  );
};

export default StarfieldBackground;