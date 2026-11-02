# Sobradinho Online

App da cidade (React + Vite + Tailwind) com backend no **Supabase** (projeto `sobradinho-online`, região São Paulo).

## Rodar no computador
```
npm install --legacy-peer-deps
npm run dev
```

## Publicar (grátis, GitHub Pages)
1. No GitHub: **Settings > Pages > Source: GitHub Actions**.
2. Todo `git push` na `main` publica sozinho em `https://girofy.github.io/Sobradinho/`.
3. Com domínio próprio (`sobradinho.online`): Settings > Pages > Custom domain, e em Settings > Secrets and variables > Actions > Variables crie `BASE_PATH` com o valor `/`.

## Login com Google (uma vez)
1. Google Cloud Console > APIs e serviços > Credenciais > Criar ID do cliente OAuth > Aplicativo da Web.
2. Em "URIs de redirecionamento autorizados" cole: `https://inyvyqusnpphrupnfyrs.supabase.co/auth/v1/callback`
3. Supabase > Authentication > Sign In / Providers > Google: ligue e cole o Client ID e o Client Secret.
4. Supabase > Authentication > URL Configuration: Site URL = endereço do app; em Redirect URLs adicione o mesmo endereço.

## Banco de dados
- Está no Supabase (tabelas, regras de segurança RLS, gatilhos de cadastro/Fundador/convite, função de resultado de enquete).
- `supabase/04_excluir_conta.sql`: rode uma vez no SQL Editor para o botão "Excluir conta" funcionar.
- O plano grátis **não tem backup automático**. Faça um backup manual de vez em quando.
- A chave `sb_publishable_...` em `src/lib/supabase.ts` é pública de propósito. **Nunca** coloque a chave `service_role`/`secret` no código.

## O que editar antes de divulgar
| O quê | Onde |
|---|---|
| Responsável, CPF/CNPJ, e-mail nos Termos e Privacidade | `src/v2/legal.ts` |
| Local do Forró do Vaqueiro | `src/data/event.ts` (`place`) |
| Bairros reais | `src/v2/data.ts` (`HOODS`) e a enquete "Guerra dos bairros" no banco |
| Telefones da cidade (hospital, prefeitura, Coelba) | `src/v2/data.ts` (`UTILITY`) |
| Imagens | `public/img/` (nomes em `prompts-imagens-sobradinho.md`) |

## Onde cada coisa mora no código
- `src/v2/remote.ts`: toda conversa com o banco.
- `src/v2/store.tsx`: estado do app (atualiza na hora e grava no banco; recarrega a cada 30 s).
- `src/v2/Login.tsx` e `src/v2/auth.tsx`: entrada.
