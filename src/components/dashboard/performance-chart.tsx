"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PerformanceReport } from "@/types/meta-ads";

interface PerformanceChartProps {
  reports: PerformanceReport[];
}

type MetricKey = "spend" | "impressions" | "clicks" | "ctr" | "roas" | "cpm";

const metricConfig: Record<MetricKey, { label: string; color: string }> = {
  spend: { label: "Gasto (R$)", color: "#ef4444" },
  impressions: { label: "Impressões", color: "#3b82f6" },
  clicks: { label: "Cliques", color: "#f59e0b" },
  ctr: { label: "CTR (%)", color: "#8b5cf6" },
  roas: { label: "ROAS", color: "#10b981" },
  cpm: { label: "CPM (R$)", color: "#06b6d4" },
};

export function PerformanceChart({ reports }: PerformanceChartProps) {
  const [activeMetrics, setActiveMetrics] = useState<MetricKey[]>(["spend", "roas"]);

  const toggleMetric = (metric: MetricKey) => {
    setActiveMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  const chartData = reports
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
    }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Performance ao Longo do Tempo</CardTitle>
        <div className="flex flex-wrap gap-1">
          {(Object.keys(metricConfig) as MetricKey[]).map((key) => (
            <Button
              key={key}
              variant={activeMetrics.includes(key) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleMetric(key)}
              className="text-xs"
              style={
                activeMetrics.includes(key)
                  ? { backgroundColor: metricConfig[key].color }
                  : {}
              }
            >
              {metricConfig[key].label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis dataKey="date" fontSize={12} tickLine={false} />
              <YAxis fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e4e4e7",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend />
              {activeMetrics.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={metricConfig[key].label}
                  stroke={metricConfig[key].color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
