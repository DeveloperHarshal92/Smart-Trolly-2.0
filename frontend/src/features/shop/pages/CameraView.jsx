// features/shop/pages/CameraView.jsx
// Zone B: Live Detection Interface — Dark Cinematic Theme

import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDetection } from "../hooks/useDetection";
import { useCheckout } from "../hooks/useCheckout";
import { useAuth } from "../../auth/hooks/useAuth";
import { useTheme } from "../../common/context/ThemeContext";
import { removeItem, clearTrolley } from "../state/detection.slice";
import { fetchPreviewBill } from "../../payment/state/payment.slice";
import ReceiptModal from "./ReceiptModal";
import {
  Camera,
  CameraOff,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  LogOut,
  Loader2,
  ShieldCheck,
} from "lucide-react";

const STATUS_CONFIG = {
  idle: {
    dot: "cv-status-dot cv-status-idle",
    text: "Offline",
    badge: "cv-status-badge cv-status-badge-idle",
  },
  connecting: {
    dot: "cv-status-dot cv-status-connecting",
    text: "Connecting…",
    badge: "cv-status-badge cv-status-badge-connecting",
  },
  connected: {
    dot: "cv-status-dot cv-status-connected",
    text: "Live Stream",
    badge: "cv-status-badge cv-status-badge-connected",
  },
  error: {
    dot: "cv-status-dot cv-status-error",
    text: "Stream Error",
    badge: "cv-status-badge cv-status-badge-error",
  },
};

const PREVIEW_DEBOUNCE_MS = 600;

