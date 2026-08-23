"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Building,
  Building2,
  Check,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  Layers,
  LayoutDashboard,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Receipt,
  RefreshCw,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Terminal,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { CompanyInfo } from "./Navbar";

export type ModuleCategory =
  | "tahsilat"
  | "tediye"
  | "musteriler"
  | "tedarikciler"
  | "banka"
  | "muhasebe"
  | "raporlar"
  | "test";

interface SidebarProps {
  activeTab: "dashboard" | "accounts" | "ledger" | "reports" | "test";
  setActiveTab: (
    tab: "dashboard" | "accounts" | "ledger" | "reports" | "test",
  ) => void;
  onOpenNewJournal: (
    initialType?: "GELIR" | "GIDER" | "ADVANCED" | "VIRMAN",
  ) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  accountsCount: number;
  transactionsCount: number;
  companies: CompanyInfo[];
  selectedBook: string;
  onOpenAddCompanyModal: () => void;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  onOpenNewJournal,
  isOpenMobile,
  setIsOpenMobile,
  isCollapsed,
  setIsCollapsed,
  theme,
  setTheme,
  accountsCount,
  transactionsCount,
  companies,
  selectedBook,
  onOpenAddCompanyModal,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const currentCompany = companies.find((c) => c.id === selectedBook) || companies[0];

