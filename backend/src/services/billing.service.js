// services/billing.service.js
// Pure function — no DB, no HTTP.
// Single source of truth for pricing, GST rates, and display name formatting.

import { MODEL_CONFIG } from "../config/detection.config.js";

const { CLASS_PRICES } = MODEL_CONFIG;

// Real Indian GST rates for each product category (FMCG)
const GST_RATES = {
  parle_g:    0.18, // biscuits — 18%
  good_day:   0.18, // biscuits — 18%
  colgate:    0.18, // toothpaste — 18%
  dairy_milk: 0.18, // chocolate — 18%
  parachute:  0.05, // coconut oil — 5%
};

/**
 * Formats internal label to display name.
 * "parle_g" → "Parle G", "good_day" → "Good Day"
 */
export function formatLabel(label) {
  return label
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * @typedef {Object} BillLineItem
 * @property {number} sn
 * @property {string} item         - formatted display name e.g. "Parle G"
 * @property {string} rawLabel     - original label e.g. "parle_g"
 * @property {number} quantity
 * @property {number} unitPrice
 * @property {number} subtotal     - unitPrice * quantity (before GST)
 * @property {number} gstRate      - e.g. 0.18
 * @property {number} gstAmount    - GST on this line item
 * @property {number} total        - subtotal + gstAmount
 */

/**
 * @param {string[]} trolleyLabels - flat array e.g. ["colgate", "colgate", "parle_g"]
 * @returns {{
 *   lineItems: BillLineItem[],
 *   subtotalAmount: number,
 *   totalGST: number,
 *   totalAmount: number,
 *   currency: string
 * }}
 */
export function generateBill(trolleyLabels) {
  if (!Array.isArray(trolleyLabels) || trolleyLabels.length === 0) {
    throw new Error("Trolley is empty — cannot generate a bill");
  }

  // Count occurrences per label
  const counts = {};
  for (const label of trolleyLabels) {
    if (!(label in CLASS_PRICES)) {
      throw new Error(`Unknown product: "${label}"`);
    }
    counts[label] = (counts[label] || 0) + 1;
  }

  let subtotalAmount = 0;
  let totalGST = 0;

  const lineItems = Object.entries(counts).map(([label, quantity], i) => {
    const unitPrice = CLASS_PRICES[label];
    const subtotal  = unitPrice * quantity;
    const gstRate   = GST_RATES[label] ?? 0.18;
    const gstAmount = parseFloat((subtotal * gstRate).toFixed(2));
    const total     = parseFloat((subtotal + gstAmount).toFixed(2));

    subtotalAmount += subtotal;
    totalGST       += gstAmount;

    return {
      sn: i + 1,
      item: formatLabel(label),
      rawLabel: label,
      quantity,
      unitPrice,
      subtotal,
      gstRate,
      gstAmount,
      total,
    };
  });

  const totalAmount = parseFloat((subtotalAmount + totalGST).toFixed(2));

  return {
    lineItems,
    subtotalAmount: parseFloat(subtotalAmount.toFixed(2)),
    totalGST: parseFloat(totalGST.toFixed(2)),
    totalAmount,
    currency: "INR",
  };
}