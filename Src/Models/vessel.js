export default (sequelize, DataTypes) => {
  const Vessel = sequelize.define("Vessel", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vessel_id: {
      type: DataTypes.STRING,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plateNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    owner: {
      type: DataTypes.STRING,
    },
    certificate: {
      type: DataTypes.STRING,
    },
    capacity: {
      type: DataTypes.FLOAT,
    }, // in tons
    ownerNumber: {
      type: DataTypes.STRING,
    },
    length: {
      type: DataTypes.FLOAT,
    },
    width: {
      type: DataTypes.FLOAT,
    },
    height: {
      type: DataTypes.FLOAT,
    },
    arrivalDate: {
      type: DataTypes.DATE,
    },
    departureDate: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM("Registered", "Booked", "Berthed", "Unberthed"),
      defaultValue: "Registered",
    },
  });

  // Hook to generate vessel_id (formatted code)
  Vessel.beforeCreate(async (vessel) => {
    const count = await Vessel.count();
    vessel.vessel_id = `VSL${String(count + 1).padStart(4, "0")}`;
  });
  return Vessel;
};
