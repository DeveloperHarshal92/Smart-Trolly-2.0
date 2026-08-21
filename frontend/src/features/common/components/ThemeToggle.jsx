import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${
        isDark
          ? "bg-slate-900/90 border-slate-800 text-amber-400 hover:text-amber-300 hover:bg-slate-800"
          : "bg-slate-100/90 border-slate-300/80 text-slate-700 hover:text-slate-950 hover:bg-slate-200"
      } ${className}`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -45, scale: 0.7, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 45, scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {isDark ? (
          <Sun className="w-4 h-4" strokeWidth={2.2} />
        ) : (
          <Moon className="w-4 h-4 text-slate-700 stroke-[2.2]" />
        )}
      </motion.div>
    </button>
  );
}
