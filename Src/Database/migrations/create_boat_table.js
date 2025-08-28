export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('boats', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    boat_id: {
      type: Sequelize.STRING,
      unique: true
    },
    boatName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    cargoOwner: { 
      type: Sequelize.STRING,
      allowNull: false
    },
    cargoType: { 
      type: Sequelize.STRING,
      allowNull: false
    },
    captainNames: { 
      type: Sequelize.STRING,
      allowNull: false
    },
    captainContacts: { 
      type: Sequelize.STRING,
      allowNull: false
    },
    fullOrEmpty: { 
      type: Sequelize.STRING,
      allowNull: false
    },
    arrivalDate: { 
      type: Sequelize.STRING,
      allowNull: false
    },
    arrivalTime: { 
      type: Sequelize.DATE,
      allowNull: false
    },
    exited: { 
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    exitTime: { 
      type: Sequelize.DATE,
      allowNull: false
    },
    status: { 
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('boats');
}