const CameraView = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { handleLogout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { previewBill, previewLoading } = useSelector((s) => s.payment);

  const {
    videoRef,
    canvasRef,
    status,
    error,
    liveBoxes,
    trolleyItems,
    start,
    stop,
  } = useDetection();

  const {
    status: checkoutStatus,
    error: checkoutError,
    receipt,
    startCheckout,
    resetPayment,
  } = useCheckout();

  const isRunning = status === "connecting" || status === "connected";
  const isCheckingOut = ["creating_order", "awaiting_payment", "verifying"].includes(checkoutStatus);
  const statusStyle = STATUS_CONFIG[status] || STATUS_CONFIG.idle;

  const debounceRef = useRef(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (trolleyItems.length === 0) return;
    debounceRef.current = setTimeout(() => {
      const labels = trolleyItems.map((item) => item.label);
      dispatch(fetchPreviewBill(labels));
    }, PREVIEW_DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [trolleyItems, dispatch]);

  const handleCheckout = () => {
    const labels = trolleyItems.map((item) => item.label);
    startCheckout(labels, user);
  };

  const handleRemoveItem = (index) => dispatch(removeItem(index));
  const handleClearTrolley = () => dispatch(clearTrolley());

  return (
    <div className="cv-root">
      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <header className="cv-header">
        <div className="cv-header-inner">
          {/* Left: back + brand */}
          <div className="cv-header-left">
            <Link to="/" className="cv-back-btn">
              <ArrowLeft className="w-4 h-4" />
              <span className="cv-back-text">Home</span>
            </Link>
            <div className="cv-header-divider" />
            <div className="cv-brand">
              <div className="cv-brand-icon">
                <Camera className="w-4 h-4" />
              </div>
              <span className="cv-brand-name">
                Smart Trolly <span className="cv-brand-version">2.0</span>
              </span>
            </div>
          </div>

          {/* Right: status + theme + user */}
          <div className="cv-header-right">
            <div className={statusStyle.badge}>
              <span className={statusStyle.dot} />
              <span>{statusStyle.text}</span>
            </div>

            <button onClick={toggleTheme} className="cv-icon-btn" aria-label="Toggle theme">
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

            <div className="cv-user-row">
              <span className="cv-username">{user?.username || user?.email}</span>
              <button onClick={handleLogout} className="cv-logout-btn" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Workspace ───────────────────────────────────────────────── */}
      <main className="cv-main">
        {/* Left: Video Feed */}
        <div className="cv-video-col">
          {/* Controls row */}
          <div className="cv-controls-row">
            <div>
              <h1 className="cv-feed-title">
                Neural Vision Feed
                <span className="cv-feed-badge">YOLOv8 ONNX</span>
              </h1>
              <p className="cv-feed-sub">640×480 · WebSocket · 200ms intervals</p>
            </div>
            <div className="cv-btn-group">
              <button onClick={start} disabled={isRunning} className="cv-btn-start">
                <Camera className="w-4 h-4" />
                Start
              </button>
              <button onClick={stop} disabled={!isRunning} className="cv-btn-stop">
                <CameraOff className="w-4 h-4" />
                Stop
              </button>
            </div>
          </div>

          {/* Video viewport */}
          <div className="cv-viewport">
            <video ref={videoRef} className="cv-video" muted playsInline />
            <canvas ref={canvasRef} className="hidden" />

            {/* Detection bounding boxes */}
            {liveBoxes.map((box, i) => {
              const video = videoRef.current;
              if (!video || !video.videoWidth) return null;
              const leftPct = (box.bboxPixel.x1 / video.videoWidth) * 100;
              const topPct = (box.bboxPixel.y1 / video.videoHeight) * 100;
              const widthPct = ((box.bboxPixel.x2 - box.bboxPixel.x1) / video.videoWidth) * 100;
              const heightPct = ((box.bboxPixel.y2 - box.bboxPixel.y1) / video.videoHeight) * 100;
              return (
                <div
                  key={i}
                  className="cv-bbox"
                  style={{ left: `${leftPct}%`, top: `${topPct}%`, width: `${widthPct}%`, height: `${heightPct}%` }}
                >
                  <span className="cv-bbox-label">
                    {box.label} · {(box.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              );
            })}

            {/* Scan line when running */}
            {isRunning && (
              <div className="cv-scanline-wrap">
                <div className="cv-scanline animate-scan" />
              </div>
            )}

            {/* Inactive overlay */}
            {!isRunning && (
              <div className="cv-inactive-overlay">
                <div className="cv-inactive-icon">
                  <CameraOff className="w-6 h-6" />
                </div>
                <h3 className="cv-inactive-title">Camera Inactive</h3>
                <p className="cv-inactive-body">
                  Click Start to grant camera access and begin neural detection
                </p>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="cv-error-banner">
              Stream error: {error}
            </div>
          )}

          {/* Telemetry chips */}
          <div className="cv-telemetry-row">
            <div className="cv-telemetry-chip">
              <span className="cv-telemetry-label">Streak Gate</span>
              <span className="cv-telemetry-value">3 Frames</span>
            </div>
            <div className="cv-telemetry-chip">
              <span className="cv-telemetry-label">Cooldown</span>
              <span className="cv-telemetry-value">4,000 ms</span>
            </div>
            <div className="cv-telemetry-chip">
              <span className="cv-telemetry-label">Confidence</span>
              <span className="cv-telemetry-value cv-telemetry-accent">≥ 70%</span>
            </div>
          </div>
        </div>

        {/* Right: Smart Cart */}
        <div className="cv-cart-col">
          <div className="cv-cart-card">
            {/* Cart header */}
            <div className="cv-cart-header">
              <div className="cv-cart-title-row">
                <div className="cv-cart-icon">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="cv-cart-title">Smart Cart</h2>
                  <p className="cv-cart-count">{trolleyItems.length} item(s)</p>
                </div>
              </div>
              {trolleyItems.length > 0 && (
                <button onClick={handleClearTrolley} className="cv-clear-btn">
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>

            {/* Items list */}
            <div className="cv-items-list">
              {!previewBill || previewBill.lineItems.length === 0 ? (
                <div className="cv-empty-cart">
                  <ShoppingCart className="cv-empty-icon" />
                  <p className="cv-empty-text">Cart is empty</p>
                  <p className="cv-empty-sub">Present items to camera</p>
                </div>
              ) : (
                previewBill.lineItems.map((line, idx) => (
                  <div key={line.sn} className="cv-item-row">
                    <div className="cv-item-info">
                      <span className="cv-item-sn">{line.sn}</span>
                      <div>
                        <div className="cv-item-name">{line.item}</div>
                        <div className="cv-item-meta">
                          Qty: {line.quantity} · GST: {(line.gstRate * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    <div className="cv-item-actions">
                      <span className="cv-item-price">₹{line.total}</span>
                      <button onClick={() => handleRemoveItem(idx)} className="cv-item-remove">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bill summary + checkout */}
            <div className="cv-bill-section">
              {previewBill && previewBill.lineItems.length > 0 && (
                <div className="cv-bill-rows">
                  <div className="cv-bill-row">
                    <span>Subtotal</span>
                    <span className="cv-bill-mono">₹{previewBill.subtotalAmount}</span>
                  </div>
                  <div className="cv-bill-row">
                    <span>Total GST</span>
                    <span className="cv-bill-mono cv-bill-gst">+ ₹{previewBill.totalGST}</span>
                  </div>
                  <div className="cv-bill-total">
                    <span>
                      Grand Total
                      {previewLoading && <span className="cv-bill-updating">(updating…)</span>}
                    </span>
                    <span className="cv-bill-total-value">₹{previewBill.totalAmount}</span>
                  </div>
                </div>
              )}

              {checkoutError && (
                <p className="cv-checkout-error">{checkoutError}</p>
              )}

              <button
                onClick={handleCheckout}
                disabled={trolleyItems.length === 0 || isCheckingOut}
                className="cv-checkout-btn"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Razorpay Checkout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Receipt Modal */}
      {checkoutStatus === "success" && (
        <ReceiptModal receipt={receipt} onClose={resetPayment} />
      )}
    </div>
  );
};

export default CameraView;
