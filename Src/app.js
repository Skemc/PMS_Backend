import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./Routes";
import env from "dotenv";
import morgan from "morgan";

const app = express();
env.config();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.send("🚢 Welcome to the Port Management System (PMS) Backend API");
});

app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin', '*',
    'Access-Control-Allow-Headers', 'Origin, X-Requested-With, content-type',
    'Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS'
    );
  next();
});

app.use("/api", routes);

app.use((req, res, next) => {
  const err = new Error("Page not found");
  err.status = 404;
  next(err);
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  res.status(status);
  res.json({
    status,
    error: error.message,
  });
});

export default app;
