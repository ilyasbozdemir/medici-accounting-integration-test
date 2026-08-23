"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar, CompanyInfo } from "@/components/Navbar";
import { ChartOfAccounts } from "@/components/ChartOfAccounts";
import { TransactionDataTable } from "@/components/TransactionDataTable";
import { Building2, ArrowUpRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function TedarikcilerPage() {
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
          <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs font-bold flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Ana Sayfa
              </Link>
              <div>
                <h1 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-rose-400" /> Tedarikçiler & Borçlar Dashboard (320)
                </h1>
                <p className="text-xs text-slate-400 font-mono">PATH: /tedarikciler</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-rose-400" /> Kayıtlı Tedarikçi Sayısı
              </span>
              <div className="text-xl font-extrabold text-rose-400 font-mono">8 Tedarikçi</div>
              <div className="text-[11px] text-slate-500">Tedarikçiler & Satıcılar grubu altında kayıtlı</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <ArrowUpRight className="h-4 w-4 text-amber-400" /> Ödenecek Tedarikçi Borç Bakiyesi
              </span>
              <div className="text-xl font-extrabold text-slate-100 font-mono">₺42,000.00</div>
              <div className="text-[11px] text-slate-500">Tedarikçi A & Hizmet Sağlayıcılar</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Tamamlanan Tediye İşlemleri
              </span>
              <div className="text-xl font-extrabold text-emerald-400 font-mono">31 Ödeme Fişi</div>
              <div className="text-[11px] text-slate-500">Bu ay kapatılan tedarikçi borçları</div>
            </div>
          </div>

          <TransactionDataTable
            transactions={transactions}
            onOpenNewJournal={() => {}}
            title="Tedarikçi Fişleri & Borç Hareketleri Defteri"
            subtitle="320 Satıcılar hesabı ile ilişkili tüm ödeme ve borç kayıtları"
          />

          <ChartOfAccounts accounts={accounts} onAddAccount={() => {}} />
        </main>
      </div>
    </div>
  );
}
