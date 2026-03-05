import { NextRequest, NextResponse } from "next/server";

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || "";
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || "";
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || "";

function maskValue(value: string): string {
  if (!value || value.length < 8) return "••••••••";
  return value.substring(0, 4) + "••••" + value.substring(value.length - 4);
}

async function setVercelEnvVar(key: string, value: string): Promise<boolean> {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) return false;
  const teamQuery = VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : "";
  const baseUrl = `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env${teamQuery}`;

  // Check if env var already exists
  const listRes = await fetch(baseUrl, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  });
  const listData = await listRes.json();
  const existing = listData.envs?.find((e: { key: string }) => e.key === key);

  if (existing) {
    // Update existing
    await fetch(`https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/env/${existing.id}${teamQuery}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value }),
    });
  } else {
    // Create new
    await fetch(baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        value,
        type: "encrypted",
        target: ["production", "preview", "development"],
      }),
    });
  }
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { meta_access_token, meta_ad_account_id, anthropic_api_key } = body;

    // Update process.env in current runtime immediately
    if (meta_access_token) process.env.META_ACCESS_TOKEN = meta_access_token;
    if (meta_ad_account_id) process.env.META_AD_ACCOUNT_ID = meta_ad_account_id;
    if (anthropic_api_key) process.env.ANTHROPIC_API_KEY = anthropic_api_key;

    // Also persist to Vercel env vars if token available (for future deploys)
    if (VERCEL_TOKEN && VERCEL_PROJECT_ID) {
      const promises: Promise<boolean>[] = [];
      if (meta_access_token) promises.push(setVercelEnvVar("META_ACCESS_TOKEN", meta_access_token));
      if (meta_ad_account_id) promises.push(setVercelEnvVar("META_AD_ACCOUNT_ID", meta_ad_account_id));
      if (anthropic_api_key) promises.push(setVercelEnvVar("ANTHROPIC_API_KEY", anthropic_api_key));
      await Promise.allSettled(promises);
    }

    const metaToken = process.env.META_ACCESS_TOKEN || "";
    const metaAccount = process.env.META_AD_ACCOUNT_ID || "";
    const claudeKey = process.env.ANTHROPIC_API_KEY || "";

    return NextResponse.json({
      success: true,
      data: {
        meta_configured: !!(metaToken && metaAccount),
        claude_configured: !!claudeKey,
        meta_account_hint: metaAccount ? maskValue(metaAccount) : null,
        meta_token_hint: metaToken ? maskValue(metaToken) : null,
        claude_key_hint: claudeKey ? maskValue(claudeKey) : null,
      },
      message: "Configurações salvas com sucesso!",
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
