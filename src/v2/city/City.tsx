import React, { useMemo, useRef, useState } from 'react';
import { BarChart3, Camera, CalendarDays, ChevronRight, Phone, Search, Tag, Wrench, Plus, MessageCircle, ImagePlus, Trash2 } from 'lucide-react';
import { useStore, timeAgo } from '../store';
import { useNav } from '../nav';
import { CLASSIFIED_CATEGORIES, HOODS, SERVICE_CATEGORIES, UTILITY } from '../data';
import { Empty, Photo, Screen, fileToDataUrl, haptic, shareWithCode } from '../ui';
import { TopBar } from '../home/Home';
import { DailyQuestion, PollView } from '../home/Poll';
import { EventArt } from '../../components/EventPoster';
import { FEATURED_EVENT, countdownLabel, eventRange } from '../../data/event';
import { Sheet } from '../../components/ui/Sheet';
import type { Listing } from '../types';

const TILES = [
  { id: 'servicos', label: 'Serviços', sub: 'Quem resolve mora aqui', Icon: Wrench, bg: 'from-blue-500 to-blue-700' },
  { id: 'classificados', label: 'Classificados', sub: 'Compra, vende, desapega', Icon: Tag, bg: 'from-orange-400 to-orange-600' },
  { id: 'agenda', label: 'Agenda', sub: 'O que vai rolar', Icon: CalendarDays, bg: 'from-rose-400 to-rose-600' },
  { id: 'utilidade', label: 'Telefones úteis', sub: 'Emergência e cidade', Icon: Phone, bg: 'from-teal-500 to-teal-700' },
  { id: 'consulta', label: 'Consulta popular', sub: 'Sua opinião conta', Icon: BarChart3, bg: 'from-violet-500 to-violet-700' },
] as const;

const whenLabel = eventRange;

