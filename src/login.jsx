// src/login.jsx — Email OTP authentication via Brevo
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./api";
import awardLogo from "./assets/award.png";

export default function Login() {
  const [email, setEmail]     = useState("");
  const [otp, setOtp]         = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [slow, setSlow]       = useState(false); // true if server is taking >4s
  const slowTimer = useRef(null);
  const navigate = useNavigate();

  const sendOtp = async () => {
    setError("");
    setSlow(false);
    const cleaned = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    // Show wake-up notice if server takes more than 4 seconds (Render cold start)
    slowTimer.current = setTimeout(() => setSlow(true), 4000);
    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleaned }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.message || "Failed to send OTP. Please try again."); return; }
      setOtpSent(true);
    } catch {
      setError("The server is starting up — please wait a moment and try again.");
    } finally {
      clearTimeout(slowTimer.current);
      setSlow(false);
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError("");
    if (!otp || otp.trim().length < 6) { setError("Enter the 6-digit code sent to your email."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: otp.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.message || "Verification failed. Please try again."); return; }

      localStorage.setItem("authenticated", "true");
      localStorage.setItem("token", data.token);

      // Fetch this user's existing votes from the backend so they persist across logout/login
      let votes = {};
      try {
        const votesRes = await fetch(`${API_URL}/api/votes/mine`, {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        if (votesRes.ok) votes = await votesRes.json();
      } catch { /* non-fatal — votes will repopulate as user browses */ }

      localStorage.setItem("user", JSON.stringify({
        email: data.email,
        uid: data.userId,
        isAdmin: data.isAdmin || false,
        votes,
      }));

      // Notify App.jsx to re-check auth state (shows ChatBot immediately)
      window.dispatchEvent(new Event("authchange"));

      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/home";
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath, { replace: true });
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const spinner = (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center text-white relative px-5 py-24"
      style={{
        background: `
          radial-gradient(ellipse at 20% 0%, rgba(42,171,238,0.18) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 10%, rgba(34,158,217,0.12) 0%, transparent 50%),
          #0a0b0f
        `,
      }}
    >
      {/* Top Navbar */}
      <nav className="absolute top-0 left-0 right-0 p-6 flex justify-center z-20">
        <div onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer select-none">
          <img src={awardLogo} alt="Telegram Award" className="h-11 w-11 object-contain" style={{ filter: "drop-shadow(0 0 12px rgba(42,171,238,0.7))" }} />
          <span className="text-xl font-bold tracking-[0.2em] uppercase" style={{ color: "#2AABEE" }}>Telegram Award</span>
        </div>
      </nav>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md mt-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] p-8 sm:p-10">
          <div className="mb-7 text-center">
            <h2 className="text-2xl font-bold tracking-tight">{otpSent ? "Enter your code" : "Sign in to vote"}</h2>
            <p className="text-gray-400 text-sm mt-1.5">
              {otpSent
                ? <> We sent a 6-digit code to <span style={{ color: "#2AABEE" }}>{email}</span></>
                : "We'll email you a one-time verification code."}
            </p>
            {/* Step indicator */}
            <div className="mt-5 flex items-center gap-2 max-w-[120px] mx-auto">
              <span className="h-1.5 flex-1 rounded-full transition-colors" style={{ background: !otpSent ? "#2AABEE" : "rgba(42,171,238,0.3)" }} />
              <span className="h-1.5 flex-1 rounded-full transition-colors" style={{ background: otpSent ? "#2AABEE" : "rgba(255,255,255,0.1)" }} />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-300 text-sm px-4 py-3 rounded-xl mb-5 flex items-start gap-2">
              <span className="mt-0.5">⚠️</span><span>{error}</span>
            </div>
          )}

          {slow && !error && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm px-4 py-3 rounded-xl mb-5 flex items-start gap-2">
              <span className="mt-0.5">⏳</span>
              <span>Server is waking up — this takes ~15 seconds on first load. Please wait…</span>
            </div>
          )}

          {!otpSent ? (
            <>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
              <input
                id="email-input" type="email" placeholder="your-email@example.com"
                className="w-full rounded-xl bg-black/40 border border-white/10 p-3.5 text-white placeholder-gray-600 focus:outline-none transition"
                style={{ "--tw-ring-color": "rgba(42,171,238,0.3)" }}
                onFocus={e => { e.target.style.borderColor = "rgba(42,171,238,0.7)"; e.target.style.boxShadow = "0 0 0 2px rgba(42,171,238,0.2)"; }}
                onBlur={e => { e.target.style.borderColor = ""; e.target.style.boxShadow = ""; }}
                value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendOtp()}
              />
              <p className="text-xs text-gray-500 mt-2">Enter your email address to receive the verification code.</p>
              <button
                id="send-otp-btn" onClick={sendOtp} disabled={loading}
                className="mt-6 w-full rounded-xl font-bold p-3.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white"
                style={{ background: "linear-gradient(135deg, #2AABEE, #229ED9)", boxShadow: "0 4px 20px rgba(42,171,238,0.3)" }}
              >
                {loading ? <>{spinner} Sending code…</> : "Send verification code"}
              </button>
            </>
          ) : (
            <>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Verification Code</label>
              <input
                id="otp-input" type="text" inputMode="numeric" autoFocus placeholder="• • • • • •" maxLength={6}
                className="w-full rounded-xl bg-black/40 border border-white/10 p-3.5 text-center text-2xl font-bold tracking-[0.5em] text-white placeholder-gray-700 focus:outline-none transition"
                onFocus={e => { e.target.style.borderColor = "rgba(42,171,238,0.7)"; e.target.style.boxShadow = "0 0 0 2px rgba(42,171,238,0.2)"; }}
                onBlur={e => { e.target.style.borderColor = ""; e.target.style.boxShadow = ""; }}
                value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
              />
              <button
                id="verify-otp-btn" onClick={verifyOtp} disabled={loading || otp.length < 6}
                className="mt-6 w-full rounded-xl font-bold p-3.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white"
                style={{ background: "linear-gradient(135deg, #2AABEE, #229ED9)", boxShadow: "0 4px 20px rgba(42,171,238,0.3)" }}
              >
                {loading ? <>{spinner} Verifying…</> : "Verify & continue"}
              </button>
              <button
                onClick={() => { setOtpSent(false); setOtp(""); setError(""); }}
                className="mt-4 w-full text-sm text-gray-500 transition text-center"
                onMouseEnter={e => e.target.style.color = "#2AABEE"}
                onMouseLeave={e => e.target.style.color = ""}
              >
                ← Use a different email
              </button>
            </>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-gray-600">🔒 Protected by Email verification · Your email is never shared.</p>
      </div>
    </div>
  );
}
