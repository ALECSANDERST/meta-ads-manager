import axios, { AxiosInstance } from "axios";
import type {
  Campaign,
  AdSet,
  Ad,
  CustomAudience,
  CampaignInsights,
  MetaApiResponse,
  Targeting,
  CampaignObjective,
  AdCreative,
  LookalikeSpec,
  ReportFilters,
  PerformanceReport,
  Action,
  PurchaseRoas,
} from "@/types/meta-ads";

const META_API_VERSION = "v21.0";
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

export class MetaAdsApi {
  private client: AxiosInstance;
  private accessToken: string;
  private adAccountId: string;

  constructor(accessToken?: string, adAccountId?: string) {
    this.accessToken = accessToken || process.env.META_ACCESS_TOKEN || "";
    let acctId = adAccountId || process.env.META_AD_ACCOUNT_ID || "";
    if (acctId && !acctId.startsWith("act_")) acctId = `act_${acctId}`;
    this.adAccountId = acctId;
    this.client = axios.create({
      baseURL: META_BASE_URL,
      params: { access_token: this.accessToken },
    });
  }

  isConfigured(): boolean {
    return !!(this.accessToken && this.adAccountId);
  }

  // ==================== CAMPANHAS ====================

  async getCampaigns(fields?: string[]): Promise<Campaign[]> {
    const defaultFields = [
      "id",
      "name",
      "status",
      "objective",
      "daily_budget",
      "lifetime_budget",
      "budget_remaining",
      "start_time",
      "stop_time",
      "created_time",
      "updated_time",
    ];
    const res = await this.client.get<MetaApiResponse<Campaign>>(
      `/${this.adAccountId}/campaigns`,
      {
        params: {
          fields: (fields || defaultFields).join(","),
          limit: 100,
          effective_status: JSON.stringify(["ACTIVE", "PAUSED", "ARCHIVED", "IN_PROCESS", "WITH_ISSUES"]),
        },
      }
    );
    return res.data.data;
  }

  async getCampaign(campaignId: string): Promise<Campaign> {
    const fields = [
      "id", "name", "status", "objective", "daily_budget",
      "lifetime_budget", "budget_remaining", "start_time",
      "stop_time", "created_time", "updated_time",
    ].join(",");
    const res = await this.client.get<Campaign>(`/${campaignId}`, {
      params: { fields },
    });
    return res.data;
  }

  async createCampaign(params: {
    name: string;
    objective: CampaignObjective;
    status?: string;
    daily_budget?: number;
    lifetime_budget?: number;
    special_ad_categories?: string[];
    campaign_budget_optimization?: boolean;
    buying_type?: string;
    bid_strategy?: string;
  }): Promise<{ id: string }> {
    const body: Record<string, unknown> = {
      name: params.name,
      objective: params.objective,
      status: params.status || "PAUSED",
      special_ad_categories: params.special_ad_categories || [],
    };
    if (params.buying_type) body.buying_type = params.buying_type;
    if (params.campaign_budget_optimization !== undefined) {
      body.is_campaign_budget_optimization = params.campaign_budget_optimization;
    }
    // CBO: budget goes on campaign level
    if (params.campaign_budget_optimization) {
      if (params.daily_budget) body.daily_budget = Math.round(params.daily_budget * 100);
      if (params.lifetime_budget) body.lifetime_budget = Math.round(params.lifetime_budget * 100);
      if (params.bid_strategy) body.bid_strategy = params.bid_strategy;
    }

    const res = await this.client.post(`/${this.adAccountId}/campaigns`, body);
    return res.data;
  }

  async updateCampaign(
    campaignId: string,
    params: Partial<{
      name: string;
      status: string;
      daily_budget: number;
      lifetime_budget: number;
    }>
  ): Promise<{ success: boolean }> {
    const body: Record<string, unknown> = {};
    if (params.name) body.name = params.name;
    if (params.status) body.status = params.status;
    if (params.daily_budget) body.daily_budget = Math.round(params.daily_budget * 100);
    if (params.lifetime_budget) body.lifetime_budget = Math.round(params.lifetime_budget * 100);

    const res = await this.client.post(`/${campaignId}`, body);
    return res.data;
  }

