import { DataTypes } from "sequelize";

export default (sequelize) => {
  const VesselBerthing = sequelize.define("VesselBerthing", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    vesselId: { type: DataTypes.INTEGER, allowNull: false },
    ATA: { type: DataTypes.DATE, allowNull: false }, // Actual Time of Arrival
    ETD: { type: DataTypes.DATE }, // Estimated Time of Departure
    berthingSide: { type: DataTypes.STRING },
    vesselDraft: { type: DataTypes.FLOAT }, // in meters
    cargo: { type: DataTypes.STRING },
    observation: { type: DataTypes.STRING },
  });

  return VesselBerthing;
};
