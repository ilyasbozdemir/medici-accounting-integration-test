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
} from "lucide-react";
import { CompanyInfo } from "./Navbar";

export type JournalVoucherType = "GELIR" | "GIDER" | "ADVANCED" | "VIRMAN";

interface JournalVoucherFormViewProps {
  initialType?: JournalVoucherType;
  selectedBook?: string;
  companies?: CompanyInfo[];
  customAccounts?: Array<{ account: string; label?: string }>;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_ACCOUNTS = [
  {
    value: "Assets:100:Kasa",
    label: "100 Kasa Hesabı (Nakit)",
    type: "Asset",
    icon: Wallet,
  },
  {
    value: "Assets:102:Bank:Garanti",
    label: "102 Garanti Bankası TL Hesabı",
    type: "Asset",
    icon: Building,
  },
  {
    value: "Assets:102:Bank:Akbank",
    label: "102 Akbank TL Hesabı",
    type: "Asset",
    icon: Building,
  },
  {
    value: "Assets:102:Bank:Ziraat",
    label: "102 Ziraat Bankası TL Hesabı",
    type: "Asset",
    icon: Building,
  },
  {
    value: "Assets:120:Alicilar:ACME",
    label: "120 Alıcılar - ACME Corp (Ticari Alacak)",
    type: "Asset",
    icon: Receipt,
  },
  {
    value: "Assets:255:Equipment:Computers",
    label: "255 Demirbaşlar - Ofis Bilgisayarları",
    type: "Asset",
    icon: CreditCard,
  },
  {
    value: "Liabilities:320:Saticilar:VendorA",
    label: "320 Satıcılar - Tedarikçi A (Ticari Borç)",
    type: "Liability",
    icon: Receipt,
  },
  {
    value: "Liabilities:300:BankaKredisi",
    label: "300 Kısa Vadeli Banka Kredileri",
    type: "Liability",
    icon: Building,
  },
  {
    value: "Equity:500:Sermaye",
    label: "500 Ödenmiş Sermaye Hesabı",
    type: "Equity",
    icon: Scale,
  },
  {
    value: "Revenue:600:Services:Consulting",
    label: "600 Yurtiçi Satışlar - Danışmanlık Geliri",
    type: "Revenue",
    icon: ArrowDownRight,
  },
  {
    value: "Revenue:600:Software",
    label: "600 Yurtiçi Satışlar - Yazılım Lisansı",
    type: "Revenue",
    icon: ArrowDownRight,
  },
  {
    value: "Expenses:770:Rent",
    label: "770 Genel Yönetim - Ofis Kira Gideri",
    type: "Expense",
    icon: ArrowUpRight,
  },
  {
    value: "Expenses:770:Salaries",
    label: "770 Genel Yönetim - Personel Maaş Giderleri",
    type: "Expense",
    icon: ArrowUpRight,
  },
  {
    value: "Expenses:770:Hosting:AWS",
    label: "770 Genel Yönetim - AWS Sunucu Gideri",
    type: "Expense",
    icon: ArrowUpRight,
  },
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
  const [voucherNo, setVoucherNo] = useState(
    `FIS-${Date.now().toString().slice(-6)}`,
  );
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [targetBook, setTargetBook] = useState(selectedBook);
  const [lines, setLines] = useState<JournalLineItem[]>([
    { account: "Assets:102:Bank:Garanti", type: "debit", amount: 15000 },
    {
      account: "Revenue:600:Services:Consulting",
      type: "credit",
      amount: 15000,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setEntryMode(initialType);
    applyPreset(initialType);
    setVoucherNo(`FIS-${Date.now().toString().slice(-6)}`);
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

  const totalDebits = lines.filter((l) => l.type === "debit").reduce(
    (sum, l) => sum + (Number(l.amount) || 0),
    0,
  );
  const totalCredits = lines.filter((l) => l.type === "credit").reduce(
    (sum, l) => sum + (Number(l.amount) || 0),
    0,
  );
  const isBalanced = totalDebits > 0 &&
    Math.abs(totalDebits - totalCredits) < 0.01;

  const applyPreset = (mode: JournalVoucherType) => {
    setErrorMsg(null);
    setVoucherNo(`FIS-${Date.now().toString().slice(-6)}`);

    if (mode === "GELIR") {
      setMemo("Müşteri Hizmet Bedeli Tahsilatı");
      setLines([
        { account: "Assets:102:Bank:Garanti", type: "debit", amount: 25000 },
        {
          account: "Revenue:600:Services:Consulting",
          type: "credit",
          amount: 25000,
        },
      ]);
    } else if (mode === "GIDER") {
      setMemo("Ofis Kira ve Genel Operasyon Gideri Ödemesi");
      setLines([
        { account: "Expenses:770:Rent", type: "debit", amount: 12500 },
        { account: "Assets:102:Bank:Garanti", type: "credit", amount: 12500 },
      ]);
    } else if (mode === "VIRMAN") {
      setMemo("Garanti Bankası Hesabından Akbank Hesabına Virman / Transfer");
      setLines([
        { account: "Assets:102:Bank:Akbank", type: "debit", amount: 50000 },
        { account: "Assets:102:Bank:Garanti", type: "credit", amount: 50000 },
      ]);
    } else {
      setMemo("Dönem Sonu Tahakkuk & Yevmiye Mahsup Fişi");
      setLines([
        { account: "Expenses:770:Salaries", type: "debit", amount: 35000 },
        { account: "Assets:100:Kasa", type: "credit", amount: 35000 },
      ]);
    }
  };

  const handleLineChange = (
    index: number,
    field: keyof JournalLineItem,
    value: any,
  ) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const handleAddLine = () => {
    setLines([...lines, {
      account: "Assets:100:Kasa",
      type: "debit",
      amount: 0,
    }]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 2) {
      setErrorMsg(
        "Bir muhasebe fişinde en az 2 satır (Çift taraflı kayıt) bulunmalıdır.",
      );
      return;
    }
    setLines(lines.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) {
      setErrorMsg(
        `Borç (₺${totalDebits.toLocaleString("tr-TR")}) ve Alacak (₺${
          totalCredits.toLocaleString("tr-TR")
        }) tutarları eşit olmalıdır!`,
      );
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/medici/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book: targetBook,
          memo: `[${voucherNo}] ${memo}`,
          date,
          lines: lines.map((l) => ({
            account: l.account,
            type: l.type,
            amount: Number(l.amount),
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Yevmiye kaydı oluşturulamadı.");
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="h-4 w-4" /> Geri Dön
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-400" />{" "}
                Muhasebe İşlem & Fiş Kesme Masası
              </h2>
              <p className="text-xs text-slate-400">
                Gelir, Gider, Transfer ve Yevmiye Fişi Düzenleme Masası
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">
              Aktif Kurum:
            </span>
            <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">
                {(companies.find((c) => c.id === targetBook) || companies[0])
                  ?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Voucher Type Tabs (Tahsilat, Tediye, Mahsup, Virman) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setEntryMode("GELIR");
              applyPreset("GELIR");
            }}
            className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
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
            className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
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
            className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
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
            className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
              entryMode === "VIRMAN"
                ? "bg-teal-500/10 border-teal-500/50 text-teal-400 shadow-md"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800"
            }`}
          >
            <RefreshCw className="h-4 w-4" /> 🔄 Virman Fişi (Transfer)
          </button>
        </div>
      </div>

      {/* Main Voucher Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6"
      >
        {/* Error Notification Alert */}
        {errorMsg && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Voucher General Metadata (Fiş No, Tarih, Açıklama) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              Fiş Numarası
            </label>
            <input
              type="text"
              required
              value={voucherNo}
              onChange={(e) => setVoucherNo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              İşlem Tarihi
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              Fiş Açıklaması / Referans
            </label>
            <input
              type="text"
              required
              placeholder="Örn. Garanti Bankasından Tahsilat Kaydı"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Debit / Credit Double-Entry Balance Progress Bar */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-4">
              <span className="text-blue-400">
                Borç (Debit): ₺{totalDebits.toLocaleString("tr-TR")}
              </span>
              <span className="text-emerald-400">
                Alacak (Credit): ₺{totalCredits.toLocaleString("tr-TR")}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {isBalanced
                ? (
                  <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Fiş Dengede (%100)
                  </span>
                )
                : (
                  <span className="text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />{" "}
                    Fark var: ₺{Math.abs(totalDebits - totalCredits)
                      .toLocaleString("tr-TR")}
                  </span>
                )}
            </div>
          </div>

          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-300 ${
                isBalanced ? "bg-emerald-500" : "bg-amber-500"
              }`}
              style={{
                width: `${
                  Math.min(
                    100,
                    totalDebits > 0 ? (totalCredits / totalDebits) * 100 : 0,
                  )
                }%`,
              }}
            />
          </div>
        </div>

        {/* Accounting Lines Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-300">
              Yevmiye Fişi Satırları (Çift Taraflı Kayıt)
            </h3>
            <button
              type="button"
              onClick={handleAddLine}
              className="text-xs bg-slate-950 hover:bg-slate-800 text-emerald-400 font-semibold px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1 transition"
            >
              <Plus className="h-3.5 w-3.5" /> + Satır Ekle
            </button>
          </div>

          <div className="space-y-2.5">
            {lines.map((line, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 bg-slate-950/60 border border-slate-800 rounded-xl items-center"
              >
                {/* Account Selection Dropdown */}
                <div className="sm:col-span-6">
                  <select
                    value={line.account}
                    onChange={(e) =>
                      handleLineChange(idx, "account", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
                  >
                    {allAccountOptions.map((acc, aIdx) => (
                      <option key={aIdx} value={acc.value}>
                        {acc.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Entry Type (Debit / Credit) */}
                <div className="sm:col-span-3">
                  <select
                    value={line.type}
                    onChange={(e) =>
                      handleLineChange(
                        idx,
                        "type",
                        e.target.value as "debit" | "credit",
                      )}
                    className={`w-full text-xs font-bold px-3 py-2 rounded-xl border focus:outline-none ${
                      line.type === "debit"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    <option
                      value="debit"
                      className="bg-slate-900 text-blue-400"
                    >
                      BORÇ (Debit)
                    </option>
                    <option
                      value="credit"
                      className="bg-slate-900 text-emerald-400"
                    >
                      ALACAK (Credit)
                    </option>
                  </select>
                </div>

                {/* Amount Input */}
                <div className="sm:col-span-2">
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs text-slate-500">
                      ₺
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={line.amount}
                      onChange={(e) =>
                        handleLineChange(
                          idx,
                          "amount",
                          parseFloat(e.target.value) || 0,
                        )}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs pl-6 pr-2.5 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Delete Line Action */}
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveLine(idx)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs text-slate-400 hover:text-slate-200 font-semibold transition"
          >
            İptal & Geri Dön
          </button>

          <button
            type="submit"
            disabled={loading || !isBalanced}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95"
          >
            {loading ? <span>Yevmiye Kaydı İşleniyor...</span> : (
              <>
                <Check className="h-4 w-4" />
                <span>Yevmiye Fişini Kaydet & Deftere İşle</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
