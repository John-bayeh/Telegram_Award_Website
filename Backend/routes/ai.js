import express from "express";
import Groq from "groq-sdk";
import Category from "../models/Category.js";
import Vote from "../models/Vote.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

function getGroq() {
  if (!process.env.AI_API_KEY) return null;
  return new Groq({ apiKey: process.env.AI_API_KEY });
}

async function askGroq(prompt) {
  const groq = getGroq();
  if (!groq) return null;
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
    temperature: 0.7,
  });
  return completion.choices[0]?.message?.content?.trim() || null;
}

// ─── VOTE PREDICTOR ───────────────────────────────────────────────────────────
router.get("/predict/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: "Category not found" });

    const totalVotes = category.competitors.reduce((sum, c) => sum + c.votes, 0);

    const predictions = category.competitors.map((c) => {
      const share = totalVotes > 0 ? c.votes / totalVotes : 1 / category.competitors.length;
      return {
        _id: c._id,
        name: c.name,
        votes: c.votes,
        probability: Math.round(share * 100),
        trend: c.votes > 0 ? "rising" : "neutral",
      };
    }).sort((a, b) => b.probability - a.probability);

    // Groq commentary on the race
    let aiCommentary = null;
    if (getGroq() && totalVotes > 0) {
      try {
        const prompt = `You are an enthusiastic sports analyst for the Telegram Award voting competition.
Category: "${category.name}"
Standings: ${predictions.map((p, i) => `${i + 1}. ${p.name} — ${p.votes} votes (${p.probability}%)`).join(", ")}
Write ONE punchy sentence of commentary on this race. No markdown, no emojis.`;
        aiCommentary = await askGroq(prompt);
      } catch (e) {
        console.error("Groq predictor error:", e.message);
      }
    }

    res.json({
      categoryName: category.name,
      totalVotes,
      predictions,
      aiCommentary,
      aiPowered: !!getGroq(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── AI CHATBOT ───────────────────────────────────────────────────────────────
router.post("/chat", requireAuth, async (req, res) => {
  const userMessage = (req.body.message || "").trim();
  if (!userMessage) return res.status(400).json({ message: "Message is required" });

  try {
    if (getGroq()) {
      // Build live context
      const categories = await Category.find();
      const totalVotes = await Vote.countDocuments();

      const standingsText = categories.map(cat => {
        const sorted = [...cat.competitors].sort((a, b) => b.votes - a.votes);
        return `${cat.name}: ${sorted.map((c, i) => `${i + 1}. ${c.name} (${c.votes} votes)`).join(", ")}`;
      }).join("\n");

      const systemContent = `You are a friendly AI assistant for the Telegram Award, a voting competition for the best Telegram channels and bots.

Live data:
- Total votes cast: ${totalVotes}
- Current standings:
${standingsText}

Rules:
- One vote per category per user
- Verified by email OTP
- Categories: ${categories.map(c => c.name).join(", ")}

Answer helpfully and concisely in 1-2 sentences. No markdown formatting.`;

      try {
        const groq = getGroq();
        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemContent },
            { role: "user",   content: userMessage },
          ],
          max_tokens: 150,
          temperature: 0.7,
        });
        const reply = completion.choices[0]?.message?.content?.trim();
        if (reply) return res.json({ reply, aiPowered: true });
      } catch (e) {
        console.error("Groq chat error:", e.message);
        // fall through to rule-based
      }
    }

    // ── Rule-based fallback ───────────────────────────────────────────────────
    const msg = userMessage.toLowerCase();
    let reply;

    if (msg.includes("who") && (msg.includes("winning") || msg.includes("leading"))) {
      const cats = await Category.find();
      const leaders = cats.map(cat => {
        const top = [...cat.competitors].sort((a, b) => b.votes - a.votes)[0];
        return top?.votes > 0 ? `${cat.name}: ${top.name} (${top.votes} votes)` : null;
      }).filter(Boolean);
      reply = leaders.length > 0 ? `Current leaders:\n${leaders.join("\n")}` : "No votes yet — be the first!";
    } else if (msg.includes("how") && msg.includes("vote")) {
      reply = "Go to any category, click Vote on your favourite, then confirm in the popup. One vote per category.";
    } else if (msg.includes("categor")) {
      const cats = await Category.find().select("name");
      reply = `Categories: ${cats.map(c => c.name).join(", ")}`;
    } else if (msg.includes("total") && msg.includes("vote")) {
      const total = await Vote.countDocuments();
      reply = `${total} total votes cast so far.`;
    } else if (msg.match(/^(hello|hi|hey)/)) {
      reply = "Hey! Ask me who's winning, how to vote, or about the categories.";
    } else {
      reply = "I'm focused on the Telegram Award. Ask me: 'Who is winning?', 'How do I vote?', or 'What categories are there?'";
    }

    res.json({ reply, aiPowered: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
