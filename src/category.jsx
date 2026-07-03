import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sport from './assets/sportchannel.jpg';
import meme from './assets/memechannel.jpg';
import tech from './assets/educationchannel.jpg';
import entartain from './assets/11.jpeg';
import bot from './assets/bot.jpg';
import lifestyle from './assets/lifestyle.jpg';
import news from './assets/news.jpg';

export default function Category() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const isAdmin = user?.isAdmin === true;

  useEffect(() => {
    const handleStorageChange = () => setUser(JSON.parse(localStorage.getItem("user")));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const categories = [
    { name: "Best Tech Group",    desc: "Award for Tech groups",          img: tech,     route: "/category/tech" },
    { name: "Best Sport",         desc: "Award for Sports groups",         img: sport,    route: "/category/sport" },
    { name: "Best Entertainment", desc: "Award for Entertainment groups",  img: entartain,route: "/category/entertainment" },
    { name: "Best Meme Group",    desc: "Award for Meme groups",           img: meme,     route: "/category/meme" },
    { name: "Best Bot",           desc: "Award for Bots",                  img: bot,      route: "/category/bot" },
    { name: "Best News",          desc: "Award for News channels",         img: news,     route: "/category/news" },
    { name: "Best Lifestyle",     desc: "Award for Lifestyle channels",    img: lifestyle,route: "/category/lifestyle" },
  ];

  const handleCategoryClick = (route) => navigate(route);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authenticated");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: `
          radial-gradient(ellipse at 20% 0%, rgba(42,171,238,0.18) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 10%, rgba(34,158,217,0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 100%, rgba(42,171,238,0.07) 0%, transparent 60%),
          #0a0b0f
        `,
      }}
    >
      {/* Navbar */}
      <nav
        className="flex justify-between items-center backdrop-blur-lg px-8 py-4 shadow-md sticky top-0 z-50"
        style={{
          background: "linear-gradient(135deg, rgba(42,171,238,0.15), rgba(34,158,217,0.08))",
          borderBottom: "1px solid rgba(42,171,238,0.25)",
        }}
      >
        <div className="font-bold text-lg" style={{ color: "#2AABEE" }}>Telegram Award</div>
        <div className="flex items-center gap-6 font-medium">
          <div className="hover:text-[#2AABEE] cursor-pointer transition" onClick={() => navigate("/home")}>Home</div>
          <div className="hover:text-[#2AABEE] cursor-pointer transition" onClick={() => navigate("/upgrade")}>Upgrade</div>
          {isAdmin && (
            <div
              className="cursor-pointer transition font-bold"
              style={{ color: "#2AABEE" }}
              onClick={() => navigate("/admin")}
            >
              Admin
            </div>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold transition active:scale-95"
              style={{ background: "linear-gradient(135deg, #2AABEE, #229ED9)", color: "#fff" }}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold transition active:scale-95"
              style={{ background: "linear-gradient(135deg, #2AABEE, #229ED9)", color: "#fff" }}
            >
              Login To Vote
            </button>
          )}
        </div>
      </nav>

      {/* Header */}
      <div className="text-center mb-10 mt-10 px-4">
        <h1
          className="text-4xl font-bold mb-2"
          style={{ background: "linear-gradient(135deg, #2AABEE, #229ED9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          Award Categories
        </h1>
        <p className="text-gray-400">Explore the categories that honor creative excellence on Telegram.</p>
      </div>

      {/* Categories Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-16 max-w-6xl mx-auto">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => handleCategoryClick(cat.route)}
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
            <img src={cat.img} alt={cat.name} className="w-full h-44 object-cover rounded-lg mb-4" />
            <div className="text-xl font-bold">{cat.name}</div>
            <p className="text-gray-400 mt-1 text-sm">{cat.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
