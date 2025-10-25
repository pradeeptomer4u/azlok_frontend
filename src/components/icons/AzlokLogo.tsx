import React from 'react';

interface AzlokLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const AzlokLogo: React.FC<AzlokLogoProps> = ({ 
  width = 24, 
  height = 24, 
  className = '' 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Stylized A for Azlok */}
      <path 
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" 
        fill="#4ADE80" 
      />
      <path 
        d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" 
        fill="white" 
      />
      <path 
        d="M15.5 17H14L9 7H10.5L15.5 17Z" 
        fill="#4ADE80" 
      />
      <path 
        d="M13 13H8.5V11.5H13V13Z" 
        fill="#4ADE80" 
      />
      <path 
        d="M16 9H11.5V7.5H16V9Z" 
        fill="#4ADE80" 
      />
    </svg>
  );
};

export default AzlokLogo;
