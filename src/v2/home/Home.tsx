import React from 'react';
import { Bell, Plus, Search } from 'lucide-react';
import { useStore, useVisiblePosts } from '../store';
import { useNav } from '../nav';
import { HOUSE } from '../data';
import { Avatar, Logo, Photo, haptic } from '../ui';
import { DailyQuestion } from './Poll';
import { PostCard } from './PostCard';
import { FEATURED_EVENT } from '../../data/event';

export const Wordmark: React.FC = () => (
  <span className="flex items-center gap-2">
    <span className="w-9 h-9 rounded-[11px] overflow-hidden shadow-sm"><Logo /></span>
    <span className="text-[21px] font-extrabold tracking-tight leading-none">sobradinho<span className="text-blue-600">.</span><span className="text-orange-500">online</span></span>
  </span>
);

export const TopBar: React.FC<{ title?: React.ReactNode; right?: React.ReactNode }> = ({ title, right }) => {
  const { state } = useStore();
  const { push } = useNav();
  const unread = state.notifs.filter((n) => !n.read).length;
  return (
    <header className="sticky top-0 z-30 glass border-b border-black/5" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="h-14 px-3 flex items-center gap-1">
        <div className="flex-1 min-w-0">{title ?? <Wordmark />}</div>
        {right}
        <button onClick={() => { haptic(); push({ s: 'search' }); }} aria-label="Buscar" className="w-11 h-11 rounded-full flex items-center justify-center active:bg-black/5">
          <Search className="w-6 h-6" />
        </button>
        <button onClick={() => { haptic(); push({ s: 'notifs' }); }} aria-label={unread ? `Notificações, ${unread} novas` : 'Notificações'} className="relative w-11 h-11 rounded-full flex items-center justify-center active:bg-black/5">
          <Bell className="w-6 h-6" />
          {unread > 0 && <span className="absolute top-1.5 right-1 min-w-[20px] h-5 px-1 rounded-full bg-orange-500 text-white text-[11px] font-extrabold flex items-center justify-center ring-2 ring-white animate-pop">{unread > 9 ? '9+' : unread}</span>}
        </button>
      </div>
    </header>
  );
};

const Stories: React.FC = () => {
  const { me, state } = useStore();
  const { push, openComposer } = useNav();
  const accounts = [...HOUSE].sort((a, b) => Number(state.following.includes(b.id)) - Number(state.following.includes(a.id)));
  const item = (key: string, onClick: () => void, avatar: React.ReactNode, label: string) => (
    <button key={key} onClick={() => { haptic(); onClick(); }} className="shrink-0 w-[74px] flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
      {avatar}
      <span className="text-[12px] font-semibold text-zinc-700 truncate w-full text-center">{label}</span>
    </button>
  );
  return (
    <div className="flex gap-1 overflow-x-auto no-scrollbar px-2 pt-3 pb-2">
      {item('me', () => openComposer('foto'), (
        <span className="relative">
          <Avatar a={me} size={62} ring="seen" />
          <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-blue-600 text-white ring-[3px] ring-white flex items-center justify-center"><Plus className="w-4 h-4" strokeWidth={3} /></span>
        </span>
      ), 'Seu post')}
      {item('event', () => push({ s: 'event' }), (
        <span className="block rounded-full p-[2.5px] bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500" style={{ width: 68, height: 68 }}>
          <span className="w-full h-full rounded-full bg-zinc-950 ring-2 ring-white flex items-center justify-center text-[30px] overflow-hidden"><Photo slot="forro" alt="" className="w-full h-full" fallback="🪗" /></span>
        </span>
      ), FEATURED_EVENT.title.split(' ')[0])}
      {accounts.map((a) => item(a.id, () => push({ s: 'user', id: a.id }), <Avatar a={a} size={62} ring="story" />, a.name.split(' ')[0]))}
    </div>
  );
};

export const Home: React.FC = () => {
  const posts = useVisiblePosts();
  const { openComposer } = useNav();
  return (
    <div>
      <TopBar />
      <Stories />
      <DailyQuestion />
      <div className="h-3" />
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
      <div className="px-6 py-12 text-center">
        <p className="text-[17px] font-extrabold">Você viu tudo por hoje</p>
        <p className="text-[15px] text-zinc-500 mt-1">A cidade fica mais viva quando você posta. Uma foto do seu bairro já vale.</p>
        <button onClick={() => openComposer('foto')} className="mt-4 h-12 px-6 rounded-full bg-zinc-950 text-white font-extrabold active:scale-[.98]">Postar uma foto</button>
      </div>
    </div>
  );
};
