import PDFDocument from "pdfkit";

export function generatePDF(report) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      doc
        .fontSize(20)
        .text(`Port Income Report (${report.type.toUpperCase()})`, {
          align: "center",
        });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(
          `Period: ${report.startDate.toDateString()} → ${report.endDate.toDateString()}`
        );
      doc.moveDown();

      Object.entries(report.summary).forEach(([key, value]) => {
        doc.text(`${key.toUpperCase()}: ${value.toLocaleString()} RWF`);
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
