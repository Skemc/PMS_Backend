export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("CargoStorages", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    arrivalNoticeId: { type: Sequelize.INTEGER, allowNull: false },
    clientName: { type: Sequelize.STRING, allowNull: false },
    clientTIN: { type: Sequelize.STRING },
    clientNumber: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
    quantity: { type: Sequelize.INTEGER, allowNull: false },
    weightPerItem: { type: Sequelize.FLOAT, allowNull: false },
    totalWeight: { type: Sequelize.FLOAT, allowNull: false },
    remainingQuantity: { type: Sequelize.INTEGER, allowNull: false },
    offloadDate: { type: Sequelize.DATE, allowNull: false },
    status: {
      type: Sequelize.ENUM("active", "partially_released", "closed"),
      defaultValue: "active",
    },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("CargoStorages");
}
