export default (sequelize, DataTypes) => {
  const Invoice = sequelize.define(
    "Invoice",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      invoiceCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      reference_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transaction_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      overstay: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      clientName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "unpaid",
      },
      generatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      receiptedAt: {
        type: DataTypes.DATE,
      },
      dueDate: {
        type: DataTypes.DATE,
      },
      remarks: {
        type: DataTypes.STRING,
      },
    },
    {
      modelName: "Invoice",
      tableName: "Invoices",
      indexes: [
        {
          unique: true,
          fields: ["reference_id", "transaction_type", "overstay"],
          where: { overstay: false }, // ensures one base invoice per transaction
        },
      ],
    }
  );

  return Invoice;
};
