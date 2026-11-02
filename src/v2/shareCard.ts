// Cartões de compartilhar (1080x1920, formato Status/Stories), gerados no aparelho, sem servidor.
const W = 1080;
const H = 1920;
const FONT = "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const BASE = (import.meta as any).env?.BASE_URL || '/';

const cache = new Map<string, Promise<HTMLImageElement | null>>();
function loadImg(src: string): Promise<HTMLImageElement | null> {
  const url = /^(data:|blob:|https?:)/.test(src) ? src : BASE + src.replace(/^\//, '');
  if (!cache.has(url)) {
    cache.set(url, new Promise((resolve) => {
      const im = new Image();
      if (/^https?:/.test(url)) im.crossOrigin = 'anonymous';
      im.onload = () => resolve(im);
      im.onerror = () => resolve(null);
      im.src = url;
    }));
  }
  return cache.get(url)!;
}

async function ready() {
  try { await (document as any).fonts?.load(`800 40px ${FONT}`); await (document as any).fonts?.ready; } catch { /* segue com a fonte do sistema */ }
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number, maxLines = 99): string[] {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const cut = lines.slice(0, maxLines);
    let last = cut[maxLines - 1];
    while (last && ctx.measureText(last + '…').width > maxW) last = last.slice(0, -1);
    cut[maxLines - 1] = last.trimEnd() + '…';
    return cut;
  }
  return lines;
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function cover(ctx: CanvasRenderingContext2D, im: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const s = Math.max(w / im.width, h / im.height);
  const dw = im.width * s, dh = im.height * s;
  ctx.drawImage(im, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function toFile(c: HTMLCanvasElement, name: string): Promise<File> {
  return new Promise((resolve) => c.toBlob((b) => resolve(new File([b!], name, { type: 'image/png' })), 'image/png'));
}

/** Fundo comum: foto da cidade escurecida + marca no topo. */
async function stage(photo = 'img/boas-vindas.jpg') {
  await ready();
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d')!;
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = '#0B1F4D';
  ctx.fillRect(0, 0, W, H);
  const im = await loadImg(photo);
  if (im) cover(ctx, im, 0, 0, W, H);

  const shade = ctx.createLinearGradient(0, 0, 0, H);
  shade.addColorStop(0, 'rgba(8,16,40,.78)');
  shade.addColorStop(0.35, 'rgba(8,16,40,.52)');
  shade.addColorStop(0.7, 'rgba(8,16,40,.78)');
  shade.addColorStop(1, 'rgba(6,12,32,.96)');
  ctx.fillStyle = shade; ctx.fillRect(0, 0, W, H);

  // brilho quente do pôr do sol
  const glow = ctx.createRadialGradient(W * 0.85, 120, 20, W * 0.85, 120, 700);
  glow.addColorStop(0, 'rgba(251,146,60,.55)'); glow.addColorStop(1, 'rgba(251,146,60,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

  // marca
  const logo = await loadImg('img/logo.png');
  ctx.fillStyle = '#FFFFFF';
  rr(ctx, 70, 70, 116, 116, 30); ctx.fill();
  if (logo) { ctx.save(); rr(ctx, 70, 70, 116, 116, 30); ctx.clip(); ctx.drawImage(logo, 80, 80, 96, 96); ctx.restore(); }
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 44px ${FONT}`;
  ctx.fillText('Sobradinho Online', 212, 118);
  ctx.fillStyle = 'rgba(255,255,255,.72)';
  ctx.font = `600 30px ${FONT}`;
  ctx.fillText('A cidade num lugar só', 212, 160);
  return { c, ctx };
}

function pill(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, bg: string, fg: string, size = 34) {
  ctx.font = `800 ${size}px ${FONT}`;
  const w = ctx.measureText(text).width + 56;
  ctx.fillStyle = bg; rr(ctx, x, y, w, size + 40, (size + 40) / 2); ctx.fill();
  ctx.fillStyle = fg; ctx.fillText(text, x + 28, y + size + 8);
  return w;
}

function footer(ctx: CanvasRenderingContext2D, cta: string, code: string) {
  const grad = ctx.createLinearGradient(90, 0, W - 90, 0);
  grad.addColorStop(0, '#F97316'); grad.addColorStop(1, '#FBBF24');
  ctx.fillStyle = grad; rr(ctx, 90, H - 330, W - 180, 150, 75); ctx.fill();
  ctx.fillStyle = '#111827';
  ctx.font = `800 56px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(cta, W / 2, H - 252);
  ctx.font = `700 34px ${FONT}`;
  ctx.fillText(`Código ${code}`, W / 2, H - 202);
  ctx.fillStyle = 'rgba(255,255,255,.8)';
  ctx.font = `600 32px ${FONT}`;
  ctx.fillText('Link na legenda · os 100 primeiros viram Fundadores', W / 2, H - 120);
  ctx.textAlign = 'left';
}

export interface VoteCardOpts {
  kicker: string;
  question: string;
  options: string[];
  mine: string;
  code: string;
  /** porcentagens por opção (mesma ordem), quando o resultado já está liberado */
  pcts?: number[];
}

export async function voteCard(o: VoteCardOpts): Promise<File> {
  const { c, ctx } = await stage('img/boas-vindas.jpg');
  const hot = /treta/i.test(o.kicker);
  pill(ctx, hot ? '🔥 TRETA DO DIA' : o.kicker.toUpperCase(), 90, 300, hot ? '#F97316' : 'rgba(255,255,255,.18)', hot ? '#111827' : '#FFFFFF');

  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 24;
  let size = 96;
  let lines: string[] = [];
  for (; size >= 60; size -= 6) { ctx.font = `800 ${size}px ${FONT}`; lines = wrap(ctx, o.question, W - 180); if (lines.length <= 5) break; }
  let y = 470;
  for (const l of lines) { ctx.fillText(l, 90, y); y += size * 1.08; }
  ctx.shadowBlur = 0;

  y += 36;
  const n = Math.min(o.options.length, 4);
  const rowH = n > 3 ? 112 : 128;
  for (let i = 0; i < n; i++) {
    const t = o.options[i];
    const mine = t === o.mine;
    const pct = o.pcts?.[i];
    ctx.fillStyle = mine ? '#2563EB' : 'rgba(255,255,255,.14)';
    rr(ctx, 90, y, W - 180, rowH, 40); ctx.fill();
    if (!mine) { ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 3; rr(ctx, 90, y, W - 180, rowH, 40); ctx.stroke(); }
    if (pct !== undefined) {
      ctx.save(); rr(ctx, 90, y, W - 180, rowH, 40); ctx.clip();
      ctx.fillStyle = mine ? 'rgba(255,255,255,.28)' : 'rgba(251,191,36,.45)';
      ctx.fillRect(90, y, (W - 180) * (pct / 100), rowH);
      ctx.restore();
    }
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${mine ? 800 : 700} 46px ${FONT}`;
    const label = (mine ? '✓  ' : '') + t;
    ctx.fillText(label.length > 30 ? label.slice(0, 29) + '…' : label, 130, y + rowH / 2 + 16);
    if (pct !== undefined) { ctx.textAlign = 'right'; ctx.fillText(`${Math.round(pct)}%`, W - 130, y + rowH / 2 + 16); ctx.textAlign = 'left'; }
    y += rowH + 22;
  }

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 64px ${FONT}`;
  ctx.fillText('Eu votei. E você?', 90, Math.min(y + 80, H - 420));
  footer(ctx, 'Vote também', o.code);
  return toFile(c, 'sobradinho-voto.png');
}

export interface PostCardOpts {
  name: string;
  handle: string;
  text: string;
  photo?: string;
  hood?: string;
  code: string;
}

export async function postCard(o: PostCardOpts): Promise<File> {
  const { c, ctx } = await stage('img/boas-vindas.jpg');
  const ph = o.photo ? await loadImg(o.photo) : null;
  let y = 290;
  if (ph) {
    ctx.save(); rr(ctx, 90, y, W - 180, 760, 48); ctx.clip(); cover(ctx, ph, 90, y, W - 180, 760); ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 4; rr(ctx, 90, y, W - 180, 760, 48); ctx.stroke();
    y += 760 + 70;
  } else {
    ctx.fillStyle = '#FBBF24'; ctx.font = `800 220px ${FONT}`; ctx.fillText('“', 80, y + 220); y += 250;
  }

  const hasPhoto = !!ph;
  let size = hasPhoto ? 54 : 78;
  let lines: string[] = [];
  const maxLines = hasPhoto ? 5 : 9;
  for (; size >= 42; size -= 4) { ctx.font = `700 ${size}px ${FONT}`; lines = wrap(ctx, o.text, W - 180, 99); if (lines.length <= maxLines) break; }
  if (lines.length > maxLines) { ctx.font = `700 ${size}px ${FONT}`; lines = wrap(ctx, o.text, W - 180, maxLines); }
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 20;
  for (const l of lines) { ctx.fillText(l, 90, y); y += size * 1.25; }
  ctx.shadowBlur = 0;

  y = Math.min(y + 40, H - 520);
  ctx.fillStyle = '#F97316'; ctx.beginPath(); ctx.arc(130, y + 30, 40, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#111827'; ctx.font = `800 44px ${FONT}`; ctx.textAlign = 'center';
  ctx.fillText((o.name.trim()[0] || '?').toUpperCase(), 130, y + 46); ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF'; ctx.font = `800 44px ${FONT}`;
  ctx.fillText(o.name.length > 24 ? o.name.slice(0, 23) + '…' : o.name, 196, y + 28);
  ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.font = `600 32px ${FONT}`;
  ctx.fillText(`@${o.handle}${o.hood ? ' · ' + o.hood : ''}`, 196, y + 70);

  footer(ctx, 'Entra e comenta', o.code);
  return toFile(c, 'sobradinho-post.png');
}

export interface InviteCardOpts {
  name: string;
  founderNumber?: number | null;
  verified?: boolean;
  code: string;
}

export async function inviteCard(o: InviteCardOpts): Promise<File> {
  const { c, ctx } = await stage('img/pessoas.jpg');
  ctx.textAlign = 'center';
  if (o.founderNumber) {
    ctx.fillStyle = '#FBBF24'; ctx.font = `800 46px ${FONT}`;
    ctx.fillText('FUNDADOR', W / 2, 520);
    const g = ctx.createLinearGradient(0, 560, 0, 1000);
    g.addColorStop(0, '#FDE68A'); g.addColorStop(1, '#F97316');
    ctx.fillStyle = g; ctx.font = `800 400px ${FONT}`;
    ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 40;
    ctx.fillText(`#${o.founderNumber}`, W / 2, 920);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF'; ctx.font = `800 62px ${FONT}`;
    const l = wrap(ctx, `${o.name} é um dos 100 primeiros de Sobradinho Online`, W - 200);
    let y = 1060; for (const t of l) { ctx.fillText(t, W / 2, y); y += 76; }
    ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.font = `600 40px ${FONT}`;
    ctx.fillText('O número fica pra sempre no perfil.', W / 2, y + 30);
  } else {
    ctx.fillStyle = '#FFFFFF'; ctx.font = `800 100px ${FONT}`;
    ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 24;
    let y = 640;
    for (const t of ['Sobradinho', 'tá aqui.', 'E você?']) { ctx.fillText(t, W / 2, y); y += 118; }
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = `600 44px ${FONT}`;
    for (const t of wrap(ctx, `${o.name} te chamou. Os 100 primeiros viram Fundadores.`, W - 200)) { ctx.fillText(t, W / 2, y + 40); y += 58; }
  }
  ctx.textAlign = 'left';
  footer(ctx, 'Entra pelo meu código', o.code);
  return toFile(c, 'sobradinho-convite.png');
}

export function downloadFile(file: File) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
