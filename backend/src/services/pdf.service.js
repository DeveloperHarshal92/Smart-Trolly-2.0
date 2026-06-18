// services/pdf.service.js
// Generates a bill PDF using PDFKit — chosen over Puppeteer because this is
// a simple structured table, and PDFKit avoids the ~200MB Chromium dependency.
// Returns a Buffer so callers can either save it, email it, or stream it
// directly to the client without touching the filesystem.

import PDFDocument from "pdfkit";

/**
 * @param {Object} bill - output of billing.service.js generateBill()
 * @param {Object} customer - { username, email }
 * @returns {Promise<Buffer>}
 */
export function generateBillPDF(bill, customer) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // ── Header ─────────────────────────────────────────────────────────────
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Smart Trolly 2.0", { align: "center" })
      .fontSize(10)
      .font("Helvetica")
      .text("Automated Checkout Receipt", { align: "center" })
      .moveDown(1.5);

    // ── Customer + order meta ─────────────────────────────────────────────
    const now = new Date();
    doc
      .fontSize(10)
      .text(`Customer: ${customer.username || "Guest"}`)
      .text(`Email: ${customer.email || "-"}`)
      .text(`Date: ${now.toLocaleDateString()}  ${now.toLocaleTimeString()}`)
      .moveDown(1);

    // ── Table header ───────────────────────────────────────────────────────
    const tableTop = doc.y;
    const colX = { sn: 50, item: 90, qty: 300, price: 380, total: 470 };

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("SN",    colX.sn,    tableTop)
      .text("Item",  colX.item,  tableTop)
      .text("Qty",   colX.qty,   tableTop)
      .text("Price", colX.price, tableTop)
      .text("Total", colX.total, tableTop);

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(545, tableTop + 15)
      .strokeColor("#cccccc")
      .stroke();

    // ── Table rows ─────────────────────────────────────────────────────────
    let rowY = tableTop + 25;
    doc.font("Helvetica").fontSize(10);

    for (const line of bill.lineItems) {
      doc
        .text(String(line.sn),                colX.sn,    rowY)
        .text(line.item,                       colX.item,  rowY)
        .text(String(line.quantity),            colX.qty,   rowY)
        .text(`Rs. ${line.unitPrice}`,           colX.price, rowY)
        .text(`Rs. ${line.total}`,               colX.total, rowY);
      rowY += 22;
    }

    // ── Total ──────────────────────────────────────────────────────────────
    doc
      .moveTo(50, rowY + 5)
      .lineTo(545, rowY + 5)
      .strokeColor("#cccccc")
      .stroke();

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(`Grand Total: Rs. ${bill.totalAmount}`, colX.price, rowY + 20, {
        align: "left",
      });

    doc
      .moveDown(3)
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#888888")
      .text("Thank you for shopping with Smart Trolly 2.0", { align: "center" });

    doc.end();
  });
}