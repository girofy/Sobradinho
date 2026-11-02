// Sistema de convites, Fundador e Verificado.
// Hoje roda no aparelho. Com Firebase: contadores e vagas Fundador precisam de transação no servidor.
export const FOUNDER_LIMIT = 100; // vagas do selo Fundador (ajuste aqui)
export const VERIFIED_AT = 10; // convidados validados para ganhar o selo Verificado
export const AMBASSADOR_AT = 25;

// Escada de recompensas que NÃO custa dinheiro: só visibilidade dentro do app.
// Você precisa cumprir o que está escrito aqui (destaque, fixado, lista de embaixadores).
export const REWARD_TIERS = [
  { at: 3, emoji: '🔥', title: 'Destaque no Resolve', sub: 'Seu serviço ou anúncio em destaque por 7 dias' },
  { at: VERIFIED_AT, emoji: '✅', title: 'Selo Verificado', sub: 'Check azul ao lado do seu nome + anúncio fixado no topo por 7 dias' },
  { at: AMBASSADOR_AT, emoji: '🏅', title: 'Embaixador', sub: 'Seu nome na lista de embaixadores e primeiro a saber dos eventos' },
] as const;

// Quem entrou pelo seu código (salvo no aparelho; com Firebase vira consulta por referredBy == seu código).
const K_INVITEES = 'sobradinho_invitees_v1';
export interface Invitee { name: string; at: number }
export function readInvitees(): Invitee[] {
  if (growthCache.invitees) return growthCache.invitees;
  try { return JSON.parse(localStorage.getItem(K_INVITEES) || '[]'); } catch { return []; }
}

// PRÉVIA: números de exemplo pro ranking de convites enquanto não há cadastro real.
// Trocar por query ordenada por invitedCount no Firebase.
export const INVITE_RANKING_SEED = [14, 11, 9, 7, 5, 4, 3, 2];

// Dados reais do banco (a store preenche isto ao carregar). Enquanto vazio, cai no modo local antigo.
export interface RankRow { id: string; name: string; handle: string; hood: string; avatar?: string; verified: boolean; invites: number }
export const growthCache: { code?: string; founder?: number | null; invited?: number; invitees?: Invitee[]; ranking?: RankRow[] } = {};

const K_INVITES = 'sobradinho_invites_v1';
const K_FOUNDER = 'sobradinho_founder_no_v1';
const K_REFERRED = 'sobradinho_referred_by_v1';

export function inviteCodeFor(name: string): string {
  if (growthCache.code) return growthCache.code;
  const clean = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase();
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 90;
  return `SOB-${(clean.slice(0, 5) || 'CIDAD').padEnd(3, 'X')}${String(h + 10)}`;
}

export function inviteLink(code: string): string {
  return `${window.location.origin}${import.meta.env.BASE_URL}?c=${encodeURIComponent(code)}`;
}

export interface GrowthStats {
  invited: number;
  founderNumber: number | null;
  referredBy: string | null;
}

export function readGrowth(): GrowthStats {
  if (growthCache.code) return { invited: growthCache.invited ?? 0, founderNumber: growthCache.founder ?? null, referredBy: localStorage.getItem(K_REFERRED) };
  const n = (k: string) => {
    const v = Number(localStorage.getItem(k));
    return Number.isFinite(v) && v > 0 ? v : null;
  };
  return {
    invited: n(K_INVITES) ?? 0,
    founderNumber: n(K_FOUNDER),
    referredBy: localStorage.getItem(K_REFERRED),
  };
}

/** Lê ?c=CODIGO da URL na primeira abertura. Retorna o código capturado (ou null). */
export function captureReferral(): string | null {
  try {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('c');
    if (!code) return null;
    url.searchParams.delete('c');
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    if (localStorage.getItem(K_REFERRED)) return null;
    localStorage.setItem(K_REFERRED, code.toUpperCase().slice(0, 24));
    return code.toUpperCase();
  } catch {
    return null;
  }
}

export async function shareInvite(code: string, name: string): Promise<'shared' | 'copied' | 'failed'> {
  const url = inviteLink(code);
  const text = `${name} te chamou pro Sobradinho Online. Entra pelo meu código ${code} e vira cidadão fundador!`;
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Sobradinho Online', text, url });
      return 'shared';
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return 'copied';
  } catch {
    return 'failed';
  }
}

// Ajuda para testar sem backend: no console, __sobradinho.setInvites(10) / setFounder(3)
if (typeof window !== 'undefined' && (import.meta as any).env?.DEV) {
  (window as any).__sobradinho = {
    setInvites: (n: number) => { localStorage.setItem(K_INVITES, String(n)); location.reload(); },
    setFounder: (n: number) => { localStorage.setItem(K_FOUNDER, String(n)); location.reload(); },
  };
}
