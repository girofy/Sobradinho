import React, { useState } from 'react';
import { Bell, Ban, ChevronRight, CircleHelp, FileText, Info, Lock, Palette, Shield, Trash2, User } from 'lucide-react';
import { useStore } from '../store';
import { useNav } from '../nav';
import type { Prefs, Route } from '../types';
import { Avatar, NameLine, Screen, Toggle, haptic } from '../ui';
import { FAQ, LEGAL, PRIVACY, TERMS } from '../legal';

type SectionId = Extract<Route, { s: 'settings-section' }>['id'];

const Row: React.FC<{ icon: React.ReactNode; title: string; sub?: string; onClick?: () => void; right?: React.ReactNode; danger?: boolean }> = ({ icon, title, sub, onClick, right, danger }) => (
  <div role={onClick ? 'button' : undefined} onClick={() => { if (onClick) { haptic(); onClick(); } }}
    className={`flex items-center gap-3.5 px-4 min-h-[60px] py-2 ${onClick ? 'active:bg-zinc-50 cursor-pointer' : ''}`}>
    <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${danger ? 'bg-red-50 text-red-600' : 'bg-zinc-100 text-zinc-700'}`}>{icon}</span>
    <span className="flex-1 min-w-0">
      <span className={`block text-[16px] font-semibold ${danger ? 'text-red-600' : ''}`}>{title}</span>
      {sub && <span className="block text-[13px] text-zinc-500 leading-snug">{sub}</span>}
    </span>
    {right ?? (onClick ? <ChevronRight className="w-5 h-5 text-zinc-300" /> : null)}
  </div>
);

const Group: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="px-3 pt-5">
    {title && <p className="px-2 pb-2 text-[13px] font-extrabold uppercase tracking-wider text-zinc-400">{title}</p>}
    <div className="rounded-[22px] ring-1 ring-zinc-100 divide-y divide-zinc-100 overflow-hidden bg-white">{children}</div>
  </div>
);

export const Settings: React.FC = () => {
  const { me, state } = useStore();
  const { back, push } = useNav();
  const go = (id: SectionId) => push({ s: 'settings-section', id });
  return (
    <Screen title="Ajustes" onBack={back}>
      <div className="px-3 pt-4">
        <button onClick={() => push({ s: 'edit' })} className="w-full rounded-[22px] bg-zinc-50 p-4 flex items-center gap-3 text-left active:bg-zinc-100">
          <Avatar a={me} size={56} />
          <span className="flex-1 min-w-0"><NameLine a={me} className="text-[18px] font-extrabold" /><span className="block text-[14px] text-zinc-500">@{state.me.handle} · Editar perfil</span></span>
          <ChevronRight className="w-5 h-5 text-zinc-300" />
        </button>
      </div>
      <Group title="Conta">
        <Row icon={<User className="w-5 h-5" />} title="Dados da conta" sub="Nome, @, bairro, WhatsApp" onClick={() => go('conta')} />
        <Row icon={<Bell className="w-5 h-5" />} title="Notificações" onClick={() => go('notificacoes')} />
        <Row icon={<Lock className="w-5 h-5" />} title="Privacidade" sub="Quem vê seu WhatsApp e bairro" onClick={() => go('privacidade')} />
        <Row icon={<Ban className="w-5 h-5" />} title="Bloqueados e silenciados" sub={`${state.blocked.length + state.muted.length} contas`} onClick={() => go('bloqueados')} />
      </Group>
      <Group title="App">
        <Row icon={<Palette className="w-5 h-5" />} title="Aparência e acessibilidade" sub="Vibração, sons, animações" onClick={() => go('aparencia')} />
        <Row icon={<CircleHelp className="w-5 h-5" />} title="Ajuda" onClick={() => go('ajuda')} />
        <Row icon={<Info className="w-5 h-5" />} title="Sobre o Sobradinho Online" onClick={() => go('sobre')} />
      </Group>
      <Group title="Legal">
        <Row icon={<FileText className="w-5 h-5" />} title="Termos de uso" onClick={() => go('termos')} />
        <Row icon={<Shield className="w-5 h-5" />} title="Política de privacidade" onClick={() => go('politica')} />
      </Group>
      <Group>
        <Row icon={<Trash2 className="w-5 h-5" />} title="Excluir conta" danger onClick={() => go('excluir')} />
      </Group>
      <p className="text-center text-[13px] text-zinc-400 py-8">Sobradinho Online · versão beta 0.2</p>
    </Screen>
  );
};

const Doc: React.FC<{ items: { h: string; p: string[] }[] }> = ({ items }) => (
  <div className="px-5 py-4 pb-16">
    <p className="text-[13px] text-amber-700 bg-amber-50 rounded-xl px-3 py-2 mb-4">Rascunho. Revise com um advogado antes de publicar o app na loja.</p>
    {items.map((s) => (
      <section key={s.h} className="mb-5">
        <h3 className="text-[17px] font-extrabold mb-1.5">{s.h}</h3>
        {s.p.map((t) => <p key={t} className="text-[15px] text-zinc-700 leading-relaxed mb-2">{t}</p>)}
      </section>
    ))}
  </div>
);

const PREF_LABELS: Record<keyof Prefs, [string, string?]> = {
  notifComments: ['Comentários e respostas'],
  notifReactions: ['Reações nos seus posts'],
  notifCity: ['Avisos da cidade', 'Falta de água, luz, alertas'],
  notifEvents: ['Eventos e agenda'],
  privateWhatsapp: ['Esconder meu WhatsApp', 'Só aparece nos anúncios que você publicar'],
  showHood: ['Mostrar meu bairro no perfil'],
  haptics: ['Vibração ao tocar'],
  sounds: ['Sons'],
  reduceMotion: ['Reduzir animações'],
  dataSaver: ['Economia de dados', 'Carrega fotos menores'],
};

export const SettingsSection: React.FC<{ id: SectionId }> = ({ id }) => {
  const { state, actions, authorOf, say } = useStore();
  const { back, push, setTab, reset } = useNav();
  const [confirm, setConfirm] = useState('');
  const [faq, setFaq] = useState<number | null>(null);
  const toggles = (keys: (keyof Prefs)[]) => (
    <Group>{keys.map((k) => <Row key={k} icon={<span className="w-2 h-2 rounded-full bg-blue-600" />} title={PREF_LABELS[k][0]} sub={PREF_LABELS[k][1]} right={<Toggle on={state.prefs[k]} label={PREF_LABELS[k][0]} onChange={(v) => actions.setPref(k, v)} />} />)}</Group>
  );

  const titles: Record<SectionId, string> = {
    conta: 'Dados da conta', notificacoes: 'Notificações', privacidade: 'Privacidade', bloqueados: 'Bloqueados e silenciados',
    aparencia: 'Aparência e acessibilidade', ajuda: 'Ajuda', sobre: 'Sobre', termos: 'Termos de uso', politica: 'Política de privacidade', excluir: 'Excluir conta',
  };

  let body: React.ReactNode = null;
  if (id === 'conta') body = (
    <Group>
      <Row icon={<User className="w-5 h-5" />} title="Nome" sub={state.me.name} onClick={() => push({ s: 'edit' })} />
      <Row icon={<span className="font-extrabold">@</span>} title="Usuário" sub={`@${state.me.handle}`} onClick={() => push({ s: 'edit' })} />
      <Row icon={<span>📍</span>} title="Bairro" sub={state.me.hood} onClick={() => push({ s: 'edit' })} />
      <Row icon={<span>📱</span>} title="WhatsApp" sub={state.me.whatsapp || 'Não informado'} onClick={() => push({ s: 'edit' })} />
      <Row icon={<span>🗓️</span>} title="Na cidade desde" sub={new Date(state.me.joinedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} />
    </Group>
  );
  if (id === 'notificacoes') body = <>{toggles(['notifComments', 'notifReactions', 'notifCity', 'notifEvents'])}<p className="px-6 pt-3 text-[13px] text-zinc-400">O app só avisa de coisa real. Nada de notificação inventada.</p></>;
  if (id === 'privacidade') body = toggles(['privateWhatsapp', 'showHood']);
  if (id === 'aparencia') body = toggles(['haptics', 'sounds', 'reduceMotion', 'dataSaver']);
  if (id === 'bloqueados') {
    const all = [...state.blocked.map((x) => ({ id: x, kind: 'Bloqueado' })), ...state.muted.map((x) => ({ id: x, kind: 'Silenciado' }))];
    body = all.length ? (
      <Group>{all.map(({ id: aid, kind }) => {
        const a = authorOf(aid);
        return <Row key={aid + kind} icon={<Avatar a={a} size={36} />} title={a.name} sub={kind} right={<button onClick={() => (kind === 'Bloqueado' ? actions.toggleBlock(aid) : actions.toggleMute(aid))} className="h-9 px-4 rounded-full bg-zinc-100 text-[14px] font-bold">Desfazer</button>} />;
      })}</Group>
    ) : <p className="px-6 py-10 text-center text-zinc-500">Você não bloqueou nem silenciou ninguém.</p>;
  }
  if (id === 'ajuda') body = (
    <Group>{FAQ.map((f, i) => (
      <div key={f.q}>
        <button onClick={() => setFaq(faq === i ? null : i)} className="w-full px-4 min-h-[58px] flex items-center justify-between text-left text-[16px] font-semibold">{f.q}<ChevronRight className={`w-5 h-5 text-zinc-300 transition-transform ${faq === i ? 'rotate-90' : ''}`} /></button>
        {faq === i && <p className="px-4 pb-4 text-[15px] text-zinc-600 leading-snug">{f.a}</p>}
      </div>
    ))}</Group>
  );
  if (id === 'sobre') body = (
    <div className="px-6 py-8 text-center">
      <p className="text-[22px] font-extrabold">sobradinho<span className="text-blue-600">.</span><span className="text-orange-500">online</span></p>
      <p className="text-[15px] text-zinc-600 mt-2 leading-snug">A cidade num lugar só: o que tá rolando, quem resolve, o que vender e o que Sobradinho quer.</p>
      <p className="text-[13px] text-zinc-400 mt-6">Versão beta 0.2 · Feito em {LEGAL.cidade}</p>
    </div>
  );
  if (id === 'termos') body = <Doc items={TERMS} />;
  if (id === 'politica') body = <Doc items={PRIVACY} />;
  if (id === 'excluir') body = (
    <div className="px-5 py-6">
      <p className="text-[17px] font-extrabold">Isso apaga tudo de você no app</p>
      <ul className="mt-3 space-y-1.5 text-[15px] text-zinc-700 list-disc pl-5">
        <li>Perfil, foto e capa</li><li>Posts, comentários e votos</li><li>Anúncios e serviços</li><li>Convites, selos e lugar no ranking</li>
      </ul>
      <p className="text-[14px] text-zinc-500 mt-3">Não dá pra desfazer. O número de Fundador não volta.</p>
      <label className="block text-[14px] font-bold mt-6">Digite EXCLUIR para confirmar</label>
      <input value={confirm} onChange={(e) => setConfirm(e.target.value.toUpperCase())} className="w-full h-14 px-4 mt-2 rounded-2xl bg-zinc-100 outline-none text-[16px] font-bold tracking-widest focus:ring-2 focus:ring-red-500" />
      <button disabled={confirm !== 'EXCLUIR'} onClick={() => {
        haptic('success');
        try { Object.keys(localStorage).filter((k) => k.startsWith('sobradinho_') || k.startsWith('so_v2')).forEach((k) => localStorage.removeItem(k)); } catch {}
        actions.resetAll();
        reset();
        setTab('inicio');
        say('Conta excluída');
      }} className="w-full h-14 mt-4 rounded-2xl bg-red-600 text-white font-extrabold disabled:bg-zinc-200 disabled:text-zinc-400">Excluir minha conta</button>
    </div>
  );

  return <Screen title={titles[id]} onBack={back}>{body}</Screen>;
};
