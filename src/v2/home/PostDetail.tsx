import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Heart, X } from 'lucide-react';
import type { Comment } from '../types';
import { countComments, timeAgo, useStore } from '../store';
import { useNav } from '../nav';
import { Avatar, Empty, NameLine, Screen, haptic } from '../ui';
import { PostCard, ReactionSummary } from './PostCard';

const CommentRow: React.FC<{ c: Comment; postId: string; depth: number; onReply: (c: Comment) => void }> = ({ c, postId, depth, onReply }) => {
  const { authorOf, actions } = useStore();
  const { push } = useNav();
  const a = authorOf(c.authorId);
  return (
    <div className={depth ? 'pl-12' : ''}>
      <div className="flex gap-3 px-4 py-3">
        <button onClick={() => push({ s: 'user', id: a.id })} className="self-start"><Avatar a={a} size={depth ? 30 : 38} /></button>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <NameLine a={a} className="text-[15px] font-extrabold" />
            <span className="text-[13px] text-zinc-400 shrink-0">{timeAgo(c.at)}</span>
          </div>
          <p className="text-[15px] leading-snug text-zinc-900 whitespace-pre-line mt-0.5">{c.text}</p>
          <div className="flex items-center gap-4 mt-1.5 text-[13px] font-bold text-zinc-500">
            <button onClick={() => { haptic(); onReply(c); }} className="h-8 active:text-zinc-900">Responder</button>
          </div>
        </div>
        <button onClick={() => { haptic('pop'); actions.likeComment(postId, c.id); }} aria-label="Curtir comentário" className="w-10 flex flex-col items-center pt-1 text-zinc-400">
          <Heart className={`w-[18px] h-[18px] ${c.liked ? 'fill-rose-500 text-rose-500 animate-pop' : ''}`} />
          {c.likes > 0 && <span className="text-xs font-bold mt-0.5">{c.likes}</span>}
        </button>
      </div>
      {c.replies.map((r) => <CommentRow key={r.id} c={r} postId={postId} depth={depth + 1} onReply={() => onReply(c)} />)}
    </div>
  );
};

export const PostDetail: React.FC<{ id: string; focus?: boolean }> = ({ id, focus }) => {
  const { state, actions, me, authorOf } = useStore();
  const { back } = useNav();
  const post = state.posts.find((p) => p.id === id);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (focus) setTimeout(() => input.current?.focus(), 320); }, [focus]);

  if (!post) return <Screen title="Post" onBack={back}><Empty art={null} title="Post não encontrado" text="Ele pode ter sido apagado." /></Screen>;

  const send = (t = text) => {
    const v = t.trim();
    if (!v) return;
    haptic('pop');
    actions.comment(post.id, v, replyTo?.id);
    setText('');
    setReplyTo(null);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
  };
  const reply = (c: Comment) => { setReplyTo(c); input.current?.focus(); };
  const n = countComments(post.comments);

  return (
    <Screen
      title="Post"
      onBack={back}
      footer={
        <div className="shrink-0 border-t border-zinc-100 bg-white px-3 pt-2" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}>
          {replyTo && (
            <div className="flex items-center justify-between text-[13px] text-zinc-500 px-1 pb-1.5">
              <span>Respondendo a <b className="text-zinc-800">@{authorOf(replyTo.authorId).handle}</b></span>
              <button onClick={() => setReplyTo(null)} aria-label="Cancelar resposta" className="w-8 h-8 flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
          )}
          {!text && !replyTo && post.quickReplies?.length ? (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {post.quickReplies.map((q) => <button key={q} onClick={() => send(q)} className="shrink-0 h-9 px-3.5 rounded-full bg-zinc-100 text-[14px] font-semibold active:bg-zinc-200">{q}</button>)}
            </div>
          ) : null}
          <div className="flex items-end gap-2">
            <Avatar a={me} size={36} className="mb-1" />
            <div className="flex-1 min-h-[44px] rounded-[22px] bg-zinc-100 flex items-end pl-4 pr-1 py-1">
              <textarea ref={input} value={text} onChange={(e) => setText(e.target.value)} rows={1} maxLength={600}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder={replyTo ? 'Escreva sua resposta…' : 'Comente algo…'}
                className="flex-1 resize-none bg-transparent outline-none text-[16px] py-2 max-h-28" />
              <button onClick={() => send()} disabled={!text.trim()} aria-label="Enviar" className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:bg-zinc-300 mb-0.5">
                <ArrowUp className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      }
    >
      <PostCard post={post} detail />
      <div className="px-4 pb-3"><ReactionSummary post={post} /></div>
      <div className="h-2 bg-zinc-50 border-y border-zinc-100" />
      <p className="px-4 pt-4 pb-1 text-[15px] font-extrabold">{n ? `${n} ${n === 1 ? 'comentário' : 'comentários'}` : 'Comentários'}</p>
      {n === 0 ? (
        <p className="px-4 pb-10 text-[15px] text-zinc-500">Ninguém comentou ainda. O primeiro comentário é o que mais aparece.</p>
      ) : (
        <div className="pb-6">{post.comments.map((c) => <CommentRow key={c.id} c={c} postId={post.id} depth={0} onReply={reply} />)}</div>
      )}
      <div ref={endRef} />
    </Screen>
  );
};
