import { NextRequest, NextResponse } from "next/server";
import { getMetaApi } from "@/lib/get-api";

export async function GET(req: NextRequest) {
  try {
    const metaApi = await getMetaApi(req);
    const campaigns = await metaApi.getCampaigns();
    return NextResponse.json({ data: campaigns });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro ao buscar campanhas";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const metaApi = await getMetaApi(req);
    const body = await req.json();
    const { action, ...params } = body;

    switch (action) {
      case "create": {
        const result = await metaApi.createCampaign(params);
        return NextResponse.json({ data: result });
      }
      case "create_full": {
        // Step 1: Create Campaign
        const isCBO = params.campaign_budget_optimization === true;
        const campaignResult = await metaApi.createCampaign({
          name: params.name,
          objective: params.objective,
          status: params.status || "PAUSED",
          special_ad_categories: params.special_ad_categories || [],
          campaign_budget_optimization: isCBO,
          buying_type: params.buying_type || "AUCTION",
          daily_budget: isCBO && params.budget_type === "DAILY" ? params.daily_budget : undefined,
          lifetime_budget: isCBO && params.budget_type === "LIFETIME" ? params.lifetime_budget : undefined,
          bid_strategy: isCBO ? params.bid_strategy : undefined,
        });

        // Step 2: Create Ad Set
        const targeting: Record<string, unknown> = {
          age_min: params.age_min || 18,
          age_max: params.age_max || 65,
          geo_locations: {
            countries: params.countries?.length ? params.countries : ["BR"],
          },
        };
        if (params.genders?.[0] !== 0) targeting.genders = params.genders;
        if (params.placement_type === "MANUAL" && params.publisher_platforms?.length) {
          targeting.publisher_platforms = params.publisher_platforms;
          if (params.facebook_positions?.length) targeting.facebook_positions = params.facebook_positions;
          if (params.instagram_positions?.length) targeting.instagram_positions = params.instagram_positions;
        }

        // promoted_object for conversion-based objectives
        let promoted_object: Record<string, unknown> | undefined;
        if (["OUTCOME_SALES", "OUTCOME_LEADS"].includes(params.objective) && params.pixel_id) {
          promoted_object = {
            pixel_id: params.pixel_id,
            custom_event_type: params.conversion_event || "PURCHASE",
          };
        }

        const startTime = params.start_time
          ? new Date(params.start_time).toISOString()
          : new Date(Date.now() + 3600000).toISOString();
        const endTime = params.end_time
          ? new Date(params.end_time).toISOString()
          : undefined;

        const adSetResult = await metaApi.createAdSet({
          name: params.adset_name || `${params.name} - Conjunto`,
          campaign_id: campaignResult.id,
          billing_event: params.billing_event || "IMPRESSIONS",
          optimization_goal: params.optimization_goal || "CONVERSIONS",
          targeting: targeting as never,
          start_time: startTime,
          end_time: endTime,
          status: params.status || "PAUSED",
          daily_budget: !isCBO && params.budget_type === "DAILY" ? params.daily_budget : undefined,
          lifetime_budget: !isCBO && params.budget_type === "LIFETIME" ? params.lifetime_budget : undefined,
          bid_amount: params.bid_amount || undefined,
          bid_strategy: !isCBO ? params.bid_strategy : undefined,
          roas_target: params.roas_target || undefined,
          promoted_object,
          is_cbo: isCBO,
        });

        // Step 3: Create Ad (with creative)
        const destinationUrl = params.url_parameters
          ? `${params.destination_url}${params.destination_url.includes("?") ? "&" : "?"}${params.url_parameters}`
          : params.destination_url;

        const linkData: Record<string, unknown> = {
          link: destinationUrl,
          message: params.primary_text || "",
          name: params.headline || "",
          description: params.description || "",
          call_to_action: {
            type: params.call_to_action || "LEARN_MORE",
            value: { link: destinationUrl },
          },
        };
        if (params.creative_type === "IMAGE" && params.image_url) {
          linkData.picture = params.image_url;
        }
        if (params.display_link) {
          linkData.caption = params.display_link;
        }

        const objectStorySpec: Record<string, unknown> = {
          page_id: params.facebook_page_id,
          link_data: linkData,
        };
        if (params.instagram_account_id) {
          objectStorySpec.instagram_actor_id = params.instagram_account_id;
        }

        const adResult = await metaApi.createAd({
          name: params.ad_name || `${params.name} - Anúncio`,
          adset_id: adSetResult.id,
          creative: {
            name: `Creative - ${params.ad_name || params.name}`,
            object_story_spec: objectStorySpec,
          },
          status: params.status || "PAUSED",
        });

        return NextResponse.json({
          data: {
            campaign_id: campaignResult.id,
            adset_id: adSetResult.id,
            ad_id: adResult.id,
          },
        });
      }
      case "update": {
        const { campaignId, ...updateParams } = params;
        const result = await metaApi.updateCampaign(campaignId, updateParams);
        return NextResponse.json({ data: result });
      }
      case "duplicate": {
        const result = await metaApi.duplicateCampaign(
          params.campaignId,
          params.newName,
          params.status
        );
        return NextResponse.json({ data: result });
      }
      case "delete": {
        const result = await metaApi.deleteCampaign(params.campaignId);
        return NextResponse.json({ data: result });
      }
      case "pause": {
        const result = await metaApi.updateCampaign(params.campaignId, {
          status: "PAUSED",
        });
        return NextResponse.json({ data: result });
      }
      case "activate": {
        const result = await metaApi.updateCampaign(params.campaignId, {
          status: "ACTIVE",
        });
        return NextResponse.json({ data: result });
      }
      default:
        return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro na operação";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
