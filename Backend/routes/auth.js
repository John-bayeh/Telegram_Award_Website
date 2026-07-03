import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Helper: send transactional email via Brevo
async function sendBrevoEmail(email, subject, htmlContent) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderName = process.env.BREVO_EMAIL_SENDER_NAME || "Telegram Award";
  const senderEmail = process.env.BREVO_EMAIL_SENDER_EMAIL;

  if (!apiKey) throw new Error("BREVO_API_KEY is not configured");
  if (!senderEmail) throw new Error("BREVO_EMAIL_SENDER_EMAIL is not configured");

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email }],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error("Brevo Email error:", err);
    throw new Error(err.message || `Brevo email failed with status ${response.status}`);
  }

  return response.json();
}

// Step 1 — send OTP via Email. Body: { email }
router.post("/send-otp", async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  try {
    await Otp.findOneAndUpdate({ email }, { code, expiresAt }, { upsert: true, new: true });

    if (process.env.MOCK_OTP === "true") {
      console.log(`[MOCK OTP] Code: 123456 → ${email}`);
      return res.json({ message: "OTP sent (Mock Mode)" });
    }

    const subject = "Your Verification Code - Telegram Award";
    const htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;">
        <h2 style="color:#22c55e;text-align:center;">Telegram Award</h2>
        <p>Hello,</p>
        <p>Use the verification code below to sign in and cast your vote:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;text-align:center;margin:30px 0;color:#111;background:#f9f9f9;padding:20px;border-radius:8px;">
          ${code}
        </div>
        <p style="color:#666;font-size:14px;">This code expires in <strong>10 minutes</strong>. If you did not request this, ignore this email.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
        <p style="color:#999;font-size:12px;text-align:center;">© 2025 Telegram Award</p>
      </div>
    `;

    await sendBrevoEmail(email, subject, htmlContent);
    console.log(`✅ OTP Email sent successfully via Brevo to ${email}`);
    res.json({ message: "OTP sent" });

  } catch (err) {
    console.error("send-otp error:", err);
    res.status(500).json({ message: "Failed to send OTP email. Please try again." });
  }
});

// Step 2 — verify OTP. Body: { email, code }
router.post("/verify-otp", async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const code = (req.body.code || "").trim();

  if (!EMAIL_REGEX.test(email) || !code) {
    return res.status(400).json({ message: "Email and code are required." });
  }

  let verified = false;

  if (process.env.MOCK_OTP === "true") {
    verified = code === "123456";
    if (!verified) return res.status(400).json({ message: "Wrong or expired code." });
  } else {
    try {
      const record = await Otp.findOne({ email, code });
      if (record && record.expiresAt > new Date()) {
        verified = true;
        await Otp.deleteOne({ _id: record._id });
      } else {
        return res.status(400).json({ message: "Wrong or expired code." });
      }
    } catch (err) {
      console.error("verify-otp error:", err);
      return res.status(500).json({ message: "Verification failed. Please try again." });
    }
  }

  if (verified) {
    try {
      let user = await User.findOne({ email });
      if (!user) user = await User.create({ email });

      const token = jwt.sign(
        { userId: user._id, email: user.email, isAdmin: user.isAdmin || false },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
      return res.json({ token, userId: user._id, email: user.email, isAdmin: user.isAdmin || false });
    } catch (err) {
      console.error("db/jwt error:", err);
      return res.status(500).json({ message: "Verification failed. Please try again." });
    }
  }
});

export default router;
