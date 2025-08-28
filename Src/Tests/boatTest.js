import request from "supertest";
import server from "../server.js"; 
import { sequelize } from "../db.js";
import Boat from "../Models/boat.js";
import TokenClass from "../Utils/tokenGenerator.js"; 

const tokenGen = new TokenClass();

describe("Boat API Endpoints", () => {
  beforeAll(async () => {
    // Sync and clear DB before tests
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close DB connection after tests
    await sequelize.close();
  });

  let boatId;
  let token;


  test("Create a new boat", async () => {
    const res = await request(server)
      .post("/boats")
      .set("Authorization", `Bearer ${token}`)
      .send({
        boatName: "Titanic",
        cargoOwner: "ABC Logistics",
        cargoType: "Electronics",
        captainNames: "John Doe",
        captainContacts: "+250788123456",
        fullOrEmpty: "Full",
        arrivalDate: "2025-08-10",
        arrivalTime: "08:30",
        exited: false,
        exitTime: "",
        status: "Arrived"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/🚤 Boat created successfully/);
    expect(res.body.data.boat).toHaveProperty("boat_id");
    boatId = res.body.data.boat.boat_id;
    console.log("All data:", res.body.data.boat);

  });

  test("Get all boats", async () => {
    const res = await request(server)
      .get("/boats")
      .set("Authorization", "Bearer YOUR_TEST_TOKEN");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("Get boat by ID", async () => {
    const res = await request(app)
      .get(`/boats/${encodeURIComponent(boatId)}`)
      .set("Authorization", "Bearer YOUR_TEST_TOKEN");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.boat_id).toBe(boatId);
  });

  test("Update boat (status not Exited)", async () => {
    const res = await request(server)
      .put(`/boats/${encodeURIComponent(boatId)}`)
      .set("Authorization", "Bearer YOUR_TEST_TOKEN")
      .send({
        boatName: "Titanic Updated",
        cargoOwner: "ABC Logistics Updated",
        cargoType: "Electronics",
        captainNames: "John Doe",
        captainContacts: "+250788123456",
        fullOrEmpty: "Full",
        arrivalDate: "2025-08-10",
        arrivalTime: "08:30",
        exited: false,
        exitTime: "",
        status: "In Transit"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/🚤 Boat updated successfully/);
  });

  test("Delete boat", async () => {
    const res = await request(server)
      .delete(`/boats/${encodeURIComponent(boatId)}`)
      .set("Authorization", "Bearer YOUR_TEST_TOKEN");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/🚤 Boat deleted successfully/);
  });

  test("Get deleted boat returns 404", async () => {
    const res = await request(server)
      .get(`/boats/${encodeURIComponent(boatId)}`)
      .set("Authorization", "Bearer YOUR_TEST_TOKEN");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/🚤 Boat not found/);
  });
});
