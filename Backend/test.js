import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/telegram_award")
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
