import React from "react";
import { Camera } from "lucide-react";

export default function LoadingPage({ message = "Initializing Smart Trolly Engine..." }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 relative overflow-hidden select-none transition-colors duration-200">
      {/* Glow aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Pulsing Core Icon */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-2xl relative z-10">
            <Camera className="w-8 h-8 text-emerald-500 dark:text-emerald-400 animate-pulse" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl animate-pulse-glow" />
        </div>

        {/* Brand & Loading Indicator */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            System Hydration
          </span>
        </div>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Smart Trolly 2.0</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs font-mono">{message}</p>

        {/* Progress Bar */}
        <div className="w-48 h-1 bg-slate-200 dark:bg-slate-900 rounded-full mt-6 overflow-hidden border border-slate-300 dark:border-slate-800">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 rounded-full animate-scan" />
        </div>
      </div>
    </div>
  );
}
