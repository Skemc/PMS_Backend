export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Invoices", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    invoiceCode: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    reference_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    transaction_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    amount: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    overstay: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    clientName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: "unpaid",
    },
    generatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    receiptedAt: {
      type: Sequelize.DATE,
    },
    dueDate: {
      type: Sequelize.DATE,
    },
    remarks: {
      type: Sequelize.STRING,
    },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  });

  // Unique constraint for base invoices
  await queryInterface.addConstraint("Invoices", {
    fields: ["reference_id", "transaction_type", "overstay"],
    type: "unique",
    name: "unique_base_invoice_per_transaction",
    where: { overstay: false },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("Invoices");
}
