// [LAYOUT ARCHETYPE]: Civic Consultation & Polling Card
// [RADIUS & BORDERS]: rounded (4px) card container, rounded-sm (2px) poll options/chips, border border-zinc-200
// [ACCENT LOGIC]: #2563EB (Royal Blue) & #FF4400 (Safety Orange for Kicker)

import React from 'react';
import { Check } from 'lucide-react';
import type { PollQuestion } from '../types';
import { calculatePollOptionPercentages } from '../../../lib/community-logic';
import { useHaptics } from '../../../hooks/useHaptics';

interface InlinePollCardProps {
  poll: PollQuestion;
  onVote: (optionId: string) => void;
  onShare: () => void;
}

export const InlinePollCard: React.FC<InlinePollCardProps> = ({
  poll,
  onVote,
  onShare,
}) => {
  const { triggerHaptic } = useHaptics();
  const percentages = calculatePollOptionPercentages(poll);

  const handleSelect = (optionId: string) => {
    triggerHaptic('medium');
    onVote(optionId);
  };

  return (
    <div className="bg-white border border-zinc-200 rounded p-3.5 sm:p-4 shadow-sm space-y-3 animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-sm bg-blue-600 text-white flex items-center justify-center font-bold font-mono text-xs shadow-sm">
          SO
        </div>
        <div>
          <h4 className="text-xs font-bold text-zinc-900 leading-tight">
            Consulta Popular Sobradinho
          </h4>
          <span className="text-[10px] text-zinc-500 font-mono">
            Pergunta semanal da comunidade
          </span>
        </div>
      </div>

      <div>
        <span className="text-[10px] font-bold tracking-wider text-orange-600 uppercase font-mono block mb-0.5">
          {poll.kicker}
        </span>
        <h3 className="text-sm font-bold text-zinc-900 leading-snug">
          {poll.question}
        </h3>
        <p className="text-xs text-zinc-600 mt-1 leading-relaxed font-sans">
          {poll.context}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-1.5 pt-0.5">
        {poll.options.map((option) => {
          const pct = percentages.find((p) => p.id === option.id)?.percentage || 0;
          const isSelected = poll.userVotedOptionId === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`w-full text-left p-2.5 rounded-sm border transition-all relative overflow-hidden flex items-center justify-between gap-2 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 font-bold text-blue-900'
                  : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50 text-zinc-800'
              }`}
            >
              {poll.userVotedOptionId && (
                <div
                  className={`absolute top-0 bottom-0 left-0 transition-all duration-500 ${
                    isSelected ? 'bg-blue-100' : 'bg-zinc-200/60'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              )}

              <div className="relative z-10 flex items-center gap-2 min-w-0">
                <div
                  className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-zinc-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span className="text-xs truncate">{option.text}</span>
              </div>

              {poll.userVotedOptionId && (
                <span className="relative z-10 text-xs font-mono font-bold text-zinc-700 shrink-0">
                  {pct}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-100 font-mono">
        <span>{poll.totalVotes} votos registrados</span>
        <button
          onClick={onShare}
          className="text-blue-600 hover:text-blue-700 font-bold uppercase tracking-wider transition-colors"
        >
          Compartilhar
        </button>
      </div>
    </div>
  );
};
