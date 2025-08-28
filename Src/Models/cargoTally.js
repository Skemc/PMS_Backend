import { DataTypes } from "sequelize";

export default (sequelize) => {
  const CargoTally = sequelize.define("CargoTally", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cargoDescription: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    cargoType: { type: DataTypes.STRING }, // bags, jerrycans, etc.
    weightPerItem: { type: DataTypes.FLOAT, allowNull: false },
    observation: { type: DataTypes.STRING },
  });

  return CargoTally;
};
