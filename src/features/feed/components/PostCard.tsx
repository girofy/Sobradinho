// [LAYOUT ARCHETYPE]: Edge-to-Edge Swiss Social Post Card
// [RADIUS & BORDERS]: rounded (4px) card, rounded-sm (2px) media/buttons/avatar, border border-zinc-200
// [ACCENT LOGIC]: #2563EB (Royal Blue) & #DC2626 (Red for likes)

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

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onSave,
  onComment,
  onShare,
}) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  const handleDoubleTap = () => {
    if (!post.isLiked) {
      onLike(post.id);
    }
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 700);
  };

  const handleSendComment = () => {
    if (!commentInput.trim()) return;
    onComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  return (
    <article className="bg-white border border-zinc-200 rounded p-3 sm:p-3.5 space-y-2.5 shadow-sm animate-fade-in">
      {/* Post Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
            {post.authorAvatar ? (
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-xs">
                {post.authorName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-zinc-900 leading-tight truncate">
              {post.authorName}
            </h4>
            <div className="text-[10px] text-zinc-500 flex items-center gap-1 font-mono">
              <span className="truncate">{post.neighborhood}</span>
              <span>•</span>
              <span className="shrink-0">{post.timeAgo}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onShare(post)}
          className="p-1 text-zinc-400 hover:text-zinc-700 rounded-sm hover:bg-zinc-100 transition-colors"
          title="Compartilhar relato"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Post Media with Double-tap to Like */}
      {post.imageUrl && (
        <div
          onDoubleClick={handleDoubleTap}
          className="relative rounded-sm overflow-hidden bg-zinc-100 max-h-[360px] w-full border border-zinc-200 cursor-pointer select-none group"
        >
          <img
            src={post.imageUrl}
            alt={post.imageAlt || 'Registro fotográfico'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            loading="lazy"
          />

          {showHeartBurst && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-heart-pop bg-black/10">
              <Heart className="w-16 h-16 fill-white text-white drop-shadow-md" />
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-0.5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center gap-1 text-zinc-700 hover:text-red-600 active:scale-95 transition-all"
            title="Curtir relato"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                post.isLiked ? 'fill-red-600 text-red-600' : 'text-zinc-700'
              }`}
            />
            <span className="text-xs font-mono font-bold text-zinc-800">
              {post.likesCount}
            </span>
          </button>

          <button
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className="flex items-center gap-1 text-zinc-700 hover:text-blue-600 active:scale-95 transition-all"
            title="Ver e adicionar comentários"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-mono font-bold text-zinc-800">
              {post.comments?.length || post.commentsCount}
            </span>
          </button>

          <button
            onClick={() => onShare(post)}
            className="text-zinc-600 hover:text-blue-600 active:scale-95 transition-all p-0.5"
            title="Compartilhar relato"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => onSave(post.id)}
          className="text-zinc-500 hover:text-blue-600 active:scale-95 transition-all p-0.5"
          title="Salvar na sua lista"
        >
          <Bookmark
            className={`w-4 h-4 ${
              post.isSaved ? 'fill-blue-600 text-blue-600' : ''
            }`}
          />
        </button>
      </div>

      {/* Post Text */}
      <div className="text-xs text-zinc-800 leading-relaxed font-sans">
        <strong className="font-bold mr-1 text-zinc-900">{post.authorName}:</strong>
        <span>{post.content}</span>
      </div>

      {/* Comments Drawer */}
      {isCommentsOpen && (
        <div className="pt-2 border-t border-zinc-200 space-y-2 animate-fade-in">
          {post.comments && post.comments.length > 0 && (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {post.comments.map((c) => (
                <div key={c.id} className="text-xs text-zinc-800 bg-zinc-50 border border-zinc-200/80 p-2 rounded-sm">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 mb-0.5 font-mono">
                    <strong className="text-zinc-900 font-semibold">{c.author}</strong>
                    <span>{c.timeAgo}</span>
                  </div>
                  <p className="text-zinc-700 font-sans leading-snug">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-1.5 pt-1">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
              placeholder="Escreva um comentário comunitário..."
              className="flex-1 bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 px-2.5 py-1.5 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
            />
            <button
              onClick={handleSendComment}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-sm text-xs font-bold transition-colors uppercase tracking-wider"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
