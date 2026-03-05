import { NextRequest, NextResponse } from "next/server";
import { createCipheriv, createDecipheriv, randomBytes, createHash } from "crypto";

// ==================== ENCRYPTION ====================

const ALGORITHM = "aes-256-gcm";
const COOKIE_META = "metaads_meta_creds";
const COOKIE_CLAUDE = "metaads_claude_creds";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function getKey(): Buffer {
  const secret = process.env.CREDENTIALS_SECRET || "metaads-default-secret-key-2026!";
  return createHash("sha256").update(secret).digest();
}

function encrypt(text: string): string {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  let enc = cipher.update(text, "utf8", "base64");
  enc += cipher.final("base64");
  const tag = cipher.getAuthTag().toString("base64");
  return `${iv.toString("base64")}.${tag}.${enc}`;
}

function decrypt(data: string): string {
  const key = getKey();
  const [ivB64, tagB64, enc] = data.split(".");
  if (!ivB64 || !tagB64 || !enc) throw new Error("bad format");
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  let dec = decipher.update(enc, "base64", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

function maskValue(value: string): string {
  if (!value || value.length < 8) return "••••••••";
  return value.substring(0, 4) + "••••" + value.substring(value.length - 4);
}

// ==================== READ CREDS FROM REQUEST COOKIES ====================

function readCredsFromRequest(req: NextRequest): {
  meta_access_token: string;
  meta_ad_account_id: string;
  anthropic_api_key: string;
} {
  let metaToken = process.env.META_ACCESS_TOKEN || "";
  let metaAccount = process.env.META_AD_ACCOUNT_ID || "";
  let claudeKey = process.env.ANTHROPIC_API_KEY || "";

  // Read from cookies (takes priority over env)
  const metaCookie = req.cookies.get(COOKIE_META)?.value;
  const claudeCookie = req.cookies.get(COOKIE_CLAUDE)?.value;

  if (metaCookie) {
    try {
      const parsed = JSON.parse(decrypt(metaCookie));
      if (parsed.t) metaToken = parsed.t;
      if (parsed.a) metaAccount = parsed.a;
    } catch {
      // corrupted cookie
    }
  }

  if (claudeCookie) {
    try {
      claudeKey = decrypt(claudeCookie);
    } catch {
      // corrupted cookie
    }
  }

  return { meta_access_token: metaToken, meta_ad_account_id: metaAccount, anthropic_api_key: claudeKey };
}

// ==================== HANDLERS ====================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { meta_access_token, meta_ad_account_id, anthropic_api_key } = body;

    // Read existing from cookies first
    const existing = readCredsFromRequest(req);

    // Merge new values
    const finalToken = meta_access_token || existing.meta_access_token;
    const finalAccount = meta_ad_account_id || existing.meta_ad_account_id;
    const finalClaude = anthropic_api_key || existing.anthropic_api_key;

    // Build response with cookies
    const response = NextResponse.json({
      success: true,
      data: {
        meta_configured: !!(finalToken && finalAccount),
        claude_configured: !!finalClaude,
        meta_account_hint: finalAccount ? maskValue(finalAccount) : null,
        meta_token_hint: finalToken ? maskValue(finalToken) : null,
        claude_key_hint: finalClaude ? maskValue(finalClaude) : null,
      },
      message: "Configurações salvas com sucesso!",
    });

    // Save Meta creds in one cookie (token + account)
    if (finalToken || finalAccount) {
      const metaPayload = encrypt(JSON.stringify({ t: finalToken, a: finalAccount }));
      response.cookies.set(COOKIE_META, metaPayload, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      });
    }

    // Save Claude key in separate cookie
    if (finalClaude) {
      response.cookies.set(COOKIE_CLAUDE, encrypt(finalClaude), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      });
    }

    return response;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro ao salvar configurações";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const creds = readCredsFromRequest(req);

    return NextResponse.json({
      data: {
        meta_configured: !!(creds.meta_access_token && creds.meta_ad_account_id),
        claude_configured: !!creds.anthropic_api_key,
        meta_account_hint: creds.meta_ad_account_id ? maskValue(creds.meta_ad_account_id) : null,
        meta_token_hint: creds.meta_access_token ? maskValue(creds.meta_access_token) : null,
        claude_key_hint: creds.anthropic_api_key ? maskValue(creds.anthropic_api_key) : null,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro ao verificar configurações";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
