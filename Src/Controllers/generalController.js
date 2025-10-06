import bcrypt from "bcrypt";
import { onServerError, onError, onSuccess } from "../Utils/response.js";
import helpers from "../Utils/helpers.js";
import generator from "generate-password";
import models from "../Models/index.js";
import { log } from "console";

const { Op } = require("sequelize");
const { User } = models;

class GeneralController {
  static async createUser(req, res) {
    try {
      const { firstName, lastName, userName, email, password, role } = req.body;
      const hashedPassword = await helpers.hashPassword(password);
      const userId = helpers.generateUniqueId();

      const newUser = await User.create({
        //user_id: userId,
        firstName,
        lastName,
        userName,
        email,
        password: hashedPassword,
        role,
      });

      const token = helpers.tokenGenerator(newUser);
      return onSuccess(res, 201, "User created successfully", { token });
    } catch (err) {
      console.error(err);
      return onServerError(res);
    }
  }

  static async login(req, res) {
    try {
      const { userName, password } = req.body;
      if (!userName || !password)
        return onError(res, 400, "Fill all required fields please");

      const user = await User.findOne({ where: { userName } });
      if (!user) return onError(res, 401, "Wrong username or password");

      const compare = await bcrypt.compare(password, user.password);
      if (!compare) return onError(res, 401, "Wrong username or password");

      const token = helpers.tokenGenerator(user);
      return onSuccess(res, 200, "Login Successfully", { token });
    } catch (err) {
      console.error("Error debug " + err.message);
      return onServerError(res);
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return onError(res, 401, "Email not found");

      const token = helpers.generateResetToken(user, user.password);

      // const url = `https://pms.rw/auth/reset-password?email=${email}&token=${token}`;

      //await SendNotification.sendEmail(user, url);
      return onSuccess(res, 201, "Password reset link sent to your email", url);
    } catch (err) {
      console.error(err);
      return onServerError(res);
    }
  }

  static async resetPassword(req, res) {
    const { password, confirmPassword } = req.body;
    if (!password || password.length < 6) {
      return onError(res, 400, "Password must be at least 6 characters long");
    }
    if (password !== confirmPassword)
      return onError(res, 400, "Password doesn't match");
    try {
      const hashedPassword = await helpers.hashPassword(password);
      const { email } = req.params;

      const updatedUser = await User.update(
        { password: hashedPassword },
        { where: { email } }
      );

      if (!updatedUser[0])
        return onError(res, 404, "User not found or password not updated");

      return onSuccess(res, 200, "New Password created successfully");
    } catch (err) {
      console.error(err);
      return onServerError(res);
    }
  }
}

export default GeneralController;
