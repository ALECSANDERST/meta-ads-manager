import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

function maskValue(value: string): string {
  if (!value || value.length < 8) return "••••••••";
  return value.substring(0, 4) + "••••" + value.substring(value.length - 4);
}

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

    // Never return actual tokens — only masked confirmation
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
    const metaToken = process.env.META_ACCESS_TOKEN || "";
    const metaAccount = process.env.META_AD_ACCOUNT_ID || "";
    const claudeKey = process.env.ANTHROPIC_API_KEY || "";

    // Never expose real values — only booleans and masked hints
    return NextResponse.json({
      data: {
        meta_configured: !!(metaToken && metaAccount),
        claude_configured: !!claudeKey,
        meta_account_hint: metaAccount ? maskValue(metaAccount) : null,
        meta_token_hint: metaToken ? maskValue(metaToken) : null,
        claude_key_hint: claudeKey ? maskValue(claudeKey) : null,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro ao verificar configurações";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
