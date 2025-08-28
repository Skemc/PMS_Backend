export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("invoices", [
    {
      id: "11111111-1111-1111-1111-111111111111",
      invoiceCode: "INV-20250812-0001",
      entityType: "truck",
      entityId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      clientName: "Kigali Transport Ltd",
      amount: 5000,
      status: "unpaid",
      generatedAt: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
      remarks: "Parking fee for 12 hours"
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      invoiceCode: "INV-20250812-0002",
      entityType: "vessel",
      entityId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      clientName: "Lake Kivu Shipping",
      amount: 15000,
      status: "paid",
      generatedAt: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      remarks: "Berthing fee for 2 days"
    }
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("invoices", null, {});
}
