import { NextRequest, NextResponse } from "next/server";
import metaApi from "@/lib/meta-api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...params } = body;

    switch (action) {
      case "create": {
        const result = await metaApi.createABTest(params);
        return NextResponse.json({ data: result });
      }
      case "bulk_create": {
        const results = [];
        for (const test of params.tests) {
          const result = await metaApi.createABTest(test);
          results.push(result);
        }
        return NextResponse.json({ data: results });
      }
      default:
        return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro na operação";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
