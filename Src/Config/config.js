import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || 12345,
    database: process.env.DB_NAME || "PMS",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
    logging: false,
  },
  test: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME_TEST || "my_database_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  },
};
