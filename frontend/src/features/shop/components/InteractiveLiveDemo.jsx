import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  Receipt,
  Trash2,
  Cpu,
} from "lucide-react";

const CATALOG = [
  {
    id: "parle_g",
    name: "Parle G",
    category: "Biscuits",
    price: 10,
    gstRate: 0.18,
    badgeColor: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  },
  {
    id: "good_day",
    name: "Good Day",
    category: "Biscuits",
    price: 10,
    gstRate: 0.18,
    badgeColor: "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10",
  },
  {
    id: "colgate",
    name: "Colgate",
    category: "Oral Care",
    price: 20,
    gstRate: 0.18,
    badgeColor: "border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/10",
  },
  {
    id: "dairy_milk",
    name: "Dairy Milk",
    category: "Chocolate",
    price: 5,
    gstRate: 0.18,
    badgeColor: "border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10",
  },
  {
    id: "parachute",
    name: "Parachute",
    category: "Hair Oil",
    price: 15,
    gstRate: 0.05,
    badgeColor: "border-teal-500/30 text-teal-600 dark:text-teal-400 bg-teal-500/10",
  },
];

export default function InteractiveLiveDemo() {
  const [trolley, setTrolley] = useState([
    { id: "colgate", qty: 1 },
    { id: "dairy_milk", qty: 2 },
  ]);

  const addItem = (id) => {
    setTrolley((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id, qty: 1 }];
    });
  };

  const removeItem = (id) => {
    setTrolley((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing && existing.qty > 1) {
        return prev.map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        );
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearCart = () => setTrolley([]);

  // Compute bill
  let subtotal = 0;
  let totalGst = 0;

  const lineItems = trolley.map((tItem, index) => {
    const product = CATALOG.find((c) => c.id === tItem.id);
    const itemSub = product.price * tItem.qty;
    const itemGst = itemSub * product.gstRate;
    subtotal += itemSub;
    totalGst += itemGst;

    return {
      sn: index + 1,
      ...product,
      qty: tItem.qty,
      itemSub,
      itemGst,
      total: itemSub + itemGst,
    };
  });

  const grandTotal = subtotal + totalGst;

  return (
    <div className="w-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-colors duration-200">
      {/* Background glow accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Cpu className="w-3.5 h-3.5" />
              Interactive Simulation
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Experience the Real-Time Billing Engine
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Add sample items to simulate live camera object detection and see instant tax computation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              Inference: 142ms
            </span>
            {trolley.length > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Product Shelf */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Simulated Retail Items (Tap to Detect)</span>
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">5 Trained Classes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATALOG.map((item) => {
                const inCart = trolley.find((t) => t.id === item.id);
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addItem(item.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      inCart
                        ? "bg-emerald-50/80 dark:bg-slate-800/90 border-emerald-500/50 shadow-md shadow-emerald-500/10"
                        : "bg-slate-50/80 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                        {item.category}
                      </span>
                      <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        GST {(item.gstRate * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h4>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400">₹{item.price}.00</p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {inCart && (
                          <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                            {inCart.qty}
                          </span>
                        )}
                        <button
                          type="button"
                          className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: Live Cart & Thermal Breakdown */}
          <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-950/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 flex flex-col justify-between min-h-[380px] shadow-sm">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Live Tax Breakdown</span>
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {trolley.reduce((acc, i) => acc + i.qty, 0)} items in cart
                </span>
              </div>

              {trolley.length === 0 ? (
                <div className="py-16 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center">
                  <ShoppingCart className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
                  <p className="text-sm font-medium">Cart is empty</p>
                  <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">Tap items on the left to simulate optical scan</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  <AnimatePresence>
                    {lineItems.map((line) => (
                      <motion.div
                        key={line.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/60 text-xs shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 text-slate-400 dark:text-slate-500 font-mono">{line.sn}</span>
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{line.name}</span>
                            <span className="text-[11px] text-slate-500 ml-2">
                              @ ₹{line.price} + {(line.gstRate * 100).toFixed(0)}% GST
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-0.5">
                            <button
                              onClick={() => removeItem(line.id)}
                              className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                              {line.qty}
                            </span>
                            <button
                              onClick={() => addItem(line.id)}
                              className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-mono font-semibold text-slate-900 dark:text-white w-14 text-right">
                            ₹{line.total.toFixed(2)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Calculations Summary */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Subtotal (Excl. Tax)</span>
                <span className="font-mono text-slate-800 dark:text-slate-300">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Total GST</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">+ ₹{totalGst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200 dark:border-slate-800/80">
                <span className="font-bold text-slate-900 dark:text-white">Estimated Grand Total</span>
                <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
