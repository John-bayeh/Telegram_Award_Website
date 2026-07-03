import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Login
router.post("/google-login", async (req, res) => {
  const { credential } = req.body;

  if (!credential) return res.status(400).json({ message: "Credential required" });

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    let user = await User.findOne({ email });

    // Create user if it doesn't exist
    if (!user) {
      user = await User.create({ email, password: "GOOGLE_OAUTH" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, isAdmin: user.isAdmin || false },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({ token, email: user.email, userId: user._id, isAdmin: user.isAdmin || false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google login failed" });
  }
});

export default router;
