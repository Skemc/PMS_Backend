export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Tariffs", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    key: { type: Sequelize.STRING, allowNull: false, unique: true },
    name: { type: Sequelize.STRING, allowNull: false },
    entityType: { type: Sequelize.STRING, allowNull: false },
    value: { type: Sequelize.FLOAT, allowNull: false },
    unit: { type: Sequelize.STRING, defaultValue: "RWF" },
    effectiveFrom: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    description: { type: Sequelize.STRING },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("Tariffs");
}
