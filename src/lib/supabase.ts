import { createClient } from '@supabase/supabase-js';

// Chave PÚBLICA (publishable): pode ficar no código. Quem protege os dados são as regras (RLS) do banco.
// NUNCA coloque aqui a chave "service_role" ou "secret".
const URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? 'https://inyvyqusnpphrupnfyrs.supabase.co';
const KEY = (import.meta.env.VITE_SUPABASE_KEY as string | undefined) ?? 'sb_publishable_4rHKYblb_8Bi6wQIC47dag_E2Bks_qq';

export const supabase = createClient(URL, KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
});
