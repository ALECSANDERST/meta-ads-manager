import type {
  Campaign,
  AdSet,
  Ad,
  PerformanceReport,
  CustomAudience,
  ABTest,
  BudgetRule,
} from "@/types/meta-ads";

// ==================== CAMPANHAS DEMO ====================
export const mockCampaigns: Campaign[] = [
  {
    id: "120210001",
    name: "Vendas - Black Friday 2025",
    status: "ACTIVE",
    objective: "OUTCOME_SALES",
    daily_budget: "15000",
    lifetime_budget: undefined,
    budget_remaining: "89500",
    start_time: "2025-11-15T00:00:00-0300",
    stop_time: "2025-11-30T23:59:59-0300",
    created_time: "2025-11-10T10:00:00-0300",
    updated_time: "2025-11-20T14:30:00-0300",
  },
  {
    id: "120210002",
    name: "Leads - Lançamento Curso Online",
    status: "ACTIVE",
    objective: "OUTCOME_LEADS",
    daily_budget: "8000",
    budget_remaining: "42000",
    created_time: "2025-10-01T08:00:00-0300",
    updated_time: "2025-11-20T09:00:00-0300",
  },
  {
    id: "120210003",
    name: "Tráfego - Blog Institucional",
    status: "PAUSED",
    objective: "OUTCOME_TRAFFIC",
    daily_budget: "3000",
    budget_remaining: "15000",
    created_time: "2025-09-15T12:00:00-0300",
    updated_time: "2025-11-18T16:00:00-0300",
  },
  {
    id: "120210004",
    name: "Reconhecimento - Nova Marca",
    status: "ACTIVE",
    objective: "OUTCOME_AWARENESS",
    daily_budget: "5000",
    budget_remaining: "35000",
    created_time: "2025-10-20T10:00:00-0300",
    updated_time: "2025-11-19T11:00:00-0300",
  },
  {
    id: "120210005",
    name: "Engajamento - Redes Sociais",
    status: "ACTIVE",
    objective: "OUTCOME_ENGAGEMENT",
    daily_budget: "4000",
    budget_remaining: "28000",
    created_time: "2025-10-25T09:00:00-0300",
    updated_time: "2025-11-20T08:00:00-0300",
  },
  {
    id: "120210006",
    name: "Remarketing - Carrinho Abandonado",
    status: "ACTIVE",
    objective: "OUTCOME_SALES",
    daily_budget: "10000",
    budget_remaining: "67000",
    created_time: "2025-11-01T10:00:00-0300",
    updated_time: "2025-11-20T15:00:00-0300",
  },
  {
    id: "120210007",
    name: "Vendas - Natal 2025",
    status: "PAUSED",
    objective: "OUTCOME_SALES",
    daily_budget: "20000",
    budget_remaining: "200000",
    created_time: "2025-11-18T10:00:00-0300",
    updated_time: "2025-11-20T10:00:00-0300",
  },
];

