// services/pdf.service.js
// Thermal receipt style with GST breakup.

import PDFDocument from "pdfkit";

export function generateBillPDF(bill, customer) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: [226, 700],
      margin: 16,
      autoFirstPage: true,
    });

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end",  () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const now    = new Date();
    const dateStr = now.toLocaleDateString("en-IN");
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    const dashedLine = () => {
      doc
        .moveTo(16, doc.y)
        .lineTo(210, doc.y)
        .dash(2, { space: 3 })
        .strokeColor("#555")
        .stroke()
        .undash()
        .moveDown(0.4);
    };

    // ── Header ────────────────────────────────────────────────────────────
    doc
      .fontSize(11).font("Helvetica-Bold")
      .text("RECEIPT OF SALE", { align: "center" })
      .fontSize(13)
      .text("SMART TROLLY 2.0", { align: "center" })
      .fontSize(7).font("Helvetica").moveDown(0.3)
      .text("AI-Powered Automated Checkout", { align: "center" })
      .moveDown(0.5);

    dashedLine();

    // ── Meta ──────────────────────────────────────────────────────────────
    doc
      .fontSize(7.5).font("Helvetica")
      .text(`${dateStr}   ${timeStr}`, { align: "center" })
      .moveDown(0.3);

    if (customer?.username || customer?.email) {
      doc.text(`Customer: ${customer.username || customer.email}`, { align: "center" });
    }

    doc.moveDown(0.4);
    dashedLine();

    // ── Column headers — S.NO | Item | Qty | Amount ───────────────────────
    const col = { sno: 16, item: 40, qty: 140, amt: 178 };

    const headerY = doc.y;
    doc
      .fontSize(7.5).font("Helvetica-Bold")
      .text("S.NO", col.sno, headerY, { width: 22 })
      .text("ITEM",   col.item, headerY, { width: 95 })
      .text("QTY",    col.qty,  headerY, { width: 30, align: "center" })
      .text("AMOUNT", col.amt,  headerY, { width: 32, align: "right" });

    doc.moveDown(0.3);
    dashedLine();

    // ── Line items ────────────────────────────────────────────────────────
    doc.font("Helvetica").fontSize(7.5);

    for (const line of bill.lineItems) {
      const rowY = doc.y;
      doc
        .text(String(line.sn),         col.sno,  rowY, { width: 22 })
        .text(line.item,               col.item,  rowY, { width: 95 })
        .text(String(line.quantity),   col.qty,   rowY, { width: 30, align: "center" })
        .text(`Rs.${line.subtotal}`,   col.amt,   rowY, { width: 32, align: "right" });
      doc.moveDown(0.35);

      // GST sub-line per item
      const gstY = doc.y;
      doc
        .fontSize(6.5).fillColor("#666")
        .text(`  GST @${(line.gstRate * 100).toFixed(0)}%`,  col.item, gstY, { width: 95 })
        .text(`Rs.${line.gstAmount}`, col.amt, gstY, { width: 32, align: "right" });
      doc.fillColor("#000").fontSize(7.5).moveDown(0.4);
    }

    doc.moveDown(0.2);
    dashedLine();

    // ── Subtotal, GST total, Grand total ──────────────────────────────────
    const subY = doc.y;
    doc
      .font("Helvetica").fontSize(7.5)
      .text("Subtotal",          col.item, subY, { width: 95 })
      .text(`Rs.${bill.subtotalAmount}`, col.amt,  subY, { width: 32, align: "right" });

    doc.moveDown(0.4);
    const gstTotalY = doc.y;
    doc
      .text("Total GST",         col.item, gstTotalY, { width: 95 })
      .text(`Rs.${bill.totalGST}`, col.amt, gstTotalY, { width: 32, align: "right" });

    doc.moveDown(0.4);
    dashedLine();

    const totalY = doc.y;
    doc
      .font("Helvetica-Bold").fontSize(9)
      .text("TOTAL",             col.item, totalY, { width: 95 })
      .text(`Rs.${bill.totalAmount}`, col.amt - 10, totalY, { width: 42, align: "right" });

    doc.moveDown(1.2);
    dashedLine();

    // ── Footer ────────────────────────────────────────────────────────────
    // Reset x to left margin before footer so centering works correctly
    doc.x = 30;
    doc
      .fontSize(8).font("Helvetica-Bold")
      .text("THANK YOU!", 16, doc.y, { width: 194, align: "center" })
      .moveDown(0.5)
      .fontSize(6.5).font("Helvetica").fillColor("#888")
      .text("Smart Trolly 2.0 · AI-Powered Checkout", 16, doc.y, { width: 194, align: "center" });

    doc.end();
  });
}