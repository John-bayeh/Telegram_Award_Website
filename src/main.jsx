import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { API_URL } from "./api.js";

// Keep Render free-tier alive: ping health endpoint on load + every 13 min
function pingBackend() {
  fetch(`${API_URL}/`).catch(() => {}); // silent — just wakes the server
}
pingBackend();
setInterval(pingBackend, 13 * 60 * 1000);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
