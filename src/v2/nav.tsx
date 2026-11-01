import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { Route, Tab } from './types';

interface Nav {
  tab: Tab;
  setTab: (t: Tab) => void;
  stack: Route[];
  push: (r: Route) => void;
  back: () => void;
  reset: () => void;
  composer: null | { mode: 'texto' | 'foto' | 'enquete'; preset?: string };
  openComposer: (mode?: 'texto' | 'foto' | 'enquete', preset?: string) => void;
  closeComposer: () => void;
}

const Ctx = createContext<Nav | null>(null);

/** Navegação em pilha que respeita o botão voltar do Android (history API). */
export const NavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tab, setTabState] = useState<Tab>('inicio');
  const [stack, setStack] = useState<Route[]>([]);
  const [composer, setComposer] = useState<Nav['composer']>(null);

  const composerRef = useRef(composer);
  composerRef.current = composer;

  useEffect(() => {
    try { history.scrollRestoration = 'manual'; } catch {}
    const onPop = () => {
      if (composerRef.current) setComposer(null);
      else setStack((s) => s.slice(0, -1));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const push = useCallback((r: Route) => {
    history.pushState({ so: true }, '');
    setStack((s) => [...s, r]);
  }, []);
  const back = useCallback(() => history.back(), []);
  const stackRef = useRef(stack);
  stackRef.current = stack;
  const reset = useCallback(() => {
    const n = stackRef.current.length;
    setStack([]);
    if (n) history.go(-n);
  }, []);
  const setTab = useCallback((t: Tab) => {
    setTabState(t);
    window.scrollTo({ top: 0 });
  }, []);
  const openComposer = useCallback((mode: 'texto' | 'foto' | 'enquete' = 'texto', preset?: string) => {
    history.pushState({ so: true }, '');
    setComposer({ mode, preset });
  }, []);
  const closeComposer = useCallback(() => history.back(), []);

  return <Ctx.Provider value={{ tab, setTab, stack, push, back, reset, composer, openComposer, closeComposer }}>{children}</Ctx.Provider>;
};

export function useNav(): Nav {
  const v = useContext(Ctx);
  if (!v) throw new Error('NavProvider ausente');
  return v;
}
