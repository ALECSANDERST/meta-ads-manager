import { NextRequest, NextResponse } from "next/server";
import { getMetaApi } from "@/lib/get-api";

export async function GET(req: NextRequest) {
  try {
    const metaApi = await getMetaApi(req);
    const adSetId = req.nextUrl.searchParams.get("adset_id") || undefined;
    const ads = await metaApi.getAds(adSetId);
    return NextResponse.json({ data: ads });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro ao buscar anúncios";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const metaApi = await getMetaApi(req);
    const body = await req.json();
    const { action, ...params } = body;

    switch (action) {
      case "create": {
        const result = await metaApi.createAd(params);
        return NextResponse.json({ data: result });
      }
      case "update": {
        const { adId, ...updateParams } = params;
        const result = await metaApi.updateAd(adId, updateParams);
        return NextResponse.json({ data: result });
      }
      case "duplicate": {
        const result = await metaApi.duplicateAd(
          params.adId,
          params.adSetId,
          params.newName
        );
        return NextResponse.json({ data: result });
      }
      case "pause": {
        const result = await metaApi.updateAd(params.adId, { status: "PAUSED" });
        return NextResponse.json({ data: result });
      }
      case "activate": {
        const result = await metaApi.updateAd(params.adId, { status: "ACTIVE" });
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
