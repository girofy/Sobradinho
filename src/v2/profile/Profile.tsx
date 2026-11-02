import React, { useMemo, useRef, useState } from 'react';
import { Camera, Check, Link2, MapPin, Settings as Gear, Share2, X } from 'lucide-react';
import { slugHandle, useStore } from '../store';
import { useNav } from '../nav';
import { HOODS, HOUSE } from '../data';
import { Avatar, Empty, Photo, Screen, Verified, fileToDataUrl, haptic, shareWithCode } from '../ui';
import { PostCard } from '../home/PostCard';
import { Seal } from '../../components/ui/Seals';
import { FounderChip } from '../../components/ui/Badges';
import { FOUNDER_LIMIT, REWARD_TIERS, VERIFIED_AT, readGrowth } from '../../lib/growth';

const ProfileArt: React.FC = () => (
  <svg viewBox="0 0 160 110" className="w-full" aria-hidden="true">
    <rect x="20" y="14" width="120" height="86" rx="20" fill="#F4F4F5" />
    <circle cx="56" cy="50" r="16" fill="#FDBA74" /><rect x="80" y="40" width="44" height="8" rx="4" fill="#D4D4D8" /><rect x="80" y="54" width="30" height="8" rx="4" fill="#E4E4E7" />
    <rect x="34" y="74" width="92" height="14" rx="7" fill="#2563EB" opacity=".9" />
  </svg>
);

