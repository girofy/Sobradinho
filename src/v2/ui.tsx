import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { Author } from './types';
import { inviteCodeFor, inviteLink } from '../lib/growth';

export function haptic(kind: 'tap' | 'pop' | 'success' = 'tap') {
  try {
    const raw = localStorage.getItem('so_v2_state');
    if (raw && JSON.parse(raw).prefs?.haptics === false) return;
    navigator.vibrate?.(kind === 'tap' ? 8 : kind === 'pop' ? 18 : [12, 40, 18]);
  } catch {}
}

export const Verified: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-label="Verificado" role="img" className="shrink-0">
    <path d="M12 1.6l2.5 1.8 3.1-.2 1 2.9 2.5 1.9-.9 3 .9 3-2.5 1.9-1 2.9-3.1-.2L12 22.4l-2.5-1.8-3.1.2-1-2.9-2.5-1.9.9-3-.9-3 2.5-1.9 1-2.9 3.1.2z" fill="#2563EB" />
    <path d="M7.9 12.3l2.7 2.7 5.5-5.6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const HouseTag: React.FC = () => (
  <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-wider text-orange-700 bg-orange-100 rounded-md px-1.5 py-0.5">Equipe</span>
);

export const NameLine: React.FC<{ a: Author; className?: string }> = ({ a, className = '' }) => (
  <span className={`flex items-center gap-1 min-w-0 ${className}`}>
    <span className="truncate">{a.name}</span>
    {a.verified && <Verified size={15} />}
    {a.house && <HouseTag />}
  </span>
);

export const Avatar: React.FC<{ a: Author; size?: number; ring?: 'story' | 'seen' | 'none'; className?: string }> = ({ a, size = 40, ring = 'none', className = '' }) => {
  const initials = a.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const inner = a.avatar ? (
    <img src={a.avatar} alt="" className="w-full h-full object-cover rounded-full" />
  ) : a.house ? (
    <HouseMark color={a.color} id={a.id} size={size} />
  ) : (
    <span className="w-full h-full rounded-full flex items-center justify-center text-white font-extrabold" style={{ background: a.color, fontSize: size * 0.38 }}>{initials || '?'}</span>
  );
  if (ring === 'none') return <span className={`block shrink-0 rounded-full overflow-hidden ${className}`} style={{ width: size, height: size }}>{inner}</span>;
  return (
    <span className={`block shrink-0 rounded-full p-[2.5px] ${ring === 'story' ? 'bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500' : 'bg-zinc-200'} ${className}`} style={{ width: size + 6, height: size + 6 }}>
      <span className="block w-full h-full rounded-full bg-white p-[2px]"><span className="block w-full h-full rounded-full overflow-hidden">{inner}</span></span>
    </span>
  );
};

/** Endereço de uma imagem da pasta public/img. No HTML único, as imagens vêm embutidas em window.__IMG. */
export function imgUrl(name: string, ext = 'jpg'): string {
  const embedded = (window as unknown as { __IMG?: Record<string, string> }).__IMG?.[`${name}.${ext}`];
  return embedded ?? `${import.meta.env.BASE_URL}img/${name}.${ext}`;
}

/** A logo oficial (pin com sol, morro do cruzeiro, barragem e rio). Nunca redesenhar: é a marca. */
export const Logo: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <img src={imgUrl('logo', 'png')} alt="Sobradinho Online" className={`object-cover ${className}`} draggable={false} />
);

const HOUSE_ICON: Record<string, string> = {
  'h-agenda': '🎉', 'h-utilidade': '📞', 'h-barragem': '📸', 'h-achados': '🔑', 'h-vagas': '💼',
};

// Avatar das contas da equipe: a conta oficial usa a logo; as outras, um ícone na cor da conta.
export const HouseMark: React.FC<{ color: string; id?: string; size?: number }> = ({ color, id, size = 40 }) => {
  if (!id || id === 'h-oficial' || !HOUSE_ICON[id]) return <Logo />;
  return <span className="w-full h-full flex items-center justify-center leading-none" style={{ background: color, fontSize: size * 0.46 }}>{HOUSE_ICON[id]}</span>;
};

