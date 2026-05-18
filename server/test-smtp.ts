import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

console.log("HOST:", process.env.MAIL_HOST);
console.log("PORT:", process.env.MAIL_PORT);
console.log("USER:", process.env.MAIL_USER);
console.log("PASS:", process.env.MAIL_PASS ? "(set)" : "(undefined)");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 2525,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("SMTP OK - connection verified!");
    return transporter.sendMail({
      from: process.env.MAIL_FROM || "noreply@example.com",
      to: "test@test.com",
      subject: "Test Email",
      text: "This is a test",
    });
  })
  .then((info) => {
    console.log("Email sent:", info.messageId);
    process.exit(0);
  })
  .catch((err) => {
    console.error("FAILED:", err.message);
    process.exit(1);
  });