  async duplicateCampaign(
    campaignId: string,
    newName: string,
    statusOption: string = "PAUSED"
  ): Promise<{ copied_campaign_id: string }> {
    const res = await this.client.post(`/${campaignId}/copies`, {
      rename_options: { rename_suffix: ` - ${newName}` },
      status_option: statusOption,
      deep_copy: true,
    });
    return { copied_campaign_id: res.data.copied_object_id || res.data.id };
  }

  async deleteCampaign(campaignId: string): Promise<{ success: boolean }> {
    const res = await this.client.delete(`/${campaignId}`);
    return res.data;
  }

  // ==================== CONJUNTOS DE ANÚNCIOS ====================

  async getAdSets(campaignId?: string): Promise<AdSet[]> {
    const endpoint = campaignId
      ? `/${campaignId}/adsets`
      : `/${this.adAccountId}/adsets`;
    const fields = [
      "id", "name", "campaign_id", "status", "daily_budget",
      "lifetime_budget", "billing_event", "optimization_goal",
      "targeting", "start_time", "end_time", "created_time", "updated_time",
    ].join(",");
    const res = await this.client.get<MetaApiResponse<AdSet>>(endpoint, {
      params: {
        fields,
        limit: 100,
        effective_status: JSON.stringify(["ACTIVE", "PAUSED", "ARCHIVED", "IN_PROCESS", "WITH_ISSUES"]),
      },
    });
    return res.data.data;
  }

  async createAdSet(params: {
    name: string;
    campaign_id: string;
    daily_budget?: number;
    lifetime_budget?: number;
    billing_event: string;
    optimization_goal: string;
    targeting: Targeting;
    start_time?: string;
    end_time?: string;
    status?: string;
    bid_amount?: number;
    bid_strategy?: string;
    roas_target?: number;
    promoted_object?: Record<string, unknown>;
    is_cbo?: boolean;
  }): Promise<{ id: string }> {
    const body: Record<string, unknown> = {
      name: params.name,
      campaign_id: params.campaign_id,
      billing_event: params.billing_event,
      optimization_goal: params.optimization_goal,
      targeting: params.targeting,
      status: params.status || "PAUSED",
    };
    // Budget only at ad set level when CBO is off
    if (!params.is_cbo) {
      if (params.daily_budget) body.daily_budget = Math.round(params.daily_budget * 100);
      if (params.lifetime_budget) body.lifetime_budget = Math.round(params.lifetime_budget * 100);
    }
    if (params.start_time) body.start_time = params.start_time;
    if (params.end_time) body.end_time = params.end_time;
    if (params.bid_amount) body.bid_amount = Math.round(params.bid_amount * 100);
    if (params.bid_strategy && !params.is_cbo) body.bid_strategy = params.bid_strategy;
    if (params.roas_target) body.roas_bid = params.roas_target;
    if (params.promoted_object) body.promoted_object = params.promoted_object;

    const res = await this.client.post(`/${this.adAccountId}/adsets`, body);
    return res.data;
  }

  async updateAdSet(
    adSetId: string,
    params: Partial<{
      name: string;
      status: string;
      daily_budget: number;
      lifetime_budget: number;
      targeting: Targeting;
      bid_amount: number;
    }>
  ): Promise<{ success: boolean }> {
    const body: Record<string, unknown> = {};
    if (params.name) body.name = params.name;
    if (params.status) body.status = params.status;
    if (params.daily_budget) body.daily_budget = Math.round(params.daily_budget * 100);
    if (params.lifetime_budget) body.lifetime_budget = Math.round(params.lifetime_budget * 100);
    if (params.targeting) body.targeting = params.targeting;
    if (params.bid_amount) body.bid_amount = Math.round(params.bid_amount * 100);

    const res = await this.client.post(`/${adSetId}`, body);
    return res.data;
  }

  async duplicateAdSet(
    adSetId: string,
    campaignId: string,
    newName: string
  ): Promise<{ copied_adset_id: string }> {
    const res = await this.client.post(`/${adSetId}/copies`, {
      campaign_id: campaignId,
      rename_options: { rename_suffix: ` - ${newName}` },
      status_option: "PAUSED",
      deep_copy: true,
    });
    return { copied_adset_id: res.data.copied_object_id || res.data.id };
  }

