"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar, CompanyInfo } from "@/components/Navbar";
import { FinancialReportsView } from "@/components/FinancialReportsView";
import { FileSpreadsheet, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FinansalRaporlarPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [companies] = useState<CompanyInfo[]>([
    { id: "AnaSirketDefteri", name: "Ana Şirket (Holding / Merkez)", code: "HQ" },
    { id: "SubesirketDefteri", name: "Şube A.Ş. (Operasyon & Satış)", code: "SUB" },
  ]);
  const [selectedBook, setSelectedBook] = useState<string>("AnaSirketDefteri");
  const [reports, setReports] = useState<any>(null);

  const loadData = async (book = selectedBook) => {
    try {
      const query = `?book=${encodeURIComponent(book)}`;
      const repRes = await fetch(`/api/medici/reports${query}`);
      const repData = await repRes.json();
      if (repData?.success) setReports(repData.reports);
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
        activeTab="reports"
        setActiveTab={() => {}}
        onOpenNewJournal={() => {}}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        theme={theme}
        setTheme={setTheme}
        accountsCount={0}
        transactionsCount={0}
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
                  <FileSpreadsheet className="h-5 w-5 text-emerald-400" /> Finansal Raporlar & Cetveller
                </h1>
                <p className="text-xs text-slate-400 font-mono">PATH: /finansal-raporlar</p>
              </div>
            </div>
          </div>

          <FinancialReportsView reports={reports} />
        </main>
      </div>
    </div>
  );
}
