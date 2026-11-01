// [LAYOUT]: Edge-to-edge social post (estilo Instagram): mídia 100% da largura, sem bordas/cards.
// [ACCENT]: #2563EB (azul) & #EF4444 (curtir)

import React, { useState } from 'react';
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import type { FeedPost } from '../types';

interface PostCardProps {
  post: FeedPost;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onComment: (id: string, text: string) => void;
  onShare: (post: FeedPost) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onSave, onComment, onShare }) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  const commentsTotal = post.comments?.length || post.commentsCount;

  const handleDoubleTap = () => {
    if (!post.isLiked) onLike(post.id);
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 700);
  };

  const handleSendComment = () => {
    if (!commentInput.trim()) return;
    onComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  return (
    <article className="bg-white animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-100 shrink-0 ring-2 ring-blue-500/80 ring-offset-2 ring-offset-white">
            {post.authorAvatar ? (
              <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                {post.authorName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-zinc-900 leading-tight truncate">{post.authorName}</h4>
            <p className="text-xs text-zinc-500 truncate">
              {post.neighborhood} · {post.timeAgo}
            </p>
          </div>
        </div>

        <button
          onClick={() => onShare(post)}
          className="w-11 h-11 -mr-2 flex items-center justify-center rounded-full text-zinc-700 active:bg-zinc-100"
          aria-label="Mais opções"
        >
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* Mídia de ponta a ponta */}
      {post.imageUrl && (
        <div
          onDoubleClick={handleDoubleTap}
          className="relative w-full aspect-[4/5] bg-zinc-100 select-none overflow-hidden"
        >
          <img
            src={post.imageUrl}
            alt={post.imageAlt || 'Registro fotográfico'}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            draggable={false}
          />
          {showHeartBurst && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-heart-pop">
              <Heart className="w-24 h-24 fill-white text-white drop-shadow-lg" />
            </div>
          )}
        </div>
      )}

      {/* Ações: só ícones, alvos de toque grandes */}
      <div className="flex items-center justify-between px-2 pt-1">
        <div className="flex items-center">
          <button
            onClick={() => onLike(post.id)}
            className="w-11 h-11 flex items-center justify-center active:scale-90 transition-transform"
            aria-label="Curtir"
          >
            <Heart className={`w-7 h-7 ${post.isLiked ? 'fill-red-500 text-red-500' : 'text-zinc-900'}`} />
          </button>
          <button
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className="w-11 h-11 flex items-center justify-center active:scale-90 transition-transform"
            aria-label="Comentários"
          >
            <MessageCircle className="w-7 h-7 text-zinc-900" />
          </button>
          <button
            onClick={() => onShare(post)}
            className="w-11 h-11 flex items-center justify-center active:scale-90 transition-transform"
            aria-label="Compartilhar"
          >
            <Send className="w-7 h-7 text-zinc-900" />
          </button>
        </div>
        <button
          onClick={() => onSave(post.id)}
          className="w-11 h-11 flex items-center justify-center active:scale-90 transition-transform"
          aria-label="Salvar"
        >
          <Bookmark className={`w-7 h-7 ${post.isSaved ? 'fill-zinc-900 text-zinc-900' : 'text-zinc-900'}`} />
        </button>
      </div>

      {/* Curtidas, legenda, comentários */}
      <div className="px-4 pb-4 space-y-1">
        <p className="text-sm font-bold text-zinc-900">{post.likesCount} curtidas</p>
        <p className="text-sm text-zinc-900 leading-relaxed">
          <span className="font-bold mr-1.5">{post.authorName}</span>
          {post.content}
        </p>
        {commentsTotal > 0 && !isCommentsOpen && (
          <button onClick={() => setIsCommentsOpen(true)} className="text-sm text-zinc-500 pt-0.5">
            Ver {commentsTotal === 1 ? '1 comentário' : `todos os ${commentsTotal} comentários`}
          </button>
        )}

        {isCommentsOpen && (
          <div className="pt-2 space-y-3 animate-fade-in">
            {post.comments?.map((c) => (
              <p key={c.id} className="text-sm text-zinc-900 leading-snug">
                <span className="font-bold mr-1.5">{c.author}</span>
                {c.content}
                <span className="text-xs text-zinc-400 ml-2">{c.timeAgo}</span>
              </p>
            ))}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                placeholder="Adicione um comentário..."
                className="flex-1 h-11 bg-zinc-100 text-base text-zinc-900 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={handleSendComment}
                disabled={!commentInput.trim()}
                className="h-11 px-2 text-sm font-bold text-blue-600 disabled:opacity-40"
              >
                Enviar
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
