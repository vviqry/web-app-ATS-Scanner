import React from "react";
import { Sparkles, Terminal, ShieldCheck, Cpu } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Logo & Headline */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/10 hover:rotate-6 transition-transform duration-300">
              <Cpu className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg sm:text-2xl font-bold tracking-tight text-stone-900">
                  Pemindai ATS <span className="text-orange-600">Pintar</span>
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide bg-stone-100 text-stone-700 border border-stone-200">
                  v2.0 Beta
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 font-sans mt-0.5 sm:mt-1">
                Optimalkan CV Anda untuk Lolosi Sistem Applicant Tracking System bertenaga AI
              </p>
            </div>
          </div>

          {/* Engine Statuses & Meta */}
          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-stone-600">Gemini-3.5-Flash</span>
            </div>
            
            <div className="hidden md:flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-600 font-mono">
              <ShieldCheck className="h-4 w-4 text-orange-600" />
              <span>Koneksi Aman</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
