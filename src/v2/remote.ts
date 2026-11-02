// Ponte entre o app e o banco (Supabase). Tudo que fala com o servidor passa por aqui.
import { supabase } from '../lib/supabase';
import type { Author, Comment, Listing, Me, Notif, Post, Reaction } from './types';
import type { Invitee, RankRow } from '../lib/growth';

export const isUuid = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
const ts = (s: string) => new Date(s).getTime();

const PALETTE = ['#2563EB', '#EA580C', '#0F766E', '#7C3AED', '#16A34A', '#BE185D', '#0369A1', '#B45309'];
function colorFor(id: string) { let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) % PALETTE.length; return PALETTE[h]; }

function ok<T>(r: { data: T | null; error: any }): T {
  if (r.error) throw r.error;
  return (r.data ?? ([] as unknown)) as T;
}

export interface Loaded {
  me: Me;
  onboarded: boolean;
  posts: Post[];
  listings: Listing[];
  notifs: Notif[];
  following: string[];
  blocked: string[];
  muted: string[];
  daily: Record<string, string>;
  people: Record<string, Author>;
  growth: { code: string; founder: number | null; invited: number; invitees: Invitee[]; ranking: RankRow[] };
  invitedBy: string | null;
}

export async function loadRemote(uid: string): Promise<Loaded> {
  const [prof, priv, posts, notifs, follows, blocks, listings, myInvites, ranking, daily, myVotes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', uid).single(),
    supabase.from('profile_private').select('whatsapp').eq('user_id', uid).maybeSingle(),
    supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(80),
    supabase.from('notifications').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(60),
    supabase.from('follows').select('target').eq('follower_id', uid),
    supabase.from('blocks').select('target,kind').eq('user_id', uid),
    supabase.from('listings').select('*').order('created_at', { ascending: false }).limit(100),
    supabase.from('invites').select('invited_id,created_at').eq('inviter_id', uid).order('created_at', { ascending: false }),
    supabase.from('invite_ranking').select('*').limit(20),
    supabase.from('daily_votes').select('day,option_text').eq('user_id', uid),
    supabase.from('poll_votes').select('post_id,option_id').eq('user_id', uid),
  ]);
  const p: any = ok(prof as any);
  const postRows: any[] = ok(posts as any);
  const postIds = postRows.map((r) => r.id);

  const [comments, reactions] = postIds.length
    ? await Promise.all([
        supabase.from('comments').select('*').in('post_id', postIds).order('created_at', { ascending: true }).limit(1500),
        supabase.from('reactions').select('post_id,user_id,emoji').in('post_id', postIds).limit(6000),
      ])
    : [{ data: [], error: null }, { data: [], error: null }];
  const commentRows: any[] = ok(comments as any);
  const reactionRows: any[] = ok(reactions as any);
  const commentIds = commentRows.map((c) => c.id);
  const likeRows: any[] = commentIds.length ? ok((await supabase.from('comment_likes').select('comment_id,user_id').in('comment_id', commentIds).limit(6000)) as any) : [];

  const pollPosts = postRows.filter((r) => r.kind === 'poll');
  const pollResults: Record<string, { option_id: string; votes: number | null; total: number; unlocked: boolean }[]> = {};
  await Promise.all(pollPosts.map(async (r) => {
    const res = await supabase.rpc('get_poll_results', { p_post: r.id });
    if (!res.error) pollResults[r.id] = res.data as any;
  }));

  const notifRows: any[] = ok(notifs as any);
  const listingRows: any[] = ok(listings as any);
  const inviteRows: any[] = ok(myInvites as any);
  const rankRows: any[] = ok(ranking as any);

  // moradores citados em qualquer lugar
  const ids = new Set<string>();
  postRows.forEach((r) => r.author_id && ids.add(r.author_id));
  commentRows.forEach((c) => ids.add(c.author_id));
  listingRows.forEach((l) => ids.add(l.owner_id));
  inviteRows.forEach((i) => ids.add(i.invited_id));
  notifRows.forEach((n) => n.actor_id && ids.add(n.actor_id));
  rankRows.forEach((r) => ids.add(r.id));
  const idList = [...ids].filter((x) => x !== uid);
  const people: Record<string, Author> = {};
  if (idList.length) {
    const rows: any[] = ok((await supabase.from('profiles').select('id,name,handle,hood,avatar_url,bio,verified,founder_number').in('id', idList.slice(0, 400))) as any);
    rows.forEach((r) => { people[r.id] = { id: r.id, name: r.name, handle: r.handle, hood: r.hood, avatar: r.avatar_url ?? undefined, bio: r.bio, verified: r.verified, color: colorFor(r.id) }; });
  }
  const who = (id: string) => (id === uid ? 'me' : id);

  const myReact: Record<string, Reaction> = {};
  const counts: Record<string, Partial<Record<Reaction, number>>> = {};
  reactionRows.forEach((r) => {
    const c = (counts[r.post_id] ??= {});
    c[r.emoji as Reaction] = (c[r.emoji as Reaction] || 0) + 1;
    if (r.user_id === uid) myReact[r.post_id] = r.emoji;
  });
  const likeCount: Record<string, number> = {}; const iLiked = new Set<string>();
  likeRows.forEach((l) => { likeCount[l.comment_id] = (likeCount[l.comment_id] || 0) + 1; if (l.user_id === uid) iLiked.add(l.comment_id); });

  const byPost: Record<string, Comment[]> = {};
  const nodes: Record<string, Comment> = {};
  commentRows.forEach((c) => { nodes[c.id] = { id: c.id, authorId: who(c.author_id), text: c.text, at: ts(c.created_at), likes: likeCount[c.id] || 0, liked: iLiked.has(c.id), replies: [] }; });
  commentRows.forEach((c) => {
    const n = nodes[c.id];
    if (c.parent_id && nodes[c.parent_id]) nodes[c.parent_id].replies.push(n);
    else (byPost[c.post_id] ??= []).push(n);
  });

  const myPollVote: Record<string, string> = {};
  (ok(myVotes as any) as any[]).forEach((v) => { myPollVote[v.post_id] = v.option_id; });

  const mappedPosts: Post[] = postRows.map((r) => {
    const post: Post = {
      id: r.id, authorId: r.house_id ?? who(r.author_id), at: ts(r.created_at), text: r.text, kind: r.kind,
      photo: r.photo_url ?? undefined, photoSlot: r.photo_slot ?? undefined, hood: r.hood ?? undefined, pinned: r.pinned,
      reactions: counts[r.id] ?? {}, myReaction: myReact[r.id] ?? null, comments: byPost[r.id] ?? [],
      quickReplies: r.quick_replies?.length ? r.quick_replies : undefined, shares: 0,
    };
    if (r.kind === 'poll' && r.poll) {
      const res = pollResults[r.id] ?? [];
      post.poll = {
        question: r.poll.question, unlockAt: r.poll.unlock_at ?? 20, myVote: myPollVote[r.id], total: res[0]?.total ?? 0,
        options: (r.poll.options as any[]).map((o) => ({ id: o.id, text: o.text, votes: Number(res.find((x) => x.option_id === o.id)?.votes ?? 0) })),
      };
    }
    return post;
  });

  const mappedNotifs: Notif[] = notifRows.map((n) => ({
    id: n.id, at: ts(n.created_at), read: n.read, text: n.text,
    icon: n.type === 'invite' ? 'invite' : n.type === 'reaction' ? 'reaction' : n.type === 'comment' || n.type === 'reply' ? 'comment' : 'system',
    go: n.post_id ? { s: 'post', id: n.post_id } : n.type === 'invite' ? { s: 'user', id: 'me' } : undefined,
  }));

  const mappedListings: Listing[] = listingRows.map((l) => ({
    id: l.id, kind: l.kind, title: l.title, price: l.price, category: l.category, description: l.description,
    photo: l.photo_url ?? undefined, hood: l.hood ?? 'Centro', whatsapp: l.whatsapp, authorId: who(l.owner_id), at: ts(l.created_at),
  }));

  const me: Me = {
    id: 'me', name: p.name, handle: p.handle, bio: p.bio, hood: p.hood, avatar: p.avatar_url ?? undefined, cover: p.cover_url ?? undefined,
    whatsapp: (priv.data as any)?.whatsapp ?? '', link: p.link, joinedAt: ts(p.created_at), verified: p.verified, founderNumber: p.founder_number, inviteCode: p.invite_code,
  };

  return {
    me, onboarded: !!p.onboarded, posts: mappedPosts, listings: mappedListings, notifs: mappedNotifs,
    following: (ok(follows as any) as any[]).map((f) => f.target),
    blocked: (ok(blocks as any) as any[]).filter((b) => b.kind === 'block').map((b) => b.target),
    muted: (ok(blocks as any) as any[]).filter((b) => b.kind === 'mute').map((b) => b.target),
    daily: Object.fromEntries((ok(daily as any) as any[]).map((d) => [d.day, d.option_text])),
    people,
    invitedBy: p.invited_by,
    growth: {
      code: p.invite_code, founder: p.founder_number, invited: inviteRows.length,
      invitees: inviteRows.map((i) => ({ name: people[i.invited_id]?.name ?? 'Morador', at: ts(i.created_at) })),
      ranking: rankRows.map((r) => ({ id: who(r.id), name: r.name, handle: r.handle, hood: r.hood, avatar: r.avatar_url ?? undefined, verified: r.verified, invites: r.invites })),
    },
  };
}

