import React, { useState, useRef, useEffect } from "react";
import { API_URL } from "../api";

export default function ChatBot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hey! Ask me who's winning, how to vote, or about the categories." }
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", text: data.reply || "Sorry, something went wrong.", aiPowered: data.aiPowered }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "I'm having trouble connecting. Please check your connection and try again.", aiPowered: false }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center text-2xl transition active:scale-95"
        style={{ background: "linear-gradient(135deg, #2AABEE, #229ED9)", boxShadow: "0 4px 24px rgba(42,171,238,0.4)" }}
        aria-label="Open AI assistant"
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ background: "#0f1014", border: "1px solid rgba(42,171,238,0.25)", height: "420px" }}
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-2" style={{ background: "linear-gradient(135deg,rgba(42,171,238,0.18),rgba(34,158,217,0.08))", borderBottom: "1px solid rgba(42,171,238,0.2)" }}>
            <span className="text-lg">🤖</span>
            <div>
              <div className="text-sm font-bold text-white">Award Assistant</div>
              <div className="text-xs" style={{ color: "#2AABEE" }}>
                {messages.some(m => m.aiPowered) ? "✨ Powered by Gemini" : "Ask me anything"}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap"
                  style={m.role === "user"
                    ? { background: "linear-gradient(135deg,#2AABEE,#229ED9)", color: "#fff" }
                    : { background: "rgba(255,255,255,0.07)", color: "#e5e7eb" }
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-3 py-2 text-sm" style={{ background: "rgba(255,255,255,0.07)", color: "#9ca3af" }}>
                  Thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 flex gap-2" style={{ borderTop: "1px solid rgba(42,171,238,0.15)" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask something…"
              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none"
              onFocus={e => e.target.style.borderColor = "#2AABEE"}
              onBlur={e => e.target.style.borderColor = ""}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-white disabled:opacity-40 transition active:scale-95"
              style={{ background: "linear-gradient(135deg,#2AABEE,#229ED9)" }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
