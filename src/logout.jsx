import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all auth-related keys so ProtectedRoute treats the user as logged out
    localStorage.removeItem("user");
    localStorage.removeItem("authenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("redirectAfterLogin");

    // Redirect to login page
    navigate("/login", { replace: true });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <p className="text-xl">Logging out...</p>
    </div>
  );
}
