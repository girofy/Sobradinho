// [LAYOUT ARCHETYPE]: Local Services Directory & Business Grid
// [RADIUS & BORDERS]: rounded-2xl (4px) containers, rounded-xl (2px) filter buttons/inputs, border border-zinc-100
// [ACCENT LOGIC]: #2563EB (Royal Blue)

import React from 'react';
import { Filter, Plus, RefreshCw, Search, Wrench } from 'lucide-react';
import type { ServiceItem } from '../types';
import { ServiceCard } from './ServiceCard';

interface ResolveSectionProps {
  services: ServiceItem[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
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

export const ResolveSection: React.FC<ResolveSectionProps> = ({
  services,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenNewServiceModal,
  onContactProvider,
}) => {
  return (
    <div className="space-y-3.5 pb-6 animate-fade-in">
      {/* Top Banner Box */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-3.5 space-y-2.5 ">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block ">
              RESOLVE SOBRADINHO
            </span>
            <h2 className="text-[15px] font-bold text-zinc-900 leading-tight">
              Serviços & Negócios Locais
            </h2>
            <p className="text-[13px] text-zinc-500">
              Encontre profissionais ou anuncie o que você faz na cidade
            </p>
          </div>
          <button
            onClick={onOpenNewServiceModal}
            className="px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-1 uppercase tracking-wider shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Anunciar</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por eletricista, faxina, marceneiro..."
            className="w-full bg-zinc-50 border border-zinc-100 rounded-xl pl-8 pr-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
          />
        </div>

        {/* Horizontal Category Bar */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => onSelectCategory(cat.key)}
                className={`px-3 py-2 text-sm font-semibold rounded-xl whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-white font-bold'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border border-zinc-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Count and Refresh */}
      <div className="flex items-center justify-between text-sm text-zinc-600 px-0.5">
        <span className=" text-[13px] text-zinc-500">
          {services.length} {services.length === 1 ? 'profissional ativo' : 'profissionais ativos'}
        </span>

        <button
          onClick={() => {
            onSelectCategory('todos');
            onSearchChange('');
          }}
          className="text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1"
          title="Redefinir filtros"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Ver todos</span>
        </button>
      </div>

      {/* Services Stream */}
      {services.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-zinc-300 rounded-xl bg-white space-y-2">
          <Wrench className="w-11 h-11 mx-auto text-zinc-400 stroke-[1.5]" />
          <h4 className="text-sm font-bold text-zinc-800">Nenhum profissional encontrado</h4>
          <p className="text-[13px] text-zinc-500">
            Tente outro termo ou limpe os filtros para ver toda a lista da cidade.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onContact={onContactProvider}
            />
          ))}
        </div>
      )}
    </div>
  );
};
