import React, { useMemo, useState } from 'react';
import { Bell, Copy, Gift, Heart, MessageCircle, Search as SearchIcon, Share2, Sparkles, UserPlus, Calendar } from 'lucide-react';
import { useStore, timeAgo, useVisiblePosts } from '../store';
import { useNav } from '../nav';
import { HOUSE } from '../data';
import { Avatar, Empty, NameLine, Photo, Screen, haptic, shareWithCode } from '../ui';
import { TopBar } from '../home/Home';
import { PostCard } from '../home/PostCard';
import { FOUNDER_LIMIT, VERIFIED_AT, inviteCodeFor, inviteLink, readGrowth, readInvitees } from '../../lib/growth';
import { HowItWorks } from '../../components/HowItWorks';
import type { Notif } from '../types';

export const InviteHero: React.FC = () => {
  const { me, say } = useStore();
  const [how, setHow] = useState(false);
  const g = readGrowth();
  const code = inviteCodeFor(me.name);
  const pct = Math.min(100, (g.invited / VERIFIED_AT) * 100);
  return (
    <section className="mx-3 mt-3 rounded-[28px] bg-zinc-950 text-white p-5 relative overflow-hidden">
      <Photo slot="pessoas" alt="" fallback={null} className="absolute inset-0 w-full h-full opacity-30" />
      <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-gradient-to-br from-orange-500 to-amber-300 opacity-30 blur-2xl" />
      <div className="relative">
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-300">Chame gente, ganhe selo</p>
      <p className="text-[24px] font-extrabold leading-tight mt-1.5">{g.invited >= VERIFIED_AT ? 'Você é Verificado ✓' : `Faltam ${VERIFIED_AT - g.invited} convites pro selo Verificado`}</p>
      <div className="mt-4 h-2.5 rounded-full bg-white/15 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-300" style={{ width: `${Math.max(4, pct)}%` }} /></div>
      <button onClick={async () => { try { await navigator.clipboard.writeText(inviteLink(code)); say('Link copiado'); } catch { say(code); } }} className="mt-4 w-full h-14 rounded-2xl bg-white/10 px-4 flex items-center justify-between active:bg-white/15">
        <span className="text-[19px] font-extrabold tracking-wider">{code}</span><Copy className="w-5 h-5 text-white/70" />
      </button>
      <div className="grid grid-cols-[1fr_auto] gap-2 mt-2">
        <button onClick={() => { haptic('pop'); shareWithCode(me.name, `Tô no Sobradinho Online, o app da nossa cidade. Os ${FOUNDER_LIMIT} primeiros viram Fundadores.`, say); }} className="h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-zinc-950 font-extrabold text-[17px] flex items-center justify-center gap-2"><Share2 className="w-5 h-5" /> Chamar no WhatsApp</button>
        <button onClick={() => setHow(true)} className="h-14 px-4 rounded-2xl bg-white/10 font-bold">Como?</button>
      </div>
      </div>
      <HowItWorks open={how} onClose={() => setHow(false)} />
    </section>
  );
};

