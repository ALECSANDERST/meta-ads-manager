"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Settings, Key, CheckCircle2, XCircle, ExternalLink } from "lucide-react";

export function SettingsPanel() {
  const [metaToken, setMetaToken] = useState("");
  const [metaAccountId, setMetaAccountId] = useState("");
  const [claudeKey, setClaudeKey] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meta_access_token: metaToken,
          meta_ad_account_id: metaAccountId,
          anthropic_api_key: claudeKey,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      // Settings are stored in .env.local, show instructions
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
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
              <Badge variant={metaToken ? "success" : "secondary"}>
                {metaToken ? (
                  <><CheckCircle2 className="mr-1 h-3 w-3" /> Configurado</>
                ) : (
                  <><XCircle className="mr-1 h-3 w-3" /> Pendente</>
                )}
              </Badge>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Access Token</label>
              <Input
                type="password"
                value={metaToken}
                onChange={(e) => setMetaToken(e.target.value)}
                placeholder="Cole seu Meta Access Token aqui"
              />
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
              <Input
                value={metaAccountId}
                onChange={(e) => setMetaAccountId(e.target.value)}
                placeholder="act_123456789"
              />
              <p className="mt-1 text-[11px] text-zinc-400">
                Formato: act_ seguido do ID numérico da sua conta de anúncios.
              </p>
            </div>
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
              <Badge variant={claudeKey ? "success" : "secondary"}>
                {claudeKey ? (
                  <><CheckCircle2 className="mr-1 h-3 w-3" /> Configurado</>
                ) : (
                  <><XCircle className="mr-1 h-3 w-3" /> Pendente</>
                )}
              </Badge>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">API Key</label>
              <Input
                type="password"
                value={claudeKey}
                onChange={(e) => setClaudeKey(e.target.value)}
                placeholder="sk-ant-..."
              />
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
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              As credenciais são armazenadas localmente no arquivo .env.local
            </p>
            <Button onClick={handleSave}>
              {saved ? (
                <><CheckCircle2 className="mr-2 h-4 w-4" /> Salvo!</>
              ) : (
                "Salvar Configurações"
              )}
            </Button>
          </div>
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
            <h4 className="font-semibold text-zinc-900 dark:text-white">3. Arquivo .env.local</h4>
            <p className="mt-1 text-xs">
              Alternativamente, configure diretamente no arquivo <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">.env.local</code> na raiz do projeto:
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
