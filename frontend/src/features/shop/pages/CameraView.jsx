// features/shop/pages/CameraView.jsx
// UI layer only. Camera + detection from useDetection, checkout from useCheckout.

import { useSelector } from "react-redux";
import { useDetection } from "../hooks/useDetection";
import { useCheckout } from "../../payment/hooks/Usecheckout";

const STATUS_STYLES = {
  idle:       { dot: "bg-slate-400", text: "Not started" },
  connecting: { dot: "bg-amber-400 animate-pulse", text: "Connecting…" },
  connected:  { dot: "bg-emerald-400", text: "Live" },
  error:      { dot: "bg-red-500", text: "Error" },
};

const ReceiptModal = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const downloadPDF = () => {
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${receipt.pdfBase64}`;
    link.download = "receipt.pdf";
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Payment Successful</h2>
          <p className="text-sm text-slate-400 mt-1">A copy has been emailed to you</p>
        </div>

        <div className="bg-slate-50 rounded-xl divide-y divide-slate-200 mb-5">
          {receipt.bill.lineItems.map((line) => (
            <div key={line.sn} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="text-slate-600">{line.item} × {line.quantity}</span>
              <span className="font-medium text-slate-800">₹{line.total}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-semibold text-slate-900">Total</span>
            <span className="font-bold text-emerald-600">₹{receipt.bill.totalAmount}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={downloadPDF}
            className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-all"
          >
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const CameraView = () => {
  const { user } = useSelector((s) => s.auth);
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

  const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.idle;
  const isRunning = status === "connecting" || status === "connected";
  const isCheckingOut = ["creating_order", "awaiting_payment", "verifying"].includes(checkoutStatus);

  const handleCheckout = () => {
    const labels = trolleyItems.map((item) => item.label);
    startCheckout(labels, user);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">

        {/* Camera — 70% width on large screens */}
        <div className="lg:w-[70%]">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-slate-900">Live Detection</h1>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
              <span className="text-xs font-medium text-slate-500">{statusStyle.text}</span>
            </div>
          </div>

          <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-lg">
            <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
            <canvas ref={canvasRef} className="hidden" />

            {liveBoxes.map((box, i) => {
              const video = videoRef.current;
              if (!video || !video.videoWidth) return null;

              const leftPct   = (box.bboxPixel.x1 / video.videoWidth) * 100;
              const topPct    = (box.bboxPixel.y1 / video.videoHeight) * 100;
              const widthPct  = ((box.bboxPixel.x2 - box.bboxPixel.x1) / video.videoWidth) * 100;
              const heightPct = ((box.bboxPixel.y2 - box.bboxPixel.y1) / video.videoHeight) * 100;

              return (
                <div
                  key={i}
                  className="absolute border-2 border-emerald-400 rounded"
                  style={{ left: `${leftPct}%`, top: `${topPct}%`, width: `${widthPct}%`, height: `${heightPct}%` }}
                >
                  <span className="absolute -top-5 left-0 bg-emerald-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                    {box.label} · {(box.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              );
            })}

            {!isRunning && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60">
                <p className="text-slate-300 text-sm">Camera is off</p>
              </div>
            )}
          </div>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <div className="mt-4 flex gap-3">
            <button
              onClick={start}
              disabled={isRunning}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all"
            >
              Start Scanning
            </button>
            <button
              onClick={stop}
              disabled={!isRunning}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 text-sm font-semibold rounded-xl transition-all"
            >
              Stop
            </button>
          </div>
        </div>

        {/* Bill panel — 30% width, PDF-style list */}
        <div className="lg:w-[30%]">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm sticky top-6">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700">Order Summary</h2>
              <p className="text-xs text-slate-400 mt-0.5">{trolleyItems.length} item(s) detected</p>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {trolleyItems.length === 0 ? (
                <p className="px-5 py-8 text-sm text-slate-400 text-center">No items yet</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-400 uppercase tracking-wide">
                      <th className="text-left font-medium px-5 py-2">S.No</th>
                      <th className="text-left font-medium px-2 py-2">Product</th>
                      <th className="text-right font-medium px-5 py-2">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      trolleyItems.reduce((acc, item) => {
                        acc[item.label] = (acc[item.label] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([label, qty], i) => (
                      <tr key={label} className="border-t border-slate-50">
                        <td className="px-5 py-2.5 text-slate-400">{i + 1}</td>
                        <td className="px-2 py-2.5 text-slate-700 font-medium">{label}</td>
                        <td className="px-5 py-2.5 text-right text-slate-600">{qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-5 border-t border-slate-100">
              {checkoutError && (
                <p className="text-xs text-red-500 mb-3">{checkoutError}</p>
              )}
              <button
                onClick={handleCheckout}
                disabled={trolleyItems.length === 0 || isCheckingOut}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl transition-all"
              >
                {isCheckingOut ? "Processing…" : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        </div>

      </div>

      {checkoutStatus === "success" && (
        <ReceiptModal receipt={receipt} onClose={resetPayment} />
      )}
    </div>
  );
};

export default CameraView;