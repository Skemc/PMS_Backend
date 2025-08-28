
export default (sequelize, DataTypes) => {
const Boat = sequelize.define('Boat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  boat_id: {
    type: DataTypes.STRING,
    unique: true
  },
  boatName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cargoOwner: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cargoType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  captainNames: {
    type: DataTypes.STRING,
    allowNull: false
  },
  captainContacts: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullOrEmpty: {
    type: DataTypes.STRING,
    allowNull: false
  },
  arrivalDate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  arrivalTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  exited: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  exitTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'boats'
});

// Hook to generate boat_id (formatted code)
Boat.beforeCreate(async (boat) => {
  const count = await Boat.count();
  boat.boat_id = `BOT ${String(count + 1).padStart(3, '0')}`;
});

return Boat;
};
