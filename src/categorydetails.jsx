import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "./api";
import imageMap from "./imageMap";
import Toast from "./components/Toast";
import VotePredictor from "./components/VotePredictor";

// Helper component for individual competitor cards to isolate image loading hooks
function CompetitorCard({ c, votedId, voting, handleVote }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      className="bg-gray-900/60 border border-gray-700 p-5 rounded-2xl shadow-xl hover:scale-105 transition-all flex flex-col items-center"
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
      <div className="relative w-full h-44 mb-4 rounded-lg overflow-hidden bg-white/5">
        {/* Image Placeholder Skeleton */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-white/5 animate-pulse" />
        )}
        <img
          src={imageMap[c.imageKey]}
          alt={c.name}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <h3 className="text-xl font-bold text-center">{c.name}</h3>
      {c.username && <p className="text-gray-400 mt-1">{c.username}</p>}
      <div className="text-green-400 mt-2">Votes: {c.votes}</div>
      <button
        onClick={() => handleVote(c._id)}
        disabled={voting}
        style={!votedId ? { background: "linear-gradient(135deg, #2AABEE, #229ED9)" } : {}}
        className={`mt-3 px-4 py-2 rounded-lg text-sm font-semibold transition active:scale-95 ${
          votedId
            ? String(c._id) === String(votedId)
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
  );
}

export default function CategoryDetail() {
  const { id: slug } = useParams();
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

    const catFetch = fetch(`${API_URL}/api/categories/${slug}`)
      .then(r => { if (r.status === 404) return null; if (!r.ok) throw new Error(); return r.json(); });

    const votesFetch = token
      ? fetch(`${API_URL}/api/votes/mine`, { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.ok ? r.json() : {}).catch(() => ({}))
      : Promise.resolve({});

    Promise.all([catFetch, votesFetch])
      .then(([catData, votesMap]) => {
        if (!active) return;
        if (!catData) { setStatus("notfound"); return; }
        setCategory(catData);

        const backendVote  = votesMap?.[slug] ? String(votesMap[slug]) : null;
        const localVote    = userData?.votes?.[slug] ? String(userData.votes[slug]) : null;
        const resolvedVote = backendVote || localVote || null;

        if (resolvedVote) {
          setVotedId(resolvedVote);
          if (backendVote && backendVote !== localVote) {
            const updated = { ...userData, votes: { ...(userData.votes || {}), [slug]: backendVote } };
            localStorage.setItem("user", JSON.stringify(updated));
          }
        }

        setStatus("ready");
      })
      .catch(() => active && setStatus("error"));

    return () => { active = false; };
  }, [slug]);

  // Called after user confirms in the toast
  const submitVote = async (competitorId) => {
    setVoting(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/categories/${slug}/vote`, {
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

        const updatedUser = {
          ...user,
          votes: { ...(user.votes || {}), [slug]: competitorId },
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

  // Render premium skeleton loading state
  if (status === "loading") {
    return (
      <div
        className="min-h-screen text-white p-6"
        style={{
          background: `
            radial-gradient(ellipse at 20% 0%, rgba(42,171,238,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 10%, rgba(34,158,217,0.12) 0%, transparent 50%),
            #0a0b0f
          `,
        }}
      >
        {/* Title skeleton */}
        <div className="animate-pulse mb-8 max-w-sm">
          <div className="h-10 bg-white/10 rounded-xl w-3/4 mb-3"></div>
          <div className="h-4 bg-white/5 rounded-lg w-full"></div>
        </div>

        {/* Competitor cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-gray-900/40 border border-white/5 p-5 rounded-2xl animate-pulse flex flex-col items-center"
            >
              <div className="w-full h-44 bg-white/5 rounded-lg mb-4"></div>
              <div className="h-6 bg-white/10 rounded-lg w-2/3 mb-2"></div>
              <div className="h-4 bg-white/5 rounded-lg w-1/2 mb-4"></div>
              <div className="h-4 bg-white/10 rounded-lg w-1/3 mb-4"></div>
              <div className="h-10 bg-white/10 rounded-xl w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === "notfound")
    return <p className="text-white text-center mt-10">Category not found</p>;
  if (status === "error")
    return <p className="text-white text-center mt-10">Couldn't load this category. Please refresh.</p>;

  return (
    <div
      className="min-h-screen text-white p-6 animate-fade-in-up"
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
        <VotePredictor slug={slug} votedId={votedId} onClose={() => setShowPredictor(false)} />
      )}

      <h1
        className="text-4xl font-bold mb-2"
        style={{ background: "linear-gradient(135deg, #2AABEE, #229ED9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
      >
        {category.name}
      </h1>
      <p className="text-gray-400 mb-8">{category.desc}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.competitors.map((c) => (
          <CompetitorCard
            key={c._id}
            c={c}
            votedId={votedId}
            voting={voting}
            handleVote={handleVote}
          />
        ))}
      </div>
    </div>
  );
}
