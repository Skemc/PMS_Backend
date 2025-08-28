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

  test("paying receipted truck invoice creates separate overstay invoice", async () => {
  const now = new Date();
  const tenHoursAgo = new Date(now.getTime() - 10 * 60 * 60 * 1000);
  const truck = await models.Truck.create({ plateNumber: "OVR-1", clientName: "Ovr Client", entryTime: tenHoursAgo, exitTime: now });

  // create invoice
  const createRes = await request(app).post("/api/invoices").send({ entityType: "truck", entityId: truck.id, clientName: truck.clientName });
  expect(createRes.status).toBe(201);
  const invoiceId = createRes.body.id;

  // receipte invoice
  const rRes = await request(app).post(`/api/invoices/${invoiceId}/receipte`);
  expect(rRes.status).toBe(200);

  // simulate truck exit extended beyond receiptedAt
  const createdInvoice = await models.Invoice.findByPk(invoiceId);
  const receiptedAt = createdInvoice.receiptedAt;
  const futureExit = new Date(new Date(receiptedAt).getTime() + 36 * 60 * 60 * 1000); // +36h -> 3 blocks
  truck.exitTime = futureExit;
  await truck.save();

  // pay invoice -> should create overstay invoice
  const payRes = await request(app).post(`/api/invoices/${invoiceId}/pay`);
  expect(payRes.status).toBe(200);
  expect(payRes.body.paidInvoice.status).toBe("paid");
  expect(payRes.body.overstayInvoice).not.toBeNull();
  expect(Number(payRes.body.overstayInvoice.amount)).toBeGreaterThan(0);
    });
});