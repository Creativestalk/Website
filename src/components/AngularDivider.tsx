import React from 'react';
import { motion } from 'framer-motion';

interface AngularDividerProps {
  className?: string;
  height?: number;
  fromColor?: string;
  toColor?: string;
  glowColor?: string;
}

const AngularDivider: React.FC<AngularDividerProps> = ({ 
  className = '', 
  height = 100,
  fromColor = '#0A0A0A', // dark
  toColor = '#121212', // dark-card
  glowColor = '#FFA500' // primary
}) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ height: `${height}px` }}>
      {/* Main Angular SVG */}
      <motion.svg
        className="absolute bottom-0 w-full"
        style={{ height: `${height}px` }}
        viewBox={`0 0 1200 ${height}`}
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {/* Gradient Definitions */}
        <defs>
          {/* Main gradient for the angular shape */}
          <linearGradient id="angularGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={fromColor} />
            <stop offset="100%" stopColor={toColor} />
          </linearGradient>
          
          {/* Flowing light gradient */}
          <linearGradient id="flowingLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor={`${glowColor}40`} />
            <stop offset="50%" stopColor={`${glowColor}80`} />
            <stop offset="70%" stopColor={`${glowColor}40`} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Main Angular Shape - Reversed: Down first, then Up */}
        <motion.path
          d={`M0,${height} L0,${height-15} L780,${height-60} L1200,${height-10} L1200,${height} Z`}
          fill="url(#angularGradient)"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Edge Line for the Angular Path */}
        <motion.path
          d={`M0,${height-15} L780,${height-60} L1200,${height-10}`}
          fill="none"
          stroke={glowColor}
          strokeWidth="1"
          opacity="0.3"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Flowing Light Effect - Like Mountain Design */}
        <motion.path
          d={`M0,${height-15} L780,${height-60} L1200,${height-10}`}
          fill="none"
          stroke="url(#flowingLight)"
          strokeWidth="3"
          opacity="0.8"
          filter="blur(1px)"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: [0, 1, 0],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 4, // 4 seconds for complete journey
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Additional Glow Layer */}
        <motion.path
          d={`M0,${height-15} L780,${height-60} L1200,${height-10}`}
          fill="none"
          stroke={glowColor}
          strokeWidth="1"
          opacity="0.6"
          filter="blur(2px)"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: [0, 1, 0],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            delay: 0.2 // Slight delay for layered effect
          }}
        />
      </motion.svg>

      {/* Subtle Gradient Overlay for Smooth Transition */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${fromColor}00 0%, ${fromColor}15 80%, ${toColor} 100%)`
        }}
      />
    </div>
  );
};

export default AngularDivider;