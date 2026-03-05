"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Pagination, usePagination } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/utils";
import {
  Play,
  Pause,
  Copy,
  Plus,
  Search,
  Layers,
  Users,
} from "lucide-react";
import type { AdSet, Campaign } from "@/types/meta-ads";

interface AdSetsTableProps {
  adSets: AdSet[];
  campaigns: Campaign[];
  onAction: (action: string, params: Record<string, unknown>) => void;
  loading?: boolean;
}

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "secondary" }> = {
  ACTIVE: { label: "Ativo", variant: "success" },
  PAUSED: { label: "Pausado", variant: "warning" },
  DELETED: { label: "Excluído", variant: "destructive" },
  ARCHIVED: { label: "Arquivado", variant: "secondary" },
};

const goalLabels: Record<string, string> = {
  REACH: "Alcance",
  IMPRESSIONS: "Impressões",
  LINK_CLICKS: "Cliques no Link",
  LANDING_PAGE_VIEWS: "Visualizações da LP",
  CONVERSIONS: "Conversões",
  VALUE: "Valor",
  LEAD_GENERATION: "Geração de Leads",
  APP_INSTALLS: "Instalações do App",
};

export function AdSetsTable({ adSets, campaigns, onAction, loading }: AdSetsTableProps) {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [selectedAdSet, setSelectedAdSet] = useState<AdSet | null>(null);
  const [duplicateName, setDuplicateName] = useState("");

  const filtered = useMemo(() => {
    return adSets.filter((a) => {
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [adSets, search, statusFilter]);

  const pagination = usePagination(filtered.length, 10);
  const paginatedData = pagination.paginatedSlice(filtered);

  const getCampaignName = (campaignId: string) =>
    campaigns.find((c) => c.id === campaignId)?.name || campaignId;

  const getTargetingSummary = (adSet: AdSet) => {
    const parts: string[] = [];
    const t = adSet.targeting;
    if (t.age_min || t.age_max) parts.push(`${t.age_min || 18}-${t.age_max || 65} anos`);
    if (t.geo_locations?.countries) parts.push(t.geo_locations.countries.join(", "));
    if (t.interests?.length) parts.push(`${t.interests.length} interesse(s)`);
    if (t.custom_audiences?.length) parts.push(`${t.custom_audiences.length} público(s)`);
    return parts.join(" · ") || "Sem segmentação";
  };

  const handleDuplicate = () => {
    if (selectedAdSet) {
      onAction("duplicate", {
        adSetId: selectedAdSet.id,
        campaignId: selectedAdSet.campaign_id,
        newName: duplicateName,
      });
      setShowDuplicateDialog(false);
      toast.success("Conjunto duplicado com sucesso!");
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            Conjuntos de Anúncios ({filtered.length})
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-800">
              {[
                { key: "ALL", label: "Todos" },
                { key: "ACTIVE", label: "Ativos" },
                { key: "PAUSED", label: "Pausados" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => { setStatusFilter(f.key); pagination.resetPage(); }}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    statusFilter === f.key
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); pagination.resetPage(); }}
                className="w-48 pl-9"
              />
            </div>
            <Button size="sm" disabled>
              <Plus className="mr-1 h-4 w-4" /> Novo Conjunto
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-800">
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Campanha</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Otimização</th>
                  <th className="px-4 py-3">Orçamento</th>
                  <th className="px-4 py-3">Segmentação</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                      Carregando conjuntos de anúncios...
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                      {search || statusFilter !== "ALL" ? "Nenhum conjunto encontrado com esses filtros." : "Nenhum conjunto de anúncios ainda."}
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((adSet) => {
                    const status = statusBadge[adSet.status] || statusBadge.PAUSED;
                    const budget = adSet.daily_budget
                      ? formatCurrency(parseFloat(adSet.daily_budget) / 100)
                      : "-";

                    return (
                      <tr key={adSet.id} className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                        <td className="px-4 py-3">
                          <p className="font-medium text-zinc-900 dark:text-white">{adSet.name}</p>
                          <p className="text-xs text-zinc-400">ID: {adSet.id}</p>
                        </td>
                        <td className="max-w-[180px] truncate px-4 py-3 text-xs text-zinc-600 dark:text-zinc-400">
                          {getCampaignName(adSet.campaign_id)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-600 dark:text-zinc-400">
                          {goalLabels[adSet.optimization_goal] || adSet.optimization_goal}
                        </td>
                        <td className="px-4 py-3 font-medium">{budget}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-xs text-zinc-500">
                            <Users className="h-3 w-3" />
                            {getTargetingSummary(adSet)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            {adSet.status === "ACTIVE" ? (
                              <Button variant="ghost" size="icon" onClick={() => onAction("pause", { adSetId: adSet.id })} title="Pausar">
                                <Pause className="h-4 w-4 text-amber-500" />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="icon" onClick={() => onAction("activate", { adSetId: adSet.id })} title="Ativar">
                                <Play className="h-4 w-4 text-emerald-500" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedAdSet(adSet);
                                setDuplicateName(`Cópia de ${adSet.name}`);
                                setShowDuplicateDialog(true);
                              }}
                              title="Duplicar"
                            >
                              <Copy className="h-4 w-4 text-blue-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={filtered.length}
            pageSize={pagination.pageSize}
            onPageChange={pagination.onPageChange}
            onPageSizeChange={pagination.onPageSizeChange}
          />
        </CardContent>
      </Card>

      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicar Conjunto de Anúncios</DialogTitle>
            <DialogDescription>Duplicando: {selectedAdSet?.name}</DialogDescription>
          </DialogHeader>
          <div>
            <label className="mb-1 block text-sm font-medium">Nome do Novo Conjunto</label>
            <Input value={duplicateName} onChange={(e) => setDuplicateName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDuplicateDialog(false)}>Cancelar</Button>
            <Button onClick={handleDuplicate} disabled={!duplicateName}>Duplicar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
