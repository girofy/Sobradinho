// [LAYOUT ARCHETYPE]: Digital Citizen Card Modal
// [RADIUS & BORDERS]: rounded-3xl container & rounded-2xl badge card
// [ACCENT LOGIC]: #2563EB (Royal Blue) & #F97316 (Solar Orange)

import React, { useState } from 'react';
import { Check, Copy, QrCode, Share2, Sparkles, X } from 'lucide-react';
import { SobradinhoLogo } from './SobradinhoLogo';

interface CitizenCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userNeighborhood: string;
}

export const CitizenCardModal: React.FC<CitizenCardModalProps> = ({
  isOpen,
  onClose,
  userName,
  userNeighborhood,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(
      `Cartão Gente Daqui — ${userName} • ${userNeighborhood}\nSobradinho Online: https://sobradinho.girofy.site/`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4 text-center">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            CARTÃO GENTE DAQUI
          </span>
          <button
            onClick={onClose}
            className="w-10 h-12 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Visual Digital Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl p-6 shadow-xl text-left space-y-4 relative overflow-hidden">
          {/* Subtle Orange Glow in corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <div className="flex items-center justify-between">
            <SobradinhoLogo size="sm" showText={false} />
            <span className="text-xs font-extrabold tracking-widest uppercase bg-white/15 px-2 py-0.5 rounded-full">
              SOBRADINHO &bull; BA
            </span>
          </div>

          <div className="pt-2">
            <span className="text-sm text-blue-200 block font-medium">
              Quem faz acontecer tá aqui
            </span>
            <h3 className="text-2xl font-black tracking-tight text-white mt-0.5">
              {userName}
            </h3>
            <span className="text-sm text-blue-100 block font-medium mt-0.5">
              {userNeighborhood}
            </span>
          </div>

          <div className="pt-4 border-t border-white/20 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs text-blue-200 block">Identificador Comunitário</span>
              <strong className="text-sm tracking-widest text-white">SBD-2026-VALE</strong>
            </div>

            <div className="w-10 h-12 bg-white rounded-xl p-1 flex items-center justify-center text-slate-900 shadow">
              <QrCode className="w-full h-full" />
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-500 font-sans px-2">
          Compartilhe com quem você conhece para valorizar os talentos e moradores de Sobradinho.
        </p>

        {/* Actions */}
        <div className="pt-1 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={handleShare}
            className="flex-1 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all flex items-center justify-center gap-1.5 "
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                <span>Compartilhar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
