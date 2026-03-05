import { NextRequest, NextResponse } from "next/server";
import { getMetaApi, getClaudeApi } from "@/lib/get-api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...params } = body;

    const metaApi = await getMetaApi(req);
    const claudeAI = await getClaudeApi(req);

    switch (action) {
      case "evaluate": {
        const results = await metaApi.evaluateBudgetRules(params.rules);
        return NextResponse.json({ data: results });
      }
      case "execute": {
        const result = await metaApi.adjustBudget(params.campaignId, params.budgetAction);
        return NextResponse.json({ data: result });
      }
      case "suggest": {
        const campaigns = await metaApi.getCampaigns();
        const reports = await metaApi.getPerformanceReport({
          level: "campaign",
          date_preset: "last_30d",
        });
        const suggestions = await claudeAI.suggestBudgetRules(campaigns, reports);
        return NextResponse.json({ data: suggestions });
      }
      default:
        return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro na operação";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
