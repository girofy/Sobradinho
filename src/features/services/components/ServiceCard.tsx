// [LAYOUT ARCHETYPE]: Swiss Brutalist Service Provider Card
// [RADIUS & BORDERS]: rounded (4px) card, rounded-sm (2px) buttons/photos, border border-zinc-200
// [ACCENT LOGIC]: #2563EB (Royal Blue) & #059669 (Emerald Green for verified badges)

import React from 'react';
import { CheckCircle2, Phone, MapPin } from 'lucide-react';
import type { ServiceItem } from '../types';

interface ServiceCardProps {
  service: ServiceItem;
  onContact: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onContact }) => {
  return (
    <article className="bg-white border border-zinc-200 rounded p-3 sm:p-3.5 shadow-sm space-y-2.5 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1 text-[11px] font-mono">
            <span className="font-bold text-zinc-900">
              {service.providerName}
            </span>
            <span className="text-zinc-400">
              &bull; {service.neighborhood}
            </span>
            {service.badges?.map((badge) => (
              <span
                key={badge}
                className="text-[9.5px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.2 rounded-sm border border-emerald-200 flex items-center gap-1 font-mono uppercase"
              >
                <CheckCircle2 className="w-2.5 h-2.5" />
                {badge}
              </span>
            ))}
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
            {service.title}
          </h3>
        </div>

        {service.priceTag && (
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-sm shrink-0">
            {service.priceTag}
          </span>
        )}
      </div>

      <p className="text-xs text-zinc-600 leading-relaxed font-sans">
        {service.description}
      </p>

      {service.photos && service.photos.length > 0 && (
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          {service.photos.map((photo, i) => (
            <div key={i} className="rounded-sm overflow-hidden h-28 border border-zinc-200 bg-zinc-100">
              <img src={photo} alt="Portfólio" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-[10px] text-zinc-400 font-mono">
          Sobradinho-BA e região
        </span>

        <button
          onClick={() => onContact(service)}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-sm transition-all flex items-center gap-1.5 shadow-sm uppercase tracking-wider"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Contatar</span>
        </button>
      </div>
    </article>
  );
};