// ==================== CONJUNTOS DE ANÚNCIOS DEMO ====================
export const mockAdSets: AdSet[] = [
  {
    id: "230310001",
    name: "Público Frio - Interesse Moda 25-45",
    campaign_id: "120210001",
    status: "ACTIVE",
    daily_budget: "5000",
    billing_event: "IMPRESSIONS",
    optimization_goal: "CONVERSIONS",
    targeting: {
      age_min: 25,
      age_max: 45,
      genders: [0],
      geo_locations: { countries: ["BR"] },
      interests: [{ id: "1", name: "Moda" }, { id: "2", name: "Compras Online" }],
    },
    created_time: "2025-11-10T10:30:00-0300",
    updated_time: "2025-11-20T14:30:00-0300",
  },
  {
    id: "230310002",
    name: "Lookalike 1% - Compradores",
    campaign_id: "120210001",
    status: "ACTIVE",
    daily_budget: "5000",
    billing_event: "IMPRESSIONS",
    optimization_goal: "CONVERSIONS",
    targeting: {
      age_min: 18,
      age_max: 65,
      geo_locations: { countries: ["BR"] },
      custom_audiences: [{ id: "ca_001", name: "Lookalike 1% Compradores" }],
    },
    created_time: "2025-11-10T11:00:00-0300",
    updated_time: "2025-11-20T14:30:00-0300",
  },
  {
    id: "230310003",
    name: "Remarketing - Visitantes 30 dias",
    campaign_id: "120210006",
    status: "ACTIVE",
    daily_budget: "5000",
    billing_event: "IMPRESSIONS",
    optimization_goal: "CONVERSIONS",
    targeting: {
      age_min: 18,
      age_max: 65,
      geo_locations: { countries: ["BR"] },
      custom_audiences: [{ id: "ca_002", name: "Visitantes Site 30 dias" }],
    },
    created_time: "2025-11-01T10:30:00-0300",
    updated_time: "2025-11-20T15:00:00-0300",
  },
  {
    id: "230310004",
    name: "Público Quente - Engajamento IG",
    campaign_id: "120210005",
    status: "ACTIVE",
    daily_budget: "2000",
    billing_event: "IMPRESSIONS",
    optimization_goal: "REACH",
    targeting: {
      age_min: 18,
      age_max: 55,
      geo_locations: { countries: ["BR"] },
      custom_audiences: [{ id: "ca_003", name: "Engajamento Instagram 90 dias" }],
    },
    created_time: "2025-10-25T09:30:00-0300",
    updated_time: "2025-11-20T08:30:00-0300",
  },
  {
    id: "230310005",
    name: "Leads - Formulário Landing Page",
    campaign_id: "120210002",
    status: "ACTIVE",
    daily_budget: "8000",
    billing_event: "IMPRESSIONS",
    optimization_goal: "LEAD_GENERATION",
    targeting: {
      age_min: 22,
      age_max: 50,
      genders: [0],
      geo_locations: { countries: ["BR"] },
      interests: [{ id: "3", name: "Educação Online" }, { id: "4", name: "Marketing Digital" }],
    },
    created_time: "2025-10-01T08:30:00-0300",
    updated_time: "2025-11-20T09:30:00-0300",
  },
];

// ==================== ANÚNCIOS DEMO ====================
export const mockAds: Ad[] = [
  {
    id: "340410001",
    name: "Carrossel - Produtos em Destaque",
    adset_id: "230310001",
    campaign_id: "120210001",
    status: "ACTIVE",
    creative: { name: "Carrossel Black Friday", title: "Até 70% OFF!", body: "Aproveite as melhores ofertas da Black Friday", call_to_action_type: "SHOP_NOW" },
    created_time: "2025-11-10T11:00:00-0300",
    updated_time: "2025-11-20T14:30:00-0300",
  },
  {
    id: "340410002",
    name: "Vídeo - Unboxing Produto",
    adset_id: "230310001",
    campaign_id: "120210001",
    status: "ACTIVE",
    creative: { name: "Vídeo Unboxing", title: "Veja o que chegou!", body: "Descubra nosso novo produto", call_to_action_type: "SHOP_NOW" },
    created_time: "2025-11-10T11:30:00-0300",
    updated_time: "2025-11-20T14:30:00-0300",
  },
  {
    id: "340410003",
    name: "Imagem - Oferta Relâmpago",
    adset_id: "230310002",
    campaign_id: "120210001",
    status: "ACTIVE",
    creative: { name: "Imagem Oferta", title: "Só Hoje!", body: "Frete grátis + 50% de desconto", call_to_action_type: "SHOP_NOW" },
    created_time: "2025-11-12T10:00:00-0300",
    updated_time: "2025-11-20T14:30:00-0300",
  },
  {
    id: "340410004",
    name: "Stories - Depoimento Cliente",
    adset_id: "230310003",
    campaign_id: "120210006",
    status: "ACTIVE",
    creative: { name: "Stories Depoimento", title: "Veja o que dizem!", body: "Cliente satisfeita conta sua experiência", call_to_action_type: "LEARN_MORE" },
    created_time: "2025-11-01T11:00:00-0300",
    updated_time: "2025-11-20T15:00:00-0300",
  },
  {
    id: "340410005",
    name: "Lead Ad - Formulário Curso",
    adset_id: "230310005",
    campaign_id: "120210002",
    status: "ACTIVE",
    creative: { name: "Lead Form Curso", title: "Aprenda Marketing Digital", body: "Inscreva-se grátis na aula inaugural", call_to_action_type: "SIGN_UP" },
    created_time: "2025-10-01T09:00:00-0300",
    updated_time: "2025-11-20T09:30:00-0300",
  },
  {
    id: "340410006",
    name: "Reels - Bastidores da Marca",
    adset_id: "230310004",
    campaign_id: "120210005",
    status: "PAUSED",
    creative: { name: "Reels Bastidores", title: "Por trás das câmeras", body: "Conheça nossa equipe e nosso processo", call_to_action_type: "LEARN_MORE" },
    created_time: "2025-10-25T10:00:00-0300",
    updated_time: "2025-11-18T08:00:00-0300",
  },
];

