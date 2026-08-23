"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar, CompanyInfo } from "@/components/Navbar";
import { DashboardOverview } from "@/components/DashboardOverview";
import { ChartOfAccounts } from "@/components/ChartOfAccounts";
import { LedgerView } from "@/components/LedgerView";
import { FinancialReportsView } from "@/components/FinancialReportsView";
import { MediciTestRunner } from "@/components/MediciTestRunner";
import { JournalVoucherFormView, JournalVoucherType } from "@/components/JournalVoucherFormView";
import { TransactionDataTable } from "@/components/TransactionDataTable";
import { AccountBalance } from "@/lib/medici-service";
import { Building2, X } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "accounts" | "ledger" | "reports" | "test" | "voucher"
  >("dashboard");

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [modalType, setModalType] = useState<JournalVoucherType>("GELIR");

  // Companies / Multi-Entity Management
  const [companies, setCompanies] = useState<CompanyInfo[]>([
    { id: "AnaSirketDefteri", name: "Ana Şirket (Holding / Merkez)", code: "HQ" },
    { id: "SubesirketDefteri", name: "Şube A.Ş. (Operasyon & Satış)", code: "SUB" },
  ]);
  const [selectedBook, setSelectedBook] = useState<string>("AnaSirketDefteri");
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyCode, setNewCompanyCode] = useState("");

  // Custom Accounts
  const [customAccounts, setCustomAccounts] = useState<Array<{ account: string; category: AccountBalance["category"] }>>([]);

  const [isSeeding, setIsSeeding] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [accounts, setAccounts] = useState<AccountBalance[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [reports, setReports] = useState<any>(null);

  const loadData = async (book = selectedBook) => {
    setLoadingData(true);
    try {
      const parseSafeJson = async (res: Response) => {
        const contentType = res.headers.get("content-type") || "";
        if (res.ok && contentType.includes("application/json")) {
          return await res.json();
        }
        return null;
      };

      const query = `?book=${encodeURIComponent(book)}`;
      const [accRes, txRes, repRes] = await Promise.all([
        fetch(`/api/medici/accounts${query}`),
        fetch(`/api/medici/ledger${query}`),
        fetch(`/api/medici/reports${query}`),
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
    loadData(selectedBook);
  }, [selectedBook]);

  const handleSelectCompany = (companyId: string) => {
    setSelectedBook(companyId);
  };

  const handleAddCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    const safeId = `${newCompanyName.trim().replace(/[^a-zA-Z0-9]/g, "")}_${Date.now().toString().slice(-4)}`;
    const newComp: CompanyInfo = {
      id: safeId,
      name: newCompanyName.trim(),
      code: (newCompanyCode.trim() || newCompanyName.trim().slice(0, 3)).toUpperCase(),
    };

    setCompanies([...companies, newComp]);
    setSelectedBook(safeId);
    setNewCompanyName("");
    setNewCompanyCode("");
    setIsAddCompanyModalOpen(false);
  };

  const handleAddAccount = (newAcc: { account: string; category: AccountBalance["category"] }) => {
    setCustomAccounts((prev) => [...prev, newAcc]);
    setAccounts((prev) => {
      if (prev.some((a) => a.account === newAcc.account)) return prev;
      return [...prev, { account: newAcc.account, category: newAcc.category, balance: 0 }].sort((a, b) =>
        a.account.localeCompare(b.account)
      );
    });
  };

  const handleOpenNewJournal = (type: JournalVoucherType = "GELIR") => {
    setModalType(type);
    setActiveTab("voucher");
  };

  const handleSeedDemoData = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch(`/api/medici/seed?book=${encodeURIComponent(selectedBook)}`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await loadData(selectedBook);
      }
    } catch (err) {
      console.error("Seed error:", err);
    } finally {
      setIsSeeding(false);
    }
  };

  const currentCompanyObj = companies.find((c) => c.id === selectedBook) || companies[0];

  return (
    <div
      className={`min-h-screen flex ${
        theme === "light" ? "light" : "dark"
      } bg-slate-950 text-slate-100 font-sans transition-colors duration-200`}
    >
      {/* Single Sidebar Panel */}
      <Sidebar
        activeTab={activeTab === "voucher" ? "dashboard" : activeTab}
        setActiveTab={setActiveTab}
        onOpenNewJournal={handleOpenNewJournal}
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
        onOpenAddCompanyModal={() => setIsAddCompanyModalOpen(true)}
      />

      {/* Main Layout Container */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? "lg:pl-20" : "lg:pl-72"}`}>
        <Navbar
          onOpenMobileSidebar={() => setIsOpenMobile(true)}
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
          isCollapsed={isCollapsed}
          onSeedDemoData={handleSeedDemoData}
          isSeeding={isSeeding}
          companies={companies}
          selectedBook={selectedBook}
          onSelectCompany={handleSelectCompany}
          onOpenAddCompanyModal={() => setIsAddCompanyModalOpen(true)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {loadingData ? (
            <div className="p-12 text-center text-slate-500 animate-pulse font-medium">
              [{currentCompanyObj.name}] Finansal veriler yükleniyor...
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <DashboardOverview
                    summary={reports?.summary || null}
                    onOpenNewJournal={handleOpenNewJournal}
                    onSeedDemoData={handleSeedDemoData}
                    currentCompany={currentCompanyObj}
                  />

                  {/* Main Screen Rich Data Table with Real-time Filtering & Search */}
                  <TransactionDataTable
                    transactions={transactions}
                    onOpenNewJournal={handleOpenNewJournal}
                    title="Kurumsal Yevmiye Fişleri & İşlem Defteri"
                    subtitle="Tüm kurum işlemleri, borç/alacak hesapları ve çift taraflı muhasebe fişleri"
                  />
                </div>
              )}

              {activeTab === "voucher" && (
                <JournalVoucherFormView
                  initialType={modalType}
                  selectedBook={selectedBook}
                  companies={companies}
                  customAccounts={customAccounts}
                  onClose={() => setActiveTab("dashboard")}
                  onSuccess={() => {
                    loadData(selectedBook);
                    setActiveTab("ledger");
                  }}
                />
              )}

              {activeTab === "accounts" && (
                <ChartOfAccounts accounts={accounts} onAddAccount={handleAddAccount} />
              )}

              {activeTab === "ledger" && <LedgerView transactions={transactions} />}

              {activeTab === "reports" && <FinancialReportsView reports={reports} />}

              {activeTab === "test" && <MediciTestRunner />}
            </>
          )}
        </main>
      </div>

      {/* Add New Company / Entity Modal */}
      {isAddCompanyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-400" /> Başka Kurum / Şirket Ekle
              </h3>
              <button
                onClick={() => setIsAddCompanyModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddCompanySubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Kurum / Şirket Unvanı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn. Teknoloji A.Ş. veya Galerim Plus Ltd."
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm px-3.5 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Şirket Kodu (Kısa Kod)</label>
                <input
                  type="text"
                  placeholder="Örn. TEK veya GAL"
                  value={newCompanyCode}
                  onChange={(e) => setNewCompanyCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm px-3.5 py-2 rounded-xl focus:outline-none focus:border-emerald-500 font-mono uppercase"
                />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400">
                Eklenen her kurum için bağımsız Medici defteri oluşturulur ve hesap planı ayrı takip edilir.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCompanyModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition shadow-md shadow-emerald-500/10"
                >
                  Kurumu Kaydet & Geç
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
