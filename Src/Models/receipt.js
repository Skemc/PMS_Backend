export default (sequelize, DataTypes) => {
  const Receipt = sequelize.define(
    "Receipt",
    {
      invoice_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // one-to-one with invoice
        references: { model: Invoice, key: "id" },
      },
      transaction_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount_paid: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      remarks: {
        type: DataTypes.STRING,
      },
      payment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Receipt",
      tableName: "Receipts",
    }
  );

  return Receipt;
};
