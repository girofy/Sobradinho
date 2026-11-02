import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Author, Comment, Listing, Me, Post, Prefs, Reaction, State } from './types';
import { DEFAULT_PREFS, HOUSE } from './data';
import { supabase } from '../lib/supabase';
import { growthCache } from '../lib/growth';
import { api, loadRemote } from './remote';

// O que fica SÓ no aparelho: preferências e posts salvos. O resto vem do banco (Supabase).
const KEY = 'so_v2_local';
const uid_ = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export function slugHandle(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9._]/g, '').slice(0, 24);
}

function readLocal(): { prefs: Prefs; saved: string[] } {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    return { prefs: { ...DEFAULT_PREFS, ...(raw.prefs || {}) }, saved: Array.isArray(raw.saved) ? raw.saved : [] };
  } catch { return { prefs: DEFAULT_PREFS, saved: [] }; }
}

function empty(): State {
  const l = readLocal();
  return {
    version: 2,
    me: { id: 'me', name: '', handle: '', bio: '', hood: 'Centro', whatsapp: '', link: '', joinedAt: Date.now() },
    posts: [], listings: [], notifs: [], following: [], blocked: [], muted: [], reports: [], daily: {}, people: {},
    prefs: l.prefs, onboarded: true,
  };
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

function useStoreValue(userId: string) {
  const [state, setState] = useState<State>(empty);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const pending = useRef(0);
  const saved = useRef<Set<string>>(new Set(readLocal().saved));

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ prefs: state.prefs, saved: [...saved.current] })); } catch {}
  }, [state.prefs, state.posts]);

  const say = useCallback((m: string) => {
    setToast(m);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const refresh = useCallback(async (quiet = true) => {
    if (pending.current > 0) return;
    try {
      const d = await loadRemote(userId);
      if (pending.current > 0) return;
      growthCache.code = d.growth.code; growthCache.founder = d.growth.founder; growthCache.invited = d.growth.invited;
      growthCache.invitees = d.growth.invitees; growthCache.ranking = d.growth.ranking;
      setState((s) => ({
        ...s, me: d.me, posts: d.posts.map((p) => ({ ...p, saved: saved.current.has(p.id) })), listings: d.listings, notifs: d.notifs,
        following: d.following, blocked: d.blocked, muted: d.muted, daily: d.daily, people: d.people, onboarded: d.onboarded,
      }));
      setFailed(false);
      setReady(true);
      return d;
    } catch (e) {
      console.error('Falha ao carregar', e);
      if (!quiet) { setFailed(true); setReady(true); }
    }
  }, [userId]);

  // Primeira carga + convite pendente (quem entrou pelo Google não passa o código no cadastro).
  useEffect(() => {
    (async () => {
      const d = await refresh(false);
      if (!d) return;
      try {
        const code = localStorage.getItem('sobradinho_referred_by_v1');
        if (code && !d.invitedBy && d.growth.invited === 0 && !localStorage.getItem('so_ref_done_' + userId)) {
          localStorage.setItem('so_ref_done_' + userId, '1');
          if (await api.redeemInvite(code)) await refresh();
        }
      } catch {}
    })();
  }, [refresh, userId]);

  // Atualiza sozinho a cada 30 s e quando você volta pro app.
  useEffect(() => {
    const tick = () => { if (document.visibilityState === 'visible') refresh(); };
    const t = window.setInterval(tick, 30_000);
    document.addEventListener('visibilitychange', tick);
    return () => { window.clearInterval(t); document.removeEventListener('visibilitychange', tick); };
  }, [refresh]);

  const write = async (fn: () => Promise<unknown>, errMsg = 'Não consegui salvar. Tenta de novo.') => {
    pending.current++;
    try { await fn(); } catch (e: any) {
      console.error(e);
      say(e?.code === '23505' ? 'Esse @ já está em uso' : errMsg);
    } finally { pending.current--; }
    refresh();
  };

  const set = (fn: (s: State) => State) => setState(fn);
  const patchPost = (id: string, fn: (p: Post) => Post) => set((s) => ({ ...s, posts: s.posts.map((p) => (p.id === id ? fn(p) : p)) }));

  const meAuthor: Author = {
    id: 'me', name: state.me.name, handle: state.me.handle, avatar: state.me.avatar, hood: state.me.hood, bio: state.me.bio, color: '#0F172A', verified: state.me.verified,
  };
  const authorOf = (id: string): Author => (id === 'me' ? meAuthor : HOUSE.find((h) => h.id === id) ?? state.people[id] ?? { id, name: 'Morador', handle: 'morador', color: '#64748B' });

  const actions = {
    react(postId: string, r: Reaction | null) {
      let next: Reaction | null = null;
      patchPost(postId, (p) => {
        const reactions = { ...p.reactions };
        if (p.myReaction) reactions[p.myReaction] = Math.max(0, (reactions[p.myReaction] || 0) - 1);
        next = p.myReaction === r ? null : r;
        if (next) reactions[next] = (reactions[next] || 0) + 1;
        return { ...p, reactions, myReaction: next };
      });
      write(() => api.react(userId, postId, next));
    },
    toggleSave(postId: string) {
      const on = !saved.current.has(postId);
      if (on) saved.current.add(postId); else saved.current.delete(postId);
      patchPost(postId, (p) => ({ ...p, saved: on }));
      say(on ? 'Salvo no seu perfil' : 'Removido dos salvos');
    },
    comment(postId: string, text: string, replyTo?: string) {
      const c: Comment = { id: uid_('c'), authorId: 'me', text, at: Date.now(), likes: 0, replies: [] };
      patchPost(postId, (p) => ({
        ...p,
        comments: replyTo ? mapComments(p.comments, replyTo, (x) => ({ ...x, replies: [...x.replies, c] })) : [...p.comments, c],
      }));
      write(() => api.comment(userId, postId, text, replyTo), 'Não consegui enviar o comentário.');
    },
    likeComment(postId: string, commentId: string) {
      let on = false;
      patchPost(postId, (p) => ({ ...p, comments: mapComments(p.comments, commentId, (c) => { on = !c.liked; return { ...c, liked: on, likes: c.likes + (on ? 1 : -1) }; }) }));
      write(() => api.likeComment(userId, commentId, on));
    },
    vote(postId: string, optionId: string) {
      patchPost(postId, (p) => {
        if (!p.poll || p.poll.myVote) return p;
        return { ...p, poll: { ...p.poll, myVote: optionId, total: (p.poll.total ?? 0) + 1, options: p.poll.options.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o)) } };
      });
      write(() => api.vote(userId, postId, optionId), 'Não consegui registrar o voto.');
    },
    voteDaily(day: string, option: string) {
      if (state.daily[day]) return;
      set((s) => ({ ...s, daily: { ...s.daily, [day]: option } }));
      write(() => api.voteDaily(userId, day, option), 'Não consegui registrar o voto.');
    },
    shared(postId: string) {
      patchPost(postId, (p) => ({ ...p, shares: p.shares + 1 }));
    },
    publish(p: Pick<Post, 'text' | 'photo' | 'kind' | 'poll' | 'hood'>) {
      const post: Post = { ...p, id: uid_('p'), authorId: 'me', at: Date.now(), reactions: {}, myReaction: null, comments: [], shares: 0 };
      set((s) => ({ ...s, posts: [post, ...s.posts] }));
      write(() => api.publish(userId, p), 'Não consegui publicar. Confere a internet e tenta de novo.');
      return post.id;
    },
    deletePost(postId: string) {
      set((s) => ({ ...s, posts: s.posts.filter((p) => p.id !== postId) }));
      say('Post apagado');
      write(() => api.deletePost(postId));
    },
    report(postId: string, reason: string) {
      set((s) => ({ ...s, reports: [...s.reports, { postId, reason, at: Date.now() }] }));
      say('Denúncia enviada. A equipe vai analisar.');
      write(() => api.report(userId, postId, reason));
    },
    toggleFollow(authorId: string) {
      const on = !state.following.includes(authorId);
      set((s) => ({ ...s, following: on ? [...s.following, authorId] : s.following.filter((x) => x !== authorId) }));
      write(() => api.follow(userId, authorId, on));
    },
    toggleMute(authorId: string) {
      const on = !state.muted.includes(authorId);
      set((s) => ({ ...s, muted: on ? [...s.muted, authorId] : s.muted.filter((x) => x !== authorId) }));
      say(on ? 'Silenciado. Você não verá mais os posts dessa conta.' : 'Conta reativada no seu feed');
      write(() => api.block(userId, authorId, 'mute', on));
    },
    toggleBlock(authorId: string) {
      const on = !state.blocked.includes(authorId);
      set((s) => ({ ...s, blocked: on ? [...s.blocked, authorId] : s.blocked.filter((x) => x !== authorId), following: s.following.filter((x) => x !== authorId) }));
      say(on ? 'Bloqueado' : 'Desbloqueado');
      write(async () => { await api.block(userId, authorId, 'block', on); if (on) await api.follow(userId, authorId, false); });
    },
    readNotifs() {
      if (!state.notifs.some((n) => !n.read)) return;
      set((s) => ({ ...s, notifs: s.notifs.map((n) => ({ ...n, read: true })) }));
      write(() => api.readNotifs(userId));
    },
    updateMe(patch: Partial<Me>) {
      set((s) => ({ ...s, me: { ...s.me, ...patch } }));
      write(() => api.updateProfile(userId, patch), 'Não consegui salvar o perfil.');
    },
    setPref<K extends keyof Prefs>(k: K, v: Prefs[K]) {
      set((s) => ({ ...s, prefs: { ...s.prefs, [k]: v } }));
    },
    addListing(l: Omit<Listing, 'id' | 'at' | 'authorId'>) {
      set((s) => ({ ...s, listings: [{ ...l, id: uid_('l'), at: Date.now(), authorId: 'me' }, ...s.listings] }));
      say('Publicado! Compartilhe pra mais gente ver.');
      write(() => api.addListing(userId, l), 'Não consegui publicar o anúncio.');
    },
    removeListing(id: string) {
      set((s) => ({ ...s, listings: s.listings.filter((l) => l.id !== id) }));
      write(() => api.removeListing(id));
    },
    finishOnboarding() {
      set((s) => ({ ...s, onboarded: true }));
      write(() => api.updateProfile(userId, { onboarded: true }));
    },
    async deleteAccount(): Promise<boolean> {
      try { await api.deleteAccount(); } catch (e) { console.error(e); say('Não consegui excluir agora. Fale com a equipe.'); return false; }
      try { Object.keys(localStorage).filter((k) => k.startsWith('sobradinho_') || k.startsWith('so_')).forEach((k) => localStorage.removeItem(k)); } catch {}
      await supabase.auth.signOut();
      return true;
    },
    async signOut() {
      await supabase.auth.signOut();
    },
  };

  return { state, toast, say, authorOf, me: meAuthor, actions, ready, failed, refresh };
}

type Store = ReturnType<typeof useStoreValue>;
const Ctx = createContext<Store | null>(null);

export const StoreProvider: React.FC<{ userId: string; children: React.ReactNode }> = ({ userId, children }) => {
  const v = useStoreValue(userId);
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
