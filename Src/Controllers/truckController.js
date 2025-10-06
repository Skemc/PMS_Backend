import { onServerError, onError, onSuccess } from "../Utils/response.js";
import models from "../Models/index.js";

const { Truck } = models;

class TruckController {
  static async createTruck(req, res) {
    try {
      const truck = await Truck.create({
        plateNumber: req.body.plateNumber,
        cargoOwner: req.body.cargoOwner,
        cargoType: req.body.cargoType,
        driverNames: req.body.driverNames,
        driverContacts: req.body.driverContacts,
        fullOrEmpty: req.body.fullOrEmpty,
        sealNumber: req.body.sealNumber,
        arrivalDate: req.body.arrivalDate,
        arrivalTime: req.body.arrivalTime,
        exited: req.body.exited,
        exitTime: req.body.exitTime,
        status: req.body.status,
      });

      return onSuccess(res, 201, " 🚚 Truck created successfully", { truck });
    } catch (err) {
      console.error(err);
      return onServerError(res);
    }
  }

  static async getAllTrucks(req, res) {
    try {
      const trucks = await Truck.findAll();
      return onSuccess(res, 200, "🚚 Trucks retrieved successfully", trucks);
    } catch (err) {
      return onServerError(res);
    }
  }

  static async getTruckById(req, res) {
    try {
      const truck = await Truck.findOne({ where: { truck_id: req.params.id } });
      if (!truck) return onError(res, 404, "🚚 Truck not found");
      return onSuccess(res, 200, "🚚 Truck retrieved successfully", truck);
    } catch (err) {
      return onServerError(res);
    }
  }

  static async updateTruck(req, res) {
    try {
      const [updated] = await Truck.update(
        {
          plateNumber: req.body.plateNumber,
          cargoOwner: req.body.cargoOwner,
          cargoType: req.body.cargoType,
          driverNames: req.body.driverNames,
          driverContacts: req.body.driverContacts,
          fullOrEmpty: req.body.fullOrEmpty,
          sealNumber: req.body.sealNumber,
          arrivalDate: req.body.arrivalDate,
          arrivalTime: req.body.arrivalTime,
          exited: req.body.exited,
          exitTime: req.body.exitTime,
          status: req.body.status,
        },
        {
          where: { truck_id: req.params.id, status: { [Op.ne]: "Exited" } },
          returning: true,
        }
      );

      if (!updated)
        return onError(res, 404, "🚚 Truck not found or already exited");
      return onSuccess(res, 200, "🚚 Truck updated successfully");
    } catch (err) {
      console.error(err);
      return onServerError(res);
    }
  }

  static async deleteTruck(req, res) {
    try {
      const deleted = await Truck.destroy({
        where: { truck_id: req.params.id },
      });
      if (!deleted) return onError(res, 404, "🚚 Truck not found");
      return onSuccess(res, 200, "🚚 Truck deleted successfully");
    } catch (err) {
      return onServerError(res);
    }
  }

  static async markTruckExited(req, res) {
    try {
      const truck = await Truck.findOne({ where: { truck_id: req.params.id } });
      if (!truck) return onError(res, 404, "Truck not found");

      if (truck.exited) return onError(res, 400, "Truck has already exited");

      const exitTime = new Date().toTimeString().split(" ")[0]; // current time HH:MM:SS

      truck.exitTime = exitTime;
      truck.exited = true;
      truck.status = "Exited";

      await truck.save();

      return onSuccess(res, 200, "Truck exited successfully", truck);
    } catch (err) {
      console.error(err);
      return onServerError(res);
    }
  }
}

export default TruckController;
