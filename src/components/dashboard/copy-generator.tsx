"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2, Copy, Check, PenTool } from "lucide-react";

interface CopyGeneratorProps {
  onGenerate: (params: {
    product: string;
    target_audience: string;
    tone: string;
    objective: string;
    variations: number;
  }) => Promise<{ copies: { headline: string; body: string; cta: string }[] } | null>;
  loading?: boolean;
}

const ctaLabels: Record<string, string> = {
  SHOP_NOW: "Comprar Agora",
  LEARN_MORE: "Saiba Mais",
  SIGN_UP: "Cadastre-se",
  CONTACT_US: "Fale Conosco",
  GET_OFFER: "Obter Oferta",
};

export function CopyGenerator({ onGenerate, loading }: CopyGeneratorProps) {
  const [form, setForm] = useState({
    product: "",
    target_audience: "",
    tone: "profissional",
    objective: "vendas",
    variations: 3,
  });
  const [copies, setCopies] = useState<{ headline: string; body: string; cta: string }[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    const result = await onGenerate(form);
    if (result?.copies) {
      setCopies(result.copies);
    }
  };

  const handleCopy = (index: number) => {
    const copy = copies[index];
    const text = `Título: ${copy.headline}\nTexto: ${copy.body}\nCTA: ${ctaLabels[copy.cta] || copy.cta}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-pink-600" />
            Gerador de Copies com IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Produto / Serviço</label>
              <Textarea
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
                placeholder="Ex: Curso de Marketing Digital com 50h de conteúdo, certificado incluso, acesso vitalício..."
                rows={3}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Público-alvo</label>
              <Textarea
                value={form.target_audience}
                onChange={(e) => setForm({ ...form, target_audience: e.target.value })}
                placeholder="Ex: Empreendedores digitais, 25-45 anos, que querem escalar suas vendas online..."
                rows={3}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Tom de Voz</label>
              <Select value={form.tone} onValueChange={(v) => setForm({ ...form, tone: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="profissional">Profissional</SelectItem>
                  <SelectItem value="casual">Casual / Informal</SelectItem>
                  <SelectItem value="urgente">Urgente / Escassez</SelectItem>
                  <SelectItem value="emocional">Emocional / Storytelling</SelectItem>
                  <SelectItem value="humoristico">Humorístico</SelectItem>
                  <SelectItem value="educativo">Educativo / Autoridade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Objetivo</label>
              <Select value={form.objective} onValueChange={(v) => setForm({ ...form, objective: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendas">Vendas / Conversão</SelectItem>
                  <SelectItem value="leads">Geração de Leads</SelectItem>
                  <SelectItem value="trafego">Tráfego / Cliques</SelectItem>
                  <SelectItem value="engajamento">Engajamento</SelectItem>
                  <SelectItem value="reconhecimento">Reconhecimento de Marca</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Quantidade de Variações</label>
              <Input
                type="number"
                min={1}
                max={10}
                value={form.variations}
                onChange={(e) => setForm({ ...form, variations: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleGenerate}
                disabled={!form.product || !form.target_audience || loading}
                className="w-full"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Gerar Copies com Claude IA</>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {copies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Copies Geradas ({copies.length} variações)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {copies.map((copy, i) => (
                <div
                  key={i}
                  className="group relative rounded-lg border border-zinc-200 p-4 transition-shadow hover:shadow-md dark:border-zinc-800"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px]">
                      Variação {i + 1}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => handleCopy(i)}
                    >
                      {copiedIndex === i ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Título</p>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">{copy.headline}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Texto</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{copy.body}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">CTA</p>
                      <Badge variant="outline">{ctaLabels[copy.cta] || copy.cta}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
