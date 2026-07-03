import React, { useState, useEffect, useCallback } from "react";
import { API_URL } from "./api";
import imageMap from "./imageMap";
import Toast from "./components/Toast";
import VotePredictor from "./components/VotePredictor";

const SLUG = "bot";

export default function Bot() {
  const [category, setCategory] = useState(null);
  const [status, setStatus]     = useState("loading"); // loading | ready | notfound | error
  const [votedId, setVotedId]   = useState(null);
  const [voting, setVoting]     = useState(false);
  const [toast, setToast]       = useState(null);
  const [showPredictor, setShowPredictor] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const closeToast = useCallback(() => setToast(null), []);

  // Fetch category + user's existing vote in parallel
  useEffect(() => {
    let active = true;
    setStatus("loading");

    const token    = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    Promise.all([
      fetch(`${API_URL}/api/categories/${SLUG}`)
        .then(res => {
          if (res.status === 404) return null;
          if (!res.ok) throw new Error("Failed to load");
          return res.json();
        }),
      token
        ? fetch(`${API_URL}/api/votes/mine`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then(r => r.ok ? r.json() : {}).catch(() => ({}))
        : Promise.resolve({}),
    ])
      .then(([catData, votesMap]) => {
        if (!active) return;
        if (!catData) { setStatus("notfound"); return; }
        setCategory(catData);

        const backendVote  = votesMap?.[SLUG] ? String(votesMap[SLUG]) : null;
        const localVote    = userData?.votes?.[SLUG] ? String(userData.votes[SLUG]) : null;
        const resolvedVote = backendVote || localVote || null;

        if (resolvedVote) {
          setVotedId(resolvedVote);
          if (backendVote && backendVote !== localVote) {
            const updated = { ...userData, votes: { ...(userData.votes || {}), [SLUG]: backendVote } };
            localStorage.setItem("user", JSON.stringify(updated));
          }
        }

        setStatus("ready");
      })
      .catch(() => active && setStatus("error"));

    return () => { active = false; };
  }, []);

  // Called after user confirms in the toast
  const submitVote = async (competitorId) => {
    setVoting(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/categories/${SLUG}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ competitorId }),
      });
      const data = await res.json();

      if (res.ok) {
        setCategory((prev) => ({
          ...prev,
          competitors: prev.competitors.map((c) =>
            c._id === competitorId ? { ...c, votes: data.votes } : c
          ),
        }));
        setVotedId(competitorId);

        // Persist vote to localStorage so it survives a refresh
        const updatedUser = {
          ...user,
          votes: { ...(user.votes || {}), [SLUG]: competitorId },
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        const winner = category.competitors.find((c) => c._id === competitorId);
        setToast({
          type: "success",
          message: `Your vote for "${winner?.name || "your pick"}" has been recorded!`,
        });
        setTimeout(() => setShowPredictor(true), 1800);
      } else if (res.status === 409) {
        setVotedId(competitorId);
        setToast({ type: "info", message: "You already voted in this category." });
      } else {
        setToast({ type: "error", message: data.message || "Failed to submit vote. Try again." });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Network error. Check your connection and try again." });
    } finally {
      setVoting(false);
    }
  };

  // Show confirm toast before actually voting
  const handleVote = (competitorId) => {
    if (!user) {
      setToast({ type: "info", message: "You must be logged in to vote." });
      return;
    }
    if (votedId) {
      // Already voted — show toast whether they click their pick or another card
      setToast({
        type: "info",
        message: "You already voted in this category.",
        sub: "Each category allows only one vote.",
      });
      return;
    }
    if (voting) return;

    const pick = category.competitors.find((c) => c._id === competitorId);
    setToast({
      type: "confirm",
      message: `Vote for "${pick?.name}"?`,
      onConfirm: () => submitVote(competitorId),
    });
  };

  if (status === "loading")
    return <p className="text-white text-center mt-10">Loading…</p>;
  if (status === "notfound")
    return <p className="text-white text-center mt-10">Category not found</p>;
  if (status === "error")
    return <p className="text-white text-center mt-10">Couldn't load this category. Please refresh.</p>;

  return (
    <div
      className="min-h-screen text-white p-6"
      style={{
        background: `
          radial-gradient(ellipse at 20% 0%, rgba(42,171,238,0.18) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 10%, rgba(34,158,217,0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 100%, rgba(42,171,238,0.07) 0%, transparent 60%),
          #0a0b0f
        `,
      }}
    >
      <Toast toast={toast} onClose={closeToast} />
      {showPredictor && (
        <VotePredictor slug={SLUG} votedId={votedId} onClose={() => setShowPredictor(false)} />
      )}

      <h1
        className="text-4xl font-bold mb-2"
        style={{ background: "linear-gradient(135deg, #2AABEE, #229ED9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
      >
        {category.name}
      </h1>
      <p className="text-gray-400 mb-8">{category.desc}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
        {category.competitors.map((c) => (
          <div
            key={c._id}
            className="bg-gray-900/60 border border-gray-700 rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-all"
            style={{ transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s" }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "rgba(42,171,238,0.5)";
              e.currentTarget.style.boxShadow = "0 0 24px rgba(42,171,238,0.15)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <img
              src={imageMap[c.imageKey]}
              alt={c.name}
              className="w-48 h-48 object-cover rounded-xl mb-4"
            />
            <h2 className="text-xl font-semibold mb-1 text-center">{c.name}</h2>
            {c.username && (
              <a
                href={`https://t.me/${c.username.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm mb-3"
              >
                {c.username}
              </a>
            )}
            <div className="text-green-400 text-sm mb-3">Votes: {c.votes}</div>

            <button
              onClick={() => handleVote(c._id)}
              disabled={voting}
              style={!votedId ? { background: "linear-gradient(135deg, #2AABEE, #229ED9)" } : {}}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition active:scale-95 ${
                votedId
                  ? c._id === votedId
                    ? "bg-emerald-700/40 text-emerald-300 border border-emerald-600/40 cursor-default"
                    : "bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10 cursor-pointer"
                  : "text-white shadow-lg"
              }`}
            >
              {String(c._id) === String(votedId)
                ? "✅ Your vote"
                : votedId
                  ? "Already voted"
                  : voting ? "Voting…" : "Vote"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
