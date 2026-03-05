import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { PerformanceReport } from "@/types/meta-ads";

const HEADERS_PT: Record<string, string> = {
  date_start: "Data Início",
  date_stop: "Data Fim",
  campaign_name: "Campanha",
  adset_name: "Conjunto de Anúncios",
  ad_name: "Anúncio",
  impressions: "Impressões",
  clicks: "Cliques",
  spend: "Gasto (R$)",
  reach: "Alcance",
  frequency: "Frequência",
  cpm: "CPM (R$)",
  cpc: "CPC (R$)",
  ctr: "CTR (%)",
  conversions: "Conversões",
  cost_per_conversion: "Custo/Conversão (R$)",
  roas: "ROAS",
  revenue: "Receita (R$)",
};

function transformData(reports: PerformanceReport[]) {
  return reports.map((r) => ({
    "Data Início": r.date_start,
    "Data Fim": r.date_stop,
    Campanha: r.campaign_name || "-",
    "Conjunto de Anúncios": r.adset_name || "-",
    Anúncio: r.ad_name || "-",
    Impressões: r.impressions,
    Cliques: r.clicks,
    "Gasto (R$)": Number(r.spend.toFixed(2)),
    Alcance: r.reach,
    Frequência: Number(r.frequency.toFixed(2)),
    "CPM (R$)": Number(r.cpm.toFixed(2)),
    "CPC (R$)": Number(r.cpc.toFixed(2)),
    "CTR (%)": Number(r.ctr.toFixed(2)),
    Conversões: r.conversions,
    "Custo/Conversão (R$)": Number(r.cost_per_conversion.toFixed(2)),
    ROAS: Number(r.roas.toFixed(2)),
    "Receita (R$)": Number(r.revenue.toFixed(2)),
  }));
}

export function exportToExcel(reports: PerformanceReport[], filename = "relatorio-meta-ads") {
  const data = transformData(reports);
  const ws = XLSX.utils.json_to_sheet(data);

  // Ajustar largura das colunas
  const colWidths = Object.keys(HEADERS_PT).map((key) => ({
    wch: Math.max(HEADERS_PT[key].length + 2, 15),
  }));
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Relatório");

  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buf], { type: "application/octet-stream" });
  saveAs(blob, `${filename}.xlsx`);
}

export function exportToCSV(reports: PerformanceReport[], filename = "relatorio-meta-ads") {
  const data = transformData(reports);
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws, { FS: ";" });

  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${filename}.csv`);
}

export function exportToJSON(reports: PerformanceReport[], filename = "relatorio-meta-ads") {
  const blob = new Blob([JSON.stringify(reports, null, 2)], {
    type: "application/json;charset=utf-8;",
  });
  saveAs(blob, `${filename}.json`);
}
