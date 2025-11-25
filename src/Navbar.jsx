import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user"); // check if logged in

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("redirectAfterLogin"); // optional
    navigate("/login", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50  backdrop-blur-md flex justify-center gap-8 py-3 border-b border-gray-700">
      
      <div
        className="hover:text-yellow-400 cursor-pointer font-bold"
        onClick={() => navigate("/home")}
      >
        Home
      </div>

      <div
        className="hover:text-yellow-400 cursor-pointer font-bold"
        onClick={() => navigate("/category")}
      >
        Categories
      </div>

      <div
        className="hover:text-yellow-400 cursor-pointer font-bold"
        onClick={() => navigate("/upgrade")}
      >
        Upgrade
      </div>

      {/* Right side: Login or Logout */}
      <div className="ml-auto">
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
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
