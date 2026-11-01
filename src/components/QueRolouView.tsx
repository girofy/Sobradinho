// [LAYOUT ARCHETYPE]: Editorial Community Recap & High-Engagement Grid
// [RADIUS & BORDERS]: rounded-2xl (4px) containers, rounded-xl (2px) badges, border border-zinc-100
// [ACCENT LOGIC]: #2563EB (Royal Blue) & #FF4400 (Safety Orange)

import React, { useState } from 'react';
import { Flame, Heart, Share2, Sparkles, Trophy, Award, MapPin, Calendar } from 'lucide-react';
import type { RecapItem } from '../types/community';
import { useHaptics } from '../hooks/useHaptics';

interface QueRolouViewProps {
  items: RecapItem[];
  onReact: (itemId: string, reactionType: 'fire' | 'applause' | 'heart') => void;
  onShare: (item: RecapItem) => void;
  onOpenComposer: () => void;
}

export const QueRolouView: React.FC<QueRolouViewProps> = ({
  items,
  onReact,
  onShare,
  onOpenComposer,
}) => {
  const { triggerHaptic } = useHaptics();
  const [filter, setFilter] = useState<'todos' | 'viral' | 'vitoria' | 'evento'>('todos');

  const filteredItems = items.filter((item) => {
    if (filter === 'todos') return true;
    return item.category === filter;
  });

  const handleReactionClick = (itemId: string, reactionType: 'fire' | 'applause' | 'heart') => {
    triggerHaptic('medium');
    onReact(itemId, reactionType);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner / Headline */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-orange-600">
            <Flame className="w-5 h-5 text-orange-600 stroke-[2.5]" />
            <span>O que rolou em Sobradinho</span>
          </div>
          <span className="text-[13px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-xl">
            Retrospectiva Semanal
          </span>
        </div>
        <h2 className="text-base font-bold text-zinc-900 tracking-tight leading-snug">
          Os acontecimentos, encontros e vitórias mais comentados da cidade
        </h2>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Tudo o que movimentou os bairros, do Chico Periperi à Barragem. Vote com suas reações no que mais marcou a semana!
        </p>

        {/* Quick Filter Chips */}
        <div className="pt-2 flex flex-wrap gap-1.5 border-t border-zinc-100">
          {[
            { key: 'todos', label: 'Tudo' },
            { key: 'viral', label: '🔥 Bombou no Lago' },
            { key: 'vitoria', label: '🏆 Vitórias da Cidade' },
            { key: 'evento', label: '🚴 Encontros & Cultura' },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => {
                triggerHaptic('selection');
                setFilter(btn.key as any);
              }}
              className={`px-3.5 py-2 text-sm font-medium rounded-xl border transition-colors ${
                filter === btn.key
                  ? 'bg-zinc-900 text-white border-zinc-900 font-semibold'
                  : 'bg-zinc-50 text-zinc-600 border-zinc-100 hover:border-zinc-400'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recap Cards Stream */}
      <div className="space-y-3.5">
        {filteredItems.map((item) => (
          <article
            key={item.id}
            className="bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:border-zinc-400 transition-colors"
          >
            {/* Visual Media Header */}
            <div className="relative aspect-[16/9] bg-zinc-900 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white bg-black/80 rounded-xl">
                  {item.category === 'viral' && '🔥 Viral'}
                  {item.category === 'vitoria' && '🏆 Vitória Comunitária'}
                  {item.category === 'evento' && '🎉 Movimento'}
                  {item.category === 'destaque' && '⭐ Destaque'}
                </span>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-medium px-2 py-0.5 rounded-xl flex items-center gap-1">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>{item.neighborhood}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-3.5 space-y-2">
              <div className="flex items-center justify-between text-[13px] text-zinc-500">
                <span className="flex items-center gap-1 ">
                  <Calendar className="w-4 h-4" />
                  <span>{item.dateStr}</span>
                </span>
                <button
                  onClick={() => onShare(item)}
                  className="p-1 hover:text-blue-600 transition-colors"
                  title="Compartilhar momento"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-[15px] font-bold text-zinc-900 leading-snug">
                {item.title}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-sans">
                {item.subtitle}
              </p>

              {/* Engagement Reaction Actions */}
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {/* Fire */}
                  <button
                    onClick={() => handleReactionClick(item.id, 'fire')}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 border transition-all ${
                      item.userReaction === 'fire'
                        ? 'bg-orange-50 border-orange-500 text-orange-600 '
                        : 'bg-zinc-50 border-zinc-100 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <span>🔥</span>
                    <span className=" text-[13px]">{item.reactions.fire}</span>
                  </button>

                  {/* Applause */}
                  <button
                    onClick={() => handleReactionClick(item.id, 'applause')}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 border transition-all ${
                      item.userReaction === 'applause'
                        ? 'bg-blue-50 border-blue-600 text-blue-600 '
                        : 'bg-zinc-50 border-zinc-100 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <span>👏</span>
                    <span className=" text-[13px]">{item.reactions.applause}</span>
                  </button>

                  {/* Heart */}
                  <button
                    onClick={() => handleReactionClick(item.id, 'heart')}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 border transition-all ${
                      item.userReaction === 'heart'
                        ? 'bg-red-50 border-red-500 text-red-600 '
                        : 'bg-zinc-50 border-zinc-100 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <span>❤️</span>
                    <span className=" text-[13px]">{item.reactions.heart}</span>
                  </button>
                </div>

                <span className="text-[13px] text-zinc-400">
                  {item.reactions.fire + item.reactions.applause + item.reactions.heart} votos
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Community Invite Box */}
      <div className="bg-zinc-100 border border-zinc-300 rounded-2xl p-4 text-center space-y-2">
        <div className="w-11 h-11 mx-auto bg-white border border-zinc-300 rounded-xl flex items-center justify-center text-zinc-800">
          <Award className="w-5 h-5 text-orange-600" />
        </div>
        <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
          Teve algo no seu bairro que deve aparecer aqui?
        </h4>
        <p className="text-[13px] text-zinc-600 max-w-xs mx-auto">
          Publique uma foto com legenda no feed. Os momentos com maior participação entram na retrospectiva semanal!
        </p>
        <button
          onClick={onOpenComposer}
          className="mt-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors uppercase tracking-wider"
        >
          Enviar meu relato
        </button>
      </div>
    </div>
  );
};
