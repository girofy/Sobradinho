import React, { useState } from 'react';
import { ArrowRight, Heart, Share2, Check } from 'lucide-react';
import { slugHandle, useStore } from './store';
import { HOODS } from './data';
import { Photo, haptic } from './ui';
import { FOUNDER_LIMIT, readGrowth } from '../lib/growth';
import { Seal } from '../components/ui/Seals';

const CityArt: React.FC = () => (
  <svg viewBox="0 0 390 300" className="w-full" aria-hidden="true">
    <defs>
      <linearGradient id="ob-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFEDD5" /><stop offset="1" stopColor="#FDBA74" /></linearGradient>
      <linearGradient id="ob-lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2563EB" /><stop offset="1" stopColor="#1E3A8A" /></linearGradient>
    </defs>
    <rect width="390" height="300" fill="url(#ob-sky)" />
    <circle cx="195" cy="178" r="64" fill="#FB923C" />
    <circle cx="195" cy="178" r="44" fill="#FDBA74" opacity=".7" />
    <path d="M0 176 L60 150 L110 162 L170 140 L230 158 L300 136 L390 166 V200 H0z" fill="#C2410C" opacity=".55" />
    <rect y="196" width="390" height="104" fill="url(#ob-lake)" />
    <path d="M30 196 H360 L344 214 H46z" fill="#E5E7EB" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={140 + i * 6} y={226 + i * 18} width={110 - i * 12} height="4" rx="2" fill="#FDE68A" opacity={0.6 - i * 0.12} />)}
    {[[70, 92, '#2563EB', 0], [300, 70, '#F97316', 0.15], [215, 52, '#0F766E', 0.3], [130, 40, '#7C3AED', 0.45]].map(([x, y, c, d], i) => (
      <g key={i} className="animate-pop" style={{ animationDelay: `${d as number}s`, transformOrigin: `${x}px ${y}px` }}>
        <path d={`M${x} ${(y as number) - 22}c-9 0-16 7-16 15 0 11 16 25 16 25s16-14 16-25c0-8-7-15-16-15z`} fill={c as string} />
        <circle cx={x as number} cy={(y as number) - 8} r="6" fill="#fff" />
      </g>
    ))}
  </svg>
);

