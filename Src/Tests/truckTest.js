import request from "supertest";
import server from "../server.js"; 
import { sequelize } from "../db.js";
import Truck from "../Models/truck.js";
import TokenClass from "../Utils/tokenGenerator.js"; 

const tokenGen = new TokenClass();

describe("Truck API Endpoints", () => {
  beforeAll(async () => {
    // Sync and clear DB before tests
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close DB connection after tests
    await sequelize.close();
  });

  let truckId;
  let token;


  test("Create a new truck", async () => {
    const res = await request(server)
      .post("/trucks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        plateNumber: "RAB123A",
        cargoOwner: "ABC Logistics",
        cargoType: "Electronics",
        driverNames: "John Doe",
        driverContacts: "+250788123456",
        fullOrEmpty: "Full",
        sealNumber: "SN123456",
        arrivalDate: "2025-08-10",
        arrivalTime: "08:30",
        exited: false,
        exitTime: "",
        status: "Arrived"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/🚚 Truck created successfully/);
    expect(res.body.data.truck).toHaveProperty("truck_id");
    truckId = res.body.data.truck.truck_id;
    console.log("All data:", res.body.data.truck);
    
  });

  test("Get all trucks", async () => {
    const res = await request(server)
      .get("/trucks")
      .set("Authorization", "Bearer YOUR_TEST_TOKEN");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("Get truck by ID", async () => {
    const res = await request(app)
      .get(`/trucks/${encodeURIComponent(truckId)}`)
      .set("Authorization", "Bearer YOUR_TEST_TOKEN");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.truck_id).toBe(truckId);
  });

  test("Update truck (status not Exited)", async () => {
    const res = await request(server)
      .put(`/trucks/${encodeURIComponent(truckId)}`)
      .set("Authorization", "Bearer YOUR_TEST_TOKEN")
      .send({
        plateNumber: "RAB123A",
        cargoOwner: "ABC Logistics Updated",
        cargoType: "Electronics",
        driverNames: "John Doe",
        driverContacts: "+250788123456",
        fullOrEmpty: "Full",
        sealNumber: "SN123456",
        arrivalDate: "2025-08-10",
        arrivalTime: "08:30",
        exited: false,
        exitTime: "",
        status: "In Transit"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/🚚 Truck updated successfully/);
  });

  test("Delete truck", async () => {
    const res = await request(server)
      .delete(`/trucks/${encodeURIComponent(truckId)}`)
      .set("Authorization", "Bearer YOUR_TEST_TOKEN");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/🚚 Truck deleted successfully/);
  });

  test("Get deleted truck returns 404", async () => {
    const res = await request(server)
      .get(`/trucks/${encodeURIComponent(truckId)}`)
      .set("Authorization", "Bearer YOUR_TEST_TOKEN");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/🚚 Truck not found/);
  });
});
