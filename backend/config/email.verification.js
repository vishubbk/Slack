import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// ✅ Transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // 465 = true, 587 = false
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD, // Gmail App Password
  },
});

// ✅ Function to send email
const SendEmail = async (to, subject, otp) => {
  try {
    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OTP Verification</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4ede4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table width="400" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; padding:20px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <img src="https://res.cloudinary.com/dvtl5teo7/image/upload/v1774175170/logo_rdmb0n.png" alt="Spike Logo" width="50" />
              <h2 style="margin:10px 0; color:#4A154B;">Spike</h2>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td align="center">
              <h3 style="color:#333;">Your OTP Code</h3>
              <p style="color:#666; font-size:14px;">
                Use the following OTP to verify your email address
              </p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding:20px 0;">
              <div style="display:inline-block; padding:12px 24px; font-size:24px; font-weight:bold; color:#4A154B; border:2px dashed #4A154B; border-radius:8px;">
                ${otp}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center">
              <p style="font-size:12px; color:#999;">
                This OTP is valid for 5 minutes. Do not share it with anyone.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const info = await transporter.sendMail({
      from: `"Spike OTP" <${process.env.NODEMAILER_EMAIL} >`,
      to,
      subject,
      html: htmlTemplate,
    });

    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw new Error("Email sending failed");
  }
};

export { SendEmail };
