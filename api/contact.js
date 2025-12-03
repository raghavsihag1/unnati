import nodemailer from "nodemailer";

// let Vercel parse normal form bodies (urlencoded)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const fullName = req.body.fullName;
    const email = req.body.email;
    const message = req.body.message;

    if (!fullName || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: "rgvsihag@gmail.com",
      subject: "You've got a new submission",
      text: `Name: ${fullName}\nEmail: ${email}\nMessage: ${message}`,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: "Server error", details: err.toString() });
  }
}
