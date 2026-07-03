// Base URL for the backend API. Overridden in production via VITE_API_URL
// (set in Vercel's env settings); falls back to the local dev server.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
