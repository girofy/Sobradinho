// Configurações do app (salvas no aparelho). Trocar por Firestore depois: ler/gravar em users/{uid}/settings.
import { useCallback, useEffect, useState } from 'react';

export interface AppSettings {
  notifyAlerts: boolean;
  notifyNeighborhood: boolean;
  notifyPolls: boolean;
  notifyInvites: boolean;
  haptics: boolean;
  sounds: boolean;
  reduceMotion: boolean;
  showWhatsappPublic: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  notifyAlerts: true,
  notifyNeighborhood: true,
  notifyPolls: true,
  notifyInvites: true,
  haptics: true,
  sounds: true,
  reduceMotion: false,
  showWhatsappPublic: true,
};

const KEY = 'sobradinho_settings_v3';

export function readSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(readSettings);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {}
    document.documentElement.dataset.reduceMotion = settings.reduceMotion ? 'true' : 'false';
  }, [settings]);

  const update = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
  }, []);

  return { settings, update };
}
