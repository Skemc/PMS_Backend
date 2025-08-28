export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("CargoTallies", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    cargoDescription: { type: Sequelize.STRING, allowNull: false },
    quantity: { type: Sequelize.INTEGER, allowNull: false },
    cargoType: { type: Sequelize.STRING },
    weightPerItem: { type: Sequelize.FLOAT, allowNull: false },
    observation: { type: Sequelize.STRING },
    arrivalId: {
      type: Sequelize.INTEGER,
      references: { model: "CargoArrivals", key: "id" },
      onDelete: "CASCADE",
    },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("CargoTallies");
}
