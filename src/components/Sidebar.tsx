"use client";

import React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  FileSpreadsheet,
  Layers,
  LayoutDashboard,
  Moon,
  Plus,
  ShieldCheck,
  Sun,
  Terminal,
  TrendingUp,
  X,
} from "lucide-react";

interface SidebarProps {
  activeTab: "dashboard" | "accounts" | "ledger" | "reports" | "test";
  setActiveTab: (tab: "dashboard" | "accounts" | "ledger" | "reports" | "test") => void;
  onOpenNewJournal: (initialType?: "GELIR" | "GIDER" | "ADVANCED") => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  accountsCount: number;
  transactionsCount: number;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  onOpenNewJournal,
  isOpenMobile,
  setIsOpenMobile,
  theme,
  setTheme,
  accountsCount,
  transactionsCount,
}: SidebarProps) {
  const navItems = [
    {
      id: "dashboard",
      label: "Genel Bakış",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "ledger",
      label: "Gelir-Gider Kayıtları",
      icon: BookOpen,
      badge: transactionsCount > 0 ? transactionsCount : null,
    },
    {
      id: "accounts",
      label: "Hesap Planı (TDHP)",
      icon: Layers,
      badge: accountsCount > 0 ? accountsCount : null,
    },
    {
      id: "reports",
      label: "Finansal Tablolar",
      icon: FileSpreadsheet,
      badge: null,
    },
    {
      id: "test",
      label: "Medici Motor Testi",
      icon: Terminal,
      badge: "%100",
    },
  ] as const;

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Section */}
        <div className="space-y-6">
          {/* Logo & Close button */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-base text-slate-100 tracking-tight">Medici Finans</h1>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> TDHP Muhasebe
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsOpenMobile(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Action Gelir / Gider Buttons */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2">Hızlı İşlem Girişi</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onOpenNewJournal("GELIR");
                  setIsOpenMobile(false);
                }}
                className="flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-2 rounded-xl transition shadow-md shadow-emerald-500/10 active:scale-95"
              >
                <ArrowDownRight className="h-4 w-4 stroke-[2.5]" />
                <span>+ Gelir</span>
              </button>

              <button
                onClick={() => {
                  onOpenNewJournal("GIDER");
                  setIsOpenMobile(false);
                }}
                className="flex items-center justify-center gap-1 bg-rose-500 hover:bg-rose-600 text-slate-950 font-bold text-xs py-2 rounded-xl transition shadow-md shadow-rose-500/10 active:scale-95"
              >
                <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                <span>- Gider</span>
              </button>
            </div>

            <button
              onClick={() => {
                onOpenNewJournal("ADVANCED");
                setIsOpenMobile(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold py-2 rounded-xl transition active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Gelişmiş Yevmiye Fişi</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 mb-2">Menü</div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                        isActive
                          ? "bg-slate-950/20 text-slate-950"
                          : "bg-slate-800 text-emerald-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Theme Mode Switcher */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between px-2 text-xs font-medium text-slate-400">
            <span>Tema Modu</span>
            <span className="font-bold text-slate-200">{theme === "dark" ? "Siyah (Dark)" : "Beyaz (Light)"}</span>
          </div>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold py-2.5 rounded-xl transition"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4 text-amber-400" />
                <span>Beyaz Temaya Geç</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-emerald-400" />
                <span>Siyah Temaya Geç</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
