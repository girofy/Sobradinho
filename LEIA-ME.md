# Sobradinho Online · app (beta 0.2)

O app novo está em `src/v2`. O código antigo (`src/App.tsx` e `src/components`) ficou só como referência e não é mais carregado.

## O que editar antes de lançar
| O quê | Arquivo |
| --- | --- |
| Bairros reais de Sobradinho | `src/v2/data.ts` → `HOODS` |
| Contas da equipe e posts iniciais | `src/v2/data.ts` → `HOUSE`, `seedPosts` |
| Perguntas do dia | `src/v2/data.ts` → `DAILY_QUESTIONS` |
| Telefones da cidade | `src/v2/data.ts` → `UTILITY` |
| Data, local e cartaz do Forró | `src/data/event.ts` |
| Nome, CPF/CNPJ e e-mail nos termos e privacidade | `src/v2/legal.ts` → `LEGAL` |
| Vagas de Fundador e convites pro Verificado | `src/lib/growth.ts` |
| Imagens geradas | `public/img/` (nomes no arquivo de prompts) |

## Onde entra o Firebase
Tudo hoje fica salvo no aparelho (`src/v2/store.tsx`, chave `so_v2_state`). Cada ação (`publish`, `comment`, `react`, `vote`, `report`, `addListing`, `updateMe`) é o ponto onde vai a chamada pro banco. Contagem de convites, número de Fundador, votos das enquetes e o "@ disponível" precisam ser feitos no servidor.

## Rodar
`npm install --legacy-peer-deps` · `npm run dev`