export const People: React.FC = () => {
  const { me, state, actions } = useStore();
  const { push } = useNav();
  const [seg, setSeg] = useState<'ranking' | 'sugestoes' | 'convidados'>('ranking');
  const g = readGrowth();
  const invitees = useMemo(() => readInvitees(), []);
  return (
    <div>
      <TopBar title={<span className="text-[26px] font-extrabold tracking-tight">Pessoas</span>} />
      <InviteHero />
      <div className="mx-3 mt-4 p-1 rounded-full bg-zinc-100 flex">
        {([['ranking', 'Ranking'], ['sugestoes', 'Seguir'], ['convidados', 'Convidados']] as const).map(([k, l]) => (
          <button key={k} onClick={() => { haptic(); setSeg(k); }} className={`flex-1 h-11 rounded-full text-[15px] font-bold transition-all ${seg === k ? 'bg-white shadow text-zinc-950' : 'text-zinc-500'}`}>{l}</button>
        ))}
      </div>

      {seg === 'ranking' && (
        <div className="pt-4 pb-10">
          <p className="px-5 text-[15px] text-zinc-500 leading-snug">O ranking de convites começa agora. Quem chamar mais gente primeiro fica no topo.</p>
          <div className="mt-3">
            <div className="flex items-center gap-3 px-4 min-h-[72px] bg-blue-50">
              <span className="w-8 text-center text-xl font-extrabold text-amber-500">1</span>
              <Avatar a={me} size={46} />
              <div className="flex-1 min-w-0"><p className="text-[16px] font-extrabold truncate">{me.name} (você)</p><p className="text-[13px] text-zinc-500">{state.me.hood}</p></div>
              <span className="text-[17px] font-extrabold text-blue-600">{g.invited}</span>
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 min-h-[64px] border-b border-zinc-50">
                <span className="w-8 text-center text-lg font-extrabold text-zinc-300">{i + 2}</span>
                <span className="w-[46px] h-[46px] rounded-full border-2 border-dashed border-zinc-200" />
                <p className="flex-1 text-[15px] font-semibold text-zinc-300">Vaga aberta</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {seg === 'sugestoes' && (
        <div className="pt-3 pb-10">
          {HOUSE.map((a) => {
            const on = state.following.includes(a.id);
            return (
              <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                <button onClick={() => push({ s: 'user', id: a.id })}><Avatar a={a} size={50} /></button>
                <button onClick={() => push({ s: 'user', id: a.id })} className="flex-1 min-w-0 text-left">
                  <NameLine a={a} className="text-[16px] font-extrabold" />
                  <p className="text-[13px] text-zinc-500 truncate">{a.bio}</p>
                </button>
                <button onClick={() => { haptic(); actions.toggleFollow(a.id); }} className={`h-10 px-4 rounded-full text-[14px] font-extrabold ${on ? 'bg-zinc-100 text-zinc-800' : 'bg-blue-600 text-white'}`}>{on ? 'Seguindo' : 'Seguir'}</button>
              </div>
            );
          })}
          <p className="px-6 pt-6 text-center text-[14px] text-zinc-400">Seus vizinhos aparecem aqui assim que entrarem. Chame os primeiros pelo seu código.</p>
        </div>
      )}

      {seg === 'convidados' && (
        invitees.length ? (
          <div className="pt-3 pb-10">{invitees.map((i) => (
            <div key={i.name + i.at} className="flex items-center gap-3 px-4 py-3">
              <Avatar a={{ id: i.name, name: i.name, handle: '', color: '#2563EB' }} size={46} />
              <p className="flex-1 text-[16px] font-bold">{i.name}</p>
              <span className="text-[13px] text-zinc-400">veio pelo seu código</span>
            </div>
          ))}</div>
        ) : (
          <Empty art={<UserPlus className="w-16 h-16 mx-auto text-zinc-300" />} title="Ninguém ainda" text="Cada pessoa que entrar pelo seu código aparece aqui, com o nome." />
        )
      )}
    </div>
  );
};

// ---------- Notificações ----------
const ICON: Record<Notif['icon'], React.ReactNode> = {
  system: <Sparkles className="w-5 h-5" />, comment: <MessageCircle className="w-5 h-5" />, reaction: <Heart className="w-5 h-5" />,
  invite: <UserPlus className="w-5 h-5" />, event: <Calendar className="w-5 h-5" />, badge: <Gift className="w-5 h-5" />,
};
const COLOR: Record<Notif['icon'], string> = {
  system: 'bg-blue-600', comment: 'bg-sky-500', reaction: 'bg-rose-500', invite: 'bg-emerald-600', event: 'bg-orange-500', badge: 'bg-amber-500',
};

export const Notifications: React.FC = () => {
  const { state, actions } = useStore();
  const { back, push } = useNav();
  const [unreadIds] = useState(() => new Set(state.notifs.filter((n) => !n.read).map((n) => n.id)));
  React.useEffect(() => { actions.readNotifs(); /* marca como lidas ao abrir */ }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const sorted = [...state.notifs].sort((a, b) => b.at - a.at);
  const fresh = sorted.filter((n) => unreadIds.has(n.id));
  const old = sorted.filter((n) => !unreadIds.has(n.id));
  const row = (n: Notif) => (
    <button key={n.id} onClick={() => n.go && push(n.go)} className={`w-full flex items-start gap-3 px-4 py-3.5 text-left ${unreadIds.has(n.id) ? 'bg-blue-50/60' : ''} active:bg-zinc-50`}>
      <span className={`w-11 h-11 rounded-full ${COLOR[n.icon]} text-white flex items-center justify-center shrink-0`}>{ICON[n.icon]}</span>
      <span className="flex-1 min-w-0"><span className="block text-[15px] leading-snug">{n.text}</span><span className="block text-[13px] text-zinc-400 mt-0.5">{timeAgo(n.at)}</span></span>
    </button>
  );
  return (
    <Screen title="Notificações" onBack={back}>
      {state.notifs.length === 0 ? (
        <Empty art={<Bell className="w-16 h-16 mx-auto text-zinc-300" />} title="Tudo em dia" text="Quando alguém reagir, comentar ou entrar pelo seu código, aparece aqui." />
      ) : (
        <>
          {fresh.length > 0 && <><p className="px-4 pt-4 pb-1 text-[13px] font-extrabold uppercase tracking-wider text-zinc-400">Novas</p>{fresh.map(row)}</>}
          {old.length > 0 && <><p className="px-4 pt-4 pb-1 text-[13px] font-extrabold uppercase tracking-wider text-zinc-400">Anteriores</p>{old.map(row)}</>}
        </>
      )}
    </Screen>
  );
};

// ---------- Busca ----------
export const SearchScreen: React.FC = () => {
  const { back, push } = useNav();
  const { state } = useStore();
  const posts = useVisiblePosts();
  const [q, setQ] = useState('');
  const t = q.trim().toLowerCase();
  const accounts = t ? HOUSE.filter((a) => (a.name + a.handle + (a.bio ?? '')).toLowerCase().includes(t)) : HOUSE;
  const foundPosts = t ? posts.filter((p) => p.text.toLowerCase().includes(t)) : [];
  const foundListings = t ? state.listings.filter((l) => (l.title + l.description + l.category).toLowerCase().includes(t)) : [];
  return (
    <Screen bare onBack={back} title="">
      <div className="sticky top-0 bg-white z-10 px-3 py-2 flex items-center gap-2 border-b border-zinc-100" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 8px)' }}>
        <div className="flex-1 h-12 rounded-full bg-zinc-100 flex items-center gap-2 px-4">
          <SearchIcon className="w-5 h-5 text-zinc-400" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar pessoas, posts, serviços" className="flex-1 bg-transparent outline-none text-[16px]" />
        </div>
        <button onClick={back} className="h-12 px-3 font-bold text-[15px]">Cancelar</button>
      </div>
      <p className="px-4 pt-4 pb-1 text-[13px] font-extrabold uppercase tracking-wider text-zinc-400">Contas</p>
      {accounts.map((a) => (
        <button key={a.id} onClick={() => push({ s: 'user', id: a.id })} className="w-full flex items-center gap-3 px-4 py-2.5 text-left active:bg-zinc-50">
          <Avatar a={a} size={44} /><span className="min-w-0"><NameLine a={a} className="text-[15px] font-extrabold" /><span className="block text-[13px] text-zinc-500">@{a.handle}</span></span>
        </button>
      ))}
      {foundListings.length > 0 && <p className="px-4 pt-4 pb-1 text-[13px] font-extrabold uppercase tracking-wider text-zinc-400">Serviços e anúncios</p>}
      {foundListings.map((l) => (
        <button key={l.id} onClick={() => push({ s: 'city', id: l.kind === 'servico' ? 'servicos' : 'classificados' })} className="w-full px-4 py-3 text-left active:bg-zinc-50">
          <p className="text-[15px] font-extrabold">{l.title}</p><p className="text-[13px] text-zinc-500">{l.category} · {l.price}</p>
        </button>
      ))}
      {t && <p className="px-4 pt-4 pb-1 text-[13px] font-extrabold uppercase tracking-wider text-zinc-400">Posts</p>}
      {foundPosts.map((p) => <PostCard key={p.id} post={p} />)}
      {t && !foundPosts.length && !foundListings.length && !accounts.length && <p className="px-4 py-8 text-center text-zinc-500">Nada encontrado pra "{q}".</p>}
      {t && foundPosts.length === 0 && accounts.length > 0 && <p className="px-4 py-3 text-[14px] text-zinc-400">Nenhum post com "{q}" ainda. Que tal postar sobre isso?</p>}
    </Screen>
  );
};

// ---------- Perfil de outra conta ----------
export const UserScreen: React.FC<{ id: string }> = ({ id }) => {
  const { authorOf, state, actions } = useStore();
  const { back } = useNav();
  const posts = useVisiblePosts().filter((p) => p.authorId === id);
  const a = authorOf(id);
  const on = state.following.includes(id);
  const blocked = state.blocked.includes(id);
  return (
    <Screen title={`@${a.handle}`} onBack={back}>
      <div className="h-32" style={{ background: `linear-gradient(135deg, ${a.color}, #F97316)` }} />
      <div className="px-4 -mt-12">
        <div className="w-24 h-24 rounded-full ring-4 ring-white overflow-hidden"><Avatar a={a} size={96} /></div>
        <NameLine a={a} className="text-[24px] font-extrabold mt-3" />
        <p className="text-[15px] text-zinc-500">@{a.handle}</p>
        {a.bio && <p className="text-[16px] mt-2 leading-snug">{a.bio}</p>}
        <p className="text-[14px] text-zinc-500 mt-2"><b className="text-zinc-900">{posts.length}</b> {posts.length === 1 ? 'post' : 'posts'}</p>
        {id !== 'me' && (
          <div className="flex gap-2 mt-4">
            <button onClick={() => { haptic(); actions.toggleFollow(id); }} className={`flex-1 h-12 rounded-2xl font-extrabold ${on ? 'bg-zinc-100' : 'bg-blue-600 text-white'}`}>{on ? 'Seguindo' : 'Seguir'}</button>
            {!a.house && <button onClick={() => actions.toggleBlock(id)} className="h-12 px-4 rounded-2xl bg-zinc-100 font-bold text-red-600">{blocked ? 'Desbloquear' : 'Bloquear'}</button>}
          </div>
        )}
      </div>
      <div className="h-2 bg-zinc-50 border-y border-zinc-100 mt-5" />
      {posts.length ? posts.map((p) => <PostCard key={p.id} post={p} />) : <p className="px-4 py-10 text-center text-zinc-500">Nenhum post ainda.</p>}
    </Screen>
  );
};
