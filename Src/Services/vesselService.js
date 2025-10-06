import models from "../Models/index.js";

const { Vessel, VesselBerthing, Sequelize } = models;
const { Op } = Sequelize;

const vesselService = {
  async registerVessel(data) {
    return Vessel.create(data);
  },

  async berthVessel(vesselId, data) {
    const vessel = await Vessel.findByPk(vesselId);
    if (!vessel) throw new Error("Vessel not found");

    vessel.status = "berthed";
    vessel.arrivalDate = data.ATA;
    vessel.departureDate = data.ETD;
    await vessel.save();

    return VesselBerthing.create({ ...data, vesselId });
  },

  async listVessels(filters) {
    const where = {};
    if (filters.status) where.status = filters.status;
    if (filters.name) where.name = { [Op.iLike]: `%${filters.name}%` };

    return Vessel.findAll({ where, include: ["berthings"] });
  },

  async getVesselById(id) {
    return Vessel.findByPk(id, { include: ["berthings"] });
  },
};

export default vesselService;
