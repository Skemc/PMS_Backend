// src/Models/index.js
import { Sequelize, DataTypes } from "sequelize";
import InvoiceModel from "./invoice.js";
import TruckModel from "./truck.js";
import BoatModel from "./boat.js";
import ReceiptModel from "./receipt.js";
import UserModel from "./user.js";
import TariffModel from "./tariff.js";
import VesselModel from "./Vessel.js";
import VesselBerthingModel from "./vesselBerthing.js";
import CargoArrivalModel from "./cargoArrival.js";
import CargoTallyModel from "./cargoTally.js";
import CargoStorageModel from "./cargoStorage.js";
import FacilityModel from "./facility.js";

const sequelize = new Sequelize(
  process.env.DATABASE_URL || "postgres://postgres:12345@localhost:5432/PMS"
);

const models = {
  Invoice: InvoiceModel(sequelize, DataTypes),
  Truck: TruckModel(sequelize, DataTypes),
  Boat: BoatModel(sequelize, DataTypes),
  Receipt: ReceiptModel(sequelize, DataTypes),
  User: UserModel(sequelize, DataTypes),
  Tariff: TariffModel(sequelize, DataTypes),
  Vessel: VesselModel(sequelize, DataTypes),
  VesselBerthing: VesselBerthingModel(sequelize, DataTypes),
  CargoArrival: CargoArrivalModel(sequelize, DataTypes),
  CargoTally: CargoTallyModel(sequelize, DataTypes),
  CargoStorage: CargoStorageModel(sequelize, DataTypes),
  Facility: FacilityModel(sequelize, DataTypes),
};

// Associations
models.Vessel.hasMany(models.VesselBerthing, {
  as: "berthings",
  foreignKey: "vesselId",
  onDelete: "CASCADE",
});
models.VesselBerthing.belongsTo(models.Vessel, { foreignKey: "vesselId" });

models.CargoArrival.hasMany(models.CargoTally, {
  as: "tallies",
  foreignKey: "arrivalId",
  onDelete: "CASCADE",
});
models.CargoTally.belongsTo(models.CargoArrival, { foreignKey: "arrivalId" });

models.CargoArrival.belongsTo(models.User, {
  as: "creator",
  foreignKey: "createdBy",
});
models.User.hasMany(models.CargoArrival, { foreignKey: "createdBy" });

// Export models + sequelize instance + Sequelize class
export default {
  ...models,
  sequelize,
  Sequelize,
};
