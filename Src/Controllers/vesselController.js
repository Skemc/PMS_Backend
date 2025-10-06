import { onServerError, onError, onSuccess } from "../Utils/response.js";
import models from "../Models/index.js";

const { Vessel, VesselBerthing } = models;

//const vesselService = initVesselService(models);

class VesselController {
  static async registerVessel(req, res) {
    try {
      const vessel = await Vessel.create({
        name: req.body.name,
        plateNumber: req.body.plateNumber,
        owner: req.body.owner,
        certificate: req.body.certificate,
        capacity: req.body.capacity,
        ownerNumber: req.body.ownerNumber,
        length: req.body.length,
        width: req.body.width,
        height: req.body.height,
        arrivalDate: req.body.arrivalDate,
        departureDate: req.body.departureDate,
        status: req.body.status,
      });

      return onSuccess(res, 201, " 🚢 Vessel created successfully", { vessel });
    } catch (err) {
      console.error(err);
      return onServerError(res, err);
    }
  }

  static async bookVessel(req, res) {
    try {
      const vesselId = req.params.id;

      // Only vessels not already berthed can be booked
      const vessel = await Vessel.findOne({ where: { vessel_id: vesselId } });
      if (!vessel) {
        return res.status(404).json({ error: "Vessel not found" });
      }

      if (vessel.status === "berthed") {
        return res.status(400).json({ error: "Vessel already berthed" });
      }

      await Vessel.update(
        { status: "booked" },
        { where: { vessel_id: vesselId } }
      );

      return onSuccess(res, 200, "✅ Vessel booked successfully", { vesselId });
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async berthVessel(req, res) {
    try {
      const vesselId = req.params.id;

      const vessel = await Vessel.findOne({ where: { vessel_id: vesselId } });
      if (!vessel) {
        return res.status(404).json({ error: "Vessel not found" });
      }

      if (vessel.status !== "booked") {
        return res
          .status(400)
          .json({ error: "Vessel must be booked before berthing" });
      }

      const berthing = await VesselBerthing.create({
        vesselId,
        ...req.body, // includes ATA, ETD, berthingSide, vesselDraft, cargo, observation
      });

      await Vessel.update(
        { status: "berthed" },
        { where: { vessel_id: vesselId } }
      );

      return onSuccess(res, 201, "🚢 Vessel berthed successfully", {
        berthing,
      });
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async getAllVessels(req, res) {
    try {
      const vessels = await Vessel.findAll();
      return onSuccess(res, 200, " 🚢 Vessels retrieved successfully", {
        vessels,
      });
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async getAllBerthedVessels(req, res) {
    try {
      const vessels = await Vessel.findAll({
        where: { status: "berthed" },
        include: [
          {
            model: VesselBerthing,
            as: "berthingDetails",
          },
        ],
        order: [["updatedAt", "DESC"]],
      });

      return onSuccess(
        res,
        200,
        "🚢 All berthed vessels fetched successfully",
        vessels
      );
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async getVesselById(req, res) {
    try {
      const vessel = await Vessel.findOne({
        where: { vessel_id: req.params.id },
      });
      if (!vessel) return onError(res, 404, "Vessel not found");
      return onSuccess(res, 200, " 🚢 Vessel retrieved successfully", {
        vessel,
      });
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async getBerthedVesselById(req, res) {
    try {
      const vesselId = req.params.id;

      const vessel = await Vessel.findOne({
        where: { vessel_id: vesselId, status: "berthed" },
        include: [
          {
            model: VesselBerthing,
            as: "berthingDetails",
          },
        ],
      });

      if (!vessel) {
        return res
          .status(404)
          .json({ error: "No berthed vessel found with this ID" });
      }

      return onSuccess(
        res,
        200,
        "✅ Berthed vessel details fetched successfully",
        vessel
      );
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async unberthVessel(req, res) {
    try {
      const vesselId = req.params.id;

      const vessel = await Vessel.findOne({ where: { vessel_id: vesselId } });
      if (!vessel) {
        return res.status(404).json({ error: "Vessel not found" });
      }

      if (vessel.status !== "berthed") {
        return res
          .status(400)
          .json({ error: "Only berthed vessels can be unberthed" });
      }

      // Mark vessel as unberthed
      await Vessel.update(
        { status: "unberthed" },
        { where: { vessel_id: vesselId } }
      );

      return onSuccess(res, 200, "⛴️ Vessel unberthed successfully", {
        vesselId,
      });
    } catch (err) {
      return onServerError(res, err);
    }
  }
}

export default VesselController;
