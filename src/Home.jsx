import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

import sport from './assets/sportchannel.jpg';
import meme from './assets/memechannel.jpg';
import active_community from './assets/activecommunitychannel.jpg';
import tech from './assets/educationchannel.jpg';
import trophy from './assets/trophy.jpg';
import entartain from './assets/11.jpeg';
import bot from './assets/bot.jpg';
import risestar from './assets/risestar.jpg';
import lifestyle from './assets/lifestyle.jpg';
import news from './assets/news.jpg';
import Home_award from './assets/home_awrd.png';
import backgroundimage from './assets/a.jpg';
import b from './assets/b.jpg';

export default function Category() {
  const navigate = useNavigate();

  const initialCategories = [
    { name: "Best_tech_group", desc: "This Award is for Tech_ones", img: tech, route: "/education" },
    { name: "Best_Sport", desc: "This Award is for sports groups", img: sport, route: "/sports" },
    { name: "Best_Entertainment_Channels", desc: "For groups helping communities", img: entartain, route: "/entertainment" },
    { name: "Best_meme_group", desc: "This Award is for Memers", img: meme, route: "/best_meme" },
    { name: "Best Bot", desc: "This bot is for best bots which help users in polls, reminders and even games", img: bot, route: "/bot" },
    { name: "Best News Channel", desc: "This award is for top news channels sharing updates fast and accurately", img: news, route: "/news" },
    { name: "Best Lifestyle", desc: "For lifestyle and fashion-focused Telegram channels", img: lifestyle, route: "/lifestyle" },
  ];

  const [categories,setCategories] = useState(initialCategories);

  const targetDate = new Date("2025-12-25T00:00:00");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, mins, secs });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="bg-black w-full min-h-screen flex flex-col text-gray-200">

      {/* 🔥 Top Background Banner */}
      <div
        style={{ backgroundImage: `url(${backgroundimage})` }}
        className="w-full h-72 bg-cover bg-center relative"
      >
        <div className="absolute inset-0 bg-black/50 "></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1 className="text-5xl font-extrabold drop-shadow-lg">Telegram Award 2025</h1>
          <p className="text-xl text-gray-300 mt-3">Discover | Vote | Celebrate</p>
        </div>
      </div>

      {/* 🌟 Navbar */}
      <section className="flex justify-between items-center bg-black/40 backdrop-blur-lg px-8 py-4 border-b border-gray-700 shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img className="w-10 h-10 rounded-full" src={trophy} alt="Trophy" />
          <span className="font-bold text-lg">Telegram Award</span>
        </div>

        <div className="flex items-center gap-8">
          <nav>
            <ol className="flex gap-8 text-white font-medium">
              <li className="hover:text-yellow-400 transition"><Link to="/home">Home</Link></li>
              <li className="hover:text-yellow-400 transition"><Link to="/category">Category</Link></li>
              <li className="hover:text-yellow-400 transition"><Link to="/upgrade">Upgrade</Link></li>
              <li className="hover:text-yellow-400 transition"><Link to="/logout">Logout</Link></li>

            </ol>
          </nav>

          <button
            onClick={() => navigate("/login")}
            className="bg-yellow-500 text-black px-5 py-2 rounded-xl font-semibold shadow hover:bg-yellow-400 transition"
          >
            Login To Vote
          </button>
        </div>
      </section>

      {/* 🎬 Hero Section (Video) */}
      <section className="h-[450px] w-full relative">
        <video
          className="w-full h-full object-cover"
          src={Home_award}
          autoPlay loop muted playsInline
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-xl">Vote For Your Favorites</h1>
          <p className="text-lg md:text-xl text-gray-300 mt-3">Celebrate top Telegram creators & communities</p>
        </div>
      </section>

      {/* ⏳ Countdown */}
      <section className="mt-12 text-center">
        <h2 className="text-3xl font-bold mb-6">Voting Countdown</h2>

        <div className="flex justify-center gap-6 text-center">
          {["Days", "Hours", "Mins", "Secs"].map((label, i) => {
            const value = [timeLeft.days, timeLeft.hours, timeLeft.mins, timeLeft.secs][i];
            return (
              <div key={i} className="bg-gray-800/70 px-6 py-4 rounded-xl shadow-lg border border-gray-600">
                <div className="text-4xl font-bold">{value}</div>
                <div className="text-yellow-400 text-sm">{label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 📅 Important Dates */}
      <section className="mt-14 border border-gray-700 p-6 rounded-xl bg-gray-900/40 backdrop-blur-md max-w-2xl mx-auto shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Important Dates</h2>
        <div className=" flex flex-col gap-6 text-left">
          <div className="">
            <div className="text-yellow-400 font-semibold text-lg">Voting Starts</div>
            <div className="text-xl font-bold mt-1">October 25, 2025</div>
          </div>
          <div>
            <div className="text-yellow-400 font-semibold text-lg">Voting Ends</div>
            <div className="text-xl font-bold mt-1">November 25, 2025</div>
          </div>
        </div>
      </section>

      {/* 🗂 Categories */}
      <section className="p-6 w-full max-w-6xl mx-auto mt-14">
        <h2 className="text-3xl font-bold mb-10 text-center ">Award Categories</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((category, i) => (
            <div
              key={i}
              onClick={() => navigate(category.route)}
              className="cursor-pointer bg-gray-900/60 border border-gray-700 p-5 rounded-2xl shadow-xl hover:shadow-yellow-500/20 hover:scale-105 transition-all"
            >
              <img
                className="w-full h-44 object-cover rounded-lg mb-4 shadow-md"
                src={category.img}
                alt={category.name}
              />
              <h3 className="text-xl font-bold">{category.name}</h3>
              <p className="text-gray-400 mt-1">{category.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-16 text-gray-500 pb-6 text-center">
        © 2025 Telegram Awards — All Rights Reserved
      </footer>

    </div>
  );
}
