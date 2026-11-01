# Reorganização Estrutural e Arquitetura Brutalista Suíça de Sobradinho

Plano abrangente para consolidar todas as funcionalidades do app de Sobradinho em uma experiência em tela cheia de alta densidade informativa, eliminando bordas flutuantes arredondadas em prol de um design brutalista técnico suíço (raio máximo de 4px), barra de navegação com 4 abas estruturadas (Feed, Serviços, Classificados e Perfil), fluxo de publicação simplificado com foto estilo Instagram e persistência reativa completa.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> As decisões abaixo foram confirmadas diretamente na fase de alinhamento e direcionam toda a arquitetura:

- **Organização e Aproveitamento de Espaço (Full-Bleed)**: Fim do feed solto e excessivamente arredondado. Todo o layout aproveita a tela de ponta a ponta com grelhas técnicas, divisores estruturais de 1px e zero desperdício de espaço, sem poluição visual.
- **Estrutura de Navegação das Abas**: Barra inferior ancorada com exatamente 4 abas principais: **Feed** (com sub-abas "Para você", "Jornal" e "O que rolou"), **Serviços** (utilidades, transportes, comércio e saúde), **Classificados** (Desapego, imóveis, oportunidades de Sobradinho) e **Perfil** (Ranking cívico, conquistas, histórico de contribuições e configurações).
- **Publicação Simplificada Estilo Instagram**: Botão de criação rápida com preview de imagem em tempo real, seleção de bairro, legenda rápida e publicação instantânea no feed sem formulários burocráticos.
- **Paleta Visual**: Visual claro e limpo em fundo branco/zinco técnico (`#FFFFFF` / `#F4F4F5`), tipografia de alto contraste (`#09090B`), bordas técnicas sutis (`#E4E4E7` / `#D4D4D8`) e acento funcional industrial em Azul Real (`#2563EB`) ou Laranja Operacional (`#EA580C`).
- **Engenharia de Software Robusta**: Todos os botões, filtros, abas, curtidas, comentários, salvamentos e cadastros com manipuladores de eventos reais e persistência integrada em `localStorage`.

---

### 1. Overview & Core Concept

- **O que faz**: Plataforma comunitária e utilitária hiperlocal para moradores e comerciantes de Sobradinho/DF, integrando notícias de bairro, avisos cívicos urgentes, classificados de desapego, guia de serviços públicos/comerciais e gamificação cívica com ranking.
- **Público-alvo**: Cidadãos, comerciantes, prestadores de serviços e líderes comunitários de Sobradinho e região serrana do DF.
- **Proposta de Valor**: Centralização de utilidades do cotidiano em uma interface ágil e limpa, onde o morador resolve problemas do bairro, descobre o que está acontecendo e negocia localmente.

---

### 2. User Experience & Visual Design

#### Fluxos Principais do Usuário

1. **Feed e Notícias Locais**:
   - O usuário transita pelas sub-abas **"Para você"** (posts comunitários, fotos de moradores, alertas locais), **"Jornal"** (notícias editoriais e avisos da administração regional) e **"O que rolou"** (recaps semanais de melhorias e destaques da comunidade).
   - Ações imediatas em cada card: curtir, abrir comentários em gaveta rápida, favoritar e compartilhar link.
2. **Publicação Ágil (Estilo Instagram)**:
   - Acesso pelo topo ou botão de ação rápido: campo de texto simples, upload ou escolha rápida de foto com proporção 4:3 ou 1:1, seleção rápida da quadra/bairro de Sobradinho e envio em 1 toque.
3. **Serviços & Utilidades de Sobradinho**:
   - Catálogo estruturado em tabela/linhas densas: Saúde (UPA, Postos), Segurança (Delegacia, PMDF), Água/Luz (CAESB, Neoenergia), Transporte (Horários de ônibus, pontos de van/táxi) e Guia Comercial de bairros. Ações de chamada direta e mapa.
4. **Classificados & Desapego**:
   - Vitrine de produtos e serviços locais com filtros rápidos (Eletrônicos, Veículos, Imóveis/Aluguel, Serviços), cards limpos com preço destacado e contato direto via WhatsApp/Telefone. Modal simples para anunciar um item.
5. **Perfil & Ranking Cívico**:
   - Ficha do cidadão com nível, pontos acumulados por reportar problemas e ajudar vizinhos, histórico de postagens, itens salvos e tabela completa da classificação comunitária.

#### Identidade Visual & Tema

- **Diretriz Estética**: *Swiss International Typographic Style* adaptado para produto mobile utilitário. Rigor geométrico, cantos retos ou milimetricamente aparados (`rounded-none` a `rounded`, máx. 4px), tipografia nítida e informação sem firulas.
- **Paleta de Cores**:
  - Fundo principal: Branco puro (`#FFFFFF`) e cinza técnico suave (`#F4F4F5` / `bg-zinc-100`).
  - Superfícies e Cartões: Branco (`#FFFFFF`) com bordas técnicas estruturadas `border border-zinc-200`.
  - Tipografia: Preto técnico profundo (`#09090B`) e cinza de leitura (`#52525B` / `#71717A`).
  - Acento funcional: Azul Real (`#2563EB`) para ações primárias e estados ativos, e Laranja Operacional (`#EA580C`) para alertas urgentes e selos cívicos.
- **Tipografia**:
  - Títulos e marcas: Sans-serif geométrica densa com `tracking-tight` e pesos 600/700.
  - Metadados, horários, coordenadas e contadores: `font-mono tabular-nums text-xs`.