  // ==================== ANÚNCIOS ====================

  async getAds(adSetId?: string): Promise<Ad[]> {
    const endpoint = adSetId
      ? `/${adSetId}/ads`
      : `/${this.adAccountId}/ads`;
    const fields = [
      "id", "name", "adset_id", "campaign_id", "status",
      "creative{id,name,title,body,image_url,link_url,call_to_action_type}",
      "created_time", "updated_time",
    ].join(",");
    const res = await this.client.get<MetaApiResponse<Ad>>(endpoint, {
      params: {
        fields,
        limit: 100,
        effective_status: JSON.stringify(["ACTIVE", "PAUSED", "ARCHIVED", "IN_PROCESS", "WITH_ISSUES"]),
      },
    });
    return res.data.data;
  }

  async createAd(params: {
    name: string;
    adset_id: string;
    creative: AdCreative;
    status?: string;
  }): Promise<{ id: string }> {
    let creativeId = params.creative.id;
    if (!creativeId) {
      const creativeRes = await this.client.post(
        `/${this.adAccountId}/adcreatives`,
        {
          name: params.creative.name,
          object_story_spec: params.creative.object_story_spec,
        }
      );
      creativeId = creativeRes.data.id;
    }

    const res = await this.client.post(`/${this.adAccountId}/ads`, {
      name: params.name,
      adset_id: params.adset_id,
      creative: { creative_id: creativeId },
      status: params.status || "PAUSED",
    });
    return res.data;
  }

  async updateAd(
    adId: string,
    params: Partial<{ name: string; status: string; creative: AdCreative }>
  ): Promise<{ success: boolean }> {
    const body: Record<string, unknown> = {};
    if (params.name) body.name = params.name;
    if (params.status) body.status = params.status;
    if (params.creative?.id) body.creative = { creative_id: params.creative.id };

    const res = await this.client.post(`/${adId}`, body);
    return res.data;
  }

  async duplicateAd(
    adId: string,
    adSetId: string,
    newName: string
  ): Promise<{ copied_ad_id: string }> {
    const res = await this.client.post(`/${adId}/copies`, {
      adset_id: adSetId,
      rename_options: { rename_suffix: ` - ${newName}` },
      status_option: "PAUSED",
    });
    return { copied_ad_id: res.data.copied_object_id || res.data.id };
  }

  // ==================== INSIGHTS / RELATÓRIOS ====================

  async getInsights(
    objectId: string,
    params: {
      time_range?: { since: string; until: string };
      date_preset?: string;
      fields?: string[];
      breakdowns?: string[];
      level?: string;
      limit?: number;
    }
  ): Promise<CampaignInsights[]> {
    const defaultFields = [
      "impressions", "clicks", "spend", "cpm", "cpc", "ctr",
      "reach", "frequency", "actions", "cost_per_action_type",
      "purchase_roas", "date_start", "date_stop",
    ];
    const queryParams: Record<string, unknown> = {
      fields: (params.fields || defaultFields).join(","),
      limit: params.limit || 100,
    };
    if (params.time_range) queryParams.time_range = JSON.stringify(params.time_range);
    if (params.date_preset) queryParams.date_preset = params.date_preset;
    if (params.breakdowns) queryParams.breakdowns = params.breakdowns.join(",");
    if (params.level) queryParams.level = params.level;

    const res = await this.client.get<MetaApiResponse<CampaignInsights>>(
      `/${objectId}/insights`,
      { params: queryParams }
    );
    return res.data.data || [];
  }

