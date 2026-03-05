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
import {
  DollarSign,
  Users,
  MapPin,
  Crosshair,
  Calendar,
  TrendingUp,
  Layers,
} from "lucide-react";
import type {
  CampaignFormData,
  BudgetType,
  BidStrategy,
  OptimizationGoal,
  BillingEvent,
  ConversionEvent,
  PlacementType,
} from "@/types/meta-ads";

interface AdSetStepProps {
  form: CampaignFormData;
  onChange: (updates: Partial<CampaignFormData>) => void;
  errors: Record<string, string>;
}

const optimizationGoalOptions: { value: OptimizationGoal; label: string }[] = [
  { value: "CONVERSIONS", label: "Conversões" },
  { value: "VALUE", label: "Valor (ROAS)" },
  { value: "LANDING_PAGE_VIEWS", label: "Visualizações de página de destino" },
  { value: "LINK_CLICKS", label: "Cliques no link" },
  { value: "IMPRESSIONS", label: "Impressões" },
  { value: "REACH", label: "Alcance" },
  { value: "LEAD_GENERATION", label: "Geração de leads" },
  { value: "APP_INSTALLS", label: "Instalações do app" },
];

const billingEventOptions: { value: BillingEvent; label: string }[] = [
  { value: "IMPRESSIONS", label: "Impressões (CPM)" },
  { value: "LINK_CLICKS", label: "Cliques no link (CPC)" },
  { value: "APP_INSTALLS", label: "Instalações do app" },
];

const bidStrategyOptions: { value: BidStrategy; label: string; desc: string }[] = [
  { value: "LOWEST_COST_WITHOUT_CAP", label: "Menor custo", desc: "Maximize resultados no seu orçamento" },
  { value: "LOWEST_COST_WITH_BID_CAP", label: "Limite de lance", desc: "Defina o lance máximo por ação" },
  { value: "COST_CAP", label: "Custo por resultado", desc: "Controle o custo médio por resultado" },
  { value: "MINIMUM_ROAS", label: "ROAS mínimo", desc: "Defina um retorno mínimo sobre gasto" },
];

const conversionEventOptions: { value: ConversionEvent; label: string }[] = [
  { value: "PURCHASE", label: "Compra" },
  { value: "ADD_TO_CART", label: "Adicionar ao carrinho" },
  { value: "INITIATE_CHECKOUT", label: "Iniciar checkout" },
  { value: "LEAD", label: "Lead" },
  { value: "COMPLETE_REGISTRATION", label: "Cadastro completo" },
  { value: "CONTENT_VIEW", label: "Visualização de conteúdo" },
  { value: "SEARCH", label: "Pesquisa" },
  { value: "ADD_PAYMENT_INFO", label: "Adicionar info de pagamento" },
  { value: "ADD_TO_WISHLIST", label: "Adicionar à lista de desejos" },
  { value: "CONTACT", label: "Contato" },
  { value: "CUSTOMIZE_PRODUCT", label: "Personalizar produto" },
  { value: "FIND_LOCATION", label: "Encontrar localização" },
  { value: "SCHEDULE", label: "Agendar" },
  { value: "START_TRIAL", label: "Iniciar teste" },
  { value: "SUBMIT_APPLICATION", label: "Enviar inscrição" },
  { value: "SUBSCRIBE_PAID", label: "Assinatura paga" },
];

const countryOptions = [
  { value: "BR", label: "Brasil" },
  { value: "US", label: "Estados Unidos" },
  { value: "PT", label: "Portugal" },
  { value: "AR", label: "Argentina" },
  { value: "MX", label: "México" },
  { value: "CO", label: "Colômbia" },
  { value: "CL", label: "Chile" },
  { value: "PE", label: "Peru" },
  { value: "UY", label: "Uruguai" },
  { value: "ES", label: "Espanha" },
  { value: "GB", label: "Reino Unido" },
  { value: "DE", label: "Alemanha" },
  { value: "FR", label: "França" },
  { value: "IT", label: "Itália" },
  { value: "CA", label: "Canadá" },
  { value: "AU", label: "Austrália" },
  { value: "JP", label: "Japão" },
];

const publisherPlatforms = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "audience_network", label: "Audience Network" },
  { value: "messenger", label: "Messenger" },
];

const facebookPositions = [
  { value: "feed", label: "Feed" },
  { value: "story", label: "Stories" },
  { value: "reels", label: "Reels" },
  { value: "marketplace", label: "Marketplace" },
  { value: "video_feeds", label: "Vídeos" },
  { value: "right_hand_column", label: "Coluna direita" },
  { value: "search", label: "Pesquisa" },
  { value: "instant_article", label: "Artigos instantâneos" },
];

