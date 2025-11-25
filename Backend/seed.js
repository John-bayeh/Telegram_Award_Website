import mongoose from "mongoose";
import Category from "./models/Category.js";

mongoose.connect("mongodb://127.0.0.1:27017/telegram_award")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const Categories = [
  { name: "Best_tech_group", desc: "This Award is for Tech_ones", img: "/images/edu.jpg" },
  { name: "Best_Sport", desc: "This Award is for sports groups", img: "/images/sp.jpg" },
  { name: "Best_Entertainment_Channels", desc: "For groups helping communities", img: "/images/11.jpeg" },
  { name: "Best_meme_group", desc: "This Award is for Memers", img: "/images/me.jpg" },
  { name: "Best Bot", desc: "This bot is for best bots which help users in polls, reminders and even games", img: "/images/bot.jpg" },
  { name: "Best News Channel", desc: "This award is for top news channels sharing updates fast and accurately", img: "/images/n.jpg" },
  { name: "Best Lifestyle", desc: "For lifestyle and fashion-focused Telegram channels", img: "/images/li.jpg" },
];

Category.insertMany(Categories)
  .then(() => {
    console.log("Seed data inserted");
    mongoose.disconnect();
  })
  .catch(err => console.log(err));
