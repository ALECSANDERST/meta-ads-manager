import { NextRequest, NextResponse } from "next/server";
import { getMetaApi, getClaudeApi } from "@/lib/get-api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...params } = body;

    const metaApi = await getMetaApi(req);
    const claudeAI = await getClaudeApi(req);

    switch (action) {
      case "analyze": {
        const reports = await metaApi.getPerformanceReport({
          level: params.level || "campaign",
          date_preset: params.date_preset || "last_30d",
        });
        const analysis = await claudeAI.analyzePerformance(reports);
        return NextResponse.json({ data: analysis });
      }
      case "chat": {
        let context;
        try {
          const campaigns = await metaApi.getCampaigns();
          const reports = await metaApi.getPerformanceReport({
            level: "campaign",
            date_preset: "last_7d",
          });
          context = { campaigns, reports };
        } catch {
          context = undefined;
        }
        const response = await claudeAI.chat(params.message, context);
        return NextResponse.json({ data: { response } });
      }
      case "suggest_ab_tests": {
        const campaigns = await metaApi.getCampaigns();
        const reports = await metaApi.getPerformanceReport({
          level: "campaign",
          date_preset: "last_30d",
        });
        const suggestions = await claudeAI.suggestABTests(campaigns, reports);
        return NextResponse.json({ data: suggestions });
      }
      case "generate_copy": {
        const copies = await claudeAI.generateAdCopy(params);
        return NextResponse.json({ data: copies });
      }
      default:
        return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro na operação de IA";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
