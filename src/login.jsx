// src/login.jsx — Email OTP authentication via Brevo
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./api";
import awardLogo from "./assets/award.png";

export default function Login() {
  const [email, setEmail]     = useState("");
  const [otp, setOtp]         = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    setError("");
    const cleaned = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
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
      setError("Network error. Please check your connection and try again.");
    } finally {
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
      className="min-h-screen flex text-white"
      style={{
        background: `
          radial-gradient(ellipse at 20% 0%, rgba(42,171,238,0.18) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 10%, rgba(34,158,217,0.12) 0%, transparent 50%),
          #0a0b0f
        `,
      }}
    >
      {/* Left sidebar — desktop only */}
      <aside className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden p-12 xl:p-16">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 30% 20%, rgba(42,171,238,0.2), transparent 55%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 80% 90%, rgba(34,158,217,0.1), transparent 50%)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />

        <div className="relative z-10 flex items-center gap-3">
          <img src={awardLogo} alt="Telegram Award" className="h-11 w-11 object-contain" style={{ filter: "drop-shadow(0 0 12px rgba(42,171,238,0.7))" }} />
          <span className="text-sm font-semibold tracking-[0.25em] uppercase" style={{ color: "#2AABEE" }}>Telegram Award</span>
        </div>

        <div className="relative z-10 max-w-md">
          <p className="font-semibold tracking-widest text-xs uppercase mb-4" style={{ color: "#2AABEE" }}>Edition 2025</p>
          <h1 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight text-white">
            Celebrate the channels that
            <span style={{ background: "linear-gradient(135deg, #54A9EB, #2AABEE, #229ED9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> shape the community.</span>
          </h1>
          <p className="text-gray-400 mt-5 text-base leading-relaxed">
            Verify your email to cast your vote and crown this year's winners across tech, sports, memes, news and more.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-gray-300">
            {["One secure vote per category", "Email verification — no passwords", "Results announced live"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full text-white text-xs" style={{ background: "rgba(42,171,238,0.2)", color: "#2AABEE" }}>✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-gray-600">© 2025 Telegram Award · Secured with Email verification</p>
      </aside>

      {/* Right — form */}
      <main className="relative flex flex-1 items-center justify-center px-5 py-10">
        <div
          className="absolute inset-0 lg:hidden"
          style={{ background: "radial-gradient(circle at top, rgba(42,171,238,0.12), transparent 60%)" }}
        />
        <div className="relative z-10 w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-8 text-center">
            <img src={awardLogo} alt="Telegram Award" className="h-16 w-16 object-contain" style={{ filter: "drop-shadow(0 0 14px rgba(42,171,238,0.7))" }} />
            <span className="mt-3 text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: "#2AABEE" }}>Telegram Award</span>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] p-8 sm:p-10">
            <div className="mb-7">
              <h2 className="text-2xl font-bold tracking-tight">{otpSent ? "Enter your code" : "Sign in to vote"}</h2>
              <p className="text-gray-400 text-sm mt-1.5">
                {otpSent
                  ? <> We sent a 6-digit code to <span style={{ color: "#2AABEE" }}>{email}</span></>
                  : "We'll email you a one-time verification code."}
              </p>
              {/* Step indicator */}
              <div className="mt-5 flex items-center gap-2">
                <span className="h-1.5 flex-1 rounded-full transition-colors" style={{ background: !otpSent ? "#2AABEE" : "rgba(42,171,238,0.3)" }} />
                <span className="h-1.5 flex-1 rounded-full transition-colors" style={{ background: otpSent ? "#2AABEE" : "rgba(255,255,255,0.1)" }} />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/40 text-red-300 text-sm px-4 py-3 rounded-xl mb-5 flex items-start gap-2">
                <span className="mt-0.5">⚠️</span><span>{error}</span>
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
      </main>
    </div>
  );
}
