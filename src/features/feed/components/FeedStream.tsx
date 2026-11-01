// [LAYOUT ARCHETYPE]: Tri-Segmented Editorial Feed & Community Stream
// [RADIUS & BORDERS]: rounded (4px) cards, rounded-sm (2px) tabs/buttons, border border-zinc-200
// [ACCENT LOGIC]: #2563EB (Royal Blue) & #FF4400 (Safety Orange)

import React, { useState } from 'react';
import { ChevronRight, Filter, Newspaper, Sparkles, Flame } from 'lucide-react';
import type { FeedPost, FeedSubTab, PollQuestion, PostFilter, RecapItem } from '../types';
import { PostCard } from './PostCard';
import { StoriesBar } from './StoriesBar';
import { InlinePollCard } from './InlinePollCard';
import { PostCardSkeleton } from '../../../components/ui/Skeleton';
import { QueRolouView } from '../../../components/QueRolouView';

interface FeedStreamProps {
  topSlot?: React.ReactNode;
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
  topSlot,
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
    <div className="-mx-3 sm:-mx-4 -my-3">
      {/* Top Segmented Sub-Header Tabs: Para você | Jornal | O que rolou */}
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 sticky top-14 z-20">
        <div className="flex items-center gap-6">
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
                className={`h-12 text-[15px] font-semibold transition-all relative ${
                  isActive ? 'text-zinc-900 font-bold' : 'text-zinc-400'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Filter button if in 'para_voce' */}
        {subTab === 'para_voce' && (
          <div className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center gap-1.5 h-9 px-3 text-sm font-semibold text-zinc-700 rounded-full bg-zinc-100 active:bg-zinc-200 transition-colors"
            >
              <Filter className="w-4 h-4 text-zinc-500" />
              <span>Filtrar</span>
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute top-11 right-0 z-30 bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-1.5 w-52 animate-fade-in">
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
                    className={`w-full text-left px-3 h-11 text-sm rounded-xl transition-colors ${
                      activeFilter === f.key
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-zinc-800 active:bg-zinc-100'
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
          {topSlot}
          <StoriesBar posts={posts} onCreate={onOpenComposer} />

          {/* Compositor rápido */}
          <button
            onClick={onOpenComposer}
            className="w-full bg-white flex items-center gap-3 px-4 h-16 text-left border-b border-zinc-100 active:bg-zinc-50"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-xl font-light">
              +
            </div>
            <span className="flex-1 text-[15px] text-zinc-500 truncate">O que está acontecendo em Sobradinho?</span>
            <span className="h-9 px-4 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center">Publicar</span>
          </button>

          {/* Jornal */}
          <button
            onClick={onOpenJornal}
            className="w-full bg-white flex items-center gap-3 px-4 py-3 text-left border-b-8 border-zinc-100 active:bg-zinc-50"
          >
            <div className="w-14 h-16 bg-zinc-100 rounded-xl overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80"
                alt="Jornal de Sobradinho"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold uppercase tracking-wide text-blue-600 block">Jornal de Sobradinho</span>
              <h3 className="text-[15px] font-bold text-zinc-900 leading-snug line-clamp-2">
                Edição Comunitária Aberta: O novo pulsar do Lago
              </h3>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400 shrink-0" />
          </button>

{/* Refresh Loading Simulation */}
          {isRefreshing && (
            <div>
              <PostCardSkeleton />
              <PostCardSkeleton />
            </div>
          )}

          {/* Posts Stream */}
          {!isRefreshing && (
            <div className="divide-y-8 divide-zinc-100">
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

          <div className="text-center py-8 px-4 text-sm text-zinc-400">
            Você viu tudo por agora. Toque em + e compartilhe o seu!
          </div>
        </>
      )}
    </div>
  );
};
