"use client";

import React, { useState, useEffect } from "react";
import { JournalLineItem } from "@/lib/medici-service";
import {
  AlertCircle,
  CheckCircle2,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  Trash2,
  X,
  FileText,
  Scale,
  RefreshCw,
  Sparkles,
  Building2,
  Wallet,
  Receipt,
  CreditCard,
  Building,
  Check,
} from "lucide-react";
import { CompanyInfo } from "./Navbar";

export type JournalVoucherType = "GELIR" | "GIDER" | "ADVANCED" | "VIRMAN";

interface JournalWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialType?: JournalVoucherType;
  selectedBook?: string;
  companies?: CompanyInfo[];
  customAccounts?: Array<{ account: string; label?: string }>;
}

const DEFAULT_ACCOUNTS = [
  { value: "Assets:100:Kasa", label: "100 Kasa Hesabı (Nakit)", type: "Asset", icon: Wallet },
  { value: "Assets:102:Bank:Garanti", label: "102 Garanti Bankası TL Hesabı", type: "Asset", icon: Building },
  { value: "Assets:102:Bank:Akbank", label: "102 Akbank TL Hesabı", type: "Asset", icon: Building },
  { value: "Assets:102:Bank:Ziraat", label: "102 Ziraat Bankası TL Hesabı", type: "Asset", icon: Building },
  { value: "Assets:120:Alicilar:ACME", label: "120 Alıcılar - ACME Corp (Ticari Alacak)", type: "Asset", icon: Receipt },
  { value: "Assets:255:Equipment:Computers", label: "255 Demirbaşlar - Ofis Bilgisayarları", type: "Asset", icon: CreditCard },
  { value: "Liabilities:320:Saticilar:VendorA", label: "320 Satıcılar - Tedarikçi A (Ticari Borç)", type: "Liability", icon: Receipt },
  { value: "Liabilities:300:BankaKredisi", label: "300 Kısa Vadeli Banka Kredileri", type: "Liability", icon: Building },
  { value: "Equity:500:Sermaye", label: "500 Ödenmiş Sermaye Hesabı", type: "Equity", icon: Scale },
  { value: "Revenue:600:Services:Consulting", label: "600 Yurtiçi Satışlar - Danışmanlık Geliri", type: "Revenue", icon: ArrowDownRight },
  { value: "Revenue:600:Software", label: "600 Yurtiçi Satışlar - Yazılım Lisansı", type: "Revenue", icon: ArrowDownRight },
  { value: "Expenses:770:Rent", label: "770 Genel Yönetim - Ofis Kira Gideri", type: "Expense", icon: ArrowUpRight },
  { value: "Expenses:770:Salaries", label: "770 Genel Yönetim - Personel Maaş Giderleri", type: "Expense", icon: ArrowUpRight },
  { value: "Expenses:770:Hosting:AWS", label: "770 Genel Yönetim - AWS Sunucu Gideri", type: "Expense", icon: ArrowUpRight },
];

