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
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.isAdmin === true;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("redirectAfterLogin");
    navigate("/login", { replace: true });
  };

  const initialCategories = [
    { name: "Best Tech Group", desc: "This Award is for Tech groups", img: tech, route: "/category/tech" },
    { name: "Best Sport", desc: "This Award is for sports groups", img: sport, route: "/category/sport" },
    { name: "Best Entertainment", desc: "For entertainment groups", img: entartain, route: "/category/entertainment" },
    { name: "Best Meme Group", desc: "This Award is for Memers", img: meme, route: "/category/meme" },
    { name: "Best Bot", desc: "Award for bots helping users with polls, reminders and games", img: bot, route: "/category/bot" },
    { name: "Best News Channel", desc: "This award is for top news channels sharing updates fast and accurately", img: news, route: "/category/news" },
    { name: "Best Lifestyle", desc: "For lifestyle and fashion-focused Telegram channels", img: lifestyle, route: "/category/lifestyle" },
  ];

  const [categories,setCategories] = useState(initialCategories);

  const VOTING_END = new Date("2026-08-03T00:00:00");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = VOTING_END - new Date();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      } else {
        setTimeLeft({
          days:  Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          mins:  Math.floor((diff / (1000 * 60)) % 60),
          secs:  Math.floor((diff / 1000) % 60),
        });
      }
    };
    tick(); // run immediately so values show at once
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full min-h-screen flex flex-col text-gray-200"
      style={{
        background: `
          radial-gradient(ellipse at 20% 0%, rgba(42,171,238,0.18) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 10%, rgba(34,158,217,0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 100%, rgba(42,171,238,0.07) 0%, transparent 60%),
          #0a0b0f
        `,
      }}
    >

      {/* 🔥 Top Background Banner */}
      <div
        style={{ backgroundImage: `url(${backgroundimage})` }}
        className="w-full h-72 bg-cover bg-center relative"
      >
        <div className="absolute inset-0 bg-black/50 "></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1 className="text-5xl font-extrabold drop-shadow-lg">Telegram Award</h1>
          <p className="text-xl text-gray-300 mt-3">Discover | Vote | Celebrate</p>
        </div>
      </div>

      {/* 🌟 Navbar */}
      <section
        className="flex justify-between items-center backdrop-blur-lg px-8 py-4 shadow-md sticky top-0 z-50"
        style={{
          background: "linear-gradient(135deg, rgba(42,171,238,0.15), rgba(34,158,217,0.08))",
          borderBottom: "1px solid rgba(42,171,238,0.25)",
        }}
      >
        <div className="flex items-center gap-3">
          <img className="w-10 h-10 rounded-full" src={trophy} alt="Trophy" />
          <span className="font-bold text-lg" style={{ color: "#2AABEE" }}>Telegram Award</span>
        </div>

        <nav>
          <ol className="flex gap-8 text-white font-medium">
            <li className="hover:text-[#2AABEE] transition"><Link to="/home">Home</Link></li>
            <li className="hover:text-[#2AABEE] transition"><Link to="/category">Category</Link></li>
            <li className="hover:text-[#2AABEE] transition"><Link to="/upgrade">Upgrade</Link></li>
            {isAdmin && (
              <li className="hover:text-[#2AABEE] transition">
                <Link to="/admin" style={{ color: "#2AABEE", fontWeight: 700 }}>Admin</Link>
              </li>
            )}
            <li className="hover:text-[#2AABEE] transition cursor-pointer" onClick={handleLogout}>Logout</li>
          </ol>
        </nav>
      </section>

      {/* 🎬 Hero Section (Video) */}
      <section className="h-[450px] w-full relative">
        <video
          className="w-full h-full object-cover"
          src={Home_award}
          autoPlay loop muted playsInline
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h1
            className="text-4xl md:text-5xl font-bold drop-shadow-xl"
            style={{ background: "linear-gradient(135deg, #2AABEE, #229ED9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Vote For Your Favorites
          </h1>
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
              <div key={i} style={{ borderColor: "rgba(42,171,238,0.15)" }} className="bg-gray-800/50 px-6 py-4 rounded-xl shadow-lg border">
                <div className="text-4xl font-bold" style={{ color: "#2AABEE" }}>{value}</div>
                <div className="text-gray-400 text-sm">{label}</div>
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
            <div className="text-[#2AABEE] font-semibold text-lg">Voting Starts</div>
            <div className="text-xl font-bold mt-1">July 3, 2026</div>
          </div>
          <div>
            <div className="text-[#2AABEE] font-semibold text-lg">Voting Ends</div>
            <div className="text-xl font-bold mt-1">August 3, 2026</div>
          </div>
        </div>
      </section>

      {/* 🗂 Categories */}
      <section className="p-6 w-full max-w-6xl mx-auto mt-14">
        <h2
          className="text-3xl font-bold mb-10 text-center"
          style={{ background: "linear-gradient(135deg, #2AABEE, #229ED9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          Award Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((category, i) => (
            <div
              key={i}
              onClick={() => navigate(category.route)}
              className="cursor-pointer bg-gray-900/60 border border-gray-700 p-5 rounded-2xl shadow-xl hover:scale-105 transition-all"
              style={{ transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s" }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(42,171,238,0.5)";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(42,171,238,0.15)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.boxShadow = "";
              }}
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
        © 2025 Telegram Award — All Rights Reserved
      </footer>

    </div>
  );
}