export const Onboarding: React.FC = () => {
  const { actions } = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [hood, setHood] = useState('');
  const [demo, setDemo] = useState({ reacted: false, voted: '', shared: false });
  const g = readGrowth();
  const next = () => { haptic(); setStep((s) => s + 1); };

  const finish = () => {
    haptic('success');
    const n = name.trim();
    actions.updateMe({ name: n, handle: slugHandle(n.split(' ').join('.')) || 'morador', hood: hood || 'Centro' });
    actions.finishOnboarding();
  };

  const dots = (
    <div className="flex justify-center gap-1.5 py-4">
      {[0, 1, 2, 3].map((i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-zinc-950' : 'w-1.5 bg-zinc-300'}`} />)}
    </div>
  );
  const cta = (label: string, onClick: () => void, disabled = false) => (
    <button onClick={onClick} disabled={disabled} className="w-full h-14 rounded-2xl bg-zinc-950 text-white text-[17px] font-extrabold flex items-center justify-center gap-2 disabled:bg-zinc-200 disabled:text-zinc-400 active:scale-[.98] transition-transform">
      {label} <ArrowRight className="w-5 h-5" />
    </button>
  );

  return (
    <div className="fixed inset-y-0 left-0 right-0 mx-auto max-w-md z-[60] bg-white flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}>
      {step === 0 && (
        <div key="s0" className="flex-1 flex flex-col animate-fade-in">
          <Photo slot="boas-vindas" alt="Sobradinho ao entardecer" className="w-full h-[300px]" fallback={<CityArt />} />
          <div className="flex-1 px-6 pt-6 flex flex-col">
            {g.referredBy && <p className="self-start mb-3 h-8 px-3 rounded-full bg-blue-50 text-blue-700 text-[13px] font-bold flex items-center">Você foi convidado pelo código {g.referredBy}</p>}
            <h1 className="text-[38px] leading-[1.02] font-extrabold tracking-tight">Sobradinho,<br />num lugar só.</h1>
            <p className="text-[17px] text-zinc-600 mt-3 leading-snug">O que tá rolando, quem resolve, o que vender e o que a cidade quer. De graça.</p>
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-amber-50 ring-1 ring-amber-200 p-3">
              <Seal kind="fundador" size={44} />
              <p className="text-[15px] leading-snug"><b>Os {FOUNDER_LIMIT} primeiros viram Fundadores.</b> O número fica pra sempre no seu perfil.</p>
            </div>
            <div className="flex-1" />
            {dots}
            {cta('Entrar na cidade', next)}
          </div>
        </div>
      )}

      {step === 1 && (
        <div key="s1" className="flex-1 px-6 pt-10 flex flex-col animate-fade-in">
          <h2 className="text-[30px] font-extrabold tracking-tight leading-tight">Como te chamam?</h2>
          <p className="text-[16px] text-zinc-500 mt-1">É assim que os vizinhos vão te achar.</p>
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="Seu nome"
            className="mt-6 h-16 px-5 rounded-2xl bg-zinc-100 outline-none text-[20px] font-bold focus:ring-2 focus:ring-blue-600" />
          {name.trim().length >= 2 && <p className="text-[14px] text-zinc-500 mt-2 px-1">Seu usuário: <b className="text-zinc-900">@{slugHandle(name.trim().split(' ').join('.'))}</b> (dá pra mudar depois)</p>}
          <p className="text-[13px] font-extrabold uppercase tracking-wider text-zinc-400 mt-8">Seu bairro</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {HOODS.map((h) => <button key={h} onClick={() => { haptic(); setHood(h); }} className={`h-11 px-4 rounded-full text-[15px] font-bold ${hood === h ? 'bg-orange-500 text-white' : 'bg-zinc-100 text-zinc-700'}`}>{h}</button>)}
          </div>
          <div className="flex-1" />
          {dots}
          {cta('Continuar', next, name.trim().length < 2 || !hood)}
        </div>
      )}

      {step === 2 && (
        <div key="s2" className="flex-1 px-5 pt-8 flex flex-col animate-fade-in overflow-y-auto">
          <h2 className="text-[28px] font-extrabold tracking-tight leading-tight">Treino rápido</h2>
          <p className="text-[16px] text-zinc-500 mt-1">Três toques e você já sabe usar.</p>
          <div className="mt-5 rounded-[26px] ring-1 ring-zinc-200 overflow-hidden">
            <div className="px-4 pt-4 flex items-center gap-3">
              <span className="w-11 h-11 rounded-full bg-teal-600 text-white font-extrabold flex items-center justify-center">MV</span>
              <div className="flex-1"><p className="text-[15px] font-extrabold">Maria Vizinha</p><p className="text-[13px] text-zinc-500">{hood || 'Centro'} · agora</p></div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 bg-zinc-100 rounded-md px-2 py-1">Exemplo</span>
            </div>
            <p className="px-4 pt-2 text-[16px]">Alguém sabe que horas abre a feira no sábado?</p>
            <div className={`px-4 py-2 flex items-center gap-2 ${!demo.reacted ? 'relative' : ''}`}>
              <button aria-label="Reagir no exemplo" onClick={() => { haptic('pop'); setDemo({ ...demo, reacted: true }); }} className={`h-11 px-3 rounded-full flex items-center gap-1.5 ${!demo.reacted ? 'ring-4 ring-orange-300 animate-pulse' : ''}`}>
                {demo.reacted ? <span className="text-2xl animate-pop">❤️</span> : <Heart className="w-6 h-6" />} <span className="font-bold">{demo.reacted ? 1 : ''}</span>
              </button>
              <span className="text-[14px] font-semibold text-orange-600">{demo.reacted ? '✓ Reagiu! Segure pra ver mais emojis.' : '1. Toque no coração'}</span>
            </div>
          </div>

          <div className={`mt-4 rounded-[26px] bg-orange-50 ring-1 ring-orange-100 p-4 transition-opacity ${demo.reacted ? '' : 'opacity-40 pointer-events-none'}`}>
            <p className="text-[13px] font-extrabold text-orange-600">2. Vote com um toque</p>
            <p className="text-[18px] font-extrabold mt-1">Feira boa é de manhã cedo ou à tarde?</p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {['Cedinho', 'À tarde'].map((o) => (
                <button key={o} onClick={() => { haptic('success'); setDemo({ ...demo, voted: o }); }} className={`h-12 rounded-xl font-bold ${demo.voted === o ? 'bg-blue-600 text-white' : 'bg-white ring-1 ring-zinc-200'}`}>{demo.voted === o ? `✓ ${o}` : o}</button>
              ))}
            </div>
          </div>

          <div className={`mt-4 rounded-[26px] bg-zinc-950 text-white p-4 transition-opacity ${demo.voted ? '' : 'opacity-40 pointer-events-none'}`}>
            <p className="text-[13px] font-extrabold text-amber-300">3. Chame alguém</p>
            <p className="text-[16px] mt-1 leading-snug">Tudo que você compartilha leva seu código. Cada pessoa que entra conta pro selo Verificado.</p>
            <button onClick={() => { haptic('pop'); setDemo({ ...demo, shared: true }); }} className="mt-3 h-12 w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-zinc-950 font-extrabold flex items-center justify-center gap-2">
              {demo.shared ? <><Check className="w-5 h-5" /> Entendi</> : <><Share2 className="w-5 h-5" /> Toque aqui (é só treino)</>}
            </button>
          </div>
          <div className="flex-1 min-h-4" />
          {dots}
          {cta('Pronto', next, !demo.shared)}
        </div>
      )}

      {step === 3 && (
        <div key="s3" className="flex-1 px-6 pt-14 flex flex-col items-center text-center animate-fade-in">
          <div className="animate-pop"><Seal kind="verificado" size={110} locked /></div>
          <h2 className="text-[30px] font-extrabold tracking-tight leading-tight mt-6">Bem-vindo, {name.trim().split(' ')[0]}!</h2>
          <p className="text-[16px] text-zinc-600 mt-2 leading-snug max-w-xs">Seu primeiro desafio: chame 10 pessoas e ganhe o check azul. Ele fica do lado do seu nome em todo lugar do app.</p>
          <div className="mt-6 w-full rounded-2xl bg-zinc-50 p-4 text-left space-y-2.5">
            {['Responda a Pergunta do dia', 'Poste uma foto do seu bairro', `Chame 10 pessoas pro selo`].map((t, i) => (
              <p key={t} className="flex items-center gap-3 text-[15px] font-semibold"><span className="w-7 h-7 rounded-full bg-zinc-950 text-white text-[13px] font-extrabold flex items-center justify-center">{i + 1}</span>{t}</p>
            ))}
          </div>
          <div className="flex-1" />
          {dots}
          {cta('Ver a cidade', finish)}
        </div>
      )}
    </div>
  );
};
