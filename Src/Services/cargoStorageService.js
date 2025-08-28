import { Op } from "sequelize";
import models from "../Models/index.js";

const CargoStorage = models.CargoStorage;

const tariffRates = {
  graceDays: 14,
  midRate: 0.6,
  highRate: 1.2,
};

class CargoStorageService {
  static async releaseGoods(clientName, requestedQuantity, releaseDate) {
    let remaining = requestedQuantity;
    let invoiceItems = [];
    let totalAmount = 0;

    const storages = await CargoStorage.findAll({
      where: { clientName, remainingQuantity: { [Op.gt]: 0 } },
      order: [["offloadDate", "ASC"]],
    });

    for (let storage of storages) {
      if (remaining <= 0) break;

      let releaseQty = Math.min(remaining, storage.remainingQuantity);
      let daysStored = Math.ceil(
        (new Date(releaseDate) - new Date(storage.offloadDate)) /
          (1000 * 60 * 60 * 24)
      );

      let weightReleased = releaseQty * storage.weightPerItem;
      let amount = this.calculateStorageFee(weightReleased, daysStored);

      invoiceItems.push({
        arrivalNoticeId: storage.arrivalNoticeId,
        releaseQty,
        daysStored,
        weightReleased,
        amount,
      });

      totalAmount += amount;
      storage.remainingQuantity -= releaseQty;
      if (storage.remainingQuantity === 0) storage.status = "closed";
      else storage.status = "partially_released";
      await storage.save();

      remaining -= releaseQty;
    }

    return { invoiceItems, totalAmount };
  }

  static calculateStorageFee(weight, days) {
    if (days <= tariffRates.graceDays) return 0;

    let amount = 0;
    if (days > 14 && days <= 30) {
      amount = weight * (days - 14) * tariffRates.midRate;
    }
    if (days > 30) {
      amount = weight * 16 * tariffRates.midRate; // 15–30 period fixed
      amount += weight * (days - 30) * tariffRates.highRate;
    }
    return amount;
  }
}

export default CargoStorageService;