  async getPerformanceReport(filters: ReportFilters): Promise<PerformanceReport[]> {
    const insightFields = [
      "campaign_id", "campaign_name", "adset_id", "adset_name",
      "ad_id", "ad_name", "impressions", "clicks", "spend",
      "reach", "frequency", "cpm", "cpc", "ctr",
      "actions", "cost_per_action_type", "purchase_roas",
      "date_start", "date_stop",
    ];

    const params: Record<string, unknown> = {
      fields: insightFields.join(","),
      level: filters.level,
      limit: 500,
    };

    if (filters.time_range) params.time_range = JSON.stringify(filters.time_range);
    if (filters.date_preset) params.date_preset = filters.date_preset;
    if (filters.breakdowns) params.breakdowns = filters.breakdowns.join(",");

    let endpoint = `/${this.adAccountId}/insights`;
    if (filters.campaign_ids?.length === 1) {
      endpoint = `/${filters.campaign_ids[0]}/insights`;
    }

    const res = await this.client.get<MetaApiResponse<CampaignInsights>>(
      endpoint,
      { params }
    );

    return (res.data.data || []).map((row) => this.transformInsightToReport(row as CampaignInsights & { [key: string]: unknown }));
  }

  private transformInsightToReport(insight: CampaignInsights & { [key: string]: unknown }): PerformanceReport {
    const conversions = this.getActionValue(insight.actions, "offsite_conversion.fb_pixel_purchase") ||
      this.getActionValue(insight.actions, "purchase") || 0;
    const costPerConversion = this.getCostPerAction(insight.cost_per_action_type, "offsite_conversion.fb_pixel_purchase") || 0;
    const roas = this.getRoas(insight.purchase_roas) || 0;
    const revenue = roas * parseFloat(insight.spend || "0");

    return {
      date_start: insight.date_start,
      date_stop: insight.date_stop,
      campaign_id: insight.campaign_id as string,
      campaign_name: insight.campaign_name as string,
      adset_id: insight.adset_id as string,
      adset_name: insight.adset_name as string,
      ad_id: insight.ad_id as string,
      ad_name: insight.ad_name as string,
      impressions: parseInt(insight.impressions || "0"),
      clicks: parseInt(insight.clicks || "0"),
      spend: parseFloat(insight.spend || "0"),
      reach: parseInt(insight.reach || "0"),
      frequency: parseFloat(insight.frequency || "0"),
      cpm: parseFloat(insight.cpm || "0"),
      cpc: parseFloat(insight.cpc || "0"),
      ctr: parseFloat(insight.ctr || "0"),
      conversions,
      cost_per_conversion: costPerConversion,
      roas,
      revenue,
    };
  }

  private getActionValue(actions: Action[] | undefined, actionType: string): number {
    if (!actions) return 0;
    const action = actions.find((a) => a.action_type === actionType);
    return action ? parseFloat(action.value) : 0;
  }

  private getCostPerAction(costs: CostPerAction[] | undefined, actionType: string): number {
    if (!costs) return 0;
    const cost = costs.find((c) => c.action_type === actionType);
    return cost ? parseFloat(cost.value) : 0;
  }

  private getRoas(purchaseRoas: PurchaseRoas[] | undefined): number {
    if (!purchaseRoas || purchaseRoas.length === 0) return 0;
    return parseFloat(purchaseRoas[0].value);
  }

  // ==================== PÚBLICOS ====================

  async getCustomAudiences(): Promise<CustomAudience[]> {
    const fields = [
      "id", "name", "description", "approximate_count",
      "subtype", "time_created", "time_updated", "data_source",
    ].join(",");
    const res = await this.client.get<MetaApiResponse<CustomAudience>>(
      `/${this.adAccountId}/customaudiences`,
      { params: { fields, limit: 100 } }
    );
    return res.data.data;
  }

  async createCustomAudience(params: {
    name: string;
    description?: string;
    subtype: string;
    customer_file_source?: string;
    rule?: Record<string, unknown>;
    lookalike_spec?: LookalikeSpec;
    retention_days?: number;
  }): Promise<{ id: string }> {
    const res = await this.client.post(
      `/${this.adAccountId}/customaudiences`,
      params
    );
    return res.data;
  }

  async createLookalikeAudience(params: {
    name: string;
    origin_audience_id: string;
    country: string;
    ratio: number;
    type?: string;
  }): Promise<{ id: string }> {
    const res = await this.client.post(
      `/${this.adAccountId}/customaudiences`,
      {
        name: params.name,
        subtype: "LOOKALIKE",
        lookalike_spec: JSON.stringify({
          origin: [{ id: params.origin_audience_id, type: "custom_audience" }],
          country: params.country,
          ratio: params.ratio,
          type: params.type || "similarity",
        }),
      }
    );
    return res.data;
  }

