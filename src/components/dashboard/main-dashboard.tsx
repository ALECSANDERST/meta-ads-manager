"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { CampaignsTable } from "@/components/dashboard/campaigns-table";
import { AdSetsTable } from "@/components/dashboard/adsets-table";
import { AdsTable } from "@/components/dashboard/ads-table";
import { ReportsPanel } from "@/components/dashboard/reports-panel";
import { AudiencesPanel } from "@/components/dashboard/audiences-panel";
import { BudgetRulesPanel } from "@/components/dashboard/budget-rules-panel";
import { ABTestsPanel } from "@/components/dashboard/ab-tests-panel";
import { AIAssistant } from "@/components/dashboard/ai-assistant";
import { ExportPanel } from "@/components/dashboard/export-panel";
import { CopyGenerator } from "@/components/dashboard/copy-generator";
import { SettingsPanel } from "@/components/dashboard/settings-panel";
import { useAppStore } from "@/lib/store";
import {
  mockCampaigns,
  mockAdSets,
  mockAds,
  mockReports,
  mockAudiences,
  mockABTests,
  mockBudgetRules,
} from "@/lib/mock-data";
import type {
  Campaign,
  AdSet,
  Ad,
  PerformanceReport,
  CustomAudience,
  BudgetRule,
  ClaudeAnalysis,
  ClaudeChatMessage,
} from "@/types/meta-ads";

const headerTitles: Record<string, string> = {
  dashboard: "Dashboard",
  campaigns: "Campanhas",
  adsets: "Conjuntos de Anúncios",
  ads: "Anúncios",
  reports: "Relatórios de Performance",
  audiences: "Públicos",
  budget: "Orçamento Automático",
  "ab-tests": "Testes A/B",
  "ai-assistant": "Assistente Claude IA",
  "copy-generator": "Gerador de Copies IA",
  export: "Exportar Relatórios",
  settings: "Configurações",
};

