const axios = require("axios");

const sendOtpMail = async (email, name, otp, clientIp) => {
  try {
    const html = `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif; background-color:#f7f7f7; padding:20px;">
    <tbody>
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
            <!-- Header -->
            <tr style="background-color:#ffffff; border-bottom:1px solid #eee;">
              <td align="left" style="padding:20px;">
                <img 
                  src="https://minxs-music.s3.ap-south-1.amazonaws.com/climecast-favicon.png" 
                  width="40" 
                  height="40" 
                  style="vertical-align:middle;border:none;display:inline-block;"
                >
                <span style="font-size:22px; font-weight:bold; color:#f37656; margin-left:10px; vertical-align:middle;">ClimeCast</span>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;">
                <p style="font-size:20px; font-weight:bold; color:#222;">Verify your email address</p>
                <p style="font-size:15px; color:#333; line-height:22px;">
                  Hello ${name || "User"},<br>
                  You need to verify your email address to continue using <strong>ClimeCast</strong>.
                </p>

                <p style="font-size:14px; color:#555; margin-top:10px;">
                  Enter the following code to verify your email address:
                </p>

                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                  <h1 style="color:#ffffff; letter-spacing:8px; margin:0; font-size:32px; font-weight:bold;">${otp}</h1>
                </div>

                <p style="font-size:13px; color:#777; margin-top:20px;">
                  This OTP is valid for <strong>5 minutes</strong> only.<br>
                  If you did not request this, please ignore this email.
                </p>

                <p style="font-size:12px; color:#aaa; margin-top:30px; font-style:italic;">
                  The request originated from IP address: <strong>${
                    clientIp || "Unknown"
                  }</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr style="background:#fafafa; border-top:1px solid #eee;">
              <td style="padding:15px 30px; font-size:12px; color:#999;">
                <p>Thank you,<br><strong>ClimeCast Team</strong></p>
                <a href="${
                  process.env.FRONTEND_ORIGIN
                }" style="color:#f37656; text-decoration:none;">Visit ClimeCast</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
  `;

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "ClimeCast", email: process.env.BREVO_USER },
        to: [{ email, name: name || "User" }],
        replyTo: { email: "no-reply@climecast.com" },
        subject: "Verify Your Email",
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = sendOtpMail;