export const Profile: React.FC = () => {
  const { state, me, actions, say } = useStore();
  const { push, openComposer } = useNav();
  const [tab, setTab] = useState<'posts' | 'salvos' | 'selos'>('posts');
  const avatarRef = useRef<HTMLInputElement>(null);
  const g = readGrowth();
  const verified = g.invited >= VERIFIED_AT;
  const mine = state.posts.filter((p) => p.authorId === 'me');
  const saved = state.posts.filter((p) => p.saved);

  const checklist = [
    { ok: !!state.me.avatar, label: 'Foto de perfil' },
    { ok: !!state.me.cover, label: 'Foto de capa' },
    { ok: state.me.bio.length > 0, label: 'Bio' },
    { ok: state.me.handle !== 'morador' && state.me.name !== 'Morador', label: 'Nome e @' },
    { ok: mine.length > 0, label: 'Primeiro post' },
  ];
  const done = checklist.filter((c) => c.ok).length;

  const changeAvatar = async (f?: File) => {
    if (!f) return;
    try { actions.updateMe({ avatar: await fileToDataUrl(f, 480) }); say('Foto atualizada'); } catch { say('Não deu pra abrir essa foto'); }
  };
  const shareProfile = () => shareWithCode(me.name, `Me segue no Sobradinho Online: @${state.me.handle}`, say);

  return (
    <div>
      <div className="relative h-48">
        {state.me.cover ? <img src={state.me.cover} alt="" className="w-full h-full object-cover" /> : <Photo slot="capa-padrao" className="w-full h-full" />}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute top-0 inset-x-0 flex justify-between p-3" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}>
          <button onClick={shareProfile} aria-label="Compartilhar perfil" className="w-11 h-11 rounded-2xl glass-dark text-white flex items-center justify-center"><Share2 className="w-5 h-5" /></button>
          <button onClick={() => { haptic(); push({ s: 'settings' }); }} aria-label="Ajustes" className="w-11 h-11 rounded-2xl glass-dark text-white flex items-center justify-center"><Gear className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="px-4 -mt-14 relative">
        <div className="relative w-[108px]">
          <div className="rounded-full ring-4 ring-white bg-white"><Avatar a={me} size={104} /></div>
          <button onClick={() => avatarRef.current?.click()} aria-label="Trocar foto" className="absolute bottom-1 right-0 w-9 h-9 rounded-full bg-blue-600 text-white ring-[3px] ring-white flex items-center justify-center"><Camera className="w-[18px] h-[18px]" /></button>
          <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => changeAvatar(e.target.files?.[0])} />
        </div>
        <div className="flex items-center gap-1.5 mt-3">
          <h1 className="text-[26px] font-extrabold tracking-tight truncate">{me.name}</h1>
          {verified && <Verified size={24} />}
        </div>
        <p className="text-[15px] text-zinc-500">@{state.me.handle}</p>
        {g.founderNumber && <div className="mt-2"><FounderChip number={g.founderNumber} /></div>}
        {state.me.bio && <p className="text-[16px] leading-snug mt-2.5 whitespace-pre-line">{state.me.bio}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[14px] text-zinc-500">
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-orange-500" /> {state.me.hood}</span>
          {state.me.link && <a href={state.me.link.startsWith('http') ? state.me.link : `https://${state.me.link}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 font-semibold"><Link2 className="w-4 h-4" /> {state.me.link.replace(/^https?:\/\//, '')}</a>}
        </div>

        <div className="grid grid-cols-3 mt-5 py-3 rounded-[22px] bg-zinc-50">
          {[[mine.length, mine.length === 1 ? 'post' : 'posts'], [state.following.length, 'seguindo'], [g.invited, g.invited === 1 ? 'convite' : 'convites']].map(([v, l]) => (
            <div key={l as string} className="text-center"><p className="text-[22px] font-extrabold leading-none">{v}</p><p className="text-[13px] text-zinc-500 mt-1">{l}</p></div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <button onClick={() => { haptic(); push({ s: 'edit' }); }} className="h-12 rounded-2xl bg-zinc-100 font-extrabold active:bg-zinc-200">Editar perfil</button>
          <button onClick={shareProfile} className="h-12 rounded-2xl bg-zinc-950 text-white font-extrabold active:scale-[.98]">Compartilhar</button>
        </div>

        {done < checklist.length && (
          <div className="mt-4 rounded-[24px] ring-1 ring-orange-200 bg-orange-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[16px] font-extrabold">Complete seu perfil</p>
              <span className="text-[14px] font-extrabold text-orange-600">{done}/{checklist.length}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-orange-100 overflow-hidden"><div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${(done / checklist.length) * 100}%` }} /></div>
            <div className="flex flex-wrap gap-2 mt-3">
              {checklist.map((c) => (
                <button key={c.label} disabled={c.ok} onClick={() => (c.label === 'Primeiro post' ? openComposer('foto') : push({ s: 'edit' }))}
                  className={`h-9 px-3 rounded-full text-[13px] font-bold flex items-center gap-1 ${c.ok ? 'bg-white text-emerald-700' : 'bg-white text-zinc-800 ring-1 ring-orange-200'}`}>
                  {c.ok ? <Check className="w-4 h-4" /> : null}{c.label}
                </button>
              ))}
            </div>
            <p className="text-[13px] text-zinc-500 mt-2">Perfil completo passa mais confiança pra quem vai te contratar ou comprar de você.</p>
          </div>
        )}
      </div>

      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur px-3 pt-4 pb-2">
        <div className="p-1 rounded-full bg-zinc-950 flex">
          {([['posts', 'Posts'], ['salvos', 'Salvos'], ['selos', 'Selos']] as const).map(([k, l]) => (
            <button key={k} onClick={() => { haptic(); setTab(k); }} className={`flex-1 h-11 rounded-full text-[15px] font-bold transition-all ${tab === k ? 'bg-white text-zinc-950' : 'text-white/60'}`}>{l}</button>
          ))}
        </div>
      </div>

      {tab === 'posts' && (mine.length ? mine.map((p) => <PostCard key={p.id} post={p} />) : (
        <Empty art={<ProfileArt />} title="Seu primeiro post" text="Uma foto do seu bairro, um aviso, uma pergunta. Quem posta primeiro aparece mais." action={<button onClick={() => openComposer('foto')} className="h-12 px-6 rounded-full bg-blue-600 text-white font-extrabold">Postar agora</button>} />
      ))}
      {tab === 'salvos' && (saved.length ? saved.map((p) => <PostCard key={p.id} post={p} />) : (
        <Empty art={<ProfileArt />} title="Nada salvo" text="Toque no marcador de um post pra guardar aqui. Só você vê." />
      ))}
      {tab === 'selos' && (
        <div className="px-3 pt-2 pb-8 space-y-2">
          {REWARD_TIERS.map((t) => {
            const ok = g.invited >= t.at;
            return (
              <div key={t.title} className={`flex items-center gap-3 rounded-[22px] p-3.5 ${ok ? 'bg-amber-50 ring-1 ring-amber-200' : 'bg-zinc-50'}`}>
                <Seal kind={t.at === 3 ? 'destaque' : t.at === VERIFIED_AT ? 'verificado' : 'embaixador'} size={48} locked={!ok} />
                <div className="flex-1 min-w-0"><p className="text-[16px] font-extrabold">{t.title}</p><p className="text-[13px] text-zinc-500 leading-snug">{t.sub}</p></div>
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${ok ? 'bg-amber-300 text-amber-950' : 'bg-zinc-200 text-zinc-600'}`}>{ok ? 'Seu' : `${t.at - g.invited} faltam`}</span>
              </div>
            );
          })}
          <div className={`flex items-center gap-3 rounded-[22px] p-3.5 ${g.founderNumber ? 'bg-amber-50 ring-1 ring-amber-200' : 'bg-zinc-50'}`}>
            <Seal kind="fundador" size={48} locked={!g.founderNumber} />
            <div className="flex-1"><p className="text-[16px] font-extrabold">Fundador</p><p className="text-[13px] text-zinc-500 leading-snug">Só os {FOUNDER_LIMIT} primeiros. O número fica pra sempre no perfil.</p></div>
          </div>
        </div>
      )}
    </div>
  );
};

export const EditProfile: React.FC = () => {
  const { state, actions, say } = useStore();
  const { back } = useNav();
  const [f, setF] = useState({ ...state.me });
  const coverRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const handle = slugHandle(f.handle);
  const taken = useMemo(() => handle !== slugHandle(state.me.handle) && HOUSE.some((h) => slugHandle(h.handle) === handle), [handle, state.me.handle]);
  const handleOk = handle.length >= 3 && !taken;
  const ok = f.name.trim().length >= 2 && handleOk;
  const field = 'w-full h-14 px-4 rounded-2xl bg-zinc-100 outline-none text-[16px] focus:ring-2 focus:ring-blue-600';
  const label = 'block text-[13px] font-extrabold uppercase tracking-wider text-zinc-400 mb-1.5 mt-5';

  const pick = async (file: File | undefined, key: 'avatar' | 'cover') => {
    if (!file) return;
    try { const url = await fileToDataUrl(file, key === 'cover' ? 1280 : 480); setF((x) => ({ ...x, [key]: url })); } catch { say('Não deu pra abrir essa foto'); }
  };
  const save = () => {
    if (!ok) return;
    haptic('success');
    actions.updateMe({ ...f, name: f.name.trim(), handle, bio: f.bio.trim(), link: f.link.trim() });
    say('Perfil salvo');
    back();
  };

  return (
    <Screen title="Editar perfil" onBack={back} right={<button onClick={save} disabled={!ok} className="h-10 px-5 mr-1 rounded-full bg-blue-600 text-white font-extrabold disabled:bg-zinc-200 disabled:text-zinc-400">Salvar</button>}>
      <button onClick={() => coverRef.current?.click()} className="relative block w-full h-40 bg-zinc-100">
        {f.cover ? <img src={f.cover} alt="" className="w-full h-full object-cover" /> : <Photo slot="capa-padrao" className="w-full h-full" />}
        <span className="absolute inset-0 flex items-center justify-center"><span className="h-11 px-4 rounded-full glass-dark text-white font-bold flex items-center gap-2"><Camera className="w-5 h-5" /> Trocar capa</span></span>
      </button>
      <div className="px-4 -mt-12">
        <button onClick={() => avatarRef.current?.click()} className="relative rounded-full ring-4 ring-white">
          <Avatar a={{ id: 'me', name: f.name || '?', handle, avatar: f.avatar, color: '#0F172A' }} size={96} />
          <span className="absolute inset-0 rounded-full bg-black/55 flex items-center justify-center text-white"><Camera className="w-8 h-8" /></span>
        </button>
        {f.avatar && <button onClick={() => setF({ ...f, avatar: undefined })} className="ml-3 text-[14px] font-bold text-red-600">Remover foto</button>}
      </div>
      <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0], 'cover')} />
      <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0], 'avatar')} />

      <div className="px-4 pb-16">
        <label className={label}>Nome</label>
        <input className={field} value={f.name} maxLength={40} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Seu nome" />

        <label className={label}>Usuário</label>
        <div className={`${field} flex items-center gap-1`}>
          <span className="text-zinc-400 font-bold">@</span>
          <input className="flex-1 bg-transparent outline-none" value={f.handle} maxLength={24} autoCapitalize="none" autoCorrect="off" onChange={(e) => setF({ ...f, handle: slugHandle(e.target.value) })} />
          {handle.length >= 3 && (handleOk ? <Check className="w-5 h-5 text-emerald-600" /> : <X className="w-5 h-5 text-red-500" />)}
        </div>
        <p className={`text-[13px] mt-1.5 ${handleOk ? 'text-zinc-400' : 'text-red-600'}`}>
          {taken ? 'Esse @ já é de uma conta da equipe.' : handle.length < 3 ? 'Mínimo de 3 letras. Use letras, números, ponto e _.' : 'Letras minúsculas, números, ponto e _. Com o login, o app confere se está livre.'}
        </p>

        <label className={label}>Bio</label>
        <textarea className="w-full px-4 py-3 rounded-2xl bg-zinc-100 outline-none text-[16px] focus:ring-2 focus:ring-blue-600" rows={3} maxLength={150} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} placeholder="Quem é você? O que você faz?" />
        <p className="text-[13px] text-zinc-400 text-right">{f.bio.length}/150</p>

        <label className={label}>Bairro</label>
        <select className={field} value={f.hood} onChange={(e) => setF({ ...f, hood: e.target.value })}>{HOODS.map((h) => <option key={h}>{h}</option>)}</select>

        <label className={label}>WhatsApp</label>
        <input className={field} inputMode="tel" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} placeholder="(74) 9 0000-0000" />
        <p className="text-[13px] text-zinc-400 mt-1.5">Usado nos seus anúncios. Você escolhe se aparece em Ajustes &gt; Privacidade.</p>

        <label className={label}>Link</label>
        <input className={field} value={f.link} maxLength={80} autoCapitalize="none" onChange={(e) => setF({ ...f, link: e.target.value })} placeholder="instagram.com/seuperfil" />
      </div>
    </Screen>
  );
};
