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
import { DollarSign, Plus, Sparkles, Zap, Loader2 } from "lucide-react";
import type { BudgetRule, Campaign } from "@/types/meta-ads";

interface BudgetRulesPanelProps {
  rules: BudgetRule[];
  campaigns: Campaign[];
  onAddRule: (rule: Partial<BudgetRule>) => void;
  onExecuteRule: (rule: BudgetRule) => void;
  onSuggestRules: () => void;
  loading?: boolean;
}

const metricLabels: Record<string, string> = {
  ROAS: "ROAS",
  CPA: "CPA (R$)",
  CTR: "CTR (%)",
  CPM: "CPM (R$)",
  SPEND: "Gasto (R$)",
};

const operatorLabels: Record<string, string> = {
  GREATER_THAN: "Maior que",
  LESS_THAN: "Menor que",
  EQUAL_TO: "Igual a",
};

const actionLabels: Record<string, string> = {
  INCREASE_BUDGET: "Aumentar Orçamento",
  DECREASE_BUDGET: "Diminuir Orçamento",
  PAUSE: "Pausar Campanha",
  ACTIVATE: "Ativar Campanha",
  SET_BUDGET: "Definir Orçamento",
};

export function BudgetRulesPanel({
  rules,
  campaigns,
  onAddRule,
  onExecuteRule,
  onSuggestRules,
  loading,
}: BudgetRulesPanelProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({
    name: "",
    campaign_id: "",
    metric: "ROAS",
    operator: "LESS_THAN",
    value: 2,
    time_window_days: 7,
    action_type: "DECREASE_BUDGET",
    action_value: 20,
    action_unit: "PERCENTAGE",
    frequency: "DAILY",
  });

  const handleCreate = () => {
    onAddRule({
      name: form.name,
      enabled: true,
      campaign_id: form.campaign_id,
      condition: {
        metric: form.metric as BudgetRule["condition"]["metric"],
        operator: form.operator as BudgetRule["condition"]["operator"],
        value: form.value,
        time_window_days: form.time_window_days,
      },
      action: {
        type: form.action_type as BudgetRule["action"]["type"],
        value: form.action_value,
        unit: form.action_unit as "PERCENTAGE" | "FIXED",
      },
      frequency: form.frequency as BudgetRule["frequency"],
    });
    setShowDialog(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            Regras de Orçamento Automático ({rules.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={onSuggestRules} disabled={loading}>
              {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
              Sugestões IA
            </Button>
            <Button size="sm" onClick={() => setShowDialog(true)}>
              <Plus className="mr-1 h-4 w-4" /> Nova Regra
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center text-zinc-400">
              <DollarSign className="mb-3 h-12 w-12 text-zinc-300" />
              <p className="text-sm font-medium">Nenhuma regra configurada</p>
              <p className="mt-1 text-xs">Crie regras para otimizar orçamentos automaticamente ou peça sugestões à IA.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => {
                const campaignName = campaigns.find((c) => c.id === rule.campaign_id)?.name || rule.campaign_id;
                return (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-zinc-900 dark:text-white">{rule.name}</h4>
                        <Badge variant={rule.enabled ? "success" : "secondary"}>
                          {rule.enabled ? "Ativa" : "Inativa"}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">{rule.frequency}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">
                        Campanha: {campaignName}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-400">
                        Se {metricLabels[rule.condition.metric]} {operatorLabels[rule.condition.operator]} {rule.condition.value}
                        {" "}(últimos {rule.condition.time_window_days} dias) → {actionLabels[rule.action.type]}
                        {rule.action.value ? ` ${rule.action.value}${rule.action.unit === "PERCENTAGE" ? "%" : " R$"}` : ""}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onExecuteRule(rule)}
                      disabled={loading}
                    >
                      <Zap className="mr-1 h-3 w-3" /> Executar
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Regra de Orçamento</DialogTitle>
            <DialogDescription>Configure uma regra automática de ajuste de orçamento.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Nome da Regra</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Pausar se ROAS baixo" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Campanha</label>
              <Select value={form.campaign_id} onValueChange={(v) => setForm({ ...form, campaign_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione a campanha" /></SelectTrigger>
                <SelectContent>
                  {campaigns.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Métrica</label>
                <Select value={form.metric} onValueChange={(v) => setForm({ ...form, metric: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(metricLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Condição</label>
                <Select value={form.operator} onValueChange={(v) => setForm({ ...form, operator: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(operatorLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Valor</label>
                <Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Ação</label>
              <Select value={form.action_type} onValueChange={(v) => setForm({ ...form, action_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(actionLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(form.action_type === "INCREASE_BUDGET" || form.action_type === "DECREASE_BUDGET") && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Valor do Ajuste</label>
                  <Input type="number" value={form.action_value} onChange={(e) => setForm({ ...form, action_value: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Unidade</label>
                  <Select value={form.action_unit} onValueChange={(v) => setForm({ ...form, action_unit: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Porcentagem (%)</SelectItem>
                      <SelectItem value="FIXED">Valor Fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={!form.name || !form.campaign_id}>Criar Regra</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
