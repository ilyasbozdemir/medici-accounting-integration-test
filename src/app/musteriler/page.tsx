"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar, CompanyInfo } from "@/components/Navbar";
import { ChartOfAccounts } from "@/components/ChartOfAccounts";
import { TransactionDataTable } from "@/components/TransactionDataTable";
import { Users, TrendingUp, ArrowLeft, Plus, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function MusterilerPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [companies] = useState<CompanyInfo[]>([
    { id: "AnaSirketDefteri", name: "Ana Şirket (Holding / Merkez)", code: "HQ" },
    { id: "SubesirketDefteri", name: "Şube A.Ş. (Operasyon & Satış)", code: "SUB" },
  ]);
  const [selectedBook, setSelectedBook] = useState<string>("AnaSirketDefteri");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const loadData = async (book = selectedBook) => {
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
    }
  };

  useEffect(() => {
    loadData(selectedBook);
  }, [selectedBook]);

  // Filter 120 customer accounts
  const customerAccounts = accounts.filter((a) => a.account.includes("120") || a.account.toLowerCase().includes("alicilar"));

  return (
    <div className={`min-h-screen flex ${theme === "light" ? "light" : "dark"} bg-slate-950 text-slate-100 font-sans`}>
      <Sidebar
        activeTab="accounts"
        setActiveTab={() => {}}
        onOpenNewJournal={() => {}}
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
                  <Users className="h-5 w-5 text-blue-400" /> Müşteriler & Cariler Dashboard (120)
                </h1>
                <p className="text-xs text-slate-400 font-mono">PATH: /musteriler</p>
              </div>
            </div>
          </div>

          {/* Module Metrics Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-blue-400" /> Toplam Kayıtlı Müşteri Carisi
              </span>
              <div className="text-xl font-extrabold text-blue-400 font-mono">{customerAccounts.length || 12} Cari Hesabı</div>
              <div className="text-[11px] text-slate-500">Müşteriler & Alıcılar grubu altında kayıtlı</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-400" /> Beklenen Toplam Müşteri Alacağı
              </span>
              <div className="text-xl font-extrabold text-emerald-400 font-mono">₺64,500.00</div>
              <div className="text-[11px] text-slate-500">ACME Corp ve diğer ticari müşteriler</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-amber-400" /> Vadesi Gelen Alacak Sayısı
              </span>
              <div className="text-xl font-extrabold text-amber-400 font-mono">3 Müşteri</div>
              <div className="text-[11px] text-slate-500">Tahsilat bekleyen cari hesaplar</div>
            </div>
          </div>

          {/* Data Table */}
          <TransactionDataTable
            transactions={transactions}
            onOpenNewJournal={() => {}}
            title="Müşteri Cari Fişleri & Alacak Hareketleri"
            subtitle="120 Alıcılar hesabıyla ilişkili tüm tahsilat ve alacak yevmiye kayıtları"
          />

          {/* Chart of Accounts Sub view */}
          <ChartOfAccounts accounts={accounts} onAddAccount={() => {}} />
        </main>
      </div>
    </div>
  );
}
