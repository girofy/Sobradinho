import React, { useRef, useState } from 'react';
import { Bookmark, MessageCircle, MoreHorizontal, Send, Heart, Flag, VolumeX, Ban, Trash2, Link2, Pin } from 'lucide-react';
import type { Post, Reaction } from '../types';
import { REACTIONS } from '../types';
import { countComments, timeAgo, totalReactions, useStore } from '../store';
import { useNav } from '../nav';
import { Avatar, NameLine, Photo, haptic, shareWithCode } from '../ui';
import { postCard, downloadFile } from '../shareCard';
import { inviteCodeFor } from '../../lib/growth';
import { PollView } from './Poll';
import { EventArt } from '../../components/EventPoster';
import { Sheet } from '../../components/ui/Sheet';

export const ReactionButton: React.FC<{ post: Post; onReact: (r: Reaction | null) => void; size?: 'md' | 'lg' }> = ({ post, onReact, size = 'md' }) => {
  const [open, setOpen] = useState(false);
  const [burst, setBurst] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const long = useRef(false);

  const fire = (r: Reaction | null) => {
    onReact(r);
    if (r && r !== post.myReaction) { setBurst(r); setTimeout(() => setBurst(null), 900); haptic('pop'); }
    setOpen(false);
  };

  return (
    <div className="relative">
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute z-40 bottom-12 -left-2 glass rounded-full shadow-xl ring-1 ring-black/5 px-2 py-1.5 flex gap-0.5 animate-arc">
            {REACTIONS.map((r, i) => (
              <button key={r} onClick={() => fire(r)} aria-label={`Reagir ${r}`} style={{ animationDelay: `${i * 25}ms` }}
                className={`w-11 h-11 text-[26px] rounded-full flex items-center justify-center animate-pop active:scale-125 transition-transform ${post.myReaction === r ? 'bg-orange-100' : ''}`}>{r}</button>
            ))}
          </div>
        </>
      )}
      {burst && <span className="pointer-events-none absolute left-2 -top-2 text-3xl animate-float-up">{burst}</span>}
      <button
        aria-label="Reagir"
        onPointerDown={() => { long.current = false; timer.current = window.setTimeout(() => { long.current = true; haptic('pop'); setOpen(true); }, 380); }}
        onPointerUp={() => { window.clearTimeout(timer.current); if (!long.current) fire(post.myReaction ? null : '❤️'); }}
        onPointerLeave={() => window.clearTimeout(timer.current)}
        onContextMenu={(e) => e.preventDefault()}
        className={`${size === 'lg' ? 'h-12 px-4' : 'h-11 px-3'} -ml-2 rounded-full flex items-center gap-1.5 active:bg-zinc-100 select-none`}
      >
        {post.myReaction ? <span className="text-[24px] leading-none animate-pop">{post.myReaction}</span> : <Heart className="w-[26px] h-[26px]" strokeWidth={2} />}
        {totalReactions(post) > 0 && <span className="text-[15px] font-bold">{totalReactions(post)}</span>}
      </button>
    </div>
  );
};

export const ReactionSummary: React.FC<{ post: Post }> = ({ post }) => {
  const top = (Object.entries(post.reactions) as [Reaction, number][]).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const total = totalReactions(post);
  if (!total) return null;
  const others = total - (post.myReaction ? 1 : 0);
  return (
    <p className="text-sm text-zinc-600 flex items-center gap-1.5">
      <span className="flex -space-x-1">{top.map(([r]) => <span key={r} className="w-6 h-6 rounded-full bg-white ring-2 ring-white flex items-center justify-center text-sm">{r}</span>)}</span>
      {post.myReaction ? (others > 0 ? `Você e mais ${others}` : 'Você reagiu') : `${total} ${total === 1 ? 'reação' : 'reações'}`}
    </p>
  );
};

export const EventInline: React.FC = () => {
  const { push } = useNav();
  return (
    <button onClick={() => push({ s: 'event' })} className="block w-full mt-3 rounded-[24px] overflow-hidden bg-zinc-100 active:scale-[.99] transition-transform">
      <EventArt />
    </button>
  );
};

