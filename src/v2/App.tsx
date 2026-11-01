import React, { useEffect } from 'react';
import { Home as HomeIcon, LayoutGrid, Plus, Users } from 'lucide-react';
import { StoreProvider, useStore } from './store';
import { NavProvider, useNav } from './nav';
import type { Route, Tab } from './types';
import { Avatar, haptic } from './ui';
import { Home } from './home/Home';
import { PostDetail } from './home/PostDetail';
import { Composer } from './compose/Composer';
import { Agenda, Antigamente, City, Consulta, EventScreen, Listings, Utility } from './city/City';
import { Notifications, People, SearchScreen, UserScreen } from './people/People';
import { Profile, EditProfile } from './profile/Profile';
import { Settings, SettingsSection } from './profile/Settings';
import { captureReferral } from '../lib/growth';
import { Onboarding } from './Onboarding';

const RouteView: React.FC<{ r: Route }> = ({ r }) => {
  switch (r.s) {
    case 'post': return <PostDetail id={r.id} focus={r.focus} />;
    case 'notifs': return <Notifications />;
    case 'search': return <SearchScreen />;
    case 'user': return r.id === 'me' ? <MeRedirect /> : <UserScreen id={r.id} />;
    case 'event': return <EventScreen />;
    case 'edit': return <EditProfile />;
    case 'settings': return <Settings />;
    case 'settings-section': return <SettingsSection id={r.id} />;
    case 'city':
      if (r.id === 'servicos') return <Listings kind="servico" />;
      if (r.id === 'classificados') return <Listings kind="classificado" />;
      if (r.id === 'agenda') return <Agenda />;
      if (r.id === 'utilidade') return <Utility />;
      if (r.id === 'antigamente') return <Antigamente />;
      return <Consulta />;
  }
};

// Tocar no próprio nome leva à aba Perfil.
const MeRedirect: React.FC = () => {
  const { back, setTab } = useNav();
  useEffect(() => { back(); setTab('perfil'); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
};

const BottomNav: React.FC = () => {
  const { tab, setTab, openComposer } = useNav();
  const { me } = useStore();
  const item = (t: Tab, label: string, icon: React.ReactNode) => {
    const on = tab === t;
    return (
      <button onClick={() => { haptic(); if (on) window.scrollTo({ top: 0, behavior: 'smooth' }); else setTab(t); }} aria-label={label} aria-current={on ? 'page' : undefined}
        className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 ${on ? 'text-zinc-950' : 'text-zinc-400'}`}>
        {icon}
        <span className={`text-[11px] ${on ? 'font-extrabold' : 'font-semibold'}`}>{label}</span>
      </button>
    );
  };
  return (
    <nav className="fixed z-30 left-1/2 -translate-x-1/2 w-[calc(100%-20px)] max-w-[430px] h-[68px] rounded-[26px] glass shadow-[0_10px_40px_-10px_rgba(0,0,0,.25)] ring-1 ring-black/5 flex items-center px-1"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)' }}>
      {item('inicio', 'Início', <HomeIcon className="w-[25px] h-[25px]" strokeWidth={tab === 'inicio' ? 2.6 : 2} />)}
      {item('cidade', 'Cidade', <LayoutGrid className="w-[25px] h-[25px]" strokeWidth={tab === 'cidade' ? 2.6 : 2} />)}
      <div className="flex-1 flex justify-center">
        <button onClick={() => { haptic('pop'); openComposer('texto'); }} aria-label="Publicar"
          className="w-[54px] h-[54px] -mt-1 rounded-[20px] bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/40 flex items-center justify-center active:scale-90 transition-transform">
          <Plus className="w-7 h-7" strokeWidth={3} />
        </button>
      </div>
      {item('pessoas', 'Pessoas', <Users className="w-[25px] h-[25px]" strokeWidth={tab === 'pessoas' ? 2.6 : 2} />)}
      {item('perfil', 'Perfil', <span className={`rounded-full ${tab === 'perfil' ? 'ring-2 ring-zinc-950 ring-offset-1' : ''}`}><Avatar a={me} size={25} /></span>)}
    </nav>
  );
};

const Toast: React.FC = () => {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div className="fixed z-[70] left-1/2 -translate-x-1/2 top-3 max-w-[92vw] px-5 py-3 rounded-2xl bg-zinc-950/90 text-white text-[15px] font-semibold shadow-xl animate-pop text-center"
      style={{ marginTop: 'env(safe-area-inset-top, 0px)' }} role="status">{toast}</div>
  );
};

const Shell: React.FC = () => {
  const { tab, stack } = useNav();
  const { say, state } = useStore();
  useEffect(() => {
    const code = captureReferral();
    if (code && state.onboarded) say(`Você entrou pelo convite ${code}. Bem-vindo!`);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="min-h-screen bg-white max-w-md mx-auto relative">
      <main style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 96px)' }}>
        {tab === 'inicio' && <Home />}
        {tab === 'cidade' && <City />}
        {tab === 'pessoas' && <People />}
        {tab === 'perfil' && <Profile />}
      </main>
      <BottomNav />
      {stack.map((r, i) => <RouteView key={i} r={r} />)}
      <Composer />
      {!state.onboarded && <Onboarding />}
      <Toast />
    </div>
  );
};

export default function AppV2() {
  return (
    <StoreProvider>
      <NavProvider>
        <Shell />
      </NavProvider>
    </StoreProvider>
  );
}
