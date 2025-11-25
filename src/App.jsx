import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Category from "./category.jsx";
import Upgrade from "./Upgrade.jsx";
import Memes from "./best_meme.jsx";
import Sports from "./Sport.jsx";
import BestEducation from "./Tech.jsx";
import Entertain from "./entertainment.jsx";
import Login from "./login.jsx";
import News from './news.jsx';
import Rising from './lifestyle.jsx';
import Bot from './bot.jsx';
import Lifestyle from './lifestyle.jsx';
 import Categorydetail from './categorydetails.jsx';
import ProtectedRoute from "./protectedRoute.jsx";
import Logout from './logout.jsx';
// import Navbar from './Navbar.jsx';
export default function App() {
  return (
    <Router>
  
      <Routes>

        {/* ROOT is now protected */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        {/* ALL protected pages */}
        <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>} />
        <Route path="/category" element={<ProtectedRoute><Category /></ProtectedRoute>} />
        <Route path="/upgrade" element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />
        <Route path="/best_meme" element={<ProtectedRoute><Memes /></ProtectedRoute>} />
        <Route path="/sports" element={<ProtectedRoute><Sports /></ProtectedRoute>} />
        <Route path="/education" element={<ProtectedRoute><BestEducation /></ProtectedRoute>} />
        <Route path="/entertainment" element={<ProtectedRoute><Entertain /></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute><News/></ProtectedRoute>} />
        <Route path="/risingstar" element={<ProtectedRoute><Rising/></ProtectedRoute>} />
        <Route path="/lifestyle" element={<ProtectedRoute><Lifestyle/></ProtectedRoute>} />
        <Route path="/bot" element={<ProtectedRoute><Bot/></ProtectedRoute>} />
         <Route path="/category/:id" element={<ProtectedRoute><Categorydetail/></ProtectedRoute>} /> 

        {/* ONLY PUBLIC ROUTE */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={< Logout/>} />

      </Routes>
    </Router>
  );
}
