import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 2525,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEmail = async (to: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || "noreply@example.com",
      to,
      subject: "Salam Kenal",
      text: "Hi Salam kenal",
      html: "<p>Hi Salam kenal</p>",
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};
