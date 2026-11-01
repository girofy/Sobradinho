// Gera uma imagem 1080x1920 (Status/Stories) no aparelho, sem servidor.
function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const FONT = "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

export async function voteCard(opts: { kicker: string; question: string; options: string[]; mine: string; code: string }): Promise<File> {
  const W = 1080, Hh = 1920;
  const c = document.createElement('canvas');
  c.width = W; c.height = Hh;
  const ctx = c.getContext('2d')!;

  const g = ctx.createLinearGradient(0, 0, W, Hh);
  g.addColorStop(0, '#FFF7ED'); g.addColorStop(0.55, '#FFEDD5'); g.addColorStop(1, '#FED7AA');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);

  // sol e lago estilizados no rodapé
  ctx.fillStyle = '#FB923C'; ctx.globalAlpha = 0.9;
  ctx.beginPath(); ctx.arc(W / 2, Hh - 330, 170, Math.PI, 0); ctx.fill();
  ctx.globalAlpha = 1;
  const lake = ctx.createLinearGradient(0, Hh - 330, 0, Hh);
  lake.addColorStop(0, '#1D4ED8'); lake.addColorStop(1, '#0B1F4D');
  ctx.fillStyle = lake; ctx.fillRect(0, Hh - 330, W, 330);
  ctx.fillStyle = '#FDE68A';
  for (let i = 0; i < 5; i++) { ctx.globalAlpha = 0.55 - i * 0.09; roundRect(ctx, W / 2 - 150 + i * 14, Hh - 300 + i * 46, 300 - i * 28, 10, 5); ctx.fill(); }
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#EA580C';
  ctx.font = `800 40px ${FONT}`;
  ctx.fillText(opts.kicker.toUpperCase(), 90, 220);

  ctx.fillStyle = '#0B0B0F';
  ctx.font = `800 84px ${FONT}`;
  let y = 330;
  for (const l of wrap(ctx, opts.question, W - 180)) { ctx.fillText(l, 90, y); y += 98; }

  y += 40;
  for (const o of opts.options) {
    const mine = o === opts.mine;
    roundRect(ctx, 90, y, W - 180, 120, 36);
    ctx.fillStyle = mine ? '#2563EB' : 'rgba(255,255,255,.85)';
    ctx.fill();
    ctx.fillStyle = mine ? '#FFFFFF' : '#3F3F46';
    ctx.font = `${mine ? 800 : 600} 46px ${FONT}`;
    ctx.fillText((mine ? '✓  ' : '') + o, 140, y + 76);
    y += 146;
  }

  ctx.fillStyle = '#0B0B0F';
  ctx.font = `800 56px ${FONT}`;
  ctx.fillText('Eu votei. E você?', 90, y + 70);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 44px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('Sobradinho Online', W / 2, Hh - 140);
  ctx.font = `600 34px ${FONT}`;
  ctx.fillText(`Vote também · código ${opts.code}`, W / 2, Hh - 84);

  const blob: Blob = await new Promise((r) => c.toBlob((b) => r(b!), 'image/png'));
  return new File([blob], 'sobradinho-voto.png', { type: 'image/png' });
}

export function downloadFile(file: File) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
