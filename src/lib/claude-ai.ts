import Anthropic from "@anthropic-ai/sdk";
import type {
  ClaudeAnalysis,
  ClaudeRecommendation,
  PerformanceReport,
  BudgetRule,
  Campaign,
} from "@/types/meta-ads";

const SYSTEM_PROMPT = `Você é um especialista em Meta Ads (Facebook/Instagram Ads) com anos de experiência em gestão de campanhas de performance.
Seu papel é analisar dados de campanhas, identificar oportunidades de otimização e fornecer recomendações acionáveis.

Sempre responda em Português do Brasil.
Sempre baseie suas análises em dados concretos.
Priorize recomendações por impacto potencial.
Inclua métricas específicas em suas recomendações.
Considere benchmarks do mercado brasileiro.

Formato de resposta para análises: SEMPRE retorne um JSON válido no formato:
{
  "summary": "resumo da análise",
  "recommendations": [
    {
      "type": "BUDGET|TARGETING|CREATIVE|BIDDING|SCHEDULING|GENERAL",
      "priority": "HIGH|MEDIUM|LOW",
      "title": "título curto",
      "description": "descrição detalhada da recomendação"
    }
  ],
  "risk_level": "LOW|MEDIUM|HIGH",
  "predicted_impact": "descrição do impacto previsto"
}`;

export class ClaudeAI {
  private anthropic: Anthropic;

  constructor(apiKey?: string) {
    this.anthropic = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY || "",
    });
  }

  async analyzePerformance(reports: PerformanceReport[]): Promise<ClaudeAnalysis> {
    const dataStr = JSON.stringify(reports, null, 2);
    const message = await this.anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analise os seguintes dados de performance de campanhas Meta Ads e forneça recomendações de otimização.

Dados de Performance:
${dataStr}

Analise:
1. Quais campanhas têm melhor/pior desempenho?
2. Onde há oportunidades de otimização de orçamento?
3. Quais métricas estão abaixo do benchmark?
4. Recomendações específicas para melhorar ROAS, CTR e CPA.

Retorne APENAS o JSON no formato especificado.`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") {
      try {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]) as ClaudeAnalysis;
        }
      } catch {
        // fallback
      }
    }

    return {
      summary: "Não foi possível gerar a análise automaticamente.",
      recommendations: [],
      risk_level: "LOW",
      predicted_impact: "N/A",
    };
  }

  async suggestBudgetRules(
    campaigns: Campaign[],
    reports: PerformanceReport[]
  ): Promise<BudgetRule[]> {
    const message = await this.anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Com base nos dados abaixo, sugira regras automáticas de orçamento para otimizar as campanhas.

Campanhas:
${JSON.stringify(campaigns, null, 2)}

Relatórios de Performance:
${JSON.stringify(reports, null, 2)}

Para cada campanha, sugira regras no formato JSON:
[
  {
    "id": "rule_1",
    "name": "Nome da regra",
    "enabled": true,
    "campaign_id": "id_da_campanha",
    "condition": {
      "metric": "ROAS|CPA|CTR|CPM|SPEND",
      "operator": "GREATER_THAN|LESS_THAN",
      "value": 0,
      "time_window_days": 7
    },
    "action": {
      "type": "INCREASE_BUDGET|DECREASE_BUDGET|PAUSE|ACTIVATE",
      "value": 20,
      "unit": "PERCENTAGE",
      "max_budget": 1000,
      "min_budget": 50
    },
    "frequency": "DAILY",
    "created_at": "${new Date().toISOString()}"
  }
]

Retorne APENAS o array JSON.`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") {
      try {
        const jsonMatch = content.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]) as BudgetRule[];
        }
      } catch {
        // fallback
      }
    }
    return [];
  }

  async suggestABTests(
    campaigns: Campaign[],
    reports: PerformanceReport[]
  ): Promise<{
    suggestions: {
      name: string;
      description: string;
      variable: string;
      campaign_ids: string[];
      hypothesis: string;
      expected_improvement: string;
    }[];
  }> {
    const message = await this.anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analise as campanhas e sugira testes A/B para otimização.

Campanhas:
${JSON.stringify(campaigns, null, 2)}

Performance:
${JSON.stringify(reports, null, 2)}

Sugira testes A/B no formato JSON:
{
  "suggestions": [
    {
      "name": "Nome do teste",
      "description": "Descrição",
      "variable": "CREATIVE|AUDIENCE|PLACEMENT|DELIVERY_OPTIMIZATION",
      "campaign_ids": ["id1", "id2"],
      "hypothesis": "Hipótese do teste",
      "expected_improvement": "Melhoria esperada"
    }
  ]
}

Retorne APENAS o JSON.`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") {
      try {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch {
        // fallback
      }
    }
    return { suggestions: [] };
  }

  async chat(
    userMessage: string,
    context?: { campaigns?: Campaign[]; reports?: PerformanceReport[] }
  ): Promise<string> {
    let contextStr = "";
    if (context?.campaigns) {
      contextStr += `\n\nCampanhas ativas:\n${JSON.stringify(context.campaigns.slice(0, 10), null, 2)}`;
    }
    if (context?.reports) {
      contextStr += `\n\nDados de performance recentes:\n${JSON.stringify(context.reports.slice(0, 20), null, 2)}`;
    }

    const message = await this.anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: `${SYSTEM_PROMPT}\n\nContexto atual das campanhas do usuário:${contextStr}`,
      messages: [{ role: "user", content: userMessage }],
    });

    const content = message.content[0];
    return content.type === "text" ? content.text : "Desculpe, não consegui processar sua pergunta.";
  }

  async generateAdCopy(params: {
    product: string;
    target_audience: string;
    tone: string;
    objective: string;
    variations: number;
  }): Promise<{ copies: { headline: string; body: string; cta: string }[] }> {
    const message = await this.anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Gere ${params.variations} variações de copy para anúncio no Meta Ads.

Produto/Serviço: ${params.product}
Público-alvo: ${params.target_audience}
Tom de voz: ${params.tone}
Objetivo: ${params.objective}

Retorne no formato JSON:
{
  "copies": [
    {
      "headline": "Título do anúncio (máx 40 caracteres)",
      "body": "Texto principal do anúncio (máx 125 caracteres)",
      "cta": "SHOP_NOW|LEARN_MORE|SIGN_UP|CONTACT_US|GET_OFFER"
    }
  ]
}

Retorne APENAS o JSON.`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") {
      try {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch {
        // fallback
      }
    }
    return { copies: [] };
  }
}

export const claudeAI = new ClaudeAI();
export default claudeAI;
