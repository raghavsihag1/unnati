import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { fullName, email, message } = req.body;

  // Simple validation
  if (!fullName || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Configure email transport (Gmail example)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER, // your Gmail
      pass: process.env.MAIL_PASS, // app password
    },
  });

  const mailOptions = {
    from: email,
    to: "rgvsihag@gmail.com",
    subject: "You've got a new submission",
    text: `
Name: ${fullName}
Email: ${email}
Message: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Email failed to send", details: error.toString() });
  }
}
