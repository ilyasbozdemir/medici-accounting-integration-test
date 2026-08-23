"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ArrowDownRight,
  ArrowUpRight,
  Scale,
  RefreshCw,
  Calendar,
  FileText,
  Building2,
  ChevronDown,
  Download,
  Plus,
  SlidersHorizontal,
  X,
  CreditCard,
  Wallet,
  Building,
} from "lucide-react";
import { JournalVoucherType } from "./JournalVoucherFormView";

interface TransactionItem {
  id?: string;
  _id?: string;
  book?: string;
  memo?: string;
  date?: string;
  datetime?: string;
  timestamp?: string;
  posted?: boolean;
  voided?: boolean;
  lines?: Array<{
    account: string;
    type: "debit" | "credit";
    amount: number;
  }>;
}

interface TransactionDataTableProps {
  transactions: TransactionItem[];
  onOpenNewJournal: (type?: JournalVoucherType) => void;
  title?: string;
  subtitle?: string;
}

export function TransactionDataTable({
  transactions = [],
  onOpenNewJournal,
  title = "Yevmiye Kayıtları & İşlem Fişleri Defteri",
  subtitle = "Sistemdeki tüm çift taraflı (double-entry) fişler ve finansal hareketler",
}: TransactionDataTableProps) {
  // Filtering & Querying States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Helper to detect voucher type from lines/memo
  const detectVoucherType = (tx: TransactionItem): { label: string; badgeClass: string; icon: any } => {
    const memo = (tx.memo || "").toLowerCase();
    const accounts = (tx.lines || []).map((l) => l.account.toLowerCase());

    if (memo.includes("tahsilat") || accounts.some((a) => a.includes("revenue") || a.includes("600"))) {
      return { label: "Tahsilat Fişi", badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: ArrowDownRight };
    }
    if (memo.includes("tediye") || memo.includes("gider") || accounts.some((a) => a.includes("expenses") || a.includes("770"))) {
      return { label: "Tediye Fişi", badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/20", icon: ArrowUpRight };
    }
    if (memo.includes("virman") || memo.includes("transfer")) {
      return { label: "Virman Fişi", badgeClass: "bg-teal-500/10 text-teal-400 border-teal-500/20", icon: RefreshCw };
    }
    return { label: "Mahsup Fişi", badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: Scale };
  };

  // Extract debit amount or total amount for tx
  const getTxAmount = (tx: TransactionItem): number => {
    if (!tx.lines || tx.lines.length === 0) return 0;
    return tx.lines.filter((l) => l.type === "debit").reduce((sum, l) => sum + (l.amount || 0), 0);
  };

  // Filtered transactions computation
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const memoText = (tx.memo || "").toLowerCase();
      const accountsText = (tx.lines || []).map((l) => l.account.toLowerCase()).join(" ");
      const searchMatch =
        !searchTerm.trim() ||
        memoText.includes(searchTerm.toLowerCase()) ||
        accountsText.includes(searchTerm.toLowerCase());

      // Type Filter
      const txType = detectVoucherType(tx).label;
      let typeMatch = true;
      if (selectedType === "GELIR") typeMatch = txType === "Tahsilat Fişi";
      else if (selectedType === "GIDER") typeMatch = txType === "Tediye Fişi";
      else if (selectedType === "MAHSUP") typeMatch = txType === "Mahsup Fişi";
      else if (selectedType === "VIRMAN") typeMatch = txType === "Virman Fişi";

      // Date Range Filter
      const txDate = tx.date || tx.datetime?.split("T")[0] || "";
      const startMatch = !startDate || txDate >= startDate;
      const endMatch = !endDate || txDate <= endDate;

      // Amount Filter
      const txAmount = getTxAmount(tx);
      const minMatch = !minAmount || txAmount >= parseFloat(minAmount);
      const maxMatch = !maxAmount || txAmount <= parseFloat(maxAmount);

      return searchMatch && typeMatch && startMatch && endMatch && minMatch && maxMatch;
    });
  }, [transactions, searchTerm, selectedType, startDate, endDate, minAmount, maxAmount]);

  const totalFilteredSum = useMemo(() => {
    return filteredTransactions.reduce((sum, tx) => sum + getTxAmount(tx), 0);
  }, [filteredTransactions]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("ALL");
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden space-y-4 p-5">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" /> {title}
          </h2>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>

        {/* Quick Voucher Entry Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenNewJournal("GELIR")}
            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" /> + Tahsilat Fişi Kes
          </button>

          <button
            onClick={() => onOpenNewJournal("GIDER")}
            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" /> - Tediye Fişi Kes
          </button>

          <button
            onClick={() => onOpenNewJournal("ADVANCED")}
            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Scale className="h-3.5 w-3.5" /> ⚙️ Mahsup Fişi
          </button>
        </div>
      </div>

      {/* FILTER & QUERY TOOLBAR */}
      <div className="space-y-3 bg-slate-950/60 p-3.5 border border-slate-800 rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Fiş no, açıklama veya hesap ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto no-scrollbar">
            {[
              { id: "ALL", label: "Tüm Fişler" },
              { id: "GELIR", label: "🟢 Tahsilat" },
              { id: "GIDER", label: "🔴 Tediye" },
              { id: "MAHSUP", label: "⚙️ Mahsup" },
              { id: "VIRMAN", label: "🔄 Virman" },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setSelectedType(pill.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition whitespace-nowrap ${
                  selectedType === pill.id
                    ? "bg-slate-800 text-emerald-400 border-slate-700 shadow-sm"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Advanced Filters Toggle Button */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-2 rounded-xl border border-slate-800 transition"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-400" />
            <span>Filtreler</span>
            {showAdvancedFilters ? <X className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>

        {/* ADVANCED EXPANDABLE FILTERS (Tarih & Tutar Sorgulama) */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 animate-in fade-in duration-150">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Başlangıç Tarihi</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-lg focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Bitiş Tarihi</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-lg focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Min Tutar (₺)</label>
              <input
                type="number"
                placeholder="0.00"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-lg focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Max Tutar (₺)</label>
              <input
                type="number"
                placeholder="999999.00"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-lg focus:outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-4 flex items-center justify-end pt-1">
              <button
                onClick={clearFilters}
                className="text-xs text-rose-400 hover:underline font-semibold"
              >
                Tüm Filtreleri Temizle
              </button>
            </div>
          </div>
        )}

        {/* Filter Summary Badge */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 pt-1">
          <span>
            Toplam <strong className="text-slate-200">{filteredTransactions.length}</strong> kayıt listeleniyor
          </span>
          <span className="font-mono text-emerald-400 font-bold">
            Filtrelenen Toplam Hacim: ₺{totalFilteredSum.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider font-bold border-b border-slate-800">
              <th className="py-3 px-4">Tarih</th>
              <th className="py-3 px-4">Fiş No & Türü</th>
              <th className="py-3 px-4">Açıklama / Referans</th>
              <th className="py-3 px-4">Borç Hesabı (Debit)</th>
              <th className="py-3 px-4">Alacak Hesabı (Credit)</th>
              <th className="py-3 px-4 text-right">Tutar (₺)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                  Kriterlerinize uygun yevmiye kaydı veya fiş bulunamadı.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx, idx) => {
                const voucherInfo = detectVoucherType(tx);
                const VoucherIcon = voucherInfo.icon;
                const txDate = tx.date || tx.datetime?.split("T")[0] || "-";
                const amount = getTxAmount(tx);

                const debitLine = (tx.lines || []).find((l) => l.type === "debit");
                const creditLine = (tx.lines || []).find((l) => l.type === "credit");

                return (
                  <tr key={tx.id || tx._id || idx} className="hover:bg-slate-950/60 transition">
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">{txDate}</td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1 ${voucherInfo.badgeClass}`}>
                          <VoucherIcon className="h-3 w-3" />
                          {voucherInfo.label}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-200">{tx.memo || "-"}</td>

                    <td className="py-3 px-4 font-mono text-blue-400">
                      {debitLine ? debitLine.account : "-"}
                    </td>

                    <td className="py-3 px-4 font-mono text-emerald-400">
                      {creditLine ? creditLine.account : "-"}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-100">
                      ₺{amount.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
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
