import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { Link } from "react-router-dom";

const InputField = ({
  label,
  type,
  placeholder,
  id,
  value,
  onChange,
  icon,
  optional,
}) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest ml-0.5"
    >
      {label}
      {optional && (
        <span className="normal-case font-normal tracking-normal text-slate-300">
          (optional)
        </span>
      )}
    </label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </span>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 focus:bg-white transition-all duration-200 text-sm"
      />
    </div>
  </div>
);

const DetectionPanel = () => (
  <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 flex-col items-center justify-center overflow-hidden select-none">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(51,65,85,0.4) 1px, transparent 0)`,
        backgroundSize: "32px 32px",
      }}
    />
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />

    <div className="relative z-10 flex flex-col items-center gap-8 px-12">
      {/* Live detection mockup */}
      <div className="relative w-72 h-64 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

        <div className="absolute top-8 left-6 w-20 h-20 border-2 border-emerald-400 rounded">
          <div className="absolute -top-5 left-0 bg-emerald-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap">
            parle_g · 0.97
          </div>
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-300 -translate-x-px -translate-y-px" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-300 translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-300 -translate-x-px translate-y-px" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-300 translate-x-px translate-y-px" />
        </div>

        <div className="absolute top-16 right-8 w-16 h-24 border-2 border-sky-400 rounded">
          <div className="absolute -top-5 left-0 bg-sky-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap">
            colgate · 0.94
          </div>
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-sky-300 -translate-x-px -translate-y-px" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-sky-300 translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-sky-300 -translate-x-px translate-y-px" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-sky-300 translate-x-px translate-y-px" />
        </div>

        <div className="absolute bottom-10 left-16 w-24 h-14 border-2 border-violet-400 rounded">
          <div className="absolute -top-5 left-0 bg-violet-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap">
            dairy_milk · 0.99
          </div>
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-violet-300 -translate-x-px -translate-y-px" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-violet-300 translate-x-px -translate-y-px" />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-violet-300 -translate-x-px translate-y-px" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-violet-300 translate-x-px translate-y-px" />
        </div>

        <div className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80 animate-[scan_2.5s_ease-in-out_infinite]" />

        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="text-[9px] font-mono text-emerald-400 bg-slate-950/80 px-1.5 py-0.5 rounded">
            ● LIVE
          </span>
          <span className="text-[9px] font-mono text-slate-400 bg-slate-950/80 px-1.5 py-0.5 rounded">
            YOLOv8 · 3 objects
          </span>
        </div>
      </div>

      {/* Bill preview */}
      <div className="w-64 bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Bill preview
          </span>
          <span className="text-[9px] text-emerald-400 font-mono">
            auto-generated
          </span>
        </div>
        {[
          { name: "parle_g", qty: 2, price: "₹20" },
          { name: "colgate", qty: 1, price: "₹20" },
          { name: "dairy_milk", qty: 1, price: "₹5" },
        ].map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between py-1.5 border-b border-slate-800/60 last:border-0"
          >
            <span className="text-xs text-slate-300 font-mono">
              {item.name}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-500">×{item.qty}</span>
              <span className="text-xs text-slate-200 font-medium w-8 text-right">
                {item.price}
              </span>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
          <span className="text-xs font-semibold text-white">Total</span>
          <span className="text-sm font-bold text-emerald-400">₹45</span>
        </div>
      </div>

      <p className="text-slate-400 text-sm text-center max-w-xs leading-relaxed">
        Detect, bill, and checkout — all without scanning a single barcode.
      </p>
    </div>

    <style
      dangerouslySetInnerHTML={{
        __html: `
      @keyframes scan {
        0% { top: 0%; opacity: 0; }
        5% { opacity: 1; }
        95% { opacity: 1; }
        100% { top: 100%; opacity: 0; }
      }
    `,
      }}
    />
  </div>
);

const Register = () => {
  const { handleRegister, loading } = useAuth();
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

  const icons = {
    user: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    email: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    phone: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    lock: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      <DetectionPanel />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-700 tracking-tight">
                Smart Trolly 2.0
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Create your account
            </h1>
            <p className="text-slate-400 text-sm mt-1.5">
              Get started with frictionless checkout
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <InputField
              id="username"
              label="Username"
              type="text"
              placeholder="Enter Username"
              value={formData.username}
              onChange={handleChange}
              icon={icons.user}
            />
            <InputField
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              icon={icons.email}
            />
            <InputField
              id="contact"
              label="Contact"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.contact}
              onChange={handleChange}
              icon={icons.phone}
              optional
            />
            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              icon={icons.lock}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-slate-400 bg-slate-50">
                or continue with
              </span>
            </div>
          </div>

          <a
            href="/api/auth/google"
            className="flex items-center justify-center gap-3 w-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium py-3 rounded-xl transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
              <path
                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                fill="#EA4335"
              />
              <path
                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                fill="#4285F4"
              />
              <path
                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                fill="#FBBC05"
              />
              <path
                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                fill="#34A853"
              />
            </svg>
            Google
          </a>

          <p className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
