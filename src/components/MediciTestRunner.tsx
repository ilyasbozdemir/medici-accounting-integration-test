"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Play, RefreshCw, ShieldAlert, Terminal } from "lucide-react";

interface TestResult {
  name: string;
  status: "PASSED" | "FAILED";
  details: string;
}

export function MediciTestRunner() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);

  const runTests = async () => {
    setTesting(true);
    try {
      const res = await fetch("/api/medici/test", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setResults(data.tests);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-400" /> Canlı Medici Motoru Doğrulama Testi
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Medici&apos;nin çift taraflı kayıt kısıtlamalarını, ters kayıt (voiding) ve hiyerarşik hesap birleştirmelerini doğrudan test edin.
          </p>
        </div>

        <button
          onClick={runTests}
          disabled={testing}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm px-4 py-2 rounded-xl transition disabled:opacity-50 shadow-md shadow-emerald-500/10"
        >
          {testing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
          <span>{testing ? "Testler Çalıştırılıyor..." : "Medici Testlerini Çalıştır"}</span>
        </button>
      </div>

      {!results ? (
        <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-xl">
          <ShieldAlert className="h-10 w-10 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">
            Yukarıdaki &quot;Medici Testlerini Çalıştır&quot; butonuna tıklayarak Medici çift taraflı motor doğrulamalarını başlatabilirsiniz.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((t, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-start gap-4 transition ${
                t.status === "PASSED"
                  ? "bg-emerald-950/20 border-emerald-500/30 text-slate-200"
                  : "bg-rose-950/20 border-rose-500/30 text-slate-200"
              }`}
            >
              {t.status === "PASSED" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-slate-100">{t.name}</h4>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      t.status === "PASSED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">{t.details}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
