import { onServerError, onError, onSuccess } from "../Utils/response.js";
import Boat from "../Models/boat.js";

class BoatController {
  static async createBoat(req, res) {
    try {
      const boat = await Boat.create({
        boatName: req.body.boatName,
        cargoOwner: req.body.cargoOwner,
        cargoType: req.body.cargoType,
        captainNames: req.body.captainNames,
        captainContacts: req.body.captainContacts,
        fullOrEmpty: req.body.fullOrEmpty,
        arrivalDate: req.body.arrivalDate,
        arrivalTime: req.body.arrivalTime,
        exited: req.body.exited,
        exitTime: req.body.exitTime,
        status: req.body.status
      });

      return onSuccess(res, 201, " 🚤 Boat created successfully", { boat });
    } catch (err) {
      console.error(err);
      return onServerError(res);
    }
  }

  static async getAllBoats(req, res) {
    try {
      const boats = await Boat.findAll();
      return onSuccess(res, 200, "🚤 Boats retrieved successfully", boats);
    } catch (err) {
      return onServerError(res);
    }
  }

  static async getBoatById(req, res) {
    try {
      const boat = await Boat.findOne({ where: { boat_id: req.params.id } });
      if (!boat) return onError(res, 404, "🚤 Boat not found");
      return onSuccess(res, 200, "🚤 Boat retrieved successfully", boat);
    } catch (err) {
      return onServerError(res);
    }
  }

  static async updateBoat(req, res) {
    try {
      const [updated] = await Boat.update(
        {
          boatName: req.body.boatName,
          cargoOwner: req.body.cargoOwner,
          cargoType: req.body.cargoType,
          captainNames: req.body.captainNames,
          captainContacts: req.body.captainContacts,
          fullOrEmpty: req.body.fullOrEmpty,
          arrivalDate: req.body.arrivalDate,
          arrivalTime: req.body.arrivalTime,
          exited: req.body.exited,
          exitTime: req.body.exitTime,
          status: req.body.status
        },
        {
          where: { boat_id: req.params.id, status: { [Op.ne]: 'Exited' } },
          returning: true
        }
      );

      if (!updated) return onError(res, 404, "🚤 Boat not found or already exited");
      return onSuccess(res, 200, "🚤 Boat updated successfully");
    } catch (err) {
      console.error(err);
      return onServerError(res);
    }
  }

  static async deleteBoat(req, res) {
    try {
      const deleted = await Boat.destroy({ where: { boat_id: req.params.id } });
      if (!deleted) return onError(res, 404, "🚤 Boat not found");
      return onSuccess(res, 200, "🚤 Boat deleted successfully");
    } catch (err) {
      return onServerError(res);
    }
  }
}

export default BoatController;
