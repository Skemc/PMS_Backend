import models from "../Models/index.js";

const { Invoice, Receipt } = models;

const ReceiptController = {
  async createReceipt(req, res) {
    try {
      const { invoice_id, amount_paid, remarks } = req.body;

      const invoice = await Invoice.findByPk(invoice_id);
      if (!invoice) return res.status(404).json({ error: "Invoice not found" });

      const existing = await Receipt.findOne({ where: { invoice_id } });
      if (existing)
        return res
          .status(400)
          .json({ error: "A receipt already exists for this invoice." });

      const receipt = await Receipt.create({
        invoice_id,
        transaction_type: invoice.transaction_type,
        amount_paid,
        remarks,
      });

      res.status(201).json(receipt);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getReceipt(req, res) {
    try {
      const receipt = await Receipt.findByPk(req.params.id, {
        include: [{ model: Invoice }],
      });
      if (!receipt) return res.status(404).json({ error: "Receipt not found" });
      res.json(receipt);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllReceipts(req, res) {
    try {
      const receipts = await Receipt.findAll({ include: [{ model: Invoice }] });
      res.json(receipts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteReceipt(req, res) {
    try {
      const receipt = await Receipt.findByPk(req.params.id);
      if (!receipt) return res.status(404).json({ error: "Receipt not found" });
      await receipt.destroy();
      res.json({ message: "Receipt deleted successfully (Admin only)" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
export default ReceiptController;
