export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Facilities", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false, unique: true },
    type: {
      type: Sequelize.ENUM(
        "office",
        "restaurant",
        "petrolStation",
        "unpavedArea"
      ),
      allowNull: false,
    },
    tariff: { type: Sequelize.FLOAT, allowNull: false },
    description: { type: Sequelize.STRING },
    status: {
      type: Sequelize.ENUM("available", "rented"),
      defaultValue: "available",
    },
    createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("Facilities");
}
