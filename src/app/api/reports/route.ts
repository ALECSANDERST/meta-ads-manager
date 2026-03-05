import { NextRequest, NextResponse } from "next/server";
import { getMetaApi } from "@/lib/get-api";

export async function POST(req: NextRequest) {
  try {
    const metaApi = await getMetaApi(req);
    const filters = await req.json();
    const reports = await metaApi.getPerformanceReport(filters);
    return NextResponse.json({ data: reports });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro ao gerar relatório";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
