import ReportService from "../Services/reportService.js";

const ReportController = {
  async generateCustomReport(req, res) {
    try {
      const { startDate, endDate, clientName, status, entityType, type } =
        req.body;
      if (!startDate || !endDate)
        return res
          .status(400)
          .json({ message: "startDate and endDate required" });

      await ReportService.generateAndSaveReportCustom({
        type: type || "custom",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        filters: { clientName, status, entityType },
      });

      res.status(200).json({ message: "Custom report generated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
};

export default ReportController;
