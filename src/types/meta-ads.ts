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

// ==================== CAMPAIGN CREATION WIZARD ====================
export type BudgetType = "DAILY" | "LIFETIME";
export type BidStrategy = "LOWEST_COST_WITHOUT_CAP" | "LOWEST_COST_WITH_BID_CAP" | "COST_CAP" | "MINIMUM_ROAS";
export type SpecialAdCategory = "NONE" | "CREDIT" | "EMPLOYMENT" | "HOUSING" | "SOCIAL_ISSUES_ELECTIONS_POLITICS";
export type PlacementType = "AUTOMATIC" | "MANUAL";
export type CallToActionType =
  | "LEARN_MORE"
  | "SHOP_NOW"
  | "SIGN_UP"
  | "SUBSCRIBE"
  | "DOWNLOAD"
  | "GET_OFFER"
  | "BOOK_TRAVEL"
  | "CONTACT_US"
  | "APPLY_NOW"
  | "SEND_MESSAGE"
  | "WATCH_MORE"
  | "GET_QUOTE"
  | "ORDER_NOW"
  | "BUY_NOW"
  | "NO_BUTTON";
export type ConversionEvent =
  | "PURCHASE"
  | "ADD_TO_CART"
  | "INITIATE_CHECKOUT"
  | "LEAD"
  | "COMPLETE_REGISTRATION"
  | "CONTENT_VIEW"
  | "SEARCH"
  | "ADD_PAYMENT_INFO"
  | "ADD_TO_WISHLIST"
  | "CONTACT"
  | "CUSTOMIZE_PRODUCT"
  | "FIND_LOCATION"
  | "SCHEDULE"
  | "START_TRIAL"
  | "SUBMIT_APPLICATION"
  | "SUBSCRIBE_PAID";
export type CreativeType = "IMAGE" | "VIDEO";

export interface CampaignFormData {
  // Step 1: Campaign
  name: string;
  objective: CampaignObjective;
  status: "ACTIVE" | "PAUSED";
  special_ad_categories: SpecialAdCategory[];
  campaign_budget_optimization: boolean;
  buying_type: "AUCTION" | "RESERVED";

  // Step 2: Ad Set
  adset_name: string;
  budget_type: BudgetType;
  daily_budget: number;
  lifetime_budget: number;
  bid_strategy: BidStrategy;
  bid_amount: number | null;
  roas_target: number | null;
  optimization_goal: OptimizationGoal;
  billing_event: BillingEvent;
  conversion_event: ConversionEvent;
  pixel_id: string;
  start_time: string;
  end_time: string;
  // Targeting
  age_min: number;
  age_max: number;
  genders: number[];
  countries: string[];
  regions: string[];
  cities: string[];
  interests: string[];
  // Placements
  placement_type: PlacementType;
  publisher_platforms: string[];
  facebook_positions: string[];
  instagram_positions: string[];
  audience_network_positions: string[];
  messenger_positions: string[];

  // Step 3: Ad
  ad_name: string;
  facebook_page_id: string;
  instagram_account_id: string;
  creative_type: CreativeType;
  image_url: string;
  video_url: string;
  primary_text: string;
  headline: string;
  description: string;
  destination_url: string;
  display_link: string;
  call_to_action: CallToActionType;
  url_parameters: string;
}

export const DEFAULT_CAMPAIGN_FORM: CampaignFormData = {
  name: "",
  objective: "OUTCOME_SALES",
  status: "PAUSED",
  special_ad_categories: [],
  campaign_budget_optimization: true,
  buying_type: "AUCTION",

  adset_name: "",
  budget_type: "DAILY",
  daily_budget: 50,
  lifetime_budget: 500,
  bid_strategy: "LOWEST_COST_WITHOUT_CAP",
  bid_amount: null,
  roas_target: null,
  optimization_goal: "CONVERSIONS",
  billing_event: "IMPRESSIONS",
  conversion_event: "PURCHASE",
  pixel_id: "",
  start_time: "",
  end_time: "",
  age_min: 18,
  age_max: 65,
  genders: [0],
  countries: ["BR"],
  regions: [],
  cities: [],
  interests: [],
  placement_type: "AUTOMATIC",
  publisher_platforms: ["facebook", "instagram", "audience_network", "messenger"],
  facebook_positions: ["feed", "story", "reels", "marketplace", "video_feeds", "right_hand_column", "search"],
  instagram_positions: ["stream", "story", "reels", "explore", "explore_home", "shop"],
  audience_network_positions: ["classic", "rewarded_video"],
  messenger_positions: ["messenger_home", "sponsored_messages", "story"],

  ad_name: "",
  facebook_page_id: "",
  instagram_account_id: "",
  creative_type: "IMAGE",
  image_url: "",
  video_url: "",
  primary_text: "",
  headline: "",
  description: "",
  destination_url: "",
  display_link: "",
  call_to_action: "LEARN_MORE",
  url_parameters: "",
};

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
