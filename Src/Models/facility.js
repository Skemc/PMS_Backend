import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Facility = sequelize.define("Facility", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }, // e.g., "Office", "Restaurant"
    type: {
      type: DataTypes.ENUM(
        "office",
        "restaurant",
        "petrolStation",
        "unpavedArea"
      ),
      allowNull: false,
    },
    tariff: { type: DataTypes.FLOAT, allowNull: false }, // base rental per unit
    description: { type: DataTypes.STRING },
    status: {
      type: DataTypes.ENUM("available", "rented"),
      defaultValue: "available",
    },
  });

  return Facility;
};
