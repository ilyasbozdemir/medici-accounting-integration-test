"use client";

import React, { useState } from "react";
import { formatCurrency, formatAccountName } from "@/lib/utils";
import { AccountBalance } from "@/lib/medici-service";
import { Layers, Plus, Search, X, CheckCircle2 } from "lucide-react";

interface ChartOfAccountsProps {
  accounts: AccountBalance[];
  onAddAccount?: (newAccount: { account: string; category: AccountBalance["category"] }) => void;
}

export function ChartOfAccounts({ accounts, onAddAccount }: ChartOfAccountsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New account form state
  const [cat, setCat] = useState<AccountBalance["category"]>("Assets");
  const [code, setCode] = useState("102");
  const [name, setName] = useState("");
  const [subName, setSubName] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Construct Medici path string e.g. Assets:102:Bank:Ziraat
    const cleanName = name.trim().replace(/[\s:]+/g, "");
    const cleanSub = subName.trim() ? `:${subName.trim().replace(/[\s:]+/g, "")}` : "";
    const fullPath = `${cat}:${code}:${cleanName}${cleanSub}`;

    if (onAddAccount) {
      onAddAccount({ account: fullPath, category: cat });
    }

    setSuccessMsg(`"${fullPath}" hesabı Hesap Planına eklendi.`);
    setName("");
    setSubName("");
    setTimeout(() => {
      setSuccessMsg(null);
      setIsAddModalOpen(false);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" /> Hesap Planı & Kod Kataloğu
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Kurumsal hesap kategorileri, bankalar, kasalar, alıcı ve satıcı tanımları.
          </p>
        </div>

        {/* Filters & Add Account Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Hesap ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-sm pl-9 pr-4 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 w-40 sm:w-56"
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

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-500/10 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Yeni Hesap Ekle</span>
          </button>
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

      {/* Add Account Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                <Plus className="h-5 w-5 text-emerald-400" /> Yeni Hesap Ekle (TDHP)
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAccountSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Hesap Kategorisi</label>
                <select
                  value={cat}
                  onChange={(e) => {
                    const selected = e.target.value as AccountBalance["category"];
                    setCat(selected);
                    if (selected === "Assets") setCode("102");
                    else if (selected === "Liabilities") setCode("320");
                    else if (selected === "Equity") setCode("500");
                    else if (selected === "Revenue") setCode("600");
                    else if (selected === "Expenses") setCode("770");
                  }}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
                >
                  <option value="Assets">1 - Varlıklar (Assets - Kasa, Banka, Alacaklar)</option>
                  <option value="Liabilities">3/4 - Borçlar (Liabilities - Satıcılar, Krediler)</option>
                  <option value="Equity">5 - Özkaynaklar (Equity - Sermaye, Kâr/Zarar)</option>
                  <option value="Revenue">6 - Gelirler (Revenue - Yurtiçi Satışlar)</option>
                  <option value="Expenses">7 - Giderler (Expenses - Yönetim, Pazarlama Giderleri)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">TDHP Kodu</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="102"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Hesap Adı</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn. Bank veya Rent"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Alt Hesap Detayı (Opsiyonel)</label>
                <input
                  type="text"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="Örn. Ziraat / Vakifbank / YazilimLisansi"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono">
                <span className="text-slate-400">Oluşturulacak Hesap Yolu:</span>
                <div className="text-emerald-400 font-bold mt-1">
                  {cat}:{code}:{name || "..."}{subName ? `:${subName}` : ""}
                </div>
              </div>

              {successMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> {successMsg}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition shadow-md shadow-emerald-500/10"
                >
                  Hesabı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
