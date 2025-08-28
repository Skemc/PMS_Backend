export default function initTariffService(models) {
  const { Tariff } = models;

  async function get(key) {
    const rec = await Tariff.findOne({ where: { key } });
    if (!rec) throw new Error(`Tariff not found: ${key}`);
    return rec.value;
  }

  async function getAll() {
    return Tariff.findAll({ order: [["key", "ASC"]] });
  }

  async function set(key, value, other = {}) {
    const rec = await Tariff.findOne({ where: { key } });
    if (rec) {
      rec.value = value;
      if (other.name) rec.name = other.name;
      if (other.entityType) rec.entityType = other.entityType;
      if (other.unit) rec.unit = other.unit;
      if (other.effectiveFrom) rec.effectiveFrom = other.effectiveFrom;
      if (other.description) rec.description = other.description;
      await rec.save();
      return rec;
    }
    return Tariff.create({ key, value, ...other });
  }

  async function create(payload) {
    return Tariff.create(payload);
  }

  return { get, getAll, set, create };
}
