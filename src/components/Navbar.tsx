"use client";

import React from "react";
import { Database, Menu, ShieldCheck, Sparkles } from "lucide-react";

interface NavbarProps {
  onOpenMobileSidebar: () => void;
  onSeedDemoData: () => void;
  isSeeding: boolean;
}

export function Navbar(
  { onOpenMobileSidebar, onSeedDemoData, isSeeding }: NavbarProps,
) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
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
            <span className="hidden sm:inline-flex bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/20 items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> TDHP Double-Entry
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            Medici + Mongoose + Docker / In-Memory DB
          </p>
        </div>
      </div>

      {/* Right: DB status & Seed Data Button */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
          <Database className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span>
            MongoDB:{" "}
            <strong className="text-emerald-400 font-medium">Aktif</strong>
          </span>
        </div>

        <button
          onClick={onSeedDemoData}
          disabled={isSeeding}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-medium px-3.5 py-2 rounded-xl transition-all duration-200 disabled:opacity-50 active:scale-95 shadow-sm"
        >
          <Sparkles
            className={`h-3.5 w-3.5 text-amber-400 ${
              isSeeding ? "animate-spin" : ""
            }`}
          />
          <span>{isSeeding ? "Yükleniyor..." : "Örnek İşlemler Yükle"}</span>
        </button>
      </div>
    </header>
  );
}