const instagramPositions = [
  { value: "stream", label: "Feed" },
  { value: "story", label: "Stories" },
  { value: "reels", label: "Reels" },
  { value: "explore", label: "Explorar" },
  { value: "explore_home", label: "Explorar (Home)" },
  { value: "shop", label: "Loja" },
];

function ToggleChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition-all ${
        active
          ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
          : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"
      }`}
    >
      {label}
    </button>
  );
}

function toggleArrayItem(arr: string[], item: string): string[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

export function AdSetStep({ form, onChange, errors }: AdSetStepProps) {
  return (
    <div className="space-y-6">
      {/* Ad Set Name */}
      <div>
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
          <Layers className="h-4 w-4 text-indigo-500" />
          Nome do Conjunto <span className="text-red-500">*</span>
        </label>
        <Input
          value={form.adset_name}
          onChange={(e) => onChange({ adset_name: e.target.value })}
          placeholder="Ex: Público BR 25-45 - Interesses"
          className={errors.adset_name ? "border-red-500" : ""}
        />
        {errors.adset_name && <p className="mt-1 text-xs text-red-500">{errors.adset_name}</p>}
      </div>

      {/* Budget Section */}
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <DollarSign className="h-4 w-4 text-emerald-500" /> Orçamento
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium">Tipo de Orçamento</label>
            <Select
              value={form.budget_type}
              onValueChange={(v) => onChange({ budget_type: v as BudgetType })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Diário</SelectItem>
                <SelectItem value="LIFETIME">Total (Lifetime)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">
              {form.budget_type === "DAILY" ? "Orçamento Diário (R$)" : "Orçamento Total (R$)"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min={1}
              value={form.budget_type === "DAILY" ? form.daily_budget : form.lifetime_budget}
              onChange={(e) =>
                onChange(
                  form.budget_type === "DAILY"
                    ? { daily_budget: Number(e.target.value) }
                    : { lifetime_budget: Number(e.target.value) }
                )
              }
              className={errors.budget ? "border-red-500" : ""}
            />
            {errors.budget && <p className="mt-1 text-xs text-red-500">{errors.budget}</p>}
          </div>
        </div>
      </div>

      {/* Conversion & Optimization */}
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <TrendingUp className="h-4 w-4 text-blue-500" /> Otimização e Entrega
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium">Otimização para</label>
            <Select
              value={form.optimization_goal}
              onValueChange={(v) => onChange({ optimization_goal: v as OptimizationGoal })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {optimizationGoalOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">Cobrança por</label>
            <Select
              value={form.billing_event}
              onValueChange={(v) => onChange({ billing_event: v as BillingEvent })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {billingEventOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">Evento de Conversão</label>
            <Select
              value={form.conversion_event}
              onValueChange={(v) => onChange({ conversion_event: v as ConversionEvent })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {conversionEventOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">Pixel ID</label>
            <Input
              value={form.pixel_id}
              onChange={(e) => onChange({ pixel_id: e.target.value })}
              placeholder="Ex: 123456789012345"
            />
          </div>
        </div>

        {/* Bid Strategy */}
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium">Estratégia de Lance</label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {bidStrategyOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ bid_strategy: opt.value })}
                className={`rounded-lg border p-2.5 text-left transition-all ${
                  form.bid_strategy === opt.value
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-950"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700"
                }`}
              >
                <p className="text-xs font-medium">{opt.label}</p>
                <p className="text-[10px] text-zinc-500">{opt.desc}</p>
              </button>
            ))}
          </div>
          {(form.bid_strategy === "LOWEST_COST_WITH_BID_CAP" || form.bid_strategy === "COST_CAP") && (
            <div className="mt-3">
              <label className="mb-1 block text-xs font-medium">
                {form.bid_strategy === "COST_CAP" ? "Custo por resultado (R$)" : "Lance máximo (R$)"}
              </label>
              <Input
                type="number"
                min={0.01}
                step={0.01}
                value={form.bid_amount ?? ""}
                onChange={(e) => onChange({ bid_amount: e.target.value ? Number(e.target.value) : null })}
                placeholder="Ex: 15.00"
              />
            </div>
          )}
          {form.bid_strategy === "MINIMUM_ROAS" && (
            <div className="mt-3">
              <label className="mb-1 block text-xs font-medium">ROAS Mínimo</label>
              <Input
                type="number"
                min={0.01}
                step={0.01}
                value={form.roas_target ?? ""}
                onChange={(e) => onChange({ roas_target: e.target.value ? Number(e.target.value) : null })}
                placeholder="Ex: 2.5"
              />
            </div>
          )}
        </div>
      </div>

      {/* Schedule */}
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Calendar className="h-4 w-4 text-orange-500" /> Programação
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium">
              Data de Início <span className="text-red-500">*</span>
            </label>
            <Input
              type="datetime-local"
              value={form.start_time}
              onChange={(e) => onChange({ start_time: e.target.value })}
              className={errors.start_time ? "border-red-500" : ""}
            />
            {errors.start_time && <p className="mt-1 text-xs text-red-500">{errors.start_time}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">
              Data de Término {form.budget_type === "LIFETIME" && <span className="text-red-500">*</span>}
            </label>
            <Input
              type="datetime-local"
              value={form.end_time}
              onChange={(e) => onChange({ end_time: e.target.value })}
              className={errors.end_time ? "border-red-500" : ""}
            />
            {errors.end_time && <p className="mt-1 text-xs text-red-500">{errors.end_time}</p>}
            {form.budget_type !== "LIFETIME" && (
              <p className="mt-1 text-[10px] text-zinc-400">Opcional para orçamento diário.</p>
            )}
          </div>
        </div>
      </div>

      {/* Targeting */}
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Users className="h-4 w-4 text-pink-500" /> Público
        </h3>
        <div className="space-y-4">
          {/* Age & Gender */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium">Idade Mínima</label>
              <Input
                type="number"
                min={13}
                max={65}
                value={form.age_min}
                onChange={(e) => onChange({ age_min: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Idade Máxima</label>
              <Input
                type="number"
                min={13}
                max={65}
                value={form.age_max}
                onChange={(e) => onChange({ age_max: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Gênero</label>
              <Select
                value={String(form.genders[0] ?? 0)}
                onValueChange={(v) => onChange({ genders: [Number(v)] })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todos</SelectItem>
                  <SelectItem value="1">Masculino</SelectItem>
                  <SelectItem value="2">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Locations */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-xs font-medium">
              <MapPin className="h-3.5 w-3.5 text-red-500" />
              Localização (Países) <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {countryOptions.map((c) => (
                <ToggleChip
                  key={c.value}
                  label={c.label}
                  active={form.countries.includes(c.value)}
                  onClick={() => onChange({ countries: toggleArrayItem(form.countries, c.value) })}
                />
              ))}
            </div>
            {errors.countries && <p className="mt-1 text-xs text-red-500">{errors.countries}</p>}
          </div>

          {/* Interests */}
          <div>
            <label className="mb-1 block text-xs font-medium">Interesses (palavras-chave separadas por vírgula)</label>
            <Input
              value={form.interests.join(", ")}
              onChange={(e) =>
                onChange({
                  interests: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Ex: Marketing digital, E-commerce, Moda"
            />
            <p className="mt-1 text-[10px] text-zinc-400">
              Na integração real, use o endpoint de busca de interesses da API.
            </p>
          </div>
        </div>
      </div>

      {/* Placements */}
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Crosshair className="h-4 w-4 text-cyan-500" /> Posicionamentos
        </h3>
        <div className="mb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange({ placement_type: "AUTOMATIC" as PlacementType })}
            className={`rounded-lg border px-4 py-2 text-xs font-medium transition-all ${
              form.placement_type === "AUTOMATIC"
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          >
            Automático (Recomendado)
          </button>
          <button
            type="button"
            onClick={() => onChange({ placement_type: "MANUAL" as PlacementType })}
            className={`rounded-lg border px-4 py-2 text-xs font-medium transition-all ${
              form.placement_type === "MANUAL"
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          >
            Manual
          </button>
        </div>

        {form.placement_type === "MANUAL" && (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium">Plataformas</label>
              <div className="flex flex-wrap gap-1.5">
                {publisherPlatforms.map((p) => (
                  <ToggleChip
                    key={p.value}
                    label={p.label}
                    active={form.publisher_platforms.includes(p.value)}
                    onClick={() =>
                      onChange({ publisher_platforms: toggleArrayItem(form.publisher_platforms, p.value) })
                    }
                  />
                ))}
              </div>
            </div>
            {form.publisher_platforms.includes("facebook") && (
              <div>
                <label className="mb-1 block text-xs font-medium">Posições Facebook</label>
                <div className="flex flex-wrap gap-1.5">
                  {facebookPositions.map((p) => (
                    <ToggleChip
                      key={p.value}
                      label={p.label}
                      active={form.facebook_positions.includes(p.value)}
                      onClick={() =>
                        onChange({ facebook_positions: toggleArrayItem(form.facebook_positions, p.value) })
                      }
                    />
                  ))}
                </div>
              </div>
            )}
            {form.publisher_platforms.includes("instagram") && (
              <div>
                <label className="mb-1 block text-xs font-medium">Posições Instagram</label>
                <div className="flex flex-wrap gap-1.5">
                  {instagramPositions.map((p) => (
                    <ToggleChip
                      key={p.value}
                      label={p.label}
                      active={form.instagram_positions.includes(p.value)}
                      onClick={() =>
                        onChange({ instagram_positions: toggleArrayItem(form.instagram_positions, p.value) })
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
