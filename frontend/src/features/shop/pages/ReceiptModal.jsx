// features/shop/pages/ReceiptModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { CheckCircle2, X, Send, Eye, FileText, Loader2, Sparkles } from "lucide-react";

const ReceiptModal = ({ receipt, onClose }) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState(null);

  if (!receipt) return null;

  const handleViewReceipt = () => {
    const byteChars = atob(receipt.pdfBase64);
    const byteNums = Array.from(byteChars).map((c) => c.charCodeAt(0));
    const blob = new Blob([new Uint8Array(byteNums)], { type: "application/pdf" });
    window.open(URL.createObjectURL(blob), "_blank");
  };

  const handleSendReceipt = async () => {
    setSending(true);
    setSendError(null);
    try {
      await axios.post("/api/payment/resend-receipt", {}, { withCredentials: true });
      setSent(true);
    } catch (err) {
      setSendError(
        err.response?.data?.message || "Failed to send email. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const { lineItems, subtotalAmount, totalGST, totalAmount } = receipt.bill;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6 mt-1">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3.5 shadow-lg shadow-emerald-950/30">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-mono font-medium mb-1">
            <Sparkles className="w-3 h-3" />
            Payment Verified
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Checkout Completed</h2>
          <p className="text-xs text-slate-400 mt-0.5">Your official tax invoice is ready</p>
        </div>

        {/* Thermal Bill Container */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800/80 p-4 mb-5 shadow-inner">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-[11px] font-mono text-slate-400 uppercase">
            <span>Item Breakdown</span>
            <span>Qty · Price</span>
          </div>

          <div className="divide-y divide-slate-800/40 max-h-48 overflow-y-auto my-2 pr-1">
            {lineItems.map((line) => (
              <div key={line.sn} className="py-2 flex items-center justify-between text-xs">
                <div>
                  <div className="font-medium text-slate-200">{line.item}</div>
                  <div className="text-[10px] text-slate-500">
                    GST {(line.gstRate * 100).toFixed(0)}% (+₹{line.gstAmount})
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-slate-400 text-[11px] mr-2">×{line.quantity}</span>
                  <span className="text-slate-100 font-semibold">₹{line.total}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal, GST, Total */}
          <div className="border-t border-slate-800/80 pt-3 space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="font-mono">₹{subtotalAmount}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Total GST</span>
              <span className="font-mono text-emerald-400">+ ₹{totalGST}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-slate-800/80">
              <span>Total Amount Paid</span>
              <span className="font-mono text-emerald-400 text-base">₹{totalAmount}</span>
            </div>
          </div>
        </div>

        {sendError && (
          <p className="text-xs text-rose-400 text-center mb-3 font-mono">{sendError}</p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleSendReceipt}
            disabled={sending || sent}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            {sending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Sending Receipt...
              </>
            ) : sent ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sent to Email!
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Email Receipt
              </>
            )}
          </button>

          <button
            onClick={handleViewReceipt}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all border border-slate-700"
          >
            <Eye className="w-3.5 h-3.5" />
            View PDF
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors"
          >
            Done and Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;