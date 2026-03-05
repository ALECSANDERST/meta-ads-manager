import { MetaAdsApi } from "@/lib/meta-api";
import { ClaudeAI } from "@/lib/claude-ai";

export async function getMetaApi(): Promise<MetaAdsApi> {
  return new MetaAdsApi(
    process.env.META_ACCESS_TOKEN,
    process.env.META_AD_ACCOUNT_ID
  );
}

export async function getClaudeApi(): Promise<ClaudeAI> {
  return new ClaudeAI(process.env.ANTHROPIC_API_KEY);
}
