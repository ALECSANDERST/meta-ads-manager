"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  Megaphone,
} from "lucide-react";
import type {
  CampaignFormData,
  CampaignObjective,
  SpecialAdCategory,
} from "@/types/meta-ads";

interface CampaignStepProps {
  form: CampaignFormData;
  onChange: (updates: Partial<CampaignFormData>) => void;
  errors: Record<string, string>;
}

const objectiveOptions: { value: CampaignObjective; label: string; desc: string }[] = [
  { value: "OUTCOME_SALES", label: "Vendas", desc: "Conversões, vendas do catálogo" },
  { value: "OUTCOME_LEADS", label: "Leads", desc: "Formulários, mensagens, ligações" },
  { value: "OUTCOME_TRAFFIC", label: "Tráfego", desc: "Enviar pessoas para um destino" },
  { value: "OUTCOME_ENGAGEMENT", label: "Engajamento", desc: "Curtidas, comentários, compartilhamentos" },
  { value: "OUTCOME_AWARENESS", label: "Reconhecimento", desc: "Alcance e frequência" },
  { value: "OUTCOME_APP_PROMOTION", label: "Promoção de App", desc: "Instalações e engajamento em app" },
];

const specialCategoryOptions: { value: SpecialAdCategory; label: string }[] = [
  { value: "NONE", label: "Nenhuma" },
  { value: "CREDIT", label: "Crédito" },
  { value: "EMPLOYMENT", label: "Emprego" },
  { value: "HOUSING", label: "Moradia" },
  { value: "SOCIAL_ISSUES_ELECTIONS_POLITICS", label: "Questões sociais, eleições ou política" },
];

export function CampaignStep({ form, onChange, errors }: CampaignStepProps) {
  const toggleCategory = (cat: SpecialAdCategory) => {
    if (cat === "NONE") {
      onChange({ special_ad_categories: [] });
      return;
    }
    const current = form.special_ad_categories.filter((c) => c !== "NONE");
    if (current.includes(cat)) {
      onChange({ special_ad_categories: current.filter((c) => c !== cat) });
    } else {
      onChange({ special_ad_categories: [...current, cat] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Campaign Name */}
      <div>
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
          <Megaphone className="h-4 w-4 text-blue-500" />
          Nome da Campanha <span className="text-red-500">*</span>
        </label>
        <Input
          value={form.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Ex: Vendas - Black Friday 2026"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      {/* Objective */}
      <div>
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
          <Target className="h-4 w-4 text-violet-500" />
          Objetivo da Campanha <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {objectiveOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ objective: opt.value })}
              className={`rounded-lg border p-3 text-left transition-all ${
                form.objective === opt.value
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-950"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
              }`}
            >
              <p className="text-sm font-medium">{opt.label}</p>
              <p className="mt-0.5 text-[11px] text-zinc-500">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">Status Inicial</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange({ status: "PAUSED" })}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-all ${
              form.status === "PAUSED"
                ? "border-amber-500 bg-amber-50 dark:bg-amber-950"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          >
            <ToggleLeft className="h-4 w-4" /> Pausada
          </button>
          <button
            type="button"
            onClick={() => onChange({ status: "ACTIVE" })}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-all ${
              form.status === "ACTIVE"
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          >
            <ToggleRight className="h-4 w-4" /> Ativa
          </button>
        </div>
        <p className="mt-1 text-[11px] text-zinc-400">
          Recomendado: criar como Pausada e revisar antes de ativar.
        </p>
      </div>

      {/* Buying Type */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">Tipo de Compra</label>
        <Select
          value={form.buying_type}
          onValueChange={(v) => onChange({ buying_type: v as "AUCTION" | "RESERVED" })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AUCTION">Leilão (Padrão)</SelectItem>
            <SelectItem value="RESERVED">Reserva (Alcance e Frequência)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* CBO */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Otimização de Orçamento da Campanha (CBO)
        </label>
        <button
          type="button"
          onClick={() => onChange({ campaign_budget_optimization: !form.campaign_budget_optimization })}
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all ${
            form.campaign_budget_optimization
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
              : "border-zinc-200 dark:border-zinc-700"
          }`}
        >
          <div
            className={`flex h-6 w-10 items-center rounded-full p-0.5 transition-colors ${
              form.campaign_budget_optimization ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-600"
            }`}
          >
            <div
              className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                form.campaign_budget_optimization ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
          <div>
            <p className="text-sm font-medium">
              {form.campaign_budget_optimization ? "Ativado" : "Desativado"}
            </p>
            <p className="text-[11px] text-zinc-500">
              {form.campaign_budget_optimization
                ? "O Meta distribui o orçamento automaticamente entre os conjuntos."
                : "Defina o orçamento individualmente em cada conjunto de anúncios."}
            </p>
          </div>
        </button>
      </div>

      {/* Special Ad Categories */}
      <div>
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
          <ShieldAlert className="h-4 w-4 text-amber-500" />
          Categorias Especiais de Anúncio
        </label>
        <div className="flex flex-wrap gap-2">
          {specialCategoryOptions.map((opt) => {
            const isActive =
              opt.value === "NONE"
                ? form.special_ad_categories.length === 0
                : form.special_ad_categories.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleCategory(opt.value)}
                className={`rounded-full border px-3 py-1 text-xs transition-all ${
                  isActive
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <p className="mt-1 text-[11px] text-zinc-400">
          Selecione se seu anúncio é relacionado a crédito, emprego, moradia ou questões sociais.
        </p>
      </div>
    </div>
  );
}
