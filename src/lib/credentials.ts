import { cookies } from "next/headers";
import { createCipheriv, createDecipheriv, randomBytes, createHash } from "crypto";

const ALGORITHM = "aes-256-gcm";
const COOKIE_NAME = "metaads_credentials";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function getEncryptionKey(): Buffer {
  const secret = process.env.CREDENTIALS_SECRET || "metaads-default-secret-key-2026!";
  return createHash("sha256").update(secret).digest();
}

export interface StoredCredentials {
  meta_access_token?: string;
  meta_ad_account_id?: string;
  anthropic_api_key?: string;
}

export function encryptCredentials(creds: StoredCredentials): string {
  const key = getEncryptionKey();
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const json = JSON.stringify(creds);
  let encrypted = cipher.update(json, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return iv.toString("hex") + ":" + authTag + ":" + encrypted;
}

export function decryptCredentials(encrypted: string): StoredCredentials {
  const key = getEncryptionKey();
  const parts = encrypted.split(":");
  if (parts.length !== 3) throw new Error("Invalid encrypted data");
  const iv = Buffer.from(parts[0], "hex");
  const authTag = Buffer.from(parts[1], "hex");
  const data = parts[2];
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
}

export async function getCredentials(): Promise<StoredCredentials> {
  // Priority: cookies > env vars
  const cookieStore = await cookies();
  const credsCookie = cookieStore.get(COOKIE_NAME);

  let fromCookies: StoredCredentials = {};
  if (credsCookie?.value) {
    try {
      fromCookies = decryptCredentials(credsCookie.value);
    } catch {
      // Cookie corrupted, ignore
    }
  }

  return {
    meta_access_token: fromCookies.meta_access_token || process.env.META_ACCESS_TOKEN || "",
    meta_ad_account_id: fromCookies.meta_ad_account_id || process.env.META_AD_ACCOUNT_ID || "",
    anthropic_api_key: fromCookies.anthropic_api_key || process.env.ANTHROPIC_API_KEY || "",
  };
}

export function buildCredentialsCookie(creds: StoredCredentials) {
  const encrypted = encryptCredentials(creds);
  return {
    name: COOKIE_NAME,
    value: encrypted,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}
