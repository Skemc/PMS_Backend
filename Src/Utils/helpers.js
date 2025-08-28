import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class Helpers {
  constructor() {
    this.options = { expiresIn: "24h" };
  }

  tokenGenerator(info) {
    try {
      this.payload = {
        names: info.names,
        email: info.email,
        user_id: info.user_id,
        id: info.id,
        role: info.role,
      };
      const secret = process.env.JWT_TOKEN;
      const token = jwt.sign(this.payload, secret, this.options);
      return token;
    } catch (err) {
      return err;
    }
  }

  async hashPassword(password) {
    try {
      this.salt = await bcrypt.genSalt(10);
      this.passHash = await bcrypt.hash(password, this.salt);
      console.log(this.passHash, "password");
      return this.passHash;
    } catch (err) {
      return err;
    }
  }

  generateResetToken(info, secret) {
    try {
      const payload = {
        email: info.email,
        id: info.id,
      };
      const token = jwt.sign(payload, secret, this.options);
      return token;
    } catch (err) {
      return err;
    }
  }
  generateUniqueId() {
    const date = new Date();
    return `${date.getTime()}`;
  }
}
export default new Helpers();
