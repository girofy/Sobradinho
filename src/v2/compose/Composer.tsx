import React, { useEffect, useRef, useState } from 'react';
import { BarChart3, Image as ImageIcon, Type, X, Plus, Trash2, MapPin } from 'lucide-react';
import { useStore } from '../store';
import { useNav } from '../nav';
import { HOODS } from '../data';
import { Avatar, fileToDataUrl, haptic } from '../ui';

type Mode = 'texto' | 'foto' | 'enquete';

export const Composer: React.FC = () => {
  const { composer, closeComposer, setTab } = useNav();
  const { me, state, actions, say } = useStore();
  const [mode, setMode] = useState<Mode>('texto');
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState<string>();
  const [opts, setOpts] = useState(['', '']);
  const [hood, setHood] = useState(state.me.hood);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!composer) return;
    setMode(composer.mode);
    setText(composer.preset ?? '');
    setPhoto(undefined);
    setOpts(['', '']);
    setHood(state.me.hood);
    if (composer.mode === 'foto') setTimeout(() => fileRef.current?.click(), 250);
    else setTimeout(() => textRef.current?.focus(), 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composer]);

  if (!composer) return null;

  const filled = opts.filter((o) => o.trim());
  const valid = mode === 'enquete' ? text.trim().length > 3 && filled.length >= 2 : mode === 'foto' ? !!photo : text.trim().length > 0;

  const pick = async (f?: File) => {
    if (!f) return;
    try { setPhoto(await fileToDataUrl(f)); setMode('foto'); } catch { say('Não deu pra abrir essa foto'); }
  };

  const publish = () => {
    if (!valid) return;
    haptic('success');
    actions.publish(
      mode === 'enquete'
        ? { kind: 'poll', text: text.trim(), hood, poll: { question: text.trim(), unlockAt: 20, options: filled.map((t, i) => ({ id: `o${i}`, text: t.trim(), votes: 0 })) } }
        : { kind: 'post', text: text.trim(), photo, hood },
    );
    closeComposer();
    setTab('inicio');
    setTimeout(() => { const el = document.querySelector('main article'); window.scrollTo({ top: el ? el.getBoundingClientRect().top + window.scrollY - 64 : 0, behavior: 'smooth' }); }, 150); // o voltar do navegador restaurava a rolagem antiga
    say('Publicado! Compartilhe pra ganhar reações.');
  };

  const tabs: { k: Mode; label: string; Icon: typeof Type }[] = [
    { k: 'texto', label: 'Texto', Icon: Type },
    { k: 'foto', label: 'Foto', Icon: ImageIcon },
    { k: 'enquete', label: 'Enquete', Icon: BarChart3 },
  ];

  return (
    <div className="fixed inset-y-0 left-0 right-0 mx-auto max-w-md z-50 bg-white flex flex-col animate-sheet-up" role="dialog" aria-label="Novo post">
      <header className="h-14 px-2 flex items-center border-b border-zinc-100" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <button onClick={closeComposer} aria-label="Fechar" className="w-11 h-11 rounded-full flex items-center justify-center active:bg-zinc-100"><X className="w-6 h-6" /></button>
        <p className="flex-1 text-center text-[17px] font-extrabold">Novo post</p>
        <button onClick={publish} disabled={!valid} className="h-10 px-5 rounded-full bg-blue-600 text-white font-extrabold disabled:bg-zinc-200 disabled:text-zinc-400 active:scale-95 transition-transform">Publicar</button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="flex gap-2 px-4 pt-4">
          {tabs.map(({ k, label, Icon }) => (
            <button key={k} onClick={() => { haptic(); setMode(k); if (k === 'foto' && !photo) fileRef.current?.click(); }}
              className={`h-10 px-4 rounded-full flex items-center gap-2 text-[15px] font-bold transition-colors ${mode === k ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-700'}`}>
              <Icon className="w-[18px] h-[18px]" /> {label}
            </button>
          ))}
        </div>

        <div className="flex gap-3 px-4 pt-4">
          <Avatar a={me} size={44} />
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-extrabold">{me.name}</p>
            <textarea ref={textRef} value={text} onChange={(e) => setText(e.target.value)} maxLength={mode === 'enquete' ? 140 : 1000}
              placeholder={mode === 'enquete' ? 'Faça uma pergunta pra cidade…' : mode === 'foto' ? 'Escreva uma legenda (opcional)' : 'O que tá rolando no seu bairro?'}
              rows={mode === 'texto' ? 6 : 3}
              className="w-full mt-1 resize-none outline-none text-[19px] leading-snug placeholder:text-zinc-400" />
          </div>
        </div>

        {mode === 'foto' && (
          <div className="px-4 mt-2">
            {photo ? (
              <div className="relative">
                <img src={photo} alt="Prévia" className="w-full max-h-[420px] object-cover rounded-[24px]" />
                <button onClick={() => setPhoto(undefined)} aria-label="Remover foto" className="absolute top-3 right-3 w-10 h-10 rounded-full glass-dark text-white flex items-center justify-center"><Trash2 className="w-5 h-5" /></button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} className="w-full aspect-[4/3] rounded-[24px] border-2 border-dashed border-zinc-300 flex flex-col items-center justify-center gap-2 text-zinc-500 active:bg-zinc-50">
                <ImageIcon className="w-10 h-10" /><span className="font-bold">Escolher foto</span>
              </button>
            )}
          </div>
        )}

        {mode === 'enquete' && (
          <div className="px-4 mt-2 space-y-2.5">
            {opts.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={o} maxLength={40} onChange={(e) => setOpts(opts.map((x, j) => (j === i ? e.target.value : x)))} placeholder={`Opção ${i + 1}`}
                  className="flex-1 h-14 px-4 rounded-2xl bg-zinc-100 outline-none text-[16px] font-semibold focus:ring-2 focus:ring-blue-600" />
                {opts.length > 2 && <button onClick={() => setOpts(opts.filter((_, j) => j !== i))} aria-label="Remover opção" className="w-11 h-11 rounded-full flex items-center justify-center text-zinc-400"><X className="w-5 h-5" /></button>}
              </div>
            ))}
            {opts.length < 4 && <button onClick={() => setOpts([...opts, ''])} className="h-12 px-4 rounded-2xl text-blue-600 font-bold flex items-center gap-2"><Plus className="w-5 h-5" /> Adicionar opção</button>}
            <p className="text-[13px] text-zinc-500">O resultado abre com 20 votos. Isso faz as pessoas chamarem outras pra votar.</p>
          </div>
        )}

        <div className="px-4 mt-6 pb-8">
          <p className="text-[13px] font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Bairro</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {HOODS.map((h) => (
              <button key={h} onClick={() => { haptic(); setHood(h); }} className={`h-9 px-3.5 rounded-full text-[14px] font-semibold ${hood === h ? 'bg-orange-500 text-white' : 'bg-zinc-100 text-zinc-700'}`}>{h}</button>
            ))}
          </div>
          <p className="text-[13px] text-zinc-400 mt-6 leading-snug">Ao publicar você concorda com as regras da comunidade: sem ofensa, sem golpe e sem expor ninguém.</p>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} />
    </div>
  );
};
