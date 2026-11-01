// Perfil, Ranking, Salvos e Ajustes: tudo salvo no aparelho (trocar por Firestore depois).
import React, { useMemo, useState } from 'react';
import {
  Bell, Bookmark, ChevronRight, Copy, FileText, Heart, MapPin, Pencil, RotateCcw,
  Settings, Share2, Shield, Smartphone, Trophy, User, Users, Volume2, Zap,
} from 'lucide-react';
import type { CitizenRankItem, FeedPost } from '../types/community';
import { useHaptics } from '../hooks/useHaptics';
import { useSettings } from '../lib/settings';
import type { AppSettings } from '../lib/settings';
import {
  AMBASSADOR_AT, FOUNDER_LIMIT, INVITE_RANKING_SEED, REWARD_TIERS, VERIFIED_AT, inviteCodeFor, inviteLink, readGrowth, readInvitees, shareInvite,
} from '../lib/growth';
import { Sheet } from './ui/Sheet';
import { Seal } from './ui/Seals';
import { HowItWorks } from './HowItWorks';
import { Switch } from './ui/Switch';
import { FounderChip, VerifiedBadge } from './ui/Badges';

type SubTab = 'perfil' | 'classificacao' | 'salvos' | 'configuracoes';

interface ProfileViewProps {
  userName: string;
  userNeighborhood: string;
  onUpdateUser: (name: string, neighborhood: string) => void;
  savedCount: number;
  rankingList: CitizenRankItem[];
  savedPosts: FeedPost[];
  onUnsavePost: (id: string) => void;
  defaultSubTab?: SubTab;
  onToast?: (msg: string) => void;
}

const EXTRA_KEY = 'sobradinho_profile_extra_v1';
function readExtra() {
  try {
    return { bio: 'Morador de Sobradinho.', whatsapp: '', ...JSON.parse(localStorage.getItem(EXTRA_KEY) || '{}') };
  } catch {
    return { bio: 'Morador de Sobradinho.', whatsapp: '' };
  }
}

const POLICY_TERMS = [
  'O Sobradinho Online é um espaço da comunidade. Seja respeitoso e não publique conteúdo ofensivo, ilegal ou que exponha outras pessoas.',
  'Você é responsável pelo que publica. Podemos remover posts que violem estas regras.',
  'Anúncios e serviços são combinados diretamente entre as pessoas. O app não participa nem garante as negociações.',
];
const POLICY_PRIVACY = [
  'Nesta versão, seus dados (nome, bairro, posts e ajustes) ficam salvos somente no seu aparelho.',
  'Seu WhatsApp só aparece para outras pessoas se você deixar a opção "Mostrar meu WhatsApp" ligada.',
  'Você pode apagar tudo a qualquer momento em Ajustes > Restaurar dados locais.',
];

