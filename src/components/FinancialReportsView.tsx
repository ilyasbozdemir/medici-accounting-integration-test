"use client";

import React, { useState } from "react";
import { formatCurrency, formatAccountName } from "@/lib/utils";
import { AccountBalance } from "@/lib/medici-service";
import { Calculator, CheckCircle2, FileSpreadsheet, PieChart, Scale, TrendingUp } from "lucide-react";

interface ReportsData {
  summary: {
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
  };
  balanceSheet: {
    assets: AccountBalance[];
    liabilities: AccountBalance[];
    equity: AccountBalance[];
  };
  incomeStatement: {
    revenue: AccountBalance[];
    expenses: AccountBalance[];
  };
  trialBalance: AccountBalance[];
}

interface FinancialReportsViewProps {
  reports: ReportsData | null;
}

export function FinancialReportsView({ reports }: FinancialReportsViewProps) {
  const [activeTab, setActiveTab] = useState<"balanceSheet" | "incomeStatement" | "trialBalance">("balanceSheet");

  if (!reports) {
    return <div className="p-8 text-center text-slate-500">Rapor verileri hazırlanıyor...</div>;
  }

  const { summary, balanceSheet, incomeStatement, trialBalance } = reports;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-400" /> Finansal Tablolar & Raporlar
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Medici çift taraflı kayıt verilerinden üretilen finansal tablolar.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("balanceSheet")}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition ${
              activeTab === "balanceSheet"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Bilanço (Balance Sheet)
          </button>
          <button
            onClick={() => setActiveTab("incomeStatement")}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition ${
              activeTab === "incomeStatement"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Gelir Tablosu (P&L)
          </button>
          <button
            onClick={() => setActiveTab("trialBalance")}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition ${
              activeTab === "trialBalance"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Mizan (Trial Balance)
          </button>
        </div>
      </div>

      {/* Balance Sheet Content */}
      {activeTab === "balanceSheet" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ASSETS Column */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-slate-100 uppercase tracking-wider text-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> VARLIKLAR (ASSETS)
                </h3>
                <span className="font-mono font-bold text-emerald-400 text-base">{formatCurrency(summary.totalAssets)}</span>
              </div>

              <div className="space-y-2 text-sm">
                {balanceSheet.assets.map((item, idx) => {
                  const formatted = formatAccountName(item.account);
                  return (
                    <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-900">
                      <div>
                        <span className="text-slate-100 font-medium text-xs block">{formatted.title}</span>
                        <span className="text-slate-500 font-mono text-[10px]">{item.account}</span>
                      </div>
                      <span className="font-mono text-slate-100 font-bold">{formatCurrency(item.balance)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LIABILITIES & EQUITY Column */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-slate-100 uppercase tracking-wider text-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> BORÇLAR & ÖZKAYNAKLAR
                </h3>
                <span className="font-mono font-bold text-teal-400 text-base">{formatCurrency(summary.totalLiabilitiesAndEquity)}</span>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-400 mb-2">Yükümlülükler (Liabilities)</h4>
                  {balanceSheet.liabilities.length === 0 ? (
                    <div className="text-slate-500 text-xs italic py-1">Kayıtlı borç bulunmuyor</div>
                  ) : (
                    balanceSheet.liabilities.map((item, idx) => {
                      const formatted = formatAccountName(item.account);
                      return (
                        <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-900">
                          <div>
                            <span className="text-slate-100 font-medium text-xs block">{formatted.title}</span>
                            <span className="text-slate-500 font-mono text-[10px]">{item.account}</span>
                          </div>
                          <span className="font-mono text-slate-100 font-bold">{formatCurrency(item.balance)}</span>
                        </div>
                      );
                    })
                  )}
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-blue-400 mb-2">Özkaynaklar & Net Kar (Equity)</h4>
                  {balanceSheet.equity.map((item, idx) => {
                    const formatted = formatAccountName(item.account);
                    return (
                      <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-900">
                        <div>
                          <span className="text-slate-100 font-medium text-xs block">{formatted.title}</span>
                          <span className="text-slate-500 font-mono text-[10px]">{item.account}</span>
                        </div>
                        <span className="font-mono text-slate-100 font-bold">{formatCurrency(item.balance)}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center py-1 border-b border-slate-900 font-semibold">
                    <span className="text-emerald-400 font-mono text-xs">Dönem Net Karı (Retained Earnings)</span>
                    <span className="font-mono text-emerald-400">{formatCurrency(summary.netIncome)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Income Statement Content */}
      {activeTab === "incomeStatement" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4 max-w-3xl mx-auto">
            <h3 className="text-lg font-bold text-slate-100 text-center border-b border-slate-800 pb-3">
              Gelir ve Gider Tablosu (Income Statement / P&L)
            </h3>

            {/* Revenue */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-400 flex items-center justify-between border-b border-slate-800 pb-1">
                <span>1. Gelirler (Revenues)</span>
                <span>{formatCurrency(summary.totalRevenue)}</span>
              </h4>
              {incomeStatement.revenue.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pl-4 py-1 text-sm">
                  <span className="text-slate-300 font-mono text-xs">{item.account}</span>
                  <span className="font-mono text-slate-100">{formatCurrency(item.balance)}</span>
                </div>
              ))}
            </div>

            {/* Expenses */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs uppercase tracking-wider font-bold text-rose-400 flex items-center justify-between border-b border-slate-800 pb-1">
                <span>2. Giderler (Expenses)</span>
                <span>{formatCurrency(summary.totalExpenses)}</span>
              </h4>
              {incomeStatement.expenses.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pl-4 py-1 text-sm">
                  <span className="text-slate-300 font-mono text-xs">{item.account}</span>
                  <span className="font-mono text-slate-100">{formatCurrency(item.balance)}</span>
                </div>
              ))}
            </div>

            {/* Net Income Summary */}
            <div className="pt-4 border-t-2 border-slate-800 flex justify-between items-center font-bold text-base">
              <span className="text-slate-100">Dönem Net Karı / (Zararı):</span>
              <span className={summary.netIncome >= 0 ? "text-emerald-400" : "text-rose-400"}>
                {formatCurrency(summary.netIncome)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Trial Balance Content */}
      {activeTab === "trialBalance" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-950 p-4 border border-slate-800 rounded-xl text-sm">
            <span className="text-slate-300 font-medium">Mizan Kontrolü (Trial Balance Equivalence):</span>
            <span className="font-mono font-bold text-emerald-400">
              Borç Toplamı ({formatCurrency(summary.totalDebit)}) = Alacak Toplamı ({formatCurrency(summary.totalCredit)})
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4">Hesap</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4 text-right">Bakiye</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {trialBalance.map((item, idx) => {
                  const formatted = formatAccountName(item.account);
                  return (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="p-4">
                        <span className="font-semibold text-emerald-400 font-mono text-xs mr-2">{formatted.code}</span>
                        <span className="text-slate-200 font-medium">{formatted.title}</span>
                        <span className="block text-xs font-mono text-slate-500">{item.account}</span>
                      </td>
                      <td className="p-4 text-xs text-slate-400">{item.category}</td>
                      <td className="p-4 text-right font-mono font-bold text-slate-100">{formatCurrency(item.balance)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
