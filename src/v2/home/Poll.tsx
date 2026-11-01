import React, { useMemo, useState } from 'react';
import { Check, Lock, Share2, MessageCircle, Flame } from 'lucide-react';
import { useNav } from '../nav';
import { useStore } from '../store';
import { DAILY_UNLOCK_AT, dailyFor, todayKey } from '../data';
import { haptic, shareWithCode } from '../ui';
import { voteCard, downloadFile } from '../shareCard';
import { inviteCodeFor } from '../../lib/growth';

interface PollViewProps {
  kicker: string;
  question: string;
  options: { id: string; text: string }[];
  myVote?: string;
  unlockAt: number;
  onVote: (id: string) => void;
  big?: boolean;
  /** Se existir, mostra "Defender meu lado" depois do voto (abre o publicar com o argumento). */
  onDefend?: (mine: string) => void;
}

/** Enquete grande: 1 toque pra votar. O resultado da cidade abre quando atingir X votos (motivo pra chamar gente). */
export const PollView: React.FC<PollViewProps> = ({ kicker, question, options, myVote, unlockAt, onVote, big, onDefend }) => {
  const { me, say } = useStore();
  const [busy, setBusy] = useState(false);
  const mine = options.find((o) => o.id === myVote);

  const shareImage = async () => {
    if (!mine) return;
    setBusy(true);
    haptic('pop');
    try {
      const file = await voteCard({ kicker, question, options: options.map((o) => o.text), mine: mine.text, code: inviteCodeFor(me.name) });
      const ok = await shareWithCode(me.name, `Eu votei: "${mine.text}". ${question}`, say, file);
      if (!ok) { downloadFile(file); say('Imagem salva. Poste no seu status!'); }
    } finally { setBusy(false); }
  };

  const shareText = () => shareWithCode(me.name, `${question}\nEu já votei. Vota aí, o resultado só abre com ${unlockAt} votos!`, say);

  return (
    <div>
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-orange-600">{kicker === 'Treta do dia' ? '🔥 Treta do dia' : kicker}</p>
      <h3 className={`${big ? 'text-[26px] leading-[1.12]' : 'text-[21px] leading-tight'} font-extrabold tracking-tight mt-1.5`}>{question}</h3>
      <div className="mt-4 space-y-2.5">
        {options.map((o) => {
          const picked = o.id === myVote;
          return (
            <button
              key={o.id}
              disabled={!!myVote}
              onClick={() => { haptic('success'); onVote(o.id); }}
              className={`w-full min-h-[56px] px-5 rounded-2xl text-left text-[17px] font-bold flex items-center justify-between transition-all
                ${picked ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-[1.01]' : myVote ? 'bg-zinc-100 text-zinc-400' : 'bg-white ring-1 ring-zinc-200 text-zinc-900 active:scale-[.98] active:bg-zinc-50'}`}
            >
              <span>{o.text}</span>
              {picked && <Check className="w-6 h-6 animate-pop" strokeWidth={3} />}
            </button>
          );
        })}
      </div>

      {myVote && (
        <div className="mt-4 rounded-2xl bg-zinc-950 text-white p-4 animate-pop">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Lock className="w-5 h-5 text-amber-300" /></div>
            <div className="min-w-0">
              <p className="text-[15px] font-extrabold">Voto registrado</p>
              <p className="text-sm text-white/70 leading-snug">O resultado de Sobradinho abre quando {unlockAt} pessoas votarem. Chame gente pra abrir mais rápido.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button onClick={shareImage} disabled={busy} className="h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-zinc-950 font-extrabold text-[15px] flex items-center justify-center gap-2 active:scale-[.98]">
              <Share2 className="w-5 h-5" /> {busy ? 'Gerando…' : 'Pro status'}
            </button>
            <button onClick={shareText} className="h-12 rounded-xl bg-white/10 font-bold text-[15px] flex items-center justify-center gap-2 active:bg-white/20">
              <MessageCircle className="w-5 h-5" /> Chamar
            </button>
          </div>
          {onDefend && mine && (
            <button onClick={() => { haptic(); onDefend(mine.text); }} className="mt-2 w-full h-12 rounded-xl bg-white text-zinc-950 font-extrabold text-[15px] flex items-center justify-center gap-2 active:scale-[.98]">
              <Flame className="w-5 h-5 text-orange-500" /> Defender meu lado no feed
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const DailyQuestion: React.FC = () => {
  const { state, actions } = useStore();
  const { openComposer } = useNav();
  const day = todayKey();
  const q = useMemo(() => dailyFor(day), [day]);
  const options = q.options.map((t, i) => ({ id: `d${i}`, text: t }));
  const myVote = options.find((o) => o.text === state.daily[day])?.id;
  const hoursLeft = 24 - new Date().getHours();

  return (
    <section className="mx-3 mt-3 rounded-[28px] bg-gradient-to-br from-orange-50 via-amber-50 to-white ring-1 ring-orange-100 p-5 shadow-[0_8px_30px_-12px_rgba(234,88,12,.25)]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-extrabold text-zinc-900 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" /> Pergunta do dia</span>
        <span className="text-xs font-semibold text-zinc-500">nova em {hoursLeft} h</span>
      </div>
      <PollView big kicker={q.kicker} question={q.q} options={options} myVote={myVote} unlockAt={DAILY_UNLOCK_AT}
        onVote={(id) => actions.voteDaily(day, options.find((o) => o.id === id)!.text)}
        onDefend={(mine) => openComposer('texto', `${q.kicker}: ${q.q}\nVotei "${mine}" porque `)} />
    </section>
  );
};
