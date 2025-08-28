export async function up(queryInterface) {
  await queryInterface.bulkInsert("CargoArrivals", [
    {
      arrivalNumber: "1000",
      type: "import",
      collectionType: "assorted",
      clientName: "Demo Client Ltd",
      source: "vessel",
      destination: "warehouse",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("CargoArrivals", null, {});
}
