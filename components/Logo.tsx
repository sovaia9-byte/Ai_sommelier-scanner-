
import React from 'react';

interface LogoProps {
  className?: string;
  goldColor?: string;
  rubyColor?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "w-24 h-24", 
  goldColor = "#d4af37", 
  rubyColor = "#9b111e" 
}) => {
  return (
    <svg 
      viewBox="0 0 100 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Top Stem/Leaves */}
      <path 
        d="M35 15C35 15 38 30 50 30C62 30 65 15 65 15C65 15 75 15 75 25C75 35 60 40 50 40C40 40 25 35 25 25C25 15 35 15 35 15Z" 
        stroke={goldColor} 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Grapes Arrangement: 3-2-1 */}
      {/* Row 1 (Top): 3 grapes */}
      <circle cx="32" cy="55" r="10" stroke={goldColor} strokeWidth="2" />
      <circle cx="32" cy="55" r="5" fill={rubyColor} />
      
      <circle cx="50" cy="55" r="10" stroke={goldColor} strokeWidth="2" />
      <circle cx="50" cy="55" r="5" fill={rubyColor} />
      
      <circle cx="68" cy="55" r="10" stroke={goldColor} strokeWidth="2" />
      <circle cx="68" cy="55" r="5" fill={rubyColor} />
      
      {/* Row 2 (Middle): 2 grapes */}
      <circle cx="41" cy="73" r="10" stroke={goldColor} strokeWidth="2" />
      <circle cx="41" cy="73" r="5" fill={rubyColor} />
      
      <circle cx="59" cy="73" r="10" stroke={goldColor} strokeWidth="2" />
      <circle cx="59" cy="73" r="5" fill={rubyColor} />
      
      {/* Row 3 (Bottom): 1 grape */}
      <circle cx="50" cy="91" r="10" stroke={goldColor} strokeWidth="2" />
      <circle cx="50" cy="91" r="5" fill={rubyColor} />

      {/* Connecting lines */}
      <path d="M41 55H59" stroke={goldColor} strokeWidth="1.5" opacity="0.6" />
      <path d="M50 65V81" stroke={goldColor} strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
};
