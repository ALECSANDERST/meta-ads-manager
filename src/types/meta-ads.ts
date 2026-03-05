// ==================== CAMPAIGN ====================
export type CampaignStatus = "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED";
export type CampaignObjective =
  | "OUTCOME_AWARENESS"
  | "OUTCOME_ENGAGEMENT"
  | "OUTCOME_LEADS"
  | "OUTCOME_SALES"
  | "OUTCOME_TRAFFIC"
  | "OUTCOME_APP_PROMOTION";

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  objective: CampaignObjective;
  daily_budget?: string;
  lifetime_budget?: string;
  budget_remaining?: string;
  start_time?: string;
  stop_time?: string;
  created_time: string;
  updated_time: string;
  insights?: CampaignInsights;
}

export interface CampaignInsights {
  impressions: string;
  clicks: string;
  spend: string;
  cpm: string;
  cpc: string;
  ctr: string;
  reach: string;
  frequency: string;
  actions?: Action[];
  cost_per_action_type?: CostPerAction[];
  purchase_roas?: PurchaseRoas[];
  date_start: string;
  date_stop: string;
}

export interface Action {
  action_type: string;
  value: string;
}

export interface CostPerAction {
  action_type: string;
  value: string;
}

export interface PurchaseRoas {
  action_type: string;
  value: string;
}

// ==================== AD SET ====================
export type AdSetStatus = "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED";
export type BillingEvent = "IMPRESSIONS" | "LINK_CLICKS" | "APP_INSTALLS";
export type OptimizationGoal =
  | "REACH"
  | "IMPRESSIONS"
  | "LINK_CLICKS"
  | "LANDING_PAGE_VIEWS"
  | "CONVERSIONS"
  | "VALUE"
  | "LEAD_GENERATION"
  | "APP_INSTALLS";

export interface Targeting {
  age_min?: number;
  age_max?: number;
  genders?: number[];
  geo_locations?: {
    countries?: string[];
    cities?: { key: string; name: string }[];
    regions?: { key: string; name: string }[];
  };
  interests?: { id: string; name: string }[];
  behaviors?: { id: string; name: string }[];
  custom_audiences?: { id: string; name: string }[];
  excluded_custom_audiences?: { id: string; name: string }[];
  flexible_spec?: Record<string, unknown>[];
  publisher_platforms?: string[];
  facebook_positions?: string[];
  instagram_positions?: string[];
}

export interface AdSet {
  id: string;
  name: string;
  campaign_id: string;
  status: AdSetStatus;
  daily_budget?: string;
  lifetime_budget?: string;
  billing_event: BillingEvent;
  optimization_goal: OptimizationGoal;
  targeting: Targeting;
  start_time?: string;
  end_time?: string;
  created_time: string;
  updated_time: string;
  insights?: CampaignInsights;
}

// ==================== AD ====================
export type AdStatus = "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED";

export interface AdCreative {
  id?: string;
  name: string;
  title?: string;
  body?: string;
  image_url?: string;
  image_hash?: string;
  video_id?: string;
  link_url?: string;
  call_to_action_type?: string;
  object_story_spec?: Record<string, unknown>;
}

export interface Ad {
  id: string;
  name: string;
  adset_id: string;
  campaign_id: string;
  status: AdStatus;
  creative: AdCreative;
  created_time: string;
  updated_time: string;
  insights?: CampaignInsights;
}

// ==================== AUDIENCES ====================
export type AudienceType = "CUSTOM" | "LOOKALIKE";
export type CustomAudienceSource =
  | "USER_PROVIDED_ONLY"
  | "WEBSITE"
  | "APP"
  | "OFFLINE"
  | "ENGAGEMENT"
  | "PARTNER";

export interface CustomAudience {
  id: string;
  name: string;
  description?: string;
  approximate_count?: number;
  subtype: CustomAudienceSource;
  time_created: string;
  time_updated: string;
  data_source?: {
    type: string;
    sub_type: string;
  };
}

export interface LookalikeSpec {
  origin: { id: string; name: string }[];
  country: string;
  ratio: number; // 0.01 to 0.20
  type: "similarity" | "reach";
}

// ==================== A/B TEST ====================
export interface ABTest {
  id: string;
  name: string;
  description?: string;
  status: "DRAFT" | "RUNNING" | "COMPLETED" | "CANCELLED";
  variable: "CREATIVE" | "AUDIENCE" | "PLACEMENT" | "DELIVERY_OPTIMIZATION";
  campaign_ids: string[];
  variants: ABTestVariant[];
  start_time: string;
  end_time?: string;
  winner_id?: string;
  confidence_level?: number;
  created_at: string;
}

export interface ABTestVariant {
  id: string;
  name: string;
  campaign_id: string;
  weight: number;
  metrics?: {
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    cpa: number;
    roas: number;
    ctr: number;
  };
}

// ==================== REPORTS ====================
export interface PerformanceReport {
  date_start: string;
  date_stop: string;
  campaign_id?: string;
  campaign_name?: string;
  adset_id?: string;
  adset_name?: string;
  ad_id?: string;
  ad_name?: string;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  frequency: number;
  cpm: number;
  cpc: number;
  ctr: number;
  conversions: number;
  cost_per_conversion: number;
  roas: number;
  revenue: number;
}

export interface ReportFilters {
  level: "campaign" | "adset" | "ad";
  date_preset?: string;
  time_range?: { since: string; until: string };
  campaign_ids?: string[];
  adset_ids?: string[];
  ad_ids?: string[];
  fields?: string[];
  breakdowns?: string[];
  sort_by?: string;
  sort_dir?: "asc" | "desc";
}

// ==================== BUDGET RULES ====================
export interface BudgetRule {
  id: string;
  name: string;
  enabled: boolean;
  campaign_id: string;
  condition: BudgetCondition;
  action: BudgetAction;
  frequency: "HOURLY" | "DAILY" | "WEEKLY";
  last_executed?: string;
  created_at: string;
}

export interface BudgetCondition {
  metric: "ROAS" | "CPA" | "CTR" | "CPM" | "SPEND";
  operator: "GREATER_THAN" | "LESS_THAN" | "EQUAL_TO";
  value: number;
  time_window_days: number;
}

export interface BudgetAction {
  type: "INCREASE_BUDGET" | "DECREASE_BUDGET" | "PAUSE" | "ACTIVATE" | "SET_BUDGET";
  value?: number;
  unit?: "PERCENTAGE" | "FIXED";
  max_budget?: number;
  min_budget?: number;
}

// ==================== API RESPONSES ====================
export interface MetaApiResponse<T> {
  data: T[];
  paging?: {
    cursors: { before: string; after: string };
    next?: string;
    previous?: string;
  };
}

export interface MetaApiError {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id: string;
  };
}

// ==================== CLAUDE AI ====================
export interface ClaudeAnalysis {
  summary: string;
  recommendations: ClaudeRecommendation[];
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  predicted_impact: string;
}

export interface ClaudeRecommendation {
  type: "BUDGET" | "TARGETING" | "CREATIVE" | "BIDDING" | "SCHEDULING" | "GENERAL";
  priority: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  action?: {
    type: string;
    params: Record<string, unknown>;
  };
}

export interface ClaudeChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
