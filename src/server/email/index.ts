import { env } from "@/env";
import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: true,
  auth: {
    user: env.SMTP_USERNAME,
    pass: env.SMTP_PASSWORD,
  },
});
