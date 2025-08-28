import request from "supertest";
import server from "../server.js"; 
import { sequelize } from "../db.js";
import Invoice from "../Models/invoice.js";

describe("Invoice API", () => {
  beforeAll(async () => {
    // Sync and clear DB before tests
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("should create a new invoice", async () => {
    const res = await request(app)
      .post("/api/invoices")
      .send({
        entityType: "truck",
        entityId: "123e4567-e89b-12d3-a456-426614174000",
        clientName: "Test Client",
        amount: 5000,
        dueDate: "2025-08-20",
        remarks: "Test invoice"
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("invoiceCode");
  });
  
});
