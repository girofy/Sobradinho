// [LAYOUT ARCHETYPE]: Citizen Participation & Interactive Poll
// [RADIUS & BORDERS]: rounded-2xl to rounded-full pill buttons
// [ACCENT LOGIC]: #2563EB (Royal Blue) & #F97316 (Solar Orange)

import React, { useState } from 'react';
import {
  BarChart2,
  Check,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Send,
  Share2,
  Sparkles,
  Vote,
} from 'lucide-react';
import type { PollQuestion } from '../types/community';
import { calculatePollOptionPercentages } from '../lib/community-logic';

interface ParticipaViewProps {
  poll: PollQuestion;
  onVote: (optionId: string) => void;
  onSubmitIdea: (ideaText: string) => void;
}

export const ParticipaView: React.FC<ParticipaViewProps> = ({
  poll,
  onVote,
  onSubmitIdea,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(poll.userVotedOptionId || null);
  const [hasConfirmed, setHasConfirmed] = useState<boolean>(Boolean(poll.userVotedOptionId));
  const [ideaInput, setIdeaInput] = useState('');
  const [ideaSubmitted, setIdeaSubmitted] = useState(false);

  const percentages = calculatePollOptionPercentages(poll);

  const handleVoteSubmit = () => {
    if (!selectedOption) return;
    onVote(selectedOption);
    setHasConfirmed(true);
  };

  const handleSendIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaInput.trim()) return;
    onSubmitIdea(ideaInput.trim());
    setIdeaInput('');
    setIdeaSubmitted(true);
    setTimeout(() => setIdeaSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Top Banner Hero */}
      <div className="px-1 space-y-1.5">
        <span className="text-sm font-extrabold uppercase tracking-widest text-blue-600 block">
          PARTICIPA
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          A cidade é de <span className="text-blue-600">quem participa.</span>
        </h1>
        <p className="text-[15px] text-slate-500 font-medium">
          Dê sua opinião nas consultas abertas e colabore com ideias para Sobradinho.
        </p>
      </div>

      {/* Main Enquete Card (exact replica of phone screenshot) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm ">
            <Vote className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              sobradinho.online
            </h3>
            <span className="text-[13px] text-slate-400">
              Consulta Popular Oficial &bull; Sobradinho
            </span>
          </div>
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 block mb-1">
            {poll.kicker}
          </span>
          <h2 className="text-xl font-bold text-slate-900 leading-snug">
            {poll.question}
          </h2>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            {poll.context}
          </p>
        </div>

        {/* Voting Options */}
        <div className="space-y-2.5 pt-1">
          {poll.options.map((option) => {
            const pct = percentages.find((p) => p.id === option.id)?.percentage || 0;
            const isSelected = selectedOption === option.id;

            return (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/60 font-bold text-blue-900 '
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                }`}
              >
                {/* Visual percentage bar fill when voted */}
                {hasConfirmed && (
                  <div
                    className={`absolute top-0 bottom-0 left-0 transition-all duration-500 ${
                      isSelected ? 'bg-blue-100' : 'bg-slate-100'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-3 min-w-0">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <span className="text-[15px] font-medium leading-tight truncate">
                    {option.text}
                  </span>
                </div>

                {hasConfirmed && (
                  <span className="relative z-10 text-sm font-bold text-slate-700 shrink-0">
                    {pct}%
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        {!hasConfirmed ? (
          <button
            onClick={handleVoteSubmit}
            disabled={!selectedOption}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-[15px] transition-all  ${
              selectedOption
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Participar da consulta
          </button>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-2 text-emerald-800 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Seu voto foi registrado com sucesso na edição desta semana!</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-slate-400 pt-1 border-t border-slate-100">
          <span>{poll.totalVotes} votos registrados</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `Consulta Sobradinho Online: ${poll.question}`
              );
              alert('Link copiado!');
            }}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Compartilhar
          </button>
        </div>
      </div>

      {/* Idea Proposal Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-orange-500" />
          <h3 className="text-base font-bold text-slate-900">
            Tem uma ideia para Sobradinho?
          </h3>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed font-sans">
          Proponha melhorias para sua rua, praça ou orla. As sugestões mais votadas entram no radar do Jornal Sobradinho.
        </p>

        <form onSubmit={handleSendIdea} className="space-y-2.5 pt-1">
          <textarea
            rows={3}
            value={ideaInput}
            onChange={(e) => setIdeaInput(e.target.value)}
            placeholder="Ex: Instalação de bebedouros e lixeiras seletivas na caminhada da orla..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-between items-center">
            {ideaSubmitted ? (
              <span className="text-sm text-emerald-600 font-bold">Ideia enviada!</span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-full transition-colors flex items-center gap-1.5"
            >
              <Send className="w-5 h-5" />
              <span>Enviar sugestão</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
