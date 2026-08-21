import React from "react";
import { Link } from "react-router-dom";
import { Camera, ArrowLeft } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function NotFoundPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="notfound-page">
      {/* Background glow orbs */}
      <div className="notfound-glow-1" />
      <div className="notfound-glow-2" />

      {/* Theme toggle */}
      <button onClick={toggleTheme} className="auth-theme-toggle" aria-label="Toggle theme">
        {theme === "dark" ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <div className="notfound-content">
        {/* Error badge */}
        <div className="notfound-badge">
          <span className="notfound-badge-dot" />
          <span className="notfound-badge-text">HTTP 404</span>
        </div>

        {/* Big number */}
        <div className="notfound-number">
          4<span className="notfound-number-accent">0</span>4
        </div>

        <h1 className="notfound-title">Route Not Found</h1>

        <p className="notfound-body">
          This coordinate doesn't exist in the Smart Trolly system.
        </p>

        {/* Actions */}
        <div className="notfound-actions">
          <Link to="/" className="notfound-btn-ghost">
            <ArrowLeft className="w-4 h-4" />
            Back Home
          </Link>
          <Link to="/scan" className="notfound-btn-primary">
            <Camera className="w-4 h-4" />
            Open Scanner
          </Link>
        </div>
      </div>
    </div>
  );
}
