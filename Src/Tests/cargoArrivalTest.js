import request from "supertest";
import app from "../app.js"; // your Express app

describe("Cargo Arrival API", () => {
  it("should create a cargo arrival", async () => {
    const res = await request(app)
      .post("/api/cargo-arrivals")
      .set("x-auth-token", "valid_token_here")
      .send({
        type: "import",
        collectionType: "assorted",
        clientName: "Test Client",
        source: "vessel",
        destination: "warehouse",
        tallies: [
          {
            cargoDescription: "Rice Bags",
            quantity: 100,
            cargoType: "bags",
            weightPerItem: 50,
          },
        ],
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("arrivalNumber");
    expect(res.body.tallies.length).toBeGreaterThan(0);
  });
});
