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
} from "lucide-react";
import { CompanyInfo } from "./Navbar";

export type ModuleCategory =
  | "alacak"
  | "odeme"
  | "tahsilat"
  | "varlik"
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

  // Active module category
  const [activeModule, setActiveModule] = useState<ModuleCategory>("muhasebe");
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);
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

  const handleSelectModule = (mod: ModuleCategory) => {
    setActiveModule(mod);
    setIsModuleDropdownOpen(false);

    if (mod === "alacak") {
      router.push("/musteriler");
    } else if (mod === "odeme") {
      router.push("/odeme-tediye");
    } else if (mod === "tahsilat") {
      router.push("/tahsilat-satis");
    } else if (mod === "varlik") {
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

  // Main Category items matching official screenshot
  const mainCategories = [
    { id: "muhasebe", title: "Muhasebe İşlemleri", icon: Calendar },
    { id: "tahsilat", title: "Tahsilat İşlemleri", icon: Wallet },
    { id: "odeme", title: "Ödeme İşlemleri", icon: CreditCard },
    { id: "alacak", title: "Alacak İşlemleri (120)", icon: Briefcase },
    { id: "varlik", title: "Varlık İşlemleri (100/102)", icon: Building },
    { id: "raporlar", title: "Finansal Raporlar", icon: FileText },
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

      {/* SINGLE SIDEBAR */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-3.5 transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile
            ? "translate-x-0 w-72"
            : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-72"}`}
      >
        {/* Top Scrollable Content */}
        <div className="space-y-4 overflow-y-auto no-scrollbar pr-0.5 relative">
          {/* Header: Logo & System Name */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-100 font-bold shadow-sm">
                <Building className="h-5 w-5 text-emerald-400" />
              </div>

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

          {/* MAIN MODULE SELECTOR DROPDOWN */}
          {!isCollapsed ? (
            <div className="relative">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1 mb-1 flex items-center justify-between">
                <span>Ana Modül Seçimi</span>
                <span className="text-slate-500 font-mono text-[9px]">Tıkla & Geç</span>
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

          {/* SUB-MENU SECTION (FLAT STRUCTURE MATCHING OFFICIAL SCREENSHOT) */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            {!isCollapsed && (
              <div className="space-y-2">
                {/* Sub-menu title & Search input matching screenshot */}
                <div className="flex items-center justify-between text-xs font-extrabold text-blue-400 px-1 border-b border-slate-800 pb-1.5">
                  <span className="truncate">{currentModuleObj.title}</span>
                  <Search className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
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

            {/* FLAT SUB-MENU ITEMS (NO NESTING / NO INDENTATION / MATCHING SCREENSHOT) */}
            <div className="space-y-1 pt-1">
              {/* 1. Gösterge Paneli */}
              <button
                onClick={() => {
                  if (activeModule === "tahsilat") router.push("/tahsilat-satis");
                  else if (activeModule === "odeme") router.push("/odeme-tediye");
                  else if (activeModule === "alacak") router.push("/musteriler");
                  else if (activeModule === "varlik") router.push("/banka-kasa");
                  else if (activeModule === "muhasebe") router.push("/muhasebe-tahakkuk");
                  else if (activeModule === "raporlar") router.push("/finansal-raporlar");
                  else router.push("/");
                  setIsOpenMobile(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-900 transition flex items-center gap-2.5"
              >
                <LayoutDashboard className="h-4 w-4 text-sky-400" />
                {!isCollapsed && "Gösterge Paneli"}
              </button>

              {/* 2. Ön Muhasebe Kaydı İşlemleri (GREEN HIGHLIGHT MATCHING SCREENSHOT) */}
              <button
                onClick={() => {
                  onOpenNewJournal("GELIR");
                  setIsOpenMobile(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-white" />
                  {!isCollapsed && <span>Ön Muhasebe Kaydı İşlemleri</span>}
                </div>
                {!isCollapsed && <Plus className="h-4 w-4 text-white font-bold" />}
              </button>

              {/* 3. Muhasebe Fişi İşlemleri (FLAT ITEM) */}
              <button
                onClick={() => {
                  onOpenNewJournal("ADVANCED");
                  setIsOpenMobile(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-900 transition flex items-center gap-2.5"
              >
                <Receipt className="h-4 w-4 text-emerald-400" />
                {!isCollapsed && "Muhasebe Fişi İşlemleri"}
              </button>

              {/* 4. Hesap Planı ve Kodu İşlemleri (FLAT ITEM) */}
              <button
                onClick={() => {
                  router.push("/muhasebe-tahakkuk");
                  setIsOpenMobile(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-900 transition flex items-center gap-2.5"
              >
                <Users className="h-4 w-4 text-blue-400" />
                {!isCollapsed && "Hesap Planı ve Kodu İşlemleri"}
              </button>

              {/* 5. Hesap İnceleme & Ekstre İşlemleri (FLAT ITEM) */}
              <button
                onClick={() => {
                  router.push("/musteriler");
                  setIsOpenMobile(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-900 transition flex items-center gap-2.5"
              >
                <Search className="h-4 w-4 text-amber-400" />
                {!isCollapsed && "Hesap İnceleme & Ekstre İşlemleri"}
              </button>

              {/* 6. Raporlar & Cetveller (FLAT ITEM) */}
              <button
                onClick={() => {
                  router.push("/finansal-raporlar");
                  setIsOpenMobile(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-900 transition flex items-center gap-2.5"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                {!isCollapsed && "Raporlar & Cetveller"}
              </button>

              {/* 7. Nakit Hareketleri (FLAT ITEM) */}
              <button
                onClick={() => {
                  router.push("/banka-kasa");
                  setIsOpenMobile(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-900 transition flex items-center gap-2.5"
              >
                <Wallet className="h-4 w-4 text-teal-400" />
                {!isCollapsed && "Nakit Hareketleri"}
              </button>

              {/* 8. Yardım Kılavuzu & Videolar */}
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <button
                  onClick={() => alert("Yardım Kılavuzu: Fiş kesme, borç/alacak dengeleme ve ekstre raporlama rehberi.")}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition flex items-center gap-2.5"
                >
                  <HelpCircle className="h-4 w-4 text-sky-400" />
                  {!isCollapsed && "Yardım Kılavuzu"}
                </button>

                <button
                  onClick={() => alert("Yardım Videoları: Kurumsal Muhasebe Sistemi Kullanım Eğitimi.")}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition flex items-center gap-2.5"
                >
                  <PlayCircle className="h-4 w-4 text-rose-400" />
                  {!isCollapsed && "Yardım Videoları"}
                </button>
              </div>
            </div>
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
