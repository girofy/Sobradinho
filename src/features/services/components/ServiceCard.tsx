// [LAYOUT ARCHETYPE]: Swiss Brutalist Service Provider Card
// [RADIUS & BORDERS]: rounded-2xl (4px) card, rounded-xl (2px) buttons/photos, border border-zinc-100
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
    <article className="bg-white border border-zinc-100 rounded-2xl p-4 sm:p-3.5 space-y-2.5 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1 text-[13px] ">
            <span className="font-bold text-zinc-900">
              {service.providerName}
            </span>
            <span className="text-zinc-400">
              &bull; {service.neighborhood}
            </span>
            {service.badges?.map((badge) => (
              <span
                key={badge}
                className="text-[9.5px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.2 rounded-xl border border-emerald-200 flex items-center gap-1 uppercase"
              >
                <CheckCircle2 className="w-2.5 h-2.5" />
                {badge}
              </span>
            ))}
          </div>
          <h3 className="text-sm sm:text-sm font-bold text-zinc-900 leading-snug">
            {service.title}
          </h3>
        </div>

        {service.priceTag && (
          <span className="text-sm font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-xl shrink-0">
            {service.priceTag}
          </span>
        )}
      </div>

      <p className="text-sm text-zinc-600 leading-relaxed font-sans">
        {service.description}
      </p>

      {service.photos && service.photos.length > 0 && (
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          {service.photos.map((photo, i) => (
            <div key={i} className="rounded-xl overflow-hidden h-28 border border-zinc-100 bg-zinc-100">
              <img src={photo} alt="Portfólio" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-xs text-zinc-400 ">
          Sobradinho-BA e região
        </span>

        <button
          onClick={() => onContact(service)}
          className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 uppercase tracking-wider"
        >
          <Phone className="w-5 h-5" />
          <span>Contatar</span>
        </button>
      </div>
    </article>
  );
};
