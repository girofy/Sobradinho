// [LAYOUT ARCHETYPE]: Person Profile Modal & Contact Action
// [RADIUS & BORDERS]: rounded-3xl container & rounded-2xl avatar
// [ACCENT LOGIC]: #2563EB (Royal Blue) & #16A34A (WhatsApp Green)

import React from 'react';
import { Check, MapPin, MessageSquare, Phone, Share2, Sparkles, X } from 'lucide-react';
import type { PersonProfile } from '../types/community';

interface PersonDetailModalProps {
  person: PersonProfile | null;
  onClose: () => void;
}

export const PersonDetailModal: React.FC<PersonDetailModalProps> = ({
  person,
  onClose,
}) => {
  if (!person) return null;

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá ${person.name}, vi seu perfil no Sobradinho Online e gostaria de conversar!`
    );
    window.open(`https://wa.me/55${person.contactWhatsApp || '74999990001'}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-left">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            PERFIL DA COMUNIDADE
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Person Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 shrink-0 border-2 border-blue-500 shadow-sm">
            {person.avatarUrl ? (
              <img src={person.avatarUrl} alt={person.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-blue-600 text-xl">
                {person.name.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {person.name}
              </h3>
              {person.badge && (
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.2 rounded-full border border-blue-200">
                  {person.badge}
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500 font-medium block mt-0.5">
              @{person.handle}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{person.neighborhood}</span>
            </div>
          </div>
        </div>

        {/* Talents and Bio */}
        <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-700 font-sans">
          <div>
            <strong className="text-slate-900 block font-bold">O que faz / Talentos:</strong>
            <p className="text-slate-600 mt-0.5">{person.talents}</p>
          </div>

          <div className="pt-2 border-t border-slate-200/60">
            <strong className="text-slate-900 block font-bold">Sobre:</strong>
            <p className="text-slate-600 mt-0.5 leading-relaxed">{person.bio}</p>
          </div>
        </div>

        {/* WhatsApp Contact Button */}
        <div className="pt-2 space-y-2">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Chamar no WhatsApp</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
