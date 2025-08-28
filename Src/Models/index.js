// Models/index.js
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

export default async function initModels(
  providedSequelize = null,
  SequelizeClass = null
) {
  const sequelize =
    providedSequelize ||
    new Sequelize(
      process.env.DATABASE_URL || "postgres://postgres:12345@localhost:5432/PMS"
    );
  const DataTypesLocal =
    SequelizeClass && SequelizeClass.DataTypes
      ? SequelizeClass.DataTypes
      : DataTypes;

  const Invoice = InvoiceModel(sequelize, DataTypesLocal);
  const Truck = TruckModel(sequelize, DataTypesLocal);
  const Boat = BoatModel(sequelize, DataTypesLocal);
  const Receipt = ReceiptModel(sequelize, DataTypesLocal);
  const User = UserModel(sequelize, DataTypesLocal);
  const Tariff = TariffModel(sequelize, DataTypesLocal);
  const Vessel = VesselModel(sequelize, DataTypesLocal);
  const VesselBerthing = VesselBerthingModel(sequelize, DataTypesLocal);
  const CargoArrival = CargoArrivalModel(sequelize, DataTypesLocal);
  const CargoTally = CargoTallyModel(sequelize, DataTypesLocal);
  const CargoStorage = CargoStorageModel(sequelize, DataTypesLocal);
  const Facility = FacilityModel(sequelize, DataTypesLocal);

  // optionally set associations here

  return {
    sequelize,
    Sequelize: SequelizeClass || Sequelize,
    Invoice,
    Truck,
    Boat,
    Receipt,
    User,
    Tariff,
    Vessel,
    VesselBerthing,
    CargoArrival,
    CargoTally,
    CargoStorage,
    Facility,
  };

  Vessel.hasMany(VesselBerthing, {
    as: "berthings",
    foreignKey: "vesselId",
    onDelete: "CASCADE",
  });
  VesselBerthing.belongsTo(Vessel, { foreignKey: "vesselId" });

  CargoArrival.hasMany(CargoTally, {
    as: "tallies",
    foreignKey: "arrivalId",
    onDelete: "CASCADE",
  });
  CargoTally.belongsTo(CargoArrival, { foreignKey: "arrivalId" });
  CargoArrival.belongsTo(User, { as: "creator", foreignKey: "createdBy" });
  User.hasMany(CargoArrival, { foreignKey: "createdBy" });
}