export const PostMenu: React.FC<{ post: Post; open: boolean; onClose: () => void }> = ({ post, open, onClose }) => {
  const { actions, authorOf, say } = useStore();
  const { back, stack } = useNav();
  const a = authorOf(post.authorId);
  const mine = post.authorId === 'me';
  const [reporting, setReporting] = useState(false);
  const row = (icon: React.ReactNode, label: string, fn: () => void, danger = false) => (
    <button onClick={() => { haptic(); fn(); onClose(); setReporting(false); }} className={`w-full h-14 flex items-center gap-4 px-1 text-[16px] font-semibold active:bg-zinc-50 rounded-xl ${danger ? 'text-red-600' : ''}`}>
      {icon} {label}
    </button>
  );
  const reasons = ['Mentira ou golpe', 'Ofensa ou ódio', 'Expõe alguém sem permissão', 'Conteúdo impróprio', 'Spam'];
  return (
    <Sheet open={open} onClose={() => { onClose(); setReporting(false); }} title={reporting ? 'Por que denunciar?' : 'Opções'}>
      {reporting ? (
        <div>
          <p className="text-sm text-zinc-500 mb-2">Sua denúncia é anônima. A equipe analisa e remove o que quebrar as regras.</p>
          {reasons.map((r) => row(<Flag className="w-5 h-5 text-zinc-400" />, r, () => actions.report(post.id, r)))}
        </div>
      ) : (
        <div className="divide-y divide-zinc-100">
          {row(<Bookmark className="w-5 h-5" />, post.saved ? 'Remover dos salvos' : 'Salvar', () => actions.toggleSave(post.id))}
          {row(<Link2 className="w-5 h-5" />, 'Copiar texto', () => { navigator.clipboard?.writeText(post.text).then(() => say('Texto copiado')); })}
          {!mine && row(<VolumeX className="w-5 h-5" />, `Silenciar @${a.handle}`, () => actions.toggleMute(a.id))}
          {!mine && !a.house && row(<Ban className="w-5 h-5" />, `Bloquear @${a.handle}`, () => actions.toggleBlock(a.id), true)}
          {!mine && <button onClick={() => { haptic(); setReporting(true); }} className="w-full h-14 flex items-center gap-4 px-1 text-[16px] font-semibold text-red-600 active:bg-zinc-50 rounded-xl"><Flag className="w-5 h-5" /> Denunciar post</button>}
          {mine && row(<Trash2 className="w-5 h-5" />, 'Apagar post', () => { actions.deletePost(post.id); if (stack.length) back(); }, true)}
        </div>
      )}
    </Sheet>
  );
};

