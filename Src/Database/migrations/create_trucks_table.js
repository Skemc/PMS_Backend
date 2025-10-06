export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("trucks", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    truck_id: {
      type: Sequelize.STRING,
      unique: true,
    },
    plateNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cargoOwner: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cargoType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    driverNames: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    driverContacts: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fullOrEmpty: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    sealNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    arrivalDate: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    arrivalTime: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    exited: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    exitTime: {
      type: Sequelize.TIME,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
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
  await queryInterface.dropTable("trucks");
}
