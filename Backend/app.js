import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.js";
import categoryRoutes from "./routes/categories.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import aiRoutes from "./routes/ai.js";
import voteRoutes from "./routes/votes.js";

dotenv.config();

// Production check: Validate critical environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ CRITICAL ERROR: MONGO_URI is not defined in your environment variables!");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("❌ CRITICAL ERROR: JWT_SECRET is not defined in your environment variables!");
  process.exit(1);
}
if (process.env.MOCK_OTP !== "true") {
  if (!process.env.BREVO_API_KEY || !process.env.BREVO_EMAIL_SENDER_EMAIL) {
    console.warn("⚠️ WARNING: BREVO_API_KEY or BREVO_EMAIL_SENDER_EMAIL is not set. Real OTP emails will fail to send!");
  }
}

const app = express();

// Dynamic CORS — reads from ALLOWED_ORIGINS env var (comma-separated)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/votes", voteRoutes);

// Health check
app.get("/", (req, res) => res.json({ status: "Telegram Award API running" }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
