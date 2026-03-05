import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

// Credenciais fixas — hash SHA-256 da senha para não ficar em plaintext
const ADMIN_EMAIL = "admin@metaads.pro";
const ADMIN_PASSWORD_HASH = createHash("sha256").update("MetaAds@2026!").digest("hex");
const SESSION_TOKEN_SECRET = "metaads-session-" + ADMIN_PASSWORD_HASH.substring(0, 16);

function generateSessionToken(): string {
  const payload = `${SESSION_TOKEN_SECRET}-${Date.now()}`;
  return createHash("sha256").update(payload).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const emailMatch = email.toLowerCase().trim() === ADMIN_EMAIL;
    const passwordHash = createHash("sha256").update(password).digest("hex");
    const passwordMatch = passwordHash === ADMIN_PASSWORD_HASH;

    if (!emailMatch || !passwordMatch) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }

    const sessionToken = generateSessionToken();

    const response = NextResponse.json({
      success: true,
      message: "Login realizado com sucesso.",
    });

    // Cookie HTTP-only — não acessível via JavaScript no browser
    response.cookies.set("metaads_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