/** Foto com reserva: se a imagem do slot ainda não existe em public/img, desenha uma arte no lugar. */
export const Photo: React.FC<{ src?: string; slot?: string; alt?: string; className?: string; fallback?: React.ReactNode }> = ({ src, slot, alt = '', className = '', fallback }) => {
  const url = src || (slot ? imgUrl(slot) : undefined);
  const [failed, setFailed] = useState(!url);
  useEffect(() => setFailed(!url), [url]);
  if (failed) return fallback !== undefined ? <>{fallback}</> : <ArtFallback slot={slot} className={className} />;
  return <img src={url} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
};

const ArtFallback: React.FC<{ slot?: string; className?: string }> = ({ slot, className = '' }) => (
  <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label="Imagem a caminho">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FDBA74" /><stop offset=".55" stopColor="#FB923C" /><stop offset="1" stopColor="#F59E0B" /></linearGradient>
      <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1D4ED8" /><stop offset="1" stopColor="#0B1F4D" /></linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#sky)" />
    <circle cx="200" cy="168" r="46" fill="#FEF3C7" opacity=".95" />
    <path d="M0 150 L70 128 L120 140 L180 118 L240 136 L300 120 L400 146 V180 H0z" fill="#9A3412" opacity=".55" />
    <rect y="176" width="400" height="124" fill="url(#lake)" />
    {slot === 'barragem' && <path d="M40 176 L360 176 L344 196 L56 196z" fill="#E5E7EB" opacity=".85" />}
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={150 + i * 4} y={196 + i * 18} width={100 - i * 8} height="3" rx="1.5" fill="#FDE68A" opacity={0.5 - i * 0.08} />)}
  </svg>
);

/** Tela cheia que entra deslizando da direita, com voltar. */
export const Screen: React.FC<{ title?: React.ReactNode; onBack: () => void; right?: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode; bare?: boolean }> = ({ title, onBack, right, children, footer, bare }) => (
  <div className="fixed inset-y-0 left-0 right-0 mx-auto max-w-md z-40 bg-white flex flex-col animate-screen-in shadow-2xl">
    {!bare && (
      <header className="shrink-0 h-14 px-2 flex items-center gap-1 border-b border-zinc-100 bg-white/90 backdrop-blur-xl" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <button onClick={() => { haptic(); onBack(); }} aria-label="Voltar" className="w-11 h-11 rounded-full flex items-center justify-center active:bg-zinc-100">
          <ChevronLeft className="w-7 h-7" />
        </button>
        <div className="flex-1 min-w-0 text-[17px] font-extrabold truncate">{title}</div>
        {right}
      </header>
    )}
    <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
    {footer}
  </div>
);

export const Toggle: React.FC<{ on: boolean; onChange: (v: boolean) => void; label: string }> = ({ on, onChange, label }) => (
  <button role="switch" aria-checked={on} aria-label={label} onClick={() => { haptic(); onChange(!on); }}
    className={`relative w-[52px] h-8 rounded-full transition-colors shrink-0 ${on ? 'bg-blue-600' : 'bg-zinc-300'}`}>
    <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${on ? 'left-[24px]' : 'left-1'}`} />
  </button>
);

export const Empty: React.FC<{ art: React.ReactNode; title: string; text: string; action?: React.ReactNode }> = ({ art, title, text, action }) => (
  <div className="px-8 py-12 text-center flex flex-col items-center">
    <div className="w-40">{art}</div>
    <p className="text-lg font-extrabold mt-4">{title}</p>
    <p className="text-[15px] text-zinc-500 mt-1 leading-snug max-w-xs">{text}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);

/** Compartilha sempre levando o código de convite de quem compartilhou. */
export async function shareWithCode(myName: string, text: string, say: (m: string) => void, file?: File): Promise<boolean> {
  const code = inviteCodeFor(myName);
  const url = inviteLink(code);
  const full = `${text}\n\nEntra pelo meu código ${code}:`;
  try {
    if (file && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text: `${full} ${url}` });
      return true;
    }
    if (navigator.share) {
      await navigator.share({ title: 'Sobradinho Online', text: full, url });
      return true;
    }
    await navigator.clipboard.writeText(`${full} ${url}`);
    say('Copiado! Cole no WhatsApp ou no status.');
    return true;
  } catch {
    return false;
  }
}

export function fileToDataUrl(file: File, max = 1280): Promise<string> {
  // Reduz a foto pra não estourar o armazenamento do aparelho.
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => { img.src = reader.result as string; };
    reader.onerror = reject;
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = reject;
    reader.readAsDataURL(file);
  });
}
