import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Vessel = sequelize.define("Vessel", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    plateNumber: { type: DataTypes.STRING, unique: true },
    owner: { type: DataTypes.STRING },
    certificate: { type: DataTypes.STRING },
    capacity: { type: DataTypes.FLOAT }, // in tons
    ownerNumber: { type: DataTypes.STRING },
    length: { type: DataTypes.FLOAT },
    width: { type: DataTypes.FLOAT },
    height: { type: DataTypes.FLOAT },
    arrivalDate: { type: DataTypes.DATE },
    departureDate: { type: DataTypes.DATE },
    status: {
      type: DataTypes.ENUM("booked", "berthed", "departed"),
      defaultValue: "booked",
    },
  });

  return Vessel;
};
