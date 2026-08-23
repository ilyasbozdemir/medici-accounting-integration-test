"use client";

import React, { useState } from "react";
import { formatCurrency, formatAccountName } from "@/lib/utils";
import { AccountBalance } from "@/lib/medici-service";
import { Building, DollarSign, Layers, PieChart, Search, Wallet, TrendingUp, TrendingDown } from "lucide-react";

interface ChartOfAccountsProps {
  accounts: AccountBalance[];
}

export function ChartOfAccounts({ accounts }: ChartOfAccountsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredAccounts = accounts.filter((a) => {
    const matchesSearch = a.account.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: AccountBalance["category"]) => {
    switch (category) {
      case "Assets":
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-md font-medium">Varlıklar (Assets)</span>;
      case "Liabilities":
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-0.5 rounded-md font-medium">Borçlar (Liabilities)</span>;
      case "Equity":
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-0.5 rounded-md font-medium">Özkaynaklar (Equity)</span>;
      case "Revenue":
        return <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs px-2.5 py-0.5 rounded-md font-medium">Gelirler (Revenue)</span>;
      case "Expenses":
        return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-2.5 py-0.5 rounded-md font-medium">Giderler (Expenses)</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-md font-medium">Diğer</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" /> Hesap Planı (Chart of Accounts)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Medici hiyerarşik hesap yapısı (`Assets:Bank:Garanti` şeklinde colons ile yapılandırılır).
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Hesap ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-sm pl-9 pr-4 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 w-48 sm:w-64"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Tüm Kategoriler</option>
            <option value="Assets">Varlıklar (Assets)</option>
            <option value="Liabilities">Borçlar (Liabilities)</option>
            <option value="Equity">Özkaynaklar (Equity)</option>
            <option value="Revenue">Gelirler (Revenue)</option>
            <option value="Expenses">Giderler (Expenses)</option>
          </select>
        </div>
      </div>

      {/* Account Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4">Hesap Yolu / Adı (Account Path)</th>
              <th className="p-4">Kategori</th>
              <th className="p-4 text-right">Mevcut Bakiye (Net Balance)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-500">
                  Hesap bulunamadı.
                </td>
              </tr>
            ) : (
              filteredAccounts.map((acc, index) => {
                const depth = acc.account.split(":").length - 1;
                const formatted = formatAccountName(acc.account);
                return (
                  <tr key={index} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-medium text-slate-200" style={{ paddingLeft: `${16 + depth * 20}px` }}>
                      <span className="text-slate-500 mr-1.5">{depth > 0 ? "└─" : "•"}</span>
                      <span className="font-semibold text-emerald-400 font-mono text-xs mr-2">{formatted.code}</span>
                      <span className="text-slate-100">{formatted.title}</span>
                      <span className="block text-xs font-mono text-slate-500 mt-0.5">{acc.account}</span>
                    </td>
                    <td className="p-4">{getCategoryBadge(acc.category)}</td>
                    <td className="p-4 text-right font-mono font-bold text-slate-100">
                      {formatCurrency(acc.balance)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
