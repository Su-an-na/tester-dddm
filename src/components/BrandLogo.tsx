import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const iconSize = size === 'sm' ? 20 : size === 'lg' ? 28 : 24;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center select-none ${textSize} font-black text-[#181c21] tracking-tight ${className}`}>
      <svg
        className="mr-1.5 text-[#181c21]"
        fill="none"
        height={iconSize}
        viewBox="0 0 24 24"
        width={iconSize}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 12H8V20H4V12ZM10 4H14V20H10V4ZM16 16H20V20H16V16Z" fill="currentColor"></path>
      </svg>
      <span>TV</span>
    </div>
  );
};
