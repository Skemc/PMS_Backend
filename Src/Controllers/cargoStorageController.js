import CargoStorageService from "../Services/cargoStorageService.js";
import models from "../Models/index.js";

const CargoStorage = models.CargoStorage;

const CargoStorageController = {
  async add(req, res) {
    try {
      const data = req.body;
      const totalWeight = data.quantity * data.weightPerItem;
      const storage = await CargoStorage.create({
        ...data,
        totalWeight,
        remainingQuantity: data.quantity,
      });
      res.status(201).json(storage);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async release(req, res) {
    try {
      const { clientName, requestedQuantity, releaseDate } = req.body;
      const result = await CargoStorageService.releaseGoods(
        clientName,
        requestedQuantity,
        releaseDate
      );
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async list(req, res) {
    try {
      const storages = await CargoStorage.findAll();
      res.json(storages);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default CargoStorageController;
