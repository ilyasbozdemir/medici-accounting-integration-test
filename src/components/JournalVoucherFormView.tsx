"use client";

import React, { useEffect, useState } from "react";
import { JournalLineItem } from "@/lib/medici-service";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Building,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  FileText,
  Plus,
  Receipt,
  RefreshCw,
  Scale,
  Sparkles,
  Trash2,
  Wallet,
  Calculator,
  X,
} from "lucide-react";
import { CompanyInfo } from "./Navbar";

export type JournalVoucherType = "GELIR" | "GIDER" | "ADVANCED" | "VIRMAN";

interface ExtendedLineItem {
  account: string;
  debitAmount: number | string;
  creditAmount: number | string;
  corporateCode: string;
  selected?: boolean;
}

interface JournalVoucherFormViewProps {
  initialType?: JournalVoucherType;
  selectedBook?: string;
  companies?: CompanyInfo[];
  customAccounts?: Array<{ account: string; label?: string }>;
  onClose: () => void;
  onSuccess: () => void;
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

const CORPORATE_CODES = [
  { value: "11.01.01", label: "11.01.01 - Genel Yönetim Birimi" },
  { value: "11.02.01", label: "11.02.01 - Bilgi İşlem Dairesi Başkanlığı" },
  { value: "12.01.00", label: "12.01.00 - Satış & Pazarlama Direktörlüğü" },
  { value: "13.04.00", label: "13.04.00 - İnsan Kaynakları Dairesi" },
  { value: "14.05.00", label: "14.05.00 - Mali İşler & Muhasebe" },
];

export function JournalVoucherFormView({
  initialType = "GELIR",
  selectedBook = "AnaSirketDefteri",
  companies = [],
  customAccounts = [],
  onClose,
  onSuccess,
}: JournalVoucherFormViewProps) {
  const [entryMode, setEntryMode] = useState<JournalVoucherType>(initialType);

  // Official Form Upper Header Fields
  const [spendingUnit, setSpendingUnit] = useState("Genel Yönetim Dairesi Başkanlığı");
  const [voucherDate, setVoucherDate] = useState(new Date().toISOString().split("T")[0]);
  const [memo, setMemo] = useState("Müşteri Danışmanlık Hizmet Bedeli Tahsilatı");
  const [targetUnit, setTargetUnit] = useState("Ana Merkez Operasyon Birimi");

  const [targetBook, setTargetBook] = useState(selectedBook);
  const [selectAll, setSelectAll] = useState(false);

  // Detail table lines with separate Debit / Credit columns
  const [lines, setLines] = useState<ExtendedLineItem[]>([
    { account: "Assets:102:Bank:Garanti", debitAmount: 25000, creditAmount: 0, corporateCode: "11.01.01", selected: false },
    { account: "Revenue:600:Services:Consulting", debitAmount: 0, creditAmount: 25000, corporateCode: "12.01.00", selected: false },
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setEntryMode(initialType);
    applyPreset(initialType);
  }, [initialType]);

  useEffect(() => {
    setTargetBook(selectedBook);
  }, [selectedBook]);

  const allAccountOptions = [
    ...DEFAULT_ACCOUNTS,
    ...customAccounts.map((c) => ({
      value: c.account,
      label: c.label || c.account,
      type: "Custom",
      icon: FileText,
    })),
  ];

  // Preset Applicator
  const applyPreset = (mode: JournalVoucherType) => {
    setErrorMsg(null);
    if (mode === "GELIR") {
      setSpendingUnit("Satış & Pazarlama Dairesi");
      setMemo("Müşteri Hizmet Bedeli Tahsilatı");
      setTargetUnit("Garanti Bankası Kurumsal Şube");
      setLines([
        { account: "Assets:102:Bank:Garanti", debitAmount: 25000, creditAmount: 0, corporateCode: "12.01.00", selected: false },
        { account: "Revenue:600:Services:Consulting", debitAmount: 0, creditAmount: 25000, corporateCode: "12.01.00", selected: false },
      ]);
    } else if (mode === "GIDER") {
      setSpendingUnit("Genel Yönetim Dairesi");
      setMemo("Ofis Kira ve Sunucu Operasyon Gideri Ödemesi");
      setTargetUnit("Mali İşler & Muhasebe Şubesi");
      setLines([
        { account: "Expenses:770:Rent", debitAmount: 12500, creditAmount: 0, corporateCode: "11.01.01", selected: false },
        { account: "Assets:102:Bank:Garanti", debitAmount: 0, creditAmount: 12500, corporateCode: "14.05.00", selected: false },
      ]);
    } else if (mode === "VIRMAN") {
      setSpendingUnit("Mali İşler & Hazine Dairesi");
      setMemo("Garanti Bankası Hesabından Akbank Hesabına Virman");
      setTargetUnit("Akbank Kurumsal Şube");
      setLines([
        { account: "Assets:102:Bank:Akbank", debitAmount: 50000, creditAmount: 0, corporateCode: "14.05.00", selected: false },
        { account: "Assets:102:Bank:Garanti", debitAmount: 0, creditAmount: 50000, corporateCode: "14.05.00", selected: false },
      ]);
    } else {
      setSpendingUnit("İnsan Kaynakları & Maaş Birimi");
      setMemo("Dönem Sonu Personel Maaş & Tahakkuk Kaydı");
      setTargetUnit("Personel Ödeme Birimi");
      setLines([
        { account: "Expenses:770:Salaries", debitAmount: 35000, creditAmount: 0, corporateCode: "13.04.00", selected: false },
        { account: "Assets:100:Kasa", debitAmount: 0, creditAmount: 35000, corporateCode: "14.05.00", selected: false },
      ]);
    }
  };

  // Calculations
  const totalDebits = lines.reduce((sum, l) => sum + (Number(l.debitAmount) || 0), 0);
  const totalCredits = lines.reduce((sum, l) => sum + (Number(l.creditAmount) || 0), 0);
  const isBalanced = totalDebits > 0 && Math.abs(totalDebits - totalCredits) < 0.01;
  const balanceDifference = Math.abs(totalDebits - totalCredits);

  // Table Line Handlers
  const handleLineChange = (index: number, field: keyof ExtendedLineItem, value: any) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const handleAddLine = () => {
    setLines([
      ...lines,
      {
        account: "Assets:100:Kasa",
        debitAmount: 0,
        creditAmount: 0,
        corporateCode: "11.01.01",
        selected: false,
      },
    ]);
  };

  // SMART FEATURE: Kalanı Hesapla (Calculates remaining balance difference automatically)
  const handleCalculateRemaining = () => {
    if (balanceDifference < 0.01) {
      setErrorMsg("Fiş zaten tam dengede! Borç ve alacak tutarları birbirine eşittir.");
      return;
    }
    setErrorMsg(null);

    const updated = [...lines];
    const lastIdx = updated.length - 1;

    if (totalDebits > totalCredits) {
      // Need to add credit amount to reach balance
      const currentCredit = Number(updated[lastIdx].creditAmount) || 0;
      updated[lastIdx].creditAmount = (currentCredit + balanceDifference).toFixed(2);
      updated[lastIdx].debitAmount = 0;
    } else {
      // Need to add debit amount to reach balance
      const currentDebit = Number(updated[lastIdx].debitAmount) || 0;
      updated[lastIdx].debitAmount = (currentDebit + balanceDifference).toFixed(2);
      updated[lastIdx].creditAmount = 0;
    }

    setLines(updated);
  };

  // Delete selected lines
  const handleDeleteSelected = () => {
    const remaining = lines.filter((l) => !l.selected);
    if (remaining.length < 2) {
      setErrorMsg("Muhasebe kaydında en az 2 satır kalmalıdır.");
      return;
    }
    setLines(remaining);
    setSelectAll(false);
  };

  // Toggle select all checkboxes
  const handleToggleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setLines(lines.map((l) => ({ ...l, selected: checked })));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) {
      setErrorMsg(
        `Borç (₺${totalDebits.toLocaleString("tr-TR")}) ve Alacak (₺${totalCredits.toLocaleString("tr-TR")}) tutarları eşit olmalıdır!`
      );
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    // Transform lines to double-entry format for Medici Engine
    const finalLines: JournalLineItem[] = [];
    lines.forEach((l) => {
      const db = Number(l.debitAmount) || 0;
      const cr = Number(l.creditAmount) || 0;

      if (db > 0) {
        finalLines.push({ account: l.account, type: "debit", amount: db });
      }
      if (cr > 0) {
        finalLines.push({ account: l.account, type: "credit", amount: cr });
      }
    });

    try {
      const res = await fetch("/api/medici/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book: targetBook,
          memo: `[Birim: ${spendingUnit}] ${memo}`,
          date: voucherDate,
          lines: finalLines,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Muhasebe kaydı işlenemedi.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "İşlem sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Title & Module Preset Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="h-4 w-4" /> Geri Dön
            </button>
            <div>
              <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-400" /> Muhasebe Kaydı Ekle
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Resmi Muhasebe & Ön Muhasebe Fiş Düzenleme Masası
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Defter / Şirket:</span>
            <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">
                {(companies.find((c) => c.id === targetBook) || companies[0])?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Voucher Type Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => {
              setEntryMode("GELIR");
              applyPreset("GELIR");
            }}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
              entryMode === "GELIR"
                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-md"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
            }`}
          >
            <ArrowDownRight className="h-4 w-4" /> 🟢 Tahsilat Fişi (Gelir)
          </button>

          <button
            type="button"
            onClick={() => {
              setEntryMode("GIDER");
              applyPreset("GIDER");
            }}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
              entryMode === "GIDER"
                ? "bg-rose-500/10 border-rose-500/50 text-rose-400 shadow-md"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
            }`}
          >
            <ArrowUpRight className="h-4 w-4" /> 🔴 Tediye Fişi (Gider)
          </button>

          <button
            type="button"
            onClick={() => {
              setEntryMode("ADVANCED");
              applyPreset("ADVANCED");
            }}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
              entryMode === "ADVANCED"
                ? "bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-md"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Scale className="h-4 w-4" /> ⚙️ Mahsup Fişi (Yevmiye)
          </button>

          <button
            type="button"
            onClick={() => {
              setEntryMode("VIRMAN");
              applyPreset("VIRMAN");
            }}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
              entryMode === "VIRMAN"
                ? "bg-teal-500/10 border-teal-500/50 text-teal-400 shadow-md"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
            }`}
          >
            <RefreshCw className="h-4 w-4" /> 🔄 Virman Fişi (Transfer)
          </button>
        </div>
      </div>

      {/* Main Official Form Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Error Notification Alert */}
        {errorMsg && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* OFFICIAL UPPER FIELDS SECTION */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <label className="md:col-span-3 text-xs font-bold text-rose-400 flex items-center gap-1">
              Harcama Birimi <span className="text-rose-500">*</span>
            </label>
            <div className="md:col-span-9">
              <input
                type="text"
                required
                value={spendingUnit}
                onChange={(e) => setSpendingUnit(e.target.value)}
                className="w-full bg-slate-900 border border-rose-500/50 text-slate-100 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-rose-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <label className="md:col-span-3 text-xs font-bold text-slate-300">
              Ön Muhasebe Kaydı Tarihi
            </label>
            <div className="md:col-span-9">
              <input
                type="date"
                required
                value={voucherDate}
                onChange={(e) => setVoucherDate(e.target.value)}
                className="w-full sm:w-60 bg-slate-900 border border-slate-800 text-slate-100 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <label className="md:col-span-3 text-xs font-bold text-rose-400">
              Açıklama <span className="text-rose-500">*</span>
            </label>
            <div className="md:col-span-9">
              <input
                type="text"
                required
                placeholder="İşlem açıklamasını giriniz..."
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full bg-slate-900 border border-rose-500/50 text-slate-100 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-rose-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <label className="md:col-span-3 text-xs font-bold text-slate-300">
              Adına İşlem Yapılan Birim
            </label>
            <div className="md:col-span-9">
              <input
                type="text"
                value={targetUnit}
                onChange={(e) => setTargetUnit(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* DETAILS TABLE SECTION (`Muhasebe Kaydı Detayları`) */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-200 flex items-center gap-2">
              <Scale className="h-4 w-4 text-emerald-400" /> Muhasebe Kaydı Detayları
            </h3>

            {/* Official Action Buttons: [Ekle], [Kalanı Hesapla], [Sil] */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddLine}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-1.5 rounded-xl shadow transition flex items-center gap-1 active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" /> Ekle
              </button>

              <button
                type="button"
                onClick={handleCalculateRemaining}
                title="Borç ve Alacak arasındaki farkı otomatik tamamlar"
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow transition flex items-center gap-1 active:scale-95"
              >
                <Calculator className="h-3.5 w-3.5 text-amber-300" /> Kalanı Hesapla
              </button>

              <button
                type="button"
                onClick={handleDeleteSelected}
                className="bg-rose-700/80 hover:bg-rose-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow transition flex items-center gap-1 active:scale-95"
              >
                <Trash2 className="h-3.5 w-3.5" /> Sil
              </button>
            </div>
          </div>

          {/* TABLE STRUCTURE MATCHING SGB EXCEL FORM */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-300 text-xs font-bold border-b border-slate-800">
                  <th className="py-2.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleToggleSelectAll(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
                    />
                  </th>
                  <th className="py-2.5 px-3">Hesap Kodu</th>
                  <th className="py-2.5 px-3 w-40">Borç Tutarı (TL)</th>
                  <th className="py-2.5 px-3 w-40">Alacak Tutarı (TL)</th>
                  <th className="py-2.5 px-3 w-56">Kurumsal Kod</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/40 transition">
                    {/* Checkbox */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={!!line.selected}
                        onChange={(e) => handleLineChange(idx, "selected", e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
                      />
                    </td>

                    {/* Account Code Dropdown */}
                    <td className="py-2.5 px-3">
                      <select
                        value={line.account}
                        onChange={(e) => handleLineChange(idx, "account", e.target.value)}
                        className="w-full bg-slate-950 border border-rose-500/40 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-rose-500 font-medium"
                      >
                        {allAccountOptions.map((acc, aIdx) => (
                          <option key={aIdx} value={acc.value}>
                            {acc.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Borç Tutarı (TL) */}
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={line.debitAmount}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleLineChange(idx, "debitAmount", val);
                          if (Number(val) > 0) handleLineChange(idx, "creditAmount", 0);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-blue-500 font-mono font-bold text-right"
                      />
                    </td>

                    {/* Alacak Tutarı (TL) */}
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={line.creditAmount}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleLineChange(idx, "creditAmount", val);
                          if (Number(val) > 0) handleLineChange(idx, "debitAmount", 0);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 font-mono font-bold text-right"
                      />
                    </td>

                    {/* Kurumsal Kod */}
                    <td className="py-2.5 px-3">
                      <select
                        value={line.corporateCode}
                        onChange={(e) => handleLineChange(idx, "corporateCode", e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
                      >
                        {CORPORATE_CODES.map((corp, cIdx) => (
                          <option key={cIdx} value={corp.value}>
                            {corp.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* TABLE FOOTER SUMMARY MATCHING SCREENSHOT */}
              <tfoot>
                <tr className="bg-slate-950 text-xs font-bold border-t border-slate-700">
                  <td colSpan={2} className="py-3 px-4 text-slate-300">
                    Toplam Tutarlar :
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-blue-400 font-extrabold">
                    {totalDebits.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-400 font-extrabold">
                    {totalCredits.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {isBalanced ? (
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[11px] flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Dengede
                      </span>
                    ) : (
                      <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-[11px] flex items-center justify-center gap-1">
                        Fark: ₺{balanceDifference.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* BOTTOM OFFICIAL FORM BUTTONS (`Kaydet` & `Vazgeç`) */}
        <div className="flex items-center justify-start gap-3 pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={loading || !isBalanced}
            className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition flex items-center gap-1.5 active:scale-95"
          >
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{loading ? "Kaydediliyor..." : "Kaydet"}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition flex items-center gap-1.5 active:scale-95"
          >
            <X className="h-4 w-4" />
            <span>Vazgeç</span>
          </button>
        </div>
      </form>
    </div>
  );
}
