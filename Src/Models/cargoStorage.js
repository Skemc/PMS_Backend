import { DataTypes } from "sequelize";

export default (sequelize) => {
  const CargoStorage = sequelize.define("CargoStorage", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    arrivalNoticeId: { type: DataTypes.INTEGER, allowNull: false },
    clientName: { type: DataTypes.STRING, allowNull: false },
    clientTIN: { type: DataTypes.STRING },
    clientNumber: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    weightPerItem: { type: DataTypes.FLOAT, allowNull: false },
    totalWeight: { type: DataTypes.FLOAT, allowNull: false }, // quantity * weightPerItem
    remainingQuantity: { type: DataTypes.INTEGER, allowNull: false }, // FIFO tracking
    offloadDate: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.ENUM("active", "partially_released", "closed"),
      defaultValue: "active",
    },
  });
  return CargoStorage;
};
