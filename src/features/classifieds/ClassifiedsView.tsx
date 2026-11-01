// [LAYOUT ARCHETYPE]: Classifieds Marketplace Catalog & Ad Stream
// [RADIUS & BORDERS]: rounded-2xl (4px) containers, rounded-xl (2px) filter buttons/cards, border border-zinc-100
// [ACCENT LOGIC]: #2563EB (Royal Blue) & #059669 (Emerald Green for WhatsApp)

import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, MapPin, Tag, Phone, Share2, Sparkles, X } from 'lucide-react';
import type { ClassifiedCategory, ClassifiedItem } from '../../types/community';
import { ClassifiedDetailModal } from './ClassifiedDetailModal';
import { NewClassifiedModal } from './NewClassifiedModal';
import { useHaptics } from '../../hooks/useHaptics';

interface ClassifiedsViewProps {
  items: ClassifiedItem[];
  onAddNewItem: (ad: Omit<ClassifiedItem, 'id' | 'timeAgo' | 'status'>) => void;
  userName: string;
  onShareItem: (item: ClassifiedItem) => void;
}

const CATEGORIES: { key: ClassifiedCategory; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'desapego', label: 'Desapego' },
  { key: 'imoveis', label: 'Imóveis' },
  { key: 'veiculos', label: 'Veículos' },
  { key: 'empregos', label: 'Empregos' },
  { key: 'servicos', label: 'Serviços' },
];

export const ClassifiedsView: React.FC<ClassifiedsViewProps> = ({
  items,
  onAddNewItem,
  userName,
  onShareItem,
}) => {
  const { triggerHaptic } = useHaptics();
  const [activeCategory, setActiveCategory] = useState<ClassifiedCategory>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('todos');
  const [selectedItem, setSelectedItem] = useState<ClassifiedItem | null>(null);
  const [isNewAdOpen, setIsNewAdOpen] = useState(false);

  // Filtered List
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = activeCategory === 'todos' || item.category === activeCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
      const matchNeighborhood =
        selectedNeighborhood === 'todos' || item.neighborhood === selectedNeighborhood;
      return matchCat && matchSearch && matchNeighborhood;
    });
  }, [items, activeCategory, searchQuery, selectedNeighborhood]);

  const uniqueNeighborhoods = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.neighborhood)));
  }, [items]);

  const handleOpenWhatsAppDirect = (e: React.MouseEvent, item: ClassifiedItem) => {
    e.stopPropagation();
    triggerHaptic('selection');
    const rawNumber = item.sellerWhatsApp.replace(/\D/g, '');
    const cleanNumber = rawNumber.startsWith('55') ? rawNumber : `55${rawNumber}`;
    const text = encodeURIComponent(
      `Olá ${item.sellerName}! Vi seu anúncio "${item.title}" (${item.price}) no Sobradinho Online e tenho interesse!`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-3.5 animate-fade-in pb-4">
      {/* Top Banner / Actions Bar */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-zinc-900 leading-tight">
              Classificados & Desapego
            </h2>
            <p className="text-[13px] text-zinc-500">
              Compre, venda e alugue direto com moradores de Sobradinho
            </p>
          </div>
          <button
            onClick={() => {
              triggerHaptic('medium');
              setIsNewAdOpen(true);
            }}
            className="px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-1 uppercase tracking-wider shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Anunciar</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por sofá, bicicleta, aluguel, celular..."
            className="w-full bg-zinc-50 border border-zinc-100 rounded-xl pl-8 pr-7 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-0.5"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Horizontal Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  triggerHaptic('selection');
                  setActiveCategory(cat.key);
                }}
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

      {/* Neighborhood Sub-filter & Count */}
      <div className="flex items-center justify-between text-sm text-zinc-600 px-0.5">
        <span className=" text-[13px] text-zinc-500">
          {filteredItems.length} {filteredItems.length === 1 ? 'anúncio ativo' : 'anúncios ativos'}
        </span>

        <div className="flex items-center gap-1 text-[13px]">
          <span className="text-zinc-400">Região:</span>
          <select
            value={selectedNeighborhood}
            onChange={(e) => setSelectedNeighborhood(e.target.value)}
            className="bg-white border border-zinc-100 rounded-xl text-sm py-0.5 px-1.5 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
          >
            <option value="todos">Todos os bairros</option>
            {uniqueNeighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ads Stream Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-zinc-300 rounded-xl bg-white space-y-2.5">
          <Tag className="w-11 h-11 mx-auto text-zinc-400 stroke-[1.5]" />
          <h4 className="text-sm font-bold text-zinc-800">Nenhum anúncio encontrado</h4>
          <p className="text-[13px] text-zinc-500 max-w-xs mx-auto">
            Não encontramos resultados para sua busca ou categoria. Que tal ser o primeiro a desapegar?
          </p>
          <button
            onClick={() => {
              setActiveCategory('todos');
              setSearchQuery('');
              setSelectedNeighborhood('todos');
            }}
            className="px-3 py-2 bg-zinc-100 border border-zinc-100 text-zinc-700 text-sm font-semibold rounded-xl hover:bg-zinc-200"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              onClick={() => {
                triggerHaptic('selection');
                setSelectedItem(item);
              }}
              className="bg-white border border-zinc-100 hover:border-zinc-300 rounded-2xl overflow-hidden hover:shadow transition-all flex flex-col cursor-pointer group"
            >
              {/* Media Aspect */}
              <div className="relative aspect-[16/10] bg-zinc-100 overflow-hidden border-b border-zinc-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 bg-zinc-900/90 text-white font-bold text-xs px-1.5 py-0.5 rounded-xl">
                  {item.category.toUpperCase()}
                </div>
                <div className="absolute bottom-2 left-2 bg-blue-600 text-white font-bold text-sm px-2 py-0.5 rounded-xl shadow">
                  {item.price}
                </div>
              </div>

              {/* Information Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-zinc-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-zinc-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-zinc-500 truncate">
                    <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                    <span className="truncate">{item.neighborhood}</span>
                    <span>•</span>
                    <span>{item.timeAgo}</span>
                  </div>

                  <button
                    onClick={(e) => handleOpenWhatsAppDirect(e, item)}
                    className="p-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 rounded-xl transition-colors flex items-center gap-1 text-[13px] font-bold shrink-0"
                    title="Chamar no WhatsApp"
                  >
                    <Phone className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modals */}
      <ClassifiedDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onShare={onShareItem}
      />

      <NewClassifiedModal
        isOpen={isNewAdOpen}
        onClose={() => setIsNewAdOpen(false)}
        onSubmit={onAddNewItem}
        defaultSellerName={userName}
      />
    </div>
  );
};
