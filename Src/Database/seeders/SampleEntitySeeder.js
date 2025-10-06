// seeders/xxxx-sample-entities-seeder.js
export async function up(queryInterface, Sequelize) {
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);

  await queryInterface.bulkInsert("trucks", [
    {
      truck_id: "TRK1008",
      plateNumber: "RAB 001 D",
      cargoOwner: "ABC Logistics",
      cargoType: "Electronics",
      driverNames: "John Doe",
      driverContacts: "+250788123456",
      fullOrEmpty: "Full",
      sealNumber: "SN123456",
      arrivalDate: "2025-08-10",
      arrivalTime: fiveHoursAgo,
      exited: false,
      exitTime: now,
      status: "Arrived",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  /*await queryInterface.bulkInsert("Vessels", [
    {
      id: "vsl-111-111-111111111111",
      name: "Lake1",
      clientName: "Lake Kivu Shipping",
      entryTime: threeDaysAgo,
      exitTime: now,
    },
  ]);

  await queryInterface.bulkInsert("cargo_handlings", [
    {
      id: "cargo-111-111-111111111111",
      clientName: "Importer Ltd",
      weight: 10,
      direction: "import",
    },
    {
      id: "cargo-222-222-222222222222",
      clientName: "Exporter Ltd",
      weight: 5,
      direction: "export",
    },
  ]);

  await queryInterface.bulkInsert("cargo_storages", [
    {
      id: "stor-111-111-111111111111",
      clientName: "Importer Ltd",
      weight: 10,
      entryDate: threeDaysAgo,
      exitDate: now,
    },
  ]);*/
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("trucks", null, {});
  // await queryInterface.bulkDelete("vessels", null, {});
  //  await queryInterface.bulkDelete("cargo_handlings", null, {});
  //  await queryInterface.bulkDelete("cargo_storages", null, {});
}
