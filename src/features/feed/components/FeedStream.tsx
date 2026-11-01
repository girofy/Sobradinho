// [LAYOUT ARCHETYPE]: Tri-Segmented Editorial Feed & Community Stream
// [RADIUS & BORDERS]: rounded (4px) cards, rounded-sm (2px) tabs/buttons, border border-zinc-200
// [ACCENT LOGIC]: #2563EB (Royal Blue) & #FF4400 (Safety Orange)

import React, { useState } from 'react';
import { ChevronRight, Filter, Newspaper, Sparkles, Flame } from 'lucide-react';
import type { FeedPost, FeedSubTab, PollQuestion, PostFilter, RecapItem } from '../types';
import { PostCard } from './PostCard';
import { InlinePollCard } from './InlinePollCard';
import { PostCardSkeleton } from '../../../components/ui/Skeleton';
import { QueRolouView } from '../../../components/QueRolouView';

interface FeedStreamProps {
  posts: FeedPost[];
  poll: PollQuestion;
  subTab: FeedSubTab;
  onChangeSubTab: (tab: FeedSubTab) => void;
  activeFilter: PostFilter;
  onSelectFilter: (filter: PostFilter) => void;
  isRefreshing: boolean;
  onLikePost: (id: string) => void;
  onSavePost: (id: string) => void;
  onCommentPost: (id: string, text: string) => void;
  onVotePoll: (optionId: string) => void;
  onOpenJornal: () => void;
  onSharePost: (post: FeedPost) => void;
  onSharePoll: () => void;
  recapItems: RecapItem[];
  onReactRecap: (id: string, reactionType: 'fire' | 'applause' | 'heart') => void;
  onShareRecap: (item: RecapItem) => void;
  onOpenComposer: () => void;
}

export const FeedStream: React.FC<FeedStreamProps> = ({
  posts,
  poll,
  subTab,
  onChangeSubTab,
  activeFilter,
  onSelectFilter,
  isRefreshing,
  onLikePost,
  onSavePost,
  onCommentPost,
  onVotePoll,
  onOpenJornal,
  onSharePost,
  onSharePoll,
  recapItems,
  onReactRecap,
  onShareRecap,
  onOpenComposer,
}) => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  return (
    <div className="space-y-3.5">
      {/* Top Segmented Sub-Header Tabs: Para você | Jornal | O que rolou */}
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-1 pt-1 -mt-2 sticky top-14 z-20">
        <div className="flex items-center gap-4 sm:gap-6">
          {[
            { key: 'para_voce', label: 'Para você' },
            { key: 'jornal', label: 'Jornal' },
            { key: 'que_rolou', label: 'O que rolou' },
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
                className={`pb-2.5 text-xs sm:text-sm font-semibold transition-all relative ${
                  isActive ? 'text-blue-600 font-bold' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Filter button if in 'para_voce' */}
        {subTab === 'para_voce' && (
          <div className="relative pb-1">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center gap-1 text-[11px] font-semibold text-zinc-600 hover:text-zinc-900 py-1 px-2 rounded-sm border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-colors"
            >
              <Filter className="w-3 h-3 text-zinc-500" />
              <span>Filtrar</span>
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute top-8 right-0 z-30 bg-white border border-zinc-300 rounded shadow-md p-1 w-44 space-y-0.5 animate-fade-in">
                {[
                  { key: 'todos', label: 'Todos os relatos' },
                  { key: 'foto_video', label: 'Fotos e vídeos' },
                  { key: 'mais_recentes', label: 'Mais recentes' },
                  { key: 'em_alta', label: 'Mais curtidos' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => {
                      onSelectFilter(f.key as PostFilter);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1 text-xs rounded-sm transition-colors ${
                      activeFilter === f.key
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* When 'que_rolou' is selected, render the community recap view */}
      {subTab === 'que_rolou' && (
        <QueRolouView
          items={recapItems}
          onReact={onReactRecap}
          onShare={onShareRecap}
          onOpenComposer={onOpenComposer}
        />
      )}

      {/* When 'para_voce' is selected, render standard feed */}
      {subTab === 'para_voce' && (
        <>
          {/* Quick Publish Feed Trigger */}
          <div
            onClick={onOpenComposer}
            className="w-full bg-white border border-zinc-200 rounded p-2.5 shadow-sm hover:border-blue-500 transition-all cursor-pointer flex items-center justify-between gap-2.5 group"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-7 h-7 rounded-sm bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                +
              </div>
              <span className="text-xs text-zinc-500 truncate group-hover:text-zinc-800 transition-colors">
                O que está acontecendo em Sobradinho hoje?
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenComposer();
              }}
              className="px-2.5 py-1 bg-zinc-900 hover:bg-black text-white text-[11px] font-bold rounded-sm uppercase tracking-wider shrink-0 transition-colors"
            >
              Publicar
            </button>
          </div>

          {/* Jornal Sobradinho Mini-Card / Peek */}
          <button
            onClick={onOpenJornal}
            className="w-full bg-white border border-zinc-200 hover:border-blue-500 p-2.5 sm:p-3 rounded shadow-sm hover:shadow-none transition-all flex items-center justify-between gap-3 text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-14 bg-zinc-100 border border-zinc-300 rounded-sm flex flex-col justify-between p-1 shrink-0 group-hover:border-blue-400 transition-colors">
                <span className="text-[6.5px] font-newspaper font-bold text-zinc-900 leading-tight border-b border-zinc-200 pb-0.5 uppercase">
                  SOBRADINHO
                </span>
                <div className="w-full h-6 bg-zinc-200 rounded-none overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80"
                    alt="Miniatura Jornal"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5 font-mono">
                  JORNAL DE SOBRADINHO
                </span>
                <h3 className="text-xs font-bold text-zinc-900 truncate leading-snug group-hover:text-blue-600 transition-colors">
                  Edição Comunitária Aberta: O novo pulsar do Lago
                </h3>
                <p className="text-[11px] text-zinc-500 truncate">
                  Toque para ler matérias e histórias locais completas
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-sm bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Refresh Loading Simulation */}
          {isRefreshing && (
            <div className="space-y-3">
              <PostCardSkeleton />
              <PostCardSkeleton />
            </div>
          )}

          {/* Posts Stream */}
          {!isRefreshing && (
            <div className="space-y-3.5">
              {posts.map((post, idx) => (
                <React.Fragment key={post.id}>
                  <PostCard
                    post={post}
                    onLike={onLikePost}
                    onSave={onSavePost}
                    onComment={onCommentPost}
                    onShare={onSharePost}
                  />
                  {idx === 0 && (
                    <InlinePollCard
                      poll={poll}
                      onVote={onVotePoll}
                      onShare={onSharePoll}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="text-center py-4 text-xs font-mono text-zinc-400">
            Fim dos relatos do momento. Compartilhe o seu no [+]!
          </div>
        </>
      )}
    </div>
  );
};
