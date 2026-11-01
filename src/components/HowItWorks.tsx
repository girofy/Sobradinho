import React from 'react';
import { Sheet } from './ui/Sheet';
import { Seal } from './ui/Seals';
import { VERIFIED_AT } from '../lib/growth';

const Step1 = () => (
  <svg viewBox="0 0 160 100" className="w-full h-auto" aria-hidden="true">
    <rect width="160" height="100" rx="16" fill="#EFF6FF" />
    <rect x="18" y="14" width="46" height="74" rx="9" fill="#1E293B" /><rect x="22" y="22" width="38" height="58" rx="5" fill="#fff" />
    <rect x="26" y="28" width="30" height="6" rx="3" fill="#2563EB" /><rect x="26" y="40" width="30" height="4" rx="2" fill="#CBD5E1" /><rect x="26" y="48" width="22" height="4" rx="2" fill="#CBD5E1" />
    <rect x="26" y="60" width="30" height="12" rx="6" fill="#2563EB" />
    <path d="M70 50h26" stroke="#F97316" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 6" /><path d="M92 43l8 7-8 7" fill="none" stroke="#F97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    {[0, 1, 2].map((i) => (<g key={i}><circle cx={116 + (i % 2) * 22} cy={34 + i * 18} r="8" fill={['#FBBF24', '#34D399', '#A78BFA'][i]} /><path d={`M${106 + (i % 2) * 22} ${52 + i * 18}a10 10 0 0120 0z`} fill={['#FBBF24', '#34D399', '#A78BFA'][i]} opacity=".7" /></g>))}
  </svg>
);
const Step2 = () => (
  <svg viewBox="0 0 160 100" className="w-full h-auto" aria-hidden="true">
    <rect width="160" height="100" rx="16" fill="#FFF7ED" />
    <path d="M24 28h112a6 6 0 016 6v8a8 8 0 000 16v8a6 6 0 01-6 6H24a6 6 0 01-6-6V58a8 8 0 000-16v-8a6 6 0 016-6z" fill="#fff" stroke="#FB923C" strokeWidth="2.5" />
    <path d="M110 30v52" stroke="#FB923C" strokeWidth="2" strokeDasharray="4 4" />
    <text x="64" y="52" textAnchor="middle" fontSize="12" fontWeight="800" fill="#9A3412" fontFamily="system-ui, sans-serif">SOB-JULIO42</text>
    <text x="64" y="68" textAnchor="middle" fontSize="8" fill="#C2410C" fontFamily="system-ui, sans-serif">seu código</text>
    <circle cx="126" cy="56" r="9" fill="#2563EB" /><path d="M121 56l4 4 7-8" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Step3 = () => (
  <svg viewBox="0 0 160 100" className="w-full h-auto" aria-hidden="true">
    <rect width="160" height="100" rx="16" fill="#F5F3FF" />
    {[[30, 24], [132, 20], [24, 74], [138, 76]].map(([x, y], i) => (<path key={i} d={`M${x} ${y - 6}l2 4 4 2-4 2-2 4-2-4-4-2 4-2z`} fill="#F59E0B" />))}
    <foreignObject x="52" y="14" width="56" height="72"><div style={{ display: 'flex', justifyContent: 'center' }}><Seal kind="verificado" size={56} /></div></foreignObject>
    <rect x="42" y="74" width="76" height="14" rx="7" fill="#1E293B" /><text x="80" y="84" textAnchor="middle" fontSize="8" fontWeight="800" fill="#fff" fontFamily="system-ui, sans-serif">VERIFICADO</text>
  </svg>
);

export const HowItWorks: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => (
  <Sheet open={open} onClose={onClose} title="Como funciona">
    <div className="space-y-5">
      {[
        { Img: Step1, t: '1. Mande seu convite', d: 'Compartilhe no grupo da rua, no status ou direto pra um vizinho.' },
        { Img: Step2, t: '2. Ele entra com seu código', d: 'Seu nome aparece na lista "Veio pelo seu código" e você sobe no ranking.' },
        { Img: Step3, t: `3. Com ${VERIFIED_AT} convites, vira Verificado`, d: 'Check azul no perfil e anúncio fixado no topo por 7 dias.' },
      ].map(({ Img, t, d }) => (
        <div key={t}>
          <Img />
          <p className="text-base font-extrabold text-zinc-900 mt-2">{t}</p>
          <p className="text-sm text-zinc-500 leading-snug">{d}</p>
        </div>
      ))}
    </div>
  </Sheet>
);