// ==================== RELATÓRIOS DE PERFORMANCE DEMO ====================
function generateDailyReports(): PerformanceReport[] {
  const reports: PerformanceReport[] = [];
  const campaigns = [
    { id: "120210001", name: "Vendas - Black Friday 2025", baseSpend: 140, baseRoas: 4.2 },
    { id: "120210002", name: "Leads - Lançamento Curso Online", baseSpend: 75, baseRoas: 0 },
    { id: "120210004", name: "Reconhecimento - Nova Marca", baseSpend: 48, baseRoas: 0 },
    { id: "120210005", name: "Engajamento - Redes Sociais", baseSpend: 38, baseRoas: 0 },
    { id: "120210006", name: "Remarketing - Carrinho Abandonado", baseSpend: 95, baseRoas: 6.1 },
  ];

  for (let day = 29; day >= 0; day--) {
    const date = new Date();
    date.setDate(date.getDate() - day);
    const dateStr = date.toISOString().split("T")[0];

    for (const camp of campaigns) {
      const variance = 0.7 + Math.random() * 0.6;
      const spend = camp.baseSpend * variance;
      const cpm = 8 + Math.random() * 12;
      const impressions = Math.round((spend / cpm) * 1000);
      const ctr = 0.8 + Math.random() * 2.5;
      const clicks = Math.round(impressions * (ctr / 100));
      const cpc = clicks > 0 ? spend / clicks : 0;
      const convRate = camp.baseRoas > 0 ? 0.02 + Math.random() * 0.04 : 0.005 + Math.random() * 0.01;
      const conversions = Math.round(clicks * convRate);
      const roas = camp.baseRoas > 0 ? camp.baseRoas * (0.75 + Math.random() * 0.5) : 0;
      const revenue = spend * roas;
      const costPerConversion = conversions > 0 ? spend / conversions : 0;

      reports.push({
        date_start: dateStr,
        date_stop: dateStr,
        campaign_id: camp.id,
        campaign_name: camp.name,
        impressions,
        clicks,
        spend: Number(spend.toFixed(2)),
        reach: Math.round(impressions * 0.85),
        frequency: Number((impressions / Math.round(impressions * 0.85)).toFixed(2)),
        cpm: Number(cpm.toFixed(2)),
        cpc: Number(cpc.toFixed(2)),
        ctr: Number(ctr.toFixed(2)),
        conversions,
        cost_per_conversion: Number(costPerConversion.toFixed(2)),
        roas: Number(roas.toFixed(2)),
        revenue: Number(revenue.toFixed(2)),
      });
    }
  }
  return reports;
}

export const mockReports: PerformanceReport[] = generateDailyReports();

// ==================== PÚBLICOS DEMO ====================
export const mockAudiences: CustomAudience[] = [
  {
    id: "ca_001",
    name: "Compradores - Últimos 180 dias",
    description: "Pessoas que compraram nos últimos 6 meses",
    approximate_count: 45200,
    subtype: "WEBSITE",
    time_created: "2025-06-01T10:00:00-0300",
    time_updated: "2025-11-20T00:00:00-0300",
  },
  {
    id: "ca_002",
    name: "Visitantes Site - 30 dias",
    description: "Todos os visitantes do site nos últimos 30 dias",
    approximate_count: 320000,
    subtype: "WEBSITE",
    time_created: "2025-08-15T10:00:00-0300",
    time_updated: "2025-11-20T00:00:00-0300",
  },
  {
    id: "ca_003",
    name: "Engajamento Instagram - 90 dias",
    description: "Pessoas que interagiram com o perfil do Instagram",
    approximate_count: 180000,
    subtype: "ENGAGEMENT",
    time_created: "2025-09-01T10:00:00-0300",
    time_updated: "2025-11-20T00:00:00-0300",
  },
  {
    id: "ca_004",
    name: "Lookalike 1% - Compradores BR",
    description: "Público semelhante aos compradores, 1% do Brasil",
    approximate_count: 2100000,
    subtype: "USER_PROVIDED_ONLY",
    time_created: "2025-10-01T10:00:00-0300",
    time_updated: "2025-11-20T00:00:00-0300",
  },
  {
    id: "ca_005",
    name: "Lista de E-mails - Newsletter",
    description: "Assinantes da newsletter importados",
    approximate_count: 12500,
    subtype: "USER_PROVIDED_ONLY",
    time_created: "2025-07-15T10:00:00-0300",
    time_updated: "2025-11-20T00:00:00-0300",
  },
  {
    id: "ca_006",
    name: "Visualizadores de Vídeo 75%",
    description: "Pessoas que assistiram 75% ou mais dos vídeos",
    approximate_count: 95000,
    subtype: "ENGAGEMENT",
    time_created: "2025-10-10T10:00:00-0300",
    time_updated: "2025-11-20T00:00:00-0300",
  },
];

