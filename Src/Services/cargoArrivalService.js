import { Op } from "sequelize";
import { Parser as Json2CsvParser } from "json2csv";
import PDFDocument from "pdfkit";
import fs from "fs";

export default (models) => {
  const { CargoArrival, CargoTally, User } = models;

  const buildWhere = (filters) => {
    const { client, status, createdBy, from, to } = filters;
    const where = {};

    if (client) where.clientName = { [Op.iLike]: `%${client}%` };
    if (status) where.status = status;
    if (createdBy) where.createdBy = createdBy;
    if (from && to)
      where.createdAt = { [Op.between]: [new Date(from), new Date(to)] };

    return where;
  };

  return {
    async listAll(filters) {
      const { page = 1, limit = 20 } = filters;
      const where = buildWhere(filters);

      const offset = (page - 1) * limit;

      const { rows, count } = await CargoArrival.findAndCountAll({
        where,
        include: [
          "tallies",
          { model: User, as: "creator", attributes: ["id", "username"] },
        ],
        order: [["createdAt", "DESC"]],
        offset,
        limit,
      });

      return {
        data: rows,
        total: count,
        page,
        pages: Math.ceil(count / limit),
      };
    },

    async exportCSV(filters) {
      const where = buildWhere(filters);

      const arrivals = await CargoArrival.findAll({
        where,
        include: [
          "tallies",
          { model: User, as: "creator", attributes: ["id", "username"] },
        ],
        order: [["createdAt", "DESC"]],
      });

      const data = arrivals.map((a) => ({
        ArrivalNumber: a.arrivalNumber,
        Type: a.type,
        Collection: a.collectionType,
        Client: a.clientName,
        Source: a.source,
        Destination: a.destination,
        Status: a.status,
        CreatedBy: a.creator?.username || "N/A",
        CreatedAt: a.createdAt,
      }));

      const parser = new Json2CsvParser({ fields: Object.keys(data[0] || {}) });
      return parser.parse(data);
    },

    async exportPDF(filters) {
      const where = buildWhere(filters);

      const arrivals = await CargoArrival.findAll({
        where,
        include: [
          "tallies",
          { model: User, as: "creator", attributes: ["id", "username"] },
        ],
        order: [["createdAt", "DESC"]],
      });

      const doc = new PDFDocument();
      const filePath = `./reports/cargo-arrival-report-${Date.now()}.pdf`;
      doc.pipe(fs.createWriteStream(filePath));

      doc
        .fontSize(18)
        .text("Cargo Arrival Report", { align: "center" })
        .moveDown();

      arrivals.forEach((a) => {
        doc.fontSize(12).text(`Arrival Number: ${a.arrivalNumber}`);
        doc.text(
          `Client: ${a.clientName} | Type: ${a.type} | Status: ${a.status}`
        );
        doc.text(`Source: ${a.source} → Destination: ${a.destination}`);
        doc.text(
          `Created By: ${a.creator?.username || "N/A"} | Date: ${a.createdAt}`
        );
        doc.moveDown();

        if (a.tallies?.length) {
          doc.text("Tally Information:", { underline: true });
          a.tallies.forEach((t) => {
            doc.text(
              ` - ${t.cargoDescription}, Qty: ${t.quantity}, Type: ${t.cargoType}, Weight/item: ${t.weightPerItem}`
            );
          });
        }
        doc.moveDown();
      });

      doc.end();
      return filePath;
    },
  };
};
