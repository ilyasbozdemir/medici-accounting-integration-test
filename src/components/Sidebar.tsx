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
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Layers,
  LayoutDashboard,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Receipt,
  RefreshCw,
  Scale,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Terminal,
  Users,
  Wallet,
  X,
  PlayCircle,
  Briefcase,
  CreditCard,
  Calendar,
  AlertTriangle,
  Info,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Package,
  FileCheck,
  ShoppingCart,
  Tag,
  Flag,
  CalendarDays,
  Bell,
  StickyNote,
  User,
  Settings,
  Database,
  Sliders,
} from "lucide-react";
import { CompanyInfo } from "./Navbar";

export type ModuleCategory =
  | "muhasebe"
  | "tahsilat"
  | "odeme"
  | "alacak"
  | "varlik"
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

  // Mode 1: "sub_menu" (renders module inner links with section headers)
  // Mode 2: "main_modules" (renders dark blue main categories matching Screenshot 1)
  const [viewMode, setViewMode] = useState<"sub_menu" | "main_modules">("sub_menu");
  const [activeModule, setActiveModule] = useState<ModuleCategory>("muhasebe");
  const [menuSearchTerm, setMenuSearchTerm] = useState("");

  useEffect(() => {
    if (pathname.includes("tahsilat-satis")) setActiveModule("tahsilat");
    else if (pathname.includes("odeme-tediye")) setActiveModule("odeme");
    else if (pathname.includes("musteriler")) setActiveModule("alacak");
    else if (pathname.includes("tedarikciler")) setActiveModule("odeme");
    else if (pathname.includes("banka-kasa")) setActiveModule("varlik");
    else if (pathname.includes("muhasebe-tahakkuk")) setActiveModule("muhasebe");
    else if (pathname.includes("finansal-raporlar")) setActiveModule("raporlar");
    else setActiveModule("muhasebe");
  }, [pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  const handleSelectMainModule = (mod: ModuleCategory) => {
    setActiveModule(mod);
    setViewMode("sub_menu"); // Switch back to inner menu list for selected module!

    if (mod === "alacak") router.push("/musteriler");
    else if (mod === "odeme") router.push("/odeme-tediye");
    else if (mod === "tahsilat") router.push("/tahsilat-satis");
    else if (mod === "varlik") router.push("/banka-kasa");
    else if (mod === "muhasebe") router.push("/muhasebe-tahakkuk");
    else if (mod === "raporlar") router.push("/finansal-raporlar");
    else if (mod === "test") {
      setActiveTab("test");
      router.push("/");
    }
  };

  // Main Categories matching Image 1
  const mainCategoriesList = [
    { id: "alacak", title: "Alacak İşlemleri (120)", icon: Briefcase },
    { id: "tahsilat", title: "Tahsilat İşlemleri", icon: Wallet },
    { id: "odeme", title: "Ödeme İşlemleri", icon: CreditCard },
    { id: "varlik", title: "Varlık İşlemleri (100/102)", icon: Building },
    { id: "muhasebe", title: "Muhasebe İşlemleri", icon: Calendar },
    { id: "raporlar", title: "Finansal Raporlar & Cetveller", icon: FileText },
    { id: "test", title: "Sistem & Test Motoru", icon: Terminal },
  ] as const;

  const currentModuleObj = mainCategoriesList.find((m) => m.id === activeModule) || mainCategoriesList[0];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SINGLE DUAL-MODE SIDEBAR */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-3.5 transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile
            ? "translate-x-0 w-72"
            : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-72"}`}
      >
        {/* Top Scrollable Content */}
        <div className="space-y-3 overflow-y-auto no-scrollbar pr-0.5 relative">
          {/* Header: Logo & View Switcher */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <button
                onClick={() => setViewMode(viewMode === "main_modules" ? "sub_menu" : "main_modules")}
                title="Ana Menüler & İç Menüler Arasında Geçiş Yap"
                className="h-9 w-9 shrink-0 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-100 font-bold shadow-sm transition"
              >
                <Building className="h-5 w-5 text-emerald-400" />
              </button>

              {!isCollapsed && (
                <div className="truncate">
                  <h1 className="font-extrabold text-sm text-slate-100 tracking-tight">
                    Muhasebe Sistemi
                  </h1>
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" /> Kurumsal Finans
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

          {/* MODE SWITCH BUTTON: Switch between Main Module List (Screenshot 1) & Inner Menu (Screenshot 2) */}
          {!isCollapsed && (
            <button
              onClick={() => setViewMode(viewMode === "main_modules" ? "sub_menu" : "main_modules")}
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold py-2 px-3 rounded-xl transition flex items-center justify-between shadow-sm active:scale-98"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-emerald-400" />
                {viewMode === "main_modules" ? "← Seçili Modül İç Menüsüne Dön" : "Ana Menüler Listesine Geç"}
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          )}

          {/* ========================================================= */}
          {/* PANEL 1: MAIN MODULES LIST (SCREENSHOT 1 DARK BLUE STYLE) */}
          {/* ========================================================= */}
          {viewMode === "main_modules" && !isCollapsed ? (
            <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1 mb-1">
                Ana Modüller Listesi
              </div>

              {mainCategoriesList.map((cat) => {
                const Icon = cat.icon;
                const isSelected = activeModule === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectMainModule(cat.id as ModuleCategory)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      isSelected
                        ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow"
                        : "text-slate-300 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isSelected ? "text-emerald-400" : "text-slate-400"}`} />
                      <span>{cat.title}</span>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-emerald-400 font-bold" />}
                  </button>
                );
              })}
            </div>
          ) : (
            /* ========================================================================= */
            /* PANEL 2: INNER SUB-MENU WITH HTML HEADERS (SCREENSHOT 2 & USER HTML CODE) */
            /* ========================================================================= */
            <div className="space-y-2 pt-1 animate-in fade-in duration-150">
              {!isCollapsed && (
                <div className="space-y-2">
                  {/* Selected module title + Search box */}
                  <div className="flex items-center justify-between text-xs font-extrabold text-blue-400 px-1 border-b border-slate-800 pb-1.5">
                    <span className="truncate">{currentModuleObj.title}</span>
                    <Search className="h-3.5 w-3.5 text-slate-400" />
                  </div>

                  {/* Sub-menu search input */}
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="İç menülerde ara..."
                      value={menuSearchTerm}
                      onChange={(e) => setMenuSearchTerm(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-[11px] pl-8 pr-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* INNER MENU ITEMS WITH SECTION HEADERS MATCHING USER HTML */}
              <div className="space-y-3 pt-1 text-xs">
                {/* 1. SECTION: Analizler ve Dashboard */}
                <div className="space-y-1">
                  {!isCollapsed && (
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-1 pt-1">
                      Analizler ve Dashboard
                    </div>
                  )}

                  <button
                    onClick={() => {
                      router.push("/");
                      setIsOpenMobile(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl font-bold text-slate-200 hover:bg-slate-900 transition flex items-center gap-2.5"
                  >
                    <LayoutDashboard className="h-4 w-4 text-sky-400" />
                    {!isCollapsed && "Genel Analiz / Dashboard"}
                  </button>

                  <button
                    onClick={() => {
                      router.push("/tahsilat-satis");
                      setIsOpenMobile(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl font-medium text-slate-300 hover:bg-slate-900 transition flex items-center gap-2.5"
                  >
                    <BarChart3 className="h-4 w-4 text-emerald-400" />
                    {!isCollapsed && "Satış Analizi"}
                  </button>

                  <button
                    onClick={() => {
                      router.push("/finansal-raporlar");
                      setIsOpenMobile(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl font-medium text-slate-300 hover:bg-slate-900 transition flex items-center gap-2.5"
                  >
                    <PieChart className="h-4 w-4 text-purple-400" />
                    {!isCollapsed && "Finansal Analiz"}
                  </button>
                </div>

                {/* 2. SECTION: Gelir & Gider */}
                <div className="space-y-1">
                  {!isCollapsed && (
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-1 pt-1">
                      Gelir & Gider
                    </div>
                  )}

                  {/* GREEN ACTIVE HIGHLIGHT BUTTON MATCHING SCREENSHOT 2 */}
                  <button
                    onClick={() => {
                      onOpenNewJournal("GELIR");
                      setIsOpenMobile(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="h-4 w-4 text-white" />
                      {!isCollapsed && <span>Ön Muhasebe Kaydı İşlemleri</span>}
                    </div>
                    {!isCollapsed && <Plus className="h-4 w-4 text-white font-bold" />}
                  </button>

                  <button
                    onClick={() => {
                      router.push("/tahsilat-satis");
                      setIsOpenMobile(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl font-medium text-emerald-400 hover:bg-slate-900 transition flex items-center gap-2.5"
                  >
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    {!isCollapsed && "Gelirler & Tahsilatlar"}
                  </button>

                  <button
                    onClick={() => {
                      router.push("/odeme-tediye");
                      setIsOpenMobile(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl font-medium text-rose-400 hover:bg-slate-900 transition flex items-center gap-2.5"
                  >
                    <TrendingDown className="h-4 w-4 text-rose-400" />
                    {!isCollapsed && "Giderler & Ödemeler"}
                  </button>
                </div>

                {/* 3. SECTION: Ticari İşlemler */}
                <div className="space-y-1">
                  {!isCollapsed && (
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-1 pt-1">
                      Ticari İşlemler
                    </div>
                  )}

                  <button
                    onClick={() => {
                      router.push("/musteriler");
                      setIsOpenMobile(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl font-medium text-slate-200 hover:bg-slate-900 transition flex items-center gap-2.5"
                  >
                    <Users className="h-4 w-4 text-blue-400" />
                    {!isCollapsed && "Müşteriler & Cariler (120)"}
                  </button>

                  <button
                    onClick={() => {
                      router.push("/tedarikciler");
                      setIsOpenMobile(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl font-medium text-slate-200 hover:bg-slate-900 transition flex items-center gap-2.5"
                  >
                    <Building2 className="h-4 w-4 text-amber-400" />
                    {!isCollapsed && "Tedarikçiler & Borçlar (320)"}
                  </button>

                  <button
                    onClick={() => {
                      router.push("/muhasebe-tahakkuk");
                      setIsOpenMobile(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl font-medium text-slate-300 hover:bg-slate-900 transition flex items-center gap-2.5"
                  >
                    <FileCheck className="h-4 w-4 text-teal-400" />
                    {!isCollapsed && "Muhasebe Fişleri & Kayıtlar"}
                  </button>
                </div>

                {/* 4. SECTION: Finansal Yönetim */}
                <div className="space-y-1">
                  {!isCollapsed && (
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-1 pt-1">
                      Finansal Yönetim
                    </div>
                  )}

                  <button
                    onClick={() => {
                      router.push("/banka-kasa");
                      setIsOpenMobile(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl font-medium text-slate-200 hover:bg-slate-900 transition flex items-center gap-2.5"
                  >
                    <Wallet className="h-4 w-4 text-emerald-400" />
                    {!isCollapsed && "Mevduatlar / Banka & Kasa (100/102)"}
                  </button>

                  <button
                    onClick={() => {
                      router.push("/finansal-raporlar");
                      setIsOpenMobile(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl font-medium text-slate-200 hover:bg-slate-900 transition flex items-center gap-2.5"
                  >
                    <Scale className="h-4 w-4 text-sky-400" />
                    {!isCollapsed && "Raporlar, Bilanço & Mizan"}
                  </button>
                </div>

                {/* 5. SECTION: Sistem & Ayarlar */}
                <div className="space-y-1 pt-1 border-t border-slate-800">
                  {!isCollapsed && (
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-1 pt-1">
                      Sistem
                    </div>
                  )}

                  <button
                    onClick={onOpenAddCompanyModal}
                    className="w-full text-left px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-slate-200 transition flex items-center gap-2.5"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    {!isCollapsed && "Firma & Kurum Ayarları"}
                  </button>

                  <button
                    onClick={() => alert("Sistem Yedekleme: Tüm verileriniz MongoDB kapsayıcısında güvendedir.")}
                    className="w-full text-left px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-slate-200 transition flex items-center gap-2.5"
                  >
                    <Database className="h-4 w-4 text-slate-400" />
                    {!isCollapsed && "Yedekleme & Veri Güvenliği"}
                  </button>

                  <button
                    onClick={() => alert("Yardım Kılavuzu: Kurumsal Ön Muhasebe Fiş Kesme ve Bilanço Eğitimi.")}
                    className="w-full text-left px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-slate-200 transition flex items-center gap-2.5"
                  >
                    <HelpCircle className="h-4 w-4 text-sky-400" />
                    {!isCollapsed && "Yardım & Destek"}
                  </button>
                </div>
              </div>
            </div>
          )}
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
