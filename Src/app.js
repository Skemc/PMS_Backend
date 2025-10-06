import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./Routes/index.js";
import env from "dotenv";
import morgan from "morgan";
import { sequelize } from "./Models/index.js"; // ✅ import sequelize

const app = express();
env.config();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: false }));

// View engine
app.set("view engine", "ejs");

// Welcome route
app.get("/", (req, res) => {
  res.send("🚢 Welcome to the Port Management System (PMS) Backend API");
});

// Headers middleware
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "*",
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods",
    "PUT, GET, POST, DELETE, OPTIONS"
  );
  next();
});

// Routes
app.use("/api", routes);

// Error handling
app.use((req, res, next) => {
  const err = new Error("Page not found");
  err.status = 404;
  next(err);
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  res.status(status).json({
    status,
    error: error.message,
  });
});

// ✅ DB Sync (initialize before server starts)
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
    await sequelize.sync({ alter: true }); // keep schema updated in dev
    console.log("✅ Models synchronized.");
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
  }
})();

export default app;
