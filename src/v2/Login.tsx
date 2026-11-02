import React, { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Logo, Photo, haptic } from './ui';
import { FOUNDER_LIMIT, readGrowth } from '../lib/growth';

const GOOGLE_ON = import.meta.env.VITE_GOOGLE_LOGIN === '1';
const GoogleG: React.FC = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
  </svg>
);

const inAppBrowser = /Instagram|FBAN|FBAV|FB_IAB|Line\/|MicroMessenger|TikTok|Snapchat/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : '');

export const Login: React.FC = () => {
  const g = readGrowth();
  const [mode, setMode] = useState<'start' | 'in' | 'up'>('start');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const google = async () => {
    haptic('pop'); setBusy(true); setMsg('');
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + import.meta.env.BASE_URL } });
    if (error) { setBusy(false); setMsg(/provider is not enabled|unsupported provider/i.test(error.message) ? 'O login com Google ainda não foi ligado. Use o e-mail por enquanto.' : 'Não consegui abrir o Google. Tenta o e-mail.'); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); haptic(); setBusy(true); setMsg('');
    try {
      if (mode === 'up') {
        const ref = localStorage.getItem('sobradinho_referred_by_v1') || '';
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password: pass, options: { data: { name: name.trim(), invite: ref } } });
        if (error) throw error;
        if (!data.session) setMsg('Enviamos um e-mail pra confirmar. Abra e toque no link, depois volte aqui.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass });
        if (error) throw error;
      }
    } catch (err: any) {
      const m = String(err?.message || '');
      setMsg(/invalid login/i.test(m) ? 'E-mail ou senha incorretos.' : /already registered/i.test(m) ? 'Esse e-mail já tem conta. Toque em "Já tenho conta".' : /password/i.test(m) ? 'A senha precisa ter pelo menos 6 caracteres.' : /rate limit|too many/i.test(m) ? 'Muitas tentativas. Espera um pouquinho e tenta de novo.' : 'Não deu certo. Confere os dados e tenta de novo.');
    } finally { setBusy(false); }
  };

  const input = 'w-full h-14 px-4 rounded-2xl bg-zinc-100 outline-none text-[17px] font-semibold focus:ring-2 focus:ring-blue-600';

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white flex flex-col" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}>
      <div className="relative">
        <Photo slot="boas-vindas" alt="Sobradinho ao entardecer" className="w-full h-[260px]" fallback={<div className="w-full h-[260px] bg-gradient-to-br from-orange-300 to-blue-700" />} />
        <span className="absolute left-5 -bottom-8 w-16 h-16 rounded-[20px] overflow-hidden shadow-xl ring-4 ring-white"><Logo /></span>
      </div>
      <div className="px-6 pt-12 flex-1 flex flex-col">
        {g.referredBy && <p className="self-start mb-3 h-8 px-3 rounded-full bg-blue-50 text-blue-700 text-[13px] font-bold flex items-center">Você foi convidado pelo código {g.referredBy}</p>}
        <h1 className="text-[34px] leading-[1.05] font-extrabold tracking-tight">Sobradinho,<br />num lugar só.</h1>
        <p className="text-[16px] text-zinc-600 mt-2 leading-snug">Os {FOUNDER_LIMIT} primeiros viram Fundadores, e o número fica pra sempre no perfil.</p>

        {GOOGLE_ON && inAppBrowser && (
          <p className="mt-4 rounded-2xl bg-amber-50 ring-1 ring-amber-200 p-3 text-[14px] leading-snug text-amber-900">
            Você abriu pelo navegador de dentro de outro app. O Google costuma bloquear aqui. Toque nos três pontinhos e escolha <b>Abrir no navegador</b>, ou entre com e-mail.
          </p>
        )}

        <div className="mt-6 space-y-3">
          {mode === 'start' && (
            <>
              {GOOGLE_ON && (
                <button onClick={google} disabled={busy} className="w-full h-14 rounded-2xl bg-white ring-1 ring-zinc-300 shadow-sm text-[17px] font-extrabold flex items-center justify-center gap-3 active:scale-[.98] transition-transform disabled:opacity-60">
                  <GoogleG /> Entrar com Google
                </button>
              )}
              <button onClick={() => { haptic(); setMode('up'); }} className={GOOGLE_ON ? 'w-full h-12 rounded-2xl text-[15px] font-bold text-zinc-600 flex items-center justify-center gap-2 active:bg-zinc-50' : 'w-full h-14 rounded-2xl bg-zinc-950 text-white text-[17px] font-extrabold flex items-center justify-center gap-2 active:scale-[.98]'}><Mail className="w-5 h-5" /> {GOOGLE_ON ? 'Entrar com e-mail' : 'Criar minha conta'}</button>
              {!GOOGLE_ON && <button onClick={() => { haptic(); setMode('in'); }} className="w-full h-12 rounded-2xl text-[15px] font-bold text-zinc-600 active:bg-zinc-50">Já tenho conta</button>}
            </>
          )}
          {mode !== 'start' && (
            <form onSubmit={submit} className="space-y-3">
              {mode === 'up' && <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="Seu nome" autoComplete="name" className={input} required minLength={2} />}
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Seu e-mail" autoComplete="email" className={input} required />
              <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="Senha (mínimo 6)" autoComplete={mode === 'up' ? 'new-password' : 'current-password'} className={input} required minLength={6} />
              <button disabled={busy} className="w-full h-14 rounded-2xl bg-zinc-950 text-white text-[17px] font-extrabold flex items-center justify-center gap-2 active:scale-[.98] disabled:opacity-60">{busy ? 'Aguarde…' : mode === 'up' ? 'Criar minha conta' : 'Entrar'} <ArrowRight className="w-5 h-5" /></button>
              <div className="flex items-center justify-between">
                <button type="button" onClick={() => { setMode(mode === 'up' ? 'in' : 'up'); setMsg(''); }} className="h-11 text-[14px] font-bold text-blue-600">{mode === 'up' ? 'Já tenho conta' : 'Criar conta nova'}</button>
                <button type="button" onClick={() => { setMode('start'); setMsg(''); }} className="h-11 text-[14px] font-semibold text-zinc-500">Voltar</button>
              </div>
            </form>
          )}
          {msg && <p role="alert" className="text-[14px] font-semibold text-red-600 leading-snug">{msg}</p>}
        </div>
        <div className="flex-1" />
        <p className="text-[12px] text-zinc-400 text-center leading-snug pt-6">Ao entrar você concorda com os Termos de uso e a Política de privacidade, que ficam em Perfil &gt; Configurações.</p>
      </div>
    </div>
  );
};
