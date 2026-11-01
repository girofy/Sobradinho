import React from 'react';
import { FEATURED_EVENT, eventRange } from '../data/event';
import { Photo } from '../v2/ui';

/** Cartaz gerado em SVG a partir dos dados do evento (usado quando não há cartaz oficial). */
export const EventPoster: React.FC<{ title: string; when: string; place: string }> = ({ title, when, place }) => {
  const words = title.toUpperCase().split(' ');
  const flags = Array.from({ length: 9 });
  const colors = ['#EF4444', '#FBBF24', '#22C55E', '#3B82F6', '#F97316'];
  return (
    <svg viewBox="0 0 400 500" className="w-full h-auto rounded-2xl" role="img" aria-label={`Cartaz ${title}`}>
      <defs>
        <radialGradient id="pbg" cx=".5" cy=".42" r=".8"><stop offset="0" stopColor="#FDBA74" /><stop offset=".55" stopColor="#EA580C" /><stop offset="1" stopColor="#7C2D12" /></radialGradient>
      </defs>
      <rect width="400" height="500" fill="url(#pbg)" />
      {Array.from({ length: 16 }).map((_, i) => (<path key={i} d={`M200 230L${200 + 520 * Math.cos((i / 16) * Math.PI * 2)} ${230 + 520 * Math.sin((i / 16) * Math.PI * 2)}L${200 + 520 * Math.cos(((i + 0.5) / 16) * Math.PI * 2)} ${230 + 520 * Math.sin(((i + 0.5) / 16) * Math.PI * 2)}z`} fill="#fff" opacity=".07" />))}
      <path d="M0 22Q200 62 400 22" stroke="#1C1917" strokeWidth="2" fill="none" />
      {flags.map((_, i) => { const x = 14 + i * 44; const y = 22 + 20 * Math.sin((i / 8) * Math.PI); return <path key={i} d={`M${x} ${y}h30l-15 34z`} fill={colors[i % 5]} />; })}
      <text x="200" y="140" textAnchor="middle" fontSize="20" fontWeight="800" letterSpacing="6" fill="#FEF3C7" fontFamily="system-ui, sans-serif">SOBRADINHO APRESENTA</text>
      {words.map((w, i) => (<text key={i} x="200" y={218 + i * 80} textAnchor="middle" fontSize={78} textLength={w.length > 6 ? 330 : undefined} lengthAdjust="spacingAndGlyphs" fontWeight="900" fill="#fff" stroke="#7C2D12" strokeWidth="6" paintOrder="stroke" fontFamily="Impact, 'Arial Black', system-ui, sans-serif">{w}</text>))}
      <rect x="60" y="408" width="280" height="62" rx="31" fill="#1C1917" />
      <text x="200" y="435" textAnchor="middle" fontSize="19" fontWeight="800" fill="#FDE68A" fontFamily="system-ui, sans-serif">{when}</text>
      <text x="200" y="458" textAnchor="middle" fontSize="14" fill="#fff" fontFamily="system-ui, sans-serif">{place}</text>
      <text x="200" y="490" textAnchor="middle" fontSize="12" fontWeight="700" fill="#FEF3C7" opacity=".9" fontFamily="system-ui, sans-serif">Confirme presença no Sobradinho Online</text>
    </svg>
  );
};

/** Cartaz oficial quando existe (public/img/<posterSlot>.jpg); senão, o cartaz desenhado. */
export const EventArt: React.FC<{ className?: string }> = ({ className = '' }) => {
  const e = FEATURED_EVENT;
  const drawn = <EventPoster title={e.title} when={eventRange()} place={e.place ?? 'Sobradinho-BA'} />;
  if (!e.posterSlot) return drawn;
  return <Photo slot={e.posterSlot} alt={`Cartaz ${e.title}`} fallback={drawn} className={`w-full h-auto block ${className}`} />;
};