- **Zero-Pill Discipline**:
  - Metadados inline separados por pontos e barras (`Quadra 02 · há 15 min · Alerta`), sem cápsulas flutuantes decorativas.
  - Controles interativos utilizam abas segmentadas planas ou botões retangulares estruturados.

---

### 3. Key Product Decisions & Trade-Offs

- **Decisão 1: Aproveitamento de Tela Full-Bleed vs. Cards Flutuantes Arredondados**:
  - *Abordagem*: Remoção do contorno flutuante arredondado. O feed e as seções preenchem a largura do viewport com divisores sutis de 1px entre publicações.
  - *Racional*: Atende ao pedido explícito do usuário de parar de desperdiçar espaço com cantos excessivamente redondos e trazer rigor editorial suíço.
- **Decisão 2: 4 Abas Ancoradas no Rodapé (Feed, Serviços, Classificados, Perfil)**:
  - *Abordagem*: Unificação da navegação em 4 zonas claras e ergonômicas, acessíveis pelo polegar, com o botão de publicar destacado no feed e no topo.
  - *Racional*: Elimina a fragmentação entre menus secundários e centraliza as principais necessidades do morador.
- **Decisão 3: Publicação em 1 Passo (Instagram-like)**:
  - *Abordagem*: Modal direto com seleção de imagem rápida, texto do relato/anúncio, bairro e botão publicar, atualizando o estado do feed em tempo real com feedback tátil.
  - *Racional*: Elimina formulários longos com muitos campos obrigatórios, aumentando o engajamento comunitário.
- **Decisão 4: Engenharia de Software e Persistência Integrada**:
  - *Abordagem*: Camada reativa centralizando os stores de Feed, Serviços, Classificados, Ranking e Perfil do usuário em hooks com sincronização automática em `localStorage`.
  - *Racional*: Garante que curtidas, novos posts, comentários, anúncios de desapego e configurações permaneçam salvos sem necessidade de infraestrutura pesada ou dead clicks.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           App.tsx (Root Shell)                          │
├─────────────────────────────────────────────────────────────────────────┤
│  Top Bar: [Logo Sobradinho Conectada] ─ [Busca] ─ [Notificações/Perfil]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    Active View Router / Switch                    │  │
│  │                                                                   │  │
│  │  [Tab: Feed]          [Tab: Serviços]  [Tab: Classificados] [Perfil]│  │
│  │  ├── Para você        ├── Emergências  ├── Todos            ├── Bio   │  │
│  │  ├── Jornal           ├── Transporte   ├── Desapego         ├── Rank  │  │
│  │  └── O que rolou      ├── Comércio     ├── Imóveis          ├── Salvos│  │
│  │                       └── Saúde        └── Criar Anúncio    └── Config│  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  Bottom Navigation (Fixed 4 Tabs):                                      │
│  [Feed]              [Serviços]          [Classificados]        [Perfil]│
├─────────────────────────────────────────────────────────────────────────┤
│  Global Modals:                                                         │
│  ├── QuickPostModal (Instagram-style Post & Photo Composer)             │
│  ├── NewClassifiedModal (Anunciar Desapego / Vaga / Imóvel)             │
│  ├── SearchModal (Busca Unificada)                                      │
│  └── CommentsDrawer (Gaveta de Comentários do Post)                     │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Modelo de Dados e Estados

- **FeedStore**: Posts comunitários com suporte a foto (`imageUrl`), bairro, autor, contagem e lista de comentários, tags cívicas e indicador de curtido/salvo.
- **ServicesStore**: Lista categorizada de serviços essenciais de Sobradinho (CAESB, Neoenergia, UPA 24h, 13ª DP, Linhas de ônibus, Coleta de Lixo).
- **ClassifiedsStore**: Anúncios locais com preço, foto, categoria, contato e localização.
- **Profile & CivicStore**: Dados do usuário atual (nome, quadra/bairro, nível, selos cívicos e pontos de contribuição).

---

### 5. Implementation Steps

1. **Ajuste de Tipos e Modelo de Dados**:
   - Atualizar `src/types/community.ts` com as 4 abas principais (`feed`, `servicos`, `classificados`, `perfil`), modelos de anúncios classificados e estruturas simplificadas de post.
2. **Refatoração do Componente BottomNavigation**:
   - Implementar os 4 destinos estruturados com ícones utilitários e altura ergonômica de 56px, com borda superior técnica de 1px e indicador ativo.
3. **Criação da Aba de Classificados (Desapega Sobradinho)**:
   - Construir visualização de anúncios locais com filtros rápidos e modal de cadastro de item com foto e preço.
4. **Otimização do Feed em Tela Cheia (Full-Bleed)**:
   - Eliminar margens arredondadas excessivas em `FeedStream` e `PostCard`; aplicar geometria contínua de borda a borda com divisores sutis.
   - Manter as sub-abas "Para você", "Jornal" e "O que rolou" integradas no topo do feed.
5. **Simplificação do Modal de Publicação (Instagram-like)**:
   - Modernizar `NewPostModal` para focar em foto em destaque, legenda direta e seleção de bairro rápida com 1 clique.
6. **Integração Completa da Aba de Perfil e Ranking Cívico**:
   - Integrar a visualização de perfil diretamente como aba de primeira classe, com ranking, estatísticas de participação e configurações.
7. **Validação de Compilação e Testes de Integridade**:
   - Rodar `compile_applet` e verificar ausência de dead clicks em todos os botões e abas.
