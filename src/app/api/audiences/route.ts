import { NextRequest, NextResponse } from "next/server";
import { getMetaApi } from "@/lib/get-api";

export async function GET(req: NextRequest) {
  try {
    const metaApi = await getMetaApi(req);
    const audiences = await metaApi.getCustomAudiences();
    return NextResponse.json({ data: audiences });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro ao buscar públicos";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const metaApi = await getMetaApi(req);
    const body = await req.json();
    const { action, ...params } = body;

    switch (action) {
      case "create_custom": {
        const result = await metaApi.createCustomAudience(params);
        return NextResponse.json({ data: result });
      }
      case "create_lookalike": {
        const result = await metaApi.createLookalikeAudience(params);
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
