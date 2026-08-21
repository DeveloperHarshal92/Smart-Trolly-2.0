import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ScrollHero from "../../../components/ui/ethereal";
import { Camera, ArrowRight, LogIn } from "lucide-react";

export default function LandingPage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      {/* ── Full-screen Ethereal Hero ─────────────────────────────────────── */}
      <ScrollHero
        sections={[
          {
            id: "hero",
            headline: "Smart Trolly",
            subheadline: "Beyond Checkout",
            body: "AI-powered autonomous retail with real-time YOLOv8 neural vision",
          },
          {
            id: "detect",
            headline: "YOLOv8",
            subheadline: "Neural Detection",
            body: "Sub-second optical item detection with zero GPU dependency",
          },
          {
            id: "bill",
            headline: "One Tap",
            subheadline: "Checkout Flow",
            body: "GST-compliant billing, Razorpay payments & thermal PDF receipts",
          },
          {
            id: "start",
            headline: "Start Now",
            subheadline: "Scan & Pay",
            body: "Launch the live scanner and experience frictionless checkout",
          },
        ]}
        colorPalette={{
          primary: "#10b981",
          secondary: "#059669",
          tertiary: "#06b6d4",
          accent: "#06ffa5",
          dark: "#020203",
        }}
        logo="ST 2.0"
        menuItems={["Features", "Demo", "Architecture", "Specs"]}
      />

      {/* ── Minimal Dark Footer CTA ───────────────────────────────────────── */}
      <div className="landing-footer-cta">
        <div className="landing-footer-inner">
          <span className="landing-footer-brand">
            <span className="landing-footer-dot" />
            Smart Trolly 2.0
          </span>

          <div className="landing-footer-actions">
            {user ? (
              <Link to="/scan" className="landing-cta-primary">
                <Camera className="w-4 h-4" />
                Launch Scanner
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="landing-cta-ghost">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link to="/scan" className="landing-cta-primary">
                  <Camera className="w-4 h-4" />
                  Start Scanning
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          <span className="landing-footer-copy">
            YOLOv8 · ONNX · Razorpay
          </span>
        </div>
      </div>
    </>
  );
}
