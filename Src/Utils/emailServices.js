import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export default async function sendEmail({ to, subject, text, attachments }) {
  try {
    await transporter.sendMail({
      from: `"PMS System" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      attachments,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
}
