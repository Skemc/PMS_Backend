import express from "express";
import auth from "../Middlewares/authMiddleware.js";
import validators from "../Validators/index.js";
import TruckController from "../Controllers/truckController.js";
import BoatController from "../Controllers/boatController.js";
import VesselController from "../Controllers/vesselController.js";
import CargoArrivalController from "../Controllers/cargoArrivalController.js";
import CargoStorageController from "../Controllers/cargoStorageController.js";
import GeneralController from "../Controllers/generalController.js";
import InvoiceController from "../Controllers/invoiceController.js";
import TariffController from "../Controllers/tariffController.js";
import ReceiptController from "../Controllers/receiptController.js";
import FacilityController from "../Controllers/facilityController.js";
import DashboardController from "../Controllers/dashboardController.js";
import ReportController from "../Controllers/reportController.js";

const router = express.Router();

//Truck Routes
router.post(
  "/trucks",
  auth.verifyToken,
  validators.truckEntry,
  TruckController.createTruck
);
router.get("/trucks", auth.verifyToken, TruckController.getAllTrucks);
router.get("/trucks/:id", auth.verifyToken, TruckController.getTruckById);
router.put(
  "/trucks/:id",
  auth.verifyToken,
  validators.truckEntry,
  TruckController.updateTruck
);
router.delete("/trucks/:id", auth.verifyToken, TruckController.deleteTruck);

//Boat Routes
router.post(
  "/boats",
  auth.verifyToken,
  validators.boatEntry,
  BoatController.createBoat
);
router.get("/boats", auth.verifyToken, BoatController.getAllBoats);
router.get("/boats/:id", auth.verifyToken, BoatController.getBoatById);
router.put(
  "/boats/:id",
  auth.verifyToken,
  validators.boatEntry,
  BoatController.updateBoat
);
router.delete("/boats/:id", auth.verifyToken, BoatController.deleteBoat);

//Vessel Routes
router.post(
  "/vessels",
  auth.verifyToken,
  //validators.vesselEntry,
  VesselController.register
);
router.post(
  "/vessels/:vesselId/berth",
  auth.verifyToken,
  //validators.vesselBerthingEntry,
  VesselController.berth
);
router.get("/vessels", auth.verifyToken, VesselController.list);
router.get("/vessels/:id", auth.verifyToken, VesselController.getById);

//General Routes
router.post(
  "/auth/user/register",
  auth.verifyToken,
  validators.createUser,
  GeneralController.createUser
);
router.post("/auth/user/login", GeneralController.login);
router.post(
  "/auth/forgot-password",
  validators.emailValidator,
  GeneralController.forgotPassword
);
router.post(
  "/auth/reset-password/:email/:token",
  GeneralController.resetPassword
);

//Cargo Arrival Routes
router.post(
  "/cargo-arrivals",
  auth.verifyToken,
  // validators.cargoArrivalEntry,
  CargoArrivalController.create
);
router.get(
  "/cargo-arrivals/:number",
  auth.verifyToken,
  CargoArrivalController.getByNumber
);
router.get("/cargo-arrivals", auth.verifyToken, CargoArrivalController.list);
router.get("/export/csv", auth.verifyToken, CargoArrivalController.exportCSV);
router.get("/export/pdf", auth.verifyToken, CargoArrivalController.exportPDF);

//Cargo Storage Routes
router.post(
  "/cargo-storage",
  auth.verifyToken,
  // validators.cargoStorageEntry,
  CargoStorageController.add
);
router.post(
  "/cargo-storage/release",
  auth.verifyToken,
  CargoStorageController.release
);
router.get("/cargo-storage", auth.verifyToken, CargoStorageController.list);

//Invoice Routes
router.post(
  "/invoices",
  auth.verifyToken,
  validators.invoiceEntry,
  InvoiceController.createInvoice
);
router.get("/invoices", auth.verifyToken, InvoiceController.getAllInvoices);
router.get("/invoices/:id", auth.verifyToken, InvoiceController.getInvoiceById);
router.put(
  "/invoices/:id",
  auth.verifyToken,
  validators.invoiceEntry,
  InvoiceController.updateInvoice
);
router.patch(
  "/invoices/:id/status",
  auth.verifyToken,
  InvoiceController.updateInvoiceStatus
);
router.post("/:id/pay", auth.verifyToken, InvoiceController.payInvoice);
router.delete(
  "/invoices/:id",
  auth.verifyToken,
  InvoiceController.deleteInvoice
);

//Tariff Routes
router.get("/tariffs", auth.verifyToken, TariffController.list);
router.get("/tariffs/:id", auth.verifyToken, TariffController.getOne);
router.post(
  "/tariffs",
  auth.verifyToken,
  validators.tariffEntry,
  TariffController.create
);
router.put("/tariffs/:id", auth.verifyToken, TariffController.update);

//Receipt Routes
router.post(
  "/receipts",
  auth.verifyToken,
  //validators.receiptEntry,
  ReceiptController.createReceipt
);
router.get("/receipts", auth.verifyToken, ReceiptController.getAllReceipts);
router.get("/receipts/:id", auth.verifyToken, ReceiptController.getReceipt);
//router.put("/receipts/:id", auth.checkToken, validators.receiptEntry, ReceiptController.updateReceipt);
router.delete(
  "/receipts/:id",
  auth.verifyToken,
  ReceiptController.deleteReceipt
);

// Facility Routes
router.post(
  "/facilities",
  auth.verifyToken,
  //validators.facilityEntry,
  FacilityController.create
);
router.get("/facilities", auth.verifyToken, FacilityController.list);
router.get("/facilities/:id", auth.verifyToken, FacilityController.getById);
router.put(
  "/facilities/:id",
  auth.verifyToken,
  //validators.facilityEntry,
  FacilityController.update
);
router.delete("/facilities/:id", auth.verifyToken, FacilityController.delete);

// Dashboard Routes
router.get("/dashboard", auth.verifyToken, DashboardController.main);
router.get("/dashboard/trucks", auth.verifyToken, DashboardController.trucks);
router.get("/dashboard/vessels", auth.verifyToken, DashboardController.vessels);
router.get("/dashboard/boats", auth.verifyToken, DashboardController.boats);
router.get("/dashboard/cargo", auth.verifyToken, DashboardController.cargo);
router.get("/dashboard/storage", auth.verifyToken, DashboardController.storage);
router.get("/dashboard/users", auth.verifyToken, DashboardController.users);

// Report Routes
router.post(
  "/reports/generate",
  auth.verifyToken,
  auth.verifyRole(["admin"]),
  ReportController.generateCustomReport
);

export default router;
