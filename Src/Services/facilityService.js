export default (models) => {
  const { Facility } = models;

  return {
    async createFacility(data) {
      return Facility.create(data);
    },

    async updateFacility(id, data) {
      const facility = await Facility.findByPk(id);
      if (!facility) throw new Error("Facility not found");
      return facility.update(data);
    },

    async deleteFacility(id) {
      const facility = await Facility.findByPk(id);
      if (!facility) throw new Error("Facility not found");
      return facility.destroy();
    },

    async listFacilities(filters) {
      const where = {};
      if (filters.type) where.type = filters.type;
      if (filters.status) where.status = filters.status;
      return Facility.findAll({ where });
    },

    async getFacilityById(id) {
      return Facility.findByPk(id);
    },
  };
};
