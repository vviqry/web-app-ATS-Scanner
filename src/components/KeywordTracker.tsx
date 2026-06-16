import React from "react";
import { CheckCircle2, XCircle, Search, HelpCircle } from "lucide-react";

interface KeywordTrackerProps {
  matchedKeywords: string[];
  missingKeywords: string[];
}

export function KeywordTracker({ matchedKeywords, missingKeywords }: KeywordTrackerProps) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-stone-100">
        <div>
          <h3 className="text-lg font-display font-bold text-stone-900">
            Analisis Kata Kunci &amp; Kompetensi
          </h3>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Perbandingan terminologi penting di Loker dengan yang tertulis di resume Anda.
          </p>
        </div>
        <div className="text-xs font-mono text-stone-400 bg-stone-50 border border-stone-150 px-2 py-1 rounded">
          {matchedKeywords.length + missingKeywords.length} Total Kata Kunci
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Matched Keywords */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 font-medium text-sm">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
            <span>Kata Kunci Ditemukan ({matchedKeywords.length})</span>
          </div>
          
          {matchedKeywords.length === 0 ? (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-center text-xs text-stone-500">
              Belum ada kata kunci yang cocok. Coba periksa keselarasan CV Anda.
            </div>
          ) : (
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 min-h-[120px]">
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-emerald-800 border border-emerald-200 shadow-sm transition-all duration-200 hover:border-emerald-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Missing Keywords */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-700 font-medium text-sm">
            <XCircle className="h-4 w-4 flex-shrink-0 text-amber-600" />
            <span>Sangat Direkomendasikan Ditambah ({missingKeywords.length})</span>
          </div>

          {missingKeywords.length === 0 ? (
            <div className="bg-stone-50 border border-emerald-200 rounded-xl p-4 text-center text-xs text-emerald-700 font-medium">
              ✨ Selamat! Seluruh kata kunci esensial telah disertakan di CV Anda.
            </div>
          ) : (
            <div className="bg-amber-50/30 border border-amber-100 rounded-xl p-4 min-h-[120px]">
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200/60 shadow-sm transition-all duration-200 hover:bg-amber-100/50 hover:border-amber-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          <p className="text-[11px] text-stone-500 leading-normal flex items-start gap-1 p-1">
            <HelpCircle className="h-3 w-3 text-stone-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Tips ATS:</strong> Tempatkan kata kunci yang hilang di atas dalam deksripsi pekerjaan lama atau kolom keahlian/sertifikasi agar terbaca oleh algoritma recruiter.
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}
