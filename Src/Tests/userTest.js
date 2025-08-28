import request from "supertest";
import server from "../server.js"; 
import { sequelize, User } from "../models/index.js";
import TokenClass from "../Utils/tokenGenerator.js"; 

const tokenGen = new TokenClass();

describe("User API", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  let token;
  let testEmail = "erickarekezi@gmail.com";

  test("Create User - should return token", async () => {
    const res = await request(server)
      .post("/api/users") // adjust route
      .send({
        firstName: "John",
        lastName: "Doe",
        userName: "johndoe",
        email: testEmail,
        password: "password123",
        role: "admin"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.token).toBeDefined();

    token = res.body.data.token;
    console.log("Generated Token:", token);
    
  });

  test("Login - should return token", async () => {
    const res = await request(server)
      .post("/api/users/login")
      .send({
        userName: "johndoe",
        password: "password123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  test("Forgot Password - should send email link", async () => {
    const res = await request(server)
      .post("/api/users/forgot-password")
      .send({ email: testEmail });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toContain("Password reset link sent");
  });

  test("Reset Password - should update password", async () => {
    // Generate a token manually for reset
    const user = await User.findOne({ where: { email: testEmail } });
    const resetToken = tokenGen.tokenGenerator(user.toJSON());

    const res = await request(server)
      .put(`/api/users/reset-password/${testEmail}`)
      .set("Authorization", `Bearer ${resetToken}`)
      .send({
        password: "newpass123",
        confirmPassword: "newpass123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain("New Password created successfully");
  });
});
