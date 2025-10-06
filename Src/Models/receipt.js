// src/Models/receipt.js
export default (sequelize, DataTypes) => {
  const Receipt = sequelize.define(
    "Receipt",
    {
      invoice_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // one-to-one with invoice
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
      tableName: "Receipts",
      timestamps: true,
    }
  );

  // Association placeholder
  Receipt.associate = (models) => {
    Receipt.belongsTo(models.Invoice, {
      foreignKey: "invoice_id",
      as: "invoice",
    });
  };

  return Receipt;
};
