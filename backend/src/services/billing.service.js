// services/billing.service.js
// Pure function — no DB, no HTTP. Takes raw trolley items from the frontend
// and turns them into a priced bill. Single source of truth for pricing logic,
// shared by the payment flow AND the PDF generator.

import { MODEL_CONFIG } from "../config/detection.config.js";

const { CLASS_PRICES } = MODEL_CONFIG;

/**
 * @typedef {Object} BillLineItem
 * @property {number} sn
 * @property {string} item
 * @property {number} quantity
 * @property {number} unitPrice
 * @property {number} total
 */

/**
 * @param {string[]} trolleyLabels - flat array e.g. ["colgate", "colgate", "parle_g"]
 * @returns {{ lineItems: BillLineItem[], totalAmount: number, currency: string }}
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

  let totalAmount = 0;
  const lineItems = Object.entries(counts).map(([label, quantity], i) => {
    const unitPrice = CLASS_PRICES[label];
    const total = unitPrice * quantity;
    totalAmount += total;

    return {
      sn: i + 1,
      item: label,
      quantity,
      unitPrice,
      total,
    };
  });

  return {
    lineItems,
    totalAmount,
    currency: "INR",
  };
}