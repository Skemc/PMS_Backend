import models from "../Models/index.js";
import initTariffService from "../Services/tariffService.js";
import * as tariffHelpers from "../Utils/tariffs.js";
import { Op } from "sequelize";

const { Invoice, Truck, Boat, Vessel, CargoHandling, CargoStorage, Facility } =
  models;

const tariffService = initTariffService(models);

const prefixes = {
  truck: "TRK",
  vessel: "VSL",
  boat: "BOT",
  cargo: "CARGO",
  storage: "STO",
  facility: "FAC",
  overstay: "OVR",
};

async function generateInvoiceCode(entityType, opts = {}) {
  if (opts.overstay) {
    const prefix = `${prefixes.overstay}-${prefixes[entityType] || entityType.toUpperCase()}`;
    const count = await Invoice.count({
      where: { invoiceCode: { [Op.iLike]: `${prefix}-%` } },
    });
    return `${prefix}-${String(count + 1).padStart(4, "0")}`;
  } else {
    const prefix = prefixes[entityType] || "INV";
    const count = await Invoice.count({ where: { entityType } });
    return `${prefix}-${String(count + 1).padStart(4, "0")}`;
  }
}

async function resolveAmount(entityType, entityId, extra = {}) {
  switch (entityType) {
    case "truck": {
      const truck = await Truck.findByPk(entityId);
      if (!truck) throw new Error("Truck not found");
      if (!truck.entryTime || !truck.exitTime)
        throw new Error("Truck entry/exit times required");
      return tariffHelpers.calculateTruckOrBoatFee(
        truck.entryTime,
        truck.exitTime,
        tariffService,
        "truck"
      );
    }
    case "boat": {
      const boat = await Boat.findByPk(entityId);
      if (!boat) throw new Error("Boat not found");
      if (!boat.entryTime || !boat.exitTime)
        throw new Error("Boat entry/exit times required");
      return tariffHelpers.calculateTruckOrBoatFee(
        boat.entryTime,
        boat.exitTime,
        tariffService,
        "boat"
      );
    }
    case "vessel": {
      const vessel = await Vessel.findByPk(entityId);
      if (!vessel) throw new Error("Vessel not found");
      if (!vessel.entryTime || !vessel.exitTime)
        throw new Error("Vessel entry/exit times required");
      return tariffHelpers.calculateVesselFee(
        vessel.entryTime,
        vessel.exitTime,
        tariffService
      );
    }
    case "cargo": {
      const cargo = await CargoHandling.findByPk(entityId);
      if (!cargo) throw new Error("Cargo handling not found");
      return tariffHelpers.calculateCargoHandling(
        cargo.weight,
        cargo.direction,
        tariffService
      );
    }
    case "storage": {
      const storage = await CargoStorage.findByPk(entityId);
      if (!storage) throw new Error("Cargo storage not found");
      if (!storage.entryDate || !storage.exitDate)
        throw new Error("Storage entry/exit dates required");
      return tariffHelpers.calculateCargoStorage(
        storage.weight,
        storage.entryDate,
        storage.exitDate,
        tariffService
      );
    }
    case "facility": {
      const facility = await Facility.findByPk(entityId);
      const months = (extra && extra.months) || 1;
      if (facility) return facility.monthlyRate * months;
      return tariffHelpers.calculateFacilityFee(
        extra.facilityType,
        months,
        tariffService
      );
    }
    default:
      throw new Error("Unknown entity type");
  }
}

