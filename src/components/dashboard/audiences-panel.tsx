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
import { Users, Plus, UserPlus } from "lucide-react";
import type { CustomAudience } from "@/types/meta-ads";
import { formatNumber } from "@/lib/utils";

interface AudiencesPanelProps {
  audiences: CustomAudience[];
  onCreateCustom: (params: Record<string, unknown>) => void;
  onCreateLookalike: (params: Record<string, unknown>) => void;
  loading?: boolean;
}

export function AudiencesPanel({
  audiences,
  onCreateCustom,
  onCreateLookalike,
  loading,
}: AudiencesPanelProps) {
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [showLookalikeDialog, setShowLookalikeDialog] = useState(false);
  const [customForm, setCustomForm] = useState({ name: "", description: "", subtype: "WEBSITE" });
  const [lookalikeForm, setLookalikeForm] = useState({
    name: "",
    origin_audience_id: "",
    country: "BR",
    ratio: 0.01,
  });

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-violet-600" />
            Públicos ({audiences.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setShowCustomDialog(true)}>
              <Plus className="mr-1 h-4 w-4" /> Público Personalizado
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setShowLookalikeDialog(true)}>
              <UserPlus className="mr-1 h-4 w-4" /> Lookalike
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-zinc-400">Carregando públicos...</p>
          ) : audiences.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center text-zinc-400">
              <Users className="mb-3 h-12 w-12 text-zinc-300" />
              <p className="text-sm font-medium">Nenhum público encontrado</p>
              <p className="mt-1 text-xs">Crie públicos personalizados ou lookalike para segmentar melhor.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {audiences.map((audience) => (
                <div
                  key={audience.id}
                  className="rounded-lg border border-zinc-200 p-4 transition-shadow hover:shadow-md dark:border-zinc-800"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium text-zinc-900 dark:text-white">{audience.name}</h4>
                    <Badge variant="outline" className="text-[10px]">
                      {audience.subtype}
                    </Badge>
                  </div>
                  {audience.description && (
                    <p className="mb-2 text-xs text-zinc-500">{audience.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>
                      {audience.approximate_count
                        ? `~${formatNumber(audience.approximate_count)} pessoas`
                        : "Tamanho indisponível"}
                    </span>
                    <span>ID: {audience.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog: Criar Público Personalizado */}
      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Público Personalizado</DialogTitle>
            <DialogDescription>Crie um público personalizado para suas campanhas.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Nome</label>
              <Input
                value={customForm.name}
                onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                placeholder="Ex: Visitantes do Site - 30 dias"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Descrição</label>
              <Input
                value={customForm.description}
                onChange={(e) => setCustomForm({ ...customForm, description: e.target.value })}
                placeholder="Descrição do público"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Fonte</label>
              <Select value={customForm.subtype} onValueChange={(v) => setCustomForm({ ...customForm, subtype: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEBSITE">Website (Pixel)</SelectItem>
                  <SelectItem value="APP">Aplicativo</SelectItem>
                  <SelectItem value="ENGAGEMENT">Engajamento</SelectItem>
                  <SelectItem value="OFFLINE">Offline</SelectItem>
                  <SelectItem value="USER_PROVIDED_ONLY">Lista de Clientes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomDialog(false)}>Cancelar</Button>
            <Button onClick={() => { onCreateCustom(customForm); setShowCustomDialog(false); }} disabled={!customForm.name}>
              Criar Público
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Criar Lookalike */}
      <Dialog open={showLookalikeDialog} onOpenChange={setShowLookalikeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Público Lookalike</DialogTitle>
            <DialogDescription>Crie um público semelhante baseado em um público existente.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Nome</label>
              <Input
                value={lookalikeForm.name}
                onChange={(e) => setLookalikeForm({ ...lookalikeForm, name: e.target.value })}
                placeholder="Ex: Lookalike 1% - Compradores"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Público de Origem</label>
              <Select
                value={lookalikeForm.origin_audience_id}
                onValueChange={(v) => setLookalikeForm({ ...lookalikeForm, origin_audience_id: v })}
              >
                <SelectTrigger><SelectValue placeholder="Selecione o público base" /></SelectTrigger>
                <SelectContent>
                  {audiences.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">País</label>
              <Select value={lookalikeForm.country} onValueChange={(v) => setLookalikeForm({ ...lookalikeForm, country: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BR">Brasil</SelectItem>
                  <SelectItem value="US">Estados Unidos</SelectItem>
                  <SelectItem value="PT">Portugal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Tamanho (% da população)</label>
              <Select
                value={String(lookalikeForm.ratio)}
                onValueChange={(v) => setLookalikeForm({ ...lookalikeForm, ratio: Number(v) })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.01">1% (Mais Similar)</SelectItem>
                  <SelectItem value="0.02">2%</SelectItem>
                  <SelectItem value="0.03">3%</SelectItem>
                  <SelectItem value="0.05">5%</SelectItem>
                  <SelectItem value="0.10">10%</SelectItem>
                  <SelectItem value="0.15">15%</SelectItem>
                  <SelectItem value="0.20">20% (Maior Alcance)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLookalikeDialog(false)}>Cancelar</Button>
            <Button
              onClick={() => { onCreateLookalike(lookalikeForm); setShowLookalikeDialog(false); }}
              disabled={!lookalikeForm.name || !lookalikeForm.origin_audience_id}
            >
              Criar Lookalike
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
