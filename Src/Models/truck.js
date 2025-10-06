export default (sequelize, DataTypes) => {
  const Truck = sequelize.define(
    "Truck",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      truck_id: {
        type: DataTypes.STRING,
        unique: true,
      },
      plateNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cargoOwner: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cargoType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      driverNames: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      driverContacts: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullOrEmpty: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sealNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      arrivalDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      arrivalTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      exited: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      exitTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "trucks",
    }
  );

  // Hook to generate truck_id (formatted code)
  Truck.beforeCreate(async (truck) => {
    const count = await Truck.count();
    truck.truck_id = `TRK${String(count + 1).padStart(4, "0")}`;
  });

  return Truck;
};
