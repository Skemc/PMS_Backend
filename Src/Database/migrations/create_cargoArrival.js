export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("CargoArrivals", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    arrivalNumber: { type: Sequelize.STRING(5), unique: true },
    type: { type: Sequelize.ENUM("import", "export"), allowNull: false },
    collectionType: {
      type: Sequelize.ENUM("assorted", "not_assorted"),
      allowNull: false,
    },
    ddcom: { type: Sequelize.STRING },
    clearingAgent: { type: Sequelize.STRING },
    clientName: { type: Sequelize.STRING, allowNull: false },
    clientTIN: { type: Sequelize.STRING },
    clientNumber: { type: Sequelize.STRING },
    exporterName: { type: Sequelize.STRING },
    source: { type: Sequelize.STRING, allowNull: false },
    destination: { type: Sequelize.STRING, allowNull: false },
    status: {
      type: Sequelize.ENUM("pending", "invoiced", "paid", "closed"),
      defaultValue: "pending",
    },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("CargoArrivals");
}
