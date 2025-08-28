import cron from "node-cron";
import ReportService from "../services/reportService.js";

// Daily at midnight
cron.schedule(
  "0 0 * * *",
  async () => await ReportService.generateAndSaveReport("daily")
);

// Weekly on Sunday midnight
cron.schedule(
  "0 0 * * 0",
  async () => await ReportService.generateAndSaveReport("weekly")
);

// Monthly on 1st midnight
cron.schedule(
  "0 0 1 * *",
  async () => await ReportService.generateAndSaveReport("monthly")
);

// Yearly on Jan 1st midnight
cron.schedule(
  "0 0 1 1 *",
  async () => await ReportService.generateAndSaveReport("yearly")
);
