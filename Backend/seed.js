import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";
import Vote from "./models/Vote.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/telegram_award";

// imageKey = the bundled asset the frontend should render (see src/imageMap.js).
// link is derived from the @username so cards can deep-link into Telegram.
const tg = (username) =>
  username && username.startsWith("@") ? `https://t.me/${username.slice(1)}` : "";

const categories = [
  {
    slug: "tech",
    name: "Best Tech Group",
    desc: "Award for Tech groups",
    competitors: [
      { name: "STEM with Murad", username: "@STEMwithMurad", imageKey: "stem_murad" },
      { name: "KESEM Academy", username: "@KesemAcademy", imageKey: "kesem" },
      { name: "Keleme", username: "@Keleme", imageKey: "kelem" },
      { name: "Top Students", username: "@TopStudents", imageKey: "top_students" },
      { name: "CodeProgrammer", username: "@CodeProgrammer", imageKey: "python" },
    ],
  },
  {
    slug: "sport",
    name: "Best Sport",
    desc: "Award for Sports groups",
    competitors: [
      { name: "Zena Manchester United", username: "@zena_manchester_united", imageKey: "united" },
      { name: "Zena Arsenal", username: "@zena_arsenal", imageKey: "arsenal" },
      { name: "Zena Liverpool", username: "@zena_liverpool", imageKey: "liverpool" },
      { name: "4-3-3 Sport Ethiopia™", username: "", imageKey: "433" },
      { name: "Skysport ET™", username: "", imageKey: "skysport" },
    ],
  },
  {
    slug: "lifestyle",
    name: "Best Lifestyle",
    desc: "Award for Lifestyle channels",
    competitors: [
      { name: "Третьякова Елена", username: "@tretyakovaele", imageKey: "k" },
      { name: "SG Travel+Lifestyle Hacks", username: "@youtripsg", imageKey: "sg" },
      { name: "Sahil Khan Lifestyle", username: "@sahilkhanstyle", imageKey: "khan" },
      { name: "راز جوانی", username: "@lifestyle3", imageKey: "arab" },
    ],
  },
  {
    slug: "meme",
    name: "Best Meme Group",
    desc: "Award for Meme groups",
    competitors: [
      { name: "Coding Humor", username: "@funnyvideosandmemesxplodecomedy", imageKey: "meme" },
      { name: "Memes", username: "@bestmemes", imageKey: "dark_humor" },
      { name: "Dark Humor Hub", username: "@darkjokeshere", imageKey: "coding_humor" },
    ],
  },
  {
    slug: "bot",
    name: "Best Bot",
    desc: "Award for Bots",
    competitors: [
      { name: "GPT4 Telegram Bot", username: "@GPT4Telegrambot", imageKey: "chatgpt" },
      { name: "IFTTT", username: "@IFTTT", imageKey: "ifttt" },
      { name: "Spotyy Bot", username: "@Spotyy_bot", imageKey: "spotify" },
      { name: "Trivia Bot", username: "@TriviaBot", imageKey: "Trivia" },
    ],
  },
  {
    slug: "news",
    name: "Best News Channel",
    desc: "Award for News channels",
    competitors: [
      { name: "Telemetrio", username: "@telemetrio_news", imageKey: "tel" },
      { name: "TIKVAH-ETHIOPIA", username: "@tikvahethiopia", imageKey: "tikvah" },
      { name: "Discover Tech News", username: "@perplexity", imageKey: "technews" },
    ],
  },
  {
    slug: "entertainment",
    name: "Best Entertainment",
    desc: "Award for Entertainment groups",
    competitors: [
      { name: "Entertainment One", username: "@ent1", imageKey: "animation_film" },
      { name: "Entertainment Two", username: "@ent2", imageKey: "best_music" },
      { name: "Entertainment Three", username: "@ent3", imageKey: "animation_film" },
    ],
  },
].map((cat) => ({
  ...cat,
  competitors: cat.competitors.map((c) => ({ ...c, link: tg(c.username), votes: 0 })),
}));

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Reset both collections so vote counts and ballots start clean on every reseed.
    await Category.deleteMany({});
    await Vote.deleteMany({});

    await Category.insertMany(categories);
    console.log(`🌱 Seeded ${categories.length} categories`);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
