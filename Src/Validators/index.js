import joi from "joi";
import { onError, onServerError } from "../Utils/response";

class Validation {
  truckEntry(req, res, next) {
    try {
      const validateSchema = joi.object({
        plateNumber: joi.string().required(),
        cargoOwner: joi.string().required(),
        cargoType: joi.string().required(),
        driverNames: joi.string().required(),
        driverContacts: joi.string().required(),
        fullOrEmpty: joi.string().required().valid("Full", "Empty"),
        sealNumber: joi.string().optional(),
        arrivalDate: joi.date().required(),
        arrivalTime: joi
          .string()
          .required()
          .pattern(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/),
        exited: joi.boolean().required().default(false),
        exitTime: joi
          .string()
          .optional()
          .pattern(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/),
        status: joi
          .string()
          .required()
          .valid("Parked", "Pending", "Paid", "Exited")
          .default("Parked"),
      });
      const { error } = validateSchema.validate(req.body);
      if (error)
        return onError(res, 400, error.details[0].message.split('"').join(""));
      return next();
    } catch (err) {
      return onServerError(res);
    }
  }

  boatEntry(req, res, next) {
    try {
      const validateSchema = joi.object({
        boatName: joi.string().required(),
        cargoOwner: joi.string().required(),
        cargoType: joi.string().required(),
        captainNames: joi.string().required(),
        captainContacts: joi.string().required(),
        fullOrEmpty: joi.string().required().valid("Full", "Empty"),
        arrivalDate: joi.date().required(),
        arrivalTime: joi
          .string()
          .required()
          .pattern(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/),
        exited: joi.boolean().required().default(false),
        exitTime: joi
          .string()
          .optional()
          .pattern(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/),
        status: joi
          .string()
          .required()
          .valid("Parked", "Pending", "Paid", "Exited")
          .default("Parked"),
      });
      const { error } = validateSchema.validate(req.body);
      if (error)
        return onError(res, 400, error.details[0].message.split('"').join(""));
      return next();
    } catch (err) {
      return onServerError(res);
    }
  }

  invoiceEntry(req, res, next) {
    try {
      const validateSchema = joi.object({
        invoiceCode: joi.string().required(),
        entityType: joi
          .string()
          .required()
          .valid("truck", "vessel", "boat", "cargo", "storage", "facility"),
        entityId: joi.string().required(),
        clientName: joi.string().required(),
        amount: joi.number().required(),
        status: joi
          .string()
          .required()
          .valid("Parked", "Pending", "Paid", "Exited")
          .default("Parked"),
        remarks: joi.string().required(),
        dueDate: joi.date().required(),
        generatedAt: joi.date().default(new Date()),
        receiptedAt: joi.date().optional(),
      });
      const { error } = validateSchema.validate(req.body);
      if (error)
        return onError(res, 400, error.details[0].message.split('"').join(""));
      return next();
    } catch (err) {
      return onServerError(res);
    }
  }

  tariffEntry(req, res, next) {
    try {
      const validateSchema = joi.object({
        key: joi.string().required(),
        name: joi.string().required(),
        entityType: joi.string().required(),
        value: joi.number().required(),
        unit: joi.string().required(),
        effectiveFrom: joi.date().required(),
      });
      const { error } = validateSchema.validate(req.body);
      if (error)
        return onError(res, 400, error.details[0].message.split('"').join(""));
      return next();
    } catch (err) {
      return onServerError(res);
    }
  }

  createUser(req, res, next) {
    try {
      const validateSchema = joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        userName: joi.string().required(),
        password: joi.string().min(6).required(),
        email: joi.string().email().required(),
        role: joi.string().required(),
      });
      const { error } = validateSchema.validate(req.body);
      if (error)
        return onError(res, 400, error.details[0].message.split('"').join(""));
      return next();
    } catch (err) {
      return onServerError(res);
    }
  }

  emailValidator(req, res, next) {
    try {
      const validateSchema = joi.object({
        email: joi.string().email().required(),
      });
      const { error } = validateSchema.validate(req.body);
      if (error)
        return onError(res, 400, error.details[0].message.split('"').join(""));
      return next();
    } catch (err) {
      return onServerError(res);
    }
  }
}
export default new Validation();
