# MetaAds Pro - Gerenciador Inteligente de Meta Ads

Sistema completo para gerenciar campanhas do Meta Ads (Facebook/Instagram) com inteligencia artificial Claude integrada.

## Funcionalidades

### Campanhas, Conjuntos e Anuncios
- Criar, duplicar, pausar/ativar e excluir campanhas
- Gerenciar conjuntos de anuncios com segmentacao detalhada
- Gerenciar anuncios com preview de criativos
- Tabelas interativas com busca e acoes em lote

### Automacao de Orcamento
- Regras automaticas baseadas em metricas (ROAS, CPA, CTR, CPM)
- Acoes: aumentar, diminuir, pausar, ativar, definir orcamento
- Sugestoes inteligentes de regras via Claude IA
- Limites min/max configuraveis

### Relatorios de Performance
- Metricas: ROAS, CPM, CTR, CPC, CPA, Conversoes, Receita
- Graficos interativos com multiplas metricas
- Cards de overview com totais consolidados
- Filtros por periodo e nivel (campanha/conjunto/anuncio)

### Publicos Personalizados e Lookalike
- Criar publicos personalizados (Website, App, Engajamento, Lista)
- Criar Lookalike de 1% a 20%, por pais
- Visualizar tamanho estimado e detalhes

### Testes A/B em Massa
- Criar testes A/B com multiplas campanhas
- Variaveis: Criativo, Publico, Posicionamento, Otimizacao
- Sugestoes de testes via Claude IA
- Visualizacao de resultados com vencedor

### Assistente Claude IA
- Chat em tempo real com contexto das campanhas
- Analise automatica de performance com recomendacoes
- Gerador de copies para anuncios (titulos, textos, CTAs)
- Sugestoes priorizadas por impacto

### Exportacao de Relatorios
- Excel (.xlsx)
- CSV (.csv) com separador ponto e virgula
- JSON (.json)
- Dados em Portugues com formatacao BR

## Tecnologias

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **UI**: TailwindCSS + Radix UI + Lucide Icons
- **Graficos**: Recharts
- **State**: Zustand
- **IA**: Anthropic Claude API (claude-sonnet-4-20250514)
- **Ads**: Meta Marketing API v21.0
- **Export**: SheetJS (xlsx)

## Inicio Rapido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variaveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env.local
```

Edite o `.env.local`:

```
META_ACCESS_TOKEN=seu_access_token_aqui
META_AD_ACCOUNT_ID=act_seu_account_id_aqui
ANTHROPIC_API_KEY=sk-ant-sua_chave_aqui
```

### 3. Iniciar o servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

> O sistema carrega dados de demonstracao automaticamente caso as API keys nao estejam configuradas.

## Como Obter as Credenciais

### Meta Ads API
1. Acesse [Facebook Developers](https://developers.facebook.com/) e crie um app
2. Adicione o produto **Marketing API**
3. No [Graph API Explorer](https://developers.facebook.com/tools/explorer/), gere um token com permissoes: `ads_management`, `ads_read`
4. Copie o ID da conta de anuncios (formato: `act_XXXXXXXXX`)

### Claude AI (Anthropic)
1. Crie uma conta em [console.anthropic.com](https://console.anthropic.com/)
2. Va em **API Keys** e crie uma nova chave
3. Copie a chave (formato: `sk-ant-...`)

## Estrutura do Projeto

```
src/
  app/
    api/             # Rotas de API (campaigns, adsets, ads, reports, audiences, budget-rules, ab-tests, ai, settings)
    layout.tsx       # Layout raiz
    page.tsx         # Pagina principal
    globals.css      # Estilos globais
  components/
    dashboard/       # Componentes do dashboard (12 paineis)
    layout/          # Sidebar e Header
    ui/              # Componentes UI base (button, card, badge, input, dialog, select, tabs, textarea)
  lib/
    meta-api.ts      # Integracao com Meta Ads API
    claude-ai.ts     # Integracao com Claude AI
    store.ts         # Estado global (Zustand)
    export.ts        # Exportacao Excel/CSV/JSON
    mock-data.ts     # Dados de demonstracao
    utils.ts         # Utilitarios
  types/
    meta-ads.ts      # Tipos TypeScript
```

## Deploy

```bash
npm run build
npm start
```

Compativel com Vercel, Netlify e qualquer plataforma que suporte Next.js.
