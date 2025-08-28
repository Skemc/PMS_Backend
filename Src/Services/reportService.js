import fs from "fs";
import path from "path";
import { generatePDF } from "../Utils/pfdGenerator.js";
import { generateCSV } from "../Utils/csvGenerator.js";
import sendEmail from "../Utils/emailServices.js";
import { Op } from "sequelize";
import models from "../Models/index.js";

class ReportService {
  static async generateReport({ startDate, endDate, filters }) {
    const {
      TruckReceipt,
      VesselReceipt,
      CargoReceipt,
      StorageReceipt,
      FacilityReceipt,
    } = models;
    const filter = { paymentDate: { [Op.between]: [startDate, endDate] } };

    if (filters?.status) filter.status = filters.status;
    if (filters?.clientName)
      filter.clientName = { [Op.iLike]: `%${filters.clientName}%` };

    const entityTypes = filters?.entityType
      ? filters.entityType.split(",")
      : ["truck", "vessel", "cargo", "storage", "facility"];
    const receiptsData = {};

    if (entityTypes.includes("truck"))
      receiptsData.trucks = await TruckReceipt.findAll({ where: filter });
    if (entityTypes.includes("vessel"))
      receiptsData.vessels = await VesselReceipt.findAll({ where: filter });
    if (entityTypes.includes("cargo"))
      receiptsData.cargo = await CargoReceipt.findAll({ where: filter });
    if (entityTypes.includes("storage"))
      receiptsData.storage = await StorageReceipt.findAll({ where: filter });
    if (entityTypes.includes("facility"))
      receiptsData.facility = await FacilityReceipt.findAll({ where: filter });

    const summary = {
      truckTotal: (receiptsData.trucks || []).reduce(
        (s, r) => s + r.amountPaid,
        0
      ),
      vesselTotal: (receiptsData.vessels || []).reduce(
        (s, r) => s + r.amountPaid,
        0
      ),
      cargoTotal: (receiptsData.cargo || []).reduce(
        (s, r) => s + r.amountPaid,
        0
      ),
      storageTotal: (receiptsData.storage || []).reduce(
        (s, r) => s + r.amountPaid,
        0
      ),
      facilityTotal: (receiptsData.facility || []).reduce(
        (s, r) => s + r.amountPaid,
        0
      ),
    };
    summary.grandTotal = Object.values(summary).reduce((a, b) => a + b, 0);

    return {
      type: "custom",
      startDate,
      endDate,
      summary,
      details: receiptsData,
    };
  }

  static async generateAndSaveReport(type) {
    const today = new Date();
    let startDate, endDate;

    switch (type) {
      case "daily":
        startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 1
        );
        endDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 1,
          23,
          59,
          59
        );
        break;
      case "weekly":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = today;
        break;
      case "monthly":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "yearly":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date(today);
        endDate = today;
    }

    await this.generateAndSaveReportCustom({ type, startDate, endDate });
  }

  static async generateAndSaveReportCustom({
    type,
    startDate,
    endDate,
    filters,
  }) {
    const report = await this.generateReport({ startDate, endDate, filters });

    const folderPath = path.join(process.cwd(), "reports", type);
    if (!fs.existsSync(folderPath))
      fs.mkdirSync(folderPath, { recursive: true });

    const pdfFileName = `${type}_report_${startDate.toISOString().split("T")[0]}_to_${endDate.toISOString().split("T")[0]}.pdf`;
    const pdfPath = path.join(folderPath, pdfFileName);
    fs.writeFileSync(pdfPath, await generatePDF(report));

    const csvFileName = `${type}_report_${startDate.toISOString().split("T")[0]}_to_${endDate.toISOString().split("T")[0]}.csv`;
    const csvPath = path.join(folderPath, csvFileName);
    generateCSV(report.details, csvPath);

    console.log(`✅ ${type.toUpperCase()} report saved: PDF & CSV`);

    await sendEmail({
      to: "finance@domain.com",
      subject: `${type.toUpperCase()} Custom Financial Report`,
      text: `Hello Finance Team,\n\nPlease find attached the ${type} financial report for period ${startDate.toDateString()} → ${endDate.toDateString()}.\n\nRegards,\nPMS System`,
      attachments: [
        { filename: pdfFileName, path: pdfPath },
        { filename: csvFileName, path: csvPath },
      ],
    });
  }
}

export default ReportService;
