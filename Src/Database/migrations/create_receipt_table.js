export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Receipts", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    invoice_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "Invoices", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    transaction_type: { type: Sequelize.STRING, allowNull: false },
    amount_paid: { type: Sequelize.FLOAT, allowNull: false },
    remarks: { type: Sequelize.STRING },
    payment_date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("Receipts");
}
