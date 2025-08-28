// Controllers/dashboardController.js
import models from "../Models/index.js";
import { onError } from "../Utils/response.js";

const { Truck, Vessel, Boat, Cargo, Storage, Invoice, User } = models;

const DashboardController = {
  // (A) MAIN DASHBOARD
  async main(req, res) {
    try {
      const totalTrucksInPort = await Truck.count({
        where: { status: "IN_PORT" },
      });
      const totalVesselsDocked = await Vessel.count({
        where: { status: "DOCKED" },
      });
      const totalCargoInStorage = (await Storage.sum("current_quantity")) || 0;

      const todayRevenue =
        (await Invoice.sum("amount", {
          where: models.sequelize.where(
            models.sequelize.fn("DATE", models.sequelize.col("createdAt")),
            "=",
            new Date().toISOString().split("T")[0]
          ),
        })) || 0;

      const monthlyRevenue =
        (await Invoice.sum("amount", {
          where: models.sequelize.where(
            models.sequelize.fn("MONTH", models.sequelize.col("createdAt")),
            "=",
            new Date().getMonth() + 1
          ),
        })) || 0;

      const totalInvoicesGenerated = await Invoice.count();

      const overstayedTrucks = await Truck.count({
        where: { overstayed: true },
      });
      const overstayedVessels = await Vessel.count({
        where: { overstayed: true },
      });
      const pendingInvoices = await Invoice.count({
        where: { status: "PENDING" },
      });

      return res.json({
        totalTrucksInPort,
        totalVesselsDocked,
        totalCargoInStorage,
        totalRevenueToday: todayRevenue,
        monthlyRevenue,
        totalInvoicesGenerated,
        alerts: { overstayedTrucks, overstayedVessels, pendingInvoices },
      });
    } catch (err) {
      return onError(res, 500, err.message);
    }
  },

  // (B) TRUCK DASHBOARD
  async trucks(req, res) {
    try {
      const totalTrucksInPort = await Truck.count({
        where: { status: "IN_PORT" },
      });
      const invoiced = await Truck.count({ where: { invoiced: true } });
      const nonInvoiced = await Truck.count({ where: { invoiced: false } });
      const overstayed = await Truck.count({ where: { overstayed: true } });

      const todayRevenue =
        (await Invoice.sum("amount", {
          where: { entityType: "TRUCK" },
        })) || 0;

      const byTruckType = await Truck.findAll({
        attributes: [
          "type",
          [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"],
        ],
        group: ["type"],
      });

      return res.json({
        totalTrucksInPort,
        invoiced,
        nonInvoiced,
        overstayed,
        revenue: { today: todayRevenue },
        byTruckType,
      });
    } catch (err) {
      return onError(res, 500, err.message);
    }
  },

  // (C) VESSEL DASHBOARD
  async vessels(req, res) {
    try {
      const dockedVessels = await Vessel.count({ where: { status: "DOCKED" } });
      const departedVessels = await Vessel.count({
        where: { status: "DEPARTED" },
      });

      const berthOccupancy = {
        occupied: dockedVessels,
        total: 6, // define berth capacity in DB later
      };

      const wharfageRevenue =
        (await Invoice.sum("amount", {
          where: { entityType: "VESSEL", category: "WHARFAGE" },
        })) || 0;
      const berthingRevenue =
        (await Invoice.sum("amount", {
          where: { entityType: "VESSEL", category: "BERTHING" },
        })) || 0;

      const overstayed = await Vessel.findAll({ where: { overstayed: true } });

      return res.json({
        dockedVessels,
        departedVessels,
        berthOccupancy,
        revenue: { wharfage: wharfageRevenue, berthing: berthingRevenue },
        overstayed,
      });
    } catch (err) {
      return onError(res, 500, err.message);
    }
  },

  // (D) BOAT DASHBOARD
  async boats(req, res) {
    try {
      const boatsInPort = await Boat.count({ where: { status: "IN_PORT" } });
      const departedBoats = await Boat.count({ where: { status: "DEPARTED" } });
      const wharfageRevenue =
        (await Invoice.sum("amount", { where: { entityType: "BOAT" } })) || 0;

      return res.json({
        boatsInPort,
        departedBoats,
        revenue: { wharfage: wharfageRevenue },
      });
    } catch (err) {
      return onError(res, 500, err.message);
    }
  },

  // (E) CARGO DASHBOARD
  async cargo(req, res) {
    try {
      const cargoArrivals = await Cargo.count({ where: { status: "ARRIVED" } });
      const cargoDepartures = await Cargo.count({
        where: { status: "DEPARTED" },
      });
      const totalWeightHandled = (await Cargo.sum("weight")) || 0;

      const importRevenue =
        (await Invoice.sum("amount", {
          where: { entityType: "CARGO", category: "IMPORT" },
        })) || 0;
      const exportRevenue =
        (await Invoice.sum("amount", {
          where: { entityType: "CARGO", category: "EXPORT" },
        })) || 0;

      const cargoDistribution = await Cargo.findAll({
        attributes: [
          "type",
          [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"],
        ],
        group: ["type"],
      });

      return res.json({
        cargoArrivals,
        cargoDepartures,
        totalWeightHandled,
        importRevenue,
        exportRevenue,
        cargoDistribution,
      });
    } catch (err) {
      return onError(res, 500, err.message);
    }
  },

  // (F) STORAGE DASHBOARD
  async storage(req, res) {
    try {
      const currentOccupancy = (await Storage.sum("current_quantity")) || 0;
      const maxCapacity = 2500; // can be fetched from DB if configurable
      const gracePeriodItems = await Storage.count({
        where: { withinGracePeriod: true },
      });
      const tariffAppliedItems = await Storage.count({
        where: { withinGracePeriod: false },
      });
      const storageRevenue =
        (await Invoice.sum("amount", { where: { entityType: "STORAGE" } })) ||
        0;

      const fifoQueue = await Storage.findAll({
        attributes: ["cargoId", "arrivalDate", "status"],
        order: [["arrivalDate", "ASC"]],
      });

      return res.json({
        currentOccupancy,
        maxCapacity,
        gracePeriodItems,
        tariffAppliedItems,
        storageRevenue,
        fifoQueue,
      });
    } catch (err) {
      return onError(res, 500, err.message);
    }
  },

  // (G) USER ACTIVITY DASHBOARD
  async users(req, res) {
    try {
      const totalUsers = await User.count();
      const activeToday = await User.count({
        where: models.sequelize.where(
          models.sequelize.fn("DATE", models.sequelize.col("lastLogin")),
          "=",
          new Date().toISOString().split("T")[0]
        ),
      });

      const byRole = await User.findAll({
        attributes: [
          "role",
          [models.sequelize.fn("COUNT", models.sequelize.col("id")), "count"],
        ],
        group: ["role"],
      });

      const recentActivity = await models.ActivityLog.findAll({
        limit: 10,
        order: [["createdAt", "DESC"]],
      });

      return res.json({ totalUsers, activeToday, byRole, recentActivity });
    } catch (err) {
      return onError(res, 500, err.message);
    }
  },
};

export default DashboardController;
