"use client";

import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  TrendingUp,
  BarChart3,
  MousePointer,
  Percent,
  Target,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import type { PerformanceReport } from "@/types/meta-ads";

// ==================== TYPES ====================

interface PerformanceChartProps {
  reports: PerformanceReport[];
  onDateRangeChange?: (dateRange: DateRange) => void;
}

type MetricKey = "spend" | "impressions" | "clicks" | "ctr" | "roas" | "cpm";

interface DateRange {
  preset?: string;
  startDate?: string;
  endDate?: string;
}

// ==================== CONFIG ====================

const metricConfig: Record<MetricKey, { label: string; color: string; gradient: string; icon: React.ElementType; format: (v: number) => string }> = {
  spend: {
    label: "Gasto (R$)",
    color: "#ef4444",
    gradient: "url(#gradSpend)",
    icon: DollarSign,
    format: (v) => `R$ ${v.toFixed(2)}`,
  },
  impressions: {
    label: "Impressões",
    color: "#3b82f6",
    gradient: "url(#gradImpressions)",
    icon: BarChart3,
    format: (v) => v.toLocaleString("pt-BR"),
  },
  clicks: {
    label: "Cliques",
    color: "#f59e0b",
    gradient: "url(#gradClicks)",
    icon: MousePointer,
    format: (v) => v.toLocaleString("pt-BR"),
  },
  ctr: {
    label: "CTR (%)",
    color: "#8b5cf6",
    gradient: "url(#gradCtr)",
    icon: Percent,
    format: (v) => `${v.toFixed(2)}%`,
  },
  roas: {
    label: "ROAS",
    color: "#10b981",
    gradient: "url(#gradRoas)",
    icon: TrendingUp,
    format: (v) => `${v.toFixed(2)}x`,
  },
  cpm: {
    label: "CPM (R$)",
    color: "#06b6d4",
    gradient: "url(#gradCpm)",
    icon: Target,
    format: (v) => `R$ ${v.toFixed(2)}`,
  },
};

const datePresets = [
  { key: "today", label: "Hoje" },
  { key: "yesterday", label: "Ontem" },
  { key: "last_7d", label: "7 dias" },
  { key: "last_14d", label: "14 dias" },
  { key: "last_30d", label: "30 dias" },
  { key: "this_month", label: "Este mês" },
  { key: "last_month", label: "Mês passado" },
  { key: "last_90d", label: "90 dias" },
];

// ==================== CUSTOM TOOLTIP ====================

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="mb-2 text-xs font-semibold text-zinc-400">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry) => {
          const key = entry.dataKey as MetricKey;
          const config = metricConfig[key];
          return (
            <div key={key} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs text-zinc-300">{config.label}</span>
              </div>
              <span className="text-xs font-bold text-white">{config.format(entry.value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== COMPONENT ====================

export function PerformanceChart({ reports, onDateRangeChange }: PerformanceChartProps) {
  const [activeMetrics, setActiveMetrics] = useState<MetricKey[]>(["spend", "roas"]);
  const [activeDatePreset, setActiveDatePreset] = useState("last_30d");
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const toggleMetric = (metric: MetricKey) => {
    setActiveMetrics((prev) =>
      prev.includes(metric)
        ? prev.length > 1 ? prev.filter((m) => m !== metric) : prev
        : [...prev, metric]
    );
  };

  const handleDatePreset = (key: string) => {
    setActiveDatePreset(key);
    setShowCustomDate(false);
    setShowDateDropdown(false);
    onDateRangeChange?.({ preset: key });
  };

  const handleCustomDateApply = () => {
    if (customStart && customEnd) {
      setActiveDatePreset("custom");
      setShowCustomDate(false);
      setShowDateDropdown(false);
      onDateRangeChange?.({ startDate: customStart, endDate: customEnd });
    }
  };

  const chartData = useMemo(
    () =>
      reports
        .sort((a, b) => a.date_start.localeCompare(b.date_start))
        .map((r) => ({
          date: new Date(r.date_start).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          }),
          spend: Number(r.spend.toFixed(2)),
          impressions: r.impressions,
          clicks: r.clicks,
          ctr: Number(r.ctr.toFixed(2)),
          roas: Number(r.roas.toFixed(2)),
          cpm: Number(r.cpm.toFixed(2)),
        })),
    [reports]
  );

  const activePresetLabel =
    activeDatePreset === "custom"
      ? `${customStart} — ${customEnd}`
      : datePresets.find((d) => d.key === activeDatePreset)?.label || "30 dias";

  return (
    <Card className="overflow-hidden border-zinc-800 bg-zinc-900/50">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-zinc-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Performance ao Longo do Tempo</h3>
            <p className="text-xs text-zinc-500">Métricas das suas campanhas</p>
          </div>
        </div>

        {/* Date Filter */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDateDropdown(!showDateDropdown)}
            className="gap-2 border-zinc-700 bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700 hover:text-white"
          >
            <Calendar className="h-3.5 w-3.5" />
            {activePresetLabel}
            <ChevronDown className="h-3 w-3" />
          </Button>

          {showDateDropdown && (
            <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-zinc-700 bg-zinc-900 p-3 shadow-2xl">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Período</p>
              <div className="grid grid-cols-2 gap-1.5">
                {datePresets.map((preset) => (
                  <button
                    key={preset.key}
                    onClick={() => handleDatePreset(preset.key)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      activeDatePreset === preset.key
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="mt-3 border-t border-zinc-800 pt-3">
                <button
                  onClick={() => setShowCustomDate(!showCustomDate)}
                  className={`w-full rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    showCustomDate || activeDatePreset === "custom"
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  <Calendar className="mr-1.5 inline h-3 w-3" />
                  Datas personalizadas
                </button>

                {showCustomDate && (
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                      />
                      <input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleCustomDateApply}
                      disabled={!customStart || !customEnd}
                      className="w-full rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-blue-500 disabled:opacity-40"
                    >
                      Aplicar
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metric Toggles */}
      <div className="flex flex-wrap gap-1.5 border-b border-zinc-800 px-6 py-3">
        {(Object.keys(metricConfig) as MetricKey[]).map((key) => {
          const config = metricConfig[key];
          const Icon = config.icon;
          const isActive = activeMetrics.includes(key);
          return (
            <button
              key={key}
              onClick={() => toggleMetric(key)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "text-white shadow-lg"
                  : "bg-zinc-800/50 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
              }`}
              style={isActive ? { backgroundColor: config.color + "20", color: config.color, border: `1px solid ${config.color}40` } : {}}
            >
              <Icon className="h-3 w-3" />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <CardContent className="px-4 pt-6 pb-4">
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="gradSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradImpressions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradCtr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradRoas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradCpm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="date"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#71717a" }}
                dy={10}
              />
              <YAxis
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#71717a" }}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#52525b", strokeDasharray: "4 4" }} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => (
                  <span className="text-xs text-zinc-400">{value}</span>
                )}
                wrapperStyle={{ paddingTop: 16 }}
              />
              {activeMetrics.map((key) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={metricConfig[key].label}
                  stroke={metricConfig[key].color}
                  fill={metricConfig[key].gradient}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: metricConfig[key].color,
                    fill: "#18181b",
                  }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
