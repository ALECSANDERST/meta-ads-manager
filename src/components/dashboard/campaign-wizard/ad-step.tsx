"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Image,
  Video,
  Type,
  Link,
  MousePointerClick,
  Facebook,
  Instagram,
  FileText,
  Globe,
  Eye,
} from "lucide-react";
import type { CampaignFormData, CallToActionType, CreativeType } from "@/types/meta-ads";

interface AdStepProps {
  form: CampaignFormData;
  onChange: (updates: Partial<CampaignFormData>) => void;
  errors: Record<string, string>;
}

const ctaOptions: { value: CallToActionType; label: string }[] = [
  { value: "LEARN_MORE", label: "Saiba mais" },
  { value: "SHOP_NOW", label: "Comprar agora" },
  { value: "SIGN_UP", label: "Cadastre-se" },
  { value: "SUBSCRIBE", label: "Assinar" },
  { value: "DOWNLOAD", label: "Baixar" },
  { value: "GET_OFFER", label: "Obter oferta" },
  { value: "BOOK_TRAVEL", label: "Reservar" },
  { value: "CONTACT_US", label: "Fale conosco" },
  { value: "APPLY_NOW", label: "Inscrever-se" },
  { value: "SEND_MESSAGE", label: "Enviar mensagem" },
  { value: "WATCH_MORE", label: "Assistir mais" },
  { value: "GET_QUOTE", label: "Obter cotação" },
  { value: "ORDER_NOW", label: "Pedir agora" },
  { value: "BUY_NOW", label: "Comprar" },
  { value: "NO_BUTTON", label: "Sem botão" },
];

