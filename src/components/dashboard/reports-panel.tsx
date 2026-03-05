"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pagination, usePagination } from "@/components/ui/pagination";
import { BarChart3, Search, ArrowUpDown } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { PerformanceReport } from "@/types/meta-ads";

interface ReportsPanelProps {
  reports: PerformanceReport[];
  loading?: boolean;
}

type SortField = "spend" | "impressions" | "clicks" | "ctr" | "roas" | "revenue" | "cpm" | "cpc" | "conversions";

export function ReportsPanel({ reports, loading }: ReportsPanelProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("spend");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const name = (r.campaign_name || r.adset_name || r.ad_name || "").toLowerCase();
      return name.includes(search.toLowerCase());
    });
  }, [reports, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const diff = (a[sortField] as number) - (b[sortField] as number);
      return sortAsc ? diff : -diff;
    });
  }, [filtered, sortField, sortAsc]);

  const pagination = usePagination(sorted.length, 20);
  const paginatedData = pagination.paginatedSlice(sorted);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
    pagination.resetPage();
  };

  const SortHeader = ({ field, label, align = "right" }: { field: SortField; label: string; align?: string }) => (
    <th
      className={`cursor-pointer px-3 py-3 hover:text-zinc-700 dark:hover:text-zinc-300 ${align === "right" ? "text-right" : "text-left"}`}
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortField === field && <ArrowUpDown className="h-3 w-3" />}
      </span>
    </th>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-zinc-400">
          Carregando relatórios...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Relatório de Performance ({filtered.length})
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Buscar campanha..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); pagination.resetPage(); }}
            className="w-56 pl-9"
          />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        {sorted.length === 0 ? (
          <div className="py-12 text-center text-zinc-400">
            <BarChart3 className="mx-auto mb-3 h-12 w-12 text-zinc-300" />
            <p className="text-sm font-medium">Nenhum dado de performance</p>
            <p className="mt-1 text-xs">
              {search ? "Nenhum resultado para essa busca." : "Conecte sua conta Meta Ads para ver os relatórios."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-800">
                    <th className="px-3 py-3">Campanha</th>
                    <SortHeader field="impressions" label="Impr." />
                    <SortHeader field="clicks" label="Cliques" />
                    <SortHeader field="spend" label="Gasto" />
                    <SortHeader field="cpm" label="CPM" />
                    <SortHeader field="cpc" label="CPC" />
                    <SortHeader field="ctr" label="CTR" />
                    <SortHeader field="conversions" label="Conv." />
                    <SortHeader field="roas" label="ROAS" />
                    <SortHeader field="revenue" label="Receita" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {paginatedData.map((r, i) => {
                    const roasColor = r.roas >= 3 ? "text-emerald-600" : r.roas >= 1 ? "text-amber-600" : "text-red-600";
                    const ctrBadge = r.ctr >= 2 ? "success" : r.ctr >= 1 ? "warning" : "destructive";

                    return (
                      <tr key={`${r.campaign_name}-${r.date_start}-${i}`} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                        <td className="px-3 py-3">
                          <p className="font-medium text-zinc-900 dark:text-white">
                            {r.campaign_name || r.adset_name || r.ad_name || "-"}
                          </p>
                          <p className="text-[11px] text-zinc-400">
                            {r.date_start} → {r.date_stop}
                          </p>
                        </td>
                        <td className="px-3 py-3 text-right">{formatNumber(r.impressions)}</td>
                        <td className="px-3 py-3 text-right">{formatNumber(r.clicks)}</td>
                        <td className="px-3 py-3 text-right font-medium">{formatCurrency(r.spend)}</td>
                        <td className="px-3 py-3 text-right">{formatCurrency(r.cpm)}</td>
                        <td className="px-3 py-3 text-right">{formatCurrency(r.cpc)}</td>
                        <td className="px-3 py-3 text-right">
                          <Badge variant={ctrBadge as "success" | "warning" | "destructive"}>{r.ctr.toFixed(2)}%</Badge>
                        </td>
                        <td className="px-3 py-3 text-right">{formatNumber(r.conversions)}</td>
                        <td className={`px-3 py-3 text-right font-bold ${roasColor}`}>
                          {r.roas.toFixed(2)}x
                        </td>
                        <td className="px-3 py-3 text-right font-medium text-emerald-600">
                          {formatCurrency(r.revenue)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={sorted.length}
              pageSize={pagination.pageSize}
              onPageChange={pagination.onPageChange}
              onPageSizeChange={pagination.onPageSizeChange}
              pageSizeOptions={[10, 20, 50, 100]}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
