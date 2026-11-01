import type { FeedPost, PollQuestion, PostFilter, ServiceItem } from '../types/community';

export function filterFeedPosts(
  posts: FeedPost[],
  filter: PostFilter,
  searchQuery = ''
): FeedPost[] {
  let result = [...posts];

  const query = searchQuery.trim().toLowerCase();
  if (query) {
    result = result.filter(
      (p) =>
        p.content.toLowerCase().includes(query) ||
        p.authorName.toLowerCase().includes(query) ||
        p.authorHandle.toLowerCase().includes(query) ||
        p.neighborhood.toLowerCase().includes(query) ||
        (p.title && p.title.toLowerCase().includes(query))
    );
  }

  switch (filter) {
    case 'foto_video':
      return result.filter((p) => Boolean(p.imageUrl));
    case 'em_alta':
      return result.sort((a, b) => b.likesCount - a.likesCount);
    case 'mais_recentes':
    default:
      return result;
  }
}

export function filterServicesByCategory(
  services: ServiceItem[],
  category: string,
  searchQuery = ''
): ServiceItem[] {
  let result = [...services];

  if (category && category !== 'todos') {
    result = result.filter(
      (s) => s.category.toLowerCase() === category.toLowerCase()
    );
  }

  const query = searchQuery.trim().toLowerCase();
  if (query) {
    result = result.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.providerName.toLowerCase().includes(query) ||
        s.neighborhood.toLowerCase().includes(query)
    );
  }

  return result;
}

export function calculatePollOptionPercentages(poll: PollQuestion): {
  id: string;
  percentage: number;
}[] {
  const total = poll.options.reduce((acc, opt) => acc + opt.votes, 0);
  if (total === 0) {
    return poll.options.map((opt) => ({ id: opt.id, percentage: 0 }));
  }
  return poll.options.map((opt) => ({
    id: opt.id,
    percentage: Math.round((opt.votes / total) * 100),
  }));
}

export function togglePostLike(
  post: FeedPost
): { isLiked: boolean; newCount: number } {
  const currentlyLiked = Boolean(post.isLiked);
  return {
    isLiked: !currentlyLiked,
    newCount: currentlyLiked ? Math.max(0, post.likesCount - 1) : post.likesCount + 1,
  };
}

export function validateNewPostSubmission(data: {
  content: string;
  authorName: string;
  neighborhood: string;
}): { valid: boolean; error?: string } {
  if (!data.content || data.content.trim().length < 3) {
    return { valid: false, error: 'O texto da publicação é muito curto.' };
  }
  if (!data.authorName || data.authorName.trim().length < 2) {
    return { valid: false, error: 'Informe seu nome.' };
  }
  if (!data.neighborhood || data.neighborhood.trim().length < 2) {
    return { valid: false, error: 'Selecione seu bairro ou localidade.' };
  }
  return { valid: true };
}
