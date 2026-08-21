import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { Link } from "react-router-dom";
import { useTheme } from "../../common/context/ThemeContext";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
    <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
    <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
    <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
    <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
  </svg>
);

const Register = () => {
  const { handleRegister, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contact: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister(formData);
  };

  return (
    <div className="auth-page">
      {/* ── Left: Form Panel ─────────────────────────────────────────────── */}
      <div className="auth-form-panel">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="auth-theme-toggle"
          aria-label="Toggle theme"
        >
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

        <div className="auth-form-inner">
          {/* Header */}
          <div className="auth-form-header">
            <h1 className="auth-form-title">Create account</h1>
            <p className="auth-form-subtitle">Get started with frictionless checkout</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="username" className="auth-label">Username</label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="your_username"
                className="auth-input"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="email" className="auth-label">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="auth-input"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="contact" className="auth-label">
                Phone <span className="auth-label-optional">(optional)</span>
              </label>
              <input
                type="tel"
                id="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="auth-input"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password" className="auth-label">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="auth-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </>
              ) : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span className="auth-divider-line" />
            <span className="auth-divider-text">or</span>
            <span className="auth-divider-line" />
          </div>

          {/* Google OAuth */}
          <a href="/api/auth/google" className="auth-google-btn">
            <GoogleIcon />
            Continue with Google
          </a>

          {/* Footer link */}
          <p className="auth-footer-link">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>

      {/* ── Right: AI Image Panel ─────────────────────────────────────────── */}
      <div className="auth-image-panel">
        <img
          src="/register-panel.jpg"
          alt="AI neural checkout detection"
          className="auth-image-bg"
        />
        <div className="auth-image-overlay" />

        {/* Brand badge */}
        <div className="auth-image-brand">
          <Link to="/" className="auth-image-logo">
            <span className="auth-logo-dot" />
            ST 2.0
          </Link>
          <p className="auth-image-tagline">Detect. Bill. Checkout.</p>
        </div>

        {/* Bottom stats strip */}
        <div className="auth-image-stats">
          <div className="auth-stat">
            <span className="auth-stat-value">70%</span>
            <span className="auth-stat-label">Min. Confidence</span>
          </div>
          <div className="auth-stat-divider" />
          <div className="auth-stat">
            <span className="auth-stat-value">3×</span>
            <span className="auth-stat-label">Frame Gate</span>
          </div>
          <div className="auth-stat-divider" />
          <div className="auth-stat">
            <span className="auth-stat-value">GST</span>
            <span className="auth-stat-label">Auto Billing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
