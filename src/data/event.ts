// EVENTO EM DESTAQUE. Dados do cartaz oficial (Prefeitura de Sobradinho / SETUC).
// date e endDate: ISO. place: preencha quando a prefeitura divulgar o local (null = não aparece).
export const FEATURED_EVENT = {
  title: 'Forró do Vaqueiro',
  edition: '22ª edição',
  tagline: 'Prepara a bota. Chame sua turma.',
  date: '2026-11-13T18:00:00-03:00' as string | null,
  endDate: '2026-11-15T23:59:00-03:00' as string | null,
  place: null as string | null,
  posterSlot: 'forro-cartaz' as string | null, // public/img/forro-cartaz.jpg
  credit: 'Cartaz: Prefeitura de Sobradinho / SETUC',
  posterUrl: null as string | null, // usado só pela versão antiga (src/components)
};

/** "13 a 15 de nov." */
export function eventRange(): string {
  const e = FEATURED_EVENT;
  if (!e.date) return 'Data em breve';
  const a = new Date(e.date);
  const m = a.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  if (!e.endDate) return `${a.getDate()} de ${m}`;
  return `${a.getDate()} a ${new Date(e.endDate).getDate()} de ${m}`;
}

/** Dias que faltam (0 = é hoje / está rolando; null = já passou ou sem data). */
export function daysUntilEvent(now = Date.now()): number | null {
  const e = FEATURED_EVENT;
  if (!e.date) return null;
  const start = new Date(e.date).getTime();
  const end = e.endDate ? new Date(e.endDate).getTime() : start + 86_400_000;
  if (now > end) return null;
  if (now >= start) return 0;
  const d0 = new Date(now); d0.setHours(0, 0, 0, 0);
  const s0 = new Date(start); s0.setHours(0, 0, 0, 0);
  return Math.round((s0.getTime() - d0.getTime()) / 86_400_000);
}

export function countdownLabel(): string {
  const d = daysUntilEvent();
  if (d === null) return eventRange();
  if (d === 0) return 'É hoje!';
  if (d === 1) return 'É amanhã!';
  return `Faltam ${d} dias`;
}
