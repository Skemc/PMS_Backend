export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("VesselBerthings", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vesselId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "Vessels", key: "id" },
      onDelete: "CASCADE",
    },
    ATA: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    ETD: {
      type: Sequelize.DATE,
    },
    berthingSide: {
      type: Sequelize.STRING,
    },
    vesselDraft: {
      type: Sequelize.FLOAT,
    },
    cargo: {
      type: Sequelize.STRING,
    },
    observation: {
      type: Sequelize.STRING,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("VesselBerthings");
}
