"use client";

import React, { useState } from "react";
import { JournalLineItem } from "@/lib/medici-service";
import { AlertCircle, CheckCircle2, DollarSign, Plus, ArrowDownRight, ArrowUpRight, Trash2, X, FileText } from "lucide-react";

interface JournalWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialType?: "GELIR" | "GIDER" | "ADVANCED";
}

const DEFAULT_ACCOUNTS = [
  { value: "Assets:100:Kasa", label: "100 Merkez Kasa Hesabı" },
  { value: "Assets:102:Bank:Garanti", label: "102 Garanti Bankası TL Hesabı" },
  { value: "Assets:102:Bank:Akbank", label: "102 Akbank TL Hesabı" },
  { value: "Assets:120:Alicilar:ACME", label: "120 Alıcılar - ACME Corp (Ticari Alacak)" },
  { value: "Assets:255:Equipment:Computers", label: "255 Demirbaşlar - Ofis Bilgisayarları" },
  { value: "Liabilities:320:Saticilar:VendorA", label: "320 Satıcılar - Tedarikçi A (Ticari Borç)" },
  { value: "Liabilities:300:BankaKredisi", label: "300 Kısa Vadeli Banka Kredileri" },
  { value: "Equity:500:Sermaye", label: "500 Ödenmiş Sermaye Hesabı" },
  { value: "Revenue:600:Services:Consulting", label: "600 Yurtiçi Satışlar - Danışmanlık Geliri" },
  { value: "Revenue:600:Software", label: "600 Yurtiçi Satışlar - Yazılım Lisansı" },
  { value: "Expenses:770:Rent", label: "770 Genel Yönetim - Ofis Kira Gideri" },
  { value: "Expenses:770:Salaries", label: "770 Genel Yönetim - Personel Maaş Giderleri" },
  { value: "Expenses:770:Hosting:AWS", label: "770 Genel Yönetim - AWS Sunucu Gideri" },
];

