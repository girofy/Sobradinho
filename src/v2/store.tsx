import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Author, Comment, Listing, Me, Notif, Post, Prefs, Reaction, State } from './types';
import { DEFAULT_PREFS, HOUSE, seedPosts } from './data';

// Estado do app salvo no aparelho. Com Firebase: posts, comentários, votos e notificações vão pro banco.
const KEY = 'so_v2_state';
const VERSION = 1;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

function legacyName(): string {
  try {
    const n = localStorage.getItem('sobradinho_user_name') || localStorage.getItem('sobradinho_username');
    if (n) return JSON.parse(n);
  } catch {}
  return '';
}

export function slugHandle(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9._]/g, '').slice(0, 24);
}

function fresh(): State {
  const now = Date.now();
  const name = legacyName() || 'Morador';
  return {
    version: VERSION,
    me: { id: 'me', name, handle: slugHandle(name) || 'morador', bio: '', hood: 'Centro', whatsapp: '', link: '', joinedAt: now },
    posts: seedPosts(now),
    listings: [],
    notifs: [
      { id: uid('n'), at: now - 60_000, icon: 'system', read: false, text: 'Bem-vindo ao Sobradinho Online! Os 100 primeiros viram Fundadores.' },
      { id: uid('n'), at: now - 50_000, icon: 'badge', read: false, text: 'Complete seu perfil: foto, capa e bio. Perfil completo passa mais confiança.', go: { s: 'edit' } },
      { id: uid('n'), at: now - 40_000, icon: 'event', read: false, text: 'Forró do Vaqueiro vem aí. Chame sua turma e suba no ranking.', go: { s: 'event' } },
    ],
    following: ['h-oficial', 'h-agenda'],
    blocked: [],
    muted: [],
    reports: [],
    daily: {},
    prefs: DEFAULT_PREFS,
    onboarded: false,
  };
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as State;
      if (s.version === VERSION) return { ...fresh(), ...s, prefs: { ...DEFAULT_PREFS, ...s.prefs } };
    }
  } catch {}
  return fresh();
}

function mapComments(list: Comment[], id: string, fn: (c: Comment) => Comment): Comment[] {
  return list.map((c) => (c.id === id ? fn(c) : { ...c, replies: mapComments(c.replies, id, fn) }));
}

export function totalReactions(p: Post): number {
  return Object.values(p.reactions).reduce((a, b) => a + (b || 0), 0);
}
export function countComments(list: Comment[]): number {
  return list.reduce((a, c) => a + 1 + countComments(c.replies), 0);
}

