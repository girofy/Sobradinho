// [LAYOUT ARCHETYPE]: Clean Mobile Marketplace & Service Pills
// [RADIUS & BORDERS]: rounded-2xl to rounded-full pill buttons
// [ACCENT LOGIC]: #2563EB (Royal Blue) & #F97316 (Solar Orange)

import React, { useState } from 'react';
import {
  CheckCircle2,
  Filter,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Wrench,
} from 'lucide-react';
import type { ServiceItem } from '../types/community';
import { filterServicesByCategory } from '../lib/community-logic';

interface ResolveViewProps {
  services: ServiceItem[];
  onOpenNewServiceModal: () => void;
  onContactProvider: (service: ServiceItem) => void;
}

const CATEGORIES = [
  { key: 'todos', label: 'Todos' },
  { key: 'reformas', label: 'Reformas' },
  { key: 'eletrica', label: 'Elétrica' },
  { key: 'faxina', label: 'Faxina' },
  { key: 'consertos', label: 'Consertos' },
  { key: 'beleza', label: 'Beleza' },
  { key: 'aulas', label: 'Aulas' },
];

export const ResolveView: React.FC<ResolveViewProps> = ({
  services,
  onOpenNewServiceModal,
  onContactProvider,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const displayedServices = filterServicesByCategory(services, selectedCategory, searchQuery);

  return (
    <div className="space-y-6 pb-6">
      {/* Top Banner Hero */}
      <div className="px-1 space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 block">
          RESOLVE
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Precisou? <span className="text-blue-600">Chama.</span>
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Encontre quem faz. Mostre o que você sabe.
        </p>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            onClick={onOpenNewServiceModal}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Publicar pedido ou serviço</span>
          </button>
        </div>
      </div>

      {/* Horizontal Category Pill Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar px-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
              selectedCategory === cat.key
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Section: Quem precisa. Quem resolve */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              SERVIÇOS E OPORTUNIDADES
            </span>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              Quem precisa. Quem resolve.
            </h2>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('todos');
              setSearchQuery('');
            }}
            title="Atualizar lista"
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Post Card */}
        <div
          onClick={onOpenNewServiceModal}
          className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex items-center justify-between gap-3 cursor-pointer hover:border-blue-200 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
              S
            </div>
            <span className="text-xs text-slate-500 truncate">
              Precisa de uma mão? Sabe fazer?
            </span>
          </div>
          <button className="bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-full text-xs shrink-0 hover:bg-blue-600 hover:text-white transition-colors">
            Publicar
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Serviço ou bairro"
              className="w-full bg-white border border-slate-200/90 rounded-2xl pl-10 pr-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => setSelectedCategory('todos')}
            className="flex items-center gap-1.5 px-4 bg-white border border-slate-200/90 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filtrar</span>
          </button>
        </div>

        {/* Service Cards Listing */}
        <div className="space-y-3 pt-2">
          {displayedServices.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-slate-900">
                      {service.providerName}
                    </span>
                    <span className="text-xs text-slate-400">
                      &bull; {service.neighborhood}
                    </span>
                    {service.badges?.map((badge) => (
                      <span
                        key={badge}
                        className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {badge}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {service.title}
                  </h3>
                </div>

                {service.priceTag && (
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full shrink-0">
                    {service.priceTag}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {service.description}
              </p>

              {/* Photos if any */}
              {service.photos && service.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {service.photos.map((photo, i) => (
                    <div key={i} className="rounded-xl overflow-hidden h-28 border border-slate-100">
                      <img src={photo} alt="Portfólio" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  Atende em Sobradinho e região
                </span>

                <button
                  onClick={() => onContactProvider(service)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contatar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Bottom Lake Illustration */}
      <div className="rounded-3xl overflow-hidden bg-gradient-to-b from-blue-50/50 to-blue-100/40 p-4 border border-blue-100 text-center space-y-2">
        <h4 className="text-sm font-bold text-slate-800">
          Fortalecendo a economia de Sobradinho
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Toda contratação feita com profissionais daqui movimenta as famílias da nossa cidade.
        </p>
      </div>
    </div>
  );
};
