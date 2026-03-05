"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import {
  DollarSign,
  Eye,
  MousePointerClick,
  TrendingUp,
  Target,
  BarChart3,
} from "lucide-react";
import type { PerformanceReport } from "@/types/meta-ads";

interface OverviewCardsProps {
  reports: PerformanceReport[];
}

export function OverviewCards({ reports }: OverviewCardsProps) {
  const totals = reports.reduce(
    (acc, r) => ({
      spend: acc.spend + r.spend,
      impressions: acc.impressions + r.impressions,
      clicks: acc.clicks + r.clicks,
      conversions: acc.conversions + r.conversions,
      revenue: acc.revenue + r.revenue,
      reach: acc.reach + r.reach,
    }),
    { spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0, reach: 0 }
  );

  const avgCTR = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
  const avgCPM = totals.impressions > 0 ? (totals.spend / totals.impressions) * 1000 : 0;
  const roas = totals.spend > 0 ? totals.revenue / totals.spend : 0;
  const cpa = totals.conversions > 0 ? totals.spend / totals.conversions : 0;

  const cards = [
    {
      title: "Gasto Total",
      value: formatCurrency(totals.spend),
      icon: DollarSign,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950",
    },
    {
      title: "Impressões",
      value: formatNumber(totals.impressions),
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Cliques",
      value: formatNumber(totals.clicks),
      icon: MousePointerClick,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950",
    },
    {
      title: "CTR",
      value: formatPercent(avgCTR),
      icon: Target,
      color: "text-violet-600",
      bgColor: "bg-violet-50 dark:bg-violet-950",
    },
    {
      title: "ROAS",
      value: roas.toFixed(2) + "x",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      title: "CPA",
      value: formatCurrency(cpa),
      icon: BarChart3,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-950",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {card.title}
                </p>
                <div className={`rounded-lg p-2 ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
              <p className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
                {card.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
