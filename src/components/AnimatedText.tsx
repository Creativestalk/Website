import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  type?: 'words' | 'chars' | 'lines';
  stagger?: number;
  once?: boolean;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  delay = 0,
  duration = 0.6,
  type = 'words',
  stagger = 0.1,
  once = true
}) => {
  const splitText = () => {
    switch (type) {
      case 'chars':
        return text.split('');
      case 'lines':
        return text.split('\n');
      case 'words':
      default:
        return text.split(' ');
    }
  };

  const textArray = splitText();

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      className={className}
    >
      {textArray.map((item, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{ display: 'inline-block' }}
          className={type === 'words' ? 'mr-2' : ''}
        >
          {item}
          {type === 'lines' && index < textArray.length - 1 && <br />}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedText;