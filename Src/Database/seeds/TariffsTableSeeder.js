// seeders/xxxx-tariffs-seeder.js
export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("tariffs", [
    { key: "truck.block12_price", name: "Truck 12h block price", entityType: "truck", value: 5000, unit: "RWF" },
    { key: "boat.block12_price", name: "Boat 12h block price", entityType: "boat", value: 5000, unit: "RWF" },
    { key: "vessel.first3_days_price", name: "Vessel first 3 days price", entityType: "vessel", value: 210000, unit: "RWF" },
    { key: "vessel.daily_extra", name: "Vessel extra day price", entityType: "vessel", value: 28000, unit: "RWF" },
    { key: "cargo.import_multiplier", name: "Cargo import multiplier", entityType: "cargo", value: 2, unit: "multiplier" },
    { key: "cargo.export_multiplier", name: "Cargo export multiplier", entityType: "cargo", value: 0.4, unit: "multiplier" },
    { key: "storage.grace_days", name: "Storage grace days", entityType: "storage", value: 14, unit: "days" },
    { key: "storage.multiplier_15_30", name: "Storage multiplier 15-30", entityType: "storage", value: 0.6, unit: "multiplier" },
    { key: "storage.multiplier_31_plus", name: "Storage multiplier 31+", entityType: "storage", value: 1.2, unit: "multiplier" },
    { key: "facility.petrol_station", name: "Petrol station monthly", entityType: "facility", value: 250000, unit: "RWF" },
    { key: "facility.office", name: "Office monthly", entityType: "facility", value: 120000, unit: "RWF" },
    { key: "facility.restaurant", name: "Restaurant monthly", entityType: "facility", value: 100000, unit: "RWF" },
    { key: "facility.garage", name: "Garage monthly", entityType: "facility", value: 50000, unit: "RWF" },
    { key: "facility.unpaved_space", name: "Unpaved space monthly", entityType: "facility", value: 50000, unit: "RWF" }
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("tariffs", null, {});
}
