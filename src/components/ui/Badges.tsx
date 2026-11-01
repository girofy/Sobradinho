import React from 'react';

export const VerifiedBadge: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-label="Verificado" role="img">
    <path
      d="M12 1.6l2.5 1.8 3.1-.2 1 2.9 2.5 1.9-.9 3 .9 3-2.5 1.9-1 2.9-3.1-.2L12 22.4l-2.5-1.8-3.1.2-1-2.9-2.5-1.9.9-3-.9-3 2.5-1.9 1-2.9 3.1.2z"
      fill="#2563EB"
    />
    <path d="M7.9 12.3l2.7 2.7 5.5-5.6" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const FounderChip: React.FC<{ number: number }> = ({ number }) => (
  <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-extrabold text-amber-950 bg-gradient-to-r from-amber-300 to-orange-400">
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
    </svg>
    Fundador nº {String(number).padStart(2, '0')}
  </span>
);
