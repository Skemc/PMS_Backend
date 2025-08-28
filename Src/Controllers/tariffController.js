import initTariffService from "../Services/tariffService.js";
import models from "../Models/index.js";

const tariffService = initTariffService(models);

const TariffController = {
  // GET /tariffs
  async list(req, res) {
    try {
      const all = await tariffService.getAll();
      res.json(all);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /tariffs/:id
  async getOne(req, res) {
    try {
      const rec = await models.Tariff.findByPk(req.params.id);
      if (!rec) return res.status(404).json({ error: "Tariff not found" });
      res.json(rec);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /tariffs (admin only)
  async create(req, res) {
    try {
      const payload = req.body;
      const rec = await tariffService.create(payload);
      res.status(201).json(rec);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // PUT /tariffs/:id or PATCH /tariffs/:id (admin only)
  async update(req, res) {
    try {
      const id = req.params.id;
      const { key, value, name, entityType, unit, effectiveFrom, description } =
        req.body;

      if (key) {
        const rec = await tariffService.set(key, value, {
          name,
          entityType,
          unit,
          effectiveFrom,
          description,
        });
        return res.json(rec);
      }

      const recById = await models.Tariff.findByPk(id);
      if (!recById) return res.status(404).json({ error: "Tariff not found" });

      if (value !== undefined) recById.value = value;
      if (name) recById.name = name;
      if (entityType) recById.entityType = entityType;
      if (unit) recById.unit = unit;
      if (effectiveFrom) recById.effectiveFrom = effectiveFrom;
      if (description) recById.description = description;

      await recById.save();
      res.json(recById);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /tariffs/:id (admin only)
  async delete(req, res) {
    try {
      const rec = await models.Tariff.findByPk(req.params.id);
      if (!rec) return res.status(404).json({ error: "Tariff not found" });
      await rec.destroy();
      res.json({ message: "Tariff deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default TariffController;
