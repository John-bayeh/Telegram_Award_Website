import React, { useState, useEffect } from "react";
import { API_URL } from "../api";

/**
 * VotePredictor — shown after a user casts a vote.
 * Fetches xG-style win probabilities for the category.
 *
 * Props:
 *   slug     : category slug
 *   votedId  : the competitor _id the user voted for
 *   onClose  : () => void
 */
export default function VotePredictor({ slug, votedId, onClose }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/ai/predict/${slug}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return null;
  if (!data)   return null;

  const myPick = data.predictions.find(p => p._id === votedId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-md rounded-3xl text-white p-6"
        style={{ background: "#0f1014", border: "1px solid rgba(42,171,238,0.25)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>

        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-lg font-bold" style={{ color: "#2AABEE" }}>Vote Predictor</h2>
            <p className="text-xs text-gray-400 mt-0.5">{data.categoryName} · {data.totalVotes} votes cast</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none transition">✕</button>
        </div>

        {/* Your pick highlight */}
        {myPick && (
          <div className="rounded-2xl px-4 py-3 mb-4 text-sm"
            style={{ background: "rgba(42,171,238,0.1)", border: "1px solid rgba(42,171,238,0.3)" }}>
            <span className="text-gray-400">Your pick — </span>
            <span className="font-bold text-white">{myPick.name}</span>
            <span className="ml-2 font-bold" style={{ color: "#2AABEE" }}>{myPick.probability}% win probability</span>
          </div>
        )}

        {/* All competitors */}
        <div className="space-y-3">
          {data.predictions.map((p, i) => (
            <div key={p._id}>
              <div className="flex justify-between text-sm mb-1">
                <span className={p._id === votedId ? "font-bold text-white" : "text-gray-300"}>
                  {i === 0 && <span className="mr-1.5">🏆</span>}{p.name}
                </span>
                <span className="font-semibold" style={{ color: p._id === votedId ? "#2AABEE" : "#9ca3af" }}>
                  {p.probability}%
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${p.probability}%`,
                    background: p._id === votedId
                      ? "linear-gradient(135deg,#2AABEE,#229ED9)"
                      : "rgba(255,255,255,0.2)",
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{p.votes} votes</div>
            </div>
          ))}
        </div>

        {!data.aiPowered && (
          <p className="text-xs text-gray-600 mt-4 text-center">Based on current vote distribution · AI predictions coming soon</p>
        )}
        {data.aiPowered && data.aiCommentary && (
          <div className="mt-4 rounded-xl px-4 py-3 text-sm text-gray-300 italic"
            style={{ background: "rgba(42,171,238,0.07)", borderLeft: "3px solid #2AABEE" }}>
            🤖 {data.aiCommentary}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl py-2.5 text-sm font-semibold text-white transition active:scale-95"
          style={{ background: "linear-gradient(135deg,#2AABEE,#229ED9)" }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
