const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

// Gmail Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter on server start
transporter.verify((error) => {
  if (error) {
    console.error("❌ Mail Error:", error);
  } else {
    console.log("✅ Mail Server Ready");
  }
});

app.get("/", (req, res) => {
  res.send("Portfolio Mail API Running 🚀");
});

// Contact Form API
app.post("/send-mail", async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, WhatsApp Number and Message are required.",
      });
    }

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: "jatintechsunset@gmail.com",
      subject: `New Portfolio Contact from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;background:#f5f5f5;padding:30px;">
          <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">

            <div style="background:#FF014F;color:white;padding:22px;text-align:center;">
              <h2 style="margin:0;">New Portfolio Inquiry</h2>
            </div>

            <div style="padding:25px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:12px 0;font-weight:bold;">Name</td>
                  <td style="padding:12px 0;">${name}</td>
                </tr>

                <tr>
                  <td style="padding:12px 0;font-weight:bold;">WhatsApp</td>
                  <td style="padding:12px 0;">${phone}</td>
                </tr>
              </table>

              <div style="margin-top:25px;">
                <h3 style="color:#111827;margin-bottom:10px;">Message</h3>

                <div style="background:#F9FAFB;border-left:4px solid #FF014F;padding:18px;border-radius:8px;color:#374151;">
                  ${message.replace(/\n/g, "<br>")}
                </div>
              </div>

              <div style="margin-top:30px;padding-top:18px;border-top:1px solid #E5E7EB;color:#6B7280;font-size:13px;">
                This email was sent from your portfolio contact form.
              </div>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("Mail Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message.",
    });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
