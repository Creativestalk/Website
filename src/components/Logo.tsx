import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-8 w-8 text-primary" }) => {
  return (
    <img 
      src="https://raw.githubusercontent.com/Creativestalk/Website/main/Logo_Icon-resized.png"
      alt="Creativestalk Studio"
      className={className}
    />
  );
};

export default Logo;