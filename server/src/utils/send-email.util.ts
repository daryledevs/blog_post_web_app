import mailTransport from "@/config/nodemailer.config";
import * as dotenv from "dotenv";
dotenv.config();

function sendEmail(to: any, subject: any, token: any) {
  let mailDetails = {
    from: process.env.EMAIL,
    to,
    subject,
    html: `
      <p>Please click the following link to reset your password:</p>
      <a href="http://localhost:5000/api/v1/reset-password-form?token=${token}">Reset Password</a>
    `,
  };

  mailTransport.sendMail(mailDetails, function (error: any, data: any) {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Password reset email sent:", data.response);
    }
  });
};

export default sendEmail;