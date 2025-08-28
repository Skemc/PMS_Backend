// Models/Tariff.js
export default (sequelize, DataTypes) => {
  const Tariff = sequelize.define(
    "Tariff",
    {
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // unique identifier for the tariff
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false, // human-readable name
      },
      entityType: {
        type: DataTypes.STRING, // truck, boat, vessel, cargo, storage, facility
        allowNull: false,
      },
      value: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      unit: {
        type: DataTypes.STRING, // e.g., RWF, per 12h, per day, per kg, per month
        defaultValue: "RWF",
      },
      effectiveFrom: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Tariff",
      tableName: "Tariffs",
    }
  );
  return Tariff;
};
