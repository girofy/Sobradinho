import React from 'react';

type Kind = 'fundador' | 'verificado' | 'embaixador' | 'destaque';

/** Selos desenhados em SVG (sem imagem externa). */
export const Seal: React.FC<{ kind: Kind; size?: number; locked?: boolean }> = ({ kind, size = 48, locked }) => {
  const id = `g-${kind}`;
  const pal: Record<Kind, [string, string]> = {
    fundador: ['#FCD34D', '#F97316'],
    verificado: ['#60A5FA', '#1D4ED8'],
    embaixador: ['#A78BFA', '#6D28D9'],
    destaque: ['#FB923C', '#DC2626'],
  };
  const [a, b] = pal[kind];
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} role="img" aria-label={kind} style={locked ? { filter: 'grayscale(1)', opacity: 0.4 } : undefined}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <path d="M32 3l7 5 8.7-.6 2.8 8.3 7 5.2-2.6 8.3 2.6 8.3-7 5.2-2.8 8.3-8.7-.6-7 5-7-5-8.7.6-2.8-8.3-7-5.2 2.6-8.3-2.6-8.3 7-5.2 2.8-8.3 8.7.6z" fill={`url(#${id})`} />
      <circle cx="32" cy="32" r="19" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.5" />
      {kind === 'fundador' && <path d="M32 18l4.2 8.8 9.6 1.2-7 6.7 1.8 9.5L32 39.4 23.4 44.2l1.8-9.5-7-6.7 9.6-1.2z" fill="#fff" />}
      {kind === 'verificado' && <path d="M22 33l7 7 13-14" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />}
      {kind === 'embaixador' && (<g fill="#fff"><circle cx="32" cy="25" r="5" /><path d="M21 43c1-7 5-10 11-10s10 3 11 10z" /></g>)}
      {kind === 'destaque' && <path d="M33 16c1 7 9 9 9 18a10 10 0 01-20 0c0-5 3-7 5-10 0 3 1 5 3 5 2-3 3-7 3-13z" fill="#fff" />}
    </svg>
  );
};
