// seeders/xxxx-sample-entities-seeder.js
export async function up(queryInterface, Sequelize) {
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);

  await queryInterface.bulkInsert("trucks", [
    { id: "truck-1-111-111111111111", plateNumber: "RAB 001", clientName: "Kigali Transport Ltd", entryTime: fiveHoursAgo, exitTime: now }
  ]);

  await queryInterface.bulkInsert("vessels", [
    { id: "vsl-111-111-111111111111", name: "Lake1", clientName: "Lake Kivu Shipping", entryTime: threeDaysAgo, exitTime: now }
  ]);

  await queryInterface.bulkInsert("cargo_handlings", [
    { id: "cargo-111-111-111111111111", clientName: "Importer Ltd", weight: 10, direction: "import" },
    { id: "cargo-222-222-222222222222", clientName: "Exporter Ltd", weight: 5, direction: "export" }
  ]);

  await queryInterface.bulkInsert("cargo_storages", [
    { id: "stor-111-111-111111111111", clientName: "Importer Ltd", weight: 10, entryDate: threeDaysAgo, exitDate: now }
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("trucks", null, {});
  await queryInterface.bulkDelete("vessels", null, {});
  await queryInterface.bulkDelete("cargo_handlings", null, {});
  await queryInterface.bulkDelete("cargo_storages", null, {});
}