// ==================== TESTES A/B DEMO ====================
export const mockABTests: ABTest[] = [
  {
    id: "ab_001",
    name: "Criativo: Carrossel vs Vídeo",
    description: "Testar qual formato gera mais conversões na Black Friday",
    status: "RUNNING",
    variable: "CREATIVE",
    campaign_ids: ["120210001"],
    variants: [
      {
        id: "var_001",
        name: "Carrossel - Produtos",
        campaign_id: "120210001",
        weight: 50,
        metrics: { spend: 1250, impressions: 85000, clicks: 2100, conversions: 68, cpa: 18.38, roas: 4.5, ctr: 2.47 },
      },
      {
        id: "var_002",
        name: "Vídeo - Unboxing",
        campaign_id: "120210001",
        weight: 50,
        metrics: { spend: 1280, impressions: 92000, clicks: 1950, conversions: 72, cpa: 17.78, roas: 4.8, ctr: 2.12 },
      },
    ],
    start_time: "2025-11-15T00:00:00-0300",
    end_time: "2025-11-25T23:59:59-0300",
    created_at: "2025-11-14T10:00:00-0300",
  },
  {
    id: "ab_002",
    name: "Público: Interesse vs Lookalike",
    description: "Comparar segmentação por interesse vs público semelhante",
    status: "COMPLETED",
    variable: "AUDIENCE",
    campaign_ids: ["120210001"],
    variants: [
      {
        id: "var_003",
        name: "Interesse - Moda",
        campaign_id: "120210001",
        weight: 50,
        metrics: { spend: 2500, impressions: 180000, clicks: 3600, conversions: 95, cpa: 26.32, roas: 3.2, ctr: 2.0 },
      },
      {
        id: "var_004",
        name: "Lookalike 1%",
        campaign_id: "120210001",
        weight: 50,
        metrics: { spend: 2500, impressions: 165000, clicks: 4100, conversions: 135, cpa: 18.52, roas: 4.6, ctr: 2.48 },
      },
    ],
    start_time: "2025-11-01T00:00:00-0300",
    end_time: "2025-11-14T23:59:59-0300",
    winner_id: "var_004",
    confidence_level: 95,
    created_at: "2025-10-30T10:00:00-0300",
  },
];

// ==================== REGRAS DE ORÇAMENTO DEMO ====================
export const mockBudgetRules: BudgetRule[] = [
  {
    id: "rule_001",
    name: "Escalar se ROAS > 3x",
    enabled: true,
    campaign_id: "120210001",
    condition: { metric: "ROAS", operator: "GREATER_THAN", value: 3, time_window_days: 3 },
    action: { type: "INCREASE_BUDGET", value: 20, unit: "PERCENTAGE", max_budget: 500 },
    frequency: "DAILY",
    last_executed: "2025-11-20T06:00:00-0300",
    created_at: "2025-11-10T10:00:00-0300",
  },
  {
    id: "rule_002",
    name: "Reduzir se CPA > R$30",
    enabled: true,
    campaign_id: "120210001",
    condition: { metric: "CPA", operator: "GREATER_THAN", value: 30, time_window_days: 7 },
    action: { type: "DECREASE_BUDGET", value: 15, unit: "PERCENTAGE", min_budget: 50 },
    frequency: "DAILY",
    created_at: "2025-11-10T10:30:00-0300",
  },
  {
    id: "rule_003",
    name: "Pausar Remarketing se gasto > R$200/dia",
    enabled: true,
    campaign_id: "120210006",
    condition: { metric: "SPEND", operator: "GREATER_THAN", value: 200, time_window_days: 1 },
    action: { type: "PAUSE" },
    frequency: "HOURLY",
    created_at: "2025-11-01T10:00:00-0300",
  },
];
