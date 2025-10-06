export async function up(queryInterface) {
  await queryInterface.bulkDelete("Facilities", null, {});
  await queryInterface.bulkInsert("Facilities", [
    { name: "Office", type: "office", tariff: 120000, status: "available" },
    {
      name: "Restaurant",
      type: "restaurant",
      tariff: 100000,
      status: "available",
    },
    {
      name: "Petrol Station",
      type: "petrolStation",
      tariff: 250000,
      status: "available",
    },
    {
      name: "Unpaved Area",
      type: "unpavedArea",
      tariff: 50000,
      status: "available",
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("Facilities", null, {});
}
