"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Megaphone,
  Layers,
  FileText,
  Users,
  FlaskConical,
  Bot,
  Settings,
  DollarSign,
  Download,
  TrendingUp,
  PenTool,
  X,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "campaigns", label: "Campanhas", icon: Megaphone },
  { id: "adsets", label: "Conjuntos", icon: Layers },
  { id: "ads", label: "Anúncios", icon: FileText },
  { id: "reports", label: "Relatórios", icon: TrendingUp },
  { id: "audiences", label: "Públicos", icon: Users },
  { id: "budget", label: "Orçamento Auto", icon: DollarSign },
  { id: "ab-tests", label: "Testes A/B", icon: FlaskConical },
  { id: "ai-assistant", label: "Assistente IA", icon: Bot },
  { id: "copy-generator", label: "Gerador de Copies", icon: PenTool },
  { id: "export", label: "Exportar", icon: Download },
  { id: "settings", label: "Configurações", icon: Settings },
];

export function Sidebar({ activeTab, onTabChange, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 dark:border-zinc-800 dark:bg-zinc-950",
        "lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
            <Megaphone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-zinc-900 dark:text-white">MetaAds Pro</h1>
            <p className="text-[11px] text-zinc-500">Gerenciador Inteligente</p>
          </div>
        </div>
        {onMobileClose && (
          <button onClick={onMobileClose} className="rounded-md p-1 text-zinc-400 hover:text-zinc-600 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-400"
                )}
              />
              {item.label}
              {(item.id === "ai-assistant" || item.id === "copy-generator") && (
                <span className="ml-auto rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  IA
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-violet-50 p-3 dark:from-blue-950 dark:to-violet-950">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
            Powered by Claude AI
          </p>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            Otimização inteligente de campanhas
          </p>
        </div>
      </div>
    </aside>
  );
}