export function MainDashboard() {
  const store = useAppStore();
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [abSuggestions, setAbSuggestions] = useState<
    { name: string; description: string; variable: string; hypothesis: string; expected_improvement: string }[]
  >([]);

  // ==================== CARREGAR DADOS DEMO AO INICIAR ====================

  useEffect(() => {
    async function checkConfig() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.data?.meta_configured) {
          setDemoMode(false);
          // Fetch real data from Facebook API
          const [campaignsRes, adSetsRes, adsRes, reportsRes, audiencesRes] = await Promise.allSettled([
            fetch("/api/campaigns").then((r) => r.json()),
            fetch("/api/adsets").then((r) => r.json()),
            fetch("/api/ads").then((r) => r.json()),
            fetch("/api/reports", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ level: "campaign", date_preset: "last_30d" }),
            }).then((r) => r.json()),
            fetch("/api/audiences").then((r) => r.json()),
          ]);
          if (campaignsRes.status === "fulfilled" && campaignsRes.value.data)
            store.setCampaigns(campaignsRes.value.data);
          if (adSetsRes.status === "fulfilled" && adSetsRes.value.data)
            store.setAdSets(adSetsRes.value.data);
          if (adsRes.status === "fulfilled" && adsRes.value.data)
            store.setAds(adsRes.value.data);
          if (reportsRes.status === "fulfilled" && reportsRes.value.data)
            store.setReports(reportsRes.value.data);
          if (audiencesRes.status === "fulfilled" && audiencesRes.value.data)
            store.setAudiences(audiencesRes.value.data);
          return;
        }
      } catch {
        // API não disponível, usar demo
      }
      // Carregar dados demo
      store.setCampaigns(mockCampaigns);
      store.setAdSets(mockAdSets);
      store.setAds(mockAds);
      store.setReports(mockReports);
      store.setAudiences(mockAudiences);
      store.setAbTests(mockABTests);
      store.setBudgetRules(mockBudgetRules);
    }
    checkConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==================== API HELPERS ====================

  const apiCall = useCallback(async (url: string, body?: Record<string, unknown>) => {
    setLoading(true);
    store.setError(null);
    try {
      const res = await fetch(url, {
        method: body ? "POST" : "GET",
        headers: body ? { "Content-Type": "application/json" } : {},
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data.data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      store.setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [store]);

  // ==================== FETCH DATA ====================

  const fetchCampaigns = useCallback(async () => {
    if (demoMode) return;
    const data = await apiCall("/api/campaigns");
    if (data) store.setCampaigns(data as Campaign[]);
  }, [apiCall, store, demoMode]);

  const fetchAdSets = useCallback(async () => {
    if (demoMode) return;
    const data = await apiCall("/api/adsets");
    if (data) store.setAdSets(data as AdSet[]);
  }, [apiCall, store, demoMode]);

  const fetchAds = useCallback(async () => {
    if (demoMode) return;
    const data = await apiCall("/api/ads");
    if (data) store.setAds(data as Ad[]);
  }, [apiCall, store, demoMode]);

  const fetchReports = useCallback(async (params?: Record<string, unknown>) => {
    if (demoMode) return;
    const data = await apiCall("/api/reports", {
      level: "campaign",
      date_preset: "last_30d",
      ...params,
    });
    if (data) store.setReports(data as PerformanceReport[]);
  }, [apiCall, store, demoMode]);

  const fetchAudiences = useCallback(async () => {
    if (demoMode) return;
    const data = await apiCall("/api/audiences");
    if (data) store.setAudiences(data as CustomAudience[]);
  }, [apiCall, store, demoMode]);

  // ==================== CAMPAIGN ACTIONS ====================

  const handleCampaignAction = useCallback(async (action: string, params: Record<string, unknown>) => {
    if (demoMode) {
      // Simular ações em modo demo
      if (action === "pause" || action === "activate") {
        const newStatus = action === "pause" ? "PAUSED" : "ACTIVE";
        store.setCampaigns(
          store.campaigns.map((c) =>
            c.id === params.campaignId ? { ...c, status: newStatus as Campaign["status"] } : c
          )
        );
      } else if (action === "delete") {
        store.setCampaigns(store.campaigns.filter((c) => c.id !== params.campaignId));
      } else if (action === "duplicate") {
        const original = store.campaigns.find((c) => c.id === params.campaignId);
        if (original) {
          const newCampaign: Campaign = {
            ...original,
            id: `${Date.now()}`,
            name: `${original.name} - ${params.newName}`,
            status: "PAUSED",
            created_time: new Date().toISOString(),
            updated_time: new Date().toISOString(),
          };
          store.setCampaigns([...store.campaigns, newCampaign]);
        }
      } else if (action === "create") {
        const newCampaign: Campaign = {
          id: `${Date.now()}`,
          name: params.name as string,
          status: "PAUSED",
          objective: (params.objective as Campaign["objective"]) || "OUTCOME_SALES",
          daily_budget: params.daily_budget ? String(Number(params.daily_budget) * 100) : undefined,
          created_time: new Date().toISOString(),
          updated_time: new Date().toISOString(),
        };
        store.setCampaigns([...store.campaigns, newCampaign]);
      } else if (action === "create_full") {
        const budgetValue = params.budget_type === "DAILY"
          ? String(Number(params.daily_budget || 50) * 100)
          : undefined;
        const lifetimeValue = params.budget_type === "LIFETIME"
          ? String(Number(params.lifetime_budget || 500) * 100)
          : undefined;
        const newCampaign: Campaign = {
          id: `${Date.now()}`,
          name: params.name as string,
          status: (params.status as Campaign["status"]) || "PAUSED",
          objective: (params.objective as Campaign["objective"]) || "OUTCOME_SALES",
          daily_budget: budgetValue,
          lifetime_budget: lifetimeValue,
          start_time: params.start_time as string || undefined,
          stop_time: params.end_time as string || undefined,
          created_time: new Date().toISOString(),
          updated_time: new Date().toISOString(),
        };
        store.setCampaigns([...store.campaigns, newCampaign]);
      }
      return;
    }
    await apiCall("/api/campaigns", { action, ...params });
    await fetchCampaigns();
  }, [apiCall, fetchCampaigns, demoMode, store]);

  // ==================== ADSET ACTIONS ====================

  const handleAdSetAction = useCallback(async (action: string, params: Record<string, unknown>) => {
    if (demoMode) {
      if (action === "pause" || action === "activate") {
        const newStatus = action === "pause" ? "PAUSED" : "ACTIVE";
        store.setAdSets(
          store.adSets.map((a) =>
            a.id === params.adSetId ? { ...a, status: newStatus as AdSet["status"] } : a
          )
        );
      } else if (action === "duplicate") {
        const original = store.adSets.find((a) => a.id === params.adSetId);
        if (original) {
          const newAdSet: AdSet = {
            ...original,
            id: `${Date.now()}`,
            name: `${original.name} - ${params.newName}`,
            status: "PAUSED",
            created_time: new Date().toISOString(),
            updated_time: new Date().toISOString(),
          };
          store.setAdSets([...store.adSets, newAdSet]);
        }
      }
      return;
    }
    await apiCall("/api/adsets", { action, ...params });
    await fetchAdSets();
  }, [apiCall, fetchAdSets, demoMode, store]);

  // ==================== AD ACTIONS ====================

  const handleAdAction = useCallback(async (action: string, params: Record<string, unknown>) => {
    if (demoMode) {
      if (action === "pause" || action === "activate") {
        const newStatus = action === "pause" ? "PAUSED" : "ACTIVE";
        store.setAds(
          store.ads.map((a) =>
            a.id === params.adId ? { ...a, status: newStatus as Ad["status"] } : a
          )
        );
      } else if (action === "duplicate") {
        const original = store.ads.find((a) => a.id === params.adId);
        if (original) {
          const newAd: Ad = {
            ...original,
            id: `${Date.now()}`,
            name: `${original.name} - ${params.newName}`,
            status: "PAUSED",
            created_time: new Date().toISOString(),
            updated_time: new Date().toISOString(),
          };
          store.setAds([...store.ads, newAd]);
        }
      }
      return;
    }
    await apiCall("/api/ads", { action, ...params });
    await fetchAds();
  }, [apiCall, fetchAds, demoMode, store]);

  // ==================== AUDIENCE ACTIONS ====================

  const handleCreateCustomAudience = useCallback(async (params: Record<string, unknown>) => {
    if (demoMode) {
      const newAudience: CustomAudience = {
        id: `ca_${Date.now()}`,
        name: params.name as string,
        description: params.description as string,
        approximate_count: 0,
        subtype: (params.subtype as CustomAudience["subtype"]) || "WEBSITE",
        time_created: new Date().toISOString(),
        time_updated: new Date().toISOString(),
      };
      store.setAudiences([...store.audiences, newAudience]);
      return;
    }
    await apiCall("/api/audiences", { action: "create_custom", ...params });
    await fetchAudiences();
  }, [apiCall, fetchAudiences, demoMode, store]);

  const handleCreateLookalike = useCallback(async (params: Record<string, unknown>) => {
    if (demoMode) {
      const newAudience: CustomAudience = {
        id: `ca_lk_${Date.now()}`,
        name: params.name as string,
        description: `Lookalike ${Number(params.ratio) * 100}% baseado em público existente`,
        approximate_count: 2000000,
        subtype: "USER_PROVIDED_ONLY",
        time_created: new Date().toISOString(),
        time_updated: new Date().toISOString(),
      };
      store.setAudiences([...store.audiences, newAudience]);
      return;
    }
    await apiCall("/api/audiences", { action: "create_lookalike", ...params });
    await fetchAudiences();
  }, [apiCall, fetchAudiences, demoMode, store]);

  // ==================== BUDGET RULES ====================

  const handleAddBudgetRule = useCallback((rule: Partial<BudgetRule>) => {
    const newRule: BudgetRule = {
      id: `rule_${Date.now()}`,
      name: rule.name || "Nova Regra",
      enabled: true,
      campaign_id: rule.campaign_id || "",
      condition: rule.condition || { metric: "ROAS", operator: "LESS_THAN", value: 2, time_window_days: 7 },
      action: rule.action || { type: "DECREASE_BUDGET", value: 20, unit: "PERCENTAGE" },
      frequency: rule.frequency || "DAILY",
      created_at: new Date().toISOString(),
    };
    store.setBudgetRules([...store.budgetRules, newRule]);
  }, [store]);

  const handleExecuteBudgetRule = useCallback(async (rule: BudgetRule) => {
    if (demoMode) {
      store.setError("Regra executada com sucesso (modo demo).");
      setTimeout(() => store.setError(null), 3000);
      return;
    }
    await apiCall("/api/budget-rules", {
      action: "execute",
      campaignId: rule.campaign_id,
      budgetAction: rule.action,
    });
    await fetchCampaigns();
  }, [apiCall, fetchCampaigns, demoMode, store]);

  const handleSuggestBudgetRules = useCallback(async () => {
    if (demoMode) {
      store.setError("Configure suas API keys nas Configurações para usar sugestões da IA.");
      setTimeout(() => store.setError(null), 4000);
      return;
    }
    const data = await apiCall("/api/budget-rules", { action: "suggest" });
    if (data) store.setBudgetRules([...store.budgetRules, ...(data as BudgetRule[])]);
  }, [apiCall, store, demoMode]);

  // ==================== A/B TESTS ====================

  const handleCreateABTest = useCallback(async (params: Record<string, unknown>) => {
    if (demoMode) {
      store.setError("Teste A/B criado com sucesso (modo demo).");
      setTimeout(() => store.setError(null), 3000);
      return;
    }
    await apiCall("/api/ab-tests", params);
  }, [apiCall, demoMode, store]);

  const handleSuggestABTests = useCallback(async () => {
    if (demoMode) {
      store.setError("Configure suas API keys nas Configurações para usar sugestões da IA.");
      setTimeout(() => store.setError(null), 4000);
      return;
    }
    const data = await apiCall("/api/ai", { action: "suggest_ab_tests" });
    if (data?.suggestions) setAbSuggestions(data.suggestions);
  }, [apiCall, demoMode, store]);

  // ==================== AI ====================

  const handleAIChat = useCallback(async (message: string) => {
    const userMsg: ClaudeChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    store.addChatMessage(userMsg);

    if (demoMode) {
      setTimeout(() => {
        const assistantMsg: ClaudeChatMessage = {
          role: "assistant",
          content: "Para usar o Assistente IA, configure sua chave de API do Claude (Anthropic) nas Configurações.\n\nVá em **Configurações** → cole sua **ANTHROPIC_API_KEY** → Salvar.\n\nAssim poderei analisar suas campanhas em tempo real e fornecer recomendações personalizadas!",
          timestamp: new Date().toISOString(),
        };
        store.addChatMessage(assistantMsg);
      }, 500);
      return;
    }

    const data = await apiCall("/api/ai", { action: "chat", message });
    if (data?.response) {
      const assistantMsg: ClaudeChatMessage = {
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
      };
      store.addChatMessage(assistantMsg);
    }
  }, [apiCall, store, demoMode]);

  const handleAIAnalyze = useCallback(async () => {
    if (demoMode) {
      store.setError("Configure suas API keys nas Configurações para usar a análise da IA.");
      setTimeout(() => store.setError(null), 4000);
      return;
    }
    const data = await apiCall("/api/ai", { action: "analyze" });
    if (data) store.setAiAnalysis(data as ClaudeAnalysis);
  }, [apiCall, store, demoMode]);

  const handleGenerateCopy = useCallback(async (params: {
    product: string;
    target_audience: string;
    tone: string;
    objective: string;
    variations: number;
  }) => {
    if (demoMode) {
      store.setError("Configure suas API keys nas Configurações para usar o gerador de copies.");
      setTimeout(() => store.setError(null), 4000);
      return null;
    }
    const data = await apiCall("/api/ai", { action: "generate_copy", ...params });
    return data;
  }, [apiCall, demoMode, store]);

  // ==================== REFRESH ====================

  const handleRefresh = useCallback(async () => {
    if (demoMode) {
      store.setCampaigns(mockCampaigns);
      store.setAdSets(mockAdSets);
      store.setAds(mockAds);
      store.setReports(mockReports);
      store.setAudiences(mockAudiences);
      store.setAbTests(mockABTests);
      store.setBudgetRules(mockBudgetRules);
      return;
    }
    const tab = store.activeTab;
    switch (tab) {
      case "dashboard":
        await Promise.all([fetchCampaigns(), fetchReports()]);
        break;
      case "campaigns":
        await fetchCampaigns();
        break;
      case "adsets":
        await fetchAdSets();
        break;
      case "ads":
        await fetchAds();
        break;
      case "reports":
        await fetchReports();
        break;
      case "audiences":
        await fetchAudiences();
        break;
    }
  }, [store, demoMode, fetchCampaigns, fetchReports, fetchAdSets, fetchAds, fetchAudiences]);

  // ==================== TAB CHANGE ====================

  const handleTabChange = useCallback((tab: string) => {
    store.setActiveTab(tab);
    setSidebarOpen(false);
  }, [store]);

  // ==================== RENDER ====================

  const renderContent = () => {
    switch (store.activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {demoMode && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
                <strong>Modo Demonstração</strong> — Você está vendo dados fictícios. Configure suas API keys em <button onClick={() => store.setActiveTab("settings")} className="font-semibold underline">Configurações</button> para conectar com seus dados reais do Meta Ads.
              </div>
            )}
            <OverviewCards reports={store.reports} />
            <PerformanceChart reports={store.reports} />
            <CampaignsTable
              campaigns={store.campaigns}
              onAction={handleCampaignAction}
              loading={loading}
            />
          </div>
        );
      case "campaigns":
        return (
          <CampaignsTable
            campaigns={store.campaigns}
            onAction={handleCampaignAction}
            loading={loading}
          />
        );
      case "adsets":
        return (
          <AdSetsTable
            adSets={store.adSets}
            campaigns={store.campaigns}
            onAction={handleAdSetAction}
            loading={loading}
          />
        );
      case "ads":
        return (
          <AdsTable
            ads={store.ads}
            campaigns={store.campaigns}
            onAction={handleAdAction}
            loading={loading}
          />
        );
      case "reports":
        return <ReportsPanel reports={store.reports} loading={loading} />;
      case "audiences":
        return (
          <AudiencesPanel
            audiences={store.audiences}
            onCreateCustom={handleCreateCustomAudience}
            onCreateLookalike={handleCreateLookalike}
            loading={loading}
          />
        );
      case "budget":
        return (
          <BudgetRulesPanel
            rules={store.budgetRules}
            campaigns={store.campaigns}
            onAddRule={handleAddBudgetRule}
            onExecuteRule={handleExecuteBudgetRule}
            onSuggestRules={handleSuggestBudgetRules}
            loading={loading}
          />
        );
      case "ab-tests":
        return (
          <ABTestsPanel
            tests={store.abTests}
            campaigns={store.campaigns}
            onCreateTest={handleCreateABTest}
            onSuggestTests={handleSuggestABTests}
            loading={loading}
            suggestions={abSuggestions}
          />
        );
      case "ai-assistant":
        return (
          <AIAssistant
            analysis={store.aiAnalysis}
            chatMessages={store.chatMessages}
            onChat={handleAIChat}
            onAnalyze={handleAIAnalyze}
            onGenerateCopy={handleGenerateCopy}
            loading={loading}
          />
        );
      case "copy-generator":
        return (
          <CopyGenerator
            onGenerate={handleGenerateCopy}
            loading={loading}
          />
        );
      case "export":
        return (
          <ExportPanel
            reports={store.reports}
            onFetchReports={fetchReports}
            loading={loading}
          />
        );
      case "settings":
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        activeTab={store.activeTab}
        onTabChange={handleTabChange}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64">
        <Header
          title={headerTitles[store.activeTab] || "Dashboard"}
          onRefresh={handleRefresh}
          loading={loading}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="p-4 lg:p-6">
          {store.error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
              {store.error}
            </div>
          )}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
