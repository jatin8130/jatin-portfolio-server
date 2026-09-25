const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.get("/", (req, res) => {
  res.send("Portfolio Mail API Running...");
});

app.post("/send-mail", async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "jatinmehra8130@gmail.com",
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.7">
          <h2 style="color:#FF014F;">New Portfolio Contact</h2>

          <table cellpadding="8">
            <tr>
              <td><strong>Name</strong></td>
              <td>${name}</td>
            </tr>
            <tr>
              <td><strong>Phone</strong></td>
              <td>${phone}</td>
            </tr>
            <tr>
              <td><strong>Email</strong></td>
              <td>${email}</td>
            </tr>
            <tr>
              <td><strong>Subject</strong></td>
              <td>${subject}</td>
            </tr>
          </table>

          <h3>Message</h3>

          <p>${message.replace(/\n/g, "<br>")}</p>

          <hr>

          <small>Sent from your portfolio contact form.</small>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Email sent successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to send email.",
    });
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 8080}`);
});