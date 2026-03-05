"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Settings, Key, CheckCircle2, XCircle, ExternalLink, Shield, Eye, EyeOff } from "lucide-react";

interface ConfigStatus {
  meta_configured: boolean;
  claude_configured: boolean;
  meta_account_hint: string | null;
  meta_token_hint: string | null;
  claude_key_hint: string | null;
}

export function SettingsPanel() {
  const [metaToken, setMetaToken] = useState("");
  const [metaAccountId, setMetaAccountId] = useState("");
  const [claudeKey, setClaudeKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);
  const [showFields, setShowFields] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showClaude, setShowClaude] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const json = await res.json();
        setConfigStatus(json.data);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!metaToken && !metaAccountId && !claudeKey) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meta_access_token: metaToken || undefined,
          meta_ad_account_id: metaAccountId || undefined,
          anthropic_api_key: claudeKey || undefined,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSaved(true);
        setMetaToken("");
        setMetaAccountId("");
        setClaudeKey("");
        setShowFields(false);
        // Update status directly from POST response
        if (json.data) {
          setConfigStatus(json.data);
        } else {
          await fetchStatus();
        }
        setTimeout(() => setSaved(false), 3000);
      } else {
        setSaveError(json.error || "Erro ao salvar configurações. Tente novamente.");
        setTimeout(() => setSaveError(null), 5000);
      }
    } catch {
      setSaveError("Erro de conexão. Verifique sua internet e tente novamente.");
      setTimeout(() => setSaveError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const isMetaConfigured = configStatus?.meta_configured ?? false;
  const isClaudeConfigured = configStatus?.claude_configured ?? false;

  return (
    <div className="space-y-6">
      {/* Security notice */}
      <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950">
        <Shield className="h-4 w-4 shrink-0 text-emerald-600" />
        <p className="text-xs text-emerald-700 dark:text-emerald-400">
          Suas credenciais são armazenadas de forma segura no servidor. Elas <strong>nunca</strong> são
          expostas no frontend, no código-fonte ou em respostas da API.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-zinc-600" />
            Configurações
          </CardTitle>
          <CardDescription>
            Configure suas credenciais para conectar com a Meta Ads API e o Claude AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Meta Ads */}
          <div className="space-y-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                  <Key className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Meta Ads API</h3>
                  <p className="text-xs text-zinc-500">Facebook / Instagram Ads</p>
                </div>
              </div>
              <Badge variant={isMetaConfigured ? "success" : "secondary"}>
                {isMetaConfigured ? (
                  <><CheckCircle2 className="mr-1 h-3 w-3" /> Configurado</>
                ) : (
                  <><XCircle className="mr-1 h-3 w-3" /> Pendente</>
                )}
              </Badge>
            </div>

            {isMetaConfigured && !showFields && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="font-medium">Token:</span>
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
                    {configStatus?.meta_token_hint || "••••••••"}
                  </code>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="font-medium">Account:</span>
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
                    {configStatus?.meta_account_hint || "••••••••"}
                  </code>
                </div>
              </div>
            )}

            {(showFields || !isMetaConfigured) && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium">Access Token</label>
                  <div className="relative">
                    <Input
                      type={showToken ? "text" : "password"}
                      autoComplete="off"
                      value={metaToken}
                      onChange={(e) => setMetaToken(e.target.value)}
                      placeholder={isMetaConfigured ? "Novo token (deixe vazio para manter)" : "Cole seu Meta Access Token aqui"}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    Obtenha em{" "}
                    <a
                      href="https://developers.facebook.com/tools/explorer/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Graph API Explorer <ExternalLink className="inline h-3 w-3" />
                    </a>
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Ad Account ID</label>
                  <div className="relative">
                    <Input
                      type={showAccount ? "text" : "password"}
                      autoComplete="off"
                      value={metaAccountId}
                      onChange={(e) => setMetaAccountId(e.target.value)}
                      placeholder={isMetaConfigured ? "Novo ID (deixe vazio para manter)" : "act_123456789"}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccount(!showAccount)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      {showAccount ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    Formato: act_ seguido do ID numérico da sua conta de anúncios.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Claude AI */}
          <div className="space-y-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
                  <Key className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Claude AI (Anthropic)</h3>
                  <p className="text-xs text-zinc-500">Assistente inteligente</p>
                </div>
              </div>
              <Badge variant={isClaudeConfigured ? "success" : "secondary"}>
                {isClaudeConfigured ? (
                  <><CheckCircle2 className="mr-1 h-3 w-3" /> Configurado</>
                ) : (
                  <><XCircle className="mr-1 h-3 w-3" /> Pendente</>
                )}
              </Badge>
            </div>

            {isClaudeConfigured && !showFields && (
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="font-medium">API Key:</span>
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
                  {configStatus?.claude_key_hint || "••••••••"}
                </code>
              </div>
            )}

            {(showFields || !isClaudeConfigured) && (
              <div>
                <label className="mb-1 block text-sm font-medium">API Key</label>
                <div className="relative">
                  <Input
                    type={showClaude ? "text" : "password"}
                    autoComplete="off"
                    value={claudeKey}
                    onChange={(e) => setClaudeKey(e.target.value)}
                    placeholder={isClaudeConfigured ? "Nova chave (deixe vazio para manter)" : "sk-ant-..."}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowClaude(!showClaude)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {showClaude ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-zinc-400">
                  Obtenha em{" "}
                  <a
                    href="https://console.anthropic.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    console.anthropic.com <ExternalLink className="inline h-3 w-3" />
                  </a>
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {(isMetaConfigured || isClaudeConfigured) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFields(!showFields)}
                  className="text-xs"
                >
                  {showFields ? <EyeOff className="mr-1 h-3.5 w-3.5" /> : <Eye className="mr-1 h-3.5 w-3.5" />}
                  {showFields ? "Ocultar campos" : "Atualizar credenciais"}
                </Button>
              )}
            </div>
            <Button onClick={handleSave} disabled={saving || (!metaToken && !metaAccountId && !claudeKey)}>
              {saved ? (
                <><CheckCircle2 className="mr-2 h-4 w-4" /> Salvo!</>
              ) : saving ? (
                "Salvando..."
              ) : (
                "Salvar Configurações"
              )}
            </Button>
          </div>

          {saveError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
              <XCircle className="mr-1 inline h-3.5 w-3.5" />
              {saveError}
            </div>
          )}

          {saved && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />
              Configurações salvas com sucesso! Recarregue a página para usar dados reais.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Como Configurar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white">1. Meta Ads API</h4>
            <ol className="mt-1 list-inside list-decimal space-y-1 text-xs">
              <li>Acesse o <strong>Facebook Developers</strong> e crie um app</li>
              <li>Adicione o produto <strong>Marketing API</strong></li>
              <li>No <strong>Graph API Explorer</strong>, gere um token com permissões de ads</li>
              <li>Copie o ID da conta de anúncios (formato: act_XXXXXXXXX)</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white">2. Claude AI (Anthropic)</h4>
            <ol className="mt-1 list-inside list-decimal space-y-1 text-xs">
              <li>Crie uma conta em <strong>console.anthropic.com</strong></li>
              <li>Vá em <strong>API Keys</strong> e crie uma nova chave</li>
              <li>Copie a chave (formato: sk-ant-...)</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white">3. Variáveis de Ambiente</h4>
            <p className="mt-1 text-xs">
              Configure diretamente nas variáveis de ambiente do seu servidor (Vercel, etc.) ou no arquivo <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">.env.local</code> na raiz do projeto:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-900 p-3 text-xs text-zinc-300">
{`META_ACCESS_TOKEN=seu_token_aqui
META_AD_ACCOUNT_ID=act_seu_id_aqui
ANTHROPIC_API_KEY=sk-ant-sua_chave_aqui`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
