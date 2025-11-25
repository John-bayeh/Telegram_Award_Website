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

  useEffect(() => {
    const handleStorageChange = () => setUser(JSON.parse(localStorage.getItem("user")));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const categories = [
    { name: "Best Tech Group", desc: "Award for Tech groups", img: tech, route: "/category/tech" },
    { name: "Best Sport", desc: "Award for Sports groups", img: sport, route: "/category/sport" },
    { name: "Best Entertainment", desc: "Award for Entertainment groups", img: entartain, route: "/category/entertainment" },
    { name: "Best Meme Group", desc: "Award for Meme groups", img: meme, route: "/category/meme" },
    { name: "Best Bot", desc: "Award for Bots", img: bot, route: "/category/bot" },
    { name: "Best News", desc: "Award for News channels", img: news, route: "/category/news" },
    { name: "Best Lifestyle", desc: "Award for Lifestyle channels", img: lifestyle, route: "/category/lifestyle" },
  ];

  const handleCategoryClick = (route) => {
    if (!user) {
      alert("You must login before voting.");
      navigate("/login");
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <section className="min-h-screen bg-black text-white py-10 px-4">

      {/* Navbar */}
      <section className="flex justify-between items-center bg-black/40 px-6 py-3 border-b border-gray-700 sticky top-0 z-50">
        <div className="font-bold text-lg">Telegram Award</div>
        <div className="flex items-center gap-6">
          <div className="hover:text-yellow-400 cursor-pointer" onClick={() => navigate("/home")}>Home</div>
          <div className="hover:text-yellow-400 cursor-pointer" onClick={() => navigate("/upgrade")}>Upgrade</div>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-1 rounded-lg hover:bg-red-400 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-yellow-500 px-4 py-1 rounded-lg hover:bg-yellow-400 transition"
            >
              Login To Vote
            </button>
          )}
        </div>
      </section>

      <div className="text-center mb-10 mt-8">
        <h1 className="text-4xl font-bold mb-2">Award Categories</h1>
        <p className="text-gray-400">Explore the categories that honor creative excellence on Telegram.</p>
      </div>

      {/* Categories Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => handleCategoryClick(cat.route)}
            className="cursor-pointer bg-gray-900/60 border border-gray-700 p-5 rounded-2xl shadow-xl hover:shadow-yellow-500/20 hover:scale-105 transition-all"
          >
            <img src={cat.img} alt={cat.name} className="w-full h-44 object-cover rounded-lg mb-4" />
            <div className="text-xl font-bold">{cat.name}</div>
            <p className="text-gray-400">{cat.desc}</p>
          </div>
        ))}
      </section>
    </section>
  );
}
