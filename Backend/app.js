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
import Category from "./models/Category.js";

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

// Auto-seed helper — runs once if the categories collection is empty
const tg = (username) =>
  username && username.startsWith("@") ? `https://t.me/${username.slice(1)}` : "";

const SEED_DATA = [
  {
    slug: "tech", name: "Best Tech Group", desc: "Award for Tech groups",
    competitors: [
      { name: "STEM with Murad",  username: "@STEMwithMurad",  imageKey: "stem_murad" },
      { name: "KESEM Academy",    username: "@KesemAcademy",   imageKey: "kesem" },
      { name: "Keleme",          username: "@Keleme",          imageKey: "kelem" },
      { name: "Top Students",    username: "@TopStudents",     imageKey: "top_students" },
      { name: "CodeProgrammer",  username: "@CodeProgrammer",  imageKey: "python" },
    ],
  },
  {
    slug: "sport", name: "Best Sport", desc: "Award for Sports groups",
    competitors: [
      { name: "Zena Manchester United", username: "@zena_manchester_united", imageKey: "united" },
      { name: "Zena Arsenal",           username: "@zena_arsenal",           imageKey: "arsenal" },
      { name: "Zena Liverpool",         username: "@zena_liverpool",         imageKey: "liverpool" },
      { name: "4-3-3 Sport Ethiopia™",  username: "",                        imageKey: "433" },
      { name: "Skysport ET™",           username: "",                        imageKey: "skysport" },
    ],
  },
  {
    slug: "lifestyle", name: "Best Lifestyle", desc: "Award for Lifestyle channels",
    competitors: [
      { name: "Третьякова Елена",        username: "@tretyakovaele", imageKey: "k" },
      { name: "SG Travel+Lifestyle",     username: "@youtripsg",     imageKey: "sg" },
      { name: "Sahil Khan Lifestyle",    username: "@sahilkhanstyle",imageKey: "khan" },
      { name: "راز جوانی",               username: "@lifestyle3",    imageKey: "arab" },
    ],
  },
  {
    slug: "meme", name: "Best Meme Group", desc: "Award for Meme groups",
    competitors: [
      { name: "Coding Humor",  username: "@funnyvideosandmemesxplodecomedy", imageKey: "meme" },
      { name: "Memes",        username: "@bestmemes",                        imageKey: "dark_humor" },
      { name: "Dark Humor Hub",username: "@darkjokeshere",                   imageKey: "coding_humor" },
    ],
  },
  {
    slug: "bot", name: "Best Bot", desc: "Award for Bots",
    competitors: [
      { name: "GPT4 Telegram Bot", username: "@GPT4Telegrambot", imageKey: "chatgpt" },
      { name: "IFTTT",             username: "@IFTTT",           imageKey: "ifttt" },
      { name: "Spotyy Bot",        username: "@Spotyy_bot",      imageKey: "spotify" },
      { name: "Trivia Bot",        username: "@TriviaBot",       imageKey: "Trivia" },
    ],
  },
  {
    slug: "news", name: "Best News Channel", desc: "Award for News channels",
    competitors: [
      { name: "Telemetrio",        username: "@telemetrio_news", imageKey: "tel" },
      { name: "TIKVAH-ETHIOPIA",   username: "@tikvahethiopia", imageKey: "tikvah" },
      { name: "Discover Tech News",username: "@perplexity",     imageKey: "technews" },
    ],
  },
  {
    slug: "entertainment", name: "Best Entertainment", desc: "Award for Entertainment groups",
    competitors: [
      { name: "Entertainment One",   username: "@ent1", imageKey: "animation_film" },
      { name: "Entertainment Two",   username: "@ent2", imageKey: "best_music" },
      { name: "Entertainment Three", username: "@ent3", imageKey: "animation_film" },
    ],
  },
].map((cat) => ({
  ...cat,
  competitors: cat.competitors.map((c) => ({ ...c, link: tg(c.username), votes: 0 })),
}));

async function autoSeed() {
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(SEED_DATA);
    console.log(`🌱 Auto-seeded ${SEED_DATA.length} categories`);
  } else {
    console.log(`ℹ️  Categories already seeded (${count} found), skipping.`);
  }
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    await autoSeed();
  })
  .catch((err) => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