  // Active operational module state (Default: Tahsilat & Satış)
  const [activeModule, setActiveModule] = useState<ModuleCategory>("tahsilat");
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);

  useEffect(() => {
    if (pathname.includes("tahsilat-satis")) setActiveModule("tahsilat");
    else if (pathname.includes("odeme-tediye")) setActiveModule("tediye");
    else if (pathname.includes("musteriler")) setActiveModule("musteriler");
    else if (pathname.includes("tedarikciler")) setActiveModule("tedarikciler");
    else if (pathname.includes("banka-kasa")) setActiveModule("banka");
    else if (pathname.includes("muhasebe-tahakkuk")) setActiveModule("muhasebe");
    else if (pathname.includes("finansal-raporlar")) setActiveModule("raporlar");
    else setActiveModule("tahsilat");
  }, [pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  const handleSelectModule = (mod: ModuleCategory) => {
    setActiveModule(mod);
    setIsModuleDropdownOpen(false);

    if (mod === "tahsilat") {
      router.push("/tahsilat-satis");
    } else if (mod === "tediye") {
      router.push("/odeme-tediye");
    } else if (mod === "musteriler") {
      router.push("/musteriler");
    } else if (mod === "tedarikciler") {
      router.push("/tedarikciler");
    } else if (mod === "banka") {
      router.push("/banka-kasa");
    } else if (mod === "muhasebe") {
      router.push("/muhasebe-tahakkuk");
    } else if (mod === "raporlar") {
      router.push("/finansal-raporlar");
    } else if (mod === "test") {
      setActiveTab("test");
      router.push("/");
    }
  };

  // Main operational categories list (No general dashboard here)
  const mainCategories = [
    { id: "tahsilat", title: "Gelir & Tahsilat İşlemleri", icon: ArrowDownRight },
    { id: "tediye", title: "Gider & Ödeme İşlemleri", icon: ArrowUpRight },
    { id: "musteriler", title: "Müşteriler & Cariler (120)", icon: Users },
    { id: "tedarikciler", title: "Tedarikçiler & Borçlar (320)", icon: Building2 },
    { id: "banka", title: "Banka & Kasa Varlıkları", icon: Wallet },
    { id: "muhasebe", title: "Muhasebe & Yevmiye Fişleri", icon: Scale },
    { id: "raporlar", title: "Finansal Raporlar & Cetveller", icon: FileSpreadsheet },
    { id: "test", title: "Sistem & Test Motoru", icon: Terminal },
  ] as const;

  const currentModuleObj = mainCategories.find((m) => m.id === activeModule) || mainCategories[0];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SINGLE CLEAN SIDEBAR */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-3.5 transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile
            ? "translate-x-0 w-72"
            : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-72"}`}
      >
        {/* Top Scrollable Content */}
        <div className="space-y-4 overflow-y-auto no-scrollbar pr-0.5 relative">
          {/* Header: Logo & Sidebar Collapse Button */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-100 font-bold shadow-sm">
                <Building className="h-5 w-5 text-emerald-400" />
              </div>

              {!isCollapsed && (
                <div className="truncate">
                  <h1 className="font-extrabold text-sm text-slate-100 tracking-tight">
                    Medici Finans
                  </h1>
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" /> Kurumsal Muhasebe
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Menüyü Aç" : "Menüyü Kapat"}
              className="hidden lg:flex p-1.5 text-slate-400 hover:text-slate-100 rounded-xl bg-slate-900 border border-slate-800 transition"
            >
              {isCollapsed
                ? <PanelLeftOpen className="h-4 w-4 text-emerald-400" />
                : <PanelLeftClose className="h-4 w-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsOpenMobile(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-900 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ACTIVE COMPANY CARD */}
          {!isCollapsed && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-slate-400" /> Kurum Defteri
                </span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 font-bold">
                  {currentCompany.code}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-200 truncate">
                {currentCompany.name}
              </div>
              <button
                onClick={onOpenAddCompanyModal}
                className="w-full text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold py-1 px-2 rounded-lg border border-slate-800 flex items-center justify-center gap-1 transition"
              >
                <Plus className="h-3 w-3" /> Kurum Ekle
              </button>
            </div>
          )}

          {/* MAIN MODULE SELECTOR DROPDOWN */}
          {!isCollapsed ? (
            <div className="relative">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1 mb-1 flex items-center justify-between">
                <span>Ana Modül Seçimi</span>
                <span className="text-slate-500 font-mono text-[9px]">Tıkla & Değiştir</span>
              </div>

              <button
                type="button"
                onClick={() => setIsModuleDropdownOpen(!isModuleDropdownOpen)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between shadow-sm transition active:scale-98"
              >
                <div className="flex items-center gap-2 truncate">
                  <currentModuleObj.icon className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-extrabold truncate">{currentModuleObj.title}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${isModuleDropdownOpen ? "rotate-180 text-emerald-400" : ""}`} />
              </button>

              {/* DROPDOWN POPOVER FOR MAIN CATEGORIES */}
              {isModuleDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-2xl p-1.5 shadow-2xl z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {mainCategories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = activeModule === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectModule(cat.id as ModuleCategory)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                          isSelected
                            ? "bg-slate-800 text-emerald-400 font-bold border border-slate-700"
                            : "text-slate-300 hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`h-4 w-4 ${isSelected ? "text-emerald-400" : "text-slate-400"}`} />
                          <span>{cat.title}</span>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setIsCollapsed(false);
                setIsModuleDropdownOpen(true);
              }}
              title="Ana Menü Seç"
              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center hover:border-emerald-500/50 transition"
            >
              <SlidersHorizontal className="h-5 w-5 mx-auto text-emerald-400" />
            </button>
          )}

          {/* SUB-MENU ITEMS LIST FOR THE SELECTED MODULE */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            {!isCollapsed && (
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1">
                {currentModuleObj.title} - İşlemler
              </div>
            )}

            {/* 1. TAHSİLAT & SATIŞ SUB-ITEMS */}
            {activeModule === "tahsilat" && (
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    router.push("/tahsilat-satis");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 transition flex items-center gap-2"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  {!isCollapsed && "Tahsilat & Gelir Dashboard"}
                </button>

                <button
                  onClick={() => {
                    router.push("/tahsilat-satis");
                    onOpenNewJournal("GELIR");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-100 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition flex items-center justify-between shadow-sm active:scale-98"
                >
                  <span className="flex items-center gap-1.5">
                    <Plus className="h-3.5 w-3.5 text-emerald-400 font-bold" />
                    {!isCollapsed && "Tahsilat Fişi Oluştur"}
                  </span>
                  {!isCollapsed && (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                      GELİR
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    router.push("/musteriler");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900 transition"
                >
                  {!isCollapsed ? "• 120 Alıcılar / Müşteri Carileri" : "120"}
                </button>
              </div>
            )}

            {/* 2. TEDİYE SUB-ITEMS */}
            {activeModule === "tediye" && (
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    router.push("/odeme-tediye");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 transition flex items-center gap-2"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  {!isCollapsed && "Gider & Ödeme Dashboard"}
                </button>

                <button
                  onClick={() => {
                    router.push("/odeme-tediye");
                    onOpenNewJournal("GIDER");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-100 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition flex items-center justify-between shadow-sm active:scale-98"
                >
                  <span className="flex items-center gap-1.5">
                    <Plus className="h-3.5 w-3.5 text-rose-400 font-bold" />
                    {!isCollapsed && "Tediye Fişi Oluştur"}
                  </span>
                  {!isCollapsed && (
                    <span className="text-[10px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-mono font-bold">
                      GİDER
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    router.push("/tedarikciler");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900 transition"
                >
                  {!isCollapsed ? "• 320 Satıcılar / Tedarikçi Borçları" : "320"}
                </button>
              </div>
            )}

            {/* 3. MÜŞTERİLER SUB-ITEMS */}
            {activeModule === "musteriler" && (
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    router.push("/musteriler");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 transition flex items-center gap-2"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  {!isCollapsed && "Müşteri Carileri Dashboard"}
                </button>

                <button
                  onClick={() => {
                    router.push("/tahsilat-satis");
                    onOpenNewJournal("GELIR");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900 transition"
                >
                  {!isCollapsed ? "• Müşteri Tahsilat Fişi Kes" : "Tahsilat"}
                </button>
              </div>
            )}

            {/* 4. TEDARİKÇİLER SUB-ITEMS */}
            {activeModule === "tedarikciler" && (
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    router.push("/tedarikciler");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 transition flex items-center gap-2"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  {!isCollapsed && "Tedarikçi Borçları Dashboard"}
                </button>

                <button
                  onClick={() => {
                    router.push("/odeme-tediye");
                    onOpenNewJournal("GIDER");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900 transition"
                >
                  {!isCollapsed ? "• Tedarikçi Ödeme Fişi Kes" : "Ödeme"}
                </button>
              </div>
            )}

            {/* 5. BANKA SUB-ITEMS */}
            {activeModule === "banka" && (
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    router.push("/banka-kasa");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 transition flex items-center gap-2"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  {!isCollapsed && "Banka & Kasa Likidite Dashboard"}
                </button>

                <button
                  onClick={() => {
                    router.push("/muhasebe-tahakkuk");
                    onOpenNewJournal("VIRMAN");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900 transition"
                >
                  {!isCollapsed ? "• Banka Virman Fişi Kes (Transfer)" : "Virman"}
                </button>
              </div>
            )}

            {/* 6. MUHASEBE SUB-ITEMS */}
            {activeModule === "muhasebe" && (
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    router.push("/muhasebe-tahakkuk");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 transition flex items-center gap-2"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  {!isCollapsed && "Muhasebe & Yevmiye Dashboard"}
                </button>

                <button
                  onClick={() => {
                    router.push("/muhasebe-tahakkuk");
                    onOpenNewJournal("ADVANCED");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-100 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition flex items-center justify-between"
                >
                  <span>{!isCollapsed ? "⚙️ Mahsup Fişi Oluştur" : "Mahsup"}</span>
                  {!isCollapsed && (
                    <span className="text-[10px] text-blue-400 font-mono font-bold">
                      YEVMİYE
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    router.push("/muhasebe-tahakkuk");
                    onOpenNewJournal("VIRMAN");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-100 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition flex items-center justify-between"
                >
                  <span>{!isCollapsed ? "🔄 Virman Fişi Oluştur" : "Virman"}</span>
                  {!isCollapsed && (
                    <span className="text-[10px] text-teal-400 font-mono font-bold">
                      TRANSFER
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* 7. RAPORLAR SUB-ITEMS */}
            {activeModule === "raporlar" && (
              <div className="space-y-1 text-xs font-semibold text-slate-300">
                <button
                  onClick={() => {
                    router.push("/finansal-raporlar");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 transition flex items-center gap-2"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  {!isCollapsed && "Finansal Raporlar Dashboard"}
                </button>

                <button
                  onClick={() => {
                    router.push("/finansal-raporlar");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-900 transition"
                >
                  {!isCollapsed ? "• Bilanço Tablosu (Balance Sheet)" : "Bilanço"}
                </button>

                <button
                  onClick={() => {
                    router.push("/finansal-raporlar");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-900 transition"
                >
                  {!isCollapsed ? "• Gelir Tablosu (Income Statement)" : "Gelir"}
                </button>

                <button
                  onClick={() => {
                    router.push("/finansal-raporlar");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-900 transition"
                >
                  {!isCollapsed ? "• Mizan Cetveli (Trial Balance)" : "Mizan"}
                </button>
              </div>
            )}

            {/* 8. TEST SUB-ITEMS */}
            {activeModule === "test" && (
              <div className="space-y-1">
                <button
                  onClick={() => {
                    router.push("/");
                    setActiveTab("test");
                    setIsOpenMobile(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 transition flex items-center gap-2"
                >
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  {!isCollapsed ? "⚡ Medici Motor Test Dashboard" : "Test"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Theme Switcher */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-1 text-xs font-medium text-slate-400">
              <span>Arayüz Teması</span>
              <span className="font-bold text-slate-200">
                {theme === "dark" ? "Koyu Mod" : "Açık Mod"}
              </span>
            </div>
          )}

          <button
            onClick={toggleTheme}
            title="Temayı Değiştir"
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center" : "justify-center gap-2"
            } bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold py-2 rounded-xl transition`}
          >
            {theme === "dark"
              ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  {!isCollapsed && <span>Aydınlık Moda Geç</span>}
                </>
              )
              : (
                <>
                  <Moon className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  {!isCollapsed && <span>Karanlık Moda Geç</span>}
                </>
              )}
          </button>
        </div>
      </aside>
    </>
  );
}
