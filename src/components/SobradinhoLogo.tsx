import React from 'react';

interface SobradinhoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const SobradinhoLogo: React.FC<SobradinhoLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-14 h-14 rounded-3xl',
  };

  const textSizes = {
    sm: 'text-sm leading-tight',
    md: 'text-base leading-tight',
    lg: 'text-xl leading-tight',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon (Blue rounded box with Pin, Orange Sun and Blue Dam) */}
      <div
        className={`${iconSizes[size]} bg-blue-600 flex items-center justify-center p-1.5 shadow-sm shrink-0 overflow-hidden select-none`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* White Pin Outer Contour */}
          <path
            d="M50 94C50 94 84 57 84 37C84 18.22 68.78 3 50 3C31.22 3 16 18.22 16 37C16 57 50 94 50 94Z"
            fill="white"
          />
          {/* Top Orange Sun (with curved wave at bottom) */}
          <path
            d="M50 11C63.25 11 74.2 20.9 75.8 33.7C67 36 57 32 50 34C43 36 33 38 24.2 33.7C25.8 20.9 36.75 11 50 11Z"
            fill="#F97316"
          />
          {/* Bottom Blue Dam Piers / Arches */}
          <path
            d="M23 43C28 44 38 42 50 40C62 38 72 40 77 43C76 56 65 67 50 78C35 67 24 56 23 43Z"
            fill="#2563EB"
          />
          {/* White vertical dam pillars dividing the spillway */}
          <rect x="35" y="42" width="3.5" height="26" fill="white" rx="1.5" />
          <rect x="48.2" y="40" width="3.5" height="31" fill="white" rx="1.5" />
          <rect x="61.5" y="42" width="3.5" height="26" fill="white" rx="1.5" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className={`${textSizes[size]} font-bold tracking-tight text-slate-900 flex items-center gap-1`}>
            <span>Sobradinho</span>
            <span className="text-blue-600 font-extrabold">Online</span>
          </div>
          <span className="text-[10px] font-medium text-slate-400 tracking-wide">
            Bahia &bull; Comunidade
          </span>
        </div>
      )}
    </div>
  );
};
