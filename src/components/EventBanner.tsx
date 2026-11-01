import React, { useMemo, useState } from 'react';
import { CalendarDays, MapPin, Share2, Check, ChevronRight } from 'lucide-react';
import { Sheet } from './ui/Sheet';
import { EventPoster } from './EventPoster';
import { FEATURED_EVENT as E } from '../data/event';
import { inviteCodeFor, inviteLink } from '../lib/growth';
import { useHaptics } from '../hooks/useHaptics';

const KEY = 'sobradinho_event_going_v1';
const read = () => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } };

function when(): string {
  if (!E.date) return 'Data em breve';
  return new Date(E.date).toLocaleString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export const EventBanner: React.FC<{ userName: string; onToast?: (m: string) => void }> = ({ userName, onToast }) => {
  const { triggerHaptic } = useHaptics();
  const [open, setOpen] = useState(false);
  const [going, setGoing] = useState(read);
  const code = useMemo(() => inviteCodeFor(userName), [userName]);

  const toggle = () => {
    triggerHaptic('success');
    const next = !going;
    setGoing(next);
    try { localStorage.setItem(KEY, next ? '1' : '0'); } catch {}
    onToast?.(next ? 'Combinado! Agora chame a galera.' : 'Tirei você da lista.');
  };

  const share = async () => {
    triggerHaptic('medium');
    const text = `${E.title}${E.date ? ' · ' + when() : ''}${E.place ? ' · ' + E.place : ''}. Eu vou. Entra no Sobradinho Online pelo meu código ${code} e vem junto!`;
    const url = inviteLink(code);
    try {
      if (navigator.share) await navigator.share({ title: E.title, text, url });
      else { await navigator.clipboard.writeText(`${text}\n${url}`); onToast?.('Convite copiado! Cole no WhatsApp.'); }
    } catch {}
  };

  return (
    <>
      <button onClick={() => { triggerHaptic('selection'); setOpen(true); }} className="w-full text-left bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-zinc-950 px-4 py-4 flex items-center gap-3 active:brightness-95">
        <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-amber-300 flex items-center justify-center text-2xl shrink-0" aria-hidden="true">🪗</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-wider opacity-70">Em breve em Sobradinho</p>
          <p className="text-lg font-extrabold leading-tight truncate">{E.title}</p>
          <p className="text-sm font-semibold opacity-80 truncate">{going ? '✓ Você vai · ' : ''}{when()}</p>
        </div>
        <ChevronRight className="w-6 h-6 shrink-0" />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title={E.title}>
        {E.posterUrl
          ? <img src={E.posterUrl} alt={`Cartaz ${E.title}`} className="w-full rounded-2xl mb-4" />
          : <div className="mb-4"><EventPoster title={E.title} when={when()} place={E.place ?? 'Local em breve'} /></div>}
        <p className="text-[15px] text-zinc-600">{E.tagline}</p>
        <div className="mt-4 space-y-2 text-[15px] font-semibold text-zinc-900">
          <p className="flex items-center gap-2"><CalendarDays className="w-5 h-5 text-orange-500" /> {when()}</p>
          <p className="flex items-center gap-2"><MapPin className="w-5 h-5 text-orange-500" /> {E.place ?? 'Local em breve'}</p>
        </div>
        <button onClick={toggle} className={`mt-5 w-full h-14 rounded-2xl text-base font-extrabold flex items-center justify-center gap-2 ${going ? 'bg-emerald-100 text-emerald-900' : 'bg-zinc-950 text-white active:bg-zinc-800'}`}>
          {going ? <><Check className="w-5 h-5" /> Eu vou</> : 'Eu vou'}
        </button>
        <button onClick={share} className="mt-3 w-full h-14 rounded-2xl bg-blue-600 text-white text-base font-extrabold flex items-center justify-center gap-2 active:bg-blue-700">
          <Share2 className="w-5 h-5" /> Chamar a galera com meu código
        </button>
        <p className="text-xs text-zinc-500 mt-3 leading-relaxed">Cada amigo que entra pelo seu código conta pro ranking de convites e te aproxima do selo Verificado.</p>
      </Sheet>
    </>
  );
};
