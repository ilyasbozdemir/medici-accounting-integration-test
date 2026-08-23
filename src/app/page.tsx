"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { DashboardOverview } from "@/components/DashboardOverview";
import { ChartOfAccounts } from "@/components/ChartOfAccounts";
import { LedgerView } from "@/components/LedgerView";
import { FinancialReportsView } from "@/components/FinancialReportsView";
import { MediciTestRunner } from "@/components/MediciTestRunner";
import { JournalWizardModal } from "@/components/JournalWizardModal";
import { AccountBalance } from "@/lib/medici-service";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "accounts" | "ledger" | "reports" | "test"
  >("dashboard");

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"GELIR" | "GIDER" | "ADVANCED">("GELIR");

  const [isSeeding, setIsSeeding] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [accounts, setAccounts] = useState<AccountBalance[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [reports, setReports] = useState<any>(null);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const parseSafeJson = async (res: Response) => {
        const contentType = res.headers.get("content-type") || "";
        if (res.ok && contentType.includes("application/json")) {
          return await res.json();
        }
        return null;
      };

      const [accRes, txRes, repRes] = await Promise.all([
        fetch("/api/medici/accounts"),
        fetch("/api/medici/ledger"),
        fetch("/api/medici/reports"),
      ]);

      const accData = await parseSafeJson(accRes);
      const txData = await parseSafeJson(txRes);
      const repData = await parseSafeJson(repRes);

      if (accData?.success) setAccounts(accData.accounts);
      if (txData?.success) setTransactions(txData.transactions);
      if (repData?.success) setReports(repData.reports);
    } catch (err) {
      console.error("Data loading error:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNewJournal = (type: "GELIR" | "GIDER" | "ADVANCED" = "GELIR") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSeedDemoData = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch("/api/medici/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await loadData();
      }
    } catch (err) {
      console.error("Seed error:", err);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className={`min-h-screen flex ${theme === "light" ? "light" : "dark"} bg-slate-950 text-slate-100 font-sans transition-colors duration-200`}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewJournal={handleOpenNewJournal}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        theme={theme}
        setTheme={setTheme}
        accountsCount={accounts.length}
        transactionsCount={transactions.length}
      />

      {/* Main Layout (Margin-left on desktop for Sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <Navbar
          onOpenMobileSidebar={() => setIsOpenMobile(true)}
          onSeedDemoData={handleSeedDemoData}
          isSeeding={isSeeding}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {loadingData ? (
            <div className="p-12 text-center text-slate-500 animate-pulse font-medium">
              Finansal veriler yükleniyor...
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <DashboardOverview
                  summary={reports?.summary || null}
                  onOpenNewJournal={handleOpenNewJournal}
                  onSeedDemoData={handleSeedDemoData}
                />
              )}

              {activeTab === "accounts" && <ChartOfAccounts accounts={accounts} />}

              {activeTab === "ledger" && <LedgerView transactions={transactions} />}

              {activeTab === "reports" && <FinancialReportsView reports={reports} />}

              {activeTab === "test" && <MediciTestRunner />}
            </>
          )}
        </main>
      </div>

      <JournalWizardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
        initialType={modalType}
      />
    </div>
  );
}
