import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verifies JWT and attaches user to req.user
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { userId, email }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Must come after requireAuth — checks isAdmin flag from DB
export async function requireAdmin(req, res, next) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.dbUser = user;
    next();
  } catch {
    return res.status(500).json({ message: "Auth check failed" });
  }
}