// ---------- Escritas ----------
async function dataUrlToBlob(u: string): Promise<Blob> { return (await fetch(u)).blob(); }

/** Sobe uma foto (data URL já reduzida) pra pasta da pessoa e devolve o link público. */
export async function uploadImage(uid: string, dataUrl: string): Promise<string> {
  if (!dataUrl.startsWith('data:')) return dataUrl;
  const blob = await dataUrlToBlob(dataUrl);
  const ext = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpg';
  const path = `${uid}/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
  const up = await supabase.storage.from('photos').upload(path, blob, { contentType: blob.type, cacheControl: '31536000' });
  if (up.error) throw up.error;
  return supabase.storage.from('photos').getPublicUrl(path).data.publicUrl;
}

const raw = (id: string) => (id === 'me' ? null : id);

export const api = {
  async react(uid: string, postId: string, emoji: Reaction | null) {
    if (!isUuid(postId)) return;
    const r = emoji
      ? await supabase.from('reactions').upsert({ post_id: postId, user_id: uid, emoji }, { onConflict: 'post_id,user_id' })
      : await supabase.from('reactions').delete().eq('post_id', postId).eq('user_id', uid);
    if (r.error) throw r.error;
  },
  async comment(uid: string, postId: string, text: string, parentId?: string) {
    if (!isUuid(postId)) return;
    const r = await supabase.from('comments').insert({ post_id: postId, author_id: uid, text, parent_id: parentId && isUuid(parentId) ? parentId : null });
    if (r.error) throw r.error;
  },
  async likeComment(uid: string, commentId: string, on: boolean) {
    if (!isUuid(commentId)) return;
    const r = on ? await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: uid }) : await supabase.from('comment_likes').delete().eq('comment_id', commentId).eq('user_id', uid);
    if (r.error) throw r.error;
  },
  async vote(uid: string, postId: string, optionId: string) {
    const r = await supabase.from('poll_votes').insert({ post_id: postId, user_id: uid, option_id: optionId });
    if (r.error && r.error.code !== '23505') throw r.error;
  },
  async voteDaily(uid: string, day: string, option: string) {
    const r = await supabase.from('daily_votes').insert({ day, user_id: uid, option_text: option });
    if (r.error && r.error.code !== '23505') throw r.error;
  },
  async publish(uid: string, p: Pick<Post, 'text' | 'photo' | 'kind' | 'poll' | 'hood'>) {
    const photo_url = p.photo ? await uploadImage(uid, p.photo) : null;
    const poll = p.poll ? { question: p.poll.question, unlock_at: p.poll.unlockAt, options: p.poll.options.map((o) => ({ id: o.id, text: o.text })) } : null;
    const r = await supabase.from('posts').insert({ author_id: uid, kind: p.kind === 'event' ? 'post' : p.kind, text: p.text, hood: p.hood ?? null, photo_url, poll }).select('id').single();
    if (r.error) throw r.error;
    return (r.data as any).id as string;
  },
  async deletePost(id: string) { if (!isUuid(id)) return; const r = await supabase.from('posts').delete().eq('id', id); if (r.error) throw r.error; },
  async report(uid: string, postId: string, reason: string) {
    const r = await supabase.from('reports').insert({ reporter_id: uid, post_id: isUuid(postId) ? postId : null, reason: reason.slice(0, 200) });
    if (r.error) throw r.error;
  },
  async follow(uid: string, target: string, on: boolean) {
    const r = on ? await supabase.from('follows').insert({ follower_id: uid, target }) : await supabase.from('follows').delete().eq('follower_id', uid).eq('target', target);
    if (r.error && r.error.code !== '23505') throw r.error;
  },
  async block(uid: string, target: string, kind: 'block' | 'mute', on: boolean) {
    const r = on ? await supabase.from('blocks').insert({ user_id: uid, target, kind }) : await supabase.from('blocks').delete().eq('user_id', uid).eq('target', target).eq('kind', kind);
    if (r.error && r.error.code !== '23505') throw r.error;
  },
  async readNotifs(uid: string) { const r = await supabase.from('notifications').update({ read: true }).eq('user_id', uid).eq('read', false); if (r.error) throw r.error; },
  async updateProfile(uid: string, patch: Partial<Me> & { onboarded?: boolean }) {
    const row: Record<string, unknown> = {};
    if (patch.name !== undefined) row.name = patch.name;
    if (patch.handle !== undefined) row.handle = patch.handle;
    if (patch.bio !== undefined) row.bio = patch.bio;
    if (patch.hood !== undefined) row.hood = patch.hood;
    if (patch.link !== undefined) row.link = patch.link;
    if (patch.onboarded !== undefined) row.onboarded = patch.onboarded;
    if (patch.avatar !== undefined) row.avatar_url = patch.avatar ? await uploadImage(uid, patch.avatar) : null;
    if (patch.cover !== undefined) row.cover_url = patch.cover ? await uploadImage(uid, patch.cover) : null;
    if (Object.keys(row).length) { const r = await supabase.from('profiles').update(row).eq('id', uid); if (r.error) throw r.error; }
    if (patch.whatsapp !== undefined) { const r = await supabase.from('profile_private').update({ whatsapp: patch.whatsapp }).eq('user_id', uid); if (r.error) throw r.error; }
  },
  async addListing(uid: string, l: Omit<Listing, 'id' | 'at' | 'authorId'>) {
    const photo_url = l.photo ? await uploadImage(uid, l.photo) : null;
    const r = await supabase.from('listings').insert({ owner_id: uid, kind: l.kind, title: l.title, price: l.price, category: l.category, description: l.description, hood: l.hood, photo_url, whatsapp: l.whatsapp });
    if (r.error) throw r.error;
  },
  async removeListing(id: string) { if (!isUuid(id)) return; const r = await supabase.from('listings').delete().eq('id', id); if (r.error) throw r.error; },
  async redeemInvite(code: string) { const r = await supabase.rpc('redeem_invite', { p_code: code }); if (r.error) throw r.error; return !!r.data; },
  async deleteAccount() { const r = await supabase.rpc('delete_my_account'); if (r.error) throw r.error; },
  raw,
};
