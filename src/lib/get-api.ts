import { getCredentials } from "@/lib/credentials";
import { MetaAdsApi } from "@/lib/meta-api";
import { ClaudeAI } from "@/lib/claude-ai";

export async function getMetaApi(): Promise<MetaAdsApi> {
  const creds = await getCredentials();
  return new MetaAdsApi(creds.meta_access_token, creds.meta_ad_account_id);
}

export async function getClaudeApi(): Promise<ClaudeAI> {
  const creds = await getCredentials();
  return new ClaudeAI(creds.anthropic_api_key);
}
