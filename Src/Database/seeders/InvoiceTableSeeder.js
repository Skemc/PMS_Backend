export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("Invoices", null, {});
  await queryInterface.bulkInsert("Invoices", [
    {
      //id: "11111111-1111-1111-1111-111111111111",
      invoiceCode: "INV-20250812-0001",
      reference_id: "11111111",
      transaction_type: "truck",
      clientName: "Kigali Transport Ltd",
      amount: 5000,
      overstay: false,
      status: "unpaid",
      generatedAt: new Date(),
      receiptedAt: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
      remarks: "Parking fee for 12 hours",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      //id: "22222222-2222-2222-2222-222222222222",
      invoiceCode: "INV-20250812-0002",
      reference_id: "22222222",
      transaction_type: "vessel",
      amount: 15000,
      overstay: true,
      clientName: "Lake Kivu Shipping",
      status: "paid",
      generatedAt: new Date(),
      receiptedAt: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      remarks: "Berthing fee for 2 days",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("Invoices", null, {});
}