export function AdStep({ form, onChange, errors }: AdStepProps) {
  return (
    <div className="space-y-6">
      {/* Ad Name */}
      <div>
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
          <FileText className="h-4 w-4 text-blue-500" />
          Nome do Anúncio <span className="text-red-500">*</span>
        </label>
        <Input
          value={form.ad_name}
          onChange={(e) => onChange({ ad_name: e.target.value })}
          placeholder="Ex: Anúncio - Imagem Produto Principal"
          className={errors.ad_name ? "border-red-500" : ""}
        />
        {errors.ad_name && <p className="mt-1 text-xs text-red-500">{errors.ad_name}</p>}
      </div>

      {/* Facebook Page & Instagram Account */}
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Facebook className="h-4 w-4 text-blue-600" /> Identidade
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-medium">
              <Facebook className="h-3.5 w-3.5" /> Página do Facebook <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.facebook_page_id}
              onChange={(e) => onChange({ facebook_page_id: e.target.value })}
              placeholder="ID da página (ex: 123456789)"
              className={errors.facebook_page_id ? "border-red-500" : ""}
            />
            {errors.facebook_page_id && (
              <p className="mt-1 text-xs text-red-500">{errors.facebook_page_id}</p>
            )}
            <p className="mt-1 text-[10px] text-zinc-400">
              Encontre em Configurações da Página → Sobre → ID da Página.
            </p>
          </div>
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-medium">
              <Instagram className="h-3.5 w-3.5" /> Conta do Instagram
            </label>
            <Input
              value={form.instagram_account_id}
              onChange={(e) => onChange({ instagram_account_id: e.target.value })}
              placeholder="ID da conta Instagram (opcional)"
            />
            <p className="mt-1 text-[10px] text-zinc-400">
              Necessário para posicionamentos no Instagram.
            </p>
          </div>
        </div>
      </div>

      {/* Creative Type & Media */}
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Image className="h-4 w-4 text-pink-500" /> Criativo
        </h3>
        <div className="mb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange({ creative_type: "IMAGE" as CreativeType })}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-all ${
              form.creative_type === "IMAGE"
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          >
            <Image className="h-3.5 w-3.5" /> Imagem
          </button>
          <button
            type="button"
            onClick={() => onChange({ creative_type: "VIDEO" as CreativeType })}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-all ${
              form.creative_type === "VIDEO"
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          >
            <Video className="h-3.5 w-3.5" /> Vídeo
          </button>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">
            {form.creative_type === "IMAGE" ? "URL da Imagem" : "URL do Vídeo"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <Input
            value={form.creative_type === "IMAGE" ? form.image_url : form.video_url}
            onChange={(e) =>
              onChange(
                form.creative_type === "IMAGE"
                  ? { image_url: e.target.value }
                  : { video_url: e.target.value }
              )
            }
            placeholder={
              form.creative_type === "IMAGE"
                ? "https://exemplo.com/imagem.jpg"
                : "https://exemplo.com/video.mp4"
            }
            className={errors.creative_url ? "border-red-500" : ""}
          />
          {errors.creative_url && <p className="mt-1 text-xs text-red-500">{errors.creative_url}</p>}
          <p className="mt-1 text-[10px] text-zinc-400">
            {form.creative_type === "IMAGE"
              ? "Recomendado: 1080x1080px (1:1) ou 1200x628px (1.91:1). Formatos: JPG, PNG."
              : "Recomendado: 1080x1080 ou 1080x1920. Formatos: MP4, MOV. Máx 4GB."}
          </p>
        </div>
      </div>

      {/* Texts */}
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Type className="h-4 w-4 text-violet-500" /> Textos do Anúncio
        </h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium">
              Texto Principal <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.primary_text}
              onChange={(e) => onChange({ primary_text: e.target.value })}
              placeholder="Texto que aparece acima da imagem/vídeo..."
              rows={3}
              className={`w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                errors.primary_text
                  ? "border-red-500"
                  : "border-zinc-200 dark:border-zinc-700"
              }`}
            />
            {errors.primary_text && <p className="mt-1 text-xs text-red-500">{errors.primary_text}</p>}
            <p className="mt-1 text-[10px] text-zinc-400">
              {form.primary_text.length}/125 caracteres recomendados (máx. 2200)
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium">
                Título (Headline) <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.headline}
                onChange={(e) => onChange({ headline: e.target.value })}
                placeholder="Título chamativo do anúncio"
                className={errors.headline ? "border-red-500" : ""}
              />
              {errors.headline && <p className="mt-1 text-xs text-red-500">{errors.headline}</p>}
              <p className="mt-1 text-[10px] text-zinc-400">{form.headline.length}/40 recomendados</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Descrição</label>
              <Input
                value={form.description}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder="Descrição complementar (opcional)"
              />
              <p className="mt-1 text-[10px] text-zinc-400">{form.description.length}/30 recomendados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Destination */}
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Link className="h-4 w-4 text-emerald-500" /> Destino
        </h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-medium">
              <Globe className="h-3.5 w-3.5" /> URL de Destino <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.destination_url}
              onChange={(e) => onChange({ destination_url: e.target.value })}
              placeholder="https://seusite.com/landing-page"
              className={errors.destination_url ? "border-red-500" : ""}
            />
            {errors.destination_url && (
              <p className="mt-1 text-xs text-red-500">{errors.destination_url}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium">Link de Exibição</label>
              <Input
                value={form.display_link}
                onChange={(e) => onChange({ display_link: e.target.value })}
                placeholder="seusite.com"
              />
              <p className="mt-1 text-[10px] text-zinc-400">Exibido abaixo do headline (opcional)</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Parâmetros de URL</label>
              <Input
                value={form.url_parameters}
                onChange={(e) => onChange({ url_parameters: e.target.value })}
                placeholder="utm_source=facebook&utm_medium=cpc"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div>
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
          <MousePointerClick className="h-4 w-4 text-orange-500" />
          Call to Action <span className="text-red-500">*</span>
        </label>
        <Select
          value={form.call_to_action}
          onValueChange={(v) => onChange({ call_to_action: v as CallToActionType })}
        >
          <SelectTrigger className={errors.call_to_action ? "border-red-500" : ""}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ctaOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Preview */}
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Eye className="h-4 w-4 text-zinc-500" /> Pré-visualização
        </h3>
        <div className="mx-auto max-w-sm overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          {/* Header */}
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-blue-500" />
            <div>
              <p className="text-xs font-semibold">Sua Página</p>
              <p className="text-[10px] text-zinc-400">Patrocinado</p>
            </div>
          </div>
          {/* Text */}
          <div className="px-3 pb-2">
            <p className="text-xs text-zinc-700 dark:text-zinc-300">
              {form.primary_text || "Seu texto principal aparecerá aqui..."}
            </p>
          </div>
          {/* Image */}
          <div className="aspect-square w-full bg-zinc-100 dark:bg-zinc-800">
            {form.image_url || form.video_url ? (
              <div className="flex h-full items-center justify-center">
                {form.creative_type === "IMAGE" ? (
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <Video className="h-12 w-12 text-zinc-400" />
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-400">
                <Image className="h-12 w-12" />
              </div>
            )}
          </div>
          {/* Bottom */}
          <div className="flex items-center justify-between border-t border-zinc-100 px-3 py-2 dark:border-zinc-800">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] uppercase text-zinc-400">
                {form.display_link || form.destination_url || "seusite.com"}
              </p>
              <p className="truncate text-xs font-semibold">
                {form.headline || "Seu headline aqui"}
              </p>
              <p className="truncate text-[10px] text-zinc-500">
                {form.description || "Descrição do anúncio"}
              </p>
            </div>
            <div className="ml-2 shrink-0 rounded bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold dark:bg-zinc-800">
              {ctaOptions.find((c) => c.value === form.call_to_action)?.label || "Saiba mais"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
