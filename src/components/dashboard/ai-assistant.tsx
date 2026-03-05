"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles, Loader2, Lightbulb, AlertTriangle } from "lucide-react";
import type { ClaudeAnalysis, ClaudeChatMessage } from "@/types/meta-ads";

interface AIAssistantProps {
  analysis: ClaudeAnalysis | null;
  chatMessages: ClaudeChatMessage[];
  onChat: (message: string) => void;
  onAnalyze: () => void;
  onGenerateCopy: (params: {
    product: string;
    target_audience: string;
    tone: string;
    objective: string;
    variations: number;
  }) => void;
  loading?: boolean;
}

export function AIAssistant({
  analysis,
  chatMessages,
  onChat,
  onAnalyze,
  loading,
}: AIAssistantProps) {
  const [message, setMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = () => {
    if (!message.trim()) return;
    onChat(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { label: "Analisar Performance", action: () => onAnalyze(), icon: Sparkles },
    { label: "Como melhorar meu ROAS?", action: () => onChat("Como posso melhorar o ROAS das minhas campanhas?"), icon: Lightbulb },
    { label: "Campanhas com baixo CTR", action: () => onChat("Quais campanhas têm CTR abaixo do benchmark e o que fazer?"), icon: AlertTriangle },
    { label: "Sugestões de orçamento", action: () => onChat("Analise meus orçamentos e sugira otimizações."), icon: Lightbulb },
  ];

  const riskColors = {
    LOW: "success",
    MEDIUM: "warning",
    HIGH: "destructive",
  } as const;

  const priorityColors = {
    HIGH: "destructive",
    MEDIUM: "warning",
    LOW: "secondary",
  } as const;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Chat */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-violet-600" />
            Assistente Claude IA
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          {/* Quick Actions */}
          <div className="mb-4 flex flex-wrap gap-2">
            {quickActions.map((qa) => {
              const Icon = qa.icon;
              return (
                <Button
                  key={qa.label}
                  variant="outline"
                  size="sm"
                  onClick={qa.action}
                  disabled={loading}
                  className="text-xs"
                >
                  <Icon className="mr-1 h-3 w-3" />
                  {qa.label}
                </Button>
              );
            })}
          </div>

          {/* Messages */}
          <div className="mb-4 flex-1 space-y-3 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900" style={{ minHeight: 300, maxHeight: 500 }}>
            {chatMessages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center text-zinc-400">
                <div>
                  <Bot className="mx-auto mb-3 h-12 w-12 text-zinc-300" />
                  <p className="text-sm font-medium">Olá! Sou seu assistente de Meta Ads.</p>
                  <p className="mt-1 text-xs">
                    Pergunte qualquer coisa sobre suas campanhas ou use as ações rápidas acima.
                  </p>
                </div>
              </div>
            ) : (
              chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-zinc-800 shadow-sm dark:bg-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <p className={`mt-1 text-[10px] ${msg.role === "user" ? "text-blue-200" : "text-zinc-400"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm shadow-sm dark:bg-zinc-800">
                  <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
                  <span className="text-zinc-500">Claude está pensando...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte sobre suas campanhas..."
              className="min-h-[44px] resize-none"
              rows={1}
            />
            <Button onClick={handleSend} disabled={!message.trim() || loading} size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Análise Inteligente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!analysis ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-400">
              <Sparkles className="mb-3 h-12 w-12 text-zinc-300" />
              <p className="text-sm font-medium">Nenhuma análise disponível</p>
              <p className="mt-1 text-xs">Clique em &quot;Analisar Performance&quot; para o Claude analisar seus dados.</p>
              <Button className="mt-4" onClick={onAnalyze} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Analisar Agora
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Resumo</h4>
                  <Badge variant={riskColors[analysis.risk_level]}>
                    Risco: {analysis.risk_level}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{analysis.summary}</p>
              </div>

              {/* Predicted Impact */}
              <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">Impacto Previsto</p>
                <p className="mt-1 text-sm text-blue-600 dark:text-blue-300">{analysis.predicted_impact}</p>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="mb-3 text-sm font-semibold">
                  Recomendações ({analysis.recommendations.length})
                </h4>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <Badge variant={priorityColors[rec.priority]} className="text-[10px]">
                          {rec.priority}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {rec.type}
                        </Badge>
                        <span className="text-sm font-medium">{rec.title}</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {rec.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
