import { NextRequest, NextResponse } from "next/server";
import metaApi from "@/lib/meta-api";

export async function GET() {
  try {
    const campaigns = await metaApi.getCampaigns();
    return NextResponse.json({ data: campaigns });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro ao buscar campanhas";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...params } = body;

    switch (action) {
      case "create": {
        const result = await metaApi.createCampaign(params);
        return NextResponse.json({ data: result });
      }
      case "update": {
        const { campaignId, ...updateParams } = params;
        const result = await metaApi.updateCampaign(campaignId, updateParams);
        return NextResponse.json({ data: result });
      }
      case "duplicate": {
        const result = await metaApi.duplicateCampaign(
          params.campaignId,
          params.newName,
          params.status
        );
        return NextResponse.json({ data: result });
      }
      case "delete": {
        const result = await metaApi.deleteCampaign(params.campaignId);
        return NextResponse.json({ data: result });
      }
      case "pause": {
        const result = await metaApi.updateCampaign(params.campaignId, {
          status: "PAUSED",
        });
        return NextResponse.json({ data: result });
      }
      case "activate": {
        const result = await metaApi.updateCampaign(params.campaignId, {
          status: "ACTIVE",
        });
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
