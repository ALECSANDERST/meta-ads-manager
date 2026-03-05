"use client";

import React, { useState } from "react";
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
import { FlaskConical, Plus, Sparkles, Loader2, Trophy } from "lucide-react";
import type { ABTest, Campaign } from "@/types/meta-ads";

interface ABTestsPanelProps {
  tests: ABTest[];
  campaigns: Campaign[];
  onCreateTest: (params: Record<string, unknown>) => void;
  onSuggestTests: () => void;
  loading?: boolean;
  suggestions?: {
    name: string;
    description: string;
    variable: string;
    hypothesis: string;
    expected_improvement: string;
  }[];
}

const statusLabels: Record<string, { label: string; variant: "success" | "warning" | "secondary" | "destructive" }> = {
  DRAFT: { label: "Rascunho", variant: "secondary" },
  RUNNING: { label: "Executando", variant: "success" },
  COMPLETED: { label: "Concluído", variant: "warning" },
  CANCELLED: { label: "Cancelado", variant: "destructive" },
};

const variableLabels: Record<string, string> = {
  CREATIVE: "Criativo",
  AUDIENCE: "Público",
  PLACEMENT: "Posicionamento",
  DELIVERY_OPTIMIZATION: "Otimização de Entrega",
};

export function ABTestsPanel({
  tests,
  campaigns,
  onCreateTest,
  onSuggestTests,
  loading,
  suggestions,
}: ABTestsPanelProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    variable: "CREATIVE",
    campaign_ids: [] as string[],
    end_time: "",
  });

  const handleCreate = () => {
    onCreateTest({
      action: "create",
      ...form,
    });
    setShowDialog(false);
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-cyan-600" />
              Testes A/B ({tests.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={onSuggestTests} disabled={loading}>
                {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
                Sugestões IA
              </Button>
              <Button size="sm" onClick={() => setShowDialog(true)}>
                <Plus className="mr-1 h-4 w-4" /> Novo Teste
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {tests.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center text-zinc-400">
                <FlaskConical className="mb-3 h-12 w-12 text-zinc-300" />
                <p className="text-sm font-medium">Nenhum teste A/B ativo</p>
                <p className="mt-1 text-xs">Crie testes para otimizar suas campanhas ou peça sugestões à IA.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tests.map((test) => {
                  const status = statusLabels[test.status] || statusLabels.DRAFT;
                  return (
                    <div
                      key={test.id}
                      className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{test.name}</h4>
                            <Badge variant={status.variant}>{status.label}</Badge>
                            <Badge variant="outline" className="text-[10px]">
                              {variableLabels[test.variable] || test.variable}
                            </Badge>
                          </div>
                          {test.description && <p className="mt-1 text-xs text-zinc-500">{test.description}</p>}
                        </div>
                        {test.winner_id && (
                          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                            <Trophy className="h-3 w-3" /> Vencedor encontrado
                          </div>
                        )}
                      </div>
                      {test.variants && test.variants.length > 0 && (
                        <div className="mt-3 grid gap-2 md:grid-cols-2">
                          {test.variants.map((v) => (
                            <div
                              key={v.id}
                              className={`rounded-md border p-2 text-xs ${
                                v.id === test.winner_id
                                  ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950"
                                  : "border-zinc-200 dark:border-zinc-800"
                              }`}
                            >
                              <p className="font-medium">{v.name}</p>
                              {v.metrics && (
                                <div className="mt-1 flex gap-3 text-zinc-500">
                                  <span>CTR: {v.metrics.ctr?.toFixed(2)}%</span>
                                  <span>CPA: R${v.metrics.cpa?.toFixed(2)}</span>
                                  <span>ROAS: {v.metrics.roas?.toFixed(2)}x</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sugestões da IA */}
        {suggestions && suggestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Sugestões de Testes A/B (Claude IA)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suggestions.map((s, i) => (
                  <div key={i} className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-amber-900 dark:text-amber-200">{s.name}</h4>
                      <Badge variant="outline">{variableLabels[s.variable] || s.variable}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">{s.description}</p>
                    <div className="mt-2 space-y-1 text-xs text-amber-600 dark:text-amber-400">
                      <p><strong>Hipótese:</strong> {s.hypothesis}</p>
                      <p><strong>Melhoria esperada:</strong> {s.expected_improvement}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Teste A/B</DialogTitle>
            <DialogDescription>Configure um novo teste A/B para suas campanhas.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Nome do Teste</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Teste Criativo - Imagem vs Vídeo" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Variável de Teste</label>
              <Select value={form.variable} onValueChange={(v) => setForm({ ...form, variable: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(variableLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Campanhas (selecione pelo menos 2)</label>
              <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-zinc-200 p-2 dark:border-zinc-800">
                {campaigns.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 rounded p-1 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <input
                      type="checkbox"
                      checked={form.campaign_ids.includes(c.id)}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          campaign_ids: e.target.checked
                            ? [...form.campaign_ids, c.id]
                            : form.campaign_ids.filter((id) => id !== c.id),
                        });
                      }}
                      className="rounded"
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Data de Término</label>
              <Input type="datetime-local" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={!form.name || form.campaign_ids.length < 2}>Criar Teste</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
