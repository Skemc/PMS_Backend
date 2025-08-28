import initCargoArrivalService from "../Services/cargoArrivalService.js";
import models from "../Models/index.js";

const cargoArrivalService = initCargoArrivalService(models);

const CargoArrivalController = {
  async create(req, res) {
    try {
      const userId = req.user?.id; // from auth middleware
      const arrival = await cargoArrivalService.createArrival(req.body, userId);
      res.status(201).json(arrival);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getByNumber(req, res) {
    try {
      const { number } = req.params;
      const arrival = await cargoArrivalService.getArrivalByNumber(number);
      if (!arrival)
        return res.status(404).json({ error: "Arrival notice not found" });
      res.json(arrival);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async list(req, res) {
    try {
      const { client, status, createdBy, from, to, page, limit } = req.query;
      const results = await cargoArrivalService.listAll({
        client,
        status,
        createdBy,
        from,
        to,
        page,
        limit,
      });
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async exportCSV(req, res) {
    try {
      const csv = await cargoArrivalService.exportCSV(req.query);
      res.header("Content-Type", "text/csv");
      res.attachment("cargo-arrivals.csv");
      return res.send(csv);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async exportPDF(req, res) {
    try {
      const filePath = await cargoArrivalService.exportPDF(req.query);
      res.download(filePath, (err) => {
        if (err) console.error("Error sending file:", err);
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default CargoArrivalController;
