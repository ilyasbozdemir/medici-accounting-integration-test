"use client";

import React, { useState } from "react";
import { formatCurrency, formatAccountName } from "@/lib/utils";
import { BookOpen, Calendar, FileText, Filter, Search } from "lucide-react";

interface TransactionItem {
  id: string;
  datetime: string;
  account: string;
  credit: number;
  debit: number;
  memo: string;
  journalId?: string;
  approved?: boolean;
  voided?: boolean;
}

interface LedgerViewProps {
  transactions: TransactionItem[];
}

export function LedgerView({ transactions }: LedgerViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [accountFilter, setAccountFilter] = useState("ALL");

  const accountsList = Array.from(new Set(transactions.map((t) => t.account)));

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.memo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.account.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccount = accountFilter === "ALL" || t.account === accountFilter;
    return matchesSearch && matchesAccount;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-400" /> Defter-i Kebir & Yevmiye Hareketleri (Ledger)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Medici `Book` veritabanında saklanan tüm onaylanmış Borç ve Alacak kayıtları.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Açıklama veya hesap ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-sm pl-9 pr-4 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 w-48 sm:w-64"
            />
          </div>

          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Tüm Hesaplar</option>
            {accountsList.map((acc) => (
              <option key={acc} value={acc}>
                {formatAccountName(acc).title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4">Tarih</th>
              <th className="p-4">Açıklama (Memo)</th>
              <th className="p-4">Hesap (Account)</th>
              <th className="p-4 text-right">Borç (Debit)</th>
              <th className="p-4 text-right">Alacak (Credit)</th>
              <th className="p-4 text-center">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Henüz kayıtlı defter-i kebir hareketi yok.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => {
                const formatted = formatAccountName(tx.account);
                return (
                  <tr key={tx.id} className={`hover:bg-slate-800/40 transition ${tx.voided ? "opacity-40 line-through" : ""}`}>
                    <td className="p-4 text-slate-400 text-xs font-mono whitespace-nowrap">
                      {new Date(tx.datetime).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="p-4 font-medium text-slate-200">{tx.memo}</td>
                    <td className="p-4">
                      <span className="font-semibold text-emerald-400 font-mono text-xs block">{formatted.code}</span>
                      <span className="text-slate-200 font-medium">{formatted.title}</span>
                      <span className="block text-xs font-mono text-slate-500">{tx.account}</span>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-400">
                      {tx.debit > 0 ? formatCurrency(tx.debit) : "-"}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-teal-400">
                      {tx.credit > 0 ? formatCurrency(tx.credit) : "-"}
                    </td>
                    <td className="p-4 text-center">
                      {tx.voided ? (
                        <span className="bg-rose-500/10 text-rose-400 text-xs font-medium px-2 py-0.5 rounded">İptal (Void)</span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-400 text-xs font-medium px-2 py-0.5 rounded">Onaylandı</span>
                      )}
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
