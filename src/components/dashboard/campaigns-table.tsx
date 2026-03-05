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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination, usePagination } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/utils";
import {
  Play,
  Pause,
  Copy,
  Trash2,
  Plus,
  Search,
  AlertTriangle,
} from "lucide-react";
import type { Campaign, CampaignObjective } from "@/types/meta-ads";

interface CampaignsTableProps {
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

const objectiveLabels: Record<string, string> = {
  OUTCOME_AWARENESS: "Reconhecimento",
  OUTCOME_ENGAGEMENT: "Engajamento",
  OUTCOME_LEADS: "Leads",
  OUTCOME_SALES: "Vendas",
  OUTCOME_TRAFFIC: "Tráfego",
  OUTCOME_APP_PROMOTION: "Promoção de App",
};

export function CampaignsTable({ campaigns, onAction, loading }: CampaignsTableProps) {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    objective: "OUTCOME_SALES" as CampaignObjective,
    daily_budget: 50,
  });
  const [duplicateName, setDuplicateName] = useState("");

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, search, statusFilter]);

  const pagination = usePagination(filtered.length, 10);
  const paginatedData = pagination.paginatedSlice(filtered);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: campaigns.length };
    campaigns.forEach((c) => { counts[c.status] = (counts[c.status] || 0) + 1; });
    return counts;
  }, [campaigns]);

  const handleCreate = () => {
    onAction("create", newCampaign);
    setShowCreateDialog(false);
    setNewCampaign({ name: "", objective: "OUTCOME_SALES", daily_budget: 50 });
    toast.success("Campanha criada com sucesso!");
  };

  const handleDuplicate = () => {
    if (selectedCampaign) {
      onAction("duplicate", { campaignId: selectedCampaign.id, newName: duplicateName });
      setShowDuplicateDialog(false);
      setSelectedCampaign(null);
      setDuplicateName("");
      toast.success("Campanha duplicada com sucesso!");
    }
  };

  const handleDelete = () => {
    if (selectedCampaign) {
      onAction("delete", { campaignId: selectedCampaign.id });
      setShowDeleteDialog(false);
      setSelectedCampaign(null);
      toast.success("Campanha excluída.");
    }
  };

  const handleToggleStatus = (campaign: Campaign) => {
    const action = campaign.status === "ACTIVE" ? "pause" : "activate";
    onAction(action, { campaignId: campaign.id });
    toast.info(action === "pause" ? `"${campaign.name}" pausada.` : `"${campaign.name}" ativada.`);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Campanhas ({filtered.length})</CardTitle>
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
                  {f.label} {statusCounts[f.key] ? `(${statusCounts[f.key]})` : ""}
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
            <Button onClick={() => setShowCreateDialog(true)} size="sm">
              <Plus className="mr-1 h-4 w-4" /> Nova Campanha
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-800">
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Objetivo</th>
                  <th className="px-4 py-3">Orçamento Diário</th>
                  <th className="px-4 py-3">Restante</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                      Carregando campanhas...
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                      {search || statusFilter !== "ALL"
                        ? "Nenhuma campanha encontrada com esses filtros."
                        : "Nenhuma campanha ainda. Crie sua primeira!"}
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((campaign) => {
                    const status = statusBadge[campaign.status] || statusBadge.PAUSED;
                    const budget = campaign.daily_budget
                      ? formatCurrency(parseFloat(campaign.daily_budget) / 100)
                      : "-";
                    const remaining = campaign.budget_remaining
                      ? formatCurrency(parseFloat(campaign.budget_remaining) / 100)
                      : "-";

                    return (
                      <tr
                        key={campaign.id}
                        className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-zinc-900 dark:text-white">{campaign.name}</p>
                          <p className="text-xs text-zinc-400">ID: {campaign.id}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                          {objectiveLabels[campaign.objective] || campaign.objective}
                        </td>
                        <td className="px-4 py-3 font-medium">{budget}</td>
                        <td className="px-4 py-3 text-zinc-600">{remaining}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            {campaign.status === "ACTIVE" ? (
                              <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(campaign)} title="Pausar">
                                <Pause className="h-4 w-4 text-amber-500" />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(campaign)} title="Ativar">
                                <Play className="h-4 w-4 text-emerald-500" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setDuplicateName(`Cópia de ${campaign.name}`);
                                setShowDuplicateDialog(true);
                              }}
                              title="Duplicar"
                            >
                              <Copy className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setShowDeleteDialog(true);
                              }}
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
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

      {/* Dialog: Criar Campanha */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Campanha</DialogTitle>
            <DialogDescription>Preencha os dados para criar uma nova campanha no Meta Ads.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Nome da Campanha</label>
              <Input
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                placeholder="Ex: Campanha de Vendas - Verão 2025"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Objetivo</label>
              <Select
                value={newCampaign.objective}
                onValueChange={(v) =>
                  setNewCampaign({ ...newCampaign, objective: v as CampaignObjective })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(objectiveLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Orçamento Diário (R$)</label>
              <Input
                type="number"
                value={newCampaign.daily_budget}
                onChange={(e) =>
                  setNewCampaign({ ...newCampaign, daily_budget: Number(e.target.value) })
                }
                min={1}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={!newCampaign.name}>
              Criar Campanha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Duplicar Campanha */}
      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicar Campanha</DialogTitle>
            <DialogDescription>
              Duplicando: {selectedCampaign?.name}
            </DialogDescription>
          </DialogHeader>
          <div>
            <label className="mb-1 block text-sm font-medium">Nome da Nova Campanha</label>
            <Input
              value={duplicateName}
              onChange={(e) => setDuplicateName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDuplicateDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDuplicate} disabled={!duplicateName}>
              Duplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Confirmar Exclusão */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Excluir Campanha
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a campanha <strong>&quot;{selectedCampaign?.name}&quot;</strong>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir Campanha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
