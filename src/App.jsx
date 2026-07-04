import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Category from "./category.jsx";
import Upgrade from "./Upgrade.jsx";
import Categorydetail from "./categorydetails.jsx";
import Bot from "./bot.jsx";
import Login from "./login.jsx";
import Admin from "./admin.jsx";
import ProtectedRoute from "./protectedRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";
import ChatBot from "./components/ChatBot.jsx";

// Legacy standalone pages (still reachable via old links)
import Memes from "./best_meme.jsx";
import Sports from "./Sport.jsx";
import BestEducation from "./Tech.jsx";
import Entertain from "./entertainment.jsx";
import News from "./news.jsx";
import Lifestyle from "./lifestyle.jsx";

function checkAuth() {
  return (
    localStorage.getItem("authenticated") === "true" &&
    !!localStorage.getItem("token")
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(checkAuth);

  useEffect(() => {
    const sync = () => setIsLoggedIn(checkAuth());
    window.addEventListener("storage", sync);
    // Also re-check on focus (same-tab login doesn't fire storage event)
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Root → home if logged in, login if not */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

        {/* Protected pages */}
        <Route path="/home"            element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/category"        element={<ProtectedRoute><Category /></ProtectedRoute>} />
        <Route path="/category/:id"    element={<ProtectedRoute><Categorydetail /></ProtectedRoute>} />
        <Route path="/upgrade"         element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />
        <Route path="/bot"             element={<ProtectedRoute><Bot /></ProtectedRoute>} />

        {/* Legacy standalone category pages */}
        <Route path="/best_meme"       element={<ProtectedRoute><Memes /></ProtectedRoute>} />
        <Route path="/sports"          element={<ProtectedRoute><Sports /></ProtectedRoute>} />
        <Route path="/education"       element={<ProtectedRoute><BestEducation /></ProtectedRoute>} />
        <Route path="/entertainment"   element={<ProtectedRoute><Entertain /></ProtectedRoute>} />
        <Route path="/news"            element={<ProtectedRoute><News /></ProtectedRoute>} />
        <Route path="/lifestyle"       element={<ProtectedRoute><Lifestyle /></ProtectedRoute>} />

        {/* Admin — protected by AdminRoute */}
        <Route path="/admin"           element={<AdminRoute><Admin /></AdminRoute>} />

        {/* Public */}
        <Route path="/login"           element={<Login />} />
      </Routes>

      {/* Chatbot floats on all protected pages */}
      {isLoggedIn && <ChatBot />}
    </Router>
  );
}