export const PostCard: React.FC<{ post: Post; detail?: boolean }> = ({ post, detail }) => {
  const { authorOf, actions, me, say } = useStore();
  const { push } = useNav();
  const a = authorOf(post.authorId);
  const [menu, setMenu] = useState(false);
  const [expanded, setExpanded] = useState(detail);
  const nComments = countComments(post.comments);
  const long = post.text.length > 260 || post.text.split('\n').length > 6;
  const last = post.comments[post.comments.length - 1];

  const open = (focus = false) => { if (!detail) push({ s: 'post', id: post.id, focus }); };
  const share = async () => {
    haptic();
    let file: File | undefined;
    try { file = await postCard({ name: a.name, handle: a.handle, text: post.text, photo: post.photo, hood: post.hood, code: inviteCodeFor(me.name) }); } catch { file = undefined; }
    const text = `${a.name} no Sobradinho Online:\n"${post.text.slice(0, 140)}${post.text.length > 140 ? '…' : ''}"`;
    const ok = await shareWithCode(me.name, text, say, file);
    if (ok) actions.shared(post.id);
    else if (file) { downloadFile(file); say('Imagem salva. Poste no seu status!'); }
  };

  return (
    <article className={`bg-white ${detail ? '' : 'border-b border-zinc-100'} pt-4 pb-2`}>
      <header className="px-4 flex items-center gap-3">
        <button onClick={() => push({ s: 'user', id: a.id })} className="shrink-0"><Avatar a={a} size={44} /></button>
        <button onClick={() => push({ s: 'user', id: a.id })} className="flex-1 min-w-0 text-left">
          <NameLine a={a} className="text-[16px] font-extrabold" />
          <p className="text-[13px] text-zinc-500 truncate">@{a.handle}{post.hood ? ` · ${post.hood}` : ''} · {timeAgo(post.at)}</p>
        </button>
        {post.pinned && <Pin className="w-4 h-4 text-orange-500 rotate-45" aria-label="Fixado" />}
        <button onClick={() => { haptic(); setMenu(true); }} aria-label="Opções do post" className="w-11 h-11 -mr-2 rounded-full flex items-center justify-center text-zinc-500 active:bg-zinc-100">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </header>

      <div className="px-4 mt-2.5" onClick={() => open()}>
        {post.text && !(post.kind === 'poll' && post.text === post.poll?.question) && (
          <p className={`text-[16px] leading-[1.5] whitespace-pre-line text-zinc-900 ${!expanded && long ? 'line-clamp-6' : ''}`}>{post.text}</p>
        )}
        {!expanded && long && <button onClick={(e) => { e.stopPropagation(); setExpanded(true); }} className="text-[15px] font-bold text-zinc-500 mt-0.5">ver mais</button>}
      </div>

      {(post.photo || post.photoSlot) && (
        <div className="px-3 mt-3 select-none empty:hidden" onDoubleClick={() => { if (post.myReaction !== '❤️') actions.react(post.id, '❤️'); haptic('pop'); }}>
          <Photo src={post.photo} slot={post.photoSlot} alt={post.text.slice(0, 80)} fallback={null} className="w-full h-auto max-h-[560px] rounded-[24px] bg-zinc-100" />
        </div>
      )}
      {post.kind === 'event' && <div className="px-3"><EventInline /></div>}
      {post.kind === 'poll' && post.poll && (
        <div className="mx-3 mt-3 rounded-[24px] bg-zinc-50 ring-1 ring-zinc-100 p-4">
          <PollView kicker="Enquete" question={post.poll.question} options={post.poll.options} myVote={post.poll.myVote} unlockAt={post.poll.unlockAt} onVote={(id) => actions.vote(post.id, id)} />
        </div>
      )}

      <div className="px-4 mt-1.5 flex items-center">
        <ReactionButton post={post} onReact={(r) => actions.react(post.id, r)} />
        <button onClick={() => open(true)} aria-label="Comentar" className="h-11 px-3 rounded-full flex items-center gap-1.5 active:bg-zinc-100">
          <MessageCircle className="w-[25px] h-[25px]" strokeWidth={2} />
          {nComments > 0 && <span className="text-[15px] font-bold">{nComments}</span>}
        </button>
        <button onClick={share} aria-label="Compartilhar" className="h-11 px-3 rounded-full flex items-center gap-1.5 active:bg-zinc-100">
          <Send className="w-[24px] h-[24px] -rotate-12" strokeWidth={2} />
          {post.shares > 0 && <span className="text-[15px] font-bold">{post.shares}</span>}
        </button>
        <span className="flex-1" />
        <button onClick={() => { haptic(); actions.toggleSave(post.id); }} aria-label={post.saved ? 'Remover dos salvos' : 'Salvar'} className="w-11 h-11 -mr-2 rounded-full flex items-center justify-center active:bg-zinc-100">
          <Bookmark className={`w-[25px] h-[25px] ${post.saved ? 'fill-zinc-900' : ''}`} strokeWidth={2} />
        </button>
      </div>

      {!detail && (
        <div className="px-4 pb-2 space-y-1.5">
          <ReactionSummary post={post} />
          {last ? (
            <button onClick={() => open()} className="block text-left text-[15px] leading-snug">
              <span className="font-bold">{authorOf(last.authorId).name}</span> <span className="text-zinc-700">{last.text}</span>
              {nComments > 1 && <span className="block text-zinc-500 text-sm mt-1">Ver os {nComments} comentários</span>}
            </button>
          ) : post.quickReplies?.length ? (
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pt-1">
              {post.quickReplies.map((q) => (
                <button key={q} onClick={() => { haptic('pop'); actions.comment(post.id, q); say('Comentado!'); }}
                  className="shrink-0 h-9 px-3.5 rounded-full bg-zinc-100 text-[14px] font-semibold text-zinc-800 active:bg-zinc-200">{q}</button>
              ))}
            </div>
          ) : null}
        </div>
      )}
      <PostMenu post={post} open={menu} onClose={() => setMenu(false)} />
    </article>
  );
};
