const nodemailer = require("nodemailer");
import * as dotenv from "dotenv";
dotenv.config();

const email = process.env.EMAIL;
const password = process.env.EMAIL_PASSWORD;

const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: password,
  },
});

export default mailTransport;