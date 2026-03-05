import { NextRequest } from "next/server";
import { createDecipheriv, createHash } from "crypto";
import { MetaAdsApi } from "@/lib/meta-api";
import { ClaudeAI } from "@/lib/claude-ai";

const ALGORITHM = "aes-256-gcm";
const COOKIE_META = "metaads_meta_creds";
const COOKIE_CLAUDE = "metaads_claude_creds";

function getKey(): Buffer {
  const secret = process.env.CREDENTIALS_SECRET || "metaads-default-secret-key-2026!";
  return createHash("sha256").update(secret).digest();
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

function readCreds(req?: NextRequest): {
  metaToken: string;
  metaAccount: string;
  claudeKey: string;
} {
  let metaToken = process.env.META_ACCESS_TOKEN || "";
  let metaAccount = process.env.META_AD_ACCOUNT_ID || "";
  let claudeKey = process.env.ANTHROPIC_API_KEY || "";

  if (req) {
    const metaCookie = req.cookies.get(COOKIE_META)?.value;
    const claudeCookie = req.cookies.get(COOKIE_CLAUDE)?.value;

    if (metaCookie) {
      try {
        const parsed = JSON.parse(decrypt(metaCookie));
        if (parsed.t) metaToken = parsed.t;
        if (parsed.a) metaAccount = parsed.a;
      } catch { /* ignore */ }
    }

    if (claudeCookie) {
      try {
        claudeKey = decrypt(claudeCookie);
      } catch { /* ignore */ }
    }
  }

  return { metaToken, metaAccount, claudeKey };
}

export async function getMetaApi(req?: NextRequest): Promise<MetaAdsApi> {
  const { metaToken, metaAccount } = readCreds(req);
  return new MetaAdsApi(metaToken, metaAccount);
}

export async function getClaudeApi(req?: NextRequest): Promise<ClaudeAI> {
  const { claudeKey } = readCreds(req);
  return new ClaudeAI(claudeKey);
}
