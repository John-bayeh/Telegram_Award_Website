import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  const isAuth =
    localStorage.getItem("authenticated") === "true" &&
    !!localStorage.getItem("token");

  if (!isAuth) {
    // Save where the user was trying to go so we can redirect back after login
    if (location.pathname !== "/login") {
      localStorage.setItem("redirectAfterLogin", location.pathname);
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}
