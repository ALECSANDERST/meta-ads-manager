"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Megaphone,
  Layers,
  FileText,
  X,
  Loader2,
} from "lucide-react";
import { CampaignStep } from "./campaign-step";
import { AdSetStep } from "./adset-step";
import { AdStep } from "./ad-step";
import type { CampaignFormData } from "@/types/meta-ads";
import { DEFAULT_CAMPAIGN_FORM } from "@/types/meta-ads";

interface CampaignWizardProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CampaignFormData) => Promise<void> | void;
}

const STEPS = [
  { key: "campaign", label: "Campanha", icon: Megaphone },
  { key: "adset", label: "Conjunto", icon: Layers },
  { key: "ad", label: "Anúncio", icon: FileText },
] as const;

function validateStep(step: number, form: CampaignFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (step === 0) {
    if (!form.name.trim()) errors.name = "Nome da campanha é obrigatório.";
  }

  if (step === 1) {
    if (!form.adset_name.trim()) errors.adset_name = "Nome do conjunto é obrigatório.";
    if (form.budget_type === "DAILY" && form.daily_budget < 1) {
      errors.budget = "Orçamento diário deve ser no mínimo R$ 1,00.";
    }
    if (form.budget_type === "LIFETIME" && form.lifetime_budget < 1) {
      errors.budget = "Orçamento total deve ser no mínimo R$ 1,00.";
    }
    if (!form.start_time) errors.start_time = "Data de início é obrigatória.";
    if (form.budget_type === "LIFETIME" && !form.end_time) {
      errors.end_time = "Data de término é obrigatória para orçamento total.";
    }
    if (form.end_time && form.start_time && new Date(form.end_time) <= new Date(form.start_time)) {
      errors.end_time = "Data de término deve ser posterior à data de início.";
    }
    if (form.countries.length === 0) errors.countries = "Selecione pelo menos um país.";
  }

  if (step === 2) {
    if (!form.ad_name.trim()) errors.ad_name = "Nome do anúncio é obrigatório.";
    if (!form.facebook_page_id.trim()) errors.facebook_page_id = "ID da página do Facebook é obrigatório.";
    if (form.creative_type === "IMAGE" && !form.image_url.trim()) {
      errors.creative_url = "URL da imagem é obrigatória.";
    }
    if (form.creative_type === "VIDEO" && !form.video_url.trim()) {
      errors.creative_url = "URL do vídeo é obrigatória.";
    }
    if (!form.primary_text.trim()) errors.primary_text = "Texto principal é obrigatório.";
    if (!form.headline.trim()) errors.headline = "Headline é obrigatório.";
    if (!form.destination_url.trim()) errors.destination_url = "URL de destino é obrigatória.";
    if (form.destination_url && !form.destination_url.startsWith("http")) {
      errors.destination_url = "URL deve começar com http:// ou https://";
    }
  }

  return errors;
}

export function CampaignWizard({ open, onClose, onSubmit }: CampaignWizardProps) {
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CampaignFormData>({ ...DEFAULT_CAMPAIGN_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((updates: Partial<CampaignFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
    // Clear related errors
    const clearedErrors = { ...errors };
    Object.keys(updates).forEach((key) => {
      delete clearedErrors[key];
    });
    setErrors(clearedErrors);
  }, [errors]);

  const handleNext = () => {
    const stepErrors = validateStep(step, form);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error("Preencha os campos obrigatórios.");
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, 2));
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    const stepErrors = validateStep(step, form);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error("Preencha os campos obrigatórios.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(form);
      toast.success("Campanha criada com sucesso!");
      handleReset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao criar campanha. Verifique os dados e tente novamente.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({ ...DEFAULT_CAMPAIGN_FORM });
    setStep(0);
    setErrors({});
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative my-8 w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        {/* Header */}
        <div className="sticky top-0 z-10 rounded-t-2xl border-b border-zinc-200 bg-white/95 px-6 py-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                Nova Campanha Completa
              </h2>
              <p className="text-xs text-zinc-500">
                Siga o fluxo: Campanha → Conjunto de Anúncios → Anúncio
              </p>
            </div>
            <button
              onClick={handleReset}
              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="mt-4 flex items-center gap-1">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isDone = i < step;
              return (
                <React.Fragment key={s.key}>
                  {i > 0 && (
                    <div
                      className={`h-0.5 flex-1 rounded ${
                        isDone ? "bg-blue-500" : "bg-zinc-200 dark:bg-zinc-700"
                      }`}
                    />
                  )}
                  <button
                    onClick={() => {
                      if (isDone) setStep(i);
                    }}
                    disabled={!isDone && !isActive}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                        : isDone
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
                    }`}
                  >
                    {isDone ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{i + 1}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto px-6 py-6">
          {step === 0 && <CampaignStep form={form} onChange={handleChange} errors={errors} />}
          {step === 1 && <AdSetStep form={form} onChange={handleChange} errors={errors} />}
          {step === 2 && <AdStep form={form} onChange={handleChange} errors={errors} />}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between rounded-b-2xl border-t border-zinc-200 bg-white/95 px-6 py-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95">
          <div className="text-xs text-zinc-400">
            Etapa {step + 1} de {STEPS.length} — {STEPS[step].label}
          </div>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={handleBack} size="sm">
                <ChevronLeft className="mr-1 h-4 w-4" /> Voltar
              </Button>
            )}
            {step < 2 ? (
              <Button onClick={handleNext} size="sm">
                Próximo <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-500 hover:to-violet-500"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Criando...
                  </>
                ) : (
                  <>
                    <Check className="mr-1 h-4 w-4" /> Criar Campanha
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
