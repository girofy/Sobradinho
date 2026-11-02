import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Auth { session: Session | null; ready: boolean }
const Ctx = createContext<Auth>({ session: null, ready: false });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => { if (alive) { setSession(data.session); setReady(true); } });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => { setSession(s); setReady(true); });
    return () => { alive = false; data.subscription.unsubscribe(); };
  }, []);
  return <Ctx.Provider value={{ session, ready }}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);
