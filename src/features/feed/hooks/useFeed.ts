import { useState, useEffect } from 'react';
import type { FeedPost, PostFilter } from '../types';
import { INITIAL_FEED_POSTS } from '../../../data/seed-data';
import { filterFeedPosts, togglePostLike } from '../../../lib/community-logic';
import { useHaptics } from '../../../hooks/useHaptics';

export function useFeed() {
  const { triggerHaptic } = useHaptics();
  const [posts, setPosts] = useState<FeedPost[]>(() => {
    try {
      const saved = localStorage.getItem('sobradinho_feed_v2');
      return saved ? JSON.parse(saved) : INITIAL_FEED_POSTS;
    } catch {
      return INITIAL_FEED_POSTS;
    }
  });

  const [activeFilter, setActiveFilter] = useState<PostFilter>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('sobradinho_feed_v2', JSON.stringify(posts));
    } catch {}
  }, [posts]);

  const displayedPosts = filterFeedPosts(posts, activeFilter, searchQuery);

  const handleToggleLike = (postId: string) => {
    triggerHaptic('medium');
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const res = togglePostLike(p);
          return { ...p, isLiked: res.isLiked, likesCount: res.newCount };
        }
        return p;
      })
    );
  };

  const handleToggleSave = (postId: string) => {
    triggerHaptic('selection');
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, isSaved: !p.isSaved };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string, authorName: string) => {
    triggerHaptic('light');
    const newComment = {
      id: `c-${Date.now()}`,
      author: authorName,
      content: text,
      timeAgo: 'agora',
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [newComment, ...p.comments],
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (
    newPost: Omit<FeedPost, 'id' | 'timeAgo' | 'likesCount' | 'commentsCount' | 'comments' | 'isLiked' | 'isSaved'>
  ) => {
    triggerHaptic('success');
    const created: FeedPost = {
      ...newPost,
      id: `post-${Date.now()}`,
      timeAgo: 'agora',
      likesCount: 1,
      commentsCount: 0,
      comments: [],
      isLiked: true,
      isSaved: false,
    };
    setPosts((prev) => [created, ...prev]);
  };

  const handleRefresh = () => {
    triggerHaptic('light');
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerHaptic('success');
    }, 700);
  };

  return {
    posts,
    displayedPosts,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isRefreshing,
    handleRefresh,
    handleToggleLike,
    handleToggleSave,
    handleAddComment,
    handleCreatePost,
  };
}