const Row: React.FC<{ icon: React.ReactNode; title: string; sub?: string; right?: React.ReactNode; onClick?: () => void }> = ({ icon, title, sub, right, onClick }) => {
  const inner = (
    <>
      <span className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">{icon}</span>
      <span className="flex-1 min-w-0 text-left">
        <span className="block text-base font-semibold text-zinc-900 leading-tight">{title}</span>
        {sub && <span className="block text-sm text-zinc-500 leading-snug mt-0.5">{sub}</span>}
      </span>
      {right}
    </>
  );
  return onClick ? (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 min-h-[64px] active:bg-zinc-50">{inner}</button>
  ) : (
    <div className="w-full flex items-center gap-3 px-4 py-3 min-h-[64px]">{inner}</div>
  );
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  userName, userNeighborhood, onUpdateUser, savedCount, rankingList, savedPosts, onUnsavePost,
  defaultSubTab = 'perfil', onToast,
}) => {
  const { triggerHaptic } = useHaptics();
  const { settings, update } = useSettings();
  const [tab, setTab] = useState<SubTab>(defaultSubTab);
  const [sheet, setSheet] = useState<null | 'edit' | 'terms' | 'privacy' | 'reset'>(null);
  const [extra, setExtra] = useState(readExtra);
  const [nameInput, setNameInput] = useState(userName);
  const [hoodInput, setHoodInput] = useState(userNeighborhood);
  const [bioInput, setBioInput] = useState(extra.bio);
  const [wppInput, setWppInput] = useState(extra.whatsapp);

  const toast = (m: string) => onToast?.(m);
  const code = useMemo(() => inviteCodeFor(userName), [userName]);
  const growth = readGrowth();
  const invitees = useMemo(() => readInvitees(), []);
  const [howOpen, setHowOpen] = useState(false);
  const [rankMode, setRankMode] = useState<'pontos' | 'convites'>('pontos');
  const inviteRanking = useMemo(() => {
    const base = rankingList.filter((r) => !r.isCurrentUser).slice(0, INVITE_RANKING_SEED.length).map((r, i) => ({ ...r, invites: INVITE_RANKING_SEED[i] }));
    const mine = rankingList.find((r) => r.isCurrentUser);
    const all = [...base, ...(mine ? [{ ...mine, invites: growth.invited }] : [])].sort((a, b) => b.invites - a.invites);
    return all.map((r, i) => ({ ...r, pos: i + 1 }));
  }, [rankingList, growth.invited]);
  const me = rankingList.find((r) => r.isCurrentUser);
  const verified = growth.invited >= VERIFIED_AT;
  const handle = userName.toLowerCase().replace(/\s+/g, '');
  const invitedPct = Math.min(100, Math.round((growth.invited / VERIFIED_AT) * 100));

  const saveProfile = () => {
    triggerHaptic('success');
    const next = { bio: bioInput.trim(), whatsapp: wppInput.trim() };
    setExtra(next);
    try { localStorage.setItem(EXTRA_KEY, JSON.stringify(next)); } catch {}
    onUpdateUser(nameInput.trim() || userName, hoodInput.trim() || userNeighborhood);
    setSheet(null);
  };

  const doShare = async () => {
    triggerHaptic('medium');
    const r = await shareInvite(code, userName);
    if (r === 'copied') toast('Convite copiado! Cole no WhatsApp.');
    if (r === 'failed') toast('Não deu pra compartilhar. Tente copiar o código.');
  };

  const copyCode = async () => {
    triggerHaptic('selection');
    try {
      await navigator.clipboard.writeText(inviteLink(code));
      toast('Link do convite copiado!');
    } catch {
      toast(`Seu código: ${code}`);
    }
  };

  const askNotifications = async () => {
    if (!('Notification' in window)) return toast('Este aparelho não suporta notificações no navegador.');
    const res = await Notification.requestPermission();
    toast(res === 'granted' ? 'Notificações ativadas!' : 'Permissão negada. Ative nas configurações do navegador.');
  };

  const tabs: { key: SubTab; label: string; Icon: typeof User }[] = [
    { key: 'perfil', label: 'Perfil', Icon: User },
    { key: 'classificacao', label: 'Ranking', Icon: Trophy },
    { key: 'salvos', label: 'Salvos', Icon: Bookmark },
    { key: 'configuracoes', label: 'Ajustes', Icon: Settings },
  ];

  const toggle = (key: keyof AppSettings, icon: React.ReactNode, title: string, sub: string) => (
    <Row
      icon={icon}
      title={title}
      sub={sub}
      right={<Switch checked={settings[key]} label={title} onChange={(v) => { triggerHaptic('selection'); update(key, v as never); }} />}
    />
  );

  return (
    <div className="-mx-3 sm:-mx-4 -my-3 bg-white min-h-screen animate-fade-in">
      {/* Capa + avatar */}
      <div className="relative">
        <div className="h-36 bg-gradient-to-br from-blue-600 via-indigo-500 to-orange-400" />
        <div className="px-5 -mt-12 flex items-end justify-between">
          <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
            <div className="w-full h-full rounded-full bg-blue-600 text-white text-4xl font-extrabold flex items-center justify-center">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
          <button
            onClick={() => { triggerHaptic('selection'); setNameInput(userName); setHoodInput(userNeighborhood); setBioInput(extra.bio); setWppInput(extra.whatsapp); setSheet('edit'); }}
            className="h-11 px-5 rounded-full bg-zinc-100 text-zinc-900 text-[15px] font-bold flex items-center gap-2 active:bg-zinc-200 mb-1"
          >
            <Pencil className="w-4 h-4" /> Editar
          </button>
        </div>
      </div>

      <div className="px-5 pt-3 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-extrabold text-zinc-900 truncate">{userName}</h2>
          {verified && <VerifiedBadge className="w-6 h-6 shrink-0" />}
        </div>
        <p className="text-[15px] text-zinc-500">@{handle}</p>
        <p className="flex items-center gap-1.5 text-[15px] text-zinc-600 mt-1">
          <MapPin className="w-4 h-4 text-orange-500" /> {userNeighborhood} · Sobradinho
        </p>
        {extra.bio && <p className="text-[15px] text-zinc-800 mt-3 leading-relaxed">{extra.bio}</p>}
        {growth.founderNumber && <div className="mt-3"><FounderChip number={growth.founderNumber} /></div>}

        <div className="grid grid-cols-4 gap-2 mt-5">
          {[
            { v: me?.points ?? 0, l: 'pontos' },
            { v: me ? `#${me.rank}` : '-', l: 'ranking' },
            { v: growth.invited, l: 'convites' },
            { v: savedCount, l: 'salvos' },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-zinc-50 py-3 text-center">
              <p className="text-xl font-extrabold text-zinc-900">{s.v}</p>
              <p className="text-xs text-zinc-500 font-medium">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Abas */}
      <div className="sticky top-14 z-20 bg-white/95 backdrop-blur px-4 py-2 border-b border-zinc-100">
        <div className="flex p-1 bg-zinc-100 rounded-full">
          {tabs.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => { triggerHaptic('selection'); setTab(key); }}
              className={`flex-1 h-11 rounded-full text-sm font-bold flex items-center justify-center gap-1.5 transition-colors ${tab === key ? 'bg-white text-zinc-900 shadow' : 'text-zinc-500'}`}
            >
              <Icon className="w-[18px] h-[18px]" /> <span className="hidden min-[380px]:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pb-8">
        {/* PERFIL: convites e selos */}
        {tab === 'perfil' && (
          <div className="px-4 pt-5 space-y-5">
            <div className="rounded-[28px] bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-5">
              <p className="text-sm font-semibold text-amber-300">Convide e ganhe selos</p>
              <h3 className="text-2xl font-extrabold leading-tight mt-1">Chame {VERIFIED_AT} pessoas e ganhe o selo Verificado</h3>
              <div className="mt-4 h-3 rounded-full bg-white/15 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400 transition-all" style={{ width: `${invitedPct}%` }} />
              </div>
              <p className="text-sm text-white/70 mt-2">{Math.min(growth.invited, VERIFIED_AT)} de {VERIFIED_AT} convidados validados</p>

              <button onClick={copyCode} className="mt-4 w-full h-14 rounded-2xl bg-white/10 flex items-center justify-between px-4 active:bg-white/20">
                <span className="text-lg font-extrabold tracking-wider">{code}</span>
                <Copy className="w-5 h-5 text-white/80" />
              </button>
              <button onClick={doShare} className="mt-3 w-full h-14 rounded-2xl bg-blue-600 text-white text-base font-extrabold flex items-center justify-center gap-2 active:bg-blue-700">
                <Share2 className="w-5 h-5" /> Compartilhar convite
              </button>
              <p className="text-xs text-white/60 mt-3 leading-relaxed">
                Convidado validado é quem entra pelo seu link, termina o cadastro e faz a primeira ação no app.
              </p>
            </div>

            {growth.referredBy && (
              <div className="rounded-2xl bg-blue-50 text-blue-900 px-4 py-3 text-[15px]">
                Você entrou pelo código <b>{growth.referredBy}</b>.
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-extrabold text-zinc-900">Recompensas</h3>
                <button onClick={() => setHowOpen(true)} className="h-9 px-4 rounded-full bg-blue-50 text-blue-700 text-sm font-bold active:bg-blue-100">Como funciona</button>
              </div>
              <HowItWorks open={howOpen} onClose={() => setHowOpen(false)} />
              <div className="space-y-2">
                {REWARD_TIERS.map((t) => {
                  const ok = growth.invited >= t.at;
                  return (
                    <div key={t.title} className={`flex items-center gap-3 rounded-2xl p-3 ${ok ? 'bg-amber-50 ring-1 ring-amber-200' : 'bg-zinc-50'}`}>
                      <div className="w-12 flex justify-center"><Seal kind={t.at === 3 ? 'destaque' : t.at === VERIFIED_AT ? 'verificado' : 'embaixador'} size={44} locked={!ok} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-extrabold text-zinc-900">{t.title}</p>
                        <p className="text-sm text-zinc-500 leading-snug">{t.sub}</p>
                      </div>
                      <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${ok ? 'bg-amber-300 text-amber-950' : 'bg-zinc-200 text-zinc-600'}`}>
                        {ok ? 'Liberado' : `${Math.max(0, t.at - growth.invited)} faltam`}
                      </span>
                    </div>
                  );
                })}
                <div className={`flex items-center gap-3 rounded-2xl p-3 ${growth.founderNumber ? 'bg-amber-50 ring-1 ring-amber-200' : 'bg-zinc-50'}`}>
                  <div className="w-12 flex justify-center"><Seal kind="fundador" size={44} locked={!growth.founderNumber} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-extrabold text-zinc-900">Fundador</p>
                    <p className="text-sm text-zinc-500 leading-snug">Só os {FOUNDER_LIMIT} primeiros cidadãos. Número fica pra sempre no seu perfil.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-zinc-900 mb-3">Veio pelo seu código</h3>
              {invitees.length === 0 ? (
                <div className="rounded-2xl bg-zinc-50 px-4 py-6 text-center">
                  <p className="text-[15px] font-bold text-zinc-900">Ninguém ainda</p>
                  <p className="text-sm text-zinc-500 mt-1">Mande o convite no grupo da rua e no status. Cada nome aparece aqui.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 rounded-2xl bg-zinc-50">
                  {invitees.map((i) => (
                    <div key={i.name + i.at} className="flex items-center gap-3 px-4 py-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">{i.name.charAt(0)}</div>
                      <p className="flex-1 text-base font-bold text-zinc-900 truncate">{i.name}</p>
                      <span className="text-xs text-zinc-500">{new Date(i.at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* RANKING */}
        {tab === 'classificacao' && (
          <div className="pt-5">
            <div className="px-4 pb-3">
              <h3 className="text-xl font-extrabold text-zinc-900">{rankMode === 'pontos' ? 'Quem mais ajuda Sobradinho' : 'Quem mais chama gente'}</h3>
              <p className="text-[15px] text-zinc-500">{rankMode === 'pontos' ? 'Pontos por posts, anúncios e convites.' : 'Prévia com números de exemplo. Os reais entram quando o cadastro abrir.'}</p>
              <div className="flex p-1 bg-zinc-100 rounded-full mt-3">
                {(['pontos', 'convites'] as const).map((m) => (
                  <button key={m} onClick={() => { triggerHaptic('selection'); setRankMode(m); }} className={`flex-1 h-10 rounded-full text-sm font-bold ${rankMode === m ? 'bg-white text-zinc-900 shadow' : 'text-zinc-500'}`}>
                    {m === 'pontos' ? 'Pontos' : 'Convites'}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-zinc-100">
              {(rankMode === 'pontos' ? rankingList.map((c) => ({ ...c, pos: c.rank, invites: 0 })) : inviteRanking).map((c) => (
                <div key={c.id} className={`flex items-center gap-3 px-4 py-3 min-h-[68px] ${c.isCurrentUser ? 'bg-blue-50' : ''}`}>
                  <span className={`w-8 text-center text-lg font-extrabold ${c.pos <= 3 ? 'text-amber-500' : 'text-zinc-400'}`}>{c.pos}</span>
                  <div className="w-11 h-11 rounded-full bg-zinc-200 text-zinc-700 font-bold flex items-center justify-center overflow-hidden shrink-0">
                    {c.avatarUrl ? <img src={c.avatarUrl} alt="" className="w-full h-full object-cover" /> : c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-zinc-900 truncate flex items-center gap-1.5">
                      <span className="truncate">{c.name}{c.isCurrentUser ? ' (você)' : ''}</span>
                      {rankMode === 'convites' && c.invites >= VERIFIED_AT && <VerifiedBadge className="w-4 h-4 shrink-0" />}
                    </p>
                    <p className="text-sm text-zinc-500 truncate">{c.neighborhood} · {c.badge}</p>
                  </div>
                  <span className="text-base font-extrabold text-blue-600">{rankMode === 'pontos' ? c.points : `${c.invites} 👥`}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SALVOS */}
        {tab === 'salvos' && (
          <div className="pt-5 px-4">
            {savedPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-zinc-100 mx-auto flex items-center justify-center"><Bookmark className="w-7 h-7 text-zinc-400" /></div>
                <p className="text-lg font-bold text-zinc-900 mt-4">Nada salvo ainda</p>
                <p className="text-[15px] text-zinc-500 mt-1">Toque no marcador de um post para guardar aqui.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedPosts.map((p) => (
                  <div key={p.id} className="flex gap-3 rounded-2xl bg-zinc-50 p-3">
                    {p.imageUrl && <img src={p.imageUrl} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" loading="lazy" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-zinc-900 truncate">{p.authorName}</p>
                      <p className="text-sm text-zinc-600 line-clamp-2">{p.content}</p>
                      <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {p.likesCount}</p>
                    </div>
                    <button onClick={() => { triggerHaptic('selection'); onUnsavePost(p.id); }} aria-label="Remover dos salvos" className="w-11 h-11 -mr-1 rounded-full flex items-center justify-center text-zinc-900 active:bg-zinc-200 shrink-0">
                      <Bookmark className="w-6 h-6 fill-zinc-900" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AJUSTES */}
        {tab === 'configuracoes' && (
          <div className="pt-5 px-4 space-y-6">
            <section>
              <h3 className="px-1 mb-2 text-sm font-bold uppercase tracking-wide text-zinc-400">Notificações</h3>
              <div className="rounded-3xl bg-white ring-1 ring-zinc-100 divide-y divide-zinc-100 overflow-hidden">
                {toggle('notifyAlerts', <Bell className="w-5 h-5" />, 'Avisos importantes', 'Barragem, segurança e comunicados da cidade')}
                {toggle('notifyNeighborhood', <MapPin className="w-5 h-5" />, 'Meu bairro', `Quando vizinhos postarem em ${userNeighborhood}`)}
                {toggle('notifyPolls', <Users className="w-5 h-5" />, 'Enquetes', 'Quando abrir uma nova votação')}
                {toggle('notifyInvites', <Share2 className="w-5 h-5" />, 'Convites', 'Quando alguém entrar pelo seu código')}
                <Row icon={<Smartphone className="w-5 h-5" />} title="Ativar no aparelho" sub="Permitir notificações do navegador" right={<ChevronRight className="w-5 h-5 text-zinc-400" />} onClick={askNotifications} />
              </div>
            </section>

            <section>
              <h3 className="px-1 mb-2 text-sm font-bold uppercase tracking-wide text-zinc-400">Experiência</h3>
              <div className="rounded-3xl bg-white ring-1 ring-zinc-100 divide-y divide-zinc-100 overflow-hidden">
                {toggle('haptics', <Zap className="w-5 h-5" />, 'Vibração', 'Toque de resposta ao curtir e publicar')}
                {toggle('sounds', <Volume2 className="w-5 h-5" />, 'Sons', 'Sons leves nas ações importantes')}
                {toggle('reduceMotion', <Zap className="w-5 h-5" />, 'Reduzir animações', 'Menos movimento na tela')}
              </div>
            </section>

            <section>
              <h3 className="px-1 mb-2 text-sm font-bold uppercase tracking-wide text-zinc-400">Privacidade</h3>
              <div className="rounded-3xl bg-white ring-1 ring-zinc-100 divide-y divide-zinc-100 overflow-hidden">
                {toggle('showWhatsappPublic', <Smartphone className="w-5 h-5" />, 'Mostrar meu WhatsApp', 'Aparece nos seus anúncios e serviços')}
                <Row icon={<Shield className="w-5 h-5" />} title="Política de privacidade" right={<ChevronRight className="w-5 h-5 text-zinc-400" />} onClick={() => setSheet('privacy')} />
                <Row icon={<FileText className="w-5 h-5" />} title="Termos de uso" right={<ChevronRight className="w-5 h-5 text-zinc-400" />} onClick={() => setSheet('terms')} />
              </div>
            </section>

            <section>
              <h3 className="px-1 mb-2 text-sm font-bold uppercase tracking-wide text-zinc-400">Conta</h3>
              <div className="rounded-3xl bg-white ring-1 ring-zinc-100 divide-y divide-zinc-100 overflow-hidden">
                <Row icon={<Pencil className="w-5 h-5" />} title="Editar perfil" sub="Nome, bairro, bio e WhatsApp" right={<ChevronRight className="w-5 h-5 text-zinc-400" />} onClick={() => setSheet('edit')} />
                <Row icon={<Share2 className="w-5 h-5" />} title="Convidar amigos" sub={code} right={<ChevronRight className="w-5 h-5 text-zinc-400" />} onClick={doShare} />
                <Row icon={<RotateCcw className="w-5 h-5 text-red-500" />} title="Restaurar dados locais" sub="Apaga posts, ajustes e perfil deste aparelho" onClick={() => setSheet('reset')} />
              </div>
            </section>

            <p className="text-center text-sm text-zinc-400">Sobradinho Online · versão 3.0</p>
          </div>
        )}
      </div>

      {/* Editar perfil */}
      <Sheet open={sheet === 'edit'} onClose={() => setSheet(null)} title="Editar perfil">
        <div className="space-y-4 pt-2">
          {[
            { label: 'Nome', value: nameInput, set: setNameInput, ph: 'Seu nome' },
            { label: 'Bairro', value: hoodInput, set: setHoodInput, ph: 'Seu bairro' },
            { label: 'WhatsApp', value: wppInput, set: setWppInput, ph: '(74) 99999-9999' },
          ].map((f) => (
            <label key={f.label} className="block">
              <span className="text-sm font-bold text-zinc-700">{f.label}</span>
              <input value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.ph} className="mt-1.5 w-full h-14 rounded-2xl bg-zinc-100 px-4 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </label>
          ))}
          <label className="block">
            <span className="text-sm font-bold text-zinc-700">Bio</span>
            <textarea value={bioInput} onChange={(e) => setBioInput(e.target.value)} rows={3} maxLength={140} className="mt-1.5 w-full rounded-2xl bg-zinc-100 px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none" />
            <span className="text-xs text-zinc-400">{bioInput.length}/140</span>
          </label>
          <button onClick={saveProfile} className="w-full h-14 rounded-2xl bg-blue-600 text-white text-base font-extrabold active:bg-blue-700">Salvar</button>
        </div>
      </Sheet>

      <Sheet open={sheet === 'terms'} onClose={() => setSheet(null)} title="Termos de uso">
        <div className="space-y-3 text-[15px] text-zinc-700 leading-relaxed">{POLICY_TERMS.map((t) => <p key={t}>{t}</p>)}</div>
      </Sheet>
      <Sheet open={sheet === 'privacy'} onClose={() => setSheet(null)} title="Privacidade">
        <div className="space-y-3 text-[15px] text-zinc-700 leading-relaxed">{POLICY_PRIVACY.map((t) => <p key={t}>{t}</p>)}</div>
      </Sheet>

      <Sheet open={sheet === 'reset'} onClose={() => setSheet(null)} title="Apagar dados locais?">
        <p className="text-[15px] text-zinc-600 leading-relaxed">Isso apaga posts, ajustes, convites e perfil salvos neste aparelho. Não dá para desfazer.</p>
        <div className="grid grid-cols-2 gap-3 mt-5">
          <button onClick={() => setSheet(null)} className="h-14 rounded-2xl bg-zinc-100 text-zinc-900 font-bold active:bg-zinc-200">Cancelar</button>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="h-14 rounded-2xl bg-red-600 text-white font-extrabold active:bg-red-700">Apagar</button>
        </div>
      </Sheet>
    </div>
  );
};