export function JournalWizardModal({ isOpen, onClose, onSuccess, initialType = "GELIR" }: JournalWizardModalProps) {
  const [entryMode, setEntryMode] = useState<"GELIR" | "GIDER" | "ADVANCED">(initialType);
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [lines, setLines] = useState<JournalLineItem[]>([
    { account: "Assets:102:Bank:Garanti", type: "debit", amount: 5000 },
    { account: "Revenue:600:Services:Consulting", type: "credit", amount: 5000 },
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalDebits = lines.filter((l) => l.type === "debit").reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
  const totalCredits = lines.filter((l) => l.type === "credit").reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
  const difference = totalDebits - totalCredits;
  const isBalanced = Math.abs(difference) < 0.001 && lines.length >= 2 && totalDebits > 0;

  const applyPreset = (mode: "GELIR" | "GIDER" | "ADVANCED") => {
    setEntryMode(mode);
    if (mode === "GELIR") {
      setMemo("Müşteri Hizmet & Satış Tahsilatı");
      setLines([
        { account: "Assets:102:Bank:Garanti", type: "debit", amount: 15000 },
        { account: "Revenue:600:Services:Consulting", type: "credit", amount: 15000 },
      ]);
    } else if (mode === "GIDER") {
      setMemo("Hizmet & Genel Yönetim Gider Ödemesi");
      setLines([
        { account: "Expenses:770:Rent", type: "debit", amount: 8500 },
        { account: "Assets:102:Bank:Garanti", type: "credit", amount: 8500 },
      ]);
    }
  };

  const handleAddLine = () => {
    setLines([...lines, { account: "Expenses:770:Rent", type: "debit", amount: 0 }]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((_, i) => i !== index));
  };

  const handleLineChange = (index: number, field: keyof JournalLineItem, value: any) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memo.trim()) {
      setErrorMsg("Lütfen işlem açıklamasını (memo) giriniz.");
      return;
    }
    if (!isBalanced) {
      setErrorMsg("Kayıt dengesiz! Toplam Borç ve Toplam Alacak eşit olmalıdır.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/medici/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memo, date, lines }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(data.error || "İşlem kaydedilemedi.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Ağ hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-400" /> 
              {entryMode === "GELIR" ? "Gelir Tahsilat Kaydı Ekle" : entryMode === "GIDER" ? "Gider & Harcama Ödemesi Ekle" : "Çift Taraflı Yevmiye Fişi"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {entryMode === "GELIR" 
                ? "Kasaya/Bankaya giren geliri ve kaynak satış hesabını işleyin." 
                : entryMode === "GIDER" 
                ? "Kasadan/Bankadan çıkan gideri ve ilgili harcama kalemini işleyin."
                : "Çift taraflı muhasebe ilkesine (Debit = Credit) uygun gelişmiş yevmiye fişi."}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Entry Type Preset Switcher */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => applyPreset("GELIR")}
            className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition ${
              entryMode === "GELIR" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ArrowDownRight className="h-4 w-4" /> Gelir Kaydı (+ Tahsilat)
          </button>

          <button
            type="button"
            onClick={() => applyPreset("GIDER")}
            className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition ${
              entryMode === "GIDER" ? "bg-rose-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ArrowUpRight className="h-4 w-4" /> Gider Kaydı (- Ödeme)
          </button>

          <button
            type="button"
            onClick={() => setEntryMode("ADVANCED")}
            className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition ${
              entryMode === "ADVANCED" ? "bg-blue-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="h-4 w-4" /> Gelişmiş Yevmiye Fişi
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-medium text-slate-300">İşlem Açıklaması (Memo)</label>
              <input
                type="text"
                required
                placeholder="Ör. Ocak Ayı Yazılım Faturası / Ofis Kirası Ödemesi"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm px-3.5 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">İşlem Tarihi</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm px-3.5 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Lines Table */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Çift Taraflı Muhasebe Kalemleri (Debit / Credit)
              </h3>
              <button
                type="button"
                onClick={handleAddLine}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium transition"
              >
                <Plus className="h-3.5 w-3.5" /> Kalem Ekle
              </button>
            </div>

            <div className="space-y-2">
              {lines.map((line, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="flex-1">
                    <input
                      type="text"
                      list="default-accounts"
                      placeholder="Hesap seçin veya yazın (ör. Assets:102:Bank:Garanti)"
                      value={line.account}
                      onChange={(e) => handleLineChange(idx, "account", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <select
                    value={line.type}
                    onChange={(e) => handleLineChange(idx, "type", e.target.value as "debit" | "credit")}
                    className={`text-sm font-semibold px-3 py-1.5 rounded-lg focus:outline-none border ${
                      line.type === "debit"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-teal-500/10 text-teal-400 border-teal-500/20"
                    }`}
                  >
                    <option value="debit">Borç (Debit)</option>
                    <option value="credit">Alacak (Credit)</option>
                  </select>

                  <div className="w-32">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={line.amount}
                      onChange={(e) => handleLineChange(idx, "amount", parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-sm text-right px-3 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 font-mono font-bold"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveLine(idx)}
                    disabled={lines.length <= 2}
                    className="p-2 text-slate-500 hover:text-rose-400 disabled:opacity-30 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <datalist id="default-accounts">
              {DEFAULT_ACCOUNTS.map((acc) => (
                <option key={acc.value} value={acc.value}>
                  {acc.label}
                </option>
              ))}
            </datalist>
          </div>

          {/* Validation Balance Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isBalanced ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}>
            <div className="flex items-center gap-2.5 text-xs font-medium">
              {isBalanced ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <AlertCircle className="h-5 w-5 text-rose-400" />}
              <span>
                {isBalanced
                  ? "Kayıt Dengelendi! Toplam Borç ve Alacak tutarları eşit."
                  : `Kayıt Dengesiz! Fark: ${Math.abs(difference).toLocaleString("tr-TR")} TL (Borç = Alacak olmalıdır)`}
              </span>
            </div>

            <div className="font-mono text-xs text-right space-x-3">
              <span>Borç: <strong>{totalDebits.toLocaleString("tr-TR")} TL</strong></span>
              <span>Alacak: <strong>{totalCredits.toLocaleString("tr-TR")} TL</strong></span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> {errorMsg}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={!isBalanced || loading}
              className="bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-sm px-5 py-2 rounded-xl disabled:opacity-40 transition shadow-lg shadow-emerald-500/10"
            >
              {loading ? "İşleniyor..." : "İşlemi Kaydet (Commit)"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
