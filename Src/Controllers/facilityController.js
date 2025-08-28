import initFacilityService from "../Services/facilityService.js";
import models from "../Models/index.js";

const facilityService = initFacilityService(models);

const FacilityController = {
  async create(req, res) {
    try {
      const facility = await facilityService.createFacility(req.body);
      res.status(201).json(facility);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const facility = await facilityService.updateFacility(
        req.params.id,
        req.body
      );
      res.json(facility);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await facilityService.deleteFacility(req.params.id);
      res.json({ message: "Facility deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async list(req, res) {
    try {
      const facilities = await facilityService.listFacilities(req.query);
      res.json(facilities);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const facility = await facilityService.getFacilityById(req.params.id);
      if (!facility)
        return res.status(404).json({ error: "Facility not found" });
      res.json(facility);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default FacilityController;
