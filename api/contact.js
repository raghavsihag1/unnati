import nodemailer from "nodemailer";

// Enable body parsing for URL-encoded form submissions
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // This ensures urlencoded form data is parsed correctly
  const fullName = req.body.fullName;
  const email = req.body.email;
  const message = req.body.message;

  if (!fullName || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Configure email transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: "rgvsihag@gmail.com",
      subject: "You've got a new submission",
      text: `Name: ${fullName}
Email: ${email}
Message: ${message}`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return res.status(500).json({ error: error.toString() });
  }
}
