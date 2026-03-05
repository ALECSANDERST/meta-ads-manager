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
import {
  Play,
  Pause,
  Copy,
  Plus,
  Search,
  FileText,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import type { Ad, Campaign } from "@/types/meta-ads";

interface AdsTableProps {
  ads: Ad[];
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

const ctaLabels: Record<string, string> = {
  SHOP_NOW: "Comprar Agora",
  LEARN_MORE: "Saiba Mais",
  SIGN_UP: "Cadastre-se",
  CONTACT_US: "Fale Conosco",
  GET_OFFER: "Obter Oferta",
  BOOK_TRAVEL: "Reservar",
  DOWNLOAD: "Baixar",
  WATCH_MORE: "Assistir Mais",
};

export function AdsTable({ ads, campaigns, onAction, loading }: AdsTableProps) {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [duplicateName, setDuplicateName] = useState("");

  const filtered = useMemo(() => {
    return ads.filter((a) => {
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [ads, search, statusFilter]);

  const pagination = usePagination(filtered.length, 10);
  const paginatedData = pagination.paginatedSlice(filtered);

  const getCampaignName = (campaignId: string) =>
    campaigns.find((c) => c.id === campaignId)?.name || campaignId;

  const getCreativeIcon = (ad: Ad) => {
    const name = ad.name.toLowerCase();
    if (name.includes("vídeo") || name.includes("video") || name.includes("reels")) return Video;
    if (name.includes("imagem") || name.includes("carrossel") || name.includes("stories")) return ImageIcon;
    return FileText;
  };

  const handleDuplicate = () => {
    if (selectedAd) {
      onAction("duplicate", {
        adId: selectedAd.id,
        adSetId: selectedAd.adset_id,
        newName: duplicateName,
      });
      setShowDuplicateDialog(false);
      toast.success("Anúncio duplicado com sucesso!");
    }
  };

  const handleToggleStatus = (ad: Ad) => {
    const action = ad.status === "ACTIVE" ? "pause" : "activate";
    onAction(action, { adId: ad.id });
    toast.info(action === "pause" ? `"${ad.name}" pausado.` : `"${ad.name}" ativado.`);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-pink-600" />
            Anúncios ({filtered.length})
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
              <Plus className="mr-1 h-4 w-4" /> Novo Anúncio
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-800">
                  <th className="px-4 py-3">Anúncio</th>
                  <th className="px-4 py-3">Campanha</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3">Texto</th>
                  <th className="px-4 py-3">CTA</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                      Carregando anúncios...
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                      {search || statusFilter !== "ALL" ? "Nenhum anúncio encontrado com esses filtros." : "Nenhum anúncio ainda."}
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((ad) => {
                    const status = statusBadge[ad.status] || statusBadge.PAUSED;
                    const Icon = getCreativeIcon(ad);

                    return (
                      <tr key={ad.id} className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                              <Icon className="h-4 w-4 text-zinc-500" />
                            </div>
                            <div>
                              <p className="font-medium text-zinc-900 dark:text-white">{ad.name}</p>
                              <p className="text-xs text-zinc-400">ID: {ad.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="max-w-[160px] truncate px-4 py-3 text-xs text-zinc-600 dark:text-zinc-400">
                          {getCampaignName(ad.campaign_id)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                        <td className="max-w-[150px] truncate px-4 py-3 text-xs font-medium">
                          {ad.creative?.title || "-"}
                        </td>
                        <td className="max-w-[200px] truncate px-4 py-3 text-xs text-zinc-500">
                          {ad.creative?.body || "-"}
                        </td>
                        <td className="px-4 py-3">
                          {ad.creative?.call_to_action_type && (
                            <Badge variant="outline" className="text-[10px]">
                              {ctaLabels[ad.creative.call_to_action_type] || ad.creative.call_to_action_type}
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            {ad.status === "ACTIVE" ? (
                              <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(ad)} title="Pausar">
                                <Pause className="h-4 w-4 text-amber-500" />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(ad)} title="Ativar">
                                <Play className="h-4 w-4 text-emerald-500" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedAd(ad);
                                setDuplicateName(`Cópia de ${ad.name}`);
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
            <DialogTitle>Duplicar Anúncio</DialogTitle>
            <DialogDescription>Duplicando: {selectedAd?.name}</DialogDescription>
          </DialogHeader>
          <div>
            <label className="mb-1 block text-sm font-medium">Nome do Novo Anúncio</label>
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
