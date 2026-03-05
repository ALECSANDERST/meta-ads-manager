import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { meta_access_token, meta_ad_account_id, anthropic_api_key } = body;

    const envPath = path.join(process.cwd(), ".env.local");

    let envContent = "";
    try {
      envContent = await fs.readFile(envPath, "utf-8");
    } catch {
      envContent = "";
    }

    const envLines = envContent.split("\n").filter((l) => l.trim() !== "");
    const envMap = new Map<string, string>();

    for (const line of envLines) {
      const eqIndex = line.indexOf("=");
      if (eqIndex > 0 && !line.startsWith("#")) {
        envMap.set(line.substring(0, eqIndex).trim(), line.substring(eqIndex + 1).trim());
      }
    }

    if (meta_access_token) envMap.set("META_ACCESS_TOKEN", meta_access_token);
    if (meta_ad_account_id) envMap.set("META_AD_ACCOUNT_ID", meta_ad_account_id);
    if (anthropic_api_key) envMap.set("ANTHROPIC_API_KEY", anthropic_api_key);

    if (!envMap.has("META_APP_ID")) envMap.set("META_APP_ID", "");
    if (!envMap.has("META_APP_SECRET")) envMap.set("META_APP_SECRET", "");
    if (!envMap.has("NEXT_PUBLIC_APP_URL")) envMap.set("NEXT_PUBLIC_APP_URL", "http://localhost:3000");

    const newEnv = Array.from(envMap.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    await fs.writeFile(envPath, newEnv + "\n", "utf-8");

    return NextResponse.json({
      success: true,
      message: "Configurações salvas. Reinicie o servidor para aplicar.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro ao salvar configurações";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const hasMetaToken = !!process.env.META_ACCESS_TOKEN;
    const hasMetaAccount = !!process.env.META_AD_ACCOUNT_ID;
    const hasClaudeKey = !!process.env.ANTHROPIC_API_KEY;

    return NextResponse.json({
      data: {
        meta_configured: hasMetaToken && hasMetaAccount,
        claude_configured: hasClaudeKey,
        meta_account_id: process.env.META_AD_ACCOUNT_ID
          ? `${process.env.META_AD_ACCOUNT_ID.substring(0, 8)}...`
          : null,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro ao verificar configurações";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
