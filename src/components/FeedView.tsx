// [LAYOUT ARCHETYPE]: Clean Mobile Portal & Social Community Stream (White/Clean Air)
// [RADIUS & BORDERS]: rounded-2xl to rounded-full pill system with subtle border-slate-100 / border-slate-200
// [ACCENT LOGIC]: #2563EB (Royal Blue) & #F97316 (Solar Orange)

import React, { useState } from 'react';
import {
  Bookmark,
  Check,
  ChevronRight,
  Filter,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  Sparkles,
  Vote,
} from 'lucide-react';
import type { FeedPost, FeedSubTab, PollQuestion, PostFilter } from '../types/community';
import { calculatePollOptionPercentages, filterFeedPosts } from '../lib/community-logic';

interface FeedViewProps {
  posts: FeedPost[];
  poll: PollQuestion;
  onLikePost: (postId: string) => void;
  onSavePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onVotePoll: (optionId: string) => void;
  onOpenJornal: () => void;
  onSharePost: (post: FeedPost) => void;
  subTab: FeedSubTab;
  onChangeSubTab: (tab: FeedSubTab) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  poll,
  onLikePost,
  onSavePost,
  onAddComment,
  onVotePoll,
  onOpenJornal,
  onSharePost,
  subTab,
  onChangeSubTab,
}) => {
  const [activeFilter, setActiveFilter] = useState<PostFilter>('todos');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const displayedPosts = filterFeedPosts(posts, activeFilter);
  const pollPercentages = calculatePollOptionPercentages(poll);

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    onAddComment(postId, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="space-y-4">
      {/* Top Segmented Sub-Header Tabs */}
      <div className="flex items-center justify-start border-b border-slate-200/80 bg-white px-2 pt-1 gap-6 -mt-2 sticky top-14 z-20">
        {[
          { key: 'para_voce', label: 'Para você' },
          { key: 'jornal', label: 'Jornal' },
          { key: 'roles', label: 'Rolês' },
        ].map((tab) => {
          const isActive = subTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                if (tab.key === 'jornal') {
                  onOpenJornal();
                } else {
                  onChangeSubTab(tab.key as FeedSubTab);
                }
              }}
              className={`pb-2.5 text-sm font-semibold transition-all relative ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Jornal Sobradinho Mini-Card / Peek */}
      <button
        onClick={onOpenJornal}
        className="w-full bg-white border border-slate-100 hover:border-blue-200 p-3.5 rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-between gap-3 text-left group"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Newspaper 3D Mini Thumbnail */}
          <div className="w-14 h-16 bg-amber-50 border border-slate-200 shadow-sm rounded-lg flex flex-col justify-between p-1.5 shrink-0 rotate-[-1deg] group-hover:rotate-0 transition-transform">
            <span className="text-[7px] font-newspaper font-bold text-slate-800 leading-tight border-b border-slate-200 pb-0.5">
              JORNAL SOBRADINHO
            </span>
            <div className="w-full h-7 bg-amber-200/60 rounded overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80"
                alt="Mini"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
              JORNAL SOBRADINHO
            </span>
            <h3 className="text-sm font-bold text-slate-900 truncate leading-snug group-hover:text-blue-600 transition-colors">
              Uma imagem da nossa cidade
            </h3>
            <p className="text-xs text-slate-500 truncate">
              Abra a edição da comunidade
            </p>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>

      {/* Filter Selector Button & Dropdown */}
      <div className="flex items-center justify-end px-1 relative">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors py-1 px-2 rounded-full hover:bg-slate-100"
        >
          <Filter className="w-3.5 h-3.5 text-slate-600" />
          <span>Filtrar</span>
        </button>

        {isFilterOpen && (
          <div className="absolute top-8 right-0 z-30 bg-white border border-slate-200 rounded-2xl shadow-lg p-1.5 w-44 space-y-1">
            {[
              { key: 'todos', label: 'Todos os relatos' },
              { key: 'foto_video', label: 'Foto e vídeo' },
              { key: 'mais_recentes', label: 'Mais recentes' },
              { key: 'em_alta', label: 'Em alta' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  setActiveFilter(f.key as PostFilter);
                  setIsFilterOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs rounded-xl font-medium transition-colors ${
                  activeFilter === f.key
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Posts Stream */}
      <div className="space-y-4">
        {displayedPosts.map((post, idx) => (
          <React.Fragment key={post.id}>
            {/* Feed Card */}
            <article className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-100">
                    {post.authorAvatar ? (
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm">
                        {post.authorName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {post.authorHandle || post.authorName}
                    </h4>
                    <span className="text-xs text-slate-400 block">
                      {post.neighborhood} &bull; {post.timeAgo}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSharePost(post)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Post Image */}
              {post.imageUrl && (
                <div className="rounded-2xl overflow-hidden bg-slate-100 max-h-[380px] w-full border border-slate-100">
                  <img
                    src={post.imageUrl}
                    alt={post.imageAlt || 'Foto da cidade'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Action Icons */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-4">
                  {/* Like Button */}
                  <button
                    onClick={() => onLikePost(post.id)}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-red-500 transition-colors group"
                  >
                    <Heart
                      className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                        post.isLiked ? 'fill-red-500 text-red-500' : 'text-slate-600'
                      }`}
                    />
                    <span className="text-xs font-semibold text-slate-600">
                      {post.likesCount}
                    </span>
                  </button>

                  {/* Comment Button */}
                  <button
                    onClick={() =>
                      setActiveCommentPostId(
                        activeCommentPostId === post.id ? null : post.id
                      )
                    }
                    className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-xs font-semibold text-slate-600">
                      {post.comments.length || post.commentsCount}
                    </span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => onSharePost(post)}
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={() => onSavePost(post.id)}
                  className="text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <Bookmark
                    className={`w-5 h-5 ${
                      post.isSaved ? 'fill-blue-600 text-blue-600' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Caption */}
              <div className="text-sm text-slate-800 leading-relaxed font-sans pt-0.5">
                <strong className="font-bold mr-1.5">{post.authorHandle || post.authorName}</strong>
                <span>{post.content}</span>
              </div>

              {/* Comments Accordion */}
              {activeCommentPostId === post.id && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  {post.comments.map((c) => (
                    <div key={c.id} className="text-xs text-slate-700 bg-slate-50 p-2 rounded-xl">
                      <strong className="text-slate-900 block font-semibold">{c.author}</strong>
                      <p className="mt-0.5">{c.content}</p>
                    </div>
                  ))}

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                      placeholder="Deixe um comentário..."
                      className="flex-1 bg-slate-100 border-none text-xs text-slate-800 px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleSendComment(post.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}
            </article>

            {/* Inline Editorial Poll after the 1st post (as shown in reference screenshot) */}
            {idx === 0 && (
              <div className="bg-white border border-blue-100 rounded-3xl p-5 shadow-sm space-y-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    SO
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      sobradinho.online
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Pergunta da redação &bull; Independente
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold tracking-wider text-orange-600 uppercase block mb-1">
                    {poll.kicker}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {poll.question}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {poll.context}
                  </p>
                </div>

                {/* Poll Options */}
                <div className="space-y-2 pt-1">
                  {poll.options.map((option) => {
                    const pct = pollPercentages.find((p) => p.id === option.id)?.percentage || 0;
                    const isSelected = poll.userVotedOptionId === option.id;

                    return (
                      <button
                        key={option.id}
                        onClick={() => onVotePoll(option.id)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all relative overflow-hidden flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/50 font-bold text-blue-900'
                            : 'border-slate-200 hover:border-blue-300 bg-white text-slate-800'
                        }`}
                      >
                        {/* Background vote percentage fill */}
                        {poll.userVotedOptionId && (
                          <div
                            className={`absolute top-0 bottom-0 left-0 transition-all duration-500 ${
                              isSelected ? 'bg-blue-100' : 'bg-slate-100'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        )}

                        <div className="relative z-10 flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className="text-xs">{option.text}</span>
                        </div>

                        {poll.userVotedOptionId && (
                          <span className="relative z-10 text-xs font-bold text-slate-700">
                            {pct}%
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>{poll.totalVotes} votos &bull; uma escolha por aparelho</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `Pergunta da Redação Sobradinho Online: ${poll.question}`
                      );
                      alert('Link da pergunta copiado!');
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Compartilhar esta pergunta
                  </button>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* End of Feed indicator */}
      <div className="text-center py-6 text-xs text-slate-400 font-medium">
        Você viu as publicações disponíveis.
      </div>
    </div>
  );
};
