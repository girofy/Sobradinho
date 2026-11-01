// [LAYOUT ARCHETYPE]: Classifieds Item Detail Modal
// [RADIUS & BORDERS]: rounded (4px) modal container, rounded-sm (2px) buttons/tags, border border-zinc-200
// [ACCENT LOGIC]: #2563EB (Royal Blue) & #059669 (Emerald Green for WhatsApp)

import React from 'react';
import { MapPin, Phone, Share2, Tag, X, Check, ShieldCheck } from 'lucide-react';
import type { ClassifiedItem } from '../../types/community';

interface ClassifiedDetailModalProps {
  item: ClassifiedItem | null;
  onClose: () => void;
  onShare: (item: ClassifiedItem) => void;
}

export const ClassifiedDetailModal: React.FC<ClassifiedDetailModalProps> = ({
  item,
  onClose,
  onShare,
}) => {
  if (!item) return null;

  const handleOpenWhatsApp = () => {
    const rawNumber = item.sellerWhatsApp.replace(/\D/g, '');
    const cleanNumber = rawNumber.startsWith('55') ? rawNumber : `55${rawNumber}`;
    const text = encodeURIComponent(
      `Olá ${item.sellerName}! Vi seu anúncio "${item.title}" (${item.price}) no Sobradinho Online e tenho interesse!`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-none animate-fade-in">
      <div className="w-full max-w-md bg-white rounded border border-zinc-300 shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="h-12 border-b border-zinc-200 px-3.5 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">
              CLASSIFICADOS SOBRADINHO
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onShare(item)}
              className="p-1.5 text-zinc-500 hover:text-blue-600 rounded-sm transition-colors"
              title="Compartilhar anúncio"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-500 hover:text-black rounded-sm transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 p-4 space-y-3.5">
          {/* Main Photo */}
          <div className="relative aspect-[4/3] bg-zinc-100 border border-zinc-200 rounded-sm overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-zinc-900/90 text-white font-mono font-bold text-xs px-2 py-0.5 rounded-sm shadow">
              {item.category.toUpperCase()}
            </div>
            <div className="absolute bottom-2 right-2 bg-blue-600 text-white font-mono font-bold text-sm px-2.5 py-1 rounded-sm shadow">
              {item.price}
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="space-y-1">
            <h2 className="text-base font-bold text-zinc-900 leading-snug">
              {item.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <span className="flex items-center gap-1 text-zinc-700">
                <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span>{item.neighborhood}</span>
              </span>
              <span>•</span>
              <span>{item.timeAgo}</span>
            </div>
          </div>

          {/* Description */}
          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-sm space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Descrição do Anunciante
            </span>
            <p className="text-xs text-zinc-800 leading-relaxed font-sans whitespace-pre-wrap">
              {item.description}
            </p>
          </div>

          {/* Seller Box */}
          <div className="p-3 border border-zinc-200 rounded-sm flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-sm bg-blue-600 text-white font-mono font-bold text-sm flex items-center justify-center">
                {item.sellerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong className="text-xs font-bold text-zinc-900 block leading-tight">
                  {item.sellerName}
                </strong>
                <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Vendedor verificado da comunidade</span>
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 bg-zinc-100 p-2.5 rounded-sm">
            💡 Dica de segurança comunitária: Sempre combine a entrega e o pagamento em locais públicos e movimentados de Sobradinho.
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-3 border-t border-zinc-200 bg-white flex items-center justify-between gap-3">
          <div className="font-mono">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Valor pedido</span>
            <span className="text-sm font-black text-zinc-900">{item.price}</span>
          </div>

          <button
            onClick={handleOpenWhatsApp}
            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-sm shadow-sm transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider"
          >
            <Phone className="w-4 h-4 fill-white text-white" />
            <span>Negociar no WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
