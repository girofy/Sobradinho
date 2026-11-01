import { readSettings } from '../lib/settings';

/** Vibração (e som leve) respeitando os Ajustes do usuário. */
let audioCtx: AudioContext | null = null;
function tick(freq: number, ms: number) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.frequency.value = freq;
    o.type = 'sine';
    g.gain.value = 0.04;
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + ms / 1000);
  } catch {}
}

export function useHaptics() {
  const triggerHaptic = (type: 'light' | 'medium' | 'success' | 'selection' = 'light') => {
    if (typeof window === 'undefined') return;
    const { haptics, sounds } = readSettings();
    if (sounds && (type === 'medium' || type === 'success')) tick(type === 'success' ? 880 : 520, 70);
    if (!haptics || !('vibrate' in navigator)) return;
    try {
      const map = { light: 10, medium: 25, selection: 8, success: [15, 40, 20] } as const;
      navigator.vibrate(map[type] as number | number[]);
    } catch {}
  };
  return { triggerHaptic };
}
