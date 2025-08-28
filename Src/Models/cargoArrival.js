import { DataTypes } from "sequelize";

export default (sequelize) => {
  const CargoArrival = sequelize.define("CargoArrival", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    arrivalNumber: { type: DataTypes.STRING(5), unique: true }, // 4–5 digits
    type: { type: DataTypes.ENUM("import", "export"), allowNull: false },
    collectionType: {
      type: DataTypes.ENUM("assorted", "not_assorted"),
      allowNull: false,
    },
    ddcom: { type: DataTypes.STRING }, // Declaration number
    clearingAgent: { type: DataTypes.STRING },
    clientName: { type: DataTypes.STRING, allowNull: false },
    clientTIN: { type: DataTypes.STRING },
    clientNumber: { type: DataTypes.STRING },
    exporterName: { type: DataTypes.STRING },
    source: { type: DataTypes.STRING, allowNull: false }, // vessel, truck, etc.
    destination: { type: DataTypes.STRING, allowNull: false }, // vessel, truck, etc.
    status: {
      type: DataTypes.ENUM("pending", "invoiced", "paid", "closed"),
      defaultValue: "pending",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      references: { model: "Users", key: "id" },
    },
  });

  return CargoArrival;
};
