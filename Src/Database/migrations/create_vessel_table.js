export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Vessels", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vessel_id: {
      type: Sequelize.STRING,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    plateNumber: {
      type: Sequelize.STRING,
      unique: true,
    },
    owner: {
      type: Sequelize.STRING,
    },
    certificate: {
      type: Sequelize.STRING,
    },
    capacity: {
      type: Sequelize.FLOAT,
    },
    ownerNumber: {
      type: Sequelize.STRING,
    },
    length: {
      type: Sequelize.FLOAT,
    },
    width: {
      type: Sequelize.FLOAT,
    },
    height: {
      type: Sequelize.FLOAT,
    },
    arrivalDate: {
      type: Sequelize.DATE,
    },
    departureDate: {
      type: Sequelize.DATE,
    },
    status: {
      type: Sequelize.ENUM("booked", "berthed", "departed"),
      defaultValue: "booked",
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
  await queryInterface.dropTable("Vessels");
}