  // ==================== ORÇAMENTO AUTOMÁTICO ====================

  async evaluateBudgetRules(rules: {
    campaign_id: string;
    metric: string;
    operator: string;
    value: number;
    time_window_days: number;
  }[]): Promise<{ campaign_id: string; should_trigger: boolean; current_value: number }[]> {
    const results = [];
    for (const rule of rules) {
      const insights = await this.getInsights(rule.campaign_id, {
        date_preset: rule.time_window_days <= 1 ? "today" : `last_${rule.time_window_days}_d`,
      });
      if (insights.length === 0) {
        results.push({ campaign_id: rule.campaign_id, should_trigger: false, current_value: 0 });
        continue;
      }

      const insight = insights[0];
      let currentValue = 0;
      switch (rule.metric) {
        case "ROAS":
          currentValue = this.getRoas(insight.purchase_roas);
          break;
        case "CPA":
          currentValue = this.getCostPerAction(insight.cost_per_action_type, "offsite_conversion.fb_pixel_purchase");
          break;
        case "CTR":
          currentValue = parseFloat(insight.ctr || "0");
          break;
        case "CPM":
          currentValue = parseFloat(insight.cpm || "0");
          break;
        case "SPEND":
          currentValue = parseFloat(insight.spend || "0");
          break;
      }

      let shouldTrigger = false;
      switch (rule.operator) {
        case "GREATER_THAN":
          shouldTrigger = currentValue > rule.value;
          break;
        case "LESS_THAN":
          shouldTrigger = currentValue < rule.value;
          break;
        case "EQUAL_TO":
          shouldTrigger = Math.abs(currentValue - rule.value) < 0.01;
          break;
      }

      results.push({ campaign_id: rule.campaign_id, should_trigger: shouldTrigger, current_value: currentValue });
    }
    return results;
  }

  async adjustBudget(
    campaignId: string,
    action: { type: string; value?: number; unit?: string; max_budget?: number; min_budget?: number }
  ): Promise<{ success: boolean; new_budget?: number }> {
    const campaign = await this.getCampaign(campaignId);
    const currentBudget = parseFloat(campaign.daily_budget || campaign.lifetime_budget || "0") / 100;

    let newBudget = currentBudget;
    switch (action.type) {
      case "INCREASE_BUDGET":
        if (action.unit === "PERCENTAGE") {
          newBudget = currentBudget * (1 + (action.value || 0) / 100);
        } else {
          newBudget = currentBudget + (action.value || 0);
        }
        break;
      case "DECREASE_BUDGET":
        if (action.unit === "PERCENTAGE") {
          newBudget = currentBudget * (1 - (action.value || 0) / 100);
        } else {
          newBudget = currentBudget - (action.value || 0);
        }
        break;
      case "SET_BUDGET":
        newBudget = action.value || currentBudget;
        break;
      case "PAUSE":
        await this.updateCampaign(campaignId, { status: "PAUSED" });
        return { success: true };
      case "ACTIVATE":
        await this.updateCampaign(campaignId, { status: "ACTIVE" });
        return { success: true };
    }

    if (action.max_budget) newBudget = Math.min(newBudget, action.max_budget);
    if (action.min_budget) newBudget = Math.max(newBudget, action.min_budget);

    const budgetField = campaign.daily_budget ? "daily_budget" : "lifetime_budget";
    await this.updateCampaign(campaignId, { [budgetField]: newBudget });

    return { success: true, new_budget: newBudget };
  }

  // ==================== TESTES A/B ====================

  async createABTest(params: {
    name: string;
    description?: string;
    campaign_ids: string[];
    variable: string;
    end_time: string;
  }): Promise<{ id: string }> {
    const res = await this.client.post(`/${this.adAccountId}/abtests`, {
      name: params.name,
      description: params.description,
      control_ids: [params.campaign_ids[0]],
      treatment_ids: params.campaign_ids.slice(1),
      variable: params.variable,
      end_time: params.end_time,
    });
    return res.data;
  }
}

type CostPerAction = { action_type: string; value: string };

export const metaApi = new MetaAdsApi();
export default metaApi;
