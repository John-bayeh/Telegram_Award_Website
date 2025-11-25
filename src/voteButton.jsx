import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VoteButton({ competitorId }) {
  const navigate = useNavigate();
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user has already voted for this competitor
  useEffect(() => {
    const voted = localStorage.getItem(`voted_${competitorId}`);
    if (voted) setHasVoted(true);
  }, [competitorId]);

  const isLoggedIn = () => localStorage.getItem("user") !== null;

  const handleVote = async () => {
    if (!isLoggedIn()) {
      alert("You must log in to vote!");
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    }

    if (hasVoted) {
      alert("You have already voted for this competitor!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/vote/${competitorId}`, {
        method: "POST",
      });

      if (res.ok) {
        localStorage.setItem(`voted_${competitorId}`, "true");
        setHasVoted(true);
        alert("Vote submitted! Thank you for voting.");
      } else {
        alert("Failed to submit vote. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting vote. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={loading || hasVoted}
      className={`mt-2 px-4 py-2 rounded-lg font-bold transition ${
        hasVoted
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-yellow-500 hover:bg-yellow-400 text-black"
      }`}
    >
      {hasVoted ? "Voted" : loading ? "Submitting..." : "Vote"}
    </button>
  );
}
