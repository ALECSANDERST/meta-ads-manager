import { NextRequest, NextResponse } from "next/server";
import { getCredentials, buildCredentialsCookie, type StoredCredentials } from "@/lib/credentials";

function maskValue(value: string): string {
  if (!value || value.length < 8) return "••••••••";
  return value.substring(0, 4) + "••••" + value.substring(value.length - 4);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { meta_access_token, meta_ad_account_id, anthropic_api_key } = body;

    // Read existing credentials from cookie/env
    const existing = await getCredentials();

    // Merge: only overwrite if a new value is provided
    const merged: StoredCredentials = {
      meta_access_token: meta_access_token || existing.meta_access_token || "",
      meta_ad_account_id: meta_ad_account_id || existing.meta_ad_account_id || "",
      anthropic_api_key: anthropic_api_key || existing.anthropic_api_key || "",
    };

    // Save as encrypted HTTP-only cookie
    const cookie = buildCredentialsCookie(merged);

    const response = NextResponse.json({
      success: true,
      data: {
        meta_configured: !!(merged.meta_access_token && merged.meta_ad_account_id),
        claude_configured: !!merged.anthropic_api_key,
        meta_account_hint: merged.meta_ad_account_id ? maskValue(merged.meta_ad_account_id) : null,
        meta_token_hint: merged.meta_access_token ? maskValue(merged.meta_access_token) : null,
        claude_key_hint: merged.anthropic_api_key ? maskValue(merged.anthropic_api_key) : null,
      },
      message: "Configurações salvas com sucesso!",
    });

    response.cookies.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
      path: cookie.path,
      maxAge: cookie.maxAge,
    });

    return response;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro ao salvar configurações";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const creds = await getCredentials();

    const metaToken = creds.meta_access_token || "";
    const metaAccount = creds.meta_ad_account_id || "";
    const claudeKey = creds.anthropic_api_key || "";

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
