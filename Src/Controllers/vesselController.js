import initVesselService from "../Services/vesselService.js";
import models from "../Models/index.js";

const vesselService = initVesselService(models);

const VesselController = {
  async register(req, res) {
    try {
      const vessel = await vesselService.registerVessel(req.body);
      res.status(201).json(vessel);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async berth(req, res) {
    try {
      const { vesselId } = req.params;
      const berthing = await vesselService.berthVessel(vesselId, req.body);
      res.status(201).json(berthing);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async list(req, res) {
    try {
      const vessels = await vesselService.listVessels(req.query);
      res.json(vessels);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const vessel = await vesselService.getVesselById(req.params.id);
      if (!vessel) return res.status(404).json({ error: "Vessel not found" });
      res.json(vessel);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default VesselController;
