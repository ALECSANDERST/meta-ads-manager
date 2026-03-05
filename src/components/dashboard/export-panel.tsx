"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Download, FileSpreadsheet, FileText, FileJson } from "lucide-react";
import { exportToExcel, exportToCSV, exportToJSON } from "@/lib/export";
import type { PerformanceReport } from "@/types/meta-ads";

interface ExportPanelProps {
  reports: PerformanceReport[];
  onFetchReports: (params: Record<string, unknown>) => void;
  loading?: boolean;
}

export function ExportPanel({ reports, onFetchReports, loading }: ExportPanelProps) {
  const [level, setLevel] = useState("campaign");
  const [datePreset, setDatePreset] = useState("last_30d");
  const [customSince, setCustomSince] = useState("");
  const [customUntil, setCustomUntil] = useState("");

  const handleFetch = () => {
    const params: Record<string, unknown> = { level };
    if (datePreset === "custom" && customSince && customUntil) {
      params.time_range = { since: customSince, until: customUntil };
    } else {
      params.date_preset = datePreset;
    }
    onFetchReports(params);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            Exportar Relatórios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Nível</label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="campaign">Campanhas</SelectItem>
                    <SelectItem value="adset">Conjuntos de Anúncios</SelectItem>
                    <SelectItem value="ad">Anúncios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Período</label>
                <Select value={datePreset} onValueChange={setDatePreset}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="yesterday">Ontem</SelectItem>
                    <SelectItem value="last_7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="last_14d">Últimos 14 dias</SelectItem>
                    <SelectItem value="last_30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="last_90d">Últimos 90 dias</SelectItem>
                    <SelectItem value="this_month">Este mês</SelectItem>
                    <SelectItem value="last_month">Mês passado</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleFetch} disabled={loading} className="w-full">
                  {loading ? "Carregando..." : "Buscar Dados"}
                </Button>
              </div>
            </div>

            {datePreset === "custom" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Data Início</label>
                  <Input type="date" value={customSince} onChange={(e) => setCustomSince(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Data Fim</label>
                  <Input type="date" value={customUntil} onChange={(e) => setCustomUntil(e.target.value)} />
                </div>
              </div>
            )}

            {reports.length > 0 && (
              <>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {reports.length} registro(s) encontrado(s)
                  </p>
                  <p className="text-xs text-zinc-500">
                    Período: {reports[0]?.date_start} a {reports[reports.length - 1]?.date_stop}
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-2 py-6"
                    onClick={() => exportToExcel(reports)}
                  >
                    <FileSpreadsheet className="h-8 w-8 text-emerald-600" />
                    <span className="text-sm font-medium">Excel (.xlsx)</span>
                    <span className="text-[11px] text-zinc-400">Planilha completa</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-2 py-6"
                    onClick={() => exportToCSV(reports)}
                  >
                    <FileText className="h-8 w-8 text-blue-600" />
                    <span className="text-sm font-medium">CSV (.csv)</span>
                    <span className="text-[11px] text-zinc-400">Separado por ponto e vírgula</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-2 py-6"
                    onClick={() => exportToJSON(reports)}
                  >
                    <FileJson className="h-8 w-8 text-amber-600" />
                    <span className="text-sm font-medium">JSON (.json)</span>
                    <span className="text-[11px] text-zinc-400">Dados estruturados</span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview da tabela com paginação */}
      {reports.length > 0 && (
        <ExportPreviewTable reports={reports} />
      )}
    </div>
  );
}

function ExportPreviewTable({ reports }: { reports: PerformanceReport[] }) {
  const [previewPage, setPreviewPage] = React.useState(1);
  const previewPageSize = 10;
  const totalPages = Math.ceil(reports.length / previewPageSize);
  const start = (previewPage - 1) * previewPageSize;
  const paginatedReports = reports.slice(start, start + previewPageSize);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Preview dos Dados ({reports.length} registros)</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-left font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-800">
                <th className="px-3 py-2">Campanha</th>
                <th className="px-3 py-2">Impressões</th>
                <th className="px-3 py-2">Cliques</th>
                <th className="px-3 py-2">Gasto</th>
                <th className="px-3 py-2">CTR</th>
                <th className="px-3 py-2">CPC</th>
                <th className="px-3 py-2">ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {paginatedReports.map((r, i) => (
                <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                  <td className="px-3 py-2 font-medium">{r.campaign_name || r.adset_name || r.ad_name || "-"}</td>
                  <td className="px-3 py-2">{r.impressions.toLocaleString("pt-BR")}</td>
                  <td className="px-3 py-2">{r.clicks.toLocaleString("pt-BR")}</td>
                  <td className="px-3 py-2">R$ {r.spend.toFixed(2)}</td>
                  <td className="px-3 py-2">{r.ctr.toFixed(2)}%</td>
                  <td className="px-3 py-2">R$ {r.cpc.toFixed(2)}</td>
                  <td className="px-3 py-2">{r.roas.toFixed(2)}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-2 dark:border-zinc-800">
            <span className="text-xs text-zinc-500">
              {start + 1}–{Math.min(start + previewPageSize, reports.length)} de {reports.length}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                disabled={previewPage <= 1}
                onClick={() => setPreviewPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <span className="px-2 text-xs text-zinc-500">
                {previewPage}/{totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                disabled={previewPage >= totalPages}
                onClick={() => setPreviewPage((p) => p + 1)}
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
