"use client";

import React from "react";
import { Database, Menu, ShieldCheck, Building2, Plus, PanelLeftOpen } from "lucide-react";

export interface CompanyInfo {
  id: string;
  name: string;
  code: string;
}

interface NavbarProps {
  onOpenMobileSidebar: () => void;
  onToggleSidebar: () => void;
  isCollapsed: boolean;
  onSeedDemoData: () => void;
  isSeeding: boolean;
  companies: CompanyInfo[];
  selectedBook: string;
  onSelectCompany: (companyId: string) => void;
  onOpenAddCompanyModal: () => void;
}

export function Navbar({
  onOpenMobileSidebar,
  onToggleSidebar,
  isCollapsed,
  onSeedDemoData,
  isSeeding,
  companies,
  selectedBook,
  onSelectCompany,
  onOpenAddCompanyModal,
}: NavbarProps) {
  const currentCompany = companies.find((c) => c.id === selectedBook) || companies[0];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
      {/* Left: Mobile Toggle, Collapsed Re-open Toggle & Title */}
      <div className="flex items-center gap-3">
        {/* Show icon-only toggle button in Navbar ONLY when sidebar is collapsed */}
        {isCollapsed && (
          <button
            onClick={onToggleSidebar}
            title="Sol Menüyü Genişlet (Aç)"
            className="hidden lg:flex items-center justify-center p-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 rounded-xl transition shadow-sm active:scale-95 cursor-pointer"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        )}

        {/* Mobile Toggle */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-300 hover:text-slate-100 bg-slate-900 border border-slate-800 rounded-xl transition"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-base sm:text-lg text-slate-100 tracking-tight">
              Gelir - Gider Ön Muhasebe
            </h1>
            <span className="hidden sm:inline-flex bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Kurumsal Finans
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">Medici + Mongoose + Docker / In-Memory DB</p>
        </div>
      </div>

      {/* Center/Right: Company Switcher & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Company Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1">
          <div className="flex items-center gap-2 px-2.5 py-1">
            <Building2 className="h-4 w-4 text-emerald-400" />
            <select
              value={selectedBook}
              onChange={(e) => onSelectCompany(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              {companies.map((comp) => (
                <option key={comp.id} value={comp.id} className="bg-slate-900 text-slate-200">
                  {comp.name} [{comp.code}]
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenAddCompanyModal}
            title="Başka Kurum / Şirket Ekle"
            className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-emerald-500/20 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Başka Kurum Ekle</span>
          </button>
        </div>

        {/* Database status indicator */}
        <div className="hidden xl:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
          <Database className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span>DB: <strong className="text-emerald-400 font-medium">Aktif</strong></span>
        </div>

        {/* Seed Company Opening Entry Button */}
        <button
          onClick={onSeedDemoData}
          disabled={isSeeding}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-medium px-3 py-2 rounded-xl transition-all duration-200 disabled:opacity-50 active:scale-95 shadow-sm"
        >
          <Building2 className={`h-3.5 w-3.5 text-emerald-400 ${isSeeding ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{isSeeding ? "Yükleniyor..." : "Açılış Fişini Yükle"}</span>
        </button>
      </div>
    </header>
  );
}
