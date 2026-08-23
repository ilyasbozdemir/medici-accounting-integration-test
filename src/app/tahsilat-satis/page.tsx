"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar, CompanyInfo } from "@/components/Navbar";
import { JournalVoucherFormView } from "@/components/JournalVoucherFormView";
import { ChartOfAccounts } from "@/components/ChartOfAccounts";
import { LedgerView } from "@/components/LedgerView";
import { AccountBalance } from "@/lib/medici-service";
import { ArrowDownRight, Plus, Users, Receipt, TrendingUp, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TahsilatSatisPage() {
  const [subTab, setSubTab] = useState<"overview" | "fis-kes" | "cariler" | "gecmis">("overview");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [companies] = useState<CompanyInfo[]>([
    { id: "AnaSirketDefteri", name: "Ana Şirket (Holding / Merkez)", code: "HQ" },
    { id: "SubesirketDefteri", name: "Şube A.Ş. (Operasyon & Satış)", code: "SUB" },
  ]);
  const [selectedBook, setSelectedBook] = useState<string>("AnaSirketDefteri");
  const [accounts, setAccounts] = useState<AccountBalance[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const loadData = async (book = selectedBook) => {
    setLoadingData(true);
    try {
      const query = `?book=${encodeURIComponent(book)}`;
      const [accRes, txRes] = await Promise.all([
        fetch(`/api/medici/accounts${query}`),
        fetch(`/api/medici/ledger${query}`),
      ]);
      const accData = await accRes.json();
      const txData = await txRes.json();
      if (accData?.success) setAccounts(accData.accounts);
      if (txData?.success) setTransactions(txData.transactions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData(selectedBook);
  }, [selectedBook]);

  const currentCompanyObj = companies.find((c) => c.id === selectedBook) || companies[0];

  return (
    <div className={`min-h-screen flex ${theme === "light" ? "light" : "dark"} bg-slate-950 text-slate-100 font-sans`}>
      <Sidebar
        activeTab="dashboard"
        setActiveTab={() => {}}
        onOpenNewJournal={() => setSubTab("fis-kes")}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        theme={theme}
        setTheme={setTheme}
        accountsCount={accounts.length}
        transactionsCount={transactions.length}
        companies={companies}
        selectedBook={selectedBook}
        onOpenAddCompanyModal={() => {}}
      />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? "lg:pl-20" : "lg:pl-72"}`}>
        <Navbar
          onOpenMobileSidebar={() => setIsOpenMobile(true)}
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
          isCollapsed={isCollapsed}
          onSeedDemoData={() => {}}
          isSeeding={false}
          companies={companies}
          selectedBook={selectedBook}
          onSelectCompany={setSelectedBook}
          onOpenAddCompanyModal={() => {}}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Sub Route Path Indicator Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs font-bold flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Ana Sayfa
              </Link>
              <div>
                <h1 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                  <ArrowDownRight className="h-5 w-5 text-emerald-400" /> Tahsilat & Satış Modülü
                </h1>
                <p className="text-xs text-slate-400 font-mono">PATH: /tahsilat-satis/{subTab}</p>
              </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setSubTab("overview")}
                className={`px-3 py-1.5 rounded-lg transition ${subTab === "overview" ? "bg-slate-800 text-emerald-400 border border-slate-700" : "text-slate-400 hover:text-slate-200"}`}
              >
                📊 Özeti
              </button>
              <button
                onClick={() => setSubTab("fis-kes")}
                className={`px-3 py-1.5 rounded-lg transition ${subTab === "fis-kes" ? "bg-slate-800 text-emerald-400 border border-slate-700" : "text-slate-400 hover:text-slate-200"}`}
              >
                + Tahsilat Fişi
              </button>
              <button
                onClick={() => setSubTab("cariler")}
                className={`px-3 py-1.5 rounded-lg transition ${subTab === "cariler" ? "bg-slate-800 text-emerald-400 border border-slate-700" : "text-slate-400 hover:text-slate-200"}`}
              >
                120 Cariler
              </button>
              <button
                onClick={() => setSubTab("gecmis")}
                className={`px-3 py-1.5 rounded-lg transition ${subTab === "gecmis" ? "bg-slate-800 text-emerald-400 border border-slate-700" : "text-slate-400 hover:text-slate-200"}`}
              >
                Geçmiş Kayıtlar
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {subTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-emerald-400" /> Toplam Tahsil Edilen Gelir
                  </span>
                  <div className="text-xl font-extrabold text-emerald-400 font-mono">₺245,800.00</div>
                  <div className="text-[11px] text-slate-500">Kasa & Garanti Bankası Tahsilatları</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-blue-400" /> Müşteri Cari Alacak Bakiyesi (120)
                  </span>
                  <div className="text-xl font-extrabold text-slate-100 font-mono">₺64,500.00</div>
                  <div className="text-[11px] text-slate-500">ACME Corp & Aktif Ticari Müşteriler</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Receipt className="h-4 w-4 text-amber-400" /> Düzenlenen Tahsilat Fişi Sayısı
                  </span>
                  <div className="text-xl font-extrabold text-amber-400 font-mono">48 Adet Fiş</div>
                  <div className="text-[11px] text-slate-500">Bu ay kesilen resmi gelir makbuzları</div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-200">Hızlı İşlemler</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSubTab("fis-kes")}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" /> Yeni Tahsilat Fişi Kes (Gelir Girişi)
                  </button>
                  <button
                    onClick={() => setSubTab("cariler")}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition"
                  >
                    Müşteri Cari Alacak Listesi (120)
                  </button>
                </div>
              </div>
            </div>
          )}

          {subTab === "fis-kes" && (
            <JournalVoucherFormView
              initialType="GELIR"
              selectedBook={selectedBook}
              companies={companies}
              onClose={() => setSubTab("overview")}
              onSuccess={() => {
                loadData(selectedBook);
                setSubTab("gecmis");
              }}
            />
          )}

          {subTab === "cariler" && <ChartOfAccounts accounts={accounts} onAddAccount={() => {}} />}

          {subTab === "gecmis" && <LedgerView transactions={transactions} />}
        </main>
      </div>
    </div>
  );
}
