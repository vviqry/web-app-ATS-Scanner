import React from "react";
import { Sparkles, ArrowRight, BookOpen, MessageSquare, AlertCircle } from "lucide-react";
import { RevisionSuggestion } from "../types";

interface RevisionSectionProps {
  suggestions: RevisionSuggestion[];
}

export function RevisionSection({ suggestions }: RevisionSectionProps) {
  if (suggestions.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm text-center">
        <Sparkles className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
        <p className="text-sm text-stone-600">CV Anda sudah sangat optimal! Tidak ditemukan bagian yang kritis untuk direvisi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-display font-bold text-stone-900">
            Saran Revisi Penulisan Kerja
          </h3>
          <p className="text-xs text-stone-500 font-sans">
            Gunakan format STAR (Situation, Task, Action, Result) bertenaga AI berikut di CV Anda.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-orange-50 border border-orange-200 text-xs text-orange-850 font-mono">
          <Sparkles className="h-3.5 w-3.5 text-orange-650 animate-pulse" />
          {suggestions.length} Area Rekomendasi
        </span>
      </div>

      <div className="space-y-4">
        {suggestions.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            {/* Header / Category bar */}
            <div className="bg-stone-50 border-b border-stone-200 px-5 py-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-600"></span>
                <span className="text-xs font-mono font-bold tracking-wider text-stone-500 uppercase">
                  {item.category || "Kompetensi Karir"}
                </span>
              </div>
              <span className="text-[10px] text-stone-400 bg-white border border-stone-150 px-2 py-0.5 rounded">
                Saran AI #{index + 1}
              </span>
            </div>

            {/* Comparison Grid */}
            <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* Original Phrase */}
              <div className="bg-stone-50/50 border border-stone-100 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono tracking-wider text-stone-400 uppercase font-semibold mb-2">
                    REDAKSI ASLI / SEBELUM (DARI CV)
                  </div>
                  <p className="text-sm text-stone-605 italic leading-relaxed">
                    "{item.originalPhrase || "Belum dicantumkan"}"
                  </p>
                </div>
                {(!item.originalPhrase || item.originalPhrase === "Belum dicantumkan") && (
                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] text-amber-600 font-medium font-sans">
                    <AlertCircle className="h-3 w-3" />
                    Informasi penting ini belum disertakan
                  </span>
                )}
              </div>

              {/* Suggested Rephrase */}
              <div className="bg-orange-50/20 border border-orange-100/70 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono tracking-wider text-orange-600 uppercase font-bold mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                    SARAN REDAKSI BARU (ATS-OPTIMAL)
                  </div>
                  <p className="text-sm text-stone-900 font-medium leading-relaxed bg-white p-3 rounded-lg border border-orange-200/50 shadow-sm text-[13px]">
                    "{item.suggestedPhrase}"
                  </p>
                </div>
                <div className="mt-3 text-[11px] text-stone-500 leading-normal bg-stone-50 border border-stone-200/40 px-3 py-2 rounded-lg">
                  <div className="font-semibold text-stone-700 flex items-center gap-1 mb-0.5">
                    <BookOpen className="h-3 w-3 text-orange-500" /> Alasan Optimalisasi:
                  </div>
                  {item.explanation}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