const InvoiceController = {
  // POST /invoices
  async createInvoice(req, res) {
    try {
      const { entityType, entityId, clientName, dueDate, remarks, extra } =
        req.body;

      // If the client sent these fields (because of your validator), use them; otherwise compute.
      const invoiceCode =
        req.body.invoiceCode || (await generateInvoiceCode(entityType));
      const amount =
        typeof req.body.amount === "number"
          ? req.body.amount
          : await resolveAmount(entityType, entityId, extra || {});

      const invoice = await Invoice.create({
        invoiceCode,
        entityType,
        entityId,
        clientName,
        amount,
        status: req.body.status || "unpaid",
        generatedAt: req.body.generatedAt
          ? new Date(req.body.generatedAt)
          : new Date(),
        receiptedAt: req.body.receiptedAt
          ? new Date(req.body.receiptedAt)
          : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        remarks,
      });

      res.status(201).json(invoice);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // GET /invoices
  async getAllInvoices(req, res) {
    try {
      const { status, entityType, clientName } = req.query;
      const where = {};
      if (status) where.status = status;
      if (entityType) where.entityType = entityType;
      if (clientName) where.clientName = { [Op.iLike]: `%${clientName}%` };

      const invoices = await Invoice.findAll({
        where,
        order: [["generatedAt", "DESC"]],
      });
      res.json(invoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /invoices/:id
  async getInvoiceById(req, res) {
    try {
      const invoice = await Invoice.findByPk(req.params.id);
      if (!invoice) return res.status(404).json({ error: "Invoice not found" });
      res.json(invoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /invoices/:id
  async updateInvoice(req, res) {
    try {
      const invoice = await Invoice.findByPk(req.params.id);
      if (!invoice) return res.status(404).json({ error: "Invoice not found" });

      const updatable = [
        "clientName",
        "amount",
        "entityType",
        "entityId",
        "remarks",
        "dueDate",
        "status",
        "receiptedAt",
      ];
      updatable.forEach((k) => {
        if (req.body[k] !== undefined) {
          if (k.toLowerCase().includes("date") || k.endsWith("At")) {
            invoice[k] = req.body[k] ? new Date(req.body[k]) : null;
          } else {
            invoice[k] = req.body[k];
          }
        }
      });

      await invoice.save();
      res.json(invoice);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // PATCH /invoices/:id/status
  async updateInvoiceStatus(req, res) {
    try {
      const invoice = await Invoice.findByPk(req.params.id);
      if (!invoice) return res.status(404).json({ error: "Invoice not found" });

      const { status } = req.body;
      if (!status) return res.status(400).json({ error: "Status is required" });

      invoice.status = status;
      if (status === "receipted" && !invoice.receiptedAt) {
        invoice.receiptedAt = new Date();
      }
      await invoice.save();

      res.json(invoice);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // POST /:id/pay  (creates overstay invoice if needed)
  async payInvoice(req, res) {
    try {
      const invoice = await Invoice.findByPk(req.params.id);
      if (!invoice) return res.status(404).json({ error: "Invoice not found" });
      if (invoice.status === "paid")
        return res.status(400).json({ error: "Invoice already paid" });

      let extra = 0;
      const et = invoice.entityType;
      const eid = invoice.entityId;

      if (invoice.receiptedAt) {
        if (et === "truck") {
          const truck = await Truck.findByPk(eid);
          if (truck && truck.exitTime) {
            extra = await tariffHelpers.calculateTruckOrBoatOverstay(
              invoice.receiptedAt,
              truck.exitTime,
              tariffService,
              "truck"
            );
          }
        } else if (et === "boat") {
          const boat = await Boat.findByPk(eid);
          if (boat && boat.exitTime) {
            extra = await tariffHelpers.calculateTruckOrBoatOverstay(
              invoice.receiptedAt,
              boat.exitTime,
              tariffService,
              "boat"
            );
          }
        } else if (et === "vessel") {
          const vessel = await Vessel.findByPk(eid);
          if (vessel && vessel.exitTime) {
            extra = await tariffHelpers.calculateVesselOverstay(
              invoice.receiptedAt,
              vessel.exitTime,
              tariffService
            );
          }
        }
      }

      // mark original invoice as paid
      invoice.status = "paid";
      await invoice.save();

      let overstayInvoice = null;
      if (extra > 0) {
        const ovrCode = await generateInvoiceCode(et, { overstay: true });
        overstayInvoice = await Invoice.create({
          invoiceCode: ovrCode,
          entityType: et,
          entityId: eid,
          clientName: invoice.clientName,
          amount: extra,
          status: "unpaid",
          generatedAt: new Date(),
          remarks: `Overstay for invoice ${invoice.invoiceCode}`,
        });
      }

      res.json({ paidInvoice: invoice, overstayInvoice });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /invoices/:id
  async deleteInvoice(req, res) {
    try {
      const invoice = await Invoice.findByPk(req.params.id);
      if (!invoice) return res.status(404).json({ error: "Invoice not found" });
      await invoice.destroy();
      res.json({ message: "Invoice deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // (kept for compatibility if you still call it elsewhere)
  async receipteInvoice(req, res) {
    try {
      const invoice = await Invoice.findByPk(req.params.id);
      if (!invoice) return res.status(404).json({ error: "Invoice not found" });
      if (invoice.status !== "unpaid")
        return res.status(400).json({ error: "Invoice not in unpaid state" });

      invoice.status = "receipted";
      invoice.receiptedAt = new Date();
      await invoice.save();

      res.json(invoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default InvoiceController;
