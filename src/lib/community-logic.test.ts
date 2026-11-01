import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterFeedPosts,
  filterServicesByCategory,
  calculatePollOptionPercentages,
  togglePostLike,
  validateNewPostSubmission,
} from './community-logic.ts';
import type { FeedPost, PollQuestion, ServiceItem } from '../types/community.ts';

const mockPosts: FeedPost[] = [
  {
    id: '1',
    authorName: 'Júlio Cesar',
    authorHandle: 'juliocesar',
    neighborhood: 'Vila São Joaquim',
    timeAgo: 'há 3 d',
    content: 'Uma imagem da nossa cidade',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
    likesCount: 12,
    commentsCount: 2,
    comments: [],
  },
  {
    id: '2',
    authorName: 'Ana Clara',
    authorHandle: 'ana',
    neighborhood: 'Centro',
    timeAgo: 'há 1 d',
    content: 'Novas peças em madeira na feira de artesanato',
    likesCount: 25,
    commentsCount: 4,
    comments: [],
  },
];

test('filterFeedPosts filters by photo/video and search query', () => {
  const photosOnly = filterFeedPosts(mockPosts, 'foto_video');
  assert.equal(photosOnly.length, 1);
  assert.equal(photosOnly[0].id, '1');

  const searched = filterFeedPosts(mockPosts, 'todos', 'madeira');
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, '2');
});

test('calculatePollOptionPercentages calculates whole percentages', () => {
  const poll: PollQuestion = {
    id: 'p1',
    kicker: 'ENQUETE',
    question: 'E se Sobradinho não tivesse a barragem?',
    context: 'Exercício de imaginação',
    totalVotes: 10,
    options: [
      { id: 'opt1', text: 'Trabalho e renda', votes: 3 },
      { id: 'opt2', text: 'Lago e turismo', votes: 7 },
    ],
  };

  const res = calculatePollOptionPercentages(poll);
  assert.equal(res[0].percentage, 30);
  assert.equal(res[1].percentage, 70);
});

test('togglePostLike increments and decrements likes correctly', () => {
  const liked = togglePostLike(mockPosts[0]);
  assert.equal(liked.isLiked, true);
  assert.equal(liked.newCount, 13);

  const unliked = togglePostLike({ ...mockPosts[0], isLiked: true });
  assert.equal(unliked.isLiked, false);
  assert.equal(unliked.newCount, 11);
});

test('validateNewPostSubmission validates minimum content', () => {
  const invalid = validateNewPostSubmission({
    content: 'a',
    authorName: '',
    neighborhood: '',
  });
  assert.equal(invalid.valid, false);

  const valid = validateNewPostSubmission({
    content: 'Bora reunir para um pedal na orla hoje às 18h!',
    authorName: 'Lucas',
    neighborhood: 'Vila São Francisco',
  });
  assert.equal(valid.valid, true);
});