export const City: React.FC = () => {
  const { push } = useNav();
  return (
    <div>
      <TopBar title={<span className="text-[26px] font-extrabold tracking-tight">Cidade</span>} />
      <button onClick={() => { haptic(); push({ s: 'event' }); }} className="mx-3 mt-3 w-[calc(100%-24px)] rounded-[28px] bg-zinc-950 text-white p-3 flex items-center gap-4 text-left active:scale-[.99] transition-transform">
        <div className="w-24 shrink-0 rounded-2xl overflow-hidden"><EventArt /></div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-300">Próximo evento</p>
          <p className="text-[22px] font-extrabold leading-tight mt-1">{FEATURED_EVENT.title}</p>
          <p className="text-sm text-white/60 mt-1">{whenLabel()} · {FEATURED_EVENT.edition}</p>
          <p className="mt-2 inline-flex h-7 px-3 rounded-full bg-amber-300 text-zinc-950 text-[13px] font-extrabold items-center">{countdownLabel()}</p>
        </div>
        <ChevronRight className="w-6 h-6 text-white/50 shrink-0" />
      </button>

      <div className="grid grid-cols-2 gap-3 p-3">
        {TILES.map(({ id, label, sub, Icon, bg }, i) => (
          <button key={id} onClick={() => { haptic(); push({ s: 'city', id }); }}
            className={`rounded-[24px] bg-zinc-50 ring-1 ring-zinc-100 p-4 text-left active:scale-[.98] transition-transform ${i === 0 ? 'col-span-2 flex items-center gap-4' : ''}`}>
            <span className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${bg} text-white flex items-center justify-center shadow-md shrink-0`}><Icon className="w-6 h-6" /></span>
            <span className={`block ${i === 0 ? '' : 'mt-3'}`}>
              <span className="block text-[17px] font-extrabold">{label}</span>
              <span className="block text-[13px] text-zinc-500">{sub}</span>
            </span>
          </button>
        ))}
        <button onClick={() => { haptic(); push({ s: 'city', id: 'antigamente' }); }} className="col-span-2 rounded-[24px] bg-amber-50 ring-1 ring-amber-100 p-4 text-left active:scale-[.98] transition-transform flex items-center gap-4">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-md shrink-0"><Camera className="w-6 h-6" /></span>
          <span><span className="block text-[17px] font-extrabold">Sobradinho de antigamente</span><span className="block text-[13px] text-zinc-500">Fotos antigas mandadas pela cidade</span></span>
        </button>
        <button onClick={() => { haptic(); push({ s: 'user', id: 'h-achados' }); }} className="rounded-[24px] bg-zinc-50 ring-1 ring-zinc-100 p-4 text-left active:scale-[.98] transition-transform">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center shadow-md"><Search className="w-6 h-6" /></span>
          <span className="block mt-3 text-[17px] font-extrabold">Achados</span>
          <span className="block text-[13px] text-zinc-500">Perdeu ou achou?</span>
        </button>
      </div>
      <p className="px-6 pb-10 pt-2 text-center text-[13px] text-zinc-400">Falta alguma coisa da cidade aqui? Comente no post fixado da equipe.</p>
    </div>
  );
};

// ---------- Serviços e Classificados ----------

const ListingForm: React.FC<{ kind: Listing['kind']; open: boolean; onClose: () => void }> = ({ kind, open, onClose }) => {
  const { state, actions } = useStore();
  const cats = kind === 'servico' ? SERVICE_CATEGORIES : CLASSIFIED_CATEGORIES;
  const [f, setF] = useState({ title: '', price: '', category: cats[0], description: '', hood: state.me.hood, whatsapp: state.me.whatsapp, photo: undefined as string | undefined });
  const fileRef = useRef<HTMLInputElement>(null);
  const ok = f.title.trim().length > 2 && f.whatsapp.replace(/\D/g, '').length >= 10;
  const field = 'w-full h-14 px-4 rounded-2xl bg-zinc-100 outline-none text-[16px] focus:ring-2 focus:ring-blue-600';
  return (
    <Sheet open={open} onClose={onClose} title={kind === 'servico' ? 'Oferecer serviço' : 'Anunciar'}>
      <div className="space-y-3">
        <button onClick={() => fileRef.current?.click()} className="w-full h-32 rounded-2xl border-2 border-dashed border-zinc-300 flex items-center justify-center gap-2 text-zinc-500 font-bold overflow-hidden">
          {f.photo ? <img src={f.photo} alt="" className="w-full h-full object-cover" /> : <><ImagePlus className="w-6 h-6" /> Foto (opcional)</>}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (file) setF({ ...f, photo: await fileToDataUrl(file, 900) }); }} />
        <input className={field} placeholder={kind === 'servico' ? 'O que você faz? Ex.: Eletricista' : 'O que está vendendo?'} value={f.title} maxLength={60} onChange={(e) => setF({ ...f, title: e.target.value })} />
        <input className={field} placeholder={kind === 'servico' ? 'Preço ou "a combinar"' : 'Preço. Ex.: R$ 150'} value={f.price} maxLength={30} onChange={(e) => setF({ ...f, price: e.target.value })} />
        <div className="flex flex-wrap gap-2">{cats.map((c) => <button key={c} onClick={() => setF({ ...f, category: c })} className={`h-9 px-3.5 rounded-full text-[14px] font-semibold ${f.category === c ? 'bg-zinc-950 text-white' : 'bg-zinc-100'}`}>{c}</button>)}</div>
        <textarea className="w-full px-4 py-3 rounded-2xl bg-zinc-100 outline-none text-[16px] focus:ring-2 focus:ring-blue-600" rows={3} placeholder="Detalhes" value={f.description} maxLength={400} onChange={(e) => setF({ ...f, description: e.target.value })} />
        <select className={field} value={f.hood} onChange={(e) => setF({ ...f, hood: e.target.value })}>{HOODS.map((h) => <option key={h}>{h}</option>)}</select>
        <input className={field} inputMode="tel" placeholder="WhatsApp com DDD" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} />
        <button disabled={!ok} onClick={() => { haptic('success'); actions.addListing({ kind, ...f, title: f.title.trim(), price: f.price.trim() || 'A combinar' }); if (!state.me.whatsapp) actions.updateMe({ whatsapp: f.whatsapp }); onClose(); }}
          className="w-full h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-[17px] disabled:bg-zinc-200 disabled:text-zinc-400">Publicar grátis</button>
        {!ok && f.title && <p className="text-[13px] text-zinc-500 text-center">Coloque um WhatsApp com DDD pra pessoa falar com você.</p>}
      </div>
    </Sheet>
  );
};

export const Listings: React.FC<{ kind: Listing['kind'] }> = ({ kind }) => {
  const { state, actions, me, say } = useStore();
  const { back } = useNav();
  const cats = ['Todos', ...(kind === 'servico' ? SERVICE_CATEGORIES : CLASSIFIED_CATEGORIES)];
  const [cat, setCat] = useState('Todos');
  const [form, setForm] = useState(false);
  const items = useMemo(() => state.listings.filter((l) => l.kind === kind && (cat === 'Todos' || l.category === cat)).sort((a, b) => a.at - b.at), [state.listings, kind, cat]);
  const title = kind === 'servico' ? 'Serviços' : 'Classificados';
  const contact = (l: Listing) => {
    const n = l.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/55${n.replace(/^55/, '')}?text=${encodeURIComponent(`Oi! Vi "${l.title}" no Sobradinho Online.`)}`, '_blank');
  };
  return (
    <Screen title={title} onBack={back} right={<button onClick={() => setForm(true)} className="h-10 px-4 mr-1 rounded-full bg-blue-600 text-white font-extrabold text-[15px] flex items-center gap-1"><Plus className="w-5 h-5" /> {kind === 'servico' ? 'Oferecer' : 'Anunciar'}</button>}>
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3 border-b border-zinc-100">
        {cats.map((c) => <button key={c} onClick={() => { haptic(); setCat(c); }} className={`shrink-0 h-9 px-4 rounded-full text-[14px] font-bold ${cat === c ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-700'}`}>{c}</button>)}
      </div>
      {items.length === 0 ? (
        <Empty
          art={<ListingArt kind={kind} />}
          title={kind === 'servico' ? 'Seja o primeiro da sua área' : 'Nenhum anúncio ainda'}
          text={kind === 'servico' ? 'Quem cadastra primeiro aparece no topo quando a cidade procurar. É grátis.' : 'Desapegue do que está parado em casa. Anunciar é grátis e quem compra é vizinho.'}
          action={<button onClick={() => setForm(true)} className="h-12 px-6 rounded-full bg-zinc-950 text-white font-extrabold">{kind === 'servico' ? 'Oferecer meu serviço' : 'Anunciar agora'}</button>}
        />
      ) : (
        <div className="p-3 grid gap-3">
          {items.map((l) => (
            <div key={l.id} className="rounded-[24px] ring-1 ring-zinc-100 bg-white overflow-hidden flex">
              {l.photo && <img src={l.photo} alt="" className="w-28 object-cover shrink-0" />}
              <div className="p-4 flex-1 min-w-0">
                <p className="text-[13px] font-bold text-orange-600">{l.category} · {l.hood}</p>
                <p className="text-[17px] font-extrabold leading-tight mt-0.5">{l.title}</p>
                <p className="text-[16px] font-extrabold text-blue-600 mt-1">{l.price}</p>
                {l.description && <p className="text-sm text-zinc-600 mt-1 line-clamp-2">{l.description}</p>}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => contact(l)} className="h-10 px-4 rounded-full bg-emerald-600 text-white text-[14px] font-bold flex items-center gap-1.5"><MessageCircle className="w-4 h-4" /> WhatsApp</button>
                  <button onClick={() => shareWithCode(me.name, `${l.title} · ${l.price} no Sobradinho Online`, say)} className="h-10 px-4 rounded-full bg-zinc-100 text-[14px] font-bold">Compartilhar</button>
                  {l.authorId === 'me' && <button onClick={() => actions.removeListing(l.id)} aria-label="Apagar" className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-red-600"><Trash2 className="w-4 h-4" /></button>}
                </div>
                <p className="text-xs text-zinc-400 mt-2">{timeAgo(l.at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <ListingForm kind={kind} open={form} onClose={() => setForm(false)} />
    </Screen>
  );
};

const ListingArt: React.FC<{ kind: Listing['kind'] }> = ({ kind }) => (
  <svg viewBox="0 0 160 120" className="w-full" aria-hidden="true">
    <rect x="10" y="20" width="140" height="90" rx="22" fill={kind === 'servico' ? '#EFF6FF' : '#FFF7ED'} />
    <rect x="34" y="38" width="56" height="56" rx="14" fill={kind === 'servico' ? '#2563EB' : '#F97316'} />
    {kind === 'servico'
      ? <path d="M52 76l14-14m-6-8a8 8 0 0010 10l6 6-4 4-6-6a8 8 0 01-10-10z" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      : <path d="M50 52h22l6 6v18H50z M58 62h10" stroke="#fff" strokeWidth="4" strokeLinejoin="round" fill="none" />}
    <rect x="100" y="44" width="34" height="8" rx="4" fill="#CBD5E1" /><rect x="100" y="60" width="24" height="8" rx="4" fill="#E2E8F0" /><rect x="100" y="76" width="30" height="8" rx="4" fill="#E2E8F0" />
    <circle cx="132" cy="24" r="12" fill="#FBBF24" /><path d="M127 24l4 4 7-8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ---------- Agenda, Telefones, Consulta, Evento ----------

export const Agenda: React.FC = () => {
  const { back, push, openComposer } = useNav();
  return (
    <Screen title="Agenda" onBack={back}>
      <div className="p-3 space-y-3">
        <Photo slot="feira" alt="Feira de Sobradinho" fallback={null} className="w-full h-44 rounded-[24px]" />
        <button onClick={() => push({ s: 'event' })} className="w-full rounded-[24px] bg-zinc-950 text-white p-3 flex gap-4 text-left">
          <div className="w-28 shrink-0 rounded-2xl overflow-hidden"><EventArt /></div>
          <div className="py-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-amber-300">Destaque</p>
            <p className="text-xl font-extrabold mt-1">{FEATURED_EVENT.title}</p>
            <p className="text-sm text-white/60 mt-1">{whenLabel()}{FEATURED_EVENT.place ? ` · ${FEATURED_EVENT.place}` : ''} · {countdownLabel()}</p>
          </div>
        </button>
        <div className="rounded-[24px] bg-orange-50 ring-1 ring-orange-100 p-5">
          <p className="text-[17px] font-extrabold">Vai ter festa, culto, jogo ou feira?</p>
          <p className="text-[15px] text-zinc-600 mt-1">Divulgue de graça. A equipe confere e coloca na agenda.</p>
          <button onClick={() => openComposer('texto', 'Evento: \nData: \nLocal: \n')} className="mt-4 h-12 px-5 rounded-full bg-zinc-950 text-white font-extrabold">Divulgar evento</button>
        </div>
      </div>
    </Screen>
  );
};

export const Utility: React.FC = () => {
  const { back } = useNav();
  return (
    <Screen title="Telefones úteis" onBack={back}>
      {UTILITY.map((g) => (
        <div key={g.group} className="px-3 pt-4">
          <p className="px-2 pb-2 text-[13px] font-extrabold uppercase tracking-wider text-zinc-400">{g.group}</p>
          <div className="rounded-[24px] ring-1 ring-zinc-100 divide-y divide-zinc-100 overflow-hidden">
            {g.items.map((i) => (
              <div key={i.label} className="flex items-center gap-3 px-4 min-h-[64px]">
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-bold">{i.label}</p>
                  {i.note && <p className="text-[13px] text-zinc-400">{i.note}</p>}
                </div>
                {i.phone && <a href={`tel:${i.phone}`} className="h-11 px-4 rounded-full bg-teal-600 text-white font-extrabold flex items-center gap-2"><Phone className="w-4 h-4" /> {i.phone}</a>}
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="px-6 py-8 text-center text-[13px] text-zinc-400">Números da cidade entram aqui depois de conferidos pela equipe.</p>
    </Screen>
  );
};

export const ANTIGO_TAG = '#SobradinhoAntigo';

/** Álbum comunitário: fotos antigas mandadas pela cidade. Nostalgia gera comentário e compartilhamento. */
export const Antigamente: React.FC = () => {
  const { back, push, openComposer } = useNav();
  const { state, authorOf } = useStore();
  const posts = state.posts.filter((p) => p.text.includes(ANTIGO_TAG) && p.photo);
  const send = () => openComposer('foto', `Foto antiga de Sobradinho.\nAno (mais ou menos): \nOnde era: \nQuem aparece: \n\n${ANTIGO_TAG}`);
  return (
    <Screen title="Sobradinho de antigamente" onBack={back}
      footer={<div className="shrink-0 p-3 border-t border-zinc-100 bg-white" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}>
        <button onClick={() => { haptic('pop'); send(); }} className="w-full h-14 rounded-2xl bg-zinc-950 text-white text-[17px] font-extrabold flex items-center justify-center gap-2 active:scale-[.98]"><Camera className="w-5 h-5" /> Mandar uma foto antiga</button>
      </div>}>
      <div className="p-3">
        <div className="rounded-[28px] bg-amber-50 ring-1 ring-amber-100 p-5">
          <p className="text-[20px] font-extrabold leading-tight">A cidade lembra. Você também?</p>
          <p className="text-[15px] text-zinc-600 mt-1.5 leading-snug">Pergunte pra sua avó, abra aquela caixa de fotos, tire foto da foto. Conta o ano e onde era: a cidade inteira ajuda a reconhecer.</p>
        </div>
        {posts.length === 0 ? (
          <Empty art={<svg viewBox="0 0 160 120" aria-hidden="true"><rect x="30" y="24" width="100" height="76" rx="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" /><circle cx="64" cy="54" r="10" fill="#FBBF24" /><path d="M36 92l30-26 22 18 14-12 22 20z" fill="#D97706" opacity=".7" /></svg>}
            title="O álbum começa com você" text="Ainda não tem nenhuma foto. Seja a primeira pessoa a mostrar como era Sobradinho." />
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {posts.map((p) => (
              <button key={p.id} onClick={() => push({ s: 'post', id: p.id })} className="relative rounded-2xl overflow-hidden bg-zinc-100 aspect-square text-left">
                <img src={p.photo} alt="" className="w-full h-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white text-[12px] font-bold truncate">{authorOf(p.authorId).name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Screen>
  );
};

export const Consulta: React.FC = () => {
  const { back } = useNav();
  const { state, actions } = useStore();
  const polls = state.posts.filter((p) => p.kind === 'poll' && p.poll);
  return (
    <Screen title="Consulta popular" onBack={back}>
      <div className="px-3 pt-3"><Photo slot="comida" alt="" fallback={null} className="w-full h-40 rounded-[24px]" /></div>
      <p className="px-5 pt-4 text-[15px] text-zinc-600 leading-snug">Cada voto vira um retrato do que Sobradinho quer. Os resultados vão pra quem decide na cidade.</p>
      <DailyQuestion />
      {polls.map((p) => (
        <div key={p.id} className="mx-3 mt-3 rounded-[28px] ring-1 ring-zinc-100 p-5">
          <PollView kicker="Enquete" question={p.poll!.question} options={p.poll!.options} myVote={p.poll!.myVote} unlockAt={p.poll!.unlockAt} onVote={(id) => actions.vote(p.id, id)} />
        </div>
      ))}
      <div className="h-10" />
    </Screen>
  );
};

const GOING = 'sobradinho_event_going_v1';
export const EventScreen: React.FC = () => {
  const { back } = useNav();
  const { me, say } = useStore();
  const [going, setGoing] = useState(() => { try { return localStorage.getItem(GOING) === '1'; } catch { return false; } });
  const toggle = () => {
    const v = !going;
    setGoing(v);
    haptic(v ? 'success' : 'tap');
    try { localStorage.setItem(GOING, v ? '1' : '0'); } catch {}
    say(v ? 'Combinado! Agora chame sua turma.' : 'Tirei você da lista');
  };
  return (
    <Screen title={FEATURED_EVENT.title} onBack={back}
      footer={
        <div className="shrink-0 p-3 grid grid-cols-2 gap-2 border-t border-zinc-100 bg-white" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}>
          <button onClick={toggle} className={`h-14 rounded-2xl font-extrabold text-[17px] ${going ? 'bg-emerald-100 text-emerald-900' : 'bg-zinc-950 text-white'}`}>{going ? '✓ Eu vou' : 'Eu vou'}</button>
          <button onClick={() => shareWithCode(me.name, `${FEATURED_EVENT.title}${FEATURED_EVENT.date ? ' · ' + whenLabel() : ''}. Eu vou! Bora?`, say)} className="h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-[17px]">Chamar a turma</button>
        </div>
      }>
      <div className="p-3">
        <div className="rounded-[24px] overflow-hidden bg-zinc-100"><EventArt /></div>
        <div className="px-2 pt-4 flex items-center gap-2 flex-wrap">
          <span className="h-8 px-3 rounded-full bg-amber-300 text-zinc-950 text-[14px] font-extrabold inline-flex items-center">{countdownLabel()}</span>
          <span className="h-8 px-3 rounded-full bg-zinc-100 text-[14px] font-bold inline-flex items-center">{whenLabel()}</span>
          <span className="h-8 px-3 rounded-full bg-zinc-100 text-[14px] font-bold inline-flex items-center">{FEATURED_EVENT.edition}</span>
        </div>
        <p className="px-2 pt-3 text-[16px] text-zinc-700 leading-snug">{FEATURED_EVENT.tagline}{FEATURED_EVENT.place ? ` Local: ${FEATURED_EVENT.place}.` : ''}</p>
        <p className="px-2 pt-1 text-[12px] text-zinc-400">{FEATURED_EVENT.credit}</p>
        <div className="mx-2 mt-4 rounded-2xl bg-orange-50 p-4 text-[15px] text-zinc-700">
          Cada amigo que entra pelo seu código conta no ranking de convites e te aproxima do selo Verificado.
        </div>
      </div>
    </Screen>
  );
};