export function JournalWizardModal({
  isOpen,
  onClose,
  onSuccess,
  initialType = "GELIR",
  selectedBook = "AnaSirketDefteri",
  companies = [],
  customAccounts = [],
}: JournalWizardModalProps) {
  const [entryMode, setEntryMode] = useState<JournalVoucherType>(initialType);
  const [voucherNo, setVoucherNo] = useState(`FIS-${Date.now().toString().slice(-6)}`);
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [targetBook, setTargetBook] = useState(selectedBook);
  const [lines, setLines] = useState<JournalLineItem[]>([
    { account: "Assets:102:Bank:Garanti", type: "debit", amount: 15000 },
    { account: "Revenue:600:Services:Consulting", type: "credit", amount: 15000 },
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setEntryMode(initialType);
    applyPreset(initialType);
    setVoucherNo(`FIS-${Date.now().toString().slice(-6)}`);
  }, [initialType, isOpen]);

  useEffect(() => {
    setTargetBook(selectedBook);
  }, [selectedBook]);

  if (!isOpen) return null;

  const allAccountOptions = [
    ...DEFAULT_ACCOUNTS,
    ...customAccounts.map((c) => ({
      value: c.account,
      label: c.label || c.account,
      type: "Custom",
      icon: FileText,
    })),
  ];

  const totalDebits = lines.filter((l) => l.type === "debit").reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
  const totalCredits = lines.filter((l) => l.type === "credit").reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
  const difference = totalDebits - totalCredits;
  const isBalanced = Math.abs(difference) < 0.001 && lines.length >= 2 && totalDebits > 0;

  function applyPreset(mode: JournalVoucherType) {
    setEntryMode(mode);
    if (mode === "GELIR") {
      setMemo("Müşteri Hizmet & Satış Tahsilatı (Tahsilat Fişi)");
      setLines([
        { account: "Assets:102:Bank:Garanti", type: "debit", amount: 15000 },
        { account: "Revenue:600:Services:Consulting", type: "credit", amount: 15000 },
      ]);
    } else if (mode === "GIDER") {
      setMemo("Hizmet & Genel Yönetim Gider Ödemesi (Tediye Fişi)");
      setLines([
        { account: "Expenses:770:Rent", type: "debit", amount: 8500 },
        { account: "Assets:102:Bank:Garanti", type: "credit", amount: 8500 },
      ]);
    } else if (mode === "VIRMAN") {
      setMemo("Banka Hesapları Arası Para Aktarımı (Virman Fişi)");
      setLines([
        { account: "Assets:102:Bank:Akbank", type: "debit", amount: 10000 },
        { account: "Assets:102:Bank:Garanti", type: "credit", amount: 10000 },
      ]);
    } else {
      setMemo("Çift Taraflı Mahsup Fişi Kaydı");
    }
  }

  const handleQuickTemplate = (templateName: string) => {
    if (templateName === "NakitSatish") {
      setMemo("Kasa Nakit Satış Tahsilatı");
      setLines([
        { account: "Assets:100:Kasa", type: "debit", amount: 5000 },
        { account: "Revenue:600:Software", type: "credit", amount: 5000 },
      ]);
    } else if (templateName === "MasaustuMaas") {
      setMemo("Personel Maaş ve Prim Ödemesi");
      setLines([
        { account: "Expenses:770:Salaries", type: "debit", amount: 45000 },
        { account: "Assets:102:Bank:Garanti", type: "credit", amount: 45000 },
      ]);
    } else if (templateName === "AWSHosting") {
      setMemo("AWS Bulut Sunucu Altyapı Ödemesi");
      setLines([
        { account: "Expenses:770:Hosting:AWS", type: "debit", amount: 12500 },
        { account: "Assets:102:Bank:Garanti", type: "credit", amount: 12500 },
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
      setErrorMsg("Lütfen işlem fişi açıklamasını (memo) giriniz.");
      return;
    }
    if (!isBalanced) {
      setErrorMsg("Fiş dengesiz! Toplam Borç ve Toplam Alacak tutarları eşit olmalıdır.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const fullMemo = `[${voucherNo}] ${memo.trim()}`;
      const res = await fetch("/api/medici/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memo: fullMemo,
          date,
          lines,
          bookName: targetBook,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(data.error || "Fiş kaydedilemedi.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Ağ hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const currentCompObj = companies.find((c) => c.id === targetBook);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800/90 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-[0_0_80px_rgba(16,185,129,0.12)] space-y-6 relative overflow-hidden">
        
        {/* Glow Header Background */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                  {entryMode === "GELIR"
                    ? "Tahsilat Fişi (Gelir Kaydı)"
                    : entryMode === "GIDER"
                    ? "Tediye Fişi (Gider Ödemesi)"
                    : entryMode === "VIRMAN"
                    ? "Virman Fişi (Banka/Kasa Transferi)"
                    : "Mahsup Fişi (Çift Taraflı Yevmiye)"}
                </h2>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> {voucherNo}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>Kurum Defteri:</span>
                <strong className="text-emerald-400 font-semibold">{currentCompObj?.name || targetBook}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Voucher Type Tabs (4 Styled Options) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner relative z-10">
          <button
            type="button"
            onClick={() => applyPreset("GELIR")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold rounded-xl transition-all duration-200 ${
              entryMode === "GELIR"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <ArrowDownRight className="h-4 w-4 stroke-[2.5]" /> Tahsilat Fişi
          </button>

          <button
            type="button"
            onClick={() => applyPreset("GIDER")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold rounded-xl transition-all duration-200 ${
              entryMode === "GIDER"
                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-slate-950 shadow-lg shadow-rose-500/20 scale-[1.02]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <ArrowUpRight className="h-4 w-4 stroke-[2.5]" /> Tediye Fişi
          </button>

          <button
            type="button"
            onClick={() => applyPreset("VIRMAN")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold rounded-xl transition-all duration-200 ${
              entryMode === "VIRMAN"
                ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 shadow-lg shadow-teal-500/20 scale-[1.02]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <RefreshCw className="h-4 w-4" /> Virman Fişi
          </button>

          <button
            type="button"
            onClick={() => applyPreset("ADVANCED")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold rounded-xl transition-all duration-200 ${
              entryMode === "ADVANCED"
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-slate-950 shadow-lg shadow-blue-500/20 scale-[1.02]"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <Scale className="h-4 w-4" /> Mahsup Fişi
          </button>
        </div>

        {/* Quick Template Fill Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs relative z-10">
          <span className="text-slate-400 text-[11px] font-semibold">Hızlı Şablonlar:</span>
          <button
            type="button"
            onClick={() => handleQuickTemplate("NakitSatish")}
            className="bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/20 font-medium px-2.5 py-1 rounded-lg transition"
          >
            + Nakit Kasa Satışı
          </button>
          <button
            type="button"
            onClick={() => handleQuickTemplate("MasaustuMaas")}
            className="bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-500/20 font-medium px-2.5 py-1 rounded-lg transition"
          >
            - Personel Maaşı
          </button>
          <button
            type="button"
            onClick={() => handleQuickTemplate("AWSHosting")}
            className="bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/20 font-medium px-2.5 py-1 rounded-lg transition"
          >
            - AWS Sunucu Faturası
          </button>
        </div>

        {/* Main Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Metadata Section (Company, Memo, Date) */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Building2 className="h-3 w-3 text-emerald-400" /> Kurum Defteri
              </label>
              <select
                value={targetBook}
                onChange={(e) => setTargetBook(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} [{c.code}]
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Fiş İşlem Açıklaması (Memo)
              </label>
              <input
                type="text"
                required
                placeholder="Örn. Ocak Ayı Satış Tahsilatı / Yazılım Faturası"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Fiş Tarihi
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-400" /> Çift Taraflı Fiş Kalemleri (Debit / Credit Rows)
              </h3>
              <button
                type="button"
                onClick={handleAddLine}
                className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold transition active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" /> Kalem Ekle
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {lines.map((line, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 hover:border-slate-700 transition"
                >
                  {/* Account Selector */}
                  <div className="flex-1">
                    <input
                      type="text"
                      list="all-accounts-list"
                      placeholder="Hesap seçin veya yazın (Örn. Assets:102:Bank:Garanti)"
                      value={line.account}
                      onChange={(e) => handleLineChange(idx, "account", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-mono font-medium"
                    />
                  </div>

                  {/* Debit / Credit Selector */}
                  <select
                    value={line.type}
                    onChange={(e) => handleLineChange(idx, "type", e.target.value as "debit" | "credit")}
                    className={`text-xs font-extrabold px-3 py-2 rounded-xl focus:outline-none border cursor-pointer ${
                      line.type === "debit"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-teal-500/10 text-teal-400 border-teal-500/30"
                    }`}
                  >
                    <option value="debit">Borç (Debit)</option>
                    <option value="credit">Alacak (Credit)</option>
                  </select>

                  {/* Amount Input */}
                  <div className="w-full sm:w-36">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={line.amount}
                      onChange={(e) => handleLineChange(idx, "amount", parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs text-right px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-mono font-black"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveLine(idx)}
                    disabled={lines.length <= 2}
                    className="p-2 text-slate-500 hover:text-rose-400 disabled:opacity-20 transition self-center"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <datalist id="all-accounts-list">
              {allAccountOptions.map((acc, idx) => (
                <option key={idx} value={acc.value}>
                  {acc.label}
                </option>
              ))}
            </datalist>
          </div>

          {/* Live Double-Entry Balance Bar */}
          <div
            className={`p-4 rounded-2xl border transition-all duration-300 ${
              isBalanced
                ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                : "bg-rose-950/30 border-rose-500/40 text-rose-300"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs font-bold">
                {isBalanced ? (
                  <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-md font-extrabold flex items-center gap-1">
                    <Check className="h-3.5 w-3.5 stroke-[3]" /> FİŞ DENGELENDİ
                  </span>
                ) : (
                  <span className="bg-rose-500 text-slate-950 px-2 py-0.5 rounded-md font-extrabold flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> DENGESİZ FİŞ
                  </span>
                )}
                <span className="text-slate-300 text-xs">
                  {isBalanced
                    ? "Borç ve Alacak tutarları birebir eşit (Medici Verified)."
                    : `Fark: ${Math.abs(difference).toLocaleString("tr-TR")} TL (Eşitlenmelidir)`}
                </span>
              </div>

              <div className="font-mono text-xs space-x-4">
                <span>
                  Toplam Borç: <strong className="text-emerald-400">{totalDebits.toLocaleString("tr-TR")} TL</strong>
                </span>
                <span>
                  Toplam Alacak: <strong className="text-teal-400">{totalCredits.toLocaleString("tr-TR")} TL</strong>
                </span>
              </div>
            </div>

            {/* Visual Balance Progress Bar */}
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{
                  width: `${
                    totalDebits + totalCredits > 0
                      ? Math.min(100, Math.round((totalDebits / (totalDebits + totalCredits)) * 100))
                      : 50
                  }%`,
                }}
              />
              <div
                className="bg-teal-400 h-full transition-all duration-300"
                style={{
                  width: `${
                    totalDebits + totalCredits > 0
                      ? Math.min(100, Math.round((totalCredits / (totalDebits + totalCredits)) * 100))
                      : 50
                  }%`,
                }}
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/90 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" /> {errorMsg}
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-100 transition rounded-xl"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={!isBalanced || loading}
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-sm px-6 py-2.5 rounded-xl disabled:opacity-40 transition-all duration-200 shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? "İşleniyor..." : "Muhasebe Fişini Kaydet & İşle"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
