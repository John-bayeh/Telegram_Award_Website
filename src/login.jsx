// src/login.jsx
import React, { useState } from "react";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const validatePhone = (number) => {
    const cleaned = number.trim();
    return cleaned.length >= 7; // relaxed for dev
  };

  const sendOtp = () => {
    if (!validatePhone(phone)) {
      alert("Enter any phone number just for testing 😅");
      return;
    }

    setOtpSent(true);
    alert("Fake OTP for testing = 123456");
  };

  const verifyOtp = () => {
    if (otp === "123456") {
      alert("Login successful!");
      localStorage.setItem("authenticated", "true");
      window.location.href = "/home";
    } else {
      alert("Wrong OTP! Use 123456");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-6 w-80 rounded">
        <h2 className="text-2xl font-bold text-center mb-4">Login (Dev Mode)</h2>

        {!otpSent ? (
          <>
            <input
              type="text"
              placeholder="Enter any phone number"
              className="border w-full p-2 rounded mb-3"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              onClick={sendOtp}
              className="bg-blue-600 text-white w-full p-2 rounded"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP (123456)"
              className="border w-full p-2 rounded mb-3"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              className="bg-green-600 text-white w-full p-2 rounded"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