export function timeAgo(at: number, now = Date.now()): string {
  const s = Math.max(1, Math.round((now - at) / 1000));
  if (s < 60) return 'agora';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d} d`;
  return new Date(at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function useStoreValue() {
  const [state, setState] = useState<State>(load);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const say = useCallback((m: string) => {
    setToast(m);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const set = (fn: (s: State) => State) => setState(fn);
  const patchPost = (id: string, fn: (p: Post) => Post) => set((s) => ({ ...s, posts: s.posts.map((p) => (p.id === id ? fn(p) : p)) }));
  const notify = (n: Omit<Notif, 'id' | 'at' | 'read'>) => set((s) => ({ ...s, notifs: [{ ...n, id: uid('n'), at: Date.now(), read: false }, ...s.notifs].slice(0, 60) }));

  const meAuthor: Author = {
    id: 'me', name: state.me.name, handle: state.me.handle, avatar: state.me.avatar, hood: state.me.hood, bio: state.me.bio, color: '#0F172A',
  };
  const authorOf = (id: string): Author => (id === 'me' ? meAuthor : HOUSE.find((h) => h.id === id) ?? { id, name: 'Morador', handle: 'morador', color: '#64748B' });

  const actions = {
    react(postId: string, r: Reaction | null) {
      patchPost(postId, (p) => {
        const reactions = { ...p.reactions };
        if (p.myReaction) reactions[p.myReaction] = Math.max(0, (reactions[p.myReaction] || 0) - 1);
        const next = p.myReaction === r ? null : r;
        if (next) reactions[next] = (reactions[next] || 0) + 1;
        return { ...p, reactions, myReaction: next };
      });
    },
    toggleSave(postId: string) {
      const saved = !state.posts.find((p) => p.id === postId)?.saved;
      patchPost(postId, (p) => ({ ...p, saved }));
      say(saved ? 'Salvo no seu perfil' : 'Removido dos salvos');
    },
    comment(postId: string, text: string, replyTo?: string) {
      const c: Comment = { id: uid('c'), authorId: 'me', text, at: Date.now(), likes: 0, replies: [] };
      patchPost(postId, (p) => ({
        ...p,
        comments: replyTo ? mapComments(p.comments, replyTo, (x) => ({ ...x, replies: [...x.replies, c] })) : [...p.comments, c],
      }));
    },
    likeComment(postId: string, commentId: string) {
      patchPost(postId, (p) => ({ ...p, comments: mapComments(p.comments, commentId, (c) => ({ ...c, liked: !c.liked, likes: c.likes + (c.liked ? -1 : 1) })) }));
    },
    vote(postId: string, optionId: string) {
      patchPost(postId, (p) => {
        if (!p.poll || p.poll.myVote) return p;
        return { ...p, poll: { ...p.poll, myVote: optionId, options: p.poll.options.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o)) } };
      });
    },
    voteDaily(day: string, option: string) {
      set((s) => (s.daily[day] ? s : { ...s, daily: { ...s.daily, [day]: option } }));
    },
    shared(postId: string) {
      patchPost(postId, (p) => ({ ...p, shares: p.shares + 1 }));
    },
    publish(p: Pick<Post, 'text' | 'photo' | 'kind' | 'poll' | 'hood'>) {
      const post: Post = { ...p, id: uid('p'), authorId: 'me', at: Date.now(), reactions: {}, myReaction: null, comments: [], shares: 0 };
      const first = !state.posts.some((x) => x.authorId === 'me');
      set((s) => ({ ...s, posts: [post, ...s.posts] }));
      if (first) notify({ icon: 'badge', text: 'Seu primeiro post está no ar! Compartilhe pra ele ganhar reações.', go: { s: 'post', id: post.id } });
      return post.id;
    },
    deletePost(postId: string) {
      set((s) => ({ ...s, posts: s.posts.filter((p) => p.id !== postId) }));
      say('Post apagado');
    },
    report(postId: string, reason: string) {
      set((s) => ({ ...s, reports: [...s.reports, { postId, reason, at: Date.now() }] }));
      say('Denúncia enviada. A equipe vai analisar.');
    },
    toggleFollow(authorId: string) {
      set((s) => ({ ...s, following: s.following.includes(authorId) ? s.following.filter((x) => x !== authorId) : [...s.following, authorId] }));
    },
    toggleMute(authorId: string) {
      const on = !state.muted.includes(authorId);
      set((s) => ({ ...s, muted: on ? [...s.muted, authorId] : s.muted.filter((x) => x !== authorId) }));
      say(on ? 'Silenciado. Você não verá mais os posts dessa conta.' : 'Conta reativada no seu feed');
    },
    toggleBlock(authorId: string) {
      const on = !state.blocked.includes(authorId);
      set((s) => ({ ...s, blocked: on ? [...s.blocked, authorId] : s.blocked.filter((x) => x !== authorId), following: s.following.filter((x) => x !== authorId) }));
      say(on ? 'Bloqueado' : 'Desbloqueado');
    },
    readNotifs() {
      set((s) => ({ ...s, notifs: s.notifs.map((n) => ({ ...n, read: true })) }));
    },
    updateMe(patch: Partial<Me>) {
      set((s) => ({ ...s, me: { ...s.me, ...patch } }));
    },
    setPref<K extends keyof Prefs>(k: K, v: Prefs[K]) {
      set((s) => ({ ...s, prefs: { ...s.prefs, [k]: v } }));
    },
    addListing(l: Omit<Listing, 'id' | 'at' | 'authorId'>) {
      set((s) => ({ ...s, listings: [{ ...l, id: uid('l'), at: Date.now(), authorId: 'me' }, ...s.listings] }));
      say('Publicado! Compartilhe pra mais gente ver.');
    },
    removeListing(id: string) {
      set((s) => ({ ...s, listings: s.listings.filter((l) => l.id !== id) }));
    },
    finishOnboarding() {
      set((s) => ({ ...s, onboarded: true }));
    },
    resetAll() {
      try { localStorage.removeItem(KEY); } catch {}
      setState(fresh());
    },
    notify,
  };

  return { state, toast, say, authorOf, me: meAuthor, actions };
}

type Store = ReturnType<typeof useStoreValue>;
const Ctx = createContext<Store | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const v = useStoreValue();
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
};

export function useStore(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error('StoreProvider ausente');
  return v;
}

// Seu post recém-publicado (30 min) aparece acima de tudo, como no Instagram: você vê que deu certo.
const isFreshMine = (p: { authorId: string; at: number }) => Number(p.authorId === 'me' && Date.now() - p.at < 30 * 60_000);

export function useVisiblePosts() {
  const { state } = useStore();
  return useMemo(
    () => state.posts
      .filter((p) => !state.blocked.includes(p.authorId) && !state.muted.includes(p.authorId))
      .sort((a, b) => isFreshMine(b) - isFreshMine(a) || Number(!!b.pinned) - Number(!!a.pinned) || b.at - a.at),
    [state.posts, state.blocked, state.muted],
  );
}
