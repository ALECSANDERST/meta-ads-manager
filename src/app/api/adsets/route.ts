import { NextRequest, NextResponse } from "next/server";
import metaApi from "@/lib/meta-api";

export async function GET(req: NextRequest) {
  try {
    const campaignId = req.nextUrl.searchParams.get("campaign_id") || undefined;
    const adSets = await metaApi.getAdSets(campaignId);
    return NextResponse.json({ data: adSets });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro ao buscar conjuntos de anúncios";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...params } = body;

    switch (action) {
      case "create": {
        const result = await metaApi.createAdSet(params);
        return NextResponse.json({ data: result });
      }
      case "update": {
        const { adSetId, ...updateParams } = params;
        const result = await metaApi.updateAdSet(adSetId, updateParams);
        return NextResponse.json({ data: result });
      }
      case "duplicate": {
        const result = await metaApi.duplicateAdSet(
          params.adSetId,
          params.campaignId,
          params.newName
        );
        return NextResponse.json({ data: result });
      }
      case "pause": {
        const result = await metaApi.updateAdSet(params.adSetId, { status: "PAUSED" });
        return NextResponse.json({ data: result });
      }
      case "activate": {
        const result = await metaApi.updateAdSet(params.adSetId, { status: "ACTIVE" });
        return NextResponse.json({ data: result });
      }
      default:
        return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro na operação";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
