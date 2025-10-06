import jwt from "jsonwebtoken";
import Database from "../database";
import dotenv from "dotenv";
import { onError } from "../Utils/response";

dotenv.config();

const db = new Database();

const JWT_SECRET = process.env.JWT_SECRET; // Load from .env

const authMiddleware = {
  /**
   * ✅ Verify that the request has a valid token
   */
  verifyToken(req, res, next) {
    const token =
      req.header("x-auth-token") || req.header("authorization")?.split(" ")[1];

    if (!token) {
      return onError(res, 401, "No token provided! Please login first.");
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // contains { id, role, email, ... }
      next();
    } catch (err) {
      return onError(res, 401, "Invalid or expired token.");
    }
  },

  /**
   * ✅ Verify that the user has at least one of the required roles
   * Usage: authMiddleware.verifyRole(["admin", "finance"])
   */
  verifyRole(roles = []) {
    return (req, res, next) => {
      if (!req.user) {
        return onError(res, 403, "Access denied. User not authenticated.");
      }

      if (!roles.includes(req.user.role)) {
        return onError(
          res,
          403,
          `Access denied. Requires one of roles: ${roles.join(", ")}`
        );
      }

      next();
    };
  },

  /**
   * ✅ Verify both token & role in one go
   * Usage: authMiddleware.verifyAccess(["admin", "finance"])
   */
  verifyAccess(roles = []) {
    return (req, res, next) => {
      // First check token
      const token = req.header("x-auth-token");
      if (!token) {
        return onError(res, 401, "No token provided! Please login first.");
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        // Now check role
        if (!roles.includes(req.user.role)) {
          return onError(
            res,
            403,
            `Access denied. Requires one of roles: ${roles.join(", ")}`
          );
        }

        next();
      } catch (err) {
        return onError(res, 401, "Invalid or expired token.");
      }
    };
  },
};

export default authMiddleware;
