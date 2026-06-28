// features/shop/pages/ReceiptModal.jsx

import { useState } from "react";
import axios from "axios";

const ReceiptModal = ({ receipt, onClose }) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState(null);

  if (!receipt) return null;

  const handleViewReceipt = () => {
    const byteChars = atob(receipt.pdfBase64);
    const byteNums  = Array.from(byteChars).map((c) => c.charCodeAt(0));
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
    <div className="fixed inset-0 bg-slate-950/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">

        {/* Cross icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-5 mt-2">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Payment Successful</h2>
          <p className="text-sm text-slate-400 mt-1">Receipt ready</p>
        </div>

        {/* Bill table — S.NO | Item | Qty | Amount */}
        <div className="bg-slate-50 rounded-xl mb-4 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wide">
                <th className="text-left font-medium px-3 py-2 w-8">S.No</th>
                <th className="text-left font-medium px-2 py-2">Item</th>
                <th className="text-center font-medium px-2 py-2 w-10">Qty</th>
                <th className="text-right font-medium px-3 py-2 w-16">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((line) => (
                <>
                  <tr key={line.sn} className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-400">{line.sn}</td>
                    <td className="px-2 py-2 text-slate-700 font-medium">{line.item}</td>
                    <td className="px-2 py-2 text-center text-slate-600">{line.quantity}</td>
                    <td className="px-3 py-2 text-right text-slate-700">₹{line.subtotal}</td>
                  </tr>
                  <tr key={`${line.sn}-gst`} className="bg-slate-50/50">
                    <td />
                    <td className="px-2 pb-2 text-slate-400 text-[10px]" colSpan={2}>
                      GST @{(line.gstRate * 100).toFixed(0)}%
                    </td>
                    <td className="px-3 pb-2 text-right text-slate-400 text-[10px]">
                      +₹{line.gstAmount}
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>

          {/* Subtotal + GST + Total */}
          <div className="border-t border-slate-200 px-3 py-2 space-y-1">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Subtotal</span>
              <span>₹{subtotalAmount}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Total GST</span>
              <span>₹{totalGST}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
              <span>Total</span>
              <span className="text-emerald-600">₹{totalAmount}</span>
            </div>
          </div>
        </div>

        {sendError && (
          <p className="text-xs text-red-500 text-center mb-3">{sendError}</p>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSendReceipt}
            disabled={sending || sent}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all"
          >
            {sending ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Sending…
              </>
            ) : sent ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Sent!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Receipt
              </>
            )}
          </button>
          <button
            onClick={handleViewReceipt}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Receipt
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Smart Trolly 2.0 · AI-Powered Checkout
        </p>
      </div>
    </div>
  );
};

export default ReceiptModal;