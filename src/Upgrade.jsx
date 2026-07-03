import React, { useEffect, useState } from "react";
import './index.css';

// Example user data (replace with your auth system)
const currentUser = {
  email: "user@example.com",
  firstName: "Telegram",
  lastName: "User",
};

// Example group data (initialize as empty object to avoid errors)
const initialGroupData = {}; 

const plans = [
  {
    id: "plus",
    name: "Telegram Plus",
    price: 20,
    votes: 3,
    color: "yellow",
    description: "A boosted voting package for stronger support",
    checkout_link: "https://checkout.chapa.co/checkout/web/payment/PL-MJEciyL3V3xA",
  },
  {
    id: "premium",
    name: "Telegram Premium",
    price: 40,
    votes: 6,
    color: "green",
    description: "The ultimate voting boost with double power",
    checkout_link: "https://checkout.chapa.co/checkout/web/payment/PL-MJEciyL3V3xA",
  },
];

export default function Upgrade() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [groupData, setGroupData] = useState(initialGroupData);

  // Load Chapa checkout script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.chapa.co/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      console.log("Chapa script loaded ✅");
      setScriptLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load Chapa script ❌");
      setScriptLoaded(false);
    };

    document.body.appendChild(script);

    // Timeout fallback
    const timeout = setTimeout(() => {
      if (!window.ChapaCheckout) {
        console.warn("Chapa script is taking too long to load...");
        setScriptLoaded(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  // Safe checkInGroup function
  const checkInGroup = () => {
    // Use optional chaining or default object to avoid errors
    Object.keys(groupData || {}).forEach((key) => {
      console.log(key, groupData[key]);
      // Your existing logic here
    });
  };

  const handleClick = (plan) => {
    // If Chapa script is loaded, use inline checkout
    if (scriptLoaded && window.ChapaCheckout) {
      const tx_ref = `tx-${Date.now()}`;

      window.ChapaCheckout({
        public_key: "CHAPUBK_TEST-HcDjAS20cJ6Yxg188ZBsyuWBqD5sRwAp",
        tx_ref,
        amount: plan.price,
        currency: "ETB",
        email: currentUser.email,
        first_name: currentUser.firstName,
        last_name: currentUser.lastName,
        title: plan.name,
        description: plan.description,
        callback_url: "https://yourwebsite.com/payment-success",
        return_url: "https://yourwebsite.com/thank-you",
        customization: {
          title: plan.name,
          description: plan.description,
          logo: "https://yourwebsite.com/logo.png",
        },
      });
    } else {
      // Fallback: open direct Chapa checkout link in a new tab
      window.open(plan.checkout_link, "_blank");
    }
  };

  return (
    <div
      className="w-full min-h-screen text-white p-6"
      style={{
        background: `
          radial-gradient(ellipse at 20% 0%, rgba(42,171,238,0.18) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 10%, rgba(34,158,217,0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 100%, rgba(42,171,238,0.07) 0%, transparent 60%),
          #0a0b0f
        `,
      }}
    >
      <h1
        className="text-4xl text-center mb-10 font-bold"
        style={{ background: "linear-gradient(135deg, #2AABEE, #229ED9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
      >
        Choose Your Plan
      </h1>
      <hr style={{ borderColor: "rgba(42,171,238,0.2)" }} className="mb-10" />

      <div className="flex flex-col md:flex-row justify-center gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-gray-900/60 rounded-2xl p-6 w-full md:w-1/3 flex flex-col items-center text-center"
            style={{ border: "1px solid rgba(42,171,238,0.2)", boxShadow: "0 0 24px rgba(42,171,238,0.06)" }}
          >
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "#2AABEE" }}
            >
              {plan.name}
            </h2>
            <p className="text-gray-400 mb-4">{plan.description}</p>
            <ul className="mb-6 space-y-1 text-sm text-gray-300">
              <li className="font-bold text-2xl text-white">{plan.price} Birr</li>
              <li>{plan.votes} extra votes per category</li>
              <li>Valid for all categories</li>
            </ul>
            <button
              onClick={() => handleClick(plan)}
              className="w-full px-6 py-3 rounded-xl font-semibold text-white transition active:scale-95 shadow-lg"
              style={{ background: "linear-gradient(135deg, #2AABEE, #229ED9)", boxShadow: "0 4px 20px rgba(42,171,238,0.3)" }}
            >
              {scriptLoaded ? "Subscribe Now" : "Pay via Chapa"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
