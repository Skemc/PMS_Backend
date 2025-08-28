// Utils/tariffs.js
// Async calculation helpers that read tariff values from tariffService

const msInHour = 1000 * 60 * 60;
const msInDay = 1000 * 60 * 60 * 24;

export async function calculateTruckOrBoatFee(entryTime, exitTime, tariffService, keyPrefix) {
  if (!entryTime || !exitTime) throw new Error("Missing entry or exit time");
  const blockPrice = await tariffService.get(`${keyPrefix}.block12_price`);
  const hours = Math.ceil((new Date(exitTime) - new Date(entryTime)) / msInHour);
  const blocks = Math.ceil(hours / 12);
  return blocks * blockPrice;
}

export async function calculateTruckOrBoatOverstay(receiptedAt, exitTime, tariffService, keyPrefix) {
  return calculateTruckOrBoatFee(receiptedAt, exitTime, tariffService, keyPrefix);
}

export async function calculateVesselFee(entryTime, exitTime, tariffService) {
  const first3 = await tariffService.get("vessel.first3_days_price");
  const extraDay = await tariffService.get("vessel.daily_extra");
  const days = Math.ceil((new Date(exitTime) - new Date(entryTime)) / msInDay);
  if (days <= 3) return first3;
  return first3 + (days - 3) * extraDay;
}

export async function calculateVesselOverstay(receiptedAt, exitTime, tariffService) {
  const extraDay = await tariffService.get("vessel.daily_extra");
  const days = Math.ceil((new Date(exitTime) - new Date(receiptedAt)) / msInDay);
  return days * extraDay;
}

export async function calculateCargoHandling(weight, direction, tariffService) {
  if (direction === "import") {
    const mult = await tariffService.get("cargo.import_multiplier");
    return weight * mult;
  } else {
    const mult = await tariffService.get("cargo.export_multiplier");
    return weight * mult;
  }
}

export async function calculateCargoStorage(weight, entryDate, exitDate, tariffService) {
  const graceDays = await tariffService.get("storage.grace_days");
  const mult15_30 = await tariffService.get("storage.multiplier_15_30");
  const mult31 = await tariffService.get("storage.multiplier_31_plus");

  const days = Math.ceil((new Date(exitDate) - new Date(entryDate)) / msInDay);
  if (days <= graceDays) return 0;
  if (days <= 30) return weight * mult15_30 * days;
  return weight * mult31 * days;
}

export async function calculateFacilityFee(facilityType, months, tariffService) {
  const key = `facility.${facilityType}`;
  const rate = await tariffService.get(key);
  return rate * months;
}
