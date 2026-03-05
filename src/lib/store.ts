"use client";

import { create } from "zustand";
import type {
  Campaign,
  AdSet,
  Ad,
  CustomAudience,
  PerformanceReport,
  BudgetRule,
  ABTest,
  ClaudeAnalysis,
  ClaudeChatMessage,
} from "@/types/meta-ads";

interface AppState {
  // Data
  campaigns: Campaign[];
  adSets: AdSet[];
  ads: Ad[];
  audiences: CustomAudience[];
  reports: PerformanceReport[];
  budgetRules: BudgetRule[];
  abTests: ABTest[];

  // AI
  aiAnalysis: ClaudeAnalysis | null;
  chatMessages: ClaudeChatMessage[];

  // UI State
  loading: boolean;
  error: string | null;
  selectedCampaignId: string | null;
  selectedAdSetId: string | null;
  dateRange: { since: string; until: string };
  activeTab: string;

  // Actions
  setCampaigns: (campaigns: Campaign[]) => void;
  setAdSets: (adSets: AdSet[]) => void;
  setAds: (ads: Ad[]) => void;
  setAudiences: (audiences: CustomAudience[]) => void;
  setReports: (reports: PerformanceReport[]) => void;
  setBudgetRules: (rules: BudgetRule[]) => void;
  setAbTests: (tests: ABTest[]) => void;
  setAiAnalysis: (analysis: ClaudeAnalysis | null) => void;
  addChatMessage: (message: ClaudeChatMessage) => void;
  clearChat: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCampaignId: (id: string | null) => void;
  setSelectedAdSetId: (id: string | null) => void;
  setDateRange: (range: { since: string; until: string }) => void;
  setActiveTab: (tab: string) => void;
}

const today = new Date();
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(today.getDate() - 30);

export const useAppStore = create<AppState>((set) => ({
  campaigns: [],
  adSets: [],
  ads: [],
  audiences: [],
  reports: [],
  budgetRules: [],
  abTests: [],
  aiAnalysis: null,
  chatMessages: [],
  loading: false,
  error: null,
  selectedCampaignId: null,
  selectedAdSetId: null,
  dateRange: {
    since: thirtyDaysAgo.toISOString().split("T")[0],
    until: today.toISOString().split("T")[0],
  },
  activeTab: "dashboard",

  setCampaigns: (campaigns) => set({ campaigns }),
  setAdSets: (adSets) => set({ adSets }),
  setAds: (ads) => set({ ads }),
  setAudiences: (audiences) => set({ audiences }),
  setReports: (reports) => set({ reports }),
  setBudgetRules: (rules) => set({ budgetRules: rules }),
  setAbTests: (tests) => set({ abTests: tests }),
  setAiAnalysis: (analysis) => set({ aiAnalysis: analysis }),
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  clearChat: () => set({ chatMessages: [] }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedCampaignId: (id) => set({ selectedCampaignId: id }),
  setSelectedAdSetId: (id) => set({ selectedAdSetId: id }),
  setDateRange: (range) => set({ dateRange: range }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
