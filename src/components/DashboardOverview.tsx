"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Scale,
  TrendingUp,
  Wallet,
  Building2,
  PieChart,
  Plus,
  ArrowDownLeft,
  FileSpreadsheet,
} from "lucide-react";

interface SummaryData {
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  totalLiabilitiesAndEquity: number;
  isBalanceSheetBalanced: boolean;
  totalDebit: number;
  totalCredit: number;
  isTrialBalanceBalanced: boolean;
}

interface DashboardOverviewProps {
  summary: SummaryData | null;
  onOpenNewJournal: (initialType?: "GELIR" | "GIDER" | "ADVANCED") => void;
  onSeedDemoData: () => void;
}

export function DashboardOverview({ summary, onOpenNewJournal, onSeedDemoData }: DashboardOverviewProps) {
  if (!summary) {
    return (
      <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
        <Scale className="h-12 w-12 text-slate-600 mx-auto mb-3 animate-pulse" />
        <h3 className="text-lg font-semibold text-slate-300">Henüz Finansal İşlem Yüklenmedi</h3>
        <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
          Gelir-gider kayıtlarınızı tutmaya başlamak için örnek verileri yükleyebilir veya ilk Gelir / Gider kaydınızı oluşturabilirsiniz.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={onSeedDemoData}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-lg shadow-emerald-500/10"
          >
            Örnek Gelir-Gider İşlemlerini Yükle
          </button>
        </div>
      </div>
    );
  }

  const {
    totalAssets,
    totalLiabilities,
    totalEquity,
    totalRevenue,
    totalExpenses,
    netIncome,
    totalLiabilitiesAndEquity,
    isBalanceSheetBalanced,
    totalDebit,
    totalCredit,
  } = summary;

  const totalFlow = totalRevenue + totalExpenses;
  const revenuePercent = totalFlow > 0 ? Math.round((totalRevenue / totalFlow) * 100) : 50;

  return (
    <div className="space-y-6">
      {/* Quick Action Gelir / Gider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Quick Gelir Ekle */}
        <div 
          onClick={() => onOpenNewJournal("GELIR")}
          className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl p-5 cursor-pointer group transition-all duration-200 shadow-lg hover:shadow-emerald-500/10"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowDownRight className="h-6 w-6 stroke-[2.5]" />
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-1 rounded-lg border border-emerald-500/20">
              + GELİR KAYDI
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition">Gelir & Tahsilat Girişi</h3>
          <p className="text-xs text-slate-400 mt-1">Müşteri faturası, satış veya nakit/banka girişlerini işleyin.</p>
        </div>

        {/* Quick Gider Ekle */}
        <div 
          onClick={() => onOpenNewJournal("GIDER")}
          className="bg-gradient-to-br from-rose-950/40 to-slate-900 border border-rose-500/30 hover:border-rose-500/60 rounded-2xl p-5 cursor-pointer group transition-all duration-200 shadow-lg hover:shadow-rose-500/10"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowUpRight className="h-6 w-6 stroke-[2.5]" />
            </div>
            <span className="text-xs bg-rose-500/10 text-rose-400 font-bold px-2.5 py-1 rounded-lg border border-rose-500/20">
              - GİDER KAYDI
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-rose-400 transition">Gider & Harcama Ödemesi</h3>
          <p className="text-xs text-slate-400 mt-1">Kira, maaş, sunucu, fatura veya tedarikçi harcamalarını işleyin.</p>
        </div>

        {/* Quick Yevmiye Fişi */}
        <div 
          onClick={() => onOpenNewJournal("ADVANCED")}
          className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 cursor-pointer group transition-all duration-200 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Scale className="h-5 w-5" />
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-lg border border-slate-700">
              ⚙️ YEVMİYE FİŞİ
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-teal-400 transition">Gelişmiş Çift Taraflı Fiş</h3>
          <p className="text-xs text-slate-400 mt-1">Çok kalemli borç/alacak yevmiye kayıtlarını manuel girin.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Assets */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Kasa & Banka Varlıkları</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100">{formatCurrency(totalAssets)}</div>
          <div className="text-xs text-slate-400 mt-2">
            <span className="text-emerald-400 font-medium">Banka, Kasa, Alacaklar</span>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Toplam Gelir (Revenues)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">{formatCurrency(totalRevenue)}</div>
          <div className="text-xs text-slate-400 mt-2">
            <span>Satış & Hizmet Gelirleri</span>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Toplam Gider (Expenses)</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400">{formatCurrency(totalExpenses)}</div>
          <div className="text-xs text-slate-400 mt-2">
            <span>Operasyonel Giderler</span>
          </div>
        </div>

        {/* Net Income */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Net Kar / Zarar</span>
            <div className={`p-2 rounded-xl ${netIncome >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className={`text-2xl font-black ${netIncome >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {formatCurrency(netIncome)}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>Gelir - Gider Dengesi</span>
          </div>
        </div>

        {/* Total Equity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Özkaynaklar (Sermaye)</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <PieChart className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100">{formatCurrency(totalEquity)}</div>
          <div className="text-xs text-slate-400 mt-2">
            <span className="text-blue-400 font-medium">Sermaye Hesabı</span>
          </div>
        </div>
      </div>

      {/* Revenue vs Expense Bar & Accounting Equation Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expense Visual Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" /> Gelir - Gider Oranı
            </h3>
            <span className="text-xs font-mono text-slate-400">Net: {formatCurrency(netIncome)}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-400">Gelir: {formatCurrency(totalRevenue)} ({revenuePercent}%)</span>
              <span className="text-rose-400">Gider: {formatCurrency(totalExpenses)} ({100 - revenuePercent}%)</span>
            </div>
            <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
              <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${revenuePercent}%` }} />
              <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${100 - revenuePercent}%` }} />
            </div>
          </div>
        </div>

        {/* Balance Equation Status Card */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
            isBalanceSheetBalanced
              ? "bg-emerald-950/20 border-emerald-500/30"
              : "bg-rose-950/20 border-rose-500/30"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl ${
                isBalanceSheetBalanced ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
              }`}
            >
              <Scale className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-sm">Medici Çift Taraflı Muhasebe Eşitliği</h3>
                {isBalanceSheetBalanced ? (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Eşit (Verified)
                  </span>
                ) : (
                  <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Dengesiz
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                $Varlıklar ({formatCurrency(totalAssets)}) = Borçlar + Özkaynaklar ({formatCurrency(totalLiabilitiesAndEquity)})$
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
